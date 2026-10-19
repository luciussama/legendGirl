#!/usr/bin/env python3
"""Recupera automações arquivadas só no diretório temporário e registra o resultado no diário."""
import argparse
import base64
import importlib.util
import json
import os
from pathlib import Path
import shutil
import socket
import time
import urllib.request
import subprocess
import tempfile
import uuid

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('journal', ROOT / 'scripts/ai-journal.py')
journal = importlib.util.module_from_spec(spec); spec.loader.exec_module(journal)
parser = argparse.ArgumentParser(description='Executar QA preservado no diário, sem recriar arquivos no projeto.')
parser.add_argument('command', nargs='?', default='test')
parser.add_argument('arguments', nargs=argparse.REMAINDER)
args = parser.parse_args()
packages = sorted(
    (json.loads(p.read_text()) for p in (ROOT / 'docs/diario-ia/pacotes').glob('*.json')),
    key=lambda package: (package.get('date', ''), package['id']), reverse=True)
single = args.command.removeprefix('script:') if args.command.startswith('script:') else None
bundle = next((p for p in packages if (args.command in p.get('qaCommands', {})) or (single and any(f['path']=='scripts/'+single for f in p['files']))), None)
if not bundle:
    raise SystemExit('Comando não encontrado no acervo de QA: ' + args.command)

with tempfile.TemporaryDirectory(prefix='legendgirl-qa-') as directory:
    workspace = Path(directory) / 'projeto'
    def ignore(path, names):
        blocked = {'.git','node_modules','.sprite-review-quarantine','__pycache__','_site','dist'}
        relative = Path(path).relative_to(ROOT).as_posix()
        if relative == 'docs/diario-ia':
            blocked.update({'fontes','commits','registros','pacotes','diario.sqlite3'})
        return [name for name in names if name in blocked or name.endswith(('.sqlite3','.sqlite3.tmp'))]
    shutil.copytree(ROOT, workspace, ignore=ignore)
    if (ROOT / 'node_modules').exists():
        (workspace / 'node_modules').symlink_to(ROOT / 'node_modules', target_is_directory=True)
    archived = {}
    for saved in reversed(packages):
        for entry in saved['files']:archived[entry['path']] = entry
    for entry in archived.values():
        if entry.get('metadataOnly'):
            continue
        # Recupera somente código/fixtures e especificações exigidas pelos testes, não antigos relatórios Markdown.
        if not entry['path'].startswith(('scripts/','tests/','assets/')):
            continue
        path = (workspace / entry['path']).resolve()
        if not path.is_relative_to(workspace.resolve()):
            raise SystemExit('Caminho inválido no pacote de QA.')
        source = ROOT / 'docs/diario-ia/fontes' / (entry['sourceId'] + '.json')
        if not source.exists(): source = source.with_suffix('.json.gz')
        data = journal.read_source(source)
        raw = base64.b64decode(data['content']) if data.get('encoding') == 'base64' else data['content'].encode()
        if journal.digest(raw) != entry['sha256']:
            raise SystemExit('Falha de integridade no acervo: ' + entry['path'])
        path.parent.mkdir(parents=True, exist_ok=True); path.write_bytes(raw)
    package_path = workspace / 'package.json'
    package = json.loads(package_path.read_text())
    qa_commands = {}
    for saved in reversed(packages):qa_commands.update(saved.get('qaCommands',{}))
    for name, command in qa_commands.items():
        if name == 'test' or name.startswith(('test:','verify:','review:')):
            package['scripts'][name] = command
    command_name = args.command
    if single:
        if '/' in single or not single.endswith(('.js','.py')):raise SystemExit('Nome de script inválido.')
        command_name = 'qa:single'
        package['scripts'][command_name] = ('python3 ' if single.endswith('.py') else 'node ') + 'scripts/' + single
    package_path.write_text(json.dumps(package,ensure_ascii=False,indent=2)+'\n')
    server = None
    browser = 'browser' in bundle.get('qaCommands',{}).get(args.command,args.command)
    try:
        if browser:
            with socket.socket() as sock:
                sock.bind(('127.0.0.1',0)); port = sock.getsockname()[1]
            import re
            for folder in ['scripts','tests','docs/diario-ia/qa']:
                for path in (workspace/folder).rglob('*'):
                    if path.suffix not in {'.js','.html','.py'}:continue
                    text = path.read_text()
                    text = re.sub(r'http://(127\.0\.0\.1|localhost):(3000|3001|3003|8765)', 'http://127.0.0.1:'+str(port),text)
                    text = text.replace('/tmp/legendgirl-sprite-review-test-selection.json',str(workspace/'review-test.json'))
                    path.write_text(text)
            environment = dict(os.environ,PORT=str(port),SPRITE_REVIEW_SELECTION_PATH=str(workspace/'review-test.json'))
            server = subprocess.Popen(['node','server.js'],cwd=workspace,env=environment,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
            for attempt in range(100):
                try:
                    with urllib.request.urlopen('http://127.0.0.1:'+str(port),timeout=1):break
                except OSError:time.sleep(.1)
            else:raise RuntimeError('Servidor temporário de QA não inicializou.')
        result = subprocess.run(['npm','run',command_name,'--',*args.arguments],cwd=workspace,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
    finally:
        if server:
            server.terminate()
            try:server.wait(timeout=5)
            except subprocess.TimeoutExpired:server.kill();server.wait()
    output = result.stdout.decode('utf-8',errors='replace')
    print(output,end='')
    identity = uuid.uuid4().hex
    source_id = journal.snapshot(ROOT,'qa-execucoes/'+identity+'.log',result.stdout,{'type':'execucao-qa','command':args.command,'exitCode':result.returncode,'package':bundle['id']})
    record = {'schemaVersion':1,'id':identity,'type':'qa','date':journal.now(),'title':'QA temporário: '+args.command,'exitCode':result.returncode,'sourceId':source_id,'package':bundle['id']}
    journal.write_new(ROOT/'docs/diario-ia/registros'/(identity+'.json'),record)
    artifacts = [{'path':'qa-execucoes/'+identity+'.log','sourceId':source_id,'sha256':journal.digest(result.stdout),'bytes':len(result.stdout),'metadataOnly':False}]
    for folder in ['docs/qa','assets/qa-testers','docs/diario-ia/qa-resultados']:
        for artifact in sorted((workspace/folder).rglob('*')):
            if not artifact.is_file(): continue
            raw = artifact.read_bytes(); relative = artifact.relative_to(workspace).as_posix()
            metadata_only = artifact.suffix.lower() in {'.png','.jpg','.jpeg','.webp','.gif','.pdf'}
            payload = json.dumps({'path':relative,'sha256':journal.digest(raw),'bytes':len(raw),'binaryRetained':False}).encode() if metadata_only else raw
            sid = journal.snapshot(ROOT,'qa-execucoes/'+identity+'/'+relative,payload,{'type':'execucao-qa','command':args.command})
            artifacts.append({'path':'qa-execucoes/'+identity+'/'+relative,'sourceId':sid,'sha256':journal.digest(raw),'bytes':len(raw),'metadataOnly':metadata_only})
    journal.write_new(ROOT/'docs/diario-ia/pacotes'/(identity+'.json'),{'schemaVersion':1,'id':identity,'date':record['date'],'title':record['title'],'files':artifacts})
    journal.sync(ROOT)
    print('Resultado preservado no diário; diretório temporário removido.')
    raise SystemExit(result.returncode)
