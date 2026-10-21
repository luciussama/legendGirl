/** Confere a documentação vigente contra módulos, arquivos e parâmetros reais, sem alterar produção. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { BATTLE_ORDER, BATTLE_TUNING, BATTLE_TRANSITION_DURATION } from '../../../../src/js/toy-room/BattleConfig.js';
import { ARENA_TUNING } from '../../../../src/js/toy-room/ArenaPlayerController.js';
import { ARENA_ENEMIES } from '../../../../src/js/toy-room/ArenaEnemies.js';
import { ARENA_SWORD } from '../../../../src/js/toy-room/ArenaCombatRules.js';
import { arenaDifficulty } from '../../../../src/js/toy-room/ArenaDifficulty.js';
const ler = p => fs.readFileSync(p, 'utf8');
const arquivos = pasta => fs.readdirSync(pasta, { withFileTypes: true }).flatMap(e => e.isDirectory() ? arquivos(path.join(pasta,e.name)) : [path.join(pasta,e.name)]);
const arquitetura = ler('docs/ARQUITETURA.md');
const modulos = arquivos('src/js').filter(p=>p.endsWith('.js'));
const linhas = [...arquitetura.matchAll(/^\| \[([^\]]+\.js)\]\(\.\.\/src\/js\/[^)]+\) \| ([^|]+) \| ([^\n]+)$/gm)];
assert.equal(linhas.length,modulos.length,'Catálogo deve cobrir cada módulo uma única vez');
for(const modulo of modulos){
  const relativo=modulo.slice(7), entradas=linhas.filter(m=>m[1]===relativo);
  assert.equal(entradas.length,1,`Cobertura de ${modulo}`);
  const fonte=ler(modulo), contratos=[...fonte.matchAll(/export\s+(?:async\s+)?(?:class|function|const|let|var)\s+(\w+)/g)].map(m=>m[1]);
  for(const m of fonte.matchAll(/export\s*\{([^}]+)\}/g)) contratos.push(...m[1].split(',').filter(s=>s.trim()).map(s=>s.trim().split(' as ').at(-1).trim()));
  for(const contrato of contratos) assert.ok(entradas[0][3].includes('`'+contrato+'`'),`${modulo}: export ${contrato}`);
}
const docs=['assets/art/toy-room/bear-chase/materials/README.md','README.md','docs/README.md','docs/ARQUITETURA.md','docs/MANUAL-DESENVOLVIMENTO.md','docs/COMANDOS.md','docs/DEPENDENCIAS.md','docs/REFERENCIA-METODOS.md','docs/DIARIO-HUMANO.md','docs/TUTORIAL-PRIMEIRO-SALTO.md','docs/arena/GUIA-ARENA.md','docs/arena/GUIA-ANIMACAO.md','docs/sprites/GUIA-DESIGNERS.md','docs/bear-chase/GUIA-PREVIA.md','docs/bear-chase/MANUAL-TRANSICAO-VITORIA-ARENA-FUGA.md'];
let links=0;
for(const doc of docs){
 const texto=ler(doc).replace(/```[\s\S]*?```/g,'');
 for(const m of texto.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
  const url=m[1].replace(/^<|>$/g,'');
  if(/^(https?:|mailto:|#)/.test(url))continue;
  const destino=decodeURIComponent(url.split('#')[0].split('?')[0]).replace(/:\d+$/,'');
  assert.ok(fs.existsSync(path.resolve(path.dirname(doc),destino)),`${doc}: link inexistente ${url}`);links++;
 }
}
const configuracao=JSON.parse(ler('docs/arena/configuracao-atual.json'));
for(const [nome,valor] of Object.entries({BATTLE_ORDER,BATTLE_TUNING,BATTLE_TRANSITION_DURATION,ARENA_TUNING,ARENA_ENEMIES,ARENA_SWORD}))assert.deepEqual(configuracao.perfis[nome],JSON.parse(JSON.stringify(valor)),`Parâmetro documental ${nome}`);
assert.deepEqual(configuracao.dificuldades.EASY,JSON.parse(JSON.stringify(arenaDifficulty('EASY'))),'Perfil EASY documental');
const lock=JSON.parse(ler('package-lock.json')), dependencias=ler('docs/DEPENDENCIAS.md');
for(const [nome,intervalo] of Object.entries(lock.packages[''].dependencies))assert.ok(dependencias.includes(`| ${nome} | ${intervalo} / ${lock.packages['node_modules/'+nome].version} |`),`Versão documental ${nome}`);
console.log(JSON.stringify({resultado:'aprovado',modulos:modulos.length,documentos:docs.length,linksLocais:links,parametrosArena:'iguais ao código',dependencias:'iguais ao lockfile'},null,2));
