# Toy Room — Urso, chefe final

Versão: 1.0  
Status: Design  
Origem: PROMPT 12 — BEAR FINAL BOSS.

## Papel narrativo e ordem

O Urso é o primeiro brinquedo encontrado e o último inimigo enfrentado. O confronto final com ele sucede os confrontos com os brinquedos inimigos comuns. O gatilho específico de entrada do chefe, sua apresentação e a encenação do primeiro encontro ainda precisam ser definidos.

## HP e ENRAGE

O Urso tem máximo de **4 corações**. **ENRAGE ativa quando resta exatamente 1 coração**, o último.

O roubo de coração das [regras de batalha](battle-mode-rules.md) continua válido: ao causar dano, o Urso retira 1 coração da menina e recupera 1, limitado a 4; ao receber um acerto da espada, perde 1 e a menina recupera 1, limitada a 3. Cura excedente é descartada sem impedir o dano.

Como o Urso pode recuperar vida, ainda falta definir se ENRAGE permanece ativo ou termina quando seu HP sobe de 1 para 2, e como uma nova chegada a 1 é tratada. Não se presume permanência, desativação, bônus de dano ou velocidade.

## Estados oficiais

- `IDLE`
- `APPROACH`
- `ATTACK`
- `RETREAT`
- `ENRAGE`

Esta lista define os estados, não uma sequência automática entre eles. Apenas o gatilho de ENRAGE foi fornecido. Durações, transições dos demais estados e relação entre ENRAGE e as ações de aproximação, ataque e recuo permanecem pendentes.

## Repertório exclusivo

| Ataque | Característica obrigatória |
| --- | --- |
| `Bear Hug` | Abraço de curta distância. |
| `Belly Charge` | Investida pesada. |
| `Toy Leap` | Salto com impacto. |

O Urso nunca recebe golpes novos em produção: somente esses três são permitidos, inclusive durante ENRAGE. As características devem conservar a identidade do brinquedo. Abraço não autoriza aprisionamento por inferência; salto com impacto não autoriza ondas de choque, projéteis ou dano em área por inferência.

## Parâmetros pendentes

- HP inicial, gatilho de entrada e apresentação do chefe.
- Alcances numéricos, velocidades, preparação, duração e recuperação dos três ataques.
- Trajetória e impacto de `Toy Leap`, colisões e interação com salto/agachamento da menina.
- Escolha e frequência dos ataques; transições de estados.
- Efeitos de ENRAGE, persistência após cura e reativação.

Nenhuma pendência autoriza alterar controles, arena, HP máximo, roubo de coração ou condições de resultado já congelados.

## Critérios para implementação futura

- O Urso é o primeiro brinquedo encontrado e o último inimigo enfrentado.
- HP máximo de 4; ENRAGE ativa com 1 coração.
- Os cinco estados usam exatamente os identificadores oficiais.
- O repertório contém exclusivamente `Bear Hug`, `Belly Charge` e `Toy Leap`, preservando suas características.
- Cura e dano mantêm a transferência de 1 coração e os limites aprovados.
- As decisões pendentes são resolvidas antes da produção. Este documento não implementa código, sprites ou integração.

A especificação estruturada está em [bear-final-boss-spec.json](bear-final-boss-spec.json). `null` representa decisão pendente, não default de runtime.
