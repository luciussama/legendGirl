# Produção dos sprites de batalha — Prompt 13

## Estado da entrega

Foram produzidos 144 quadros PNG transparentes em 26 sequências, com manifesto e prévia animada. A preparação técnica está concluída; a homologação artística permanece pendente. Os recursos não foram integrados ao gameplay.

| Personagem | Sequências | Quadros por sequência | Total |
| --- | --- | --- | --- |
| Trem | Idle, Walk, Steam Blast, Front Charge, Hit, Death | 6 | 36 |
| Robô | Idle, Walk, Laser Beam, Rocket Punch, Hit, Death | 6 | 36 |
| Dinossauro | Idle, Walk, Bite, Rush, Hit, Death | 4 | 24 |
| Urso | Idle, Walk, Bear Hug, Belly Charge, Toy Leap, Hit, Enrage, Death | 6 | 48 |

Os ataques foram separados por nome para preservar os repertórios aprovados. A produção não acrescenta golpes, regras de combate, valores de HP ou tempos de execução.

## Recursos e referências

- [Manifesto](../../assets/art/toy-room/battle/manifest.json): caminhos relativos dos quadros, dimensões, âncoras, escala visual e origem de cada recorte.
- [Prompts de geração](../../assets/art/toy-room/battle/prompts.json): instruções utilizadas com `image_gen`.
- [Pranchas de origem](../../assets/art/toy-room/battle/sources/): preservadas para rastreabilidade; não são atlas regulares para recorte por grade.
- [Prévia animada](../../tests/battle-sprite-review.html): reprodução, pausa e avanço de quadro, usando as mesmas âncoras do manifesto.

A geração tomou como referência `assets/art/toy-room/environment-sheet.png` e `assets/art/toy-room/stage3/retro-robot-v1.png`. Foram preservadas as referências de trem azul/vermelho com vagão verde, robô de lata e Urso marrom com laço vermelho. A criação da identidade do Dinossauro foi autorizada pelo usuário: brinquedo simples, verde-azulado, amarelo e vermelho, orientado pela direção de arte existente. Os arquivos da menina e do quarto não foram alterados nesta produção.

## Preparação dos quadros

`scripts/prepare-battle-sprites.js` identifica desenhos nas pranchas por componentes de transparência e gera PNGs individuais com margem de 12 px. Não desenha poses novas nem produz movimento por translação de uma imagem congelada. Quadros problemáticos das bordas do Dinossauro foram descartados; suas sequências usam quatro poses internas. O Rocket Punch foi regenerado separadamente para manter o corpo completo durante a extensão do punho.

Para desenhar um quadro na posição `(x, y)`, aplique sua escala e subtraia `anchor.x` e `anchor.y` também escalados. A âncora vertical compartilha a referência de chão da sequência, preservando a elevação ilustrada no Toy Leap. `displayScale` compensa a resolução maior da prancha separada de Rocket Punch; não define tamanho de hitbox.

## Validação e limites

Execute:

```sh
npm run prepare:battle-sprites
npm run verify:battle-sprites
npm run dev
```

Abra `http://127.0.0.1:3000/tests/battle-sprite-review.html` (ajuste a porta conforme o servidor).

A verificação técnica passou para os 144 PNGs: arquivos e dimensões correspondentes ao manifesto, hashes, transparência, margem, âncoras finitas, repertório exato de ataques e ausência de duplicação exata após normalizar o recorte. O Chrome carregou os 144 arquivos e as 26 sequências. As pranchas e amostras da prévia foram inspecionadas visualmente; o Toy Leap apresenta preparação, elevação e impacto em poses distintas.

Hashes distintos não certificam qualidade da animação. A revisão artística ainda deve avaliar continuidade de proporções, fluidez, alinhamento do corpo e correspondência com a arte original. Em particular, **Rocket Punch apresenta contornos mais marcados que as demais sequências do Robô** e precisa de harmonização antes de ser considerado aprovado para produção. Não há certificação de que os novos desenhos tenham aparência idêntica à mão do artista original.

Os 6 quadros/s da prévia são uma conveniência de inspeção. A repetição de ataques e mortes ocorre somente nessa ferramenta. Duração, eventos de dano, física, colisões, transições e integração com o jogo não foram definidos por este pacote.
