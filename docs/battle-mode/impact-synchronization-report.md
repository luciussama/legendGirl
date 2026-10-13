# Relatório de sincronização de impacto — Prompt 19A

**Resultado: sincronização lógica automatizada aprovada para os eventos implementados; certificação perceptiva final pendente.**

## Método e limites

A análise usa a simulação de batalha em passos de `dt = 1`, correspondentes a um quadro nominal de 60 Hz. O teste automatizado verifica o quadro de disparo dos sons de hit/dano e das reações lógicas. Ele não mede latência real do navegador, do dispositivo de áudio ou da tela, nem substitui inspeção de cada quadro desenhado.

O critério do Prompt 19A é desvio máximo de um quadro. Evento não implementado ou não medido não conta como sincronizado.

## Linha do tempo medida

| Ação / evento | Início do ataque | Detecção e dano | Reação | Som de impacto | Efeito visual de impacto | Resultado lógico |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Espada da menina | quadro 0 | quadro 4, se houver contato | inimigo entra em `HIT` no quadro 4 | som de impacto do ator no quadro 4; o som de ataque toca no quadro 0 | flash, faísca e início de `HIT` no quadro 4 | **0 quadro de desvio medido** entre dano e confirmação de impacto |
| Steam Blast | `elapsed=0` | `elapsed=54` dentro da janela 54–71 | menina entra em `damage` no quadro do dano | `player_hit` e `train_hit` no mesmo passo | flash, faísca, recuo e início de pausa/tremor no mesmo passo | **0 quadro de desvio lógico** |
| Front Charge | `elapsed=0` | `elapsed=54` dentro da janela 54–71 | reação da menina no quadro do dano | `player_hit` e `train_hit` no mesmo passo | feedback de impacto no mesmo passo | **0 quadro de desvio lógico** |
| Laser Beam | `elapsed=0` | `elapsed=54` dentro da janela 54–71 | reação da menina no quadro do dano | `player_hit` e `robot_hit` no mesmo passo | feedback de impacto no mesmo passo | **0 quadro de desvio lógico** |
| Rocket Punch | `elapsed=0` | `elapsed=54` dentro da janela 54–71 | reação da menina no quadro do dano | `player_hit` e `robot_hit` no mesmo passo | feedback de impacto no mesmo passo | **0 quadro de desvio lógico** |
| Bite | `elapsed=0` | `elapsed=54` dentro da janela 54–71 | reação da menina no quadro do dano | `player_hit` e `dinosaur_hit` no mesmo passo | feedback de impacto no mesmo passo | **0 quadro de desvio lógico** |
| Rush | `elapsed=0` | `elapsed=54` dentro da janela 54–71 | reação da menina no quadro do dano | `player_hit` e `dinosaur_hit` no mesmo passo | feedback de impacto no mesmo passo | **0 quadro de desvio lógico** |
| Bear Hug | `elapsed=0` | `elapsed=54` dentro da janela 54–71 | reação da menina no quadro do dano | `player_hit` e `bear_hit` no mesmo passo | feedback reforçado; pausa de 2 quadros e tremor maior | **0 quadro de desvio lógico** |
| Belly Charge | `elapsed=0` | `elapsed=54` dentro da janela 54–71 | reação da menina no quadro do dano | `player_hit` e `bear_hit` no mesmo passo | feedback reforçado; pausa de 2 quadros e tremor maior | **0 quadro de desvio lógico** |
| Toy Leap | `elapsed=0` | a partir de `elapsed=84` até 95, alcance agora 118 | reação da menina somente em contato válido | `player_hit` e `bear_hit` no mesmo passo | feedback reforçado somente em contato válido | **Sem dano no vão visual de 36,93; sobreposição a 110 causa impacto** |

Laser Beam e Steam Blast mantêm suas apresentações na janela ofensiva. As nove ações agora têm sons de ataque próprios; Bite e Rush permanecem com a mesma janela/dano, mas recebem assinaturas sonoras distintas e animações existentes distintas. O teste `scripts/test-combat-impact.js` confirma que, em impactos válidos, som de acerto, registro `IMPACT` e transição de reação são iniciados na mesma atualização.

## Divergência de contato confirmada

O diagnóstico reproduzível anterior registrava dano à distância de 154,9 com vão estimado de **36,93 unidades**. O alcance foi limitado a 118: o novo teste estrito confirma que a menina conserva 3 HP a 154,9 e perde um coração com sobreposição a 110. Ver [evidência atualizada de contato do Toy Leap](certification-evidence/DEFECT-008/toy-leap-contact.json).

O teste estrito de justiça aprovou **886 amostras** de poses, comparando contato da máscara alfa realmente desenhada, projeção usada pelo gate e dano aplicado; houve **0 divergências**. Os casos de Rocket Punch e Laser Beam e os dois pontos de Toy Leap também passaram. Isso não mede latência audiovisual no dispositivo nem substitui revisão visual/humana.

## Retestes obrigatórios

Todos passaram nesta revisão: `npm test`, `npm run test:toy-room:qa`, `npm run test:toy-room:battle`, `npm run test:battle:polish`, `npm run test:battle:fairness` e `npm run build`. A campanha de batalha automatizada percorreu Trem → Robô → Dinossauro → Urso com save/load; não equivale às cinco sessões humanas exigidas.

## Evidências de implementação

- [ToyRoomBattle.js](../../src/js/toy-room/ToyRoomBattle.js): início do golpe da espada, janela de detecção, aplicação de dano, transições `HIT`/`DEFEAT` e ataque de Toy Leap.
- [ToyRoomStory.js](../../src/js/toy-room/ToyRoomStory.js): mantém os quadros do golpe; a espada da batalha usa a API específica de som de combate.
- [BattlePresentation.js](../../src/js/toy-room/BattlePresentation.js): projeções visuais de Rocket Punch e Laser Beam.
- [audio.js](../../src/js/audio.js): perfis sintetizados para os eventos de combate.
- [test-combat-impact.js](../../scripts/test-combat-impact.js): teste dos quadros lógicos de impacto, som, reação, pausa e assinaturas por ataque.

**Decisão:** o desvio lógico aprovado é zero quadros na confirmação de impacto automatizada. A certificação completa continua **pendente** de playtest humano, revisão da integração mão/espada, avaliação auditiva e medição de latência/performance no navegador/dispositivo.
