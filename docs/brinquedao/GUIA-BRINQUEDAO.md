# Brinquedão

Depois do pesadelo, Nanda convida Yuna para correr pelas pontes e voar nos tobogãs. A abertura conserva sete momentos, atores separados, piquenique canônico e leitura compartilhada. A música enviada começa no convite e segue durante a fase; pausa, mestre e mudo continuam compartilhados com o jardim.

## Circuito externo

O circuito ensolarado tem35.600unidades. As três antigas piscinas jogáveis viraram pontes rápidas de madeira. Não há resistência de bolinhas: a menina conserva o embalo da descida. Os identificadores `bolinhas-sol`, `bolinhas-vento`, `bolinhas-grande` permanecem apenas para compatibilidade de saves; o tipo atual é `fish-bridge`, com superfície plana.

Dois peixes ocupam pontos fixos de cada ponte, mas só saltam quando Yuna se aproxima. O ataque dura0,64s, antecipa no máximo0,26s do movimento atual e fixa o alvo no lançamento: não persegue Yuna nem entra pelas laterais da tela. A pose usada para desenhar o peixe também governa o contato; só o corpo durante a janela ativa pode acertar. O contato arremessa a menina para trás com velocidade de650–1000 e impulso vertical660. A rotação é do corpo inteiro, sem separar cabeça/pescoço. Por0,4s a força direcional fica reduzida, e há1,6s entre danos para impedir múltiplos contatos no mesmo golpe. O golpe interrompe a corrida; não utiliza o antigo limite de dois corações das piscinas. Uma queda fora da estrutura ainda pode causar derrota.

A/D ou setas movem; Espaço salta. No celular, D-pad e PULAR amplos. Aceleração1350, corrida700, escorregadores até980, gravidade1500 e salto730. Desníveis em3700/7900/12300 continuam pedindo salto; os dois atalhos elevados continuam acessíveis.

Depois do escorregador gigante, seis camas elásticas levam a castelos com pontes frágeis. O painel da descida transfere embalo à rampa reversa, lançando para os castelos altos. Pontes cedem após0,28s/0,24s, com prazo1,6vez maior no EASY. Checkpoints só ativam sobre o terraço real. Retry externo rearma as pontes futuras.

Três plataformas inferiores e rampas ligam a recuperação à próxima lona/descida. Nas três calhas altas, as duas primeiras rebatidas conservam o descontrole; depois, o painel direito se inclina e lança até a própria lona de retorno. Segurar direita permite sair, sem frenagem precisa. O lançamento preserva impulso até a lona ou2,2s e permite frear para trás. Vãos fora das recuperações continuam fatais.

## Interior: quatro tobogãs em sequência

A torre no terraço final dá acesso à nova corrida interna. Não há piscinas ou peixes no interior. As bocas compartilham centro e piso com as pistas; previews mostram a sala real de origem/destino sem duplicar o eixo reto do portal sobre a curva do segundo tubo.

1. **Primeiro tobogã → pista lisa e triângulo.** A menina sai com embalo760; manter direita acelera até900. É preciso saltar o bloco triangular com advertência amarela/coral em1120 (170de largura/94de altura). A colisão causa dano/recuo, mostra a reação por0,8s e reinicia o primeiro tubo. Não é Game Over nem consome o antigo sistema de dois corações.
2. **Segundo tobogã → camas laterais automáticas.** Seis voos de0,65s ligam as lonas alternadas e o bocal do terceiro cano. Os controles não alteram a sequência e não há dano. Câmera/rotação acompanham a desorientação solicitada; pausa/save/restore conservam o ponto exato.
3. **Terceiro tobogã → ponte de blocos.** A ponte tem15blocos entre300 e2100. Ao entrar no trecho, uma onda de colapso avança: primeiro bloco após0,55s, seguintes a cada0,15s. EASY amplia o prazo em30%. Manter direita permite atravessar. Parar/frear pode fazer perder o apoio; a queda é mostrada antes do Game Over. Retry refaz o terceiro tubo, preservando o desafio sem repetir o circuito externo.
4. **Quarto tobogã → chegada.** Termina no portal CHEGADA e encerra o Brinquedão. A conclusão permanece nesse cenário; não retorna visualmente à antiga entrada externa. A narração final usa o padrão compartilhado.

As velocidades-base dos tubos são2300/2950/3150/3450, com variação suave de12%. Pista e blocos usam caminhada900, salto730 e gravidade1500. Sem direção, o embalo é perdido gradualmente; a corrida não é concluída automaticamente. A segunda ligação é a única sequência de movimento inteiramente automática.

## Estado e persistência

Domínio8/envelope1; interior versão3. Migra versões1–7 antes de validar. A migração v7→v8 inicializa o relógio de ataque dos peixes sem descartar os demais obstáculos salvos. O corpo apoiado numa piscina antiga passa ao piso plano da ponte correspondente. Interior antigo é encaminhado proporcionalmente para um dos quatro tubos; conclusões continuam concluídas. Derrota interna antiga migra para a retomada do terceiro tubo.

O interior guarda `leg`, modo, `u`, relógios, checkpoint, tropeços, índice da rebatida automática, início da onda de colapso e corpo. Não há atores/estados de perseguição ou corações internos. `obstacles.fishImpact` registra contagem e horário do golpe externo; `obstacles.fishAttack` persiste peixe, início, alvo fixo e próximo horário, preservando a investida após pause/save/restore. Outlets, contatos das pontes/lonas, música e demais checkpoints permanecem nos contratos anteriores. Recursos de imagem, listeners e nós de áudio ficam fora do snapshot.

| Módulo | Responsabilidade / contratos |
| --- | --- |
| `BrinquedaoLevel` | Circuito, pontes rápidas, alturas, desníveis, checkpoints, zonas de fundação e validação dos apoios de cada lado. |
| `BrinquedaoSimulation` | Corpo externo, ativação/contato dos peixes, migração v8 e delegação interna. |
| `BrinquedaoFish` | `BRINQUEDAO_FISH_ATTACK`, `brinquedaoFishSpecs`, `updateBrinquedaoFishAttack`, `brinquedaoFishPose`, `brinquedaoFishTouches`, `brinquedaoFishImpactAge`: investida curta disparada por proximidade e alvo travado. |
| `BrinquedaoGauntlet` | `BRINQUEDAO_GAUNTLET`, `BRINQUEDAO_REBOUNDS`, `brinquedaoBlockSolid`, `brinquedaoTriangleTouches`, `brinquedaoReboundPose`: objetos e desafios entre tubos. |
| `BrinquedaoTubes` | Quatro trajetos por comprimento e tangente. |
| `BrinquedaoInterior` | Criação, transições, restart do triângulo, rebatidas, colapso, retry e validação. |
| `BrinquedaoInteriorRenderer` | Materiais, pistas/obstáculos, lonas, queda dos blocos e chegada. |
| `BrinquedaoAttractions` | Torres/lonas e `drawBrinquedaoBridgeFish`, com salto visível sob as pontes. |
| `BrinquedaoRecovery` | Rotas inferiores e saídas das calhas. |
| `BrinquedaoLook` | Atmosfera, temas, materiais preventivos, vidro, perigo, chanfros e encaixes. |
| `BrinquedaoPhase` | Ciclo de carga, entrada, pausa, áudio e descarte. |

## Composição das superfícies

Calhas externas usam uma faixa contínua recortada em memória da ilustração original, sem seus postes. O material acompanha a posição do mundo e conserva a seção nas descidas, subidas, recuperações e calhas. As curvas de pontes e calhas usam seno ao quadrado: mantêm a altura máxima autorada, mas chegam às extremidades com tangente horizontal, sem quinas no contato com os trechos vizinhos. Atalhos elevados cobrem toda a extensão da ponte inferior. A espuma arredondada das pontas fica dentro dos limites físicos; nenhum acabamento visual avança sobre área sem apoio, e a colisão não muda. Faixas afins e amostragem interpolada removem os degraus de arredondamento. `drawBrinquedaoSurfaceStrip` também compõe as pistas internas. A ordem de pintura vai dos percursos inferiores aos superiores. Torres decorativas só aparecem quando um patamar real termina na mesma posição e altura da entrada; descidas após quedas e recuperações não recebem escadas suspensas. Os três degraus recebem espelho acolchoado e apoio contínuo: o salto e a altura física continuam os mesmos. Nenhuma régua é sobreposta à superfície.

## Legibilidade e acabamento P1–P3

`BrinquedaoLook` prepara atmosferas e materiais na carga. O fundo externo recebe contraste0,8/saturação0,68; fundos internos contraste0,82/saturação0,78 e véus suaves, preservando luz ensolarada. As redes dos acolchoados são dissolvidas acima do piso, por perfil de cada coluna; a região de apoio conserva alfa original. Pontes frágeis recebem desgaste, rachaduras e fibras soltas preventivas; estáveis e de peixes conservam amarras inteiras. `brinquedaoSupports` gera pilares conforme os lados configurados em cada estrutura e as zonas de fundação; pontes recebem somente apoios nas extremidades e nenhum percurso sobreposto pode introduzir um pilar no vão central. Em `cama-2`, o apoio esquerdo é dispensado porque a rampa inferior se conecta nesse lado e na mesma altura; o direito permanece diante do vão e do desnível de450 unidades. Lados sem apoio só são aceitos pela validação quando existe conexão contínua no mesmo nível. As zonas de fundação continuam sendo invariantes físicos; na renderização, os pilares avançam além do limite inferior visível para que seus pés nunca apareçam cortados no enquadramento. `validateBrinquedaoStructure` também exige que atalhos elevados acompanhem toda a extensão da ponte inferior, degraus correspondam às superfícies de contato e curvas cheguem às extremidades sem quinas, evitando recorrências e correções manuais por peça.

O triângulo conserva exatamente seu perfil e medidas, com face de advertência e exclamação. Blocos têm face opaca, cantos arredondados, chanfro e sombra de volume. Presilhas só aparecem em encontros de superfícies reais e a rampa reversa ganha bocal arredondado sem mudar posição/vetor do impulso.

As quatro passagens têm pinturas distintas: Oficina dos Blocos, Pista das Bolinhas, Salão Musical e Nuvens de Espuma. São ambientes de fundo: as mecânicas continuam triângulo, lonas automáticas, blocos colapsáveis e chegada. O vidro recebe miolo menos reflexivo e máscara interna suave atrás de Yuna; a frente tem opacidade0,035 e só é redesenhada perto dela. Nenhum novo coletável, piscina jogável ou obstáculo foi acrescentado.

Fundos são reduzidos em cache para960px de largura mantendo proporção. Imagens temáticas de alta resolução saem do mapa de imagens após preparo; os canvases são liberados no descarte. Saves usam domínio8/interior3; o v8 inclui o ataque de peixe já iniciado e migra o estado anterior sem alterar os demais obstáculos.

## Arte e manutenção

Os peixes reutilizam a prancha de brinquedos existente. Triângulo: topo de `toy-room/stage3/stacking-blocks-v1.png`; blocos: material pintado `toy-room/bear-chase/materials/blocks-atlas-v1.png`. As quatro pinturas internas v2 foram criadas com image_gen integrada/skill imagegen; PNGs de origem preservados, JPEGs86 usados em runtime. Prompts completos e hashes em `assets/art/brinquedao/prompts-interiores-v2.json`. Os antigos recursos de piscinas permanecem como fontes preservadas, sem piscinas jogáveis. `BrinquedaoPools` foi arquivado no diário antes da remoção do runtime. Após alterações visuais, reconstruir o mapa com `npm run docs:sprites`; não desenhar linhas auxiliares de hitbox sobre os objetos.

QA recuperável: `test:brinquedao:corrida`, `test:brinquedao:pontes`, `test:brinquedao:corrida:migracao`, `test:brinquedao:corrida:browser`, `test:brinquedao:corrida:toque:browser` e `review:brinquedao:corrida:browser`. Navegadores recebem largura, altura e diretório de evidência dentro do diário. Casos de sucesso e falha são registrados separadamente; emulação não equivale a aparelho físico.


Desempenho: `npm run journal:qa -- test:brinquedao:desempenho:browser LARGURA ALTURA DIRETORIO CPU` mede tempo de submissão Canvas, chamadas de desenho e intervalos RAF em cinco estados dirigidos (ponte, rampas, calha, tubo e blocos), comparando o commit de referência com a revisão. O fator de CPU é uma emulação do Chrome; não mede um aparelho físico nem substitui teste da GPU/dispositivo do usuário. A cadência de desenho deve ser analisada separadamente da velocidade do domínio. Resultados e amostras ficam exclusivamente no diário.
