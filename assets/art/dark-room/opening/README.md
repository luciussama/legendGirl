# Abertura do quarto

`waking-up.png`: atlas RGBA 2172 × 724, quatro células de 543 px. Criado com a ferramenta integrada `image_gen`, usando `../official-sprites.png` como referência de identidade e estilo. Asset exclusivo da cutscene; não substitui os recortes oficiais de gameplay.

## Prompt utilizado

Tradução do texto de geração utilizado: caso de uso, preservação de identidade.
Crie UMA prancha de sprites de produção para a cena do jogo existente, usando a
prancha oficial anexada como referência obrigatória de identidade e estilo de pintura.
Fundo transparente, sem texto e sem grade. Quatro células iguais de 384 × 384,
alinhadas horizontalmente, totalizando 1536 × 384 ou uma imagem larga proporcional.
Cada célula mostra a MESMA pequena cama infantil de madeira em vista lateral
levemente elevada, com travesseiro à esquerda, roupa de cama amarrotada em creme
e rosa-claro, madeira escura entalhada e estilo onírico de quarto infantil antigo,
coerente com os objetos da referência. Cada cama deve ter posição e escala idênticas.
Célula 1: a menina oficial exata, deitada e relaxada, dormindo no travesseiro com os
olhos fechados. Célula 2: a mesma menina deitada, abrindo os olhos. Célula 3: a mesma
menina sentada na cama, com as pernas para a frente. Célula 4: a mesma menina em pé
ao lado da cama. Preserve EXATAMENTE o rosto, os dois coques laterais castanho-escuros
e a franja, o vestido branco com detalhes rosa/vermelhos, os sapatos vermelhos,
as proporções infantis e o estilo de silhueta da referência. Sem laços grandes,
sem redesenho com rabo de cavalo e sem personagem alternativa. Não altere a identidade.
Somente estas novas poses da cena estão autorizadas. Camas completas e isoladas com
a menina, sem quarto ou fundo, com margens transparentes generosas entre as células.
Mantenha o colchão na mesma linha de base e com o mesmo tamanho em todas as células.
Produza a ilustração, sem rótulos ou modelos de apresentação.

## Execução

A sequência dura 37,5 segundos de jogo, respeita pausa e usa um relógio próprio. A física não avança durante a cena. A cama é apenas uma ilustração temporária, sem colisão nem entrada no layout.

A flag `legendGirl.bedroom-opening.completed.v1` é salva em localStorage somente após o fim da apresentação. Recarregar uma abertura incompleta permite vê-la novamente. Após a conclusão, novas entradas iniciam o gameplay diretamente. A persistência vale para o mesmo navegador e origem; apagar os dados do site remove a flag. Caso o navegador bloqueie armazenamento, a proteção permanece apenas durante a sessão em memória.

O quadro final faz um corte suave para os sprites oficiais e para o ponto inicial existente. Os controles de som e pausa continuam disponíveis.
