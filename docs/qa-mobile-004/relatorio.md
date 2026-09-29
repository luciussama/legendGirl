# QA-Mobile-004 — Região narrativa exclusiva no mobile

A apresentação móvel agora divide o canvas em duas regiões sem interseção: cena acima e painel narrativo abaixo. O painel tem fundo próprio, posição centralizada e reserva inferior em relação à área segura. A menina não funciona mais como âncora de uma caixa flutuante.

## Implementação

`MobileDialogueRegion.js` define os retângulos da cena e do painel. Uma superfície auxiliar guarda o quadro da cena; sua apresentação é reenquadrada e recortada exclusivamente dentro da região superior. A caixa narrativa é desenhada na região inferior, sem cenário atrás dela.

O cálculo utiliza a interseção entre canvas, viewport visível e insets superior, inferior e laterais. Abaixo do painel fica uma reserva de pelo menos 12% da altura segura ou duas margens de segurança, prevalecendo a maior. Isso evita que o painel termine sobre a região do home indicator ou da navegação Android.

A reserva padrão do painel é constante entre as falas atuais; o conteúdo fica centralizado verticalmente. Se uma fala exigir espaço extra, o painel pode crescer para acomodá-la. A abertura mantém a divisão inclusive nos intervalos sem texto, evitando mudanças de posição a cada frase. Depois dos diálogos do jogo, a fase volta ao enquadramento normal.

Personagem e fada orientam o enquadramento da região superior. Em paisagem com pouca altura, apenas a apresentação da cena pode ser reduzida para acomodar os personagens; a fonte do diálogo não é reduzida por este ajuste. O desktop mantém o comportamento anterior.

Roteiro, textos, fontes, duração das falas, relógios narrativos, animações, física, colisões e coordenadas do mundo permanecem preservados. A mudança é na composição visual durante a narrativa.

## Validação

- `npm test` e `node scripts/test-opening-sequence.js`: aprovados.
- Testes de geometria verificam ausência de interseção entre cena e painel, posição estável para falas curtas/longas, texto dentro do painel e folga inferior.
- 40 quadros de iPhone e 40 de Android emulados: todas as falas dentro da área segura, com conteúdo e fontes preservados.
- Percurso integrado em Android emulado: abertura, 38 apoios, transições, portal final e oito brinquedos guardados, até a vitória.
- `git diff --check`: aprovado.

## Capturas

| Perfil emulado | Retrato | Paisagem |
| --- | --- | --- |
| iPhone | [Cena e painel](iphone/notch-retrato-abertura-15.png) | [Cena e painel](iphone/notch-paisagem-abertura-15.png) |
| Android | [Cena e painel](android/notch-retrato-abertura-15.png) | [Cena e painel](android/notch-paisagem-abertura-15.png) |

As capturas da abertura exibem a cena real. As capturas `cena-1` do verificador isolam o renderizador do diálogo. Insets e identificação de dispositivo são simulados no Chrome desktop; homologação em aparelhos Android e Safari/iPhone reais permanece pendente.

O pedido terminou com a lista de proibições incompleta. Foram mantidas também as restrições anteriores relativas a fontes, duração, animações e física.
