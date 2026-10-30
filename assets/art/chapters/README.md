# Gravuras e atuação dos capítulos

As pinturas desta pasta foram criadas com image_gen a partir das referências atuais; proveniência e resumos de prompts em `prompts.json`. Não substituem as fontes anteriores. A apresentação desta entrega foi aprovada pelo usuário em 29/10/2026, após a revisão do epílogo pelo seletor.

`ChapterCard` usa a gravura existente da sala na abertura e a pintura da casa/jardim no capítulo2, com títulos desenhados em Canvas. `ToyRoomEpilogue` usa o quarto sem brinquedos no piso e as três poses da menina. `GardenCinematic` consome as novas poses de sono e Nanda adormecida depois do piquenique.

`node scripts/prepare-chapter-art.js` mede os recortes por alfa e gera `ChapterArt.js`; os PNGs são preservados sem redimensionamento. Conservar células, roupas e proporções e revisar âncoras ao substituir uma pintura.
