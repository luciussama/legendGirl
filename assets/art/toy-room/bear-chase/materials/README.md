# Materiais pictóricos da perseguição

Direção aprovada pelo usuário em 20/10/2026, a partir do estudo do armário em
`docs/diario-ia/arte/20261020-armario-pictorico-v1.png`, preservada no banco do diário. Para consultar a referência, use `npm run journal:extract -- docs/diario-ia/arte/20261020-armario-pictorico-v1.png --output /tmp/armario-pictorico-v1.png`. Os quatro atlas iniciais, o decorativo v3 e o urso v2 são artes
consumidas pelo jogo: conservar os PNGs. As ilustrações originais não foram
sobrescritas. Geração pela ferramenta integrada image_gen, uma chamada por objeto;
referências, procedência e prompts integrais em `prompts.json`.

Os quatro PNGs iniciais têm 1254×1254 pixels, quatro quadrantes sem rótulos e materiais pintados. O decorativo v3 tem a mesma dimensão em grade 4×4; o urso v2 usa grade 2×2.
As regiões são numeradas da esquerda para a direita, de cima para baixo:

| Atlas | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- |
| armario | Painel de carvalho | Montante vertical | Tampo | Latão pintado |
| trem | Azul | Vermelho tijolo | Verde oliva | Madeira das rodas |
| blocos | Vermelho | Amarelo ouro | Verde | Azul |
| coelho | Pelúcia rosa pêssego | Creme | Interior rosa antigo | Linha castanha |

`PictorialMaterialAssets.js` define URLs; `ChasePropResources.pictorialMaterial`
compartilha uma textura por objeto e registra o quadrante por material. `bake`
remapeia UVs normalizadas para o quadrante com margem interna de oito pixels.
Painéis, montantes e tampo do armário têm regiões próprias. Detalhes de olhos/nariz
do coelho conservam seus pequenos materiais. A caldeira orienta o veio ao longo
do eixo; os UVs do telhado dos blocos são normalizados antes do atlas.

As geometrias, escala lógica, física, formas e luzes da cena não foram alterados
por esses mapas. Eles são cor pictórica e não mapas de normal/relevo. O acabamento
não é uma fotografia nem uma prancha colada sobre o objeto; todas as vistas usam
superfícies das malhas. Não repetir a antiga neutralização de cor/contraste nem
recortar esses atlas em amostras de poucos pixels para cada face.

`manifest.json` identifica os quatro atlas iniciais; `PictorialMaterialAssets.js` mapeia também o decorativo v3, e `ChaseBearModel` carrega o urso v2. Os prompts adjacentes preservam a procedência das revisões. Métricas/testes/capturas e aprovações da
execução estão exclusivamente no diário de IA; aprovação da direção não equivale
a aprovação humana individual de toda nova textura/modelo.


## Urso da perseguição

`urso-atlas-v2.png` é o atlas 2×2 do personagem, baseado no urso da arena:
pelúcia ocre, creme do focinho/palmas, tecido vermelho do laço e castanho escuro.
A primeira interpretação `urso-atlas-v1.png`, com fibras maiores, foi aposentada
e preservada integralmente no diário. O atlas decorativo v2 também foi retirado
das pastas ativas. Os prompts atuais trazem `origemArquivada` com o identificador
e hash para recuperar suas fontes; o histórico dos prompts anteriores foi preservado.
As fontes da arena permanecem intactas. A direção e as costas do modelo 3D são
interpretações em volume, sujeitas à avaliação artística do responsável.

`ChaseBearModel` remapeia UVs com margem e mescla partes por pivô, compartilhando
um material e uma textura. `ChaseBearAnimation` controla a pose: apoios com joelho
e tornozelo, transferência de peso, contrabalanço, olhar e movimento secundário.
Ambos são independentes da decisão de capturar, lançar brinquedos ou concluir a fase.
