ddwddddwdd a# Revisão da animação da menina

13/10/2026 · alterações locais na branch `feat-arena` · sem commit ou push.

## Diagnóstico e resultado

O renderer anterior escolhia um quadro a cada nove ticks, usava a altura total do recorte para definir a escala e reduzia o agachamento para 46% da altura em pé. Alguns quadros de repouso/ataque olhavam para a esquerda, enquanto os de corrida olhavam para a direita. A largura do recorte de ataque incluía a lâmina e seus efeitos, deslocando a ancoragem do corpo.

A apresentação agora normaliza a orientação por quadro, usa referência corporal comum e mantém os pés como origem vertical. A unidade de pixels converte a resolução de cada prancha; a escala não muda quando a menina agacha. Foram acrescentadas quatro poses de corrida e quatro poses de descida articulada. O levantamento percorre as poses em sentido inverso, e o pouso absorve o peso com os joelhos.

As passagens curtas usam pesos suaves e um buffer reutilizável com soma ponderada, preservando a opacidade da personagem. O registro horizontal do rosto reduz duplicação do rosto durante a mistura. A descida usa poses intermediárias próximas em vez de misturar por muito tempo os dois extremos.

O golpe usa a arte original, com antecipação até o quarto quadro, corte rápido, acompanhamento e recuperação visual até 24 quadros. O rastro é orientado pela direção capturada no início do ataque e começa na fase ativa. A pausa de impacto existente também pausa o relógio visual. Um golpe interrompido por dano cancela o rastro.

`playerAnimation` fica no snapshot do combate. O render apenas amostra o estado, sem avançar relógios. Saves anteriores sem esse campo recebem a pose correspondente ao estado lógico antes do primeiro desenho.

## Identidade e arte

Foram preservados rosto, paleta, cabelo, laço, roupa, botas, espada e assinatura de pixel art pintada das referências. Os 17 PNGs originais de `girl/runtime` permanecem intactos, verificados por SHA-256 no teste de regressão. As poses adicionais foram feitas com `imagegen` integrada e referências da própria menina.

Arquivos finais:

- [Corrida](../../assets/art/toy-room/battle/girl/animation-v2/run-sheet.png).
- [Agachamento articulado](../../assets/art/toy-room/battle/girl/animation-v2/crouch-cycle-sheet.png).
- [Prompts e referências](animacao-menina-prompts.md).
- [Proveniência e hashes originais](../../assets/art/toy-room/battle/girl/animation-v2/proveniencia.json).

## Validação

A física, as hitboxes, a velocidade, a altura do salto, o alcance da espada e a janela de dano não foram alterados. O teste real confirma ausência de dano nos três primeiros quadros e impacto no quarto. A simulação mantém os quatro inimigos, vitória e retorno; o percurso de combate continua com 1437 quadros nos perfis de navegador exercitados.

Aprovados:

- `npm test`, incluindo `test:arena:animation`.
- `npm run test:toy-room:qa`.
- `npm run test:battle:polish`.
- `npm run test:battle:fairness`.
- `npm run build`.
- `npm run test:toy-room:arena:browser`: exploração, espada, arena, vitória, retorno, derrota e nova tentativa em desktop e Android emulado, retrato e paisagem, sem exceções ou recursos ausentes.
- `npm run review:arena:animation`: 16 instantes dos quatro ciclos renderizados, incluindo corte, recuperação e descida.

A revisão visual inspecionou as poses renderizadas e confirmou o agachamento por articulação. Os perfis Android são emulados. A renderização com leitura de pixels teve p95 abaixo de 10 ms nas execuções finais; a mistura reaproveita um único buffer de 512 × 340.

## Revisão em movimento

Abra [a página local de animação](http://127.0.0.1:3001/tests/arena-player-animation.html). É possível pausar, avançar um quadro ou reproduzir a 25%/50%. A página mostra repouso, corrida, agachamento e golpe lado a lado, usando o renderer real.

Evidências locais regeneráveis:

- [Comparação dos ciclos](../qa/arena-player-animation/comparacao.png).
- [Agachamento dentro da arena](../qa/toy-room-arena/desktop-agachamento.png).
- [Corte](../qa/arena-player-animation/attack-4.png).
- [Recuperação](../qa/arena-player-animation/attack-18.png).

Os JSONs, PNGs e logs ficam em `docs/qa/arena-player-animation`, pasta de evidências ignorada pelo Git. Para regenerar, mantenha servidor :3001 e Chrome de teste :9222 e execute `npm run review:arena:animation`.
