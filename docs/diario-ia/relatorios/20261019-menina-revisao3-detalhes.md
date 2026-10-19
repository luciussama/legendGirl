# Revisão 3: braços, mangas, franzido e rabo de cavalo

Sessão `20261019T200000-6be5b3278690`. O usuário considerou a revisão anterior
“75% bom” e pediu melhorar proporções dos membros superiores, mangas fofas,
pregas no alto da saia e rabo de cavalo, mantendo a assinatura visual original.
Esse feedback não é aprovação integral nem aprovação automática desta revisão.

## Mudanças e referências

Conferidos o run-sheet e o idle atuais da arena, inventário e guia de designers,
contexto e encerramento da sessão anterior. Paleta regional e hash da fonte
foram preservados; verificação explícita confirmou o hash registrado no JSON.
Não houve recoloração dos sprites nem nova geração paga.

- Braço superior reduzido de 0,18 para 0,15 unidade; antebraço mantido em 0,17.
  Posição dos ombros, junção do cotovelo, mão e encaixe da espada ajustados para
  um membro mais compacto, com porte da espada à frente. O primeiro estudo de
  encurtamento do antebraço foi corrigido após inspeção para não apagar sua leitura.
- Manga clara bufante com volume próprio, gomos suaves e punho salmão estreito,
  substituindo o pequeno volume rosado da revisão 2. Mesma paleta amostrada.
- Saia reconstruída com 20 subdivisões verticais e 96 angulares, franzido de
  maior amplitude perto da cintura e sombra suave nos sulcos. Painel claro e
  tecido salmão usam a mesma posição espacial das pregas para evitar cruzamentos.
  Trata-se de detalhe geométrico e sombreamento nos vértices, não de linhas
  auxiliares de contato ou hitbox sobre o cenário.
- Rabo único com curva mais comprida, raiz deslocada lateralmente, mecha clara
  de leitura, duas pontas articuladas e balanço recalibrado. Inspeção intermediária
  mostrou projeção excessiva; escala por eixo foi calibrada para manter o rabo
  visível sem transformá-lo numa massa desproporcional. A vista lateral final
  foi inspecionada lado a lado com o sprite, na mesma orientação.

Rosto, paleta, pernas, física, colisões, áudio, cenário e duração foram mantidos.
Apenas o modelo da perseguição e sua animação/apresentação de detalhes mudaram.
Modelagem continua local em código e exportação GLB; nenhuma dependência nova.
Métodos novos/alterados documentados em português do Brasil.

A comparação identifica revisão 3 e oferece “Detalhes (2,5×)” para ampliar as fontes
e o modelo juntos; os dois quadros no quarto continuam em escala de gameplay.
Vistas traseiras continuam interpretações novas, sem declarar um sprite traseiro
original inexistente. URL local:
`http://localhost:3000/docs/diario-ia/qa/perseguicao-20261019/comparacao.html`.

## Validação

- `npm test`: aprovado; saídas completas nos pacotes automáticos do diário.
- `test:bear-chase:browser`: aprovado em 1280×800, 390×844 e 844×390,
  controles de teclado/toque, pause/snapshot, áudio/mudo, campanha preservada,
  percurso automatizado completo até o baú e descarte. Pico 285 recursos GPU
  (limite existente 300), 310 chamadas de desenho no desktop. Não é benchmark móvel.
- `test:bear-chase:comparison:browser`: aprovado na versão final; captura normal
  e lateral ampliada inspecionadas, paleta regional preservada, apoio máximo a
  0,001 unidade do piso, desvio retornando ao eixo, sem exceções/HTTP falhos.
  A comparação foi repetida após a calibração final do rabo e da orientação lateral.
- QA em três ângulos durante refinamento: 56 instâncias, zero planos de personagem,
  39 recursos próprios, repetição de pose estável e movimento detectado. Não foi
  relaxado o limite global nem o limite de 50 recursos específicos do modelo.
- GLB final validado: 1.168.596 bytes, 56 instâncias, 35 malhas compartilhadas,
  11 materiais utilizados e pivôs preservados. Sem clipes embutidos; animação em JS.
- Mapa de sprites reconstruído: 416 imagens, 99 recortes, 29 assinaturas.
  Referência de métodos: 123 módulos, 871 declarações. Build/check-assets/lint,
  sintaxe e git diff --check aprovados.

Um erro de sintaxe no primeiro cálculo exponencial do franzido foi detectado por
node --check e corrigido antes do QA de navegador. O exportador advertiu sobre
normalização de normais, concluiu e o arquivo passou na validação estrutural.
Esses fatos não foram apagados nem tratados como aprovação artística.

## Evidências regeneráveis

| Caminho temporário | Bytes | SHA-256 |
| --- | ---: | --- |
| `/tmp/legendgirl-comparacao-v2.png` (nome histórico do executor) | 353051 | b5dad59422792b8a515d90e7c64961d4b6311bdf0e6cc809ec9bab6ed3ecb3e2 |
| `/tmp/legendgirl-detalhes-r3.png` | 409931 | 09ba1be14f29f85d400b93d81ddb5e12038f76d044b74f494eb883c680e539f3 |
| `/tmp/legendgirl-chase-1280.png` | 803483 | 8329b68cc64d5606465acf356ff8acc1df25e804cc0c94301155793acd2c1ca6 |
| `/tmp/legendgirl-chase-390.png` | 396830 | d138a58f5e272f2a3b31f131afbb978bf4e5d00f1dbd9163bb2fe048fa1be893 |
| `/tmp/legendgirl-chase-844.png` | 450442 | 88ecdeb495693d6a0ab5a52534a0e94d9b857b1a4212dd21971a9ff7a176dd01 |

Capturas temporárias descartadas após inspeção. Fonte de QA e saídas preservadas
no diário, recursos GLB e artes do jogo preservados. Os percursos são automatizados
e a avaliação visual aqui é da IA, não homologação humana ou teste em aparelho físico.
Pendente: avaliação do usuário dos quatro ajustes e limites anteriores de
campanha, expansão temática e hardware. Nenhum commit/push nem cobrança realizada.
