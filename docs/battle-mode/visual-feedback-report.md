# Relatório de feedback visual — Prompt 19A

**Resultado: feedback de impacto implementado e validado automaticamente; aprovação perceptiva humana pendente.**

## Verificação por sistema

| Sistema | Resultado | Evidência / limite |
| --- | --- | --- |
| Animação e antecipação de ataque | Implementadas | As animações existentes foram preservadas; Bite/Rush e os nove ataques têm assinaturas de ação distintas. |
| Faísca/estouro | Implementado | Desenhado no local do dano confirmado, não em esquiva ou erro. |
| Flash de impacto | Implementado | O alvo pisca no estado de hit. |
| Reação dos brinquedos | Implementada | Trem, Robô, Dinossauro e Urso entram em `HIT`, com interrupção/recuo visual e recuperação. |
| Reação da menina | Implementada | Pose `damage`, flash e recuo visual breve em dano comum; sem alterar posição física. |
| Pausa de impacto | Implementada | 1 quadro em acertos comuns e 2 em golpes do Urso. |
| Tremor | Implementado | Limitado à arena, decai em 10 quadros; o HUD permanece fora da transformação. |
| Feedback fora do HUD | Implementado tecnicamente | Confirmação visual vinculada a dano aplicado; percepção sem olhar HP requer playtest. |

## Justiça de contato

- **Toy Leap:** alcance reduzido de 155 para 118. O teste estrito confirma ausência de dano a 154,9 (vão visual anterior de 36,93) e dano com sobreposição a 110. Consulte [evidência atualizada de contato do Toy Leap](certification-evidence/DEFECT-008/toy-leap-contact.json).
- **Rocket Punch:** projeção de dano agora usa a máscara alfa da luva desenhada e a pose futura após física. O teste compara pixels renderizados, projeção e dano em 886 amostras, sem divergências.
- **Laser Beam:** verificações automatizadas de em pé, agachado, borda e salto passaram sem divergências.

## Limites e política visual

Os retestes `npm test`, `npm run test:toy-room:qa`, `npm run test:toy-room:battle`, `npm run test:battle:polish`, `npm run test:battle:fairness` e `npm run build` passaram. Não foram criadas linhas de contato, régua ou sobreposições de hitbox na apresentação normal. Testes automatizados não comprovam leitura sem HUD, qualidade perceptiva do shake, nem desempenho/latência em dispositivo real.

**Decisão:** PASS de feedback implementado e fairness automatizada; aprovação humana de legibilidade pendente, com 0/5 campanhas humanas registradas.
