# Prompts das novas poses da menina

Ferramenta utilizada: `imagegen` integrada, com edição orientada por referências e transparência real. Nenhuma execução via CLI/API externa. Os recortes originais foram preservados. As pranchas abaixo são arquivos irmãos adicionais, não substituições da arte anterior.

## Corrida — prancha final

Arquivo: `assets/art/toy-room/battle/girl/animation-v2/run-sheet.png`.

Referências: `girl/runtime/run-02.png` e `girl/runtime/idle-01.png`.

> Use case: identity-preserve. Asset type: UMA prancha de animação de corrida, 4 quadros em grade 2x2, células iguais, fundo realmente transparente. Personagem é EXATAMENTE a menina das imagens, mesmos pixels pictóricos de pixel art, rosto, cabelo castanho, franja, rabo de cavalo com laço rosa, vestido creme e rosa com medalhão dourado, botas e espada bege com guarda azul. Manter sua assinatura visual integralmente, SEM mudar a cor da pele, olhos, cabelo ou roupa, SEM estilo vetorial/anime/3D, SEM sombras no chão ou texto. Todos os quadros olham DIREITA como a primeira referência. Cabeça e corpo do MESMO tamanho em TODOS os quadros. Pose natural de corrida com espada segura à frente em diagonal, não atacar. Quadro superior esquerdo: contato da passada, perna dianteira estendida e perna traseira para trás. Superior direito: apoio, joelhos flexionados absorvem peso e perna traseira começa a passar. Inferior esquerdo: passagem, perna livre dobrada para frente e outra sustenta o corpo, centro de massa ligeiramente elevado. Inferior direito: contato da passada oposta, a perna livre agora alcança o chão e outra vai para trás. Não repetir exatamente o mesmo desenho das pernas: mostrar articulação clara e continuidade entre contato, apoio, passagem e novo contato. Rosto e tamanho da cabeça iguais à imagem de referência, com balanço mínimo do rabo de cavalo e da saia; braços seguram espada sem trocar de mão. Uma única linha de base dos pés relativa à célula em todos os quadros. Margens largas para espada e cabelos, sem cortes, sem sobreposição entre células. Esta é animação da personagem existente, NÃO um redesign.

## Agachamento — prancha final

Arquivo: `assets/art/toy-room/battle/girl/animation-v2/crouch-cycle-sheet.png`.

Referências: `girl/runtime/run-02.png` e a prancha intermediária de duas poses baixas criada na mesma sessão. Essa intermediária serviu apenas como referência de postura para a prancha final.

> Use case: identity-preserve. Asset type: UMA prancha 2x2 com QUATRO poses intermediárias do mesmo agachamento da menina, fundo realmente transparente, sem textos/grade/sombra de chão. Imagem 1 fixa identidade e assinatura pixel art pintada original. Imagem 2 fixa exatamente o estilo e os extremos da postura que devem ser preservados. NÃO fazer redesign. Mesma franja/rabo de cavalo/laço rosa, mesmos olhos castanhos e rosto infantil, mesma roupa creme e rosa/medalhão dourado/botas marrons e espada bege com guarda azul. Todos olhando DIREITA. Cabeça idêntica, mesmas dimensões absolutas em TODOS os quadros, pés numa mesma linha de base relativa à célula, espaço ao redor, nada cortado. Quadro superior esquerdo: repetir aproximadamente a pose da ESQUERDA da imagem 2, joelhos flexionados, espada à frente baixa. Superior direito: quadris um pouco mais baixos, coxas mais inclinadas, cabeça avançando um pouco, uma pose intermediária só ligeiramente mais baixa. Inferior esquerdo: agachamento mais profundo, tronco apoiando sobre joelhos, outra pose intermediária ligeiramente mais baixa. Inferior direito: repetir aproximadamente a pose da DIREITA da imagem 2, agachamento profundo, quadris baixos junto aos calcanhares, joelhos totalmente dobrados, espada horizontal perto dos joelhos. Não diminuir a personagem entre as poses: baixar APENAS pela articulação de joelhos, quadris e tronco; cabeça e membros conservam escala. Os quatro quadros devem formar uma descida gradual com pequenas diferenças de altura entre vizinhos, eliminando o salto grande entre as duas poses da imagem 2. O rabo de cavalo continua atrás da cabeça, braços e espada não trocam de lado. Mesmo desenho pixelado e cores da referência, nenhuma estética vetorial/3D/anime.

## Calibração e seleção

A primeira prancha de agachamento continha duas poses articuladas. A revisão identificou distância grande entre os extremos, e a versão de quatro poses foi selecionada para o runtime. Os PNGs finais mantêm a transparência gerada; o código apenas lê os recortes e define âncoras, orientação e unidade de pixels por prancha. Não houve pintura ou reprocessamento dos PNGs originais.
