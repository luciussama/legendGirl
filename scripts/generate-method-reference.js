// Inventário documental das declarações nomeadas; não executa nem modifica o código do jogo.
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('src/js');
async function files(dir){const entries=await fs.readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?files(path.join(dir,e.name)):e.name.endsWith('.js')?[path.join(dir,e.name)]:[]))).flat().sort();}
const skip=new Set(['if','for','while','switch','catch','with','return','super']);
function parameterEnd(text,start){let level=0,quote=null,escaped=false;for(let i=start;i<text.length;i++){const c=text[i];if(quote){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c===quote)quote=null;continue;}if(c==='"'||c==="'"||c==='`'){quote=c;continue;}if(c==='(')level++;if(c===')'&&--level===0)return i;}return -1;}
const details={
 createGame:'Cria o coordenador e devolve a API de integração com a página.',
 syncLocalsToState:'Copia variáveis locais para GameState antes de delegações/captura.',syncStateToLocals:'Atualiza locais a partir de GameState após operações delegadas.',
 doJump:'Seleciona salto ou avanço narrativo conforme o estado atual.',handleResize:'Dimensiona bitmap e canvases auxiliares a partir do layout CSS.',
 recordCameraQa:'Emite observação optativa de câmera; ativada por cameraQa e callback de teste.',
 getBackgroundViewport:'Inverte a matriz real para determinar os limites visíveis do fundo.',
 renderWall:'Desenha parede, parallax, piso e rodapé com cobertura do viewport.',renderScenery:'Desenha objetos decorativos do piso.',
 renderPlatforms:'Desenha apoios com atlas/alternativas e descarte visual.',drawAtlasPlatformSprite:'Recorta/calibra sprite de plataforma; não redefine colisões.',
 applyTransform:'Compõe foco/zoom e diferença entre pose original e visual no contexto.',
 frame:'Calcula pose visual estável sem escrever na simulação.',mobileFrame:'Interpola entrada do enquadramento móvel.',
 getMobileZoomFrame:'Retorna escala e translações de apresentação a partir dos limites/alvo.',
 androidFrameOffset:'Calcula elevação visual Android com reservas e proteção do topo.',
 getEscapeGuideTarget:'Seleciona centro de chegada do próximo apoio ou porta.',updateEscapeFairyGuide:'Atualiza posição/velocidade da guia com amortecimento crítico.',
 captureState:'Seleciona estado serializável da campanha.',restoreState:'Restaura valores preservando referências de objetos/arrays existentes.',
 createCampaignProgress:'Cria leitura, gravação e limpeza do progresso local com alternativa em memória.',
 loadManifest:'Busca manifesto e atualiza status; rejeita falha.',preload:'Pré-carrega entradas de imagens do manifesto.',getRegion:'Valida limites e cacheia recorte do atlas.',
 isReady:'Consulta uma chave ou prontidão do manifesto; sem chave não certifica todas as imagens.',
 resolveAnimationState:'Escolhe animação oficial conforme ação e flags do estado.',renderPose:'Desenha recorte ancorado no centro/pés, com escala visual.',
 renderCutsceneDialogue:'Compõe falas, retratos, prompts e áreas seguras.',wrapText:'Quebra texto conforme a largura medida pelo contexto.',
 intersectCanvasSafeArea:'Converte interseção viewport/canvas e insets em coordenadas do bitmap.',
 getMobileDialogueRegions:'Divide a área segura entre cena e painel de texto.',
 renderPortalWipe:'Desenha transição do portal usando matriz de apresentação quando fornecida.',
 applyArtFinish:'Aplica dessaturação em coordenadas de tela.',validateAllRegions:'Confere recortes do atlas contra imagens carregadas.',
 triggerAction:'Processa interação da sala: pegar, soltar ou organizar brinquedo.',resolveCollisions:'Resolve colisões da sala com móveis.',
 getCanvasCoordinates:'Converte evento de ponteiro para coordenadas internas da sala.',
 read:'Lê e valida save da campanha; pode usar memória da sessão.',write:'Serializa save versionado e tenta gravar no storage.',
};
function describe(name){if(details[name])return details[name];if(name==='constructor')return 'Inicializa dependências e estado da instância; consulte a seção do módulo.';if(name==='destroy')return 'Remove os recursos/listeners previstos na implementação; audite o ciclo de vida.';if(name==='snapshot')return 'Produz captura recuperável do estado específico deste componente.';if(name==='restore')return 'Reaplica a captura específica; confira referências e dados transitórios.';if(name==='update'||name.startsWith('update'))return 'Avança o estado do subsistema; não é uma operação somente de desenho.';if(name==='render'||name.startsWith('render')||name.startsWith('draw'))return 'Compõe desenho da área correspondente; consulte parâmetros e referencial no código.';if(name.startsWith('spawn'))return 'Cria partículas/efeitos no buffer correspondente.';if(name.startsWith('play'))return 'Aciona o som/cue correspondente ou sua delegação de áudio.';if(name.startsWith('handle')||name.startsWith('onPointer'))return 'Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners.';if(name.startsWith('start')||name.startsWith('finish')||name.startsWith('advance')||name.startsWith('confirm'))return 'Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio.';if(name.startsWith('get')||name.startsWith('is')||name.startsWith('has'))return 'Consulta/calcula valor específico; forma exata definida pela implementação.';if(name.startsWith('set')||name.startsWith('reset')||name.startsWith('clear'))return 'Configura/reinicializa valores do componente; revise o escopo da mutação.';if(name.startsWith('create'))return 'Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências.';return 'Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado.';}
let document='# Referência de métodos e funções\n\nInventário de `src/js`, gerado a partir da cópia local em 02/10/2026. Consulte o [manual](MANUAL-DESENVOLVIMENTO.md) para contratos, arquitetura e receitas.\n\nAs linhas referem-se ao snapshot local e mudam após edições. O inventário inclui declarações de funções, métodos escritos com sintaxe de método e funções atribuídas com parâmetros entre parênteses. Não é um parser completo de JavaScript: callbacks anônimos, aliases/reexportações e algumas lambdas de parâmetro simples não são contratos separados aqui. APIs retornadas por fábricas estão descritas no manual. A presença de uma função interna não a torna pública. Descrições por família são orientação de leitura; as tabelas do manual detalham os contratos centrais.\n\nRegenerar na raiz: `node scripts/generate-method-reference.js`. Revise também as descrições e o manual após mudar contratos.\n\n';
let total=0,modules=0;
for(const file of await files(root)){
 const text=await fs.readFile(file,'utf8'),relative=path.relative(process.cwd(),file).split(path.sep).join('/');
 const declarations=[];let offset=0;
 for(const [index,line] of text.split('\n').entries()){
  let match=line.match(/^\s*(?:export\s+)?(?:async\s+)?function\s+([\w$]+)\s*\(/),kind='Função';
  if(!match){match=line.match(/^\s{2,}(?:async\s+)?([\w$]+)\s*\(/);kind='Método declarado';}
  if(!match){match=line.match(/^\s*(?:export\s+)?(?:const|let|var)\s+([\w$]+)\s*=\s*\(/);kind='Função atribuída';}
  if(!match){match=line.match(/^\s+([\w$]+)\s*:\s*\(/);kind='API/lambda de objeto';}
  if(match&&!skip.has(match[1])){
   const start=offset+line.indexOf('(',match.index),end=parameterEnd(text,start);
   if(end>=0){const tail=text.slice(end+1).trimStart();if(kind==='Função'||kind==='Método declarado'?tail.startsWith('{'):tail.startsWith('=>')){
    const args=text.slice(start+1,end).replace(/\s+/g,' ').trim();declarations.push({name:match[1],signature:`${match[1]}(${args})`,kind,line:index+1});
   }}
  }
  offset+=line.length+1;
 }
 const exports=[...text.matchAll(/^export\s+(?:const|class)\s+([\w$]+)/gm)].map(m=>m[1]);
 document+=`## ${relative}\n\n[Implementação](../${relative}).`+(exports.length?' Dados/classes exportados: '+exports.map(n=>'`'+n+'`').join(', ')+'.':'')+'\n\n';
 if(!declarations.length)document+='Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.\n\n';
 else{document+='| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |\n| --- | --- | ---: | --- |\n';for(const d of declarations)document+=`| \`${d.signature.replaceAll('|','\\|')}\` | ${d.kind} | ${d.line} | ${describe(d.name)} |\n`;document+='\n';}
 total+=declarations.length;modules++;
}
document+=`Inventário: **${modules} módulos JavaScript**, **${total} declarações nomeadas**.\n`;
await fs.writeFile('docs/REFERENCIA-METODOS.md',document);
console.log(`Referência documental gerada: ${modules} módulos e ${total} declarações.`);
