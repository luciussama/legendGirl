# Menina ilustrada — direção girl-v2

O usuário aprovou a qualidade da pose de transporte e pediu o mesmo padrão em todas as poses 2D da menina. Identidade: cabelo castanho em duas marias-chiquinhas, laços rosa, vestido creme bordado com babado/faixa rosa e botas marrons. Na arena, olhos mais estreitos, sobrancelhas inclinadas para o centro e boca séria; exploração conserva expressão suave.

`source/` preserva as pranchas geradas com a ferramenta integrada `image_gen`; os JSONs de prompts documentam referências e variantes. Fontes anteriores permanecem preservadas. A direção aprovada não equivale à homologação humana de cada novo quadro.

Execute `node scripts/prepare-illustrated-girl.js` para reconstruir `runtime/`, `frames.json` e `src/js/assets/illustratedGirl.js`. O gerador separa figuras pelo alfa, reduz em alfa pré-multiplicado e registra o último pixel dos pés. A referência comum é 256 px; agachamento e salto conservam tamanho da cabeça, sem normalização individual de altura.

Há 68 pinturas em nove pranchas de execução: locomoção, saltos, ações, base/ações/defesa/dano/agachamento de arena e transporte. O ciclo de dano tem seis poses distintas. Repetições no mapeamento mantêm as durações existentes. O atlas oficial anterior continua disponível como alternativa quando os novos recursos não estão presentes. Cenas de abertura e aproximação já ilustradas, e o close dos olhos do especial, mantêm suas artes detalhadas próprias.

`BabyRenderer`, retratos de diálogo e arena compartilham os metadados. `ToyCarryPresentation` desenha corpo/braço distante, brinquedo com proporção preservada e antebraço/dedos próximos recortados da pintura. A seleção do item, coleta e persistência continuam no domínio da sala. A arte não redefine as regras de combate. O contato do quarto inclui o envelope dos novos sapatos, preservando a cobertura física anterior.
