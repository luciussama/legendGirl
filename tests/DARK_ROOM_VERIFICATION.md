# Verificação da fase dark-room

Executar `npm run verify:dark-room` após cada alteração de plataforma.

A referência em `fixtures/dark-room-physics.json` preserva geometria, áreas de
apoio, estado inicial da personagem e atributos dos 12 níveis de fuga. Não
atualizar essa referência automaticamente para fazer uma alteração visual passar.

O verificador executa trechos extraídos de `game.js`: `doJump`, integração de
movimento e seleção da plataforma de pouso. Usa a personagem real de 38 × 44 px.
Áudio, partículas e condições de interface são substituídos por controles de teste.
Não executa o loop completo, cenas, câmera ou navegador.

Cobertura:
- Limites esquerdo/direito, contato sem sobreposição e sobreposição mínima.
- Passagem ascendente e contato descendente.
- Queda no centro e nas duas extremidades de cada plataforma.
- Varredura de pontos de saída em passos de 1 px, com movimento a 60 Hz,
  exigindo aterrissagem na próxima plataforma, inclusive do chão para o urso.
- Renderizador real com dimensões dos PNGs, limites do atlas e ausência de
  alterações na geometria física durante o desenho.

## Resultado inicial (antes das correções)

528 verificações de hitbox/renderização passaram. Das 22 transições, 21
apresentaram pelo menos uma posição de saída que alcança o destino.

**Castelo → trem falha**, antes de qualquer alteração de arte ou física:
- Apoio do castelo: x=1636 até 1664, y=236.
- Apoio do trem: x=1860 até 1975, y=244.
- Nível 0 da fuga: velocidade horizontal 2,10 px/frame e impulso -7,20.
- Gravidade: 0,28 px/frame².
- `GameState.finishCutscene` libera o salto longo no nível 0, sem reposicionar
  a personagem. A simulação não cobre a execução completa dessa cena.

O teste inicialmente retornava erro nesta travessia. A correção funcional foi
aplicada separadamente das correções visuais, após autorização para corrigir os
problemas encontrados.

O teste antigo (`scripts/test-physics-scenarios.js`) passa 293 verificações,
mas usava largura de personagem de 28 px e calcula `reachedPlatform` sem exigir
que seja verdadeiro. Seu sucesso não comprova a travessia entre plataformas.

## Critério para mudanças visuais

Após cada plataforma: executar os dois verificadores; conferir no navegador o
salto de entrada e saída, pouso central e bordas, com `DEBUG_COLLISIONS`; comparar
a superfície desenhada com os pés da personagem e a linha de apoio. Os testes
automatizados não validam o contorno visível nem substituem essa inspeção.

## Correções e resultado final

- Impulso horizontal de 3,6 px/frame exclusivamente no salto do castelo no nível
  0 da fuga. Antes era 2,1 e não cobria o vão de 196 px. Arco vertical, posições,
  dimensões, regiões de apoio e atributos dos outros saltos foram preservados.
- Corrigidas cinco associações de sprites no manifesto e nos dois atlas:
  cômoda, caixa de música, castelo, pipa e livro. Os arquivos PNG existentes não
  foram editados; alguns nomes físicos antigos não correspondem ao conteúdo.
- Calibradas as superfícies visuais desses cinco objetos para as hitboxes
  existentes. A configuração de superfícies agora é compartilhada pelos testes
  e pelo renderizador, evitando cópias divergentes.
- Debug respeita `surfaceTopY`, assim como a colisão; sombra de suporte considera
  a posição real do sprite, inclusive seu deslocamento vertical.
- Teste antigo atualizado para a largura real de 38 px. A comprovação de
  travessias fica a cargo de `verify:dark-room`, não do teste antigo.

Resultado: **671 verificações** de hitbox, renderização, transição da cena e
bloqueios de salto passaram; **22 travessias × 3 valores de dt = 66** combinações
alcançáveis. Valores de dt: 0,5; 1; 1,2, cobrindo os extremos aceitos pelo loop.
A bateria anterior passou 293 verificações. Lint, sintaxe e 57 assets passaram.

Inspeção visual executada no Chrome headless pela página
`tests/dark-room-hitboxes.html`, com sprites reais, renderizador de produção,
linha de apoio e corpo de 38 × 44 px. Isso é uma inspeção estática no navegador;
os saltos foram verificados pela execução dos trechos de produção em Node,
não por uma partida completa automatizada com câmera, entrada e cenas.

A silhueta orgânica dos objetos não é uma hitbox por pixel. As áreas físicas
retangulares continuam sendo a referência: bandeiras, caudas, espelhos e
ornamentos são decoração. Halos claros e fragmentos presentes nos recortes
originais permanecem como trabalho de arte, sem ampliar o escopo desta correção.
Antes de regenerar os assets com scripts antigos, revisar suas associações:
esses scripts não foram executados nem modificados nesta correção.

## Revisão sequencial — 23/09/2026

Retomada após a almofada (índice 6). Revisadas nesta rodada: cômoda (7),
caixa de música (8), castelo (9) e trem (10). Cada alteração foi seguida pelos
verificadores de física e pelo teste no navegador antes de avançar.

- Cômoda: proporção preservada; contato dos sapatos corrigido no renderizador
  da personagem. O ponto mais baixo da sola acompanha a superfície durante
  toda a passada, incluindo rotação e contorno, nos dois sentidos.
- Caixa de música: acrescentado móvel de sustentação visual até o chão.
- Castelo: removida associação residual do atlas com a imagem de uma cômoda.
  Mantido desenho procedural; torre e brilho indicam os 28 px do apoio real.
- Trem: recorte de renderização exclui fragmentos da imagem vizinha, com suporte
  até o piso e travessa horizontal coincidente com o apoio. PNG original intacto.
- Corrigidas as associações invertidas entre pipa e livro no manifesto e atlas.

`npm run verify:dark-room` executa também `test-foot-contact.js`: 5.280 poses
checadas pelas elipses e transformações reais de Canvas. O teste principal
valida proporção dos sprites sem floorFit e dimensões dos arquivos de origem.
Resultado: 666 verificações de hitbox/render e 66 travessias; a bateria antiga
continua passando 293 verificações. A referência de física não foi alterada.

`npm run review:dark-room -- 10` verifica sequencialmente até o trem; substituir
10 por 21 executa a regressão nas 22 plataformas. Requer servidor em :3000 e
Chrome de teste com depuração em :9222. Além dos saltos, verifica queda no centro
e nas duas bordas, mantendo o apoio por oito atualizações em dt 0,5/1/1,2.
A regressão completa passou 66 saltos e 198 quedas. As cenas do castelo e portal
ficam desativadas nesta página para isolar o apoio; não equivale a uma partida
completa com entrada do usuário e diálogos. As capturas ficam em
`tmp/dark-room/review/NN-{scene,hitbox}.png`.

**Ponto de retomada daquela rodada: prateleira (11).** O sucesso da regressão
nas plataformas posteriores não constitui aprovação visual de seus contornos.


## Continuação sequencial — plataformas 11 a 14

Aprovadas na ordem, com inspeção de tamanho/proporção, pés no centro e nas
bordas, verificadores Node e saltos de entrada/saída no navegador após cada
alteração. A física e sua referência permanecem intactas.

| Índice | Objeto | Apoio | Ajuste visual |
| --- | --- | --- | --- |
| 11 | Prateleira | 110 px em y=236 | Borda horizontal e exclusão de fragmentos do recorte vizinho; enfeites preservados. |
| 12 | Abajur cogumelo | 65 px em y=224 | Coroa recortada na renderização com acabamento plano; móvel de sustentação até o piso. |
| 13 | Casa de bonecas | 100 px em y=210 | Escala uniforme pela cumeeira, em vez da largura dos beirais; fachada até o piso. |
| 14 | Globo | 95 px em y=218 | Esfera proporcional preservada; armação com travessa de latão para apoio e móvel até o piso. |

Os PNGs originais não foram alterados. As novas superfícies e partes da
fachada/armação são desenhadas pelo renderizador de produção.

O teste de navegador agora salva, por plataforma:
- `NN-scene.png` e `NN-hitbox.png`: objeto no cenário real.
- `NN-support.png`: pés à esquerda, centro e direita, sem iluminação escura
  nem linha de debug encobrindo o contato.
- `NN-results.json`: resultados acumulados e salto para a plataforma seguinte.

Além da física, `visibleSupport` renderiza em Canvas transparente e verifica
opacidade em toda a largura das superfícies com acabamento (`cap`). Nas quatro
plataformas desta rodada, são 370 pixels de apoio, sem lacunas. Verifica também
que os fragmentos excluídos da prateleira não continuam aparecendo. Plataformas
sem esse acabamento retornam `checked:false`; isso não é aprovação visual.

Resultados finais: 666 verificações de hitbox/render, 66 travessias simuladas,
5.280 contatos dos sapatos e 293 verificações da bateria anterior passaram.
No navegador: 66 saltos e 198 quedas passaram na regressão completa, com apoio
por oito atualizações após cada pouso. Saltos de saída de 11, 12, 13 e 14 também
passaram em dt 0,5, 1 e 1,2. Lint, sintaxe e 56 assets passaram.
As cenas continuam desativadas apenas no ambiente de teste.

**Ponto de retomada daquela rodada: pipa (15).** A revisão visual desta rodada
não aprova automaticamente os objetos posteriores, mesmo com a física passando.


## Revisão individual — pipa (15)

A avaliação inicial passou na física, mas reprovou no apoio visual: os pés
atravessavam a parte superior do tecido, sem uma superfície horizontal visível.

Correção: travessa de bambu com 90 px de largura em y=196, ligada à armação por
linhas de amarração. O sprite foi alinhado abaixo da travessa, com escala uniforme
90/155: 285 × 187 px incluindo a cauda. A proporção e o PNG foram preservados;
a cauda continua decorativa, sem ampliar a colisão. Nenhuma outra plataforma
foi editada nesta rodada.

Validação após a correção:
- Inspeção do objeto no cenário e dos sapatos à esquerda, centro e direita.
- Três saltos globo → pipa e três pipa → livro: dt 0,5; 1; 1,2.
- Nove quedas na pipa: três posições por dt, com oito atualizações de apoio estável.
- Canvas transparente: todos os 90 pixels da linha de apoio são opacos.
- Verificador geral: 666 checks de hitbox/render, 66 travessias e 5.280 contatos
  da animação dos sapatos; bateria anterior: 293 checks. Todos passaram.

Evidências: `tmp/dark-room/review/15-{scene,hitbox,support}.png` e
`tmp/dark-room/review/15-results.json`. As cenas ficam desativadas no teste de
apoio; não foi simulada uma partida completa com diálogos.

**Pipa aprovada nos critérios desta revisão. Próxima: livro flutuante (16).**


## Revisão individual — livro flutuante (16)

Preferência visual definida pelo usuário: a menina caminha SOBRE as páginas,
aceitando a sobreposição dos pés com a ilustração. Não adicionar travessa,
acabamento reto nem recortar as páginas para impor um topo plano.

O acabamento anterior foi removido e o sprite voltou a ser desenhado inteiro.
A referência visual de contato passou de y=45 para y=90 no PNG, colocando os
sapatos dentro da área ilustrada das páginas. A escala uniforme 85/240
(145 × 99 px), o PNG e a física permanecem intactos: apoio de 85 px em y=184.

A inspeção das capturas confirmou esse resultado à esquerda, no centro e à
direita. Passaram três saltos pipa → livro, três livro → lustre e nove quedas,
em dt 0,5/1/1,2, mantendo apoio por oito atualizações após cada pouso.
A bateria geral passou 666 verificações de hitbox/render, 66 travessias e
5.280 contatos dos sapatos; a bateria anterior passou 293 verificações.
O teste de borda opaca retorna `checked:false`, pois não existe mais acabamento
plano: a coerência visual deste livro segue a preferência acima.

Evidências atualizadas: `tmp/dark-room/review/16-{scene,hitbox,support}.png` e
`tmp/dark-room/review/16-results.json`. As cenas ficam isoladas nos testes.

**Próxima plataforma a revisar: lustre (17).**


## Correção solicitada — mesa à frente do abajur (12)

Substitui a solução anterior de cortar a coroa do cogumelo. O abajur é desenhado
inteiro, em escala uniforme (66 × 78 px), com a base alinhada ao tampo, atrás da
mesa e da personagem. A mesa alta tem tampo de 105 px, saia frontal, gaveta,
pernas e travessa até o piso. O caminho é sobre a mesa, não sobre o cogumelo.

A área física foi ampliada de x=2277/w=65 para x=2257/w=105, mantendo y=224.
A referência de física foi atualizada deliberadamente apenas nesses dois
campos da plataforma 12, pois o tampo maior solicitado precisa ser utilizável
por inteiro. O chapéu e a haste são cenário, sem colisão adicional. As demais
plataformas e os atributos dos saltos não foram alterados.

Passaram seis saltos de entrada/saída e nove quedas na mesa, em dt 0,5/1/1,2,
com oito atualizações de apoio estável após cada pouso. A checagem de Canvas
confirmou 105 pixels opacos no tampo. Foram inspecionadas as capturas atualizadas
`12-scene.png` e `12-support.png`, com a menina nas duas bordas e no centro.
Os verificadores gerais passaram: 666 checks de hitbox/render, 66 travessias,
5.280 contatos dos sapatos e 293 checks da bateria anterior.


## Refinamento solicitado — Caixa de Música da Bailarina (8)

Eliminação do contorno branco anômalo na figura da bailarina e refinamento visual
completo da mesa de apoio, preservando rigorosamente a hitbox física (x=1485,
y=267, w=90, h=205) e as proporções do móvel sem estilização nova:

1. **Contorno branco da bailarina eliminado**:
   - Remoção de 14.655 pixels de papel sólido retidos dentro da redoma e de
     halos perimetrais causados por anti-aliasing contra fundo claro.
   - A redoma de vidro agora apresenta acabamento translúcido cristalino com
     arcos de reflexo especular suaves, revelando a bailarina de porcelana,
     seu tutu rosa e seu pedestal com nitidez sobre o fundo escuro do quarto.
2. **Desenho da mesa refinado e integrado**:
   - Remoção de artefato espúrio do lado direito da folha original (x >= 196),
     restaurando a simetria perfeita da caixa de música e do móvel.
   - Mesa de cabeceira em mogno clássico com tampo chanfrado polido, gaveta
     entalhada com puxador em latão antigo e duas pernas torneadas clássicas
     alinhadas à geometria do móvel, com anéis ornamentais, travessa inferior
     e sapatas firmemente assentadas no chão (floorY = 470).
   - Vão livre de 62 px preservado até a plataforma adjacente do castelo de blocos.
3. **Física e hitbox**:
   - Hitbox física (standRegion: 1485x267, w=90, h=205) inalterada.
   - 100% de aprovação nos testes automatizados: 666 checks de hitbox/render,
     66 travessias físicas de saltos e 5.280 contatos dos sapatos.
   - Evidências salvas em `tmp/dark-room/reviewed/08-*`: painel consolidado 2x2,
     cenário geral, início/meio/fim, close-up de apoio e visualização de hitbox.

