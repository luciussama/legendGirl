# Pose de transporte — Correção 1

`carry-pose-v1.png`: pose derivada da protagonista oficial com os braços dobrados e as palmas voltadas para cima. Gerada com a ferramenta integrada `imagegen`, recortada pela transparência e reduzida para 256 px de altura. O atlas oficial permanece preservado.

O transporte é composto por pose, brinquedo e mãos em primeiro plano. Os offsets são exclusivamente visuais; os dados de coleta não são alterados.

O prompt de geração está em `prompts.json`.

Integração atual: [ToyCarryPresentation](../../../../src/js/toy-room/ToyCarryPresentation.js) compõe pose, item e contatos. ToyRoomEntities e ToyRoomSceneRenderer apresentam o jogador; ToyRoomToyActions controla o vínculo com o item e ToyRoomPersistence o religa por ID no save. Desenho não decide coleta nem peso.
