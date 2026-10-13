# Playtest de batalha — Prompt 16

**Resultado funcional: PASS WITH OBSERVATIONS.** O registro anterior do Prompt 15 estava PENDING pelo gate visual. Esta execução usa a autorização posterior para avaliação controlada.

| Execução | Resultado |
| --- | --- |
| Node, dt 0,5 | VICTORY em 1166 atualizações; Trem → Robô → Dinossauro → Urso; menina 3 HP; recarga durante combate. |
| Node, dt 1 | VICTORY em 583 atualizações; mesma ordem, HP e recarga. |
| Node, dt 3 | VICTORY em 182 atualizações; mesma ordem, HP e recarga. |
| Chrome, canvas 960×540, recursos reais | Exploração NORMAL em 9709 atualizações, 11 coletas e seis recargas; batalha em 583 atualizações, quatro derrotados, 3 HP e uma recarga; 144 PNGs carregados. |
| Derrota por ataques da IA | Menina 0 HP; DEFEAT; retorno ao título após espera. |
| Conclusão | VICTORY após morte do Urso; callback de retorno ao título validado. |
| Repertórios isolados | Dois ataques por brinquedo comum e três do Urso exercitados, com esquiva por inputs. |
| Persistência do impacto/Enrage | Recarga não duplica dano; Urso em 1 HP entra em ENRAGE. |

Testes de transferência cobrem máximos 2, 3 e 4, cura abaixo do máximo, descarte de excesso, alvo sem vida e cura efetiva do inimigo por dano à menina. Salto e agachamento mantêm a profundidade fixa; cima mantido não cria saltos automáticos.

As execuções rápidas com inputs automatizados demonstram funcionamento, não dificuldade adequada para jogadores. A página de QA oferece observação contínua e controles manuais. Não foram usados adversários estáticos ou placeholders. Defeitos de desenho conhecidos e verificações em hardware real estão no [backlog](known-issues-backlog.md).

## Regressão posterior — Prompt 18

A [revisão de certificação](fairness-certification-report.md) manteve o percurso da espada ao final em 1164 atualizações com dt 1, 3 HP, ordem dos quatro inimigos e recarga. No Chrome, foram 11 coletas e seis recargas de exploração antes da batalha. A apresentação passou a carregar 146 imagens, mantendo as 26 sequências do manifesto. Os seis comandos obrigatórios passaram na versão final, mas a certificação geral permanece FAIL por Robot Walk e pelo alcance de impacto de Toy Leap sem representação correspondente. Não substitui os resultados históricos das versões anteriores.
