# Guia da animação da menina

A personagem mantém identidade, proporções e assinatura artística na exploração e na arena. As poses jogáveis usam as pinturas compartilhadas girl-v2; a arena possui metadados e escala de apresentação próprios.

Os quadros ativos da arena estão em `assets/art/characters/girl-v2/runtime/`, preparados por `scripts/prepare-illustrated-girl.js`. As fontes anteriores em `battle/girl/` permanecem preservadas. `ArenaGirlAnimationFrames.js` define poses, coordenadas, âncoras e orientação. `ArenaPlayerRenderer.js` desenha a personagem e mistura as poses intermediárias. `BattleGirlFrames.js` preserva os recortes originais. Consulte o guia de designers e o mapa de recortes antes de mover pixels ou alterar dimensões.

Agachar exige dobrar pernas e tronco, conservando o tamanho da cabeça e as proporções. Corrida deve transmitir continuidade e equilíbrio. Ataques têm antecipação, aceleração, impacto e recuperação; seus instantes visuais precisam concordar com os eventos de combate. A imagem não altera hitboxes ou física.

A equipe de design entrega quadros e metadados propostos. Desenvolvimento integra e valida com `npm run test:arena:animation`, que recupera as verificações do diário num diretório temporário. Relatórios anteriores, prompts e evidências estão no diário de IA; a documentação humana apresenta orientações, não resultados de máquina.

## Estado visual, dano e apresentação compartilhada

`ArenaPlayerAnimation` mantém a progressão do gesto e amostra corrida, salto e agachamento; `ArenaCombatRules` define as janelas reais da espada. `ArenaPlayerRenderer` recebe o estado atual e conserva as âncoras por quadro. A apresentação depende das medidas em `ArenaScale`; `BattlePlayerBounds` descreve os limites derivados, sem autorizar mudança automática de hitbox por edição de pixels.

`DamageSpriteFrames` contém seis poses por ator em `damage-v2/`, geradas por `scripts/prepare-damage-sprites.js`. A menina usa seis recortes distintos de `girl-v2/runtime/arena-dano.png`; inimigos usam HIT. Essa reação prevalece sobre o ataque interrompido desde o primeiro impacto, inclusive no hitstop. O [README das poses de dano](../../assets/art/toy-room/battle/damage-v2/README.md) documenta dimensões/origem. Sons de dano e espada não são gravados nas imagens.

Na exploração, `ToyRoomSceneRenderer` compõe a personagem com `ToyRoomEntities`/`ToyCarryPresentation`; a espada e os oito quadros de ataque existentes são resolvidos em `ToyRoomStoryRenderer`. O tutorial tem renderer independente. A mesma identidade visual não significa que as fases compartilhem controlador, escala, física ou estado de animação. Veja [proprietários e contratos](../ARQUITETURA.md#proprietários-e-contratos-dos-dados).

## Defesa frontal

`girl/animation-v2/guard-cycle-sheet.png` contém seis poses criadas com Imagegen, usando repouso e ataque atuais como referências. O prompt e a origem estão em `guard-provenance.json`. `ArenaGirlAnimationFrames.guard` define recortes, orientação, escala e âncoras. `guardAmount` em `ArenaPlayerAnimation` percorre a sequência em 12 quadros ao entrar e na ordem inversa ao sair, com mistura entre poses e repouso. A proteção lógica exige direção para trás durante a preparação ou a janela ofensiva do golpe inimigo; a interpolação visual não atrasa a resposta do controle. Fora desse intervalo, o recuo usa o ciclo de caminhada. Durante a defesa, os pés ficam estacionários. Quando o golpe termina e a direção continua pressionada, a caminhada retoma imediatamente, sem uma pose residual de guarda cobrindo o movimento dos pés. Golpe, salto e dano têm prioridade sobre a pose de defesa. As hitboxes não dependem da nova arte.

A expressão da arena conserva olhos estreitos, sobrancelhas voltadas para o centro e boca séria. A versão ativa tem quatro estágios próprios de agachamento com cabeça em escala comum e seis estágios de dano. Repetições de quadros de exploração mantêm o relógio anterior.
