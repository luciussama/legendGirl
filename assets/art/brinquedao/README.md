# Arte do Brinquedão

Pinturas produzidas com a skill imagegen e ferramenta integrada image_gen em 01/11/2026. [Prompts integrais e hashes](prompts-brinquedao-v1.json). Identidade de Yuna, figurino e linguagem pictórica seguem as fontes do próprio projeto. A imagem do Sonic enviada é exclusivamente referência de circuito; não foi usada como fonte visual nem incorporada aos recursos.

`jardim-brinquedao-v1.png` é o jardim ao fundo. `modulos-brinquedao-v1.png` reúne passarela acolchoada, ponte de madeira, piscina de bolinhas e torre. `escorregador-v1.png` fornece material ilustrado para as descidas. `yuna-brinquedao-v2.png` contém tristeza, esperança, alegria e descida sentada, com componentes separados; `yuna-brinquedao-v1.png` conserva a primeira variante de referência, sem uso em runtime.

`node scripts/prepare-brinquedao.js` gera BrinquedaoArt com componentes completos e máscaras de linhas. Renderer/Terrain preparam caches temporários e registram os materiais sobre curvas físicas, sem sobrescrever PNGs. As pinturas são recursos de produção, nunca evidências descartáveis de QA.

## Atrações elásticas

`atracoes-elasticas-v1.png` reúne cama elástica, torre de castelo acolchoada, painel lateral inclinado e rampa reversa. Criada com a ferramenta integrada image_gen/skill imagegen, usando o kit anterior como referência visual. [Prompt integral, referência e hash](prompts-atracoes-elasticas-v1.json). Componentes completos e alpha preservados; nenhuma edição do PNG por código. BrinquedaoAttractions extrai componentes em memória; Terrain/Renderer fazem a projeção/deformação em apresentação. Pontes reutilizam o material de madeira existente e passam a cair por relógio de contato.

A recuperação inferior reutiliza as fontes existentes: o escorregador forma calhas em U com amostragem espelhada; a cama elástica é girada em memória para as paredes e reaproveitada nas três lonas de retorno vertical. Os PNGs permanecem intactos. BrinquedaoRecovery define os apoios físicos e BrinquedaoAttractions apresenta compressão/recuo por relógio persistido.


Interior v1: interior-brinquedao-v1.png, tubos-interior-v1.png e peixinhos-brinquedo-v1.png foram criados com image_gen integrada seguindo as pinturas do projeto. O gerador mede dois componentes de tubo e quatro peixes em alfa real. O renderer projeta o cilindro sobre nove trajetórias e intercala peixes com a frente das bolinhas. Prompts completos e hashes: prompts-interior-v1.json.
