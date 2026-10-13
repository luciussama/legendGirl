# Limpeza das imagens selecionadas

Aplicada a revisão 366 do arquivo `selecoes-exclusao.json`, gravada em 13/10/2026. Foram retiradas as **33 imagens** de `selectedForDeletion`, sem alterar as escolhas do usuário. Nenhum recorte de prancha foi selecionado.

A cópia recuperável está em `.sprite-review-quarantine/2026-10-13T18-04-29.431Z-edbf9700/`, junto de `registro.json`. A quarentena não faz parte dos recursos versionados do jogo.

## Ajustes de dependências

- Removidas 32 entradas do manifesto que carregavam imagens antigas. A imagem restante não fazia parte dele.
- Retiradas consultas aos SVGs antigos de fada e urso. As ilustrações aprovadas e os recortes do cenário continuam usados.
- Retirado o tratamento específico das pranchas antigas da protagonista no carregador. A prancha oficial atual e os quadros detalhados da arena permanecem intactos.
- Corrigida a dependência do piso SVG: a base agora é desenhada antes do piso ilustrado, e o desenho de tábuas considera a presença da ilustração atual. Isso evita cobrir o piso aprovado após a remoção.

## Resultados

`npm test`, `npm run build`, `npm run check-assets`, `node scripts/test-sprite-cleanup.js` e o gameplay em `scripts/test-toy-room-arena-browser.js` aprovaram.

O teste específico conferiu ausência das 33 imagens, hashes das imagens marcadas como atuais, manifesto sem alvos removidos e renderização do fundo sem o SVG. O gameplay percorreu coleta, investigação, espada, transformação, quatro inimigos, vitória e retorno, com save/load, nova tentativa e carregamentos sem falhas. Os perfis desktop, Android em retrato e Android em paisagem aprovaram, sem exceções JavaScript nem falhas HTTP de recursos.

## Assinaturas procedurais

As 46 assinaturas de `selectedCode` foram tratadas na etapa seguinte, conforme `substituicao-assinaturas.md`: oito sprites novos gerados com imagegen, reutilização das artes aprovadas e remoção dos desenhos antigos. As escolhas originais permanecem preservadas no JSON para auditoria.
