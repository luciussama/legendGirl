# Perseguição no quarto em 3D

Revisão: 29/10/2026. Na campanha, a vitória sobre o urso na arena inicia a fuga sob fade, sem mostrar a sala intermediária. O save retoma a etapa salva. Consulte o [manual da transição](MANUAL-TRANSICAO-VITORIA-ARENA-FUGA.md).

Para acesso isolado de debug, execute `npm run dev` e, no ícone de bandeira, escolha **Perseguição 3D**.
Para sair, escolha outra fase. Essa execução de debug conserva a campanha salva
e permanece independente da fuga iniciada pela vitória normal da arena.

## Controles e sequência

A menina avança automaticamente. Use A/D, setas esquerda/direita, direcional/analógico
do gamepad ou toque e segure nas laterais. Arrastar o dedo troca a direção.
P pausa e M alterna o som.

O alto da tela mostra apenas as vidas: três corações no NORMAL e seis no FÁCIL.
Cada tropeço consome um coração. Ao perder o último, a menina cai e a tentativa
termina, sem capturar o urso nem enviá-lo ao baú. A música diminui durante a queda
e para no fim de jogo. A tela informa “A menina não alcançou o urso. Tentar novamente?” e oferece nova tentativa, reiniciando a abertura da fuga.
Snapshots novos conservam a dificuldade; snapshots antigos usam a dificuldade
selecionada. O contador de impactos existente é a fonte das vidas restantes.

A perseguição encadeia urso caído, aproximação da menina, levantar, fuga, corrida, alcance e
ida ao baú. A pista tem 720 unidades de percurso, com velocidade crescente e seis
trechos de avaliação; a duração depende do ritmo e dos tropeços.

Depois de COMPLETE, a campanha mantém o resultado por 150 ticks (2,5 s na referência de 60 Hz) e abre [Um dia no jardim](../garden/GUIA-JARDIM.md). `ToyRoomPhase.startGarden` descarta a perseguição e seu renderer antes de preparar a fase 2D. A prévia de debug permanece em COMPLETE até escolher outra fase. O save passa a guardar `toyRoomGarden`, prioritário na restauração da sala; a conclusão da prévia não inicia essa transição de campanha.

A abertura é inteiramente ilustrada: urso caído, aproximação lenta da menina e
levantar do urso usam poses pintadas, com a cena da cama como referência de linguagem.
`ChaseIntroRenderer` compõe as artes originais do quarto em Canvas 2D. Nenhum quadro
WebGL é apresentado nessas três etapas. Depois que o urso fica de pé, um corte
escuro curto revela a largada em 3D. Pausa e restauração usam o mesmo relógio do
domínio, sem outro laço de animação. A arte exclusiva fica em
`assets/art/toy-room/bear-chase/cinematic/approach-atlas-v1.png`, com referências e
resumo do prompt no JSON adjacente; os sprites anteriores não foram substituídos.
`reach-atlas-v1.png` acrescenta inclinação, mão estendida e susto: a menina chega
perto da pelúcia ainda caída, quase toca e recua quando o urso reage. O urso só
começa a levantar depois desse gesto e vira para fugir antes do corte. As poses
conservam o apoio dos sapatos; a proximidade é ajustada ao formato da tela.
O piso usa o mesmo recorte 186×48 do quarto, com escala das tábuas preservada.

O quarto usa geometria 3D e os materiais ilustrados atuais. A menina agora tem malhas
volumétricas, vestido creme bordado com detalhes rosa, rosto, duas marias-chiquinhas com laços e articulações hierárquicas próprias.
Caminhada, corrida, repouso e tropeço são poses calculadas sem modificar a simulação.
A corrida comprime o corpo no apoio e o recupera entre passadas; tronco e braços
contrabalançam o quadril, enquanto quadril, joelho e tornozelo mantêm os pés junto
ao piso. Cabelo e saia respondem com movimento secundário próprio. Esses ajustes
são apenas de apresentação: não alteram deslocamento, colisões ou dificuldade.
O urso tem volume e atuação de fuga. `ChaseFairyModel` apresenta um pequeno
núcleo branco/ciano com aura azul, quatro asas peroladas maiores que o núcleo e
um rastro curto de partículas instanciadas. A referência atual enviada pelo usuário
é a fada luminosa de Ocarina of Time; não há corpo humanoide, rosto ou varinha.
Ela circula dos dois lados da menina, à frente e atrás, com variação de altura,
em vez de permanecer sobre a cabeça. A órbita e as asas usam o relógio salvo;
pausa/restauração não acumulam movimento extra. A luz acompanha o núcleo.
Asas, esfera e aura têm volume real; não é usado sprite no WebGL.
As cenas ilustradas de entrada mantêm sua arte própria.
 A aprovação humana da
prévia anterior não homologa automaticamente o novo modelo da menina.

`Chase.mp3` começa na arrancada e diminui no alcance. Os passos usam os WAVs fornecidos.
A música repete o arquivo integral; a emenda musical e a mixagem final
continuam pendentes de escuta.

## Dificuldades

O EASY conserva os grupos e larguras anteriores: um brinquedo por lançamento no começo e até dois após 35% da pista. No NORMAL, os lançamentos passam a três brinquedos entre 70% e 85% (504 a 612 unidades). A partir de 85%, voltam a dois brinquedos por lançamento, com intervalo constante de um segundo.

`ChasePatterns` deixa um corredor único. Com três brinquedos, o vão tem 1,35 unidade e a folga para posicionar o centro da menina é de 0,63. Os pares finais deixam folga de pelo menos 2,38 unidades para o centro, alternando a faixa livre entre vizinhas: a dificuldade vem dos desvios seguidos, com espaço para atravessar. As bordas não oferecem uma posição parada segura. Não há grupos de quatro.

`ChaseConfig.finalPressureStart` e `finalDropInterval` definem a entrada e a cadência final. O primeiro par sai ao cruzar 85%; o ritmo não é interrompido pelas emboscadas de curva. Mesmo quando o urso fica próximo, os brinquedos são lançados adiante com tempo para pousar e permitir reação. O último grupo fica dentro da pista e deixa de ser lançado quando já não caberia esse aviso antes da chegada. Os pares já lançados continuam exigindo desvio até perto da captura.

Os grupos densos recebem escala uniforme e centro visual alinhado à colisão, sem deformar as proporções dos objetos. Vidas, invulnerabilidade, grupos e ritmo do EASY permanecem iguais.

## Contratos dos módulos em src/js/bear-chase

| Módulo | Responsabilidade |
| --- | --- |
| `ChaseConfig` | Unidades de mundo, segundos e parâmetros da fase |
| `ChaseSimulation` | Estado versionado, etapas, colisão varrida, padrões e RNG |
| `ChasePatterns` | Quantidade e geometria dos grupos conforme progresso e dificuldade |
| `ChaseHealth` | Limites de três/seis vidas e etapas de derrota |
| `ChaseRoute` | Traçado contínuo, referenciais, relevo e pontos de emboscada |
| `ChaseRoom` | Superfícies contínuas e decoração em posições absolutas |
| `ChaseInput` | Intenção lateral e instalação/remoção dos listeners |
| `ChaseAudio` | Arquivos locais, ganho, pausa, passos e posição musical |
| `ChaseRenderer3D` | Composição do percurso, câmera e descarte GPU |
| `ChaseIntroRenderer` | Atuação ilustrada anterior à largada e corte para o 3D |
| `ChaseFairyModel` | Núcleo de luz volumétrico, asas articuladas e voo orbital |
| `ChaseGirlModel` | Modelagem volumétrica, paleta e pivôs da menina |
| `ChaseGirlAnimation` | Apoio dos pés, porte da espada, desvio, cabelo e saia |
| `ChaseGirlPalette` | Paleta regional rastreável ao sprite de corrida |
| `ChaseBearModel` | Pelúcia volumétrica e atuação da fuga/retorno |
| `ChaseToyModels` | Adaptador de compatibilidade para o trem do catálogo |
| `props/ChasePropCatalog` | Instâncias, referências, limites visuais e liberação local |
| `props/ChasePropResources` | Propriedade e compartilhamento de materiais, texturas e malhas |
| `ChaseHUD` | Mensagens da perseguição, sem mutação da simulação |
| `BearChasePhase` | Composição e adaptação do dt legado, sem receber a sala inteira |

`ToyRoomPhase.startChasePreview()` desliga os controles da sala e instala os da perseguição.
`createGame.startDebugPhase('bear-chase')` usa o isolamento de campanha do seletor.
`BearChasePhase.snapshot/restore` preserva dados da perseguição; o acesso isolado de debug não grava
esses dados no save de campanha. A vitória da arena usa `startChaseCampaign()` como
fluxo distinto: escurece a tela, prepara as artes ilustradas antes de revelar a abertura e carrega o cenário 3D durante a atuação e
salva/restaura a etapa da fuga junto à campanha. Saves antigos sem esse campo
continuam válidos.

Three.js 0.186.1 está fixo no lockfile e distribuído em `src/vendor/three/`, com licença
MIT preservada. O renderer é importado tardiamente e requer WebGL 2. As fases 2D não
carregam seus módulos pesados. Não há CDN nem serviço pago de geração.

## Desenvolvimento e validação

Documente cada método novo em português do Brasil. A simulação não importa DOM,
Web Audio ou Three.js. Desenho e som consomem estado/eventos sem decidir dano.

- `npm run test:bear-chase`: domínio, sequência, padrões, colisão, RNG e restauração.
- `npm run test:bear-chase:browser`: requer Chrome isolado com CDP em 9222; verifica
  a perseguição no jogo real e executa em workspace temporário.
- `npm test`: inclui a regressão de domínio junto das fases anteriores.
- `npm run docs:sprites`: reconstrói as referências de consumo das artes atuais.
- `npm run journal:qa -- test:bear-chase:intro:browser`: verifica abertura ilustrada,
  quase toque, sequência da reação, ausência de apresentação 3D, pausa/save e três formatos.
- `npm run journal:qa -- test:bear-chase:health:browser`: verifica vidas, queda e
  fim de jogo nas duas dificuldades e em três formatos. O domínio faz parte de `npm test`.

Resultados e fontes de QA ficam no diário de IA. Emulação e avanço controlado não
homologam dificuldade humana, Safari ou aparelhos físicos.

## Modelo 3D da protagonista — revisão 5

A revisão atual acompanha a menina ilustrada girl-v2: vestido creme inteiro, barra e faixa rosa, mangas bufantes, laço nas costas, bordado floral, botas marrons e duas marias-chiquinhas curtas com laços. Cabeça e cabelo têm escala conjunta menor, enquanto tronco, braços e pernas foram alongados para aproximar a silhueta da pintura. A franja acompanha as têmporas em volume; os cachos laterais deixam de formar placas. As costas continuam uma interpretação em volume; não presumir homologação humana de todas as vistas.

`ChaseGirlPalette.js` e `assets/models/bear-chase/paleta-menina.json` vêm de `node scripts/prepare-chase-palette.js`: regiões do novo `girl-v2/source/locomocao.png`, mediana 7×7, limiar de alfa e hash. A guarda azul da espada conserva seu material anterior, explicitamente registrado. Detalhes rígidos do mesmo material são agrupados por articulação; 120 pétalas de baixa tesselação usam uma única malha instanciada. Dois rabos e pontas recebem movimento secundário sem alterar a simulação. A fada orbital e os dois mapas de sombra conservam seu contrato.

O construtor gera malhas locais; o GLB é intercâmbio em pose neutra, regenerado por
`node scripts/export-chase-girl.js`. A animação não está embutida no GLB. O renderer
compartilha geometrias e controla descarte. A frente é -Z, pés na origem. Apoio dos
pés é resolvido por articulações; a inclinação responde à velocidade lateral e
retorna ao eixo ao parar o desvio. `ChaseGirlModel.proportions` define os comprimentos de braços e pernas e a altura da sola. O solver de `ChaseGirlAnimation` transforma o alvo do pé para o quadril, resolve os dois segmentos e compensa a orientação completa do tornozelo. Assim, a oscilação e a rotação do quadril preservam o apoio, inclusive no repouso. A espada usa o novo comprimento do antebraço para permanecer na mão. A passada mantém dois apoios por ciclo com os
intervalos dos passos gravados. Física, obstáculos e hitboxes mantêm seus contratos.

## Comparação visual para revisão

A página de comparação e o alias histórico `test:bear-chase:comparison:browser` estão arquivados. A página não está disponível em uma instalação comum de `npm run dev`. O executor atual recupera arquivos de scripts/tests/assets, mas não as fixtures ausentes sob `docs/diario-ia/qa/`; esse painel exige recuperação manual verificada no workspace temporário antes de executar a fonte histórica. Veja a limitação em [COMANDOS](../COMANDOS.md#recuperação-de-painéis-históricos).

O painel mostra exploração/arena e modelo sob luz neutra e no quarto, em escala de
leitura de gameplay. Permite animar/congelar, selecionar repouso/corrida e vista
lateral, três quartos, frente e costas. “Detalhes (2,5×)” amplia fonte e modelo
juntos, mantendo a apresentação no quarto na escala de gameplay. A fonte de arena é lateral e não comprova
uma vista traseira original. O painel é QA local, não integra a publicação do jogo.

A fonte do teste `test:bear-chase:comparison:browser` verifica paleta, apoio,
desvio, trem sem cartão, fada atrás, volume do urso e ausência de erros na página.
O teste não certifica identidade artística nem aparelhos físicos.


## Catálogo completo e percurso contínuo — 20/10/2026

O painel de objetos também é uma fixture arquivada, sujeita à mesma recuperação manual temporária do painel de comparação; não é uma rota permanente do servidor de desenvolvimento.
O painel compara os quinze objetos com as artes originais sob luz neutra e dentro
do quarto. Use quatro vistas, giro, escala, abertura do baú e o controle de
**Distância** para percorrer a sala. Os oito últimos modelos ainda aguardam
avaliação artística; faces ocultas são interpretações, não novas fontes oficiais.

O catálogo reúne trem, blocos, coelho, ursinho, robô, pato, tambor, caixa de surpresa,
armário baixo, estante, castelo, baú, poltrona, cavalinho e mesa. Os oito novos itens
são decoração: os arremessáveis continuam sendo trem, blocos e coelho. As fábricas
compartilham materiais e geometrias, com apoio inferior; retirar uma instância não
libera os recursos comuns. `DecorativeProps` constrói as famílias decorativas por
composição; não conhece colisão, save ou eventos de campanha.

A sala deixou de reciclar doze módulos. `ChaseRoute` define curvas encadeadas,
subidas e descidas; `ChaseRoom` constrói piso, paredes, rodapés e teto contínuos,
com UVs longitudinais. Móveis e janelas têm distâncias fixas e ficam junto às
paredes. Só a visibilidade distante é reduzida, além do alcance da neblina;
nenhum móvel troca de tipo ou posição quando a menina avança. O baú final fica
em uma área lateral livre. Modelos, brinquedos lançados e câmera seguem o mesmo
referencial de percurso, preservando a leitura entre desenho e colisão.

Esta revisão inclui mudança de dificuldade solicitada pelo usuário. A simulação
aplica deriva moderada para fora das curvas, reduzida no FÁCIL, e variação limitada
de velocidade nas rampas. Nove pontos de lançamento favorecem a faixa externa da
curva, deixando uma faixa interna livre. Cada emboscada é lançada 20 metros antes
do alvo; outros padrões são espaçados para evitar sobreposição. A largura lógica,
a colisão varrida, a duração de voo e os três tipos de obstáculo permanecem.
Snapshots continuam usando distância longitudinal e posição lateral; não salvam
coordenadas Three.js. Saves existentes continuam válidos, mas o percurso restaurado
passa a seguir o novo traçado e os novos padrões intencionalmente.

Os quatro atlas anteriores continuam nos modelos já existentes. Após reprovação
dos oito objetos decorativos, suas formas foram reconstruídas e receberam um
atlas próprio 4×4: madeira/crina/sela, borracha, esmalte/latão, pelúcia, tecidos,
laca e pele do tambor. `decorativos-atlas-v3.png` é a versão consumida; o estudo v2 foi aposentado e preservado no acervo. Texturas geradas pela ferramenta integrada image_gen, com
prompts junto aos PNGs. Fontes originais preservadas; sem CLI/API paga separada.
A revisão dos modelos ainda aguarda avaliação artística humana; a iluminação atual está descrita abaixo.

Para servir somente no computador local:

```sh
node --input-type=module -e 'import express from "express"; const app=express(); app.use(express.static(process.cwd())); app.listen(3000,"127.0.0.1");'
```

Validação vigente:

- `npm run journal:qa -- test:bear-chase:route`: quinze modelos, quatro vistas dos
  novos objetos, sala fixa, orçamento, visibilidade nas curvas, três formatos,
  36 enquadramentos finais e percursos NORMAL/FÁCIL com decisões a cada 300 ms.
- `npm run test:bear-chase:browser`: teclado/toque, áudio, pausa, save, conclusão
  controlada e descarte no jogo real.
- `npm run journal:qa -- test:bear-chase:props:fidelity`: comparação dos oito objetos
  com as fontes, proporções projetadas, regiões do atlas, quatro vistas e escala
  de gameplay. Proporção semelhante é só um indicador, não aceite artístico.
- `npm test`: domínio e regressões das fases existentes.

Os aliases históricos de catálogo/móveis preservam evidências das versões retas
e suas antigas expectativas de coordenadas. A validação do novo traçado usa
`test:bear-chase:route`. Resultados de máquina pertencem ao diário de IA. Emulação
não homologa dificuldade humana, Safari ou aparelhos físicos. A integração da campanha está implementada; maior duração definitiva e mixagem final permanecem trabalhos separados.

## Iluminação do quarto

`ChaseLighting` compõe preenchimento hemisférico, luz refletida discreta,
projetores das janelas e luz principal à frente do urso. Piso, paredes, rodapés,
teto e tapetes respondem à luz. Menina, urso, brinquedos e móveis recebem e
projetam sombras. A fadinha tem núcleo branco/ciano e aura azul volumétrica;
um `SpotLight` amplo junto ao núcleo ilumina a menina e os objetos próximos.
A cabeça, os braços, a roupa e os brinquedos participam das sombras reais dessa luz.
O núcleo e as asas não bloqueiam a própria fonte luminosa.

As janelas iluminam regiões fixas da sala com entrada/saída suave; sua máscara
projeta o desenho das vidraças. A luz principal acompanha o traçado à frente do
urso, projetando sua sombra para trás. O preenchimento indireto é aproximado por
luzes de ambiente/rebatimento em tempo real, sem cálculo físico de iluminação global.

Somente a luz principal e a fadinha geram sombras simultaneamente. A sombra
da janela dominante foi substituída pela luz da fada, preservando dois passes.
As janelas conservam sua iluminação e máscara das vidraças. Não há sombra cúbica
de luz pontual, bloom de tela inteira ou novo framebuffer de pós-processamento.
Mapas: principal 2048² e fada 1024² em paisagem; 1024²/512² em retrato.
São dois mapas alocados; a luz local tem alcance de 7,5 unidades e filtragem PCF.
O controlador libera esses recursos ao encerrar a perseguição. O teto não bloqueia
a luz global de apresentação, mas participa da iluminação recebida.

`npm run journal:qa -- test:bear-chase:fairy:browser` verifica luz e sombras em pixels
reais da menina/cena, volume da fada, três formatos, curvas, pausa, orçamento e descarte.
Os testes históricos de iluminação/janela conservam o contrato anterior e suas evidências;
a versão atual dá prioridade à sombra da fada.
O limite de chamadas de desenho é uma referência interna de desempenho; não
equivale a um limite do navegador nem certifica FPS em aparelhos reais.

A revisão das curvas elevou a luz principal para evitar sombras rasantes das
paredes sobre toda a pista. As janelas têm alcance local de 18 unidades e máscara
permanente; sua intensidade entra e sai suavemente sem trocar um mapa de sombras.
A sombra local da fada muda suavemente de direção conforme ela circula ao redor da menina. O volume do mapa principal cobre a área próxima de
jogo, evitando incluir objetos distantes sem utilidade nessa projeção.

`ChaseLighting.js` documenta cada método, seus parâmetros, propriedade dos recursos
e efeitos dos valores de ajuste. A regressão da fada percorre o controlador completo
com entradas automatizadas no NORMAL e EASY. Chamadas de desenho e resolução de mapas
são controles de orçamento; desempenho em GPU móvel física ainda exige medição no aparelho.


## Urso articulado

`ChaseBearModel` constrói a pelúcia com material pictórico derivado da arte da
arena; `ChaseBearAnimation` resolve a pose sem decidir eventos de jogo. A corrida
inclui joelhos, tornozelos, transferência de peso, contrabalanço e movimento de
orelhas/laço. O atlas consumido é `urso-atlas-v2.png`; prompts ficam ao lado dele.
A locomoção é cinemática e não usa bloqueio horizontal físico das patas.


## Intensificação da perseguição

`ChasePacing.js` concentra a progressão: após os primeiros 15% da pista, a
velocidade-base cresce suavemente de 8 para 12. Rampas e tropeços continuam
influenciando o avanço. O urso perde distância gradualmente e a aproximação final
se intensifica nos últimos 6%, sem parar a passada da menina antes da captura.

Os lançamentos passam a ter intervalos e voo menores. Cada brinquedo guarda seu
tempo de voo para que desenho, pouso e colisão concordem; saves anteriores usam o
tempo original quando esse campo não existe. Um cálculo de velocidade prevista
preserva tempo para reagir depois do pouso. No FÁCIL, a folga longitudinal é maior.
Nos trechos rápidos, as saídas sucessivas exigem no máximo uma mudança de faixa;
quando falta espaço para um lançamento seguro, o urso encerra os ataques.

`ChaseCamera.js` calcula a câmera sem modificar a simulação. Ela avança em direção
às costas da menina e baixa suavemente, com oscilação vertical pequena ligada ao
deslocamento. O campo de visão abre discretamente para preservar leitura periférica.
No retrato, há folga adaptativa quando os atores ocupam faixas diferentes. A captura
começa na mesma câmera e leva ao enquadramento do baú por transição contínua.

A regressão de ritmo integra `npm run test:bear-chase`. As verificações específicas
estão em `journal:qa -- test:bear-chase:pacing:browser` e
`journal:qa -- test:bear-chase:pacing:gameplay:browser`. Avaliação humana de desafio e
conforto do balanço continua distinta dos percursos automatizados.


## Piso de madeira e envio à GPU

A corrida usa o recorte de madeira 186×48 em (27,151) da prancha existente `environment-sheet.png`. `ChaseRenderer3D.floorTexture` prepara uma cópia temporária 256×64, com a mesma cobertura UV e repetição 9×2. A textura é enviada como bytes RGBA com uma cadeia completa de reduções até 1×1, sem geração de mipmaps no driver. As linhas são invertidas explicitamente para conservar a orientação da textura anterior. Essa preparação ocorre somente no carregamento e o recurso pertence ao descarte do renderer. Antes de construir a sala, um passe pequeno fora da tela confirma que a GPU amostra a madeira. Se a cadeia de mipmaps não produzir sinal válido, o renderer tenta a mesma cópia da arte como CanvasTexture, com filtro linear e sem mipmaps/anisotropia. A alternativa também precisa passar pela leitura da GPU; caso contrário, a preparação falha explicitamente. Todos os mapas são decodificados, enviados à GPU e os materiais são compilados antes de `ready`.

A mudança é de compatibilidade do envio da textura. O arquivo de arte, as tábuas no mundo, o material receptor de luz, as sombras e a simulação continuam com os mesmos contratos. Não usar um piso sem iluminação para disfarçar falhas de carregamento.

## Limites do fluxo atual

COMPLETE mantém a fase ativa depois da ida ao baú; falta a navegação final. GAME_OVER termina sem captura e oferece retry da fase pela interface. A cada três derrotas no NORMAL, somadas à campanha, surge a oferta do fácil. Aceitar retoma a distância/posição da fuga com seis vidas e dois segundos de imunidade; recusar mantém a dificuldade e a tentativa encerrada. A abertura obrigatória funciona como carregamento: aparece antes do preparo 3D e aguarda junto ao urso caído quando necessário. A arrancada permanece bloqueada até a prontidão visual. A validação de textura e a alternativa de compatibilidade foram verificadas no Chrome; a confirmação do defeito relatado no Safari continua dependendo do navegador do usuário.

Além dos módulos da tabela, `ChasePacing`, `ChaseCamera`, `ChaseLighting` e `ChaseBearAnimation` isolam ritmo, enquadramento, iluminação e articulações. As fábricas específicas de objetos, primitivas e atlas estão descritas no [catálogo completo](../ARQUITETURA.md#catálogo-completo-dos-módulos-javascript). Aprovação técnica não substitui avaliação artística de modelos, novas poses e materiais.
