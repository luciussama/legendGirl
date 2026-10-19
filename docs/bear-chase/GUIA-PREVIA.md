# Prévia da perseguição no quarto em 3D

Execute `npm run dev` e, no ícone de bandeira, escolha **Perseguição 3D (prévia)**.
Para sair, escolha outra fase. Essa execução de debug conserva a campanha salva.
A vitória da arena na campanha normal ainda usa o fluxo anterior; a nova transição
será integrada após a prova artística.

## Controles e sequência

A menina avança automaticamente. Use A/D, setas esquerda/direita, direcional/analógico
do gamepad ou toque e segure nas laterais. Arrastar o dedo troca a direção.
P pausa e M alterna o som.

A prévia encadeia urso caído, aproximação da menina, levantar, fuga, corrida, alcance e
ida ao baú. São aproximadamente 90 segundos de corrida em seis trechos de avaliação.
A extensão final ainda depende de superar a maior fase existente.

O quarto usa geometria 3D e os materiais ilustrados atuais. A menina agora tem malhas
volumétricas, vestido, rosto, rabo de cavalo único e articulações hierárquicas próprias.
Caminhada, corrida, repouso e tropeço são poses calculadas sem modificar a simulação.
A corrida comprime o corpo no apoio e o recupera entre passadas; tronco e braços
contrabalançam o quadril, enquanto quadril, joelho e tornozelo mantêm os pés junto
ao piso. Cabelo e saia respondem com movimento secundário próprio. Esses ajustes
são apenas de apresentação: não alteram deslocamento, colisões ou dificuldade.
O urso agora tem volume e atuação de fuga; a fada conserva a ilustração com
acompanhamento atrás/acima da cabeça. A aprovação humana da
prévia anterior não homologa automaticamente o novo modelo da menina.

`Chase.mp3` começa na arrancada e diminui no alcance. Os passos usam os WAVs fornecidos.
Nesta prova a música repete o arquivo integral; a emenda musical e a mixagem final
continuam pendentes de escuta.

## Contratos dos módulos em src/js/bear-chase

| Módulo | Responsabilidade |
| --- | --- |
| `ChaseConfig` | Unidades de mundo, segundos e parâmetros da prova |
| `ChaseSimulation` | Estado versionado, etapas, colisão varrida, padrões e RNG |
| `ChaseInput` | Intenção lateral e instalação/remoção dos listeners |
| `ChaseAudio` | Arquivos locais, ganho, pausa, passos e posição musical |
| `ChaseRenderer3D` | Janela reciclada do quarto, câmera e descarte GPU |
| `ChaseGirlModel` | Modelagem volumétrica, paleta e pivôs da menina |
| `ChaseGirlAnimation` | Apoio dos pés, porte da espada, desvio, cabelo e saia |
| `ChaseGirlPalette` | Paleta regional rastreável ao sprite de corrida |
| `ChaseBearModel` | Pelúcia volumétrica e atuação da fuga/retorno |
| `ChaseToyModels` | Trem volumétrico com recursos compartilhados |
| `ChaseHUD` | Mensagens da prévia, sem mutação da simulação |
| `BearChasePhase` | Composição e adaptação do dt legado, sem receber a sala inteira |

`ToyRoomPhase.startChasePreview()` desliga os controles da sala e instala os da prévia.
`createGame.startDebugPhase('bear-chase')` usa o isolamento de campanha do seletor.
`BearChasePhase.snapshot/restore` preserva dados da prova; nesta etapa não há campo
da perseguição no save de campanha nem migração automática.

Three.js 0.186.1 está fixo no lockfile e distribuído em `src/vendor/three/`, com licença
MIT preservada. O renderer é importado tardiamente e requer WebGL 2. As fases 2D não
carregam seus módulos pesados. Não há CDN nem serviço pago de geração.

## Desenvolvimento e validação

Documente cada método novo em português do Brasil. A simulação não importa DOM,
Web Audio ou Three.js. Desenho e som consomem estado/eventos sem decidir dano.

- `npm run test:bear-chase`: domínio, sequência, padrões, colisão, RNG e restauração.
- `npm run test:bear-chase:browser`: requer Chrome isolado com CDP em 9222; verifica
  a prévia no jogo real e executa em workspace temporário.
- `npm test`: inclui a regressão de domínio junto das fases anteriores.
- `npm run docs:sprites`: reconstrói as referências de consumo das artes atuais.

Resultados e fontes de QA ficam no diário de IA. Emulação e avanço controlado não
homologam dificuldade humana, Safari ou aparelhos físicos.

## Modelo 3D da protagonista — revisão 3

A primeira versão foi reprovada pelo usuário por paleta e identidade. O usuário considerou a revisão 2 “75% bom”; a revisão 3 ajusta braços, mangas,
franzido e rabo de cavalo e aguarda nova avaliação: vestido salmão com regiões creme, corpo compacto, mechas
curvas, cabeça e rosto revistos e espada de madeira portada à frente. Não presumir
que as vistas traseiras sejam fontes aprovadas; são interpretações novas.

`ChaseGirlPalette.js` e `assets/models/bear-chase/paleta-menina.json` vêm de
`node scripts/prepare-chase-palette.js`: cada região tem coordenadas, mediana 7×7,
limiar de alfa e hash da imagem atual da arena. As amostras não são uma declaração
de paleta oficial de todas as fases. Iluminação branca controlada e sombras por
vértice procuram preservar os tons sem o amarelamento da versão anterior.

O construtor gera malhas locais; o GLB é intercâmbio em pose neutra, regenerado por
`node scripts/export-chase-girl.js`. A animação não está embutida no GLB. O renderer
compartilha geometrias e controla descarte. A frente é -Z, pés na origem. Apoio dos
pés é resolvido por articulações; a inclinação responde à velocidade lateral e
retorna ao eixo ao parar o desvio. A passada mantém dois apoios por ciclo com os
intervalos dos passos gravados. Física, obstáculos e hitboxes mantêm seus contratos.

## Comparação visual para revisão

Com `npm run dev`, abra:

`http://localhost:3000/docs/diario-ia/qa/perseguicao-20261019/comparacao.html`

O painel mostra exploração/arena e modelo sob luz neutra e no quarto, em escala de
leitura de gameplay. Permite animar/congelar, selecionar repouso/corrida e vista
lateral, três quartos, frente e costas. “Detalhes (2,5×)” amplia fonte e modelo
juntos, mantendo a apresentação no quarto na escala de gameplay. A fonte de arena é lateral e não comprova
uma vista traseira original. O painel é QA local, não integra a publicação do jogo.

`npm run journal:qa -- test:bear-chase:comparison:browser` verifica paleta, apoio,
desvio, trem sem cartão, fada atrás, volume do urso e ausência de erros na página.
O teste não certifica identidade artística nem aparelhos físicos.


A revisão 3 encurta o braço acima do cotovelo (0,18 → 0,15 unidade), mantém o
antebraço em 0,17 e ajusta a mão e o porte da espada. Mangas claras bufantes têm
gomos e punho salmão; a saia tem franzido geométrico e sombras suaves perto da
cintura. O rabo único ganhou comprimento, projeção lateral, mechas e pontas
articuladas para permanecer legível na câmera traseira. Paleta regional preservada.
