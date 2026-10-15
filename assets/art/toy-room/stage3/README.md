# Toy Room — Etapa 3

Ilustrações geradas com a ferramenta integrada `imagegen`, usando a prancha `assets/art/toy-room/environment-sheet.png` como referência de material, volume e assinatura visual.

- `armchair-v1.png`: poltrona infantil vermelha, com tecido, braços, assento, costuras, pés e sombra integrada.
- `rocking-horse-v1.png`: cavalinho de carvalho com cabeça, corpo, assento e duas bases curvas conectadas.
- `cotton-bunny-v1.png`: pelúcia rosa com focinho, olhos, patas, orelhas e costuras; não inclui sombra de chão para permitir transporte.

Os prompts originais estão em `prompts.json`. Os resultados foram recortados pela transparência e reduzidos antes da integração. As posições e dimensões lógicas dos objetos permanecem iguais; a renderização usa a área visual anterior e preserva a proporção do Coelhinho.

Os críticos foram aprovados em 6 de outubro de 2026. Os grupos altos foram integrados após a remoção do recurso de exportação e seu teste integrado.

- `bookshelf-v1.png`: estante e livros ilustrados.
- `block-castle-v1.png`: castelo e ameias de blocos de madeira.
- `oak-cabinet-v1.png`: armário baixo com portas e puxadores.
- `retro-robot-v1.png`, `royal-duck-v1.png`, `stacking-blocks-v1.png`, `enchanted-drum-v1.png`, `fairy-jack-box-v1.png`: cinco coletáveis, sem sombra de chão incorporada para permitir transporte.
- `illustrated-fairy-v1.png`: fada pintada com rosto, vestido e asas.

Prompts dos nove assets altos em `prompts-altos.json`. Relatórios/comparações históricos de `docs/qa/toy-room-etapa3/altos/` foram preservados no [diário de IA](../../../../docs/diario-ia/README.md), pesquisáveis pelo caminho original. A indicação histórica de revisão pendente não certifica aprovação posterior; consulte os eventos da versão relevante.

Consumidores atuais: RoomEnvironmentRenderer apresenta móveis, ToyRenderer apresenta os coletáveis e ToyRoomEntities/FairyRenderer apresentam a fada. ToyRoomSceneRenderer compõe a sala; Companion/Story/Tutorial decidem orientação e narrativa por contratos específicos. As medidas lógicas ficam em ToyRoomInitialEntities. Consulte [arquitetura](../../../../docs/ARQUITETURA.md) e [inventário](../../../../docs/sprites/inventario.json) antes de editar.
