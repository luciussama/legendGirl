# E3/E4 — catálogo e primeiro lote integrado

Sessão `20261020T130520-75b12c979064`, Codex, 20/10/2026.
Usuário autorizou avanço após aprovação parcial de trem/armário e adiou iluminação.
Padrão obrigatório dos móveis: laterais, portas para dentro e rota central livre.

## Implementação

- `ChasePropResources` assume propriedade GPU explícita; recursos de catálogo
  também integram o contador do renderer. Descarte remove-os dos dois proprietários
  sem duplicação. `PilotPropResources` permanece um reexport para compatibilidade.
- `ChasePropCatalog` resolve quatro IDs, com referência e bounds reais. Fábricas
  recebem recursos/imagens, sem conhecer simulação, campanha ou colisão.
- `ChaseToyModels` delega ao catálogo, eliminando o segundo trem de cubos.
- `BlocksProp`: quatro peças em contato, vermelho/amarelo/verde/telhado azul.
- `BunnyProp`: pelúcia sentada, duas orelhas separadas, focinho creme, bordados,
  olhos, patas e cauda; tons rosa/creme alinhados a medianas de regiões do sprite.
  Amostras 5×5: bochecha (44,49)=[238,159,125], creme (29,68)=[234,192,140].
- Trem em orientação lateral, escala adicional 0,85 para largura aparente 1,06794,
  dentro da largura lógica 1,15. Blocos 0,67 e coelho 0,55814 de largura.
- Pivôs no apoio: Y assentado = 0. Retirada a meia-altura antiga de planos;
  preservados X/Z, duração 0,65 s, arco de voo e estado lógico. Novo trem tem
  centro visual em meia-altura própria, em vez do antigo deslocamento 0,32.
- Reuso de ID com tipo diferente após restauração substitui só a instância visual.
- Seis armários nos setores, X=±4,95 e portas para dentro. Móveis antigos também
  foram orientados nas laterais. Seus limites medidos ficam fora de |X|<4,3 e dentro
  das paredes |X|=5,5. Estante/castelo ainda são planos com suporte, não modelos
  convertidos; a vista de perfil torna essa limitação especialmente evidente.
- Piso/parede/friso/janela/suporte/tapete compartilham geometria entre 12 setores;
  materiais decorativos comuns. Dois frisos por setor foram unidos, sem mudar UVs
  ou posições. Nenhuma linha auxiliar ou alteração de física foi introduzida.
- Painel anterior ampliado para quatro modelos, usando exatamente o catálogo do
  jogo em luz neutra e no quarto. Originais preservados, sem novo bitmap/GLB pago.

## Verificações reais

- `npm test`: aprovado, incluindo suíte geral, defesa, progressão, bailarina e oito
  percursos NORMAL/EASY da perseguição. Saídas integrais nos registros de QA.
- `check-assets` (66 recursos globais), build, lint e sintaxe individual dos módulos:
  aprovados. Inventário/mapa reconstruído: 416 arquivos, 99 recortes, 29 assinaturas.
- `npm run journal:qa -- test:bear-chase:catalog`: aprovado em workspace temporário,
  Chrome isolado, servidor só em 127.0.0.1. Integridade de fontes, domínio, config
  e personagem; volumes/apoio/compartilhamento, limites laterais, 80 trocas com
  mesmo ID e tipos diferentes, estado preservado, ausência de descarte prematuro.
- Recuperação WebGL: perda real pelo extension, update com pausa global removida
  e estado congelado pelo contexto perdido, restauração e quadro refeito.
- Desktop 1280×800, retrato 390×844 e paisagem 844×390: WebGL2, inputs reais
  teclado/toque, snapshot/pause, áudio/mudo, percurso controlado até COMPLETE,
  save da campanha preservado, recursos e ponteiros zerados ao sair.
- `test:bear-chase:catalog:models`: aprovado, quatro vistas por objeto, lançamento,
  viewports sem overflow e descarte idempotente [0,0,0]. Materiais opacos e volumes
  reais; quatro instâncias compartilham recursos entre cópias. 60 trocas mantêm
  contagens [42,123,117] (catálogo neutro, cena referência, cena modelo).

Métricas finais: catálogo 42 recursos; cena própria 117 constantes durante o percurso,
contra pico anterior 285, sem elevar limite 300. Cenário comparável à baseline:
1 bloco em X=2,4/Z=193, distância 180, 1280×800: **294 chamadas**, antes 310.
A primeira medição deu 312; pareamento dos frisos reduziu para 294 e o orçamento
passou a ter asserção explícita. Com três brinquedos simultâneos, são 306/300/306
chamadas nos três formatos, 13 texturas e 55 geometrias. Esses contadores não são
benchmark de FPS, bytes de VRAM ou aparelho físico.

Bounds X/Y/Z: trem 1,06794/0,53825/0,44431 (4648 triângulos, 6 materiais);
blocos 0,67/1,05/0,46 (140 triângulos, 4 materiais); coelho
0,55814/1,05041/0,52725 (11448 triângulos, 6 materiais); armário
2,12/1,19750/0,93150 (3172 triângulos, 4 materiais). Apoios em Y≈0.

## Crítica recebida: textura simplificada

Usuário informou que o tom está adequado, mas faltam detalhes para a riqueza
visual pretendida, citando Legend of Mana. Não equivale a aprovação dos novos
modelos ou do acabamento. Explicação técnica auditada:

- Carvalho vem de 60×52 pixels internos do armário ampliados a 128×128. Uma
  amostra repetida não representa a distribuição original de nós, juntas e desgaste.
- Madeira pintada neutraliza a cor da amostra e comprime a variação para
  `180 + canalR × 0,29`; o resultado é suave demais para a pintura detalhada.
- Pelúcia vem de 8×10 pixels ampliados a 64×64, com luminância comprimida e repetição
  3×3. Aumentar esse canvas não cria fibras ou costuras que não estejam na amostra.
- Materiais `MeshStandardMaterial` usam roughness uniforme 0,95. Cor regional,
  geometria e sombra dinâmica não substituem o trabalho pictórico por região.
- UVs resolvem projeção geométrica, mas não há atlas exclusivo de cada face com
  detalhes colocados artisticamente. As cores corretas não bastam para essa meta.

Foi uma simplificação desta implementação ao priorizar volume e integração.
Rever luz ajuda a leitura, mas não preenche detalhes ausentes. A iluminação segue
adiada; registrar a deficiência de textura separadamente. Antes de repetir o mesmo
acabamento nos demais móveis, a prioridade recomendada é uma prova com mapas
próprios por objeto e UVs por região, preservando veios/nós, bordas gastas, fibras,
costuras e variações pintadas, validados na câmera de gameplay e no orçamento.
Não produzir nova geração paga ou mudar toda a iluminação para responder à crítica.

## Estado da entrega

E3/E4 funcionais e primeiro armário integrado; E5/E6 restantes não concluídos.
Campanha, duração, mixagem e personagem seguem seus trabalhos próprios. Sem
homologação física/Safari, sem alegar estética aprovada. Não houve serviço pago,
cobrança, commit, push ou publicação. Capturas estão identificadas por hash/bytes
nos logs e no JSON de evidências; bitmaps temporários são descartados.
