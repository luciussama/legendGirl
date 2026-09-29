# UX-001 — Prioridade ao início da aventura

Alteração restrita a `index.html` e `src/css/styles.css`.

- Única ação central: **COMEÇAR**, com fundo dourado de alto contraste, largura de até 320 px e altura mínima de 72 px.
- ZIP e pular fase aparecem como ícones discretos na barra superior, com nomes acessíveis e dicas ao passar o cursor. O ZIP usa o controle superior já existente, que abre o mesmo modal do antigo link central.
- O atalho de pular mantém seu identificador e manipulador; CSS oculta o controle quando a tela inicial está oculta, preservando sua disponibilidade anterior.
- Foco de teclado visível e layout adaptado a telas estreitas e baixas.
- Nenhum JavaScript, asset, diálogo, carregamento de fase, animação ou física foi alterado nesta tarefa.

## Validação

`npm run test:pages` aprovado. Chrome: uma única ação central, alinhamento horizontal central e ausência de sobreposição com a barra em 960×580, 390×844 e 667×375. Verificados início do jogo, ocultação do atalho durante o jogo, acionamento de pular fase e abertura do modal ZIP. Resultados em `validacao.json`; reprodução pelo script `verificar.mjs`, com servidor local na porta 3000 e Chrome de teste na porta 9222.

Capturas inspecionadas: [computador](computador.png) e [celular](celular.png). Também disponível: [paisagem](paisagem.png).
