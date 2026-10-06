# Toy Room — tutorial inicial e guia da fadinha

Data: 6 de outubro de 2026. **APROVADO nos testes automatizados e na inspeção das capturas.**

O tutorial inicia depois de `TOY_ROOM_START`, ao terminar a apresentação da sala. O estado `TOY_ROOM_TUTORIAL` mantém o controle livre. A fadinha explica como andar e informa o primeiro objetivo: pegar um brinquedo e levá-lo ao baú.

O primeiro deslocamento real, superior a 2 pixels, encerra a dica de movimento. A guia escolhe somente entre os oito brinquedos coletáveis que não estão carregados ou guardados. Ela voa suavemente até uma posição acima do recorte e da placa do brinquedo; quando chega, mostra a instrução de coleta. Uma indicação junto ao botão real reforça a ação. Nenhuma régua de contato, hitbox ou marca de plataforma foi adicionada.

Se o jogador ficar a mais de 280 pixels do alvo e outro brinquedo estiver pelo menos 40 pixels mais próximo, a guia troca de alvo. Um intervalo de 30 quadros limita trocas sucessivas. A posição é interpolada pelo comportamento de voo existente, sem teleporte. Não há alteração de pathfinding.

Na primeira coleta bem-sucedida, as mensagens desaparecem, o alvo é removido e a fadinha volta suavemente ao acompanhamento normal. `toyRoomTutorialCompleted` é persistido no snapshot da Toy Room. Recarregar a campanha conserva a conclusão; uma nova campanha apresenta o tutorial novamente.

## Controles

| Dispositivo | Movimento | Coleta |
| --- | --- | --- |
| Toque | TOQUE E ARRASTE NA TELA PARA ANDAR | TOQUE NO BOTÃO PEGAR |
| Teclado e mouse | USE W A S D OU AS SETAS PARA ANDAR | PRESSIONE E PARA PEGAR |
| Gamepad padrão | USE O ANALÓGICO ESQUERDO PARA ANDAR | PRESSIONE X PARA PEGAR |

A Toy Room não tinha movimento por gamepad: o controlador global ignorava essa fase. **O usuário autorizou adicionar analógico esquerdo e X.** O novo adaptador fornece o vetor ao cálculo de movimento existente e chama `triggerAction()` na borda de pressionamento de X. Segurar o botão não repete a coleta/soltura. A desconexão limpa o vetor e devolve a instrução ao dispositivo disponível. Teclado e toque também atualizam as dicas durante o tutorial.

As instruções de ação e os handlers consultam a mesma configuração `TOY_ROOM_INPUT`. Não existe uma interface de remapeamento na versão atual; as teclas alternativas Space, Enter e F foram preservadas.

## Testes executados

| Teste | Resultado | Evidência |
| --- | --- | --- |
| Suíte existente do projeto | APROVADO | [registro](suite.log) |
| Tutorial e gamepad: estado, movimento, alvo, troca, coleta, save, X mantido e desconexão | APROVADO | [registro](tutorial.log) |
| Comparação com a versão anterior | APROVADO | [integridade](integridade.json), [registro](integridade.log) |
| Chrome desktop, 960×540, teclado | APROVADO | [resultado](desktop/resultado.json), [registro](desktop.log) |
| Chrome com Android/toque emulado, 390×844 | APROVADO | [resultado](mobile/resultado.json), [registro](mobile.log) |
| Chrome desktop, gamepad padrão simulado | APROVADO | [resultado](gamepad/resultado.json), [registro](gamepad.log) |
| Percurso integral: portal, introdução e vitória na Toy Room | APROVADO | [registro](percurso-completo.log), [percurso](percurso-completo/desktop/percurso.json) |

A comparação verificou **4.941 posições de colisão, 960 quadros de movimento e oito coletas, solturas e armazenamentos**. Os resultados físicos, brinquedos, móveis, contagem e vitória foram iguais aos da versão anterior. O método de colisão e o layout também permanecem idênticos. A integração modifica somente a orientação da fadinha, as dicas, a persistência do tutorial e a entrada de gamepad autorizada.

Os testes no navegador acionaram o botão real de ir para a segunda fase, verificaram o tutorial após o evento, enviaram movimento e coleta pelos handlers correspondentes e recarregaram o save. Também verificaram que nova campanha reativa o tutorial. O teste de gamepad verificou a troca de instrução entre teclado e analógico. Não foram registradas exceções JavaScript nesses percursos.

O percurso integral atravessou os 38 apoios da primeira fase, executou a introdução de 23,3 segundos e guardou os oito brinquedos até a vitória. Não houve softlock nem dicas restantes após a primeira coleta.

## Capturas

- [Galeria comparativa dos três dispositivos](capturas.html).
- Movimento: [teclado](desktop/01-movimento.png), [toque](mobile/01-movimento.png), [gamepad](gamepad/01-movimento.png).
- Coleta: [teclado](desktop/02-coleta.png), [toque](mobile/02-coleta.png), [gamepad](gamepad/02-coleta.png).
- [Troca de alvo](desktop/03-novo-alvo.png) e [tutorial concluído](desktop/04-concluido.png).

## Problemas encontrados e tratados

1. Ausência de gamepad na Toy Room: suporte adicionado com autorização explícita, sem alterar as regras de movimento ou coleta.
2. Possível instrução de coleta antes da chegada da fadinha: durante o voo aparece “VENHA COMIGO ATÉ O BRINQUEDO”; a instrução específica aparece ao chegar.
3. Oscilação entre alvos: distância, vantagem mínima e intervalo de troca evitam mudanças sucessivas na fronteira entre brinquedos.
4. A primeira execução do teste clicou antes de terminar a proteção inicial do menu contra cliques repetidos. O runner passou a aguardar essa proteção e o teste foi repetido com sucesso.

Os testes de toque e gamepad foram emulados; **não houve validação com gamepad físico nem playtest com jogadores novos ou crianças**. A compreensão das ações foi avaliada pelas instruções e capturas, sem medição com participantes. As pendências visuais anteriores da sala permanecem fora deste trabalho.

A implementação termina neste tutorial; nenhuma etapa posterior foi iniciada.
