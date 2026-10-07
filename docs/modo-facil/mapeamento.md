# Mapeamento antes da implementação

Análise estática do código atual, em 07/10/2026. As classificações representam risco de frustração; não são medições de frequência de quedas de jogadores.

| Trecho | Risco | Evidência e intervenção proposta |
| --- | --- | --- |
| Abertura e primeiro salto | BAIXO | Cena bloqueia controles e tutorial exige entrada explícita. Preservar integralmente. |
| Dark Room, apoios estreitos e bordas | MÉDIO | `game.js` exige sobreposição horizontal estrita e pés entre o topo e 16 unidades abaixo. No FÁCIL, oferecer margem limitada de 4 unidades por borda e janela vertical de 24. |
| Castelo, plataforma 9 → 10 | BAIXO | Já há pausa e assistência de pouso próprias do jogo. Não alterar. |
| Fuga e subida após porta falsa | ALTO | Velocidade e potência crescem por nível; falhas repetem trechos (`GameState.resetToStart`). Aplicar apenas a margem de pouso; preservar progressão, retries, velocidades e checkpoints. |
| Porta falsa e verdadeiro portal | BAIXO | Sequenciadores narrativos controlam transições. Não alterar cenas, gatilhos ou objetivos. |
| Toy Room | MÉDIO | Exploração, identificação, transporte e organização exigem atenção. A fada já aponta o brinquedo disponível mais próximo. No FÁCIL, aproximar a guia do alvo mais rapidamente; preservar seleção, coleta e organização manuais. |
| Save/restore e recarga | ALTO | Schema valida todas as chaves do estado. Adicionar dificuldade com migração de saves antigos para NORMAL; restaurar dificuldade antes de criar Toy Room. |

Decisão: assistência pequena e isolada; nenhuma plataforma desenhada será modificada. Nenhuma etapa, obstáculo ou interação será removida. Não adicionar teletransporte ou conclusão automática. Não modificar a assistência histórica do castelo.
