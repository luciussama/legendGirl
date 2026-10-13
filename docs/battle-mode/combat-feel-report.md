# Relatório de sensação de combate — Prompt 19A

**Implementação automática: concluída para feedback de combate. Certificação perceptiva: pendente.**

## Alterações

- Os nove ataques da IA têm assinaturas sonoras distintas desde o início da antecipação.
- Passos do jogador e de cada brinquedo, salto e aterrissagem emitem sons com temporização limitada para evitar repetição excessiva.
- O ataque da espada deixou de tocar o som alegre de coleta. Agora usa som de ataque e, quando acerta, som de impacto do adversário no mesmo passo de simulação do dano.
- Acertos iniciam flash intermitente e animação `HIT` do brinquedo, ou pose `damage`, recuo visual breve e flash da menina.
- Impactos válidos criam faísca/estouro no local do impacto. O efeito só aparece após dano confirmado; não desenha hitbox, régua ou linha sobre a arena.
- Impactos comuns pausam a simulação por 1 quadro; golpes do Urso, por 2. O tremor é limitado ao cenário da arena, decai por 10 quadros e é mais intenso para o Urso.
- A reação da menina interrompe o ataque/agachamento atual por apresentação, sem impor atordoamento permanente nem mover a posição física.
- Vitória, derrota, dano/morte dos brinquedos, fúria, transferência de corações, início da arena e entrada/retorno dos adversários têm eventos de áudio associados.
- Toy Leap agora usa alcance de 118 em vez de 155. Isso elimina o dano no caso de 154,9 com vão visível medido de 36,93; um caso de sobreposição a 110 continua causando dano.

## Limite de autoria da espada

Os oito quadros do spritesheet de ataque existente continuam sendo apresentados como animação completa. A alteração nesta tarefa removeu o som errado de coleta e preserva a sequência/escala; **não redesenhou nem repintou os oito quadros**. A aprovação de que a mão parece agarrar o cabo e de que o pulso se move naturalmente requer revisão da arte renderizada por pessoa. Esse achado não deve ser marcado como corrigido só porque a sequência anima.

## Verificações executadas

Os seis retestes obrigatórios passaram nesta revisão:

- `npm test`
- `npm run test:toy-room:qa`
- `npm run test:toy-room:battle`
- `npm run test:battle:polish`
- `npm run test:battle:fairness`
- `npm run build`

`npm run test:battle:fairness` passou nos testes de Rocket Punch e Laser Beam e em 886 amostras de pose sem divergência entre máscara renderizada, projeção e dano. A campanha automatizada Trem → Robô → Dinossauro → Urso passou com recarga e save/load em diferentes passos de tempo; isso não conta como sessão humana.

Não foi realizada medição de áudio/latência física nem teste perceptivo. Os resultados acima são verificações automatizadas do evento lógico, não aprovação de jogador.
