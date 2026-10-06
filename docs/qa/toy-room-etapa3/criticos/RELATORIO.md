# Toy Room — Etapa 3: grupos críticos

Data: 6 de outubro de 2026. **Quatro grupos críticos implementados e validados internamente; aguardando revisão do usuário.** Os grupos de prioridade alta não foram iniciados. Esta entrega não declara a Etapa 3 completa.

## Resultado

| Grupo / item da auditoria | Antes | Agora | Resultado observado |
| --- | --- | --- | --- |
| Crítico 1 — V24, poltrona vermelha | E | B | Encosto, dois braços, assento separado, tecido, costuras, pés e sombra integrada tornam a poltrona reconhecível. |
| Crítico 2 — V27, cavalinho | E | B | Cabeça, pescoço, corpo, assento, pernas e duas bases curvas de madeira comunicam cavalinho de balanço. |
| Crítico 3 — V34, Coelhinho | E | B | Pelúcia rosa, olhos, focinho, patas, orelhas e costuras; acabamento compatível com Ursinho e Trem. |
| Crítico 4 — V84, sobreposição HUD/HTML | E | B, composição | Card à esquerda, com espaço reservado para os três controles globais; nenhuma interseção nos enquadramentos reais medidos. |
| Crítico 4 — V62, contador | D | B, legibilidade | Largura calculada pelo texto, duas linhas quando necessário e tamanho adaptado à proporção CSS do Canvas. |

A nota B é avaliação de inspeção visual interna. Não foram feitos testes de reconhecimento com crianças ou jogadores novos; não se afirma medição de identificação inferior a um segundo. A poltrona e o cavalinho exibem silhuetas inequívocas na inspeção. A resposta interna à pergunta “Coelhinho e Ursinho pertencem à mesma coleção?” é **SIM**, sustentada pelo comparativo lado a lado.

As notas do HUD avaliam **ocupação e legibilidade**, conforme o escopo. Sua assinatura gráfica original, incluindo emojis, gradientes e barra, não foi redesenhada nem aprovada como arte final.

## Capturas comparativas

- [Comparativo dos três objetos](comparacao-objetos.png), com recortes ampliados da mesma sala.
- [Ursinho, Coelhinho e Trem lado a lado](colecao-coelho-urso-trem.png), ampliação para inspeção de acabamento.
- [Sala antes](criticos-final-antes.png) e [sala depois](criticos-final-depois.png).
- HUD real [desktop antes](hud-desktop-antes.png)/[depois](hud-desktop-depois.png), [retrato antes](hud-retrato-antes.png)/[depois](hud-retrato-depois.png), [landscape antes](hud-landscape-antes.png)/[depois](hud-landscape-depois.png), [320 px antes](hud-retrato-320-antes.png)/[depois](hud-retrato-320-depois.png).
- HUD durante a introdução: [desktop](hud-desktop-introducao.png), [retrato](hud-retrato-introducao.png), [landscape](hud-landscape-introducao.png), [320 px](hud-retrato-320-introducao.png).
- [Página comparativa](comparacao.html), reunindo os principais resultados.

As capturas da sala por grupo são cumulativas em relação à referência congelada inicial: [grupo 1](grupo1-poltrona-depois.png), [grupo 2](grupo2-cavalinho-depois.png), [grupo 3](grupo3-coelhinho-depois.png), [grupo 4](grupo4-hud-depois.png). Os recortes do comparativo isolam o objeto de cada grupo. As capturas finais do HUD mostram também o comportamento na aplicação real, sem tratar o Canvas interno como se tivesse sempre a largura CSS da tela.

## Alterações visuais e preservação do jogo

### Poltrona

Novo raster `armchair-v1.png`, usando o baú e a mesa da prancha como referência de pintura, material, perspectiva e luz. O desenho é integrado na área anteriormente ocupada por forma e sombra: `(f.x−12, f.y−25, f.w+24, f.h+39)`. Com os dados atuais, 154×159 px em (168,815). A configuração do obstáculo continua `(180,840,130,120)`.

### Cavalinho

Novo raster `rocking-horse-v1.png`, com madeira de carvalho pintada e peças fisicamente conectadas. Desenho em `(f.x−12, f.y, f.w+24, f.h+21)`, 124×101 px em (468,420), dentro da área visual autorizada do objeto e sua sombra. Configuração lógica continua `(480,420,100,80)`.

### Coelhinho

Novo raster `cotton-bunny-v1.png`, usado tanto no chão quanto no transporte pelo renderizador existente. Mantém a largura visual de 32 px e a base em `toy.y+26`; sua proporção natural é preservada dentro do limite anterior de 32×66 px, resultando em aproximadamente 32×50,3 px de ilustração. O conteúdo ilustrado substitui as formas antigas sem ampliar a área anterior. Posição lógica `(460,980)`, dimensões lógicas 38×44, peso, raio de coleta e offsets do transporte permanecem iguais.

O Coelhinho não inclui sombra de chão no PNG, evitando carregar uma sombra junto às mãos. O renderer mantém o comportamento anterior de sombra quando o brinquedo está no chão. O problema geral V39 de família de sombras não foi corrigido nesta intervenção.

### HUD

O contador sai do canto ocupado pelos controles HTML e passa à esquerda. A largura considera o texto real; em telas estreitas, “Brinquedos” e “Arrumados: n/8” ocupam duas linhas. Cor, fonte, moldura, emoji e preenchimento continuam os existentes.

A interface considera `canvas.width / canvas.clientWidth` para manter o tamanho legível na resolução ortográfica atual: o jogo mantém largura interna 540 em retrato. Isso ajusta apenas medidas do card; não muda resolução interna, câmera ou escala do mundo. A fonte ficou acima de 11 px CSS nos enquadramentos reais verificados.

Durante a faixa inicial, quando não há espaço acima dela, o card fica abaixo da faixa; após a introdução retorna à posição superior esquerda. Os controles permanecem no lugar original, e nenhuma mensagem do contador é cortada ou sobreposta nesses estados.

Alterações de produção: `RoomEnvironmentRenderer.js`, `ToyRenderer.js`, bloco de renderização de `ToyRoomPhase.js`, `ToyRoomUI.js` e três registros em `assets/manifest.json`. Novos scripts de validação: `test-toy-room-stage3-browser.js` e `test-toy-room-stage3-hud-browser.js`.

`update`, `triggerAction`, `resolveCollisions`, `snapshot` e `restore` continuam idênticos à referência. `game.js`, controles de navegação, IA, save, progressão e configuração dos objetos permanecem preservados. Não foram adicionadas linhas de pouso ou hitboxes sobre arte.

## Validação por grupo

Cada grupo passou pelo teste de referência antes de prosseguir ao seguinte. Resultados individuais:

- [Grupo 1 — poltrona](grupo1-poltrona-validacao.json).
- [Grupo 2 — cavalinho](grupo2-cavalinho-validacao.json).
- [Grupo 3 — Coelhinho](grupo3-coelhinho-validacao.json).
- [Grupo 4 — HUD](grupo4-hud-validacao.json).
- [Validação final](criticos-final-validacao.json).

O teste final confirmou:

- 4.941 amostras de colisão iguais à versão anterior.
- 960 quadros de movimento nas quatro direções, com estado determinístico igual.
- 8 coletas, 8 solturas, 8 armazenamentos e vitória preservada.
- Renderização sem alterar o estado da fase.
- 32 comparações de cabeça no transporte: oito brinquedos × duas direções × parada/movimento, sem sobreposição na região superior avaliada.
- 63 casos de texto do HUD: contagem de 0/8 a 8/8 em sete tamanhos internos de Canvas, incluindo 320, 360, 390, 640, 915, 960 e 1366 px de largura.
- Aplicação real em quatro telas: 960×580, 390×844, 915×412 e 320×568. [Retângulos CSS e texto medidos](hud-aplicacao-real.json); nenhum controle HTML intersecta o card.
- 77 recursos carregados sem falha.
- 53.163 pixels alterados na comparação da sala completa; **zero pixels fora das áreas dos três objetos e do HUD**.

`npm test`, `npm run lint`, `npm run check-assets`, sintaxe dos módulos/scripts e `git diff --check` aprovados. [Registro da suíte](testes.log). As verificações específicas do HUD e transporte são de apresentação; o teste funcional também exercita o controlador real, sem se limitar às capturas sintéticas.

Para repetir os testes específicos, com servidor local na porta 8765 e Chrome de teste com CDP em 9223:

```sh
node scripts/test-toy-room-stage3-browser.js criticos-final
node scripts/test-toy-room-stage3-hud-browser.js
```

## Performance e custo dos recursos

A medição local da sala completa preservou a cadência em aproximadamente **16,7 ms por quadro**, antes e depois. O percentil 90 foi 1,0 ms em ambas as amostras; a mediana passou de cerca de 0,6 para 0,8 ms. Não houve queda de cadência detectada nesse navegador, mas não se afirma custo de CPU absolutamente igual nem equivalência em todos os dispositivos físicos.

As três imagens acrescentam **255.879 bytes**, aproximadamente 250 KiB de transferência. Dimensões: poltrona 282×318, cavalinho 254×202, Coelhinho 84×132. O orçamento nominal de pixels RGBA é **608.288 bytes**; não é medição de memória total do navegador. Os recursos são carregados pelo AssetManager existente, sem geração ou decodificação por quadro.

A validação de navegação e colisões é exata e determinística; a validação de performance é uma amostra local sujeita a variação. Não foi feito benchmark em celular físico. O aumento de transferência deve ser considerado na aprovação, embora não tenha causado regressão de cadência observável.

## Problemas restantes e limites da entrega

Os itens abaixo **não foram iniciados**, porque o documento determina aprovação dos críticos antes de seguir para prioridade alta:

- V22/V23: estante e livros — E.
- V25/V26: castelo e ameias — E.
- V28: armário — E, incluindo integração futura dos puxadores V29.
- V33: robô — E.
- V35: patinho — D.
- V36: torre de blocos — E.
- V37: tambor — D.
- V38: caixa de surpresa — E.
- V49: fada — E.

Restam nove entradas E do inventário anterior, contando componentes, em sete objetos principais. Portanto, o critério global “nenhum E abaixo de B / nenhum placeholder geométrico na sala” ainda não foi atingido. Os críticos selecionados atingiram B na avaliação interna; o conjunto da sala ainda exige as intervenções altas após aprovação.

Outras pendências da auditoria continuam: sombras e feixes, diferença de escala chão/mãos, composição da fada sobre a cabeça, faíscas azuis, seleção e rótulo PEGAR, aparência gráfica do HUD e joystick, área pontilhada de toque, feedback de abertura do baú e comunicação de objetos decorativos. As faixas de introdução/vitória não foram redesenhadas; os problemas de largura do renderer em Canvas estreito continuam fora destes dois IDs de HUD.

Ramos de fallback procedurais permanecem para falha de carregamento das novas ilustrações; não são utilizados no caminho normal validado. Nesta entrega, substituir um desenho normal não implica eliminar mecanismos existentes de recuperação de recurso.

## Origem da arte e revisão pendente

Ferramenta: habilidade `imagegen`, ferramenta integrada. Referência: `assets/art/toy-room/environment-sheet.png`. Destinos finais:

- `assets/art/toy-room/stage3/armchair-v1.png`.
- `assets/art/toy-room/stage3/rocking-horse-v1.png`.
- `assets/art/toy-room/stage3/cotton-bunny-v1.png`.

Prompts completos preservados em `assets/art/toy-room/stage3/prompts.json`. Os resultados foram recortados pela transparência e reduzidos antes da integração; a prancha de referência e os demais assets existentes não foram sobrescritos.

A próxima ação recomendada é **revisar e aprovar os quatro grupos críticos**. Após essa aprovação, iniciar o grupo alto de móveis na ordem solicitada, validando antes de avançar para brinquedos e fada. Nenhuma próxima etapa foi iniciada automaticamente.

## Integridade

Comparação SHA-256 em 219 arquivos existentes: alterações restritas aos cinco arquivos de produção listados; zero alterações em arquivos existentes fora desse escopo. [Integridade e metadados dos recursos](integridade-e-recursos.json). As evidências históricas das etapas anteriores não foram reescritas.
