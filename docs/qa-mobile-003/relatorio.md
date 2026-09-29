# QA-Mobile-003 — Zoom móvel moderado

Aplicado zoom de apresentação de até **1,18×** em Android, iPhone e tablets, incluindo iPadOS identificado como Mac com tela sensível ao toque. O aumento máximo é de 18% na altura/largura aparente e aproximadamente 39% na área visual. Desktop permanece em 1× adicional.

A ampliação atua exclusivamente na renderização das fases de plataforma e da sala de brinquedos. Física, velocidades, saltos, colisões, plataformas, posições dos objetos, resolução do canvas e layout da interface permanecem intactos. A interface é desenhada depois de restaurar a transformação da cena. A iluminação e o centro da transição do portal acompanham o enquadramento. A abertura narrativa mantém seu enquadramento próprio.

## Antecipação dos saltos

O enquadramento considera a personagem, a fadinha e a região de chegada do próximo apoio. Em apoios largos, preserva até 96 unidades da superfície de chegada, do lado correspondente à direção do percurso; o restante da plataforma pode continuar além da tela. O zoom diminui quando esses elementos precisam de mais espaço.

Quando não há espaço para aproximar, mantém a transformação anterior integralmente. Isso ocorre em alguns saltos largos da terceira fase em retrato: o ajuste não torna visível um apoio que já estava fora da tela, mas também não reduz seu campo de visão. A ampliação não é forçada nesses trechos.

## Verificação em navegador

Chrome com identificação e dimensões móveis emuladas; não são capturas de aparelhos reais.

- **304 enquadramentos de plataforma**: 38 posições, quatro perfis, duas orientações. 288 ampliados e 16 preservados em 1×.
- Personagem e fadinha visíveis nos quadros testados; região de chegada visível em todos os quadros com ampliação. Nos quadros sem ampliação, matriz igual à anterior.
- Margem inferior dos pés no Android de pelo menos 72 pixels CSS nos quadros testados, preservando o ajuste do QA-Mobile-001.
- **8 quadros da sala de brinquedos**: ampliação de 18%, personagem e fada visíveis; estado persistível idêntico antes/depois de renderizar.
- `npm test`: aprovado, incluindo regressões de física, apoios, narrativa e os testes novos de zoom, detecção móvel e limitação pelo campo de visão.
- Verificação de sintaxe dos arquivos alterados e `git diff --check`: aprovados.

A medição abaixo usa as 44 unidades de altura da personagem como referência no primeiro apoio; não representa a caixa de pixels opacos de cada pose.

| Perfil em retrato | Tela CSS | Altura antes | Altura depois | Capturas |
| --- | --- | --- | --- | --- |
| Android pequeno | 360 × 640 | 29,3 px | 34,6 px | [Antes](android-pequeno-retrato-antes.png) · [Depois](android-pequeno-retrato-depois.png) |
| Android grande | 412 × 915 | 33,6 px | 39,6 px | [Antes](android-grande-retrato-antes.png) · [Depois](android-grande-retrato-depois.png) |
| iPhone | 390 × 844 | 31,8 px | 37,5 px | [Antes](iphone-retrato-antes.png) · [Depois](iphone-retrato-depois.png) |
| Tablet | 768 × 1024 | 62,6 px | 73,8 px | [Antes](tablet-retrato-antes.png) · [Depois](tablet-retrato-depois.png) |

Capturas em paisagem: [Android pequeno](android-pequeno-paisagem-depois.png), [Android grande](android-grande-paisagem-depois.png), [iPhone](iphone-paisagem-depois.png), [tablet](tablet-paisagem-depois.png).

Sala de brinquedos: [Android pequeno](android-pequeno-retrato-sala.png), [Android grande](android-grande-retrato-sala.png), [iPhone](iphone-retrato-sala.png), [tablet](tablet-retrato-sala.png).

[Resultados numéricos](resultados.json). Reprodução: servidor `node server.js`, Chrome dedicado com `--remote-debugging-port=9222` e `node scripts/review-mobile-zoom.js`.

## Validação pendente

Conforto durante saltos contínuos e mudanças do zoom ainda exige playtest em dispositivos reais. A revisão automatizada cobre quadros estáticos de chegada/antecipação, não todas as trajetórias, posições da fada ou estados cinematográficos. A homologação em Android pequeno/grande, iPhone e tablet permanece pendente de execução física.
