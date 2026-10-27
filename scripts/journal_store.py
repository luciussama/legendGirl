#!/usr/bin/env python3
"""Armazenamento transacional do diário e transporte JSONL imutável por conteúdo."""
import base64
from contextlib import closing
import fcntl
import gzip
import hashlib
import json
import os
from pathlib import Path
import sqlite3
import tempfile

KINDS = {'fontes', 'registros', 'commits', 'pacotes', 'anexos'}
SCHEMA = '''
CREATE TABLE IF NOT EXISTS envelopes(
 tipo TEXT NOT NULL, id TEXT NOT NULL, caminho TEXT NOT NULL,
 codec TEXT NOT NULL, sha256 TEXT NOT NULL, payload BLOB NOT NULL,
 PRIMARY KEY(tipo,id));
CREATE TABLE IF NOT EXISTS fontes(
 id TEXT PRIMARY KEY, caminho TEXT, sha256 TEXT, capturado_em TEXT, origem TEXT,
 atual INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS fontes_caminho ON fontes(caminho,sha256);
CREATE TABLE IF NOT EXISTS registros(id TEXT PRIMARY KEY, sessao TEXT, tipo TEXT, data TEXT, titulo TEXT, dados TEXT);
CREATE INDEX IF NOT EXISTS registros_data ON registros(data);
CREATE TABLE IF NOT EXISTS commits_git(id TEXT PRIMARY KEY, data TEXT, titulo TEXT, fontes TEXT);
CREATE TABLE IF NOT EXISTS pacotes(id TEXT PRIMARY KEY, data TEXT, titulo TEXT, dados TEXT);
CREATE TABLE IF NOT EXISTS arquivos_arquivados(caminho TEXT, fonte TEXT, sha256 TEXT, pacote TEXT);
CREATE INDEX IF NOT EXISTS arquivos_fonte ON arquivos_arquivados(fonte);
CREATE TABLE IF NOT EXISTS segmentos(nome TEXT PRIMARY KEY, tamanho INTEGER, mtime INTEGER);
CREATE TABLE IF NOT EXISTS exportados(tipo TEXT, id TEXT, segmento TEXT NOT NULL, PRIMARY KEY(tipo,id));
CREATE TRIGGER IF NOT EXISTS envelopes_sem_update BEFORE UPDATE ON envelopes BEGIN SELECT RAISE(ABORT,'Envelope histórico imutável.'); END;
CREATE TRIGGER IF NOT EXISTS envelopes_sem_delete BEFORE DELETE ON envelopes BEGIN SELECT RAISE(ABORT,'Envelope histórico imutável.'); END;
PRAGMA user_version=2;
'''


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def decode(payload, codec):
    if codec not in {'raw', 'gzip'}:
        raise ValueError('Codec desconhecido: ' + codec)
    return gzip.decompress(payload) if codec == 'gzip' else payload


def json_bytes(data):
    return (json.dumps(data, ensure_ascii=False, indent=2) + '\n').encode()


def source_raw(data):
    return base64.b64decode(data['content'], validate=True) if data.get('encoding') == 'base64' else data['content'].encode()


def parse_source(raw):
    return json.loads(gzip.decompress(raw) if raw.startswith(b'\x1f\x8b') else raw)


class Store:
    def __init__(self, root):
        self.root = Path(root).resolve()
        self.base = self.root / 'docs/diario-ia'
        self.db = None

    def __enter__(self):
        self.base.mkdir(parents=True, exist_ok=True)
        self.lock = (self.base / '.sqlite.lock').open('a+b')
        fcntl.flock(self.lock, fcntl.LOCK_EX)
        try:
            path = self.base / 'diario.sqlite3'
            # O índice v1 não contém os envelopes completos. Conserva-o até o
            # importador concluir e publicar o armazenamento v2 atomicamente.
            old = path.exists() and path.stat().st_size > 0
            if old:
                with closing(sqlite3.connect(f'file:{path}?mode=ro', uri=True)) as check:
                    version = check.execute('PRAGMA user_version').fetchone()[0]
                if version not in (0, 2):
                    raise ValueError('Versão do diário não suportada: ' + str(version))
            else:
                version = 0
            fresh = not old or version == 0
            if fresh:
                if old and not any((self.base / 'segmentos').glob('*.jsonl.gz')) and not any((self.base / 'fontes').glob('*.json*')):
                    raise ValueError('Índice antigo sem fontes/segmentos de recuperação; migração interrompida sem sobrescrever.')
                fd, temporary = tempfile.mkstemp(prefix='diario-', suffix='.sqlite3.tmp', dir=self.base)
                os.close(fd)
                self.db = sqlite3.connect(temporary, timeout=30)
                try:
                    self.db.executescript(SCHEMA)
                    self.import_segments()
                    self.import_legacy()
                    self.db.commit()
                    self.db.close()
                    os.replace(temporary, path)
                except BaseException:
                    self.db.close()
                    Path(temporary).unlink(missing_ok=True)
                    raise
            self.db = sqlite3.connect(path, timeout=30)
            self.db.execute('PRAGMA busy_timeout=30000')
            self.db.execute('PRAGMA journal_mode=WAL')
            self.db.execute('PRAGMA synchronous=FULL')
            if 'segmento' not in {row[1] for row in self.db.execute('PRAGMA table_info(exportados)')}:
                self.db.execute('ALTER TABLE exportados ADD COLUMN segmento TEXT')
                self.db.execute('DELETE FROM exportados')
                self.db.execute('DELETE FROM segmentos')
            self.db.create_function('journal_content', 2, lambda p, c: parse_source(decode(p, c))['content'])
            self.import_segments()
            return self
        except BaseException:
            if self.db:
                self.db.close()
            fcntl.flock(self.lock, fcntl.LOCK_UN)
            self.lock.close()
            raise

    def __exit__(self, typ, value, tb):
        try:
            try:
                if typ is None:
                    self.db.commit()
                else:
                    self.db.rollback()
            finally:
                self.db.close()
        finally:
            fcntl.flock(self.lock, fcntl.LOCK_UN)
            self.lock.close()

    def put(self, kind, identity, path, raw, *, exact=True):
        if kind not in KINDS or not identity:
            raise ValueError('Envelope sem tipo/identificador válido.')
        pure = Path(path)
        if pure.is_absolute() or '..' in pure.parts or pure.as_posix() != path:
            raise ValueError('Caminho inválido no acervo: ' + path)
        sha = digest(raw)
        previous = self.db.execute('SELECT sha256,payload,codec,caminho FROM envelopes WHERE tipo=? AND id=?', (kind, identity)).fetchone()
        if previous:
            if exact and (previous[0] != sha or previous[3] != path):
                raise ValueError('Colisão de histórico, sem sobrescrita: ' + kind + '/' + identity)
            return False
        data = None
        if kind != 'anexos':
            data = json.loads(gzip.decompress(raw) if path.endswith('.gz') else raw)
            if data['id'] != identity:
                raise ValueError('Identificador divergente: ' + path)
            if kind == 'fontes' and digest(source_raw(data)) != data['sha256']:
                raise ValueError('Hash da fonte divergente: ' + path)
        packed = gzip.compress(raw, mtime=0)
        codec, payload = ('gzip', packed) if len(packed) < len(raw) else ('raw', raw)
        self.db.execute('INSERT INTO envelopes VALUES(?,?,?,?,?,?)', (kind, identity, path, codec, sha, payload))
        if kind == 'fontes':
            self.db.execute('INSERT INTO fontes VALUES(?,?,?,?,?,0)', (identity, data['path'], data['sha256'], data['capturedAt'], json.dumps(data['origin'], ensure_ascii=False)))
        elif kind == 'registros':
            self.db.execute('INSERT INTO registros VALUES(?,?,?,?,?,?)', (identity, data.get('sessionId', identity), data['type'], data['date'], data['title'], json.dumps(data, ensure_ascii=False)))
        elif kind == 'commits':
            self.db.execute('INSERT INTO commits_git VALUES(?,?,?,?)', (identity, data['date'], data['title'], json.dumps(data['sources'])))
        elif kind == 'pacotes':
            self.db.execute('INSERT INTO pacotes VALUES(?,?,?,?)', (identity, data['date'], data['title'], json.dumps(data, ensure_ascii=False)))
            self.db.executemany('INSERT INTO arquivos_arquivados VALUES(?,?,?,?)', [(f['path'], f['sourceId'], f['sha256'], identity) for f in data['files']])
        return True

    def get_bytes(self, kind, identity):
        row = self.db.execute('SELECT payload,codec,sha256 FROM envelopes WHERE tipo=? AND id=?', (kind, identity)).fetchone()
        if not row:
            raise ValueError('Objeto não encontrado no diário: ' + kind + '/' + identity)
        raw = decode(row[0], row[1])
        if digest(raw) != row[2]:
            raise ValueError('Envelope corrompido: ' + identity)
        return raw

    def get(self, kind, identity):
        raw = self.get_bytes(kind, identity)
        path = self.db.execute('SELECT caminho FROM envelopes WHERE tipo=? AND id=?', (kind, identity)).fetchone()[0]
        return json.loads(gzip.decompress(raw) if path.endswith('.gz') else raw)

    def add(self, kind, data):
        return self.put(kind, data['id'], kind + '/' + data['id'] + '.json', json_bytes(data))

    def import_legacy(self):
        for kind in sorted(KINDS - {'anexos'}):
            for path in sorted((self.base / kind).glob('*.json*')):
                if not path.name.endswith(('.json', '.json.gz')):
                    continue
                identity = path.name.removesuffix('.gz').removesuffix('.json')
                self.put(kind, identity, kind + '/' + path.name, path.read_bytes())

    def import_segments(self):
        available = sorted((self.base / 'segmentos').glob('*.jsonl.gz'))
        # Um checkout pode retirar segmentos de outra branch. Objetos sem
        # cópia disponível voltam a ficar pendentes e serão reexportados.
        names = [p.name for p in available]
        if names:
            self.db.execute('DELETE FROM segmentos WHERE nome NOT IN (' + ','.join('?' for _ in names) + ')', names)
        else:
            self.db.execute('DELETE FROM segmentos')
        self.db.execute('DELETE FROM exportados WHERE segmento NOT IN(SELECT nome FROM segmentos)')
        for path in available:
            st = path.stat()
            prev = self.db.execute('SELECT tamanho,mtime FROM segmentos WHERE nome=?', (path.name,)).fetchone()
            if prev == (st.st_size, st.st_mtime_ns):
                continue
            if digest(path.read_bytes()) + '.jsonl.gz' != path.name:
                raise ValueError('Hash do segmento inválido: ' + path.name)
            # Um segmento inválido não pode importar parcialmente seus objetos.
            self.db.execute('SAVEPOINT importar_segmento')
            try:
                with gzip.open(path, 'rt', encoding='utf-8') as stream:
                    for line in stream:
                        entry = json.loads(line)
                        if entry['version'] != 1:
                            raise ValueError('Versão de segmento não suportada.')
                        raw = base64.b64decode(entry['raw'], validate=True)
                        if digest(raw) != entry['sha256']:
                            raise ValueError('Hash de envelope inválido no segmento.')
                        self.put(entry['kind'], entry['id'], entry['path'], raw)
                        self.db.execute('INSERT OR REPLACE INTO exportados VALUES(?,?,?)', (entry['kind'], entry['id'], path.name))
                self.db.execute('INSERT OR REPLACE INTO segmentos VALUES(?,?,?)', (path.name, st.st_size, st.st_mtime_ns))
                self.db.execute('RELEASE importar_segmento')
            except BaseException:
                self.db.execute('ROLLBACK TO importar_segmento')
                self.db.execute('RELEASE importar_segmento')
                raise

    def export(self):
        """Publica deltas por hash; não reescreve segmentos já existentes."""
        directory = self.base / 'segmentos'
        directory.mkdir(exist_ok=True)
        pending = self.db.execute('''SELECT tipo,id,caminho,sha256,payload,codec FROM envelopes e
            WHERE NOT EXISTS(SELECT 1 FROM exportados x WHERE x.tipo=e.tipo AND x.id=e.id)
            ORDER BY tipo,id''')
        published = []
        # Limita o lote por bytes originais; evita arquivos acima do limite
        # comum de hospedagem Git mesmo para o acervo inicial volumoso.
        batch, size = [], 0
        def publish(entries):
            if not entries:
                return
            fd, tmp = tempfile.mkstemp(prefix='.lote-', suffix='.tmp', dir=directory)
            try:
                with os.fdopen(fd, 'wb') as out:
                    with gzip.GzipFile(fileobj=out, mode='wb', filename='', mtime=0) as zipped:
                        for entry in entries:
                            zipped.write((json.dumps(entry, separators=(',', ':'), ensure_ascii=False) + '\n').encode())
                    out.flush()
                    os.fsync(out.fileno())
                name = digest(Path(tmp).read_bytes()) + '.jsonl.gz'
                target = directory / name
                try:
                    os.link(tmp, target)
                except FileExistsError:
                    if target.read_bytes() != Path(tmp).read_bytes():
                        raise ValueError('Colisão de segmento: ' + name)
                # Publicação durável antes de marcar objetos como exportados.
                fd_dir = os.open(directory, os.O_RDONLY)
                try:
                    os.fsync(fd_dir)
                finally:
                    os.close(fd_dir)
                st = target.stat()
                self.db.execute('INSERT OR REPLACE INTO segmentos VALUES(?,?,?)', (name, st.st_size, st.st_mtime_ns))
                self.db.executemany('INSERT OR REPLACE INTO exportados VALUES(?,?,?)', [(e['kind'], e['id'], name) for e in entries])
                published.append(name)
            finally:
                Path(tmp).unlink(missing_ok=True)
        for kind, identity, path, sha, payload, codec in pending:
            raw = decode(payload, codec)
            if digest(raw) != sha:
                raise ValueError('Envelope corrompido antes da exportação: ' + identity)
            if batch and size + len(raw) > 40 * 1024 * 1024:
                publish(batch)
                batch, size = [], 0
            batch.append({'version': 1, 'kind': kind, 'id': identity, 'path': path, 'sha256': sha, 'raw': base64.b64encode(raw).decode()})
            size += len(raw)
        publish(batch)
        return published

    def verify(self):
        if self.db.execute('PRAGMA integrity_check').fetchall() != [('ok',)]:
            raise ValueError('Falha de integridade SQLite.')
        counts = {}
        for kind, identity in self.db.execute('SELECT tipo,id FROM envelopes ORDER BY tipo,id'):
            raw = self.get_bytes(kind, identity)
            if kind == 'fontes':
                data = self.get(kind, identity)
                if digest(source_raw(data)) != data['sha256']:
                    raise ValueError('Conteúdo inválido: ' + identity)
            counts[kind] = counts.get(kind, 0) + 1
        missing = self.db.execute('SELECT DISTINCT fonte FROM arquivos_arquivados WHERE fonte NOT IN(SELECT id FROM fontes)').fetchall()
        if missing:
            raise ValueError('Pacotes com fontes ausentes: ' + str(missing[:5]))
        return counts

    def stats(self):
        return {'fontesAtuais': self.db.execute('SELECT count(*) FROM fontes WHERE atual=1').fetchone()[0],
                'versoesPreservadas': self.db.execute('SELECT count(*) FROM fontes').fetchone()[0],
                'registros': self.db.execute('SELECT count(*) FROM registros').fetchone()[0],
                'commits': self.db.execute('SELECT count(*) FROM commits_git').fetchone()[0],
                'pacotes': self.db.execute('SELECT count(*) FROM pacotes').fetchone()[0],
                'pendentesExportacao': self.db.execute('SELECT count(*) FROM envelopes e WHERE NOT EXISTS(SELECT 1 FROM exportados x WHERE x.tipo=e.tipo AND x.id=e.id)').fetchone()[0]}
