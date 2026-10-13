# Guia da animação da menina

A personagem mantém identidade, proporções e assinatura artística na exploração e na arena. A exploração usa a prancha oficial; a arena possui metadados e escala de apresentação próprios.

Os quadros da arena estão em `assets/art/toy-room/battle/girl/runtime/` e `girl/animation-v2/`. `ArenaGirlAnimationFrames.js` define poses, coordenadas, âncoras e orientação. `ArenaPlayerRenderer.js` desenha a personagem e mistura as poses intermediárias. `BattleGirlFrames.js` define os recortes originais. Consulte o guia de designers e o mapa de recortes antes de mover pixels ou alterar dimensões.

Agachar exige dobrar pernas e tronco, conservando o tamanho da cabeça e as proporções. Corrida deve transmitir continuidade e equilíbrio. Ataques têm antecipação, aceleração, impacto e recuperação; seus instantes visuais precisam concordar com os eventos de combate. A imagem não altera hitboxes ou física.

A equipe de design entrega quadros e metadados propostos. Desenvolvimento integra e valida com `npm run test:arena:animation`, que recupera as verificações do diário num diretório temporário. Relatórios anteriores, prompts e evidências estão no diário de IA; a documentação humana apresenta orientações, não resultados de máquina.
