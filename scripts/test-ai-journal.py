#!/usr/bin/env python3
"""Valida persistência, versões, concorrência e encerramento sem tocar no diário real."""
import concurrent.futures
import hashlib
import importlib.util
import json
from pathlib import Path
import sqlite3
import tempfile

spec = importlib.util.spec_from_file_location('journal', Path(__file__).with_name('ai-journal.py'))
journal = importlib.util.module_from_spec(spec)
spec.loader.exec_module(journal)
with tempfile.TemporaryDirectory(prefix='legendgirl-diario-') as directory:
    root = Path(directory)
    (root / 'docs/qa').mkdir(parents=True)
    (root / 'node_modules').mkdir()
    (root / 'AGENTS.md').write_text('Instrução vigente: preservar arte.', encoding='utf-8')
    (root / 'docs/relatorio.md').write_text('Resultado: aprovado. Árvore ilustrada.', encoding='utf-8')
    (root / 'docs/qa/evidencia.json').write_text('{"resultado":"aprovado"}')
    (root / 'node_modules/segredo.md').write_text('Não importar dependências.')
    first = journal.sync(root)
    assert first['fontesAtuais'] == 3
    assert journal.sync(root)['versoesPreservadas'] == first['versoesPreservadas'], 'Sincronização idempotente.'
    (root / 'docs/relatorio.md').write_text('Resultado: correção posterior.', encoding='utf-8')
    assert journal.sync(root)['versoesPreservadas'] == 4, 'Preserva versões anteriores.'
    (root / 'docs/relatorio.md').unlink()
    assert journal.sync(root)['fontesAtuais'] == 2
    with sqlite3.connect(root / 'docs/diario-ia/diario.sqlite3') as db:
        assert db.execute("SELECT COUNT(*) FROM fontes WHERE caminho='docs/relatorio.md' AND atual=0").fetchone()[0] == 2
        for path, sha, content in db.execute('SELECT caminho,sha256,conteudo FROM fontes'):
            assert hashlib.sha256(content.encode()).hexdigest() == sha, path
    large='Relatório volumoso de telemetria. '*6000
    identity=journal.snapshot(root,'docs/telemetria.json',large.encode(),{'type':'teste'})
    compressed=root/'docs/diario-ia/fontes'/(identity+'.json.gz')
    assert compressed.exists() and journal.read_source(compressed)['content']==large, 'Compressão preserva a íntegra.'
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        target = root / 'docs/diario-ia/registros/concorrente.json'
        outcomes = list(pool.map(lambda n: journal.write_new(target, {'n': n}), range(8)))
        assert sum(outcomes) == 1, 'A criação exclusiva não sobrescreve outro responsável.'
        assert 'n' in json.loads(target.read_text())
    target.unlink()
    identifier = journal.begin(root, 'Teste isolado', 'Equipe de teste')
    journal.finish(root, identifier, 'Concluído', ['Teste aprovado'], ['Revisão humana pendente'], ['AGENTS.md'])
    try:
        journal.finish(root, identifier, 'Não sobrescrever', [], [], [])
        raise AssertionError('Encerramento duplicado deveria ser rejeitado.')
    except ValueError:
        pass
    with sqlite3.connect(root / 'docs/diario-ia/diario.sqlite3') as db:
        assert db.execute('SELECT COUNT(*) FROM registros').fetchone()[0] == 2
        assert db.execute("SELECT COUNT(*) FROM registros WHERE tipo='inicio' AND sessao NOT IN(SELECT sessao FROM registros WHERE tipo='fim')").fetchone()[0] == 0
print('APROVADO: diário persistente, versões históricas, idempotência, hashes, concorrência e encerramento imutável.')
