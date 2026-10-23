# Pose de transporte

A versão ativa é `carry-v2/poses.png`: quatro poses detalhadas, parada e passos, com braços dobrados e palmas abertas. Geração pela ferramenta integrada `image_gen`, com prompt em `carry-v2/prompts.json`. O usuário aprovou esta direção de qualidade e estendeu o padrão às demais poses 2D da menina, em `assets/art/characters/girl-v2/`.

`carry-pose-v1.png` e seu prompt permanecem como origem anterior; não são a pose ativa. O atlas oficial também permanece preservado.

`ToyCarryPresentation` compõe corpo/braço distante → brinquedo → antebraço/dedos próximos. Recortes opacos dos oito brinquedos são armazenados em cache por carregador. Limites de tamanho preservam a proporção e deixam o rosto livre. Os offsets são somente visuais; coleta, peso e save não são alterados. `ToyRoomToyActions` controla a carga e `ToyRoomPersistence` religa o item por ID.
