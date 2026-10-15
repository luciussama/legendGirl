# Personagem oficial

Fonte imutável: `official-sprites.png` (o arquivo enviado é JPEG, apesar da extensão).
Execute `node scripts/generate-dream-girl-sprites.js` para recortar novamente.
O script copia pixels, remove o pergaminho conectado às bordas e exporta
`sprites/official-character.png` e `src/js/assets/officialCharacter.js`.
Nenhum frame é desenhado ou gerado; os canais RGB dos pixels retidos são preservados.

Mapeamento da prancha:
- Repouso (Idle): 9 quadros da linha IDLE.
- Corrida (Run): 9 quadros da linha RUNNING.
- Salto (Jump): 6 quadros JUMPING, 2 JUMPING–SHORT e 1 HIGH JUMP.
- Queda (Fall): 6 quadros FALLING.
- Arrancada (Dash): o quadro DASHING, incluindo seu rastro original.
- Teletransporte (Teleport): os 2 quadros TELEPORTING que contêm a personagem, com o portal original.
- Dano, coleta e interação: recortes das respectivas poses oficiais.

Estados sem recorte isolado adequado reutilizam poses existentes: deitada usa
o último FALLING; agachada usa o primeiro JUMPING; empurrar e escalar usam IDLE.
A sala usa IDLE/RUN. O transporte usa a pose adicional de stage2 em ToyCarryPresentation quando disponível, com COLLECTING como caminho existente de seleção; não há animação traseira inventada. Direção esquerda usa espelhamento horizontal.

Ambos os renderizadores usam o mesmo atlas, com escala uniforme, sem balanço,
rotação procedural, recoloração ou desenho alternativo. A física não foi alterada.
O carregamento ausente não ativa uma personagem substituta.

Validação: `npm test` verifica a origem por SHA-256, igualdade RGB com os
recortes originais, seleção dos quadros e contato dos pés nas plataformas.
A extração a partir desta prancha mantém sua resolução original; não adiciona
detalhes ausentes na imagem enviada.

A arena tem poses de espada/animação/dano próprias, documentadas no [guia da menina](../../../docs/arena/GUIA-ANIMACAO.md); esse conjunto não redefine o atlas oficial da exploração. Os novos módulos de estado, cena e persistência mantêm os consumidores e a identidade da arte.
