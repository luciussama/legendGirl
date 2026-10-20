"""Retira candidatos auditados; preserva arte integral e relatórios antes de excluir cópias ativas."""
from pathlib import Path
import importlib.util
import json
import uuid

ROOT = Path.cwd()
spec = importlib.util.spec_from_file_location('journal', ROOT/'scripts/ai-journal.py')
journal = importlib.util.module_from_spec(spec)
spec.loader.exec_module(journal)

retired = [
 'assets/art/toy-room/battle/corrections/robot-walk-final.png',
 'assets/art/toy-room/battle/corrections/robot-walk-retry.png',
 'assets/art/toy-room/battle/polish/robot-walk-v1.png',
 'assets/art/toy-room/battle/polish/train-walk-v1.png',
 'assets/art/toy-room/battle/remediation/robot-support-gate-retry.png',
 'assets/art/toy-room/battle/remediation/robot-walk-gate-retry.png',
 'assets/art/toy-room/battle/remediation/steam-blast-remediation-v1.png',
 'assets/art/toy-room/battle/remediation/train-walk-remediation-v1.png',
 'assets/art/toy-room/battle/sources/robot-rocket-punch-v1.png',
 'src/assets/images/small_dresser_1790161034161.jpg',
 'src/audio/Designer.png',
 'assets/art/toy-room/bear-chase/materials/decorativos-atlas-v2.png',
 'assets/art/toy-room/bear-chase/materials/urso-atlas-v1.png',
 'src/audio/High-Frequency Violin.mp3',
 'src/audio/toy_room_theme.mp3',
 'assets/audio/toy_room_theme.mp3',
]
# As cópias sonoras retiradas devem ser idênticas à trilha principal que continuará no jogo.
primary = journal.digest((ROOT/'assets/audio/High-Frequency Violin.mp3').read_bytes())
for file in retired[-3:]:
 if journal.digest((ROOT/file).read_bytes()) != primary:
  raise RuntimeError('Cópia sonora deixou de ser idêntica: '+file)
inventory = {item['path']:item for item in json.loads((ROOT/'docs/sprites/inventario.json').read_text())['items'] if item['kind']=='file'}
entries = []
for file in retired:
 raw = (ROOT/file).read_bytes()
 if file in inventory and journal.digest(raw) != inventory[file]['sha256']:
  raise RuntimeError('Asset mudou durante a auditoria: '+file)
 source_id = journal.snapshot(ROOT,file,raw,{'type':'asset-aposentado-recuperavel','session':'20261020T184959-b352523a0674'})
 source = ROOT/'docs/diario-ia/fontes'/(source_id+'.json')
 if not source.exists(): source = source.with_suffix('.json.gz')
 data = journal.read_source(source)
 import base64
 recovered = base64.b64decode(data['content']) if data['encoding']=='base64' else data['content'].encode()
 if recovered != raw: raise RuntimeError('Cópia integral não conferida: '+file)
 entries.append({'path':file,'sourceId':source_id,'sha256':journal.digest(raw),'bytes':len(raw),'binaryRetained':True,'reason':'Intermediário substituído sem consumidor atual ou cópia sonora idêntica; referências dinâmicas e fontes de reconstrução revisadas.'})

# retiredAssets fica separado de files: o executor de QA não deve ressuscitar arte aposentada.
identity = 'limpeza-artes-20261020-'+uuid.uuid4().hex[:12]
journal.write_new(ROOT/'docs/diario-ia/pacotes'/(identity+'.json'),{'schemaVersion':1,'id':identity,'date':journal.now(),'title':'Artes aposentadas preservadas integralmente antes da limpeza','files':[],'retiredAssets':entries})
reports = sorted(str(path.relative_to(ROOT)) for path in (ROOT/'docs/diario-ia/relatorios').rglob('*') if path.is_file())
package = journal.archive_artifacts(ROOT,reports,'Consolidar relatórios avulsos no acervo imutável')
for entry in package['files']:
 source = ROOT/'docs/diario-ia/fontes'/(entry['sourceId']+'.json')
 if not source.exists(): source = source.with_suffix('.json.gz')
 data = journal.read_source(source)
 if journal.digest(data['content'].encode()) != entry['sha256']:
  raise RuntimeError('Relatório não conferido: '+entry['path'])
for file in retired+reports: (ROOT/file).unlink()
cache = ROOT/'docs/.DS_Store'
removed_cache = []
if cache.exists():
 raw=cache.read_bytes();removed_cache.append({'path':str(cache.relative_to(ROOT)),'sha256':journal.digest(raw),'bytes':len(raw)})
 cache.unlink()
manifest = {'schemaVersion':1,'session':'20261020T184959-b352523a0674','date':journal.now(),'retiredAssets':entries,'retiredAssetsPackage':identity,'reportsPackage':package['id'],'reports':package['files'],'cache':removed_cache,'preserved':['fontes/registros/pacotes/commits imutáveis','guias e diário humano','arte atual e fontes de reconstrução','áudio de fallback src/audio/The Circle Game.mp3','GLB de intercâmbio','imagem de direção pictórica aprovada','dependências e ambiente local','QA ativo e planos/documentos pertinentes']}
(ROOT/'docs/diario-ia/limpeza/20261020-manifesto.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'assetsRetirados':len(entries),'bytesDasCopiasAtivas':sum(e['bytes'] for e in entries),'relatoriosConsolidados':len(reports),'cache':len(removed_cache),'arquivoDeRecuperacao':identity},ensure_ascii=False))
