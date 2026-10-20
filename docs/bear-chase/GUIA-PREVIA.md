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
| `ChaseToyModels` | Adaptador de compatibilidade para o trem do catálogo |
| `props/ChasePropCatalog` | Instâncias, referências, limites visuais e liberação local |
| `props/ChasePropResources` | Propriedade e compartilhamento de materiais, texturas e malhas |
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

## Catálogo e primeiro lote integrado — 20/10/2026

Abra `http://127.0.0.1:3000/docs/diario-ia/qa/perseguicao-20261020/props.html`.
O painel compara trem, armário baixo, blocos e coelho com as fontes atuais, sob
luz branca e no quarto. Trem e armário receberam aprovação parcial do usuário;
o acabamento de iluminação será melhorado depois. Selecione quatro vistas, giro, escala de gameplay ou detalhes e
lançamento do trem. O armário é decorativo, junto à parede direita e com portas
voltadas para a sala. A imagem original não fornece todas as faces: costas e
partes ocultas dos pilotos são interpretações sujeitas à revisão.

Para servir exclusivamente no computador local, em vez de expor o painel à rede:

```sh
node --input-type=module -e 'import express from "express"; const app=express(); app.use(express.static(process.cwd())); app.listen(3000,"127.0.0.1");'
```

`props/ChasePropCatalog` reúne trem, blocos, coelho e armário (`wardrobe`). As
fábricas produzem instâncias com apoio inferior; `props/ChasePropResources`
controla materiais, texturas derivadas em memória e malhas mescladas por material.
`PilotPropResources` é apenas compatibilidade com os primeiros estudos. Na prévia
jogável, os três arremessáveis agora usam malhas; seis armários ocupam posições
laterais, com portas voltadas para a sala. Todos os móveis ficam junto às paredes.
Estante e castelo agora são volumétricos: livros/capas/lombadas têm espessura e
os portais do castelo são vazados. O baú também tem volume, tampa curva articulada,
painel amarelo, medalhão azul e inscrição sobre superfície curva. O catálogo soma
sete modelos; brinquedos decorativos restantes, poltrona, cavalinho e mesa ainda
aguardam os próximos lotes de E5.

A trajetória de 0,65 s mantém seus pontos horizontais e longitudinais; a posição
vertical agora representa o apoio do objeto, sem a antiga meia-altura dos planos.
Colisão, tipos, largura lógica, RNG, save e movimento da menina não mudaram.
As superfícies repetidas do quarto compartilham geometria/material. Os recursos
comuns só são descartados ao encerrar o catálogo, nunca ao retirar um brinquedo.

Após criticar a simplificação, o usuário aprovou a direção pictórica da amostra
do armário e autorizou sua propagação. Os quatro modelos 3D atuais agora usam
atlas próprios: veios/desgaste em armário, trem e blocos, fibras em coelho. Os mapas
estão em `assets/art/toy-room/bear-chase/materials/`, com referências e prompts
integrais. O mapa é compartilhado por objeto e os quadrantes são selecionados por
UVs; não se cola uma imagem frontal sobre o volume. O painel usa os mesmos mapas
da fase. A direção aprovada vale para os próximos props; a execução de cada novo
modelo ainda pode precisar de refinamentos. Iluminação da cena permanece adiada.
Os demais modelos do roteiro, ainda não convertidos, entram nesse padrão quando
forem construídos; não houve substituição global das artes 2D ou personagens.

`npm run journal:qa -- test:bear-chase:catalog` verifica a integração no jogo;
`npm run journal:qa -- test:bear-chase:catalog:models` verifica a comparação.
Ambos executam o QA arquivado em workspace
temporário com servidor restrito a loopback e Chrome de QA na porta CDP 9222.
Resultados e limitações estão no diário, separados do aceite artístico.


`npm run journal:qa -- test:bear-chase:pictorial` verifica quatro atlas reais,
compartilhamento por objeto, UVs contidas nos quadrantes, orçamento estimado RGBA8
com mipmaps e a regressão da perseguição. Os PNGs são artes de produção e devem
ser preservados; somente capturas de QA regeneráveis são descartadas.


## Estante, castelo e baú — primeiro lote de E5

No painel, selecione os três novos objetos para comparar quatro vistas e use
“Abrir tampa do baú”. Os originais ilustrados estão à esquerda; as partes ocultas
dos modelos são interpretações novas. `BookshelfProp`, `BlockCastleProp` e
`ToyChestProp` usam os materiais pictóricos já aprovados como direção. Não há
uma nova prancha frontal aplicada a um suporte genérico.

As peças estáticas dos móveis são agrupadas por atlas, com tintas locais por
vértice. Isso mantém a estante em três chamadas e o castelo em uma. As instâncias
compartilham recursos; só o pivô da tampa é local. O baú aparece após o alcance,
abre em CAUGHT e fecha ao final de CHEST_RETURN. O evento de retorno e o save
continuam na simulação existente, sem nova decisão dentro dos modelos.

O baú fica à direita, X=4,74, com folga de abertura. Um trecho dessa parede é
reservado desde a aproximação final para que a decoração não o oculte. A câmera
apresentada enquadra menina/urso/baú em retrato e paisagem durante o encerramento;
a câmera da corrida e as câmeras das fases 2D mantêm seu comportamento.

`npm run journal:qa -- test:bear-chase:furniture` verifica os sete modelos, os
materiais compartilhados, a rota livre e 36 cenários da apresentação final.
`npm run journal:qa -- test:bear-chase:furniture:models` verifica a comparação
visual e o pivô da tampa. Fontes, resultados e limites ficam no diário de IA.
