#!/usr/bin/env python3
"""Diário compartilhado: fontes e eventos imutáveis; SQLite como índice reconstruível."""
import argparse
import hashlib
import gzip
import json
import os
from pathlib import Path
import sqlite3
import subprocess
import sys
import uuid
from datetime import datetime, timezone

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
        return path in {'docs/diario-ia/README.md', 'docs/diario-ia/CONTEXTO-ATUAL.md'}
    suffix = Path(path).suffix.lower()
    return suffix == '.md' or (path.startswith(('docs/', 'assets/', '.agents/', '.codex/')) and suffix in {'.txt', '.json', '.log'})

def paths(root):
    output = subprocess.check_output(['rg', '--files', '--hidden', '--no-ignore', '-g', '!.git/**', '-g', '!node_modules/**', '-g', '!.sprite-review-quarantine/**', '-g', '!docs/diario-ia/fontes/**', '-g', '!docs/diario-ia/registros/**', '-g', '!docs/diario-ia/commits/**'], cwd=root).decode('utf-8')
    return sorted(path for path in output.splitlines() if eligible(path))

def snapshot(root, path, raw, origin):
    content = raw.decode('utf-8')
    content_hash = digest(raw)
    identity = digest((path + '\0' + content_hash).encode())
    data = {'schemaVersion': 1, 'id': identity, 'path': path, 'sha256': content_hash,
            'capturedAt': now(), 'origin': origin, 'content': content}
    payload = (json.dumps(data, ensure_ascii=False, indent=2) + '\n').encode('utf-8')
    compressed = len(payload) > 131072
    suffix = '.json.gz' if compressed else '.json'
    write_payload(root / 'docs/diario-ia/fontes' / (identity + suffix), gzip.compress(payload, mtime=0) if compressed else payload)
    return identity

def import_history(root):
    directory = root / 'docs/diario-ia/commits'
    for commit in reversed(git(root, 'rev-list', '--all').splitlines()):
        target = directory / (commit + '.json')
        if target.exists():
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
        write_new(target, {'schemaVersion': 1, 'id': commit, 'date': date, 'title': title, 'sources': sources})

def sync(root, history=False):
    base = root / 'docs/diario-ia'
    base.mkdir(parents=True, exist_ok=True)
    if history:
        import_history(root)
    current = {}
    for path in paths(root):
        try:
            current[path] = snapshot(root, path, (root / path).read_bytes(), {'type': 'workspace'})
        except UnicodeDecodeError:
            continue
    sources = [read_source(path) for path in source_files(base)]
    records = [json.loads(path.read_text()) for path in sorted((base / 'registros').glob('*.json'))]
    commits = [json.loads(path.read_text()) for path in sorted((base / 'commits').glob('*.json'))]
    temporary = base / ('diario-' + uuid.uuid4().hex + '.sqlite3.tmp')
    with sqlite3.connect(temporary) as db:
        db.executescript('''
          CREATE TABLE fontes(id TEXT PRIMARY KEY, caminho TEXT, sha256 TEXT, capturado_em TEXT, origem TEXT, conteudo TEXT, atual INTEGER);
          CREATE INDEX fontes_caminho ON fontes(caminho);
          CREATE TABLE registros(id TEXT PRIMARY KEY, sessao TEXT, tipo TEXT, data TEXT, titulo TEXT, dados TEXT);
          CREATE TABLE commits_git(id TEXT PRIMARY KEY, data TEXT, titulo TEXT, fontes TEXT);
        ''')
        db.executemany('INSERT INTO fontes VALUES(?,?,?,?,?,?,?)', [(s['id'], s['path'], s['sha256'], s['capturedAt'], json.dumps(s['origin']), s['content'], int(current.get(s['path']) == s['id'])) for s in sources])
        db.executemany('INSERT INTO registros VALUES(?,?,?,?,?,?)', [(r['id'], r.get('sessionId', r['id']), r['type'], r['date'], r['title'], json.dumps(r, ensure_ascii=False)) for r in records])
        db.executemany('INSERT INTO commits_git VALUES(?,?,?,?)', [(c['id'], c['date'], c['title'], json.dumps(c['sources'])) for c in commits])
    os.replace(temporary, base / 'diario.sqlite3')
    return {'fontesAtuais': len(current), 'versoesPreservadas': len(sources), 'registros': len(records), 'commits': len(commits)}

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
    write_new(root / 'docs/diario-ia/registros' / (identifier + '.json'), record)
    sync(root)
    return identifier

def finish(root, identifier, summary, checks, pending, files):
    base = root / 'docs/diario-ia/registros'
    start = json.loads((base / (identifier + '.json')).read_text())
    if start['type'] != 'inicio':
        raise ValueError('O identificador precisa corresponder ao início de uma sessão.')
    record = {'schemaVersion': 1, 'id': identifier + '-fim', 'sessionId': identifier, 'type': 'fim',
              'date': now(), 'title': start['title'], 'actor': start['actor'], 'summary': summary,
              'checks': checks, 'pending': pending, 'files': files}
    if not write_new(base / (identifier + '-fim.json'), record):
        raise ValueError('A sessão já possui encerramento; nenhum registro foi sobrescrito.')
    return sync(root)

def read(root):
    stats = sync(root)
    context = root / 'docs/diario-ia/CONTEXTO-ATUAL.md'
    print(context.read_text() if context.exists() else 'Contexto atual ainda não registrado.')
    print('\nAcervo:', json.dumps(stats, ensure_ascii=False))
    with sqlite3.connect(root / 'docs/diario-ia/diario.sqlite3') as db:
        print('\nRegistros recentes:')
        for row in db.execute('SELECT data,tipo,titulo,sessao FROM registros ORDER BY data DESC LIMIT 8'):
            print(' | '.join(row))
        print('\nSessões sem encerramento:')
        for row in db.execute("SELECT sessao,titulo FROM registros WHERE tipo='inicio' AND sessao NOT IN(SELECT sessao FROM registros WHERE tipo='fim')"):
            print(' | '.join(row))

def main():
    parser = argparse.ArgumentParser(description='Diário de IA compartilhado e pesquisável.')
    parser.add_argument('--root', type=Path, default=ROOT)
    sub = parser.add_subparsers(dest='command', required=True)
    sync_parser = sub.add_parser('sync'); sync_parser.add_argument('--history', action='store_true')
    sub.add_parser('read')
    show = sub.add_parser('show'); show.add_argument('id')
    search = sub.add_parser('search'); search.add_argument('query'); search.add_argument('--all-versions', action='store_true')
    start = sub.add_parser('begin'); start.add_argument('--title', required=True); start.add_argument('--actor', required=True)
    end = sub.add_parser('finish'); end.add_argument('--id', required=True); end.add_argument('--summary', required=True)
    for field in ['check', 'pending', 'file']:
        end.add_argument('--' + field, action='append', default=[])
    args = parser.parse_args(); root = args.root.resolve()
    if args.command == 'sync':
        print(json.dumps(sync(root, args.history), ensure_ascii=False))
    elif args.command == 'read':
        read(root)
    elif args.command == 'show':
        if not all(char in '0123456789abcdef' for char in args.id) or len(args.id) != 64:
            raise ValueError('Identificador de fonte inválido.')
        base = root / 'docs/diario-ia/fontes'
        path = base / (args.id + '.json')
        if not path.exists():
            path = base / (args.id + '.json.gz')
        print(json.dumps(read_source(path), ensure_ascii=False, indent=2))
    elif args.command == 'begin':
        print(begin(root, args.title, args.actor))
    elif args.command == 'finish':
        print(json.dumps(finish(root, args.id, args.summary, args.check, args.pending, args.file), ensure_ascii=False))
    else:
        sync(root)
        with sqlite3.connect(root / 'docs/diario-ia/diario.sqlite3') as db:
            query = args.query.replace('\\', '\\\\').replace('%', '\\%').replace('_', '\\_')
            sql = "SELECT caminho,id,atual FROM fontes WHERE conteudo LIKE ? ESCAPE '\\'"
            if not args.all_versions:
                sql += ' AND atual=1'
            for path, identity, current in db.execute(sql + ' ORDER BY caminho LIMIT 30', ('%' + query + '%',)):
                print(('ATUAL' if current else 'HISTÓRICO') + ' | ' + path + ' | ' + identity)

if __name__ == '__main__':
    try:
        main()
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        print('Falha no diário: ' + str(error), file=sys.stderr)
        sys.exit(1)
