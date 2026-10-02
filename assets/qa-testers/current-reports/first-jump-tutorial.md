# Primeiro salto — tarefas 2, 3 e 4: instrução, conclusão e feedback visual

Durante `FIRST_JUMP_TUTORIAL`, a instrução fica próxima da menina, acima dos atores e da região de chegada. Uma seta aponta para o centro do primeiro apoio e termina antes de sua ilustração. O aviso genérico de rodapé é retirado nesse estado.

| Entrada | Mensagem | Captura |
| --- | --- | --- |
| Touch | TOQUE NA TELA PARA PULAR | [Touch](../current-screenshots/first-jump-tutorial/touch.png) |
| Teclado | PRESSIONE ESPAÇO | [Teclado](../current-screenshots/first-jump-tutorial/keyboard.png) |
| Mouse | CLIQUE COM O MOUSE | [Mouse](../current-screenshots/first-jump-tutorial/mouse.png) |
| Gamepad Xbox | PRESSIONE A | [Xbox](../current-screenshots/first-jump-tutorial/gamepad.png) |

Detecção inicial: gamepad conectado, capacidade touch/user agent móvel ou teclado. Após uma entrada, a instrução acompanha o dispositivo observado; mouse e teclado são diferenciados. A desconexão do gamepad permite retornar à detecção disponível. Durante esse tutorial, uma nova pressão de A dispara o primeiro salto válido; botão já segurado não conclui automaticamente. O mapeamento X do gameplay existente permanece intacto.

Validação automatizada: `node scripts/test-first-jump-prompt.js` e, com servidor :3000 e Chrome dedicado/CDP :9222, `node scripts/test-first-jump-prompt-browser.js`. A revisão de layout pausa explicitamente o jogo ao emitir as entradas; os quatro cenários passaram sem sobreposição nem alteração da pose durante essa revisão. Painel e destino não se sobrepõem à menina; a fadinha também permanece fora do painel. [Resultados de layout](../current-logs/first-jump-tutorial.json).

Os testes de navegador usam eventos/handlers sintéticos de touch, mouse e teclado e a API de gamepad simulada com botão A. As imagens foram inspecionadas. Não se declara teste de smartphone ou controle Xbox físico. Nenhuma física, colisão, velocidade ou fase foi alterada. A conclusão ocorre somente após o salto físico aceito, preservando o impulso original.

## Conclusão única por save

`firstJumpTutorialCompleted` começa em `false`. Toque primário, clique esquerdo, Espaço ou nova pressão de A podem concluir o tutorial; seta para cima, X, entrada repetida, pausa e tentativa sem solo não concluem. Após o salto aceito, o estado passa a `GAMEPLAY_NORMAL`, a entrada é liberada, o painel/seta deixam de ser desenhados e a conclusão é salva imediatamente.

Retry e restauração mantêm a conclusão. `newCampaign` restaura a flag para `false`. Saves antigos já iniciados recebem conclusão verdadeira na migração; saves anteriores que aguardavam `FIRST_JUMP_TUTORIAL` continuam aguardando seu primeiro salto.

Validação: `node scripts/test-first-jump-completion-browser.js` verificou as quatro entradas, impulso normal, retorno do movimento, remoção da interface, flag no localStorage, retry, restauração e campanha nova. [Resultados](../current-logs/first-jump-completion.json). `test-campaign-progress.js`, `test-opening-sequence.js` e `test-foot-contact.js` também passaram. Entradas móveis/gamepad continuam simuladas no Chrome; não se declara teste de hardware real.

## Feedback visual — tarefa 4

A instrução inclui dedo tocando, tecla Espaço, mouse com clique destacado ou botão A verde, conforme a entrada detectada. A seta flutua sobre a primeira plataforma, separada da ilustração. Ícone e seta recebem escala suave; o brilho discreto e a flutuação acompanham um ciclo de 1,6 segundo. Não há janela modal nem tela adicional.

A animação usa o relógio visual, independente do progresso da simulação. A preferência `prefers-reduced-motion` mantém escala, brilho e posição estáveis. Nenhuma mecânica, parâmetro de física, layout ou lógica de câmera foi alterado nesta tarefa.

O teste unitário verificou escala, brilho, flutuação e movimento reduzido. O teste de navegador mediu três amostras da escala em cada uma das quatro entradas: a animação avançou enquanto personagem, câmera e tick permaneceram iguais. O teste de conclusão também passou após a alteração visual. As capturas acima foram atualizadas e revisadas: personagem, fadinha e destino permanecem visíveis.

Mensagem, símbolo de entrada e seta apresentam a ação e o destino diretamente na fase. A compreensão por jogadores sem documentação ainda requer observação com usuários; não foi realizado estudo de usabilidade.
