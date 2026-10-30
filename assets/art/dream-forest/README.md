# Arte do jardim dos sonhos

Fundo `floresta-azul-v1.png` e poses `yuna-escalada-v1.png` criados com a skill imagegen e ferramenta integrada. Resumos de prompts, referência, hashes e proveniência em `prompts.json`. Aprovação artística ainda pendente. Os PNGs originais são recursos de produção e devem ser preservados integralmente.

`node scripts/prepare-dream-art.js` mede quatro recortes por alfa e os contornos superiores dos quatro insetos reaproveitados do jardim; gera `DreamArt.js` sem alterar pixels. O renderer preserva a proporção nativa dos insetos; o mesmo contorno sustenta os pés. As gramas continuam geometrias Canvas compartilhadas com a física. As folhas estáveis agora usam a pintura descrita abaixo, mantendo a superfície anterior sem linhas auxiliares de contato.

A trilha `assets/audio/Misty Blues.mp3` é a cópia integral do arquivo enviado pelo usuário, em loop. A fase é carregada sob demanda depois do sono ou pela bandeira, sem importar Three.js para o sonho.

As gramas agora se prolongam em caules contínuos até abaixo do viewport. Essa geometria Canvas é também escalável; o limite do recorte da lâmina não encerra a pegada. Os PNGs não foram alterados por esta correção.

## Articulação dos besouros — 30/10/2026

`DreamBeetle.js` reaproveita `garden/source/besouro-camadas-v2.png` sem alterar seus bytes. Cabeça e três patas são separadas por máscaras em Canvas na carga; asas usam o recorte membranoso original. As articulações respondem ao voo, enquanto o casco e o perfil superior permanecem estáveis para apoiar Yuna. O cache é liberado ao sair. Não houve geração de nova arte nesta revisão.

## Folhas e abelhinha do bem — 30/10/2026

`folha-plataforma-v1.png` substitui as folhas estáveis desenhadas por código. `DreamIllustratedSprites` registra a borda pintada em cache nas duas larguras existentes e prolonga seu caule ilustrado abaixo do viewport. `abelhinha-do-bem-v1.png` reúne corpo com cotonete e asas membranosas separadas; o corpo mantém sua pintura íntegra, e o batimento move somente as asas. São PNGs de produção com alpha real, gerados pela ferramenta integrada image_gen. Prompts, referências e hashes em [prompts-folhas-abelhinha-v1.json](prompts-folhas-abelhinha-v1.json). Aprovação artística pendente.

`prepare-dream-art.js` mede também esses recortes por alfa e registra suas âncoras; não muda os PNGs nem os perfis físicos anteriores. Ao trocar uma fonte, revisar as regiões de medição, junção do caule e apoio, regenerar DreamArt e o inventário. Não reutilizar uma aprovação de QA como aprovação artística.

## Aranhas e galhos — 30/10/2026

`aranhinha-v1.png` e `galho-vento-v1.png` foram criados com imagegen integrado, com alpha real e estilo pintado. Prompts completos e hashes em [prompts-teias-galhos-v1.json](prompts-teias-galhos-v1.json). A aranha possui oito patas e abdômen azul/índigo; seda é desenhada como objeto escalável real. O galho inclui casca, nós, musgo e tronco para conexão natural. `prepare-dream-art.js` mede os recortes e o topo pintado; `DreamIllustratedSprites` prepara as duas larguras do galho em cache e conserva seu apoio lógico. Aprovação artística dessas novas fontes permanece pendente.

## Escalada v2 — 30/10/2026

`yuna-escalada-v2.png` substitui no runtime a prancha antiga, preservada como referência. São quatro poses de flexão/extensão de pernas e braços e duas poses de chegada ao topo, com escala comum. A primeira geração ainda repetia os joelhos altos; o refinamento alterou as duas poses de extensão. Origem, prompts completos e hash em [prompts-escalada-v2.json](prompts-escalada-v2.json). Ferramenta integrada image_gen, alpha real, aprovação artística pendente.

O gerador mede componentes completos para não cortar sapatos entre células. As mãos ancoram o desenho de DreamClimb nos contornos visuais do corpo da abelha/besouro ou na curva da haste. A última mão baixa tem âncora própria, separada do sapato. Fase por distância escalada e inclinação contínua do corpo; as poses no lombo continuam anteriores. Não modificar DREAM_PROFILES, física ou alcance para corrigir a apresentação.
