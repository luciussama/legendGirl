# Toy Room — transição pelo Grande Portal dos Sonhos

Data: 6 de outubro de 2026. **Resultado: APROVADO nos testes automatizados e na inspeção das capturas.**

A entrada pelo portal agora executa o clarão branco, a adaptação da visão, a reação cômica da fadinha, sua exploração, a reflexão, a decisão e o zoom de apresentação da sala. O gameplay começa após o enquadramento final, com `TOY_ROOM_START`. A entrada direta de teste e a retomada de um save já na Toy Room conservam o início normal da fase.

## Tempos e falas

| Cena | Duração | Apresentação |
| --- | --- | --- |
| TR_001 | Evento | `PHASE1_COMPLETE` após a travessia; entrada bloqueada durante a introdução |
| TR_002 | 0,8 s | Clarão branco; efeitos sonoros de saída do portal e magia suave |
| TR_003 | 2,5 s | Visão clara, desfocada e com contraste reduzido; revelação progressiva do piso, trilhos, tapetes, brinquedos e móveis |
| TR_004 | 4 s | Trajetória em zigue-zague, curva e retorno; “O QUÊ?!” |
| TR_005 | 4 s | Exploração da esquerda, centro, direita, baú e brinquedos; “Aqui tá bagunçado também?!” |
| TR_006 | 7 s | Primeira frase por 3,1 s; pausa de 0,8 s; segunda frase por 3,1 s |
| TR_007 | 2 s | Batida de asas e pequeno salto; “VAMOS LÁ!”, pausa, “TEMOS QUE GUARDAR TUDO!” |
| TR_008 | 3 s | Zoom suave até mostrar a sala inteira; música entra gradualmente |
| TR_009 | Evento | Liberação dos controles, coleta e objetivos; `TOY_ROOM_START` |

**Tempo total: 23,3 segundos**, medidos desde `PHASE1_COMPLETE` até `TOY_ROOM_START`. A travessia existente do portal antecede essa medição. A ampliação de TR_006 de 3 para 7 segundos foi autorizada pelo usuário para priorizar a leitura. As frases são “Por que o mundo tem que sempre virar uma bagunça?” e “Será que as coisas nunca vão ficar organizadas?”.

## Validação

| Verificação | Resultado / evidência |
| --- | --- |
| Suíte existente do projeto | APROVADO — [registro](validacao-final.log) |
| Sequência, eventos únicos, cancelamento, pausa entre frases e enquadramento final | APROVADO — [registro](sequencia.log) |
| Desktop, 960×540 | APROVADO — [transição](desktop/transicao.json), [percurso](desktop/percurso.json), [registro](desktop.log) |
| Celular em retrato, 390×844 | APROVADO — [transição](android/transicao.json), [percurso](android/percurso.json), [registro](android.log) |
| Celular na horizontal, 915×412 | APROVADO — [transição](landscape/transicao.json), [percurso](landscape/percurso.json), [registro](landscape.log) |
| Mecânicas existentes e volume/mudo/pausa da música | APROVADO — [integridade](integridade-mecanicas.json), [registro](integridade.log) |

Cada percurso atravessou 22 apoios de ida e 16 de retorno usando a física existente, entrou pelo portal, executou a introdução, movimentou a personagem e guardou os oito brinquedos até a vitória. Nos quadros de cada cena, comandos de teclado, ação e toque foram enviados e o estado da personagem e da sala de apresentação permaneceu igual. Os dois eventos narrativos e os três disparos de áudio ocorreram uma vez por percurso. Nenhuma exceção JavaScript foi registrada nos três formatos.

`triggerAction`, `resolveCollisions`, `update`, `snapshot` e `restore` de `ToyRoomPhase` foram comparados com a versão preservada antes da implementação: **corpos idênticos**. A sala de apresentação é criada sem listeners e não recebe atualizações da simulação. As mudanças na Toy Room abrangem somente a opção de apresentação e o enquadramento de saída da introdução. Nenhuma arte nova foi criada; a fadinha usa o PNG ilustrado existente.

O envelope de música é separado do volume escolhido pelo jogador e do mudo. O teste de áudio confirmou início em zero, avanço do fade, preservação do volume, silêncio em mudo e pausa/retomada. O checkpoint é registrado antes da introdução e saves transitórios são ignorados; sair durante a cena conserva o checkpoint anterior. A repetição por recarga e a pausa do loop foram revisadas no código, sem um teste separado de navegação/recarregamento.

## Capturas

- [Galeria das cenas nos três formatos](capturas.html).
- [Clarão](desktop/TR_002-3.png), [adaptação visual](desktop/TR_003-1.png), [surpresa](desktop/TR_004-2.png), [exploração](android/TR_005-2.png).
- [Segunda frase em retrato](android/TR_006-3.png), [decisão](desktop/TR_007-1.png), [sala inteira no fim do zoom](desktop/TR_008-final.png).

## Problemas encontrados e resolvidos

1. Um teste histórico extrai `doJump` fora da função principal. A referência direta ao controlador da introdução causou erro nesse teste; a guarda foi ajustada e a suíte voltou a passar.
2. O harness de percurso força mudo por padrão. Isso invalidou a primeira verificação do volume do fade; o teste da transição passou a habilitar áudio explicitamente e foi repetido com sucesso.
3. Uma execução móvel não encontrou aba aberta no Chrome de teste. O runner passou a criar sua própria aba antes do percurso.
4. A câmera da exploração precisava acompanhar a fadinha em telas estreitas. O enquadramento foi ajustado e os percursos finais passaram.
5. Cancelar a introdução antes de salvar poderia persistir um estado transitório ao sair. A ordem foi corrigida para preservar o checkpoint do portal.

Não houve softlock, fade preso ou falha de coleta nos percursos finais. A compreensão narrativa e a facilidade de leitura são avaliações de inspeção; **não houve playtest com jogadores novos ou crianças**. Os testes de áudio verificam execução e estado, sem uma avaliação humana da mixagem. Pendências artísticas das auditorias anteriores permanecem fora desta implementação.

O trabalho termina com esta transição e suas evidências; nenhuma etapa posterior foi iniciada.
