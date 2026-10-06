# Fadinha ilustrada — primeira fase e percurso completo

6 de outubro de 2026. **Substituição integrada e playtest automatizado completo aprovado** em desktop, retrato e paisagem. Foi reutilizado o PNG aprovado da Toy Room, sem gerar, editar ou duplicar arte e sem adicionar recurso ao manifesto.

## Resultado

`assets/art/toy-room/stage3/illustrated-fairy-v1.png` aparece na abertura, no quarto escuro, na fuga, no retorno e nos retratos de diálogo. O renderizador é compartilhado pelos trechos do quarto; manter a imagem nesses trechos evita retornar à fada geométrica após uma transição. A Toy Room mantém sua integração previamente aprovada.

O desenho no mundo tem dimensão máxima de 32 px, proporção natural e centro lógico preservado. O acompanhamento, velocidade, partículas, posição de luz, física, colisões, plataformas, dificuldade e progressão não mudaram. Aura, rastro e movimento existentes permanecem. A origem do feixe cinematográfico foi alinhada à estrela da varinha do PNG. A moldura dos retratos e o layout/texto dos diálogos continuam iguais.

Produção alterada: `FairyRenderer.js`, `DialogueRenderer.js`, passagem de assets em `game.js` e `OpeningSequence.js`. Nos dois coordenadores, somente argumentos de renderização foram alterados. Existem fallbacks anteriores para recurso indisponível; não foram usados no caminho normal validado. O manifesto continua com 86 recursos.

## Inconsistências encontradas e corrigidas

1. A abertura não encaminhava o AssetManager ao renderizador da fada: a nova imagem apareceria apenas após o despertar. A passagem foi corrigida.
2. Os diálogos mantinham a fada vetorial azul no retrato, enquanto a personagem no mundo já era ilustrada. O mesmo PNG passou a preencher o retrato, dentro da moldura existente.
3. O ponto anterior do feixe precisava corresponder à varinha ilustrada. A origem agora acompanha a estrela na posição proporcional do recorte.

A inspeção confirmou leitura da figura no quarto escuro e correspondência entre sprite e retrato. Não houve medição de reconhecimento com jogadores ou crianças.

## Gameplay completo

[Resumo e hashes](validacao.json). [Comparação visual](comparacao.html).

| Perfil | Enquadramento solicitado | Percurso de apoios | Brinquedos guardados | Exceções JavaScript |
| --- | --- | --- | --- | --- |
| Desktop | 960×540 | 22 na ida + 16 no retorno | 8 | 0 |
| Retrato Android emulado | 390×844 | 22 na ida + 16 no retorno | 8 | 0 |
| Paisagem emulada | 915×412 | 22 na ida + 16 no retorno | 8 | 0 |

**114 apoios e 24 armazenamentos no total.** O percurso inclui abertura completa, primeiro salto obrigatório, cinemáticas, desbloqueios, fuga, falsa porta/revelação, retorno, portal verdadeiro, chegada à Toy Room, caminhada até cada brinquedo e até o baú, coleta e vitória. As capturas podem ter resolução interna diferente do viewport: o enquadramento usa o comportamento de Canvas do jogo.

O playtest usa o jogo real em uma página de instrumentação exclusiva de QA. Avança seu relógio quadro a quadro e aciona as funções reais de salto/diálogo. Para encontrar o momento de salto, restaura o estado local da tentativa e testa atrasos; não coloca a menina diretamente em plataformas. Na Toy Room, busca caminhos livres e aplica vetores de movimento ao controlador real, passando por colisões; não prepara posições junto aos itens. É um percurso automatizado, não uma sessão humana ou teste em aparelhos físicos.

A instrumentação antiga não incluía a origem de teclado exigida pelo tutorial atual e presumira movimento antes do primeiro salto. Ela foi atualizada em `tests/dark-room-playthrough.html` e no runner existente, sem modificar o tutorial do jogo. O novo runner registra comparações antes/depois nas cenas narrativas. A asserção de integridade dessas capturas compara personagem, fada e simulação; o cache visual da câmera pode recalcular a composição de diálogo ao desenhar.

Evidências por perfil: [desktop](desktop/percurso.json), [retrato](android/percurso.json), [paisagem](landscape/percurso.json). Inventários de cenas: [desktop](desktop/estados-visuais.json), [retrato](android/estados-visuais.json), [paisagem](landscape/estados-visuais.json). Coleta: [desktop](desktop/brinquedos.json), [retrato](android/brinquedos.json), [paisagem](landscape/brinquedos.json). Logs finais: [desktop](desktop.log), [retrato](android.log), [paisagem](landscape.log).

`npm test`, lint, check-assets, sintaxe dos módulos/scripts e `git diff --check` aprovados. [Suíte](testes.log). Para reproduzir, servidor :3001 e Chrome isolado com CDP :9222:

```sh
node scripts/test-fairy-full-gameplay-browser.js desktop
node scripts/test-fairy-full-gameplay-browser.js android
node scripts/test-fairy-full-gameplay-browser.js landscape
```

## Limites visuais restantes

- O PNG possui uma pose e expressão fixas. A fada continua se movendo pelas trajetórias do jogo, mas as asas pintadas não batem e o retrato não alterna expressões de humor. Animar essas partes exigiria arte adicional; nenhum novo sprite foi criado nesta tarefa.
- Algumas trajetórias existentes aproximam a fada da cabeça/cabelo da menina, principalmente na abertura urgente e na primeira cinemática. As capturas mostram essa composição. Não foram deslocadas entidades para esconder o achado.
- As cores dos efeitos e demais personagens/retratos não foram redesenhadas. Não foi feita uma nova auditoria global da primeira fase.

Não foram encontrados bloqueios de progressão ou regressões funcionais nos três percursos completos. A substituição não certifica ausência de todo problema visual possível. Os saves do usuário não foram acessados: a execução usou perfil isolado de Chrome.
