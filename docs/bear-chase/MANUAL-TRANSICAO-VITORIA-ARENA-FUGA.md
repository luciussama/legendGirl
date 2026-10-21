# Manual: transição da vitória da arena para a fuga

Revisão: 21/10/2026. Contrato implementado no código atual; critérios e validação recomendada permanecem como referência de manutenção.

## Objetivo

Ao derrotar o urso na arena, a campanha deve sair diretamente da arena e iniciar
a sequência da fuga 3D. A tela escurece para ocultar a troca de fase; a primeira
imagem revelada é a introdução da fuga, com o urso caído e a menina com a espada
nas mãos.

Não deve aparecer entre as duas fases a exploração normal da Toy Room, o banner
de vitória da sala, o baú ou um menu. A ida ao baú continua pertencendo ao final
da fuga, quando a menina alcança o urso.

## Sequência esperada

1. A luta termina com o resultado `VICTORY`.
2. A arena bloqueia novas entradas e conclui sua apresentação de vitória.
3. A tela faz um fade até ficar totalmente escura.
4. Sob a tela escura, o jogo encerra a apresentação da arena e prepara a fase da
   fuga, incluindo os recursos necessários para desenhá-la.
5. Quando a fuga estiver pronta, ela começa no estado introdutório do urso
   caído, sem avançar a simulação enquanto os recursos carregam.
6. A tela revela essa introdução. O urso está caído; a menina aproxima-se
   lentamente, claramente portando a espada.
7. A abertura existente conduz ao levantar e à arrancada do urso; só então a
   corrida 3D começa.
8. O percurso prossegue até seu encerramento atual, quando o urso é levado ao
   baú uma única vez.

A implementação atual usa 30 quadros (0,5 s a 60 Hz) para escurecer a arena e
0,4 s para revelar a abertura depois que o carregamento termina. A simulação e
as entradas ficam bloqueadas durante a revelação.

## Comportamento e limites

- Aplicar a transição apenas ao resultado de vitória da arena. Derrota,
  interrupção, retorno manual e restauração de saves antigos devem preservar
  seus fluxos atuais.
- Durante o fade, ignorar entradas de gameplay e impedir que a arena e a fuga
  avancem simultaneamente.
- Iniciar a fuga a partir de um estado novo e válido, não do acesso isolado de debug nem de
  um snapshot antigo que possa começar no meio da corrida.
- Manter a abertura existente: as etapas `BEAR_DOWN`, `GIRL_APPROACH` e
  `BEAR_RISE` são atualmente ilustradas em Canvas 2D; a apresentação WebGL 3D da
  corrida começa depois, em `CHASE_START`. A transição de campanha deve preservar
  essa composição e revelar primeiro o urso caído.
- A espada deve estar visível e legível nas mãos da menina já na introdução.
  Conferir enquadramento, pose e oclusão em retrato e paisagem. Não substituir
  essa exigência por uma espada que só apareça depois da corrida.
- Preservar a arte, identidade, proporções e paleta já aprovadas para cada
  personagem. Não alterar física, combate, duração da arena, dificuldade ou
  regras de colisão como parte desta integração.
- Não antecipar a ida ao baú nem marcar o retorno do urso como concluído na
  transição da arena. O efeito final da fuga continua sendo responsabilidade do
  estado terminal existente da perseguição.
- Registrar a vitória e a conclusão da arena uma única vez, preservando os
  dados de exploração e o contrato de saves antigos. O retorno de vitória à
  Toy Room não pode restaurar uma cena visível entre o fade e a fuga.
- Se a preparação da fuga falhar, não deixar uma tela preta permanente nem
  iniciar uma fase parcialmente pronta. Exibir/registrar o erro pelo mecanismo
  já adotado no jogo e manter uma saída recuperável, sem apresentar sucesso
  falso.

## Pontos de integração

| Área | Papel na alteração |
| --- | --- |
| `ToyRoomArenaPhase` | Direcionar `VICTORY` ao destino `CHASE`, aplicar o fade de 30 quadros e restaurar a exploração com áudio suspenso antes de ceder a fase. Derrota e saves antigos com retorno à sala conservam `RETURNING` para `ROOM`. |
| `ToyRoomPhase` | Coordenar posse, entradas e preparação. `startChasePreview()` segue isolado para debug; `startChaseCampaign()` inicia a fuga da campanha, com recuperação explícita se a preparação falhar. |
| `BearChasePhase` | Preparar renderer e artes sob tela preta; na campanha nova, preservar `BEAR_DOWN` (ou retomar a etapa salva no restore) e revelar a cena em 0,4 s antes de avançar a simulação. |
| `ChaseSimulation` / `ChaseIntroRenderer` | Preservar a entrada em `BEAR_DOWN`, a progressão da introdução e a entrega à corrida. Conservar a espada visível na pose inicial ilustrada. |
| Persistência da Toy Room | O snapshot de campanha inclui `toyRoomChaseCampaign` apenas quando a fase está em modo campanha. O acesso isolado de debug continua fora do save. Ao restaurar, rejeitar combinações incompatíveis e retomar a etapa salva; saves anteriores sem o campo continuam válidos. |

O handoff tem um único responsável por iniciá-lo. O preparo assíncrono acontece
sob a tela preta; somente após sucesso a introdução é revelada. Ao descartar uma
fase, callbacks tardios são ignorados para não ressuscitar a arena ou iniciar
duas fugas.

## Critérios de aceite

- Uma vitória completa na arena leva, sem tela intermediária visível, à
  introdução da fuga.
- A tela fica totalmente escura durante a troca; não há flash da Toy Room,
  sobreposição do HUD da arena ou quadro WebGL de corrida antes do momento
  definido pela abertura.
- O primeiro quadro revelado mostra o urso caído e a menina com a espada nas
  mãos; esse resultado é legível em retrato e paisagem.
- A introdução progride uma única vez por vitória, na ordem existente, e entrega
  o controle à corrida 3D depois que o urso se levanta e foge.
- Nenhuma entrada de combate ou movimento da sala atravessa o fade; não há
  avanço duplicado, dois loops de animação ou áudio simultâneo indevido.
- A vitória e o save da campanha permanecem consistentes após recarga; saves
  antigos e resultados que não sejam vitória continuam usando seus caminhos
  anteriores.
- O urso não vai ao baú na saída da arena. A conclusão da corrida continua
  levando-o ao baú uma única vez; derrota da fuga não simula captura.
- Falhas de carregamento não deixam a campanha presa no preto e são reportadas
  explicitamente.

## Validação recomendada

1. Cobrir com teste de domínio/controlador a detecção de vitória, a guarda contra
   início duplicado e a preservação dos demais resultados da arena.
2. Fazer QA de navegador atravessando a arena real até a introdução da fuga,
   verificando os quadros de fade, o primeiro quadro revelado, espada, ordem das
   etapas e ausência de sala intermediária.
3. Repetir em retrato e paisagem, teclado, toque e gamepad; confirmar pausa,
   perda de foco, carregamento, restauração de save e descarte de recursos.
4. Completar a fuga para verificar que somente seu final aplica a ida ao baú e
   que a derrota da fuga continua terminal, sem captura.
5. Rodar `npm test`, build, verificação de assets, `npm run docs:sprites` se
   houver alteração visual ou de consumidores, e `git diff --check`.

Registre testes, capturas e resultados no diário de IA conforme o fluxo do
projeto. A integração de fluxo e persistência está implementada, incluindo o
caminho de sucesso com WebGL 2. Falhas de preparação exibem um diálogo com o erro
e a ação “Voltar à sala”, depois do descarte da fase parcial. A aprovação artística
da nova sequência continua separada da validação técnica; os resultados e limites
das verificações ficam no diário de IA.
