# Revisão de fidelidade dos oito objetos

Sessão `20261020T160444-c30692d726a7`, Codex. Usuário reprovou os oito modelos
decorativos da primeira execução. A avaliação negativa atual prevalece sobre a
conclusão técnica anterior: os testes de GPU/domínio não atestavam qualidade artística.

## Comparação e correções

| Objeto | Deficiência anterior | Revisão aplicada |
| --- | --- | --- |
| Cavalinho | Alto/estreito, patins finos, crina em bolinhas e corpo genérico | Perfil esculpido, torso arredondado, patins maciços curvos, pernas inclinadas, arreios, focinho claro, crina/cauda contínuas e sela vermelha/verde |
| Patinho | Silhueta e orientação distintas, borracha com material inadequado | Corpo largo, cabeça redonda, bico bipartido, asas/cauda arredondadas e coroa com pontas; material amarelo sem veios de madeira ou pelos |
| Robô | Caixas duras e membros simples | Cabeça/carcaça arredondadas, articulações, pés em duas cores, rosto/sorriso, chave de corda, esmalte verde petróleo e latão |
| Tambor | Textura genérica e cordas na mesma direção | Pele própria, corpo vermelho, aros espessos e cordas alternadas com fixações |
| Caixa de surpresa | Mola segmentada, gorro simples e rosto com textura de pelúcia | Mola contínua, gorro curvo, gola, mãos, sorriso, caixa com losango/rebites e rosto liso |
| Poltrona | Estreita, braços/encosto simplificados | Corpo largo, encosto em arco, braços enrolados, almofada, vivo costurado, botões e tecido de trama fina |
| Ursinho | Pelúcia genérica e proporções estreitas | Cabeça/patas mais largas, pelúcia castanha curta, focinho/pads caramelo, laço, bordado e brilho nos olhos |
| Mesa | Suportes finos e tampo simples | Tampo/borda espessos, madeira pintada própria, suportes curvos cruzados largos, base e fixações |

`DecorativeGeometry` oferece perfis extrudados com chanfros e UVs por face,
retângulos arredondados, curvas contínuas e volumes suaves. Fábricas continuam
independentes do domínio. Recursos mesclados por atlas e compartilhados entre
instâncias; sem cartões como substitutos dos objetos sólidos.

## Atlas e procedência

Gerado **um atlas compartilhado**, com dezesseis regiões e duas revisões, pela
ferramenta integrada image_gen. Não foi usada CLI/API paga separada. Primeira
tentativa rejeitada por exceder cinco imagens de referência; nenhuma imagem foi
produzida nessa tentativa. Geração efetiva usou cavalinho, pato, robô, poltrona
e prancha geral como referências; tambor/caixa foram inspecionados e descritos.
Segunda chamada refinou somente as fibras e tramas excessivamente grandes.

- [Atlas v2](../../../assets/art/toy-room/bear-chase/materials/decorativos-atlas-v2.png): primeiro estudo preservado, não carregado pelo runtime.
- [Prompt inicial](../../../assets/art/toy-room/bear-chase/materials/decorativos-atlas-v2.prompt.json).
- [Atlas v3](../../../assets/art/toy-room/bear-chase/materials/decorativos-atlas-v3.png): versão consumida, 1254×1254, SHA-256 `3e9728ddf02ee8d5381fb5c85a0c4aae9915c14448cdabebaf21c4fb0cd54ea3`.
- [Prompt de refinamento](../../../assets/art/toy-room/bear-chase/materials/decorativos-atlas-v3.prompt.json).

Regiões: madeira/crina/sela vermelha/sela verde; borracha/bico/esmalte/latão;
pelúcia/pads/laca roxa/tecido rosa; tecido vermelho/pele/madeira vermelha/carvalho.
Descritor de atlas agora admite linhas/colunas, preservando os quatro atlas 2×2
anteriores. Margens UV evitam mistura entre células. Novo atlas acrescenta cerca
de 8 MiB RGBA8 com mipmaps; cinco atlas ativos somam aproximadamente 40 MiB,
estimativa e não medição de VRAM. Fontes originais e hashes em
`qa/fidelidade-20261020/fontes.json`.

## Verificações e limites

`test:bear-chase:props:fidelity` passou: oito modelos com atlas próprio, UVs contidas,
apoio inferior, quatro vistas e escala de gameplay. Proporção projetada comparada
à razão da referência; desvios finais abaixo de 16% nos enquadramentos escolhidos.
Essa medida não compara detalhes de silhueta nem prova equivalência artística;
as fontes já têm perspectiva e algumas incluem margens de recorte.

`test:bear-chase:route` passou após integração: quinze modelos, compartilhamento,
posição fixa dos móveis, três formatos, 36 finais, visão nas curvas, conclusão
NORMAL/FÁCIL, recuperação WebGL e descarte zero. Cena próxima de 205 recursos,
abaixo de 300. Build/lint, 66 assets, sintaxe, mapa e diff aprovados. Inventário:
422 arquivos, 99 recortes, 29 assinaturas. A suíte geral não foi repetida porque
esta revisão não muda simulação, controles ou personagens.

Capturas temporárias de iterações/final são identificadas por hash/tamanho/caminho
antes do descarte. As artes geradas são preservadas. Sem teste físico, Safari,
FPS/VRAM ou aprovação humana desta revisão. Laterais ocultas são interpretações;
o acabamento ainda está sujeito à comparação humana. Iluminação permanece adiada.

## Coordenação Git

Observado commit local externo `77adff8d`, criado pelo usuário durante a tarefa,
incluindo os arquivos em edição. Não atribuir sua criação à IA. A referência
remota `04202a8b` diverge por um commit. Usuário autorizou merge após esta revisão;
operação terá registro próprio, preservando ambos os históricos. Não houve push
ou merge durante esta sessão artística.
