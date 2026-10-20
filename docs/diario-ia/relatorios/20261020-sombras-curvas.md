# Gameplay crítico: sombras nas curvas e documentação

Sessão `20261020T181911-38cb8c0288e0`. Inspeção do jogo local com Chrome/CDP,
sequência controlada de posições e percurso completo pelo controlador real com
entradas automatizadas. Não equivale a uma partida manual ou avaliação humana.

## Diagnóstico visual

A curva interna projetava grandes faixas diagonais sobre o piso. Elas competiam
com obstáculos e com a silhueta da menina. Isolamento de contribuições confirmou
a direcional frontal baixa/rasante como principal origem. Não confirmado defeito
na textura ou emendas da geometria; esses arquivos foram preservados. A troca
instantânea de janela dominante também trocava máscara e sombra sem transição.
A primeira captura diagnóstica restaurou as luzes antes de o compositor capturar
a tela, gerando imagens iguais; corrigida para leitura síncrona do canvas.

## Mudanças

Luz frontal passa de altura 7,8 para 28 acima do piso, mantendo origem à frente
do urso e sombra para trás. Volume ortográfico final: laterais ±12,5, vertical
±24, profundidade 0,5–80. PCF com radius 3. Paredes continuam projetando sombras;
reduzida a extensão exagerada sobre o trajeto, sem afirmar eliminação de todo
contorno duro, inerente à aproximação usada. Não há GI físico ou sombra de área.

Janelas: alcance e far de sombra locais de 18; máscara permanece em todos os
projetores. A sombra dominante perde força suavemente entre separações 6 e 12,5
em relação ao foco 6 unidades adiante da menina; troca apagada. Até duas luzes
projetam sombras simultâneas. Resoluções mantidas.

Por pedido adicional do usuário, todos os métodos de ChaseLighting receberam
JSDoc em português, parâmetros, ciclo de vida, propriedade/descarte dos recursos,
explicações de bias/normalBias/radius, resolução, coordenadas e transições.
Linhas compactadas foram expandidas. Nome PascalCase mantido por exportar classe,
seguindo arquivos existentes; não houve migração de convenção de nomes.

## Resultados e limites

Ampliação inicial do mapa passou no QA de cenas isoladas, mas falhou no gameplay
com 347 chamadas, depois 340. Ajuste de volume/alcance reduziu para 308; uma
amostra ainda ficou 0,02 unidade fora da lateral do mapa. Margem lateral ampliada
de 12 para 12,5, preservando o limite de 310. Falhas arquivadas, sem relaxar teste.

Gameplay final: COMPLETE, zero colisões, 6.110 passos de controlador, 15 capturas,
pico 308 chamadas. Em 2.881 amostras de iluminação: 28 trocas apagadas, variação
máxima 0,0576 por 0,25 unidade. 210 pontos próximos cobertos pelo mapa frontal.
Capturas finais inspecionadas, incluindo curvas 84/338 e anteriores 208/404.
QA de iluminação passou em desktop/retrato/paisagem, com sombras reais, urso
iluminado de frente e projeção traseira, estado preservado e descarte zero.
QA de percurso passou com 15 modelos, três formatos, 36 finais, NORMAL/EASY sem
colisões, perda/recuperação WebGL e descarte. Build, assets, mapa de sprites,
sintaxe e diff verificados. Suíte geral não repetida nesta alteração de luz/docs.
Sem benchmark de FPS/VRAM em dispositivo físico ou aceite artístico humano.

Evidências regeneráveis identificadas em capturas.json antes de remover os PNGs
temporários; históricos de QA também guardam hashes anteriores sobrescritos nas
repetições. Artes originais, física e simulação não alteradas.

Durante o trabalho foi observado commit externo `3a422243` absorvendo parte das
alterações já existentes. Esta execução não criou esse commit e não fez push.
