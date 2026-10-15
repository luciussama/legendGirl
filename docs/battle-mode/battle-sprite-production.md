# Produção dos sprites de batalha — Prompt 13

## Estado da entrega

Foram produzidos 144 quadros PNG transparentes em 26 sequências, com manifesto e prévia animada. Esta seção preserva os números da primeira produção; os recursos estão integrados ao gameplay atual por BattleAssets/BattleRenderer e manifestos de remediação. Aprovação artística de cada versão deve ser consultada no diário, sem estender uma aprovação antiga a recursos novos.

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
- [Prévia animada — acervo de IA](../diario-ia/README.md): reprodução, pausa e avanço de quadro, usando as mesmas âncoras do manifesto.

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

As páginas de revisão estão arquivadas no diário de IA e devem ser recuperadas em ambiente temporário. Os relatórios de execução e homologação também ficam no acervo, sem cópias nesta documentação.

Avalie continuidade das proporções, fluidez, alinhamento do corpo, âncoras, transparência e correspondência com a arte original. Hashes e dimensões corretos não certificam qualidade artística. Duração, eventos de dano, física, colisões e transições pertencem à implementação de combate e precisam ser revalidados quando os recursos mudarem.

## Integração atual e derivados

`BattleAssets` lê o manifesto/remediação e imagens por URLs relativas ao módulo. `BattleRenderer` resolve quadros, transições e impactos; `ToyRoomBattle` mantém eventos/tempos. O perfil de arena usa `ArenaPlayerRenderer`, `ArenaGirlAnimationFrames`, `ArenaPlayerAnimation` e `DamageSpriteFrames`. O desenho da reação de dano tem prioridade inclusive no hitstop. `prepare-damage-sprites.js` gera os seis quadros por ator e metadados; não executar geradores para uma revisão documental.

Os 144 quadros acima descrevem o lote original, não o total de imagens atuais. Consulte o [inventário de arte](../sprites/inventario.json), o [guia da animação](../arena/GUIA-ANIMACAO.md) e [o runtime da arena](../arena/GUIA-ARENA.md) para recursos usados, consumidores e parâmetros vigentes. Scripts/fixtures de homologação ficam no diário e são recuperados apenas em diretório temporário.
