# Arena imaginária da Toy Room

## Descoberta — card 01

`ToyRoomPhase` mantém o layout 1600 × 1200, colisões, tutorial, brinquedos, câmera de exploração, teclado, joystick e gamepad. `ToyRoomStory` conduz recorrência, investigação e coleta da espada, até `EQUIPPED`. Hoje `ToyRoomPhase.update` ativa `ToyRoomBattle` imediatamente, e `render` delega todo o desenho ao combate. O combate mantém a posição lateral, IA, transferência de corações, entrada/retorno dos quatro brinquedos, efeitos e HUD. A vitória/derrota atual volta ao título.

A câmera de exploração é calculada no controlador principal; o combate usa um enquadramento fixo. `BabyRenderer` usa `official-character`; os ataques vêm de `ToyRoomStory`, e os inimigos do manifesto `battle/remediation`. As artes existentes não devem ser apagadas ou regeneradas como parte da reforma. A ampliação de imagens pequenas precisa de inspeção visual e pode exigir uma prancha mais detalhada.

`ToyRoomPhase.snapshot/restore` serializa objetos da exploração, estado narrativo e combate. `CampaignProgress` armazena esse snapshot no progresso geral. Referências carregadas são reconstituídas por id. Áudio é injetado e oferece trilhas theme/sword e sons de combate. O layout seguro e os controles de toque são compartilhados em `MobileUILayout`.

### Extensões

Uma fase `ToyRoomArenaPhase` será a dona do ciclo transformação/combate/retorno, sem novos listeners. A exploração continuará sendo dona dos brinquedos e do input físico, encaminhando os comandos enquanto a arena estiver ativa. O combate existente será reutilizado como simulação configurável, com parâmetros locais; a apresentação heroica ficará em módulos próprios. A regressão do combate legado continuará exercitando a configuração original explicitamente.

O builder derivará um layout imutável dos móveis originais. Câmera, efeitos, HUD e áudio terão módulos próprios, sem modificar as superfícies ilustradas para indicar colisões. O snapshot da arena incluirá o estado da transformação, simulação, câmera, efeitos, retorno e conclusão. Saves antigos de combate serão migrados.

### Dependências e riscos

- Evitar segundo conjunto de listeners, repetição da espada e reinício após retorno.
- Preservar inventário, brinquedos, posição e câmera antes da entrada.
- Compartilhar configuração de movimento/alcance com a apresentação; manter a simulação legado sem mudança.
- Garantir subpassos e transições reproduzíveis; não usar relógio de parede na simulação.
- Respeitar safe area, orientação e espaço de controles em Android.
- Evitar timers de áudio órfãos e acumulação de partículas.
- Atualizar os runners que assumem entrada imediata, mantendo cobertura explícita do combate anterior.

## Sequência e critério de avanço

Cada card só começa após a execução aprovada dos testes do anterior. Sem validação humana intermediária. A validação humana final será apoiada por capturas e um percurso automatizado completo.

| Card | Implementação | Validação automatizada |
| --- | --- | --- |
| 01 | Descoberta e plano | Suítes existentes sem alteração funcional |
| 02 | Fase com start/finish | Ciclo de vida e regressão |
| 03 | Transformação temporizada | Ordem, bloqueio, save anterior |
| 04 | Builder derivado da sala | Determinismo, origem, posições |
| 05 | Escala heroica | Escala, envelope visual e física preservada |
| 06 | Câmera | Suavidade, limites e enquadramento |
| 07 | Controller exclusivo | Movimento, salto e alcance sem mutação legado |
| 08 | ImpactFX | Eventos sincronizados e orçamento de partículas |
| 09 | Perfil de áudio | Entrada/saída e cancelamento |
| 10 | HUD | Safe area e controles nos formatos móveis |
| 11 | Inimigos heroicos | Spawn e repertórios |
| 12 | Guardião de Pelúcia | Fúria, derrota e retomada |
| 13 | Retorno | Progresso e exploração restaurados |
| 14 | Persistência completa | Todos os checkpoints e saves antigos |
| 15 | Regressão e navegador | Suítes, inputs e percurso com capturas |

## Execução

- Card 01: arquitetura mapeada; `npm test` aprovado. Suítes complementares verificadas antes do card 02.

- Card 02: ciclo de vida da fase e suíte geral aprovados.
- Card 03: transformação, bloqueio de entrada, checkpoint e suíte geral aprovados.
- Card 04: builder determinístico, referências e não mutação da sala aprovados.
- Card 05: ampliação e recuperação seletiva dos quadros detalhados; teste da arena e combate legado aprovados.
- Card 06: convergência suave, enquadramento e persistência da câmera aprovados.
- Card 07: controller separado; corrida, salto, alcance e justiça do combate legado aprovados.
- Card 08: efeitos disparados pela simulação, limite de 80 partículas e suíte de polimento aprovados.
- Card 09: trilha procedural, perfil próprio, saída de áudio e narrativa original aprovados.
- Card 10: HUD nas safe areas e suíte móvel aprovados.
- Card 11: quatro brinquedos heroicos, vitória em dt 0.5/1/3 e combate legado aprovados.
- Card 12: Guardião de Pelúcia com oito corações, fúria a meia vida, entrada e checkpoint aprovados.
- Card 13: retorno automático, posição/câmera da exploração e progresso final aprovados.
- Card 14: checkpoints de todo o ciclo, retorno parcialmente concluído, restauração de save anterior e migração legado aprovados.
- Card 15: suíte geral, QA, polimento, justiça, build e navegador desktop/Android retrato/paisagem aprovados. Repertórios completos, inputs, pausa, derrota e nova tentativa exercitados. Sem commit ou push.

Os testes dedicados ao combate anterior usam `arenaEnabled: false` para continuar exercitando suas regras e sua arte. A configuração padrão e os testes de percurso usam a arena nova. Nenhuma asserção de combate legado foi removida. O runner da exploração aguarda a transformação antes de verificar a entrada na arena.
