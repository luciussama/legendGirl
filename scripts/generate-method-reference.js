// Inventário documental das declarações nomeadas; não executa nem modifica o código do jogo.
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('src/js');
async function files(dir){const entries=await fs.readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?files(path.join(dir,e.name)):e.name.endsWith('.js')?[path.join(dir,e.name)]:[]))).flat().sort();}
const skip=new Set(['if','for','while','switch','catch','with','return','super']);
function parameterEnd(text,start){let level=0,quote=null,escaped=false;for(let i=start;i<text.length;i++){const c=text[i];if(quote){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c===quote)quote=null;continue;}if(c==='"'||c==="'"||c==='`'){quote=c;continue;}if(c==='(')level++;if(c===')'&&--level===0)return i;}return -1;}
const details={
 renderArenaSpecialCloseup:'Compõe um corte de anime com ambos os olhos, entrada/saída rápidas e energia; não avança a simulação.',
 renderSpecialCloseup:'Apresenta o close dramático usando a textura pré-carregada com as poses da menina.',
 beginArenaSpecial:'Consome o uso único e inicia a carga da espada na arena quando a ativação é válida.',
 updateArenaSpecial:'Avança a encenação com física/IA suspensas e aplica dano único na chegada do raio.',
 specialCameraFrame:'Aproxima do rosto durante a carga e retorna ao panorama antes do corte.',
 renderSpecialSwordAura:'Envolve a lâmina existente em sete cores e partículas sem redesenhar o sprite.',
 renderArenaSpecialBeam:'Desenha a viagem do raio até o alvo e os anéis do impacto, sem alterar estado.',
 renderArenaRoom:'Compõe parede, madeira repetida e rodapé existentes, sem alterar colisões.',
 renderArenaStructure:'Apoia o móvel na base visual do layout e reutiliza sua ilustração.',
 recordCampaignDefeat:'Conta uma derrota completa por tentativa e oferece EASY a cada terceira perda no NORMAL.',
 clearCampaignDefeat:'Libera a próxima tentativa e limpa a oferta pendente sem zerar a contagem da campanha.',
 reportDefeat:'Deduplica, salva e publica a derrota da fase ativa com a oferta de ajuda.',
 continueOnEasy:'Aplica EASY às instâncias atuais e retoma a seção/adversário/percurso com progresso preservado.',
 declineEasyOffer:'Recusa a oferta sem alterar dificuldade, contagem ou progresso.',
 retryDefeat:'Recupera a fase derrotada; a ajuda preserva o adversário ou percurso atual.',

 floorTexture:'Prepara o recorte de madeira em DataTexture RGBA 256×64, com nove mipmaps explícitos e orientação preservada.',
 getPhase3ScrollFrame:'Calcula a rolagem visual do retorno pelo progresso horizontal do cenário, sem seguir salto ou pouso.',
 startChaseCampaign:'Prepara a fuga da campanha sob fade, desliga entradas da sala e recupera falhas de preparação.',
 startChasePreview:'Inicia o acesso isolado de debug à perseguição, sem salvar essa fase na campanha.',
 stepChase:'Avança o domínio em segundos: sequência, movimento, colisão, vidas, lançamentos e eventos.',
 chasePacing:'Deriva ritmo por progresso/dificuldade e fixa pares a cada segundo no final do NORMAL.',
 chaseLives:'Deriva as vidas restantes dos impactos e do limite da dificuldade.',

 arenaDifficulty:'Seleciona os perfis originais do NORMAL ou alcance ampliado e menor agressividade no EASY.',
 chasePattern:'Distribui brinquedos por progresso e dificuldade; no NORMAL usa até três objetos e pares finais com corredor amplo.',
 getApproachJumpSpeed:'Consulta o alcance fixo da aproximação por apoio e dificuldade, sem mirar pela posição do comando.',
 getEscapeStats:'Consulta impulso, corrida e efeitos da fuga; o alcance aéreo varia entre NORMAL e EASY.',
 getPhase3Stats:'Consulta atributos do retorno por nível e dificuldade; fromFloor distingue a entrada pelo chão.',

 createToyRoomTutorialContext:'Expõe oito campos atuais ao tutorial; setters somente para conclusão e modo.',
 createToyRoomInputContext:'Adapta entrada, Canvas e callbacks sem copiar os dados usados por HUD/combate.',
 createToyRoomInteractionContext:'Fornece referências atuais e efeitos específicos para as decisões de interação.',
 createToyRoomPersistenceContext:'Adapta campos serializados e retomada dos subsistemas, inclusive após substituição dos atores.',
 createToyRoomStoryContext:'Restringe a narrativa a mundo, atores, exploração, fluxo, controles, áudio e apresentação.',
 createToyRoomWorldQueries:'Cria consultas de piso/viewport com acessos explícitos às referências atuais.',
 createToyRoomSceneFrame:'Monta dados e callbacks atuais para desenhar uma cena da sala.',
 createToyRoomInitialEntities:'Cria jogador, fada, móveis e brinquedos independentes por instância, preservando o catálogo.',
 createToyRoomEnvironmentAssets:'Resolve recortes ambientais existentes sem acessar regras ou estado da exploração.',
 updateToyRoomMovement:'Aplica prioridade das entradas, peso, orientação, passos e integração da exploração.',
 resolveToyRoomCollisions:'Limita a posição e resolve móveis na ordem original, conservando o desempate de penetrações.',
 updateToyRoomCompanion:'Atualiza guia, tutorial, voo e rastro da fada; devolve o brinquedo-guia atual.',
 updateToyRoomEffects:'Avança coleções de partículas e animação do baú recebidas no quadro.',
 updateToyRoomCamera:'Calcula coordenadas da câmera da sala a partir do alvo narrativo explícito.',
 getToyRoomCameraFrame:'Calcula zoom e enquadramento da sala com alvo/câmera/layout atuais.',
 renderToyRoomScene:'Compõe cenário, entidades por Y, efeitos, HUD e falas com os dados do quadro.',
 renderToyRoomTutorial:'Desenha mensagens e ponteiro da orientação sem receber tutorial nem sala.',
 updateProximity:'Atualiza disponibilidade de interação antes do movimento e devolve o baú atual.',
 loadBattleManifest:'Carrega o manifesto de remediação e substitui as sequências Hit pelos quadros nativos de dano.',
 loadBattleImages:'Preenche o cache de imagens da batalha, com erro explícito para recursos ausentes.',
 renderToyCarry:'Compõe pose, brinquedo e contatos visuais usando CARRY_PROFILES; sem pose/item devolve false.',
 createRuntimeContext:'Agrega referências existentes; não cria serviços nem executa lógica de jogo.',
 createViewportController:'Cria resize com Canvas, iluminação, host e callback de orientação.',
 createCameraQaObserver:'Cria observador opcional ativado por cameraQa; lê snapshot sem alterar câmera.',
 renderDarkRoom:'Compõe apresentação, camadas e interface; update de simulação permanece em game.js.',
 updateStandbyNarrative:'Mantém pose de espera, fada, partículas e foco narrativo de standby.',
 updateTransicaoStandbyNarrative:'Avança saída de standby, postura, alfa e retorno do enquadramento.',
 updateCasteloNarrative:'Sequencia encontro no castelo, diálogos e liberação da fuga.',
 updateReviravoltaNarrative:'Avança queda/checagem e diálogos da porta falsa; coordena atores e zoom.',
 updateTutorialRetornoNarrative:'Demonstra arco da fada e devolve controle no retorno.',
 updatePortalNarrative:'Avança aproximação/íris do portal e dispara introdução da Toy Room.',
 beginToyRoomIntroduction:'Captura saída e cria sala de apresentação sem input antes da fase ativa.',
 startTutorial:'Inicia orientação guiada da Toy Room se ainda não concluída.',
 nearest:'Seleciona brinquedo elegível mais próximo do jogador para orientar coleta.',
 guidePosition:'Retorna posição visual da fada acima do brinquedo-alvo do tutorial.',
 cameraFrame:'Calcula enquadramento narrativo da introdução conforme etapa e relógio.',
 fairyPosition:'Calcula posição visual da fada durante a introdução.',
 prepare:'Prepara contexto visual da introdução; consulte dependências no módulo.',

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
function describe(name){if(Object.hasOwn(details,name))return details[name];if(name==='constructor')return 'Inicializa dependências e estado da instância; consulte a seção do módulo.';if(name==='destroy')return 'Remove os recursos/listeners previstos na implementação; audite o ciclo de vida.';if(name==='snapshot')return 'Produz captura recuperável do estado específico deste componente.';if(name==='restore')return 'Reaplica a captura específica; confira referências e dados transitórios.';if(name==='update'||name.startsWith('update'))return 'Avança o estado do subsistema; não é uma operação somente de desenho.';if(name==='render'||name.startsWith('render')||name.startsWith('draw'))return 'Compõe desenho da área correspondente; consulte parâmetros e referencial no código.';if(name.startsWith('spawn'))return 'Cria partículas/efeitos no buffer correspondente.';if(name.startsWith('play'))return 'Aciona o som/cue correspondente ou sua delegação de áudio.';if(name.startsWith('handle')||name.startsWith('onPointer'))return 'Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners.';if(name.startsWith('start')||name.startsWith('finish')||name.startsWith('advance')||name.startsWith('confirm'))return 'Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio.';if(name.startsWith('get')||name.startsWith('is')||name.startsWith('has'))return 'Consulta/calcula valor específico; forma exata definida pela implementação.';if(name.startsWith('set')||name.startsWith('reset')||name.startsWith('clear'))return 'Configura/reinicializa valores do componente; revise o escopo da mutação.';if(name.startsWith('create'))return 'Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências.';return 'Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado.';}
let document='# Referência de métodos e funções\n\nInventário de `src/js`, gerado a partir da cópia local. Consulte [arquitetura e entidades](ARQUITETURA.md), o [manual](MANUAL-DESENVOLVIMENTO.md) e os [comandos](COMANDOS.md).\n\nAs linhas referem-se ao snapshot local e mudam após edições. O inventário inclui funções, métodos, acessores e funções atribuídas com parâmetros entre parênteses, além dos contratos exportados/reexports. Não é um parser completo: callbacks anônimos e algumas lambdas de parâmetro simples não são declarações separadas aqui; funções exportadas continuam enumeradas no módulo. APIs de fábricas e proprietários de estado estão documentados na arquitetura e no manual. A presença de uma função interna não a torna pública.\n\nRegenerar na raiz: `node scripts/generate-method-reference.js`. Revise também as descrições e o manual após mudar contratos.\n\n';
let total=0,modules=0;
for(const file of await files(root)){
 const text=await fs.readFile(file,'utf8'),relative=path.relative(process.cwd(),file).split(path.sep).join('/');
 const declarations=[];let offset=0;
 for(const [index,line] of text.split('\n').entries()){
  let match=line.match(/^\s*(?:export\s+)?(?:async\s+)?function\s+([\w$]+)\s*\(/),kind='Função';
  if(!match){match=line.match(/^\s+(?:get|set)\s+([\w$]+)\s*\(/);kind='Acessor';}
  if(!match){match=line.match(/^\s{2,}(?:async\s+)?([\w$]+)\s*\(/);kind='Método declarado';}
  if(!match){match=line.match(/^\s*(?:export\s+)?(?:const|let|var)\s+([\w$]+)\s*=\s*\(/);kind='Função atribuída';}
  if(!match){match=line.match(/^\s+([\w$]+)\s*:\s*\(/);kind='API/lambda de objeto';}
  if(match&&!skip.has(match[1])){
   const start=offset+line.indexOf('(',match.index),end=parameterEnd(text,start);
   if(end>=0){const tail=text.slice(end+1).trimStart();if(['Função','Método declarado','Acessor'].includes(kind)?tail.startsWith('{'):tail.startsWith('=>')){
    const args=text.slice(start+1,end).replace(/\s+/g,' ').trim();declarations.push({name:match[1],signature:`${match[1]}(${args})`,kind,line:index+1});
   }}
  }
  offset+=line.length+1;
 }
 const exports=[...text.matchAll(/^export\s+(?:async\s+)?(?:const|let|class|function)\s+([\w$]+)/gm)].map(m=>m[1]);
 for(const match of text.matchAll(/export\s*\{([^}]+)\}\s*from/g))for(const item of match[1].split(',')){const name=item.trim().split(/\s+as\s+/).at(-1);if(name)exports.push(name);}
 document+=`## ${relative}\n\n[Implementação](../${relative}).`+(exports.length?' Contratos exportados/reexportados: '+[...new Set(exports)].map(n=>'`'+n+'`').join(', ')+'.':'')+'\n\n';
 if(!declarations.length)document+='Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.\n\n';
 else{document+='| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |\n| --- | --- | ---: | --- |\n';for(const d of declarations)document+=`| \`${d.signature.replaceAll('|','\\|')}\` | ${d.kind} | ${d.line} | ${describe(d.name)} |\n`;document+='\n';}
 total+=declarations.length;modules++;
}
document+=`Inventário: **${modules} módulos JavaScript**, **${total} declarações nomeadas**.\n`;
await fs.writeFile('docs/REFERENCIA-METODOS.md',document);
console.log(`Referência documental gerada: ${modules} módulos e ${total} declarações.`);
