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

## Planador e espinhos

`yuna-planador-v1.png` mantém mãos e haste conectadas na mesma pintura; `galho-espinhos-v1.png` é o obstáculo de cima/baixo. Gerados pela ferramenta integrada imagegen, com prompts/referência/hashes em `prompts-planador-v1.json`. Aprovação artística humana pendente. `scripts/prepare-dream-glider.js` gera máscaras de alfa opaco para contato, sem alterar os PNGs. O recorte superior da pintura da menina também apresenta a folha antes da coleta.


## Furtividade e despertar

`barata-pesadelo-v1.png`, `pedras-pesadelo-v1.png` e `yuna-despertar-v1.png` foram gerados pela skill imagegen/ferramenta integrada com alfa real. Prompts completos, referências, hashes e origem em [prompts-pesadelo-v1.json](prompts-pesadelo-v1.json). A aprovação anterior até os espinhos não aprova automaticamente estas pinturas. `scripts/prepare-dream-nightmare.js` mede recortes, olhos, silhuetas das pedras e amostras das poses jogáveis existentes, gerando `DreamNightmareArt.js`. Os PNGs não são editados pelo preparador. DreamNightmareRenderer carrega as fontes apenas ao entrar no final e libera seus caches no descarte. Cenário do piquenique, Nanda dormindo e fada acordada reutilizam as fontes anteriores.


`yuna-susto-em-pe-v1.png` acrescenta duas poses completas, com os pés no chão: mãos junto ao peito e mãos protegendo o rosto. A cena final alterna a caminhada assustada com essas reações antes da captura. Recortes e escala comum são gerados por `prepare-dream-nightmare.js`; as poses não alteram a detecção do trecho jogável. Fonte/prompt preservados em `assets/art/dream-forest/prompts-pesadelo-v1.json`.

## Profundidade da furtividade revisada

A barata ocupa o plano distante; as pedras estão no plano intermediário (base25unidades atrás dos pés) e Yuna no caminho próximo (pés850). O desenho de Yuna vem depois das pedras: o jogador enxerga a personagem protegida. Feixes partem dos olhos articulados e são interrompidos pelos contornos das rochas; a sombra avança para o caminho da frente. O chão pintado `chao-floresta-sombria-v1.png` mantém a paleta azul da floresta existente; proveniência e prompt completo em `assets/art/dream-forest/prompts-profundidade-v1.json`.

`DreamRoach` preserva o PNG original e prepara segmentos em Canvas. Seis patas alternam tripés; cabeça e antenas investigam, e a pata frontal alcança Yuna por duas juntas na captura. A patrulha percorre o fundo acompanhando o avanço lateral da cena, com oscilação e varredura próprias. Pose, olhos físicos e sombras usam o mesmo relógio salvo. A geometria nova usa `nightmare.version=4`; saves do trecho curto retomam no primeiro abrigo e saves da revisão intermediária migram ao solo contínuo. Domínio5/envelope1 e trecho aéreo preservados.

## Poses de abrigo e terreno contínuo

Fontes integradas: `yuna-furtiva-v2.png`, grade3×2, com mãos nos ouvidos, quatro passos abaixados e salto encolhido; `abrigos-floresta-v2.png`, grade2×2, com cepo, tronco cortado, relevo rochoso com terra e lama opaca. Prompts completos, referências, modo integrado e hashes em [prompts-furtividade-v3.json](prompts-furtividade-v3.json). Variantes1 preservadas como referência: poses/raízes se tocavam e não foram integradas.

As elevações são preenchidas até o chão, sem buracos laterais; o perfil superior medido no alfa ancora os pés. A menina se mantém próxima à base dos abrigos. O mergulho oculta o corpo sob lama pintada e conserva uma ondulação para o jogador. Não desenhar hitboxes, linhas de salto ou réguas sobre as ilustrações. Aprovação artística humana permanece separada do QA técnico.

A apresentação aérea registra a pintura de `folha-plataforma-v1.png` também nas gramíneas: o cache recentraliza pigmentos por alfa e acompanha `dreamGrassX`, preservando a curva física e dispensando nervuras vetoriais. As extensões do caule são contínuas. O fundo conserva uma única orientação e dissolve as bordas na névoa, evitando árvores bilaterais nas emendas. O tronco mantém a proporção da bifurcação pintada; extensões reutilizam somente casca e passam sob as extremidades dissolvidas da pintura, evitando cortes horizontais. Os prolongamentos dos espinhos unem extremos equivalentes da textura, sem modificar as máscaras de voo.

`DreamSpiderPuppet` separa em memória os oito membros da fonte `aranhinha-v1.png` e anima recolhimento/alcance alternado em torno das raízes. A pintura original, o fio e a trajetória física permanecem preservados; caches são liberados no descarte. A esfera branca atrás da abelhinha pertence ao cotonete da própria pintura canônica, não é uma sobreposição de luz.

## Lagos e continuidade de figurino

Fontes integradas atuais: lagos-lama-v2.png (quatro silhuetas irregulares), yuna-nado-v2.png (quatro braçadas), yuna-furtiva-v4.png, yuna-susto-em-pe-v2.png, yuna-despertar-v2.png e morro-terra-v1.png. A terra é recortada na crista física dos relevos e dissolvida no chão; a saída da margem usa yuna-saida-lama-v2, com palmas na terra, tentativa com escorregão, joelho, arrasto e transferência do peso aos pés. Prompts/hashes em prompts-lagos-v1.json, prompts-consistencia-figurino-v1.json e prompts-morro-v1.json. A variante furtiva-v3 ficou como referência rejeitada por margem insuficiente.

O preparador mede corpos do nado pela âncora da superfície e corpos de escalada pela mão. A linha de lama encobre o mesmo corpo consultado pelos olhos. Não editar só a apresentação sem atualizar essas referências. A fonte de susto mantém pequenos pontos pintados nos laços, registrados pela equipe de arte.

`yuna-saida-lama-v2.png` foi criada pela skill imagegen/ferramenta integrada a partir de furtiva-v4 e nado-v2. A primeira variante permanece como referência. Prompts integrais e hashes em [prompts-saida-lama-v1.json](prompts-saida-lama-v1.json). Recortes usam os vãos de alfa de cada linha; poses originais completas, sem reescrever pixels. Aprovação artística humana pendente.

## Entrada na lama e cinemática de captura

`yuna-salto-lama-v1.png` contém impulso, voo, queda e imersão; `respingo-lama-v1.png` fornece a coroa de lama espirrando com gotas. `floresta-cinematica-v1.png` é um cenário próprio em perspectiva na altura dos olhos. `yuna-cinematica-pesadelo-v2.png` tem dois passos distintos, olhar para trás e terror; a variante1 preserva a primeira geração, cuja passada se repetia. A barata original articulada participa de close e captura em planos próprios. Fontes criadas com skill imagegen/ferramenta integrada; [prompts completos e hashes](prompts-entrada-cinematica-v1.json). Aprovação artística humana pendente. O preparador preserva PNGs e mede componentes completos/máscaras superiores.

A saída própria da lama (yuna-saida-lama-v2) recebeu avaliação positiva do usuário em31/10/2026. Essa aprovação é específica da saída; as artes novas do salto e da cinemática aguardam avaliação humana.

Em31/10/2026, a composição dos três relevos foi revista sem editar os PNGs: `DreamNightmareRenderer.prepareTerrain` registra colunas da terra existente na crista física, expõe o barranco no início exato da subida e dissolve a base no piso. A iluminação ambiente é comum ao chão e aos relevos e respeita suas transparências, sem tarja horizontal no cenário. Física e dados de superfície originais preservados.


A chegada revisada à barata reutiliza morro-terra-v1 no planalto, floresta-cinematica-v1 e as atuações/pedra existentes. Nenhum PNG foi repintado. prepareDreamPlateau recorta a terra abaixo da névoa superior para apoiar os pés no topo plano. DreamRoach revisa pivôs/máscaras dos seis membros, com sobreposição e proteção das juntas. Fontes originais e referência física dos olhos preservadas.
