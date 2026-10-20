# Materiais pictóricos da perseguição

Direção aprovada pelo usuário em 20/10/2026, a partir do estudo do armário em
`docs/diario-ia/arte/20261020-armario-pictorico-v1.png`. Os quatro atlas são artes
consumidas pelo jogo: conservar os PNGs. As ilustrações originais não foram
sobrescritas. Geração pela ferramenta integrada image_gen, uma chamada por objeto;
referências, procedência e prompts integrais em `prompts.json`.

Cada PNG tem 1254×1254 pixels, quatro quadrantes sem rótulos e materiais pintados.
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

`manifest.json` identifica as artes. Métricas/testes/capturas e aprovações da
execução estão exclusivamente no diário de IA; aprovação da direção não equivale
a aprovação humana individual de toda nova textura/modelo.
