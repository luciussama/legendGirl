# Arte ambiental da Toy Room — Etapa 1

Assets novos gerados com a ferramenta integrada `image_gen`, a partir de `assets/art/toy-room/environment-sheet.png` como referência de estilo. A prancha original foi preservada. Os prompts originais estão em `prompts.json`, mantidos como evidência da geração.

| Arquivo | Aplicação |
|---|---|
| `wallpaper-v1.png` | Papel de parede suave da faixa superior. |
| `window-curtains-v1.png` | Janela arqueada com moldura e cortinas, fundo transparente. |
| `oak-trim-v1.png` | Material ilustrado de rodapés e frisos. |
| `oval-rug-v1.png` | Tapete oval com bordados e franjas, fundo transparente. |
| `rectangular-rug-v1.png` | Tapete retangular com bordados e franjas, fundo transparente. |
| `wooden-track-v1.png` | Peça de trilho de madeira com dormentes, fundo transparente. |

Os arquivos foram reduzidos para a resolução de uso; os tapetes e a peça de trilho tiveram somente as margens transparentes externas recortadas para empacotamento. A transparência foi preservada. As posições e dimensões de exibição são definidas pelo renderizador, sem participação na física.

O relatório histórico `docs/qa/toy-room-etapa1/RELATORIO.md` está preservado no [diário de IA](../../../../docs/diario-ia/README.md); pesquise esse caminho para consultar a fonte. Capturas regeneráveis não permanecem nesta pasta.

Integração atual: RoomEnvironmentRenderer desenha os materiais; ToyRoomEnvironmentAssets resolve recortes; ToyRoomSceneRenderer compõe a sala. Consulte o [mapa de arte](../../../../docs/sprites/MAPA-SPRITES.md).
