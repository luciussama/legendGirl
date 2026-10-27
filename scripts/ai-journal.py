#!/usr/bin/env python3
"""Diário compartilhado: fontes e eventos imutáveis; SQLite incremental e segmentos JSONL compactados."""
import argparse
from contextlib import closing
import base64
import hashlib
import gzip
import json
import os
from pathlib import Path
import sqlite3
import subprocess
import sys
import uuid
import tempfile
import shutil
from datetime import datetime, timezone

# Também funciona quando carregado por importlib no executor temporário.
sys.path.insert(0, str(Path(__file__).resolve().parent))
from journal_store import Store, source_raw

ROOT = Path(__file__).resolve().parents[1]

def now():
    return datetime.now(timezone.utc).isoformat()

def digest(value):
    return hashlib.sha256(value).hexdigest()

def write_payload(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + '.tmp-' + uuid.uuid4().hex)
    temporary.write_bytes(payload)
    try:
        os.link(temporary, path)
    except FileExistsError:
        return False
    finally:
        temporary.unlink(missing_ok=True)
    return True

def write_new(path, data):
    return write_payload(path, (json.dumps(data, ensure_ascii=False, indent=2) + '\n').encode('utf-8'))

def source_files(base):
    return sorted(list((base / 'fontes').glob('*.json')) + list((base / 'fontes').glob('*.json.gz')))

def read_source(path):
    raw = gzip.decompress(path.read_bytes()) if path.suffix == '.gz' else path.read_bytes()
    return json.loads(raw)

def git(root, *args):
    return subprocess.check_output(['git', *args], cwd=root, stderr=subprocess.DEVNULL).decode('utf-8')

def eligible(path):
    parts = Path(path).parts
    if any(part in {'.git', 'node_modules', '.sprite-review-quarantine'} for part in parts):
        return False
    if path.startswith('docs/diario-ia/'):
        return path in {'docs/diario-ia/README.md', 'docs/diario-ia/CONTEXTO-ATUAL.md'} or path.startswith('docs/diario-ia/padroes/') and Path(path).suffix == '.md'
    suffix = Path(path).suffix.lower()
    return suffix == '.md' or (path.startswith(('docs/', 'assets/', '.agents/', '.codex/')) and suffix in {'.txt', '.json', '.log'})

def paths(root):
    try:
        output = subprocess.check_output(['rg', '--files', '--hidden', '--no-ignore', '-g', '!.git/**', '-g', '!node_modules/**', '-g', '!.sprite-review-quarantine/**', '-g', '!docs/diario-ia/fontes/**', '-g', '!docs/diario-ia/registros/**', '-g', '!docs/diario-ia/commits/**', '-g', '!docs/diario-ia/segmentos/**'], cwd=root).decode('utf-8')
        return sorted(path for path in output.splitlines() if eligible(path))
    except (FileNotFoundError, subprocess.CalledProcessError):
        collected = []
        ignored_dirs = {'.git', 'node_modules', '.sprite-review-quarantine', 'fontes', 'registros', 'commits', 'segmentos'}
        for dirpath, dirnames, filenames in os.walk(root):
            dirnames[:] = [d for d in dirnames if d not in ignored_dirs]
            rel_dir = os.path.relpath(dirpath, root)
            if any(part in ignored_dirs for part in rel_dir.split(os.sep)):
                continue
            for f in filenames:
                rel_path = f if rel_dir == '.' else os.path.join(rel_dir, f)
                if eligible(rel_path):
                    collected.append(rel_path)
        return sorted(collected)

def snapshot(root, path, raw, origin, store=None):
    if store is None:
        with Store(root) as db:
            return snapshot(root, path, raw, origin, db)
    content_hash = digest(raw)
    previous = store.db.execute('SELECT id FROM fontes WHERE caminho=? AND sha256=? ORDER BY capturado_em,id LIMIT 1', (path, content_hash)).fetchone()
    if previous:
        return previous[0]
    # Capturas independentes em clones podem ter datas/origens diferentes.
    # Identidade própria evita colisões de envelopes legítimos durante merge;
    # a deduplicação local continua sendo feita por caminho e hash do conteúdo.
    identity = digest((path + '\0' + content_hash + '\0' + uuid.uuid4().hex).encode())
    try:
        content = raw.decode('utf-8'); encoding = 'utf-8'
    except UnicodeDecodeError:
        content = base64.b64encode(raw).decode('ascii'); encoding = 'base64'
    store.add('fontes', {'schemaVersion': 1, 'id': identity, 'path': path, 'sha256': content_hash,
        'capturedAt': now(), 'origin': origin, 'encoding': encoding, 'content': content})
    return identity


def load_source(root, identity):
    with Store(root) as db:
        return db.get('fontes', identity)


def list_packages(root):
    with Store(root) as db:
        return [json.loads(row[0]) for row in db.db.execute('SELECT dados FROM pacotes ORDER BY data DESC,id DESC')]


def save_record(root, kind, data):
    with Store(root) as db:
        if not db.add(kind, data):
            raise ValueError('Registro já existente: ' + data['id'])


def import_history(root):
    with Store(root) as db:
        known = {row[0] for row in db.db.execute('SELECT id FROM commits_git')}
    for commit in reversed(git(root, 'rev-list', '--all').splitlines()):
        if commit in known:
            continue
        changed = git(root, 'diff-tree', '--root', '--no-commit-id', '--name-only', '-r', commit).splitlines()
        sources = []
        for path in changed:
            if not eligible(path):
                continue
            try:
                raw = subprocess.check_output(['git', 'show', commit + ':' + path], cwd=root, stderr=subprocess.DEVNULL)
                sources.append(snapshot(root, path, raw, {'type': 'git', 'commit': commit}))
            except (subprocess.CalledProcessError, UnicodeDecodeError):
                continue
        date, title = git(root, 'show', '-s', '--format=%cI%n%s', commit).strip().split('\n', 1)
        save_record(root, 'commits', {'schemaVersion': 1, 'id': commit, 'date': date, 'title': title, 'sources': sources})


def sync(root, history=False, export=False):
    if history:
        import_history(root)
    # O acervo é global neste checkout; as marcas de atualidade representam
    # exclusivamente os arquivos visíveis nesta sincronização, inclusive branch.
    current = {}
    with Store(root) as db:
        for path in paths(root):
            current[path] = snapshot(root, path, (root / path).read_bytes(), {'type': 'workspace'}, db)
        db.db.execute('UPDATE fontes SET atual=0 WHERE atual=1')
        db.db.executemany('UPDATE fontes SET atual=1 WHERE id=?', [(i,) for i in current.values()])
        if export:
            db.export()
        return db.stats()


def begin(root, title, actor):
    sync(root)
    identifier = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S') + '-' + uuid.uuid4().hex[:12]
    try:
        branch, head = git(root, 'branch', '--show-current').strip(), git(root, 'rev-parse', 'HEAD').strip()
        working = git(root, 'status', '--short').splitlines()
    except subprocess.CalledProcessError:
        branch, head, working = None, None, []
    record = {'schemaVersion': 1, 'id': identifier, 'sessionId': identifier, 'type': 'inicio',
              'date': now(), 'title': title, 'actor': actor, 'branch': branch, 'head': head, 'workingTree': working}
    save_record(root, 'registros', record)
    sync(root)
    return identifier

def finish(root, identifier, summary, checks, pending, files):
    with Store(root) as db:
        start = db.get('registros', identifier)
    if start['type'] != 'inicio':
        raise ValueError('O identificador precisa corresponder ao início de uma sessão.')
    record = {'schemaVersion': 1, 'id': identifier + '-fim', 'sessionId': identifier, 'type': 'fim',
              'date': now(), 'title': start['title'], 'actor': start['actor'], 'summary': summary,
              'checks': checks, 'pending': pending, 'files': files}
    save_record(root, 'registros', record)
    return sync(root, export=True)

def read(root):
    stats = sync(root)
    context = root / 'docs/diario-ia/CONTEXTO-ATUAL.md'
    print(context.read_text() if context.exists() else 'Contexto atual ainda não registrado.')
    print('\nAcervo:', json.dumps(stats, ensure_ascii=False))
    with Store(root) as storage:
        db = storage.db
        print('\nRegistros recentes:')
        for row in db.execute('SELECT data,tipo,titulo,sessao FROM registros ORDER BY data DESC LIMIT 8'):
            print(' | '.join(row))
        print('\nSessões sem encerramento:')
        for row in db.execute("SELECT sessao,titulo FROM registros WHERE tipo='inicio' AND sessao NOT IN(SELECT sessao FROM registros WHERE tipo='fim')"):
            print(' | '.join(row))


def archive_artifacts(root, files, title, qa_commands=None):
    identifier = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S') + '-' + uuid.uuid4().hex[:12]
    entries = []
    for file in files:
        path = (root / file).resolve()
        if not path.is_relative_to(root.resolve()) or path.is_symlink():
            raise ValueError('Alvo fora do projeto ou ligação simbólica: ' + file)
        raw = path.read_bytes()
        # Imagens de evidência são lixo regenerável: preserva identificação, hash e tamanho, não o bitmap.
        metadata_only = path.suffix.lower() in {'.png','.jpg','.jpeg','.webp','.gif','.avif','.pdf','.zip'} and not file.startswith('tests/')
        if metadata_only:
            metadata = {'path':file,'sha256':digest(raw),'bytes':len(raw),'type':'evidencia-regeneravel','binaryRetained':False}
            source_id = snapshot(root,file,json.dumps(metadata,ensure_ascii=False).encode(),{'type':'registro-de-evidencia'})
        else:
            source_id = snapshot(root,file,raw,{'type':'qa-arquivado'})
        entries.append({'path':file,'sourceId':source_id,'sha256':digest(raw),'bytes':len(raw),'metadataOnly':metadata_only})
    package = {'schemaVersion':1,'id':identifier,'date':now(),'title':title,'files':entries,'qaCommands':qa_commands or {}}
    save_record(root, 'pacotes', package)
    sync(root)
    return package


def extract_file(db, path, output, identity=None):
    if output.exists():
        raise ValueError('Extração não sobrescreve arquivo existente.')
    relative = path.removeprefix('docs/diario-ia/')
    rows = db.db.execute("SELECT id FROM envelopes WHERE tipo='anexos' AND caminho=?", (relative,)).fetchall()
    if identity:
        rows = [r for r in rows if r[0] == identity]
        if not rows:
            raise ValueError('Versão de anexo não encontrada: ' + identity)
    if len(rows) > 1:
        raise ValueError('Anexo com várias versões; selecione --id: ' + ', '.join(r[0] for r in rows))
    if rows:
        raw = db.get_bytes('anexos', rows[0][0])
    else:
        row = db.db.execute('SELECT id FROM fontes WHERE caminho=? ORDER BY capturado_em DESC,id DESC LIMIT 1', (path,)).fetchone()
        if not row:
            raise ValueError('Caminho não encontrado no acervo: ' + path)
        raw = source_raw(db.get('fontes', row[0]))
    output.parent.mkdir(parents=True, exist_ok=True)
    if not write_payload(output, raw):
        raise ValueError('Destino de extração já existe.')


def migrate(root, db, prune=False):
    """Consolida e verifica restauração independente antes de retirar cópias."""
    db.import_legacy()
    base = root / 'docs/diario-ia'
    removable = []
    manifest = []
    for path in sorted(base.rglob('*')):
        if not path.is_file():
            continue
        rel = path.relative_to(base)
        if rel.parts[0] in {'segmentos', 'padroes'} or len(rel.parts) == 1:
            continue
        if path.is_symlink():
            raise ValueError('Ligação simbólica não migrada: ' + str(rel))
        raw = path.read_bytes()
        if rel.parts[0] in {'fontes', 'registros', 'commits', 'pacotes'}:
            if not path.name.endswith(('.json', '.json.gz')):
                raise ValueError('Arquivo inesperado no histórico: ' + str(rel))
            kind = rel.parts[0]
            identity = path.name.removesuffix('.gz').removesuffix('.json')
        else:
            kind = 'anexos'
            identity = digest((rel.as_posix() + '\0' + digest(raw)).encode())
            db.put(kind, identity, rel.as_posix(), raw)
            if path.suffix in {'.md', '.json', '.txt', '.log', '.py', '.js', '.mjs', '.cjs', '.html', '.css'}:
                snapshot(root, path.relative_to(root).as_posix(), raw, {'type': 'migracao-anexo'}, db)
        if db.get_bytes(kind, identity) != raw:
            raise ValueError('Cópia diverge do envelope: ' + str(rel))
        removable.append((path, kind, identity, digest(raw)))
        manifest.append({'path': path.relative_to(root).as_posix(), 'tipo': kind, 'id': identity, 'sha256': digest(raw), 'bytes': len(raw)})
    snapshot(root, 'docs/diario-ia/migracao/manifesto.json',
             json.dumps(manifest, ensure_ascii=False, sort_keys=True).encode(), {'type': 'migracao-verificada'}, db)
    counts = db.verify()
    db.export()
    db.db.commit()
    with tempfile.TemporaryDirectory(prefix='legendgirl-restauracao-') as directory:
        isolated = Path(directory)
        target = isolated / 'docs/diario-ia/segmentos'
        shutil.copytree(base / 'segmentos', target)
        with Store(isolated) as restored:
            if restored.verify() != counts:
                raise ValueError('Contagem divergente após restauração isolada.')
            original = db.db.execute('SELECT tipo,id,caminho,sha256 FROM envelopes ORDER BY tipo,id').fetchall()
            recovered = restored.db.execute('SELECT tipo,id,caminho,sha256 FROM envelopes ORDER BY tipo,id').fetchall()
            if original != recovered:
                raise ValueError('Envelopes divergentes após restauração isolada.')
            for path, kind, identity, sha in removable:
                if digest(path.read_bytes()) != sha or restored.get_bytes(kind, identity) != path.read_bytes():
                    raise ValueError('Arquivo alterado durante migração: ' + str(path))
    if prune:
        for path, kind, identity, sha in removable:
            if digest(path.read_bytes()) != sha:
                raise ValueError('Arquivo alterado antes da retirada: ' + str(path))
            path.unlink()
        for path in sorted(base.rglob('*'), key=lambda p: len(p.parts), reverse=True):
            if path.is_dir() and not any(path.iterdir()):
                path.rmdir()
    return {'envelopes': counts, 'copiasVerificadas': len(removable),
            'copiasRetiradas': len(removable) if prune else 0,
            'restauracaoIsolada': 'aprovada'}

def main():
    parser = argparse.ArgumentParser(description='Diário de IA compartilhado e pesquisável.')
    parser.add_argument('--root', type=Path, default=ROOT)
    sub = parser.add_subparsers(dest='command', required=True)
    sync_parser = sub.add_parser('sync'); sync_parser.add_argument('--history', action='store_true')
    sub.add_parser('read')
    archive = sub.add_parser('archive'); archive.add_argument('--manifest',type=Path,required=True); archive.add_argument('--title',required=True)
    show = sub.add_parser('show'); show.add_argument('id'); show.add_argument('--kind', choices=['fontes','registros','pacotes','commits'], default='fontes')
    sub.add_parser('verify')
    sub.add_parser('export')
    migration = sub.add_parser('migrate'); migration.add_argument('--prune', action='store_true')
    extract = sub.add_parser('extract'); extract.add_argument('path'); extract.add_argument('--output', type=Path, required=True); extract.add_argument('--id')
    backup = sub.add_parser('backup'); backup.add_argument('--output', type=Path, required=True)
    search = sub.add_parser('search'); search.add_argument('query'); search.add_argument('--all-versions', action='store_true')
    start = sub.add_parser('begin'); start.add_argument('--title', required=True); start.add_argument('--actor', required=True)
    end = sub.add_parser('finish'); end.add_argument('--id', required=True); end.add_argument('--summary', required=True)
    for field in ['check', 'pending', 'file']:
        end.add_argument('--' + field, action='append', default=[])
    args = parser.parse_args(); root = args.root.resolve()
    if args.command == 'sync':
        print(json.dumps(sync(root, args.history, export=True), ensure_ascii=False))
    elif args.command == 'archive':
        files = json.loads(args.manifest.read_text())
        if not isinstance(files,list) or not all(isinstance(file,str) for file in files):
            raise ValueError('O manifesto precisa ser uma lista de caminhos relativos.')
        package = archive_artifacts(root,files,args.title)
        print(json.dumps({'package':package['id'],'files':len(package['files'])},ensure_ascii=False))
    elif args.command == 'read':
        read(root)
    elif args.command == 'show':
        with Store(root) as db:
            print(json.dumps(db.get(args.kind, args.id), ensure_ascii=False, indent=2))
    elif args.command == 'begin':
        print(begin(root, args.title, args.actor))
    elif args.command == 'finish':
        print(json.dumps(finish(root, args.id, args.summary, args.check, args.pending, args.file), ensure_ascii=False))
    elif args.command in {'verify', 'export', 'migrate', 'extract', 'backup'}:
        with Store(root) as db:
            if args.command == 'verify':
                print(json.dumps(db.verify(), ensure_ascii=False))
            elif args.command == 'export':
                print(json.dumps(db.export(), ensure_ascii=False))
            elif args.command == 'migrate':
                print(json.dumps(migrate(root, db, args.prune), ensure_ascii=False))
            elif args.command == 'extract':
                extract_file(db, args.path, args.output, args.id)
                print('Arquivo recuperado: ' + str(args.output))
            else:
                target = args.output.resolve()
                if target.exists():
                    raise ValueError('Backup não sobrescreve destino existente.')
                # Encerra a transação de importação antes da Backup API.
                db.db.commit()
                with closing(sqlite3.connect(target)) as destination:
                    db.db.backup(destination)
                print('Backup consistente criado: ' + str(target))
    else:
        sync(root)
        with Store(root) as storage:
            db = storage.db
            query = args.query.replace('\\', '\\\\').replace('%', '\\%').replace('_', '\\_')
            sql = """SELECT f.caminho,f.id,atual FROM fontes f JOIN envelopes e ON e.tipo='fontes' AND e.id=f.id
              WHERE (f.caminho LIKE ? ESCAPE '\\' OR journal_content(payload,codec) LIKE ? ESCAPE '\\')"""
            if not args.all_versions:
                sql += ' AND (atual=1 OR f.id IN(SELECT fonte FROM arquivos_arquivados))'
            for path, identity, current in db.execute(sql + ' ORDER BY f.caminho LIMIT 30', ('%' + query + '%','%' + query + '%')):
                print(('ATUAL' if current else 'HISTÓRICO') + ' | ' + path + ' | ' + identity)

if __name__ == '__main__':
    try:
        main()
    except (OSError, ValueError, sqlite3.Error, subprocess.CalledProcessError) as error:
        print('Falha no diário: ' + str(error), file=sys.stderr)
        sys.exit(1)
