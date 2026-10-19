# Execução iniciada: prova integrada da perseguição 3D

Sessão `20261019T180920-9abdc512abd2`, Codex, branch `FEAT-bear-chase`, 19/10/2026.
Pedido atual do usuário: começar a execução do plano. Árvore inicialmente limpa;
o planejamento e os áudios anteriores já estavam versionados. Sem commit/push nesta sessão.

## Entrega real

Criada prévia jogável isolada, acessível no seletor de fases como **Perseguição 3D (prévia)**.
São 720 unidades de percurso, aproximadamente 90 segundos de corrida; com cutscene e
final, a execução sem dano medida pela simulação dura 101,58 s. Não é a fase completa
de maior extensão solicitada. A campanha normal ainda não muda da arena para a nova fase.
Essa separação respeita a etapa de prova visual antes da expansão e evita promover
sprites laterais provisórios a arte final de câmera traseira.

O coordenador `BearChasePhase` recebe apenas canvas, serviço de áudio, disponibilidade
e dificuldade. `ChaseSimulation` não importa DOM, GPU ou áudio: mantém estados, RNG,
avanço automático, desvio, colisão varrida, lançamentos com voo, recuperação após impacto,
proximidade do urso e voo da fada. As entradas, áudio, renderer e HUD estão separados.
Cada método novo está documentado em português do Brasil.

O renderer usa Three.js 0.186.1, fixado em package.json/lockfile e copiado sem alterações
para `src/vendor/three/` com licença MIT. São geometria 3D, perspectiva, depth-test,
paredes, piso, rodapés, teto e móveis com volume/detalhes ilustrados. Texturas e sprites
vêm dos arquivos atuais; nenhuma imagem compartilhada foi alterada. Doze módulos de
sala são reciclados para limitar recursos. Não foi criada física 3D genérica nem
hierarquia global de fases; a integração é por composição.

Sequência da prévia: urso caído → menina se aproxima → urso levanta → arranca → corrida
com brinquedos → alcance → animação do baú → conclusão. O marcador de ida ao baú só
é aplicado no fim e emite um evento único. Os dois primeiros movimentos usam quadros
existentes de modo provisório: não são animações artísticas homologadas de levantar
ou caminhada lenta. A menina e o urso ainda aparecem lateralmente em planos.
A fada segue com alternância amortecida e profundidade; ainda não há asas articuladas.

Os padrões preservam um corredor livre, espaçamento temporal e distância mínima de
lançamento. A aproximação final suspende lançamentos sem tempo suficiente de aviso.
Toque permite segurar/arrastar entre laterais; teclado e gamepad produzem a mesma
intenção lateral. Colisão causa tropeço breve, sem introduzir a regra de cura da arena.
Há marcadores de setor, mas não interface de retry/checkpoint da campanha nesta prova.

`ChaseAudio` reproduz a música e as doze amostras locais. Música entra na arrancada e
reduz no alcance. Mudo, volume, pausa e descarte são respeitados. Foi necessário
expor `AudioController.getAudioContext()` para acessar o contexto que já existia no
sistema; não se criou um segundo contexto. A repetição integral de `Chase.mp3` é
provisória: emenda musical e mixagem continuam pendentes de escuta. Nenhum serviço
de geração, compra, consumo de créditos ou cobrança foi usado.

O renderer é importado dinamicamente só ao abrir a prévia. Sua saída é composta no
canvas 2D existente, evitando sobreposição de áreas de toque. Há mensagem de falha
se a preparação de WebGL 2/artes não for possível. `snapshot/restore` da prévia
valida dados e preserva RNG, voo, posições e eventos. Ainda não existe integração
desse estado ao save da campanha, nem migração de saves antigos para a nova sequência.

## Validações e falhas reais

- `npm test` passou antes e depois da integração; a execução final já inclui
  `test:bear-chase`. Resultados completos foram arquivados automaticamente pelo executor.
- Domínio: oito percursos NORMAL/EASY × dt legado 0,5/1/1,2/3 com passo fixo 60 Hz,
  sem dano pela política automática de desvio. Ordem das etapas, colisão varrida,
  obstáculos em voo, RNG/restauração, evento único do baú, entradas inválidas de save
  e limite de objetos verificados. Máximo de quatro obstáculos ativos nesses percursos.
- Navegador isolado: jogo real e seletor, WebGL 2, formatos 1280×800, 390×844 e 844×390,
  congelamento em pausa, snapshot/restauração da prévia, teclado e toque nativos CDP,
  doze buffers de passos, mudo, percurso completo com avanço controlado e descarte.
  Save sentinela da campanha permaneceu intacto. A primeira execução falhou com zero
  buffers: o adaptador de áudio não expunha o contexto; corrigido e repetido sem
  relaxar a asserção. Falha e aprovações permanecem no acervo.
- Renderer mediu 229–231 draw calls, 13 texturas residentes naquele quadro e
  133–135 geometrias nos três formatos. No percurso simulado, máximo de 251 recursos
  sob propriedade do renderer; descarte terminou com zero recursos e zero ponteiros.
  São contagens de recursos, não benchmark de FPS ou memória do aparelho.
- `npm run build`, `npm run check-assets`, `npm run lint` e `git diff --check` passaram.
  `check-assets` confirma os 66 recursos do manifesto compartilhado; as referências
  da prévia foram exercitadas adicionalmente pelo teste de navegador sem HTTP ≥400.
- `npm run docs:sprites` reconstruiu mapa, recortes e inventário: 416 imagens,
  99 recortes e 29 assinaturas. `generate-method-reference.js` atualizou a referência.
- Capturas temporárias de desktop/retrato/paisagem foram produzidas; desktop e
  retrato foram inspecionados visualmente. Caminhos, tamanhos e hashes estão na
  saída de QA arquivada; bitmaps descartados após inspeção. Não foram promovidos
  a referências visuais de aprovação artística.
- Acesso pelo Chrome pessoal via UI também confirmou a nova opção do seletor;
  a prévia foi aberta e pausada para revisão, sem acionar continuar/recomeçar da campanha.

Fontes de regressão e pacotes estão em `docs/diario-ia/qa/perseguicao-20261019/` e no
acervo imutável. `test:bear-chase` integra a suíte padrão; `test:bear-chase:browser`
continua específico e requer Chrome isolado com CDP em 9222.

## Pendências antes de promover a fase à campanha

1. Produzir/avaliar vistas traseiras e três quartos, caminhada lenta, urso caído/levantar,
   lançamento próprio e asas da fada, mantendo a identidade atual. Não gerar arte por
   serviço cobrado sem o usuário realizar explicitamente a contratação na plataforma.
2. Variar setores e medir a maior fase anterior para definir a extensão final. A
   repetição de janelas/móveis da prova não satisfaz sozinha o requisito de maior fase.
3. Preparar a repetição musical por escuta e validar mixagem, ganho e ritmo em jogo.
4. Integrar os dois caminhos de vitória da arena e interromper o transporte atual do
   urso ao baú antes da cutscene; separar efeitos de `restoreReality`, sem alterar
   os outros inimigos. Isso não foi ligado na campanha normal nesta etapa.
5. Integrar persistência/checkpoints/retry ao save de campanha, com migrações e reload
   nas fronteiras da cutscene e da ida ao baú.
6. Medir frame time/memória, tratar orçamento de recursos conforme aparelhos e avaliar
   dificuldade/controles com pessoas. Os perfis são Chrome emulado, sem homologar
   iPhone/Safari, Android físico ou qualidade musical.

Esta entrega conclui a primeira prova técnica jogável, não o plano inteiro nem a
homologação visual. O guia humano em `docs/bear-chase/GUIA-PREVIA.md` explica acesso,
contratos e limites sem duplicar os resultados de QA.
