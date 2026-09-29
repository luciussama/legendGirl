# QA-Mobile-001 — Enquadramento vertical no Android

Implementado em 29/09/2026. A cena das fases de plataforma recebe uma translação vertical exclusiva de apresentação no Android. O chão busca ficar a 70% da altura do canvas, deixando 30% abaixo. A reserva inferior é de pelo menos 72 pixels CSS mais o `safe-area-inset-bottom` informado pelo navegador. Uma margem superior de 16 pixels CSS mais o inset superior limita o deslocamento para preservar personagem, fada e apoios visíveis.

O ajuste não muda o canvas, o layout da interface, zoom, escala dos sprites, plataformas, hitboxes, física ou coordenadas dos objetos. A câmera de simulação permanece intacta, inclusive seu limite de teto. Iluminação acompanha a transformação real do contexto; a transição do portal recebe a mesma compensação. Outros sistemas operacionais mantêm a apresentação anterior.

## Comparação

Capturas do jogo real em Chrome desktop com identificação Android e dimensões móveis emuladas. Insets de 24/48 pixels CSS foram injetados exclusivamente no elemento de medição da página de teste; não representam medição de um aparelho. O quadro anterior usa o mesmo estado com a translação nova desativada. Valores abaixo são a distância dos pés ao limite inferior do canvas, convertida para pixels CSS, no chão inicial.

| Cenário simulado | Viewport CSS | Inset inferior | Antes | Depois | Capturas |
| --- | --- | --- | --- | --- | --- |
| Gestos, retrato | 390 × 844 | 24 px | 79,4 px | 253,2 px | [Antes](gestos-antes.png) · [Depois](gestos-depois.png) |
| Barra, retrato | 390 × 800 | 48 px | 79,4 px | 240,0 px | [Antes](barra-antes.png) · [Depois](barra-depois.png) |
| Gestos, paisagem | 844 × 390 | 24 px | 50,6 px | 117,0 px | [Antes](paisagem-antes.png) · [Depois](paisagem-depois.png) |

## Validação executada

- `npm test`: regressões existentes e testes novos aprovados.
- `node scripts/test-android-framing.js`: reserva inferior, insets superior/inferior, proteção do topo, dimensões e ausência de deslocamento em outras plataformas.
- `node scripts/review-android-framing.js`: 38 apoios (22 principais e 16 da terceira fase), em três viewports: 114 verificações estáticas de topo e margem dos pés. O estado da personagem e das plataformas é comparado antes/depois de renderizar.
- Inspeção visual das capturas: personagem elevada, escala preservada e apoios do enquadramento inicial visíveis.
- `git diff --check`: aprovado.

As capturas e [medições](resultados.json) estão nesta pasta. Para reproduzir o navegador: iniciar `node server.js` e um Chrome dedicado com `--remote-debugging-port=9222`, então executar o script de revisão.

## Validação pendente em dispositivo

Nenhum Android estava conectado via ADB. A homologação em Android real com gestos e barra tradicional permanece pendente: verificar toques próximos ao botão Voltar, barras dinâmicas, rotação, saltos e cinemáticas. A emulação comprova a geometria nos quadros testados; não comprova ausência de acionamentos acidentais do sistema nem cobre todas as trajetórias de jogo. A sala de brinquedos possui outro renderizador e não faz parte destas alterações ou capturas.
