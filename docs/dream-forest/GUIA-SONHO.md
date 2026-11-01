# Jardim dos sonhos — floresta aérea 2D

Direção de 30/10/2026: o usuário substituiu o jardim 3D por uma floresta lateral 2D para limitar custo de GPU e escolheu duração aproximada de cinco minutos. A nova mecânica é agarrar/escalar e saltar entre gramas ao vento e insetos gigantes móveis. O foco anterior em furtividade foi substituído; não há combate, espada ou pisão ofensivo.

## Percurso e controles

A parte aérea tem seis ambientes: gramas iniciais, vento mais forte, lombos de besouros, abelhas elevatórias, teias com aranhas e o planador entre galhos e espinhos. Depois, começa a floresta escura de furtividade descrita ao final deste guia. O percurso aéreo mede40.148 unidades; o trecho furtivo usa coordenadas próprias de9.300 unidades; a duração depende da leitura do vento e das tentativas. Folhas estáveis são pontos de descanso. O corredor de voo termina em uma queda para o trecho furtivo; a captura final desperta Yuna no piquenique. O mapa tem 88 apoios/objetos da travessia e 42 galhos espinhosos do voo e apenas quatro besouros (antes eram 27). Cada besouro espera Yuna apoiar os pés no lombo, prepara a decolagem por 0,65 s e faz uma viagem de 12–14 s até perto do próximo apoio. As rotas alternam curvas de subida e descida, com aceleração e desaceleração suaves. Ele permanece no destino para permitir o salto; agarrar sua lateral ainda não inicia a viagem. O percurso anterior até a folha após as abelhas foi aprovado e conserva seus 80 objetos; o trecho seguinte foi substituído. Insetos transportam a menina e suas laterais podem ser escaladas.

| Dispositivo | Andar / orientar salto | Subir / descer | Saltar |
| --- | --- | --- | --- |
| Teclado | A/D ou esquerda/direita | W/S ou cima/baixo | Espaço |
| Touch | ◀ / ▶ | ▲ / ▼ | PULAR, simultâneo com a direção |
| Gamepad | Eixo horizontal / D-pad | Eixo vertical / D-pad | A/X |

As gramas se prolongam em caules gigantes, cuja base fica abaixo da borda inferior em qualquer viewport. A lâmina continua flexionando ao vento e o trecho inferior mantém sua ligação com o chão fora do enquadramento.

A aderência ocorre automaticamente quando o corpo/mãos alcançam qualquer haste próxima ou a lateral do inseto, pelos dois lados. Ela inclui o caule abaixo da lâmina: perder a primeira grama não bloqueia agarrar e escalar a seguinte. Na grama, soltar o direcional conserva a pegada; o vento continua carregando a personagem. Perto da ponta, aguarde a aproximação do próximo apoio e escolha a direção do salto. Uma janela breve impede agarrar de novo somente o mesmo objeto imediatamente após saltar; as outras gramas continuam elegíveis. A pegada conserva o lado de contato até o salto, sem atravessar o caule ao mudar o direcional. Ao chegar ao alto do inseto, a escalada se transforma em apoio sobre o contorno da pintura.

O NORMAL tem queda animada e “Tentar novamente” no último descanso, com a oferta EASY da campanha. O EASY recupera Yuna sem morte. Ao retomar um checkpoint, os transportes daquele trecho em diante voltam aos pontos iniciais; uma queda não deixa o besouro necessário fora de alcance. Pausa/perda de foco libera entradas e congela o vento junto da simulação. Não há perda de energia por esperar agarrada.

## Apresentação e custo

No formato móvel em retrato, as narrações de entrada e chegada ficam abaixo da barra global de bandeira, pausa e áudio. O recuo usa a posição real dessa barra em coordenadas do canvas e a opção `topInset` de `renderPoeticNarration`; não move o cenário nem altera os tempos de leitura.

Fundo pintado azul/índigo com névoa, gramas em Canvas, folhas ilustradas e insetos ilustrados e poses próprias de escalada. O besouro usa a pintura original em camadas: asas membranosas batem, três patas articulam alternadamente e cabeça/antenas oscilam. As partes são preparadas em cache uma vez e liberadas ao sair; o casco de apoio conserva a geometria física. Yuna espera em pé durante o transporte. Yuna continua com sua identidade e roupa do jardim. Até o galho de lançamento, a câmera mantém enquadramento vertical fixo por viewport e só rola lateralmente. Somente o planador acompanha a altitude, com suavização; a câmera do quarto escuro não é alterada. O nome do trecho fica abaixo dos controles superiores; os comandos touch têm alvos separados.

A floresta não cria renderer WebGL, modelos 3D, sombras dinâmicas, filtros de tela inteira ou buffers por quadro. Consultas espaciais limitam física e desenho à vizinhança; partículas são catorze pequenos pontos. Recursos são carregados ao entrar e liberados na saída. Isso reduz a carga arquitetural; avaliação de GPU em aparelhos reais ainda depende de homologação no hardware.

O arquivo original **Misty Blues.mp3** enviado pelo usuário foi copiado sem alteração para `assets/audio/`; cerca de 200,04 segundos, em loop, com volume/mudo/pausa do host. `GardenAudio` aceita trilha configurável; o jardim anterior conserva sua música padrão.

## Módulos e persistência

| Módulo | Contrato |
| --- | --- |
| `DreamLevel` | Mapa, setores, consultas espaciais e poses móveis determinísticas pelo tempo. |
| `DreamClimb` | Ciclo visual por distância, mãos na pintura e transição para o topo. |
| `DreamWeb` | Contato corporal com aranhas e disponibilidade real do fio para agarrar. |
| `DreamOpening` | Sete momentos autorados, leitura e mínimos de atuação. |
| `DreamOpeningRenderer` | Cena própria de Yuna e Nanda, contato das mãos e moldura. |
| `DreamSilence` | Zunido discreto e descarte dos nós de áudio. |
| `DreamSimulation` | Domínio em segundos/subpassos de até 1/120 s, leitura, aderência, escalada, saltos, contorno, queda, checkpoints e conclusão. |
| `DreamGlider` | Caminhada automática, rajada, voo com inércia, percurso vertical, colisão e reinício. |
| `DreamGliderArt` | Máscaras de alfa opaco geradas das duas pinturas. |
| `DreamGliderRenderer` | Folha presa ao galho, Yuna segurando a haste e obstáculos pintados. |
| `DreamArt` | Recortes e perfis superiores medidos por alfa, gerados de fontes preservadas. |
| `DreamIllustratedSprites` | Folhas e caules pintados, registro em cache e batimento das asas da abelhinha do bem. |
| `DreamBeetle` | Cache de partes da pintura original, poses de asas/patas/cabeça e desenho articulado. |
| `DreamRenderer` | Pintura e interface; usa a mesma geometria das hastes e contornos dos apoios. |
| `DreamInput` | Complementa GardenInput com eixo vertical, teclado, gamepad e toque simultâneo. |
| `DreamStealthLevel` | Solo contínuo, relevos, abrigos, lama, poses e checkpoints. |
| `DreamNightmare` | Patrulha, raios/sombras, furtividade, golpe, captura e despertar. |
| `DreamNightmareArt` | Silhuetas, olhos e amostras opacas das poses, gerados das fontes. |
| `DreamNightmareRenderer` | Carga tardia, apresentação próxima e composição do piquenique. |
| `DreamAudio` | Misty Blues no voo, Bug attack desde a cinemática de chegada e trilha do despertar. |
| `DreamPhase` | Carga, pausa, áudio, save/restore e descarte; recebe apenas host, canvas, dificuldade e origem. |

`toyRoomDream` guarda envelope versão 1, estado versão 6 e posição musical. Estado contém relógio, leitura, checkpoint, progresso, quedas, contatos com aranhas (`hits`), causa da queda (`fallCause`) e jogador (posição, velocidades, apoio, aderência e bloqueio de reagarre). O campo `rides` guarda, para os quatro transportes, `null` antes do embarque ou o instante numérico de partida; posição e fase do voo derivam desse instante e do relógio salvo. Pausa e retomada conservam a viagem. Saves do domínio 1 conservam a migração dos besouros: posições afetadas pela nova seção de besouros retornam à folha `rest-2`, e apoios removidos do trecho misto à `rest-5`; os demais apoios válidos são conservados. Na revisão 3, saves dos domínios 1/2 no trecho substituído retomam na folha `rest-4`; posições anteriores aprovadas continuam válidas. Não serializa imagens, Canvas, áudio, listeners ou ponteiros. No caule inferior, a coordenada de aderência `u` pode ser maior que 1; a altura continua relativa ao comprimento original da lâmina, preservando saves anteriores. `restoreDreamState` valida versões, limites e IDs; a física conserva o relógio das plataformas e o bloqueio de reagarre.

Quatro segundos após o sono concluído no jardim, `ToyRoomPhase.updateActiveMode` inicia `DreamPhase`. Saves antigos do piquenique alcançam essa mesma passagem. Restore prioriza sonho, jardim, epílogo e perseguição. A origem campanha/prévia acompanha a transição; a bandeira “Jardim dos sonhos” fica fora do save da campanha.

## Manutenção

As artes e prompts estão em [README de produção](../../assets/art/dream-forest/README.md). Execute `node scripts/prepare-dream-art.js` após trocar fontes; verifique apoio, identidade e margens de cada pose. Não desenhe linhas auxiliares sobre as superfícies. Atualize referência, arquitetura e mapa de sprites conforme a regra obrigatória do diário.

Fontes e resultados de QA pertencem ao acervo. Aliases: `npm run journal:qa -- test:sonho:dominio`, `test:sonho:contratos`, `test:sonho:browser 1200 720 NORMAL` e `test:sonho:integracao:browser 390 844 EASY`. `test:sonho:caules` e `test:sonho:caules:browser 390 844 EASY` cobrem a continuação inferior, captura da grama seguinte e revisão de tela. `test:sonho:besouros` cobre partida, curvas, transporte, migração e retomada; `test:sonho:besouros:browser 1200 720 NORMAL` valida uma cena dirigida de embarque e troca por teclado, partindo de save preparado. Os testes de navegador usam Chrome isolado; não substituem homologação física/Safari nem aprovação artística humana.

## Folhas pintadas e abelhinhas do bem

As plataformas estáveis usam um sprite com nervuras ramificadas, textura e bordas naturais. A folha é registrada uma vez em cache nas larguras de 360 e 500 unidades para conservar a superfície anterior; seu caule pintado continua abaixo da tela. As gramas escaláveis continuam com a curva Canvas compartilhada com a aderência. Não recalcular a física a partir desta revisão visual.

As abelhas do sonho têm um cotonete branco com haste azul no lugar do ferrão, conforme a brincadeira da Yuna. O corpo é uma pintura íntegra; as asas membranosas formam uma camada separada e batem a partir do relógio da fase, congelando na pausa. Os recursos originais do jardim não são sobrescritos. Fontes e prompts da revisão ficam em `assets/art/dream-forest/prompts-folhas-abelhinha-v1.json`. Para verificar a cena, use `npm run journal:qa -- test:sonho:sprites:browser 1200 720 NORMAL`, também com formatos de celular.

## Teias e aranhas — revisão de 30/10

A folha de descanso `rest-4`, em x=25.448, é o limite aprovado pelo usuário na imagem. Seus objetos anteriores, movimentos e física foram conservados. Depois dela há seis aranhinhas suspensas, com 310 unidades entre fios. Cada ciclo de nove segundos contém descida suave de1,8s, permanência baixa de3,4s, subida de1,8s e espera alta de2s; vizinhas estão defasadas em1,8s. A aranha chega à parte alta da área de jogo (-180) e desce até700; seu fio de seda acompanha essa altura.

A menina escala o fio com os mesmos controles e salta automaticamente para agarrar outro fio alcançado. A pegada tem espaço para os pés acima da aranha; a escalada para no alto visível do trecho, em100 unidades. Subir no corpo da aranha não é possível. Encostar nela solta apoio/pegada, emite dano uma vez, afasta Yuna e inicia a queda. NORMAL termina na derrota/retry; EASY também mostra a queda e depois recupera na folha. Esperar indefinidamente em uma teia permite que a aranha alcance Yuna na subida. Ler o ciclo e escolher a altura do salto permite atravessar; os insetos anteriores continuam seguros como antes.

`climb.u` na teia usa referência fixa de1500 unidades a partir de y=-500, sem puxar a menina quando a aranha muda o comprimento do fio. Pausa congela aranha e seda. Saves retomam a fase do ciclo pelo relógio; `hits`/`fallCause` conservam dano/queda sem repetir o impacto. `DreamWeb` e o renderer usam a mesma posição da aranha.

O outro lado é o grande galho/checkpoint `rest-5`, preservado com sua pintura, vento e superfície. Ao pousar nele, começa a caminhada automática até a folha e a decolagem descritas abaixo. Os antigos galhos provisórios foram substituídos pelo voo.

`test:sonho:teias` verifica o limite aprovado, travessia, intervalos abertos/fechados, espera perigosa, dano, queda e migração. `test:sonho:teias:browser 1200 720 NORMAL` percorre o novo trecho por teclado após save preparado na folha; aceita os formatos de celular.

A meta continua perto de cinco minutos; leitura dos obstáculos e tentativas mudam a duração humana. Pilotos automatizados não garantem esse tempo.

## Animação de escalada

`yuna-escalada-v2.png` fornece seis poses completas: quatro para subir com braços e pernas flexionando/estendendo e duas para puxar o corpo até o lombo. A escala comum conserva a proporção do corpo. `DreamClimb` usa a mão como âncora; nas hastes e teias, segue a curva de contato, e nos insetos encontra pixels do corpo pintado, sem usar as asas membranosas móveis. Perto da borda, muda para as poses de chegada ao topo. A pose em pé continua a anterior.

O ciclo visual percorre quatro poses a cada72 unidades escaladas, calculadas por climb.u. Descer inverte o ciclo; esperar conserva a pose mesmo com vento ou voo do inseto. Uma inclinação contínua acompanha o empurrão dos pés. Os contornos e âncoras são somente apresentação: física, colisões, distâncias, domínio3/envelope1 e animação sobre o lombo foram preservados. As quatro poses antigas ficam como referência, sem voltar ao runtime.

`test:sonho:escalada` verifica âncoras/contatos em pixels reais e fase por distância; `test:sonho:escalada:browser 1200 720 NORMAL` sobe nos dois lados de abelhas/besouros e na haste, com pausa e save. Também aceita os formatos de celular.

## Ajuda exclusiva para celular nas teias

Em dispositivo móvel identificado por `isMobileDevice`, ao agarrar uma teia de aranha Yuna sobe automaticamente até uma altura de preparo para o salto (pegada em y250, pés em314). A subida usa a velocidade normal e para nessa altura; se ela já estiver acima, a ajuda não a reposiciona. O jogador continua escolhendo direção, momento e comando do salto. Subir/descer manualmente tem prioridade; pular não recebe ajuste automático.

A regra vale somente para `kind:web`, em RUNNING. Desktop, mesmo em janela estreita ou com tela de toque, conserva o comportamento anterior; estreitar o viewport ou exibir botões touch não identifica um celular. Gramas, corpos dos insetos, folhas, galhos e outras fases permanecem manuais. Pausa, leitura, queda e conclusão não ativam a ajuda.

`dreamMobileWebInput` adapta apenas a entrada vertical em DreamPhase. Não muda DreamSimulation, mapa, vento, aranhas, alcance do salto ou dificuldade. A identificação do aparelho não é gravada no save: ao restaurar, aplica-se a regra do dispositivo atual. Comando de teste: `test:sonho:teias:mobile` e `test:sonho:teias:mobile:browser 390 844 NORMAL mobile`; o último argumento `desktop` confere isolamento inclusive em janela estreita.


## Planador de folha e mudanças de altitude

Ao pousar no galho após as aranhas, Yuna caminha automaticamente a115 unidades/s até a ponta. Há uma única folha presa ali; uma rajada de1,1s a solta e inicia o voo. Mãos, haste e menina pertencem à mesma pintura. O avanço é automático a220 unidades/s; ▲/▼, W/S ou eixo vertical do gamepad manobram. No celular ficam visíveis somente os dois comandos verticais durante o voo. Cada seta tem uma área de toque de até128×88pixels CSS, com folga superior/inferior/lateral,16pixels entre os alvos e16pixels até a borda inferior segura. A seta é menor que a área sensível. Somente subir/descer recebem toque em GLIDING: comandos escondidos de esquerda/direita/pulo não capturam o dedo. Arrastar entre as duas áreas muda a direção; soltar, cancelar ou pausar libera o comando. Desktop e outros trechos mantêm os alvos anteriores.

A resposta é pesada: aceleração vertical limitada a400 unidades/s², velocidade alvo até400 e aproximação gradual. Soltar o comando não freia instantaneamente; há deriva suave de descida. O traçado tem11.200 unidades, cerca de51s de voo sem contar chegada/pouso. Começa com curvas baixas e, da metade ao fim, alterna altitudes de aproximadamente−700 a790, entre subidas altas e mergulhos. O centro do percurso constrói os obstáculos; **não pilota Yuna**. É preciso antecipar as manobras.

São21 pares de galhos espinhosos, com vãos maiores nas mudanças fortes de altitude para permitir a resposta do planador. A colisão compara amostras de alfa opaco das pinturas de Yuna/folha e galhos; névoa e transparência são ignoradas. Inclinação e escala são compartilhadas entre contato e desenho. Não há linhas auxiliares sobre a arte. Tocar um espinho provoca dano e queda; em ambas as dificuldades, a jornada reinicia automaticamente no galho de lançamento. O trecho das aranhas não precisa ser repetido. Depois dos espinhos, Yuna pousa em um planalto de terra:2,4s de trajetória e1,2s em chão firme, soltando a folha antes do corte para a cinemática.

Domínio5/envelope1: `glider` conserva a altura suavizada da câmera e, durante o pouso, sua origem. Os estágios são GLIDE_APPROACH, GLIDE_GUST, GLIDING, GLIDE_FALLING e GLIDE_LANDING. Saves da versão3 na antiga base de galhos retomam no lançamento; posições anteriores permanecem válidas. Pausa congela todo o voo. A ajuda móvel das teias continua exclusiva daquele trecho.

Artes e prompts em `assets/art/dream-forest/prompts-planador-v1.json`. Execute `node scripts/prepare-dream-glider.js` ao trocar as pinturas para reconstruir as máscaras. QA: `npm run journal:qa -- test:sonho:planador` e `test:sonho:planador:browser 1200 720 NORMAL desktop`; formatos390×844 EASY e844×390 NORMAL usam `mobile` no último argumento. O teste parte de save preparado no galho e usa controles nativos; aprovação artística e aparelho físico continuam separados do QA técnico.


## Último trecho — perseguição furtiva

Ao pousar na floresta, Misty Blues para. Yuna anda lentamente e olha para os lados. Duas falas avançam automaticamente ou por um gesto, com relógios próprios:

- Yuna (6s): “Será que os bichos foram embora?”
- Narrador (14s): “Um cheiro repugnante aparece no ar. Cheiro de comida que ninguém quer, cheiro de luz apagada, cheiro de vontade de ir pra casa, cheiro de tristeza.”

A barata aparece e se aproxima durante8s; a partir da aparição começa `assets/audio/Bug attack.mp3`, enviada pelo usuário. Ela é a trilha da fase até a captura, em loop se necessário. Sua duração não define nenhum relógio da cena ou da jogabilidade. Ao despertar, a trilha volta a Blues Shuffle Loop. Mudo, volume, pausa e musicTime continuam pertencendo ao host/envelope.

O percurso tem coordenadas próprias de9.300 unidades, limite legado de movimento em8.750, com cena final disparada na margem direita do quarto lago e velocidade125unidades/s. A duração pretendida é aproximadamente um minuto entre pedras, troncos cortados e relevos, seguido de aproximadamente um minuto de lama; varia com leitura dos feixes e tentativas. Seis pedras e seis cepos/troncos protegem Yuna no começo. Há três elevações de terra com chão contínuo por baixo, que exigem saltar para alcançar os abrigos elevados; não há fendas nem ilhas suspensas. A face de terra expõe a diferença de altura: a borda pintada coincide com o início e a crista físicos do barranco, e o pé do morro se integra ao piso. O pigmento recebe a mesma luz ambiente do chão, sem faixa retangular que mude a cor do cenário. Os pés acompanham o contorno pintado do topo. As laterais são sólidas: andar não transporta a menina para cima do relevo.

Use ◀/▶ ou A/D para andar abaixada e na ponta dos pés; Espaço ou o botão PULAR salta. Na sombra, Yuna se agacha junto à superfície, com as mãos cobrindo os ouvidos. A base do abrigo fica apenas25unidades atrás dos pés. A barata permanece no fundo e Yuna é desenhada depois das pedras e das sombras, visível ao jogador. O enquadramento mantém altura e escala fixas, inclusive durante saltos; só há rolagem lateral.

Na parte final há quatro lagos de lama, com contornos e tamanhos diferentes. Ao alcançar a borda, Yuna prepara um salto e entra na lama pelos pés, com arco de voo, queda e respingos no impacto. A entrada dura1,1s: impulso, voo até0,68s e imersão até1,1s. A imagem respingo-lama-v1 é animada sobre a superfície no impacto. ◀/▶ ou A/D faz Yuna nadar; parar permite afundar, e ↓/S mantém o mergulho enquanto ela se desloca. O nado tem quatro braçadas por distância percorrida. Na margem, mantenha a direção para fora ou use ↑/Espaço/SUBIR: a menina emerge gradualmente por0,35s e usa seis poses próprias de saída da lama: alcançar a borda, apoiar as palmas, ceder numa tentativa, puxar o joelho, arrastar a perna e se agachar, numa saída de1,9s. As palmas acompanham a terra e o peso termina na sola do pé; a animação deriva do relógio salvo e não usa o ciclo de hastes/insetos. Há troncos de abrigo entre os lagos. A mesma superfície curva da pintura encobre o corpo e bloqueia sua iluminação. O renderer recorta os pixels submersos antes de desenhar a menina, incluindo a emergência e as laterais das margens; transparências da ilustração não podem revelar pés ou corpo abaixo do lago. Não há limite de fôlego.

Feixes partem dos olhos articulados. `DreamNightmareLighting` combina volume em camadas, emissão extensa e desfoque para suavizar laterais e penumbras. A luz termina nos contornos opacos dos abrigos, no chão ou na superfície curva da lama; pedras e troncos recebem uma camada de iluminação que conserva a pintura. A lama recebe um reflexo quente, achatado e fragmentado por ondulações do relógio salvo, sem cone atravessando o líquido. O mapa de luz é temporário, em meia resolução do viewport, reutilizado e liberado no descarte. A detecção verifica pixels da pose atual, inclusive no ar, e respeita a oclusão da borda sem a antiga tolerância de meia unidade. Só iluminação contínua gera captura:0,12s no normal e0,24s no fácil. O corpo recebe reflexo quente enquanto iluminado. Pular não causa derrota por si só e também não concede imunidade à luz. EASY usa feixes mais estreitos. Derrota retoma o setor alcançado (pedras, troncos ou um dos dois setores de lama), sem repetir o prólogo e sem reiniciar a trilha.

Ao terminar a escalada da margem direita do quarto lago, começa imediatamente uma cena que ocupa o canvas inteiro, sem game over. A apresentação corta para uma cinemática própria, na altura dos olhos e com cenário/atuação em camadas: caminhada solitária de0–2,2s, reação até3,1s, close da barata até4,1s e avanço/captura até6s. Os atores e a câmera usam coordenadas narrativas, sem o mapa nem os controles dos lagos. O contato corta diretamente para o piquenique, sem escurecer antes da captura. Yuna acorda gritando na toalha; Nanda acorda0,55s depois. O susto inicial tem1,5s obrigatório; três falas seguintes duram5/5/7s e aceitam avanço individual. O grito sintetizado é único e não repete em save/load. As duas permanecem acordadas no piquenique ao concluir.

O domínio aéreo continua5 e o envelope1; `state.player` anterior permanece separado. O domínio local usa `nightmare.version=7`, com entrada, nado, escalada de margem, lago ativo, profundidade inicial, pés, velocidade vertical, apoio, borda de salto, submersão, exposição à luz, checkpoint de setor e relógios de atuação/leitura. `migrateNightmare` leva os antigos trechos curtos ao primeiro abrigo, conserva desfechos e migra os saves intermediários de versão3 para o solo contínuo. `validateNightmare` rejeita valores incoerentes antes de ajustar a posição de apoio na migração.

`DreamStealthLevel` mantém solo, relevos e abrigos; `DreamMud` mantém os quatro lagos, a superfície curva, o afundamento, o nado, a emergência e a escalada das margens. `DreamNightmare` mantém patrulha, luz, movimento e sequência narrativa. `DreamNightmareRenderer` carrega as fontes sob demanda e a fase aguarda a decodificação antes de simular. `DreamRoach` articula a pintura original em seis patas, cabeça e antenas, com duas juntas no alcance final. Todos usam o relógio salvo, que pausa junto com a fase.

Arte e proveniência: `yuna-furtiva-v4.png` (seis poses), `abrigos-floresta-v2.png` (cepo, tronco e crista dos relevos), `lagos-lama-v2.png`, `yuna-nado-v2.png`, `morro-terra-v1.png`, `prompts-furtividade-v3.json` e `assets/audio/bug-attack-proveniencia.json`. As variantes1 permanecem como fontes de referência e não são consumidas. Preparação: `node scripts/prepare-dream-nightmare.js`; mapa: `npm run docs:sprites`. O preparador mede alfa, contorno do topo e corpos; não modifica os PNGs.

QA recuperável pelo diário: `test:sonho:furtividade`, `test:sonho:furtividade:saltos`, `test:sonho:furtividade:arte`, `test:sonho:furtividade:integral` e `test:sonho:furtividade:browser`. Os aliases `test:sonho:pesadelo` apontam para a revisão vigente. Resultados reais e limitações ficam exclusivamente no diário; automação preparada não equivale a teste executado nem a aprovação artística.

A revisão artística usa gramas com material pintado, fundo sem repetição espelhada, aranhas com oito patas articuladas e extensões contínuas de casca nos troncos. `DreamSpiderPuppet` deriva a atuação do relógio salvo, sem mudar ciclo físico ou contato da seda. `DreamIllustratedSprites` prepara e libera os caches de grama, fundo e casca. As máscaras e a física do trecho aéreo permanecem anteriores.

Fontes atuais do figurino: yuna-furtiva-v4, yuna-nado-v2, yuna-susto-em-pe-v2 e yuna-despertar-v2. Prompts e iterações em prompts-consistencia-figurino-v1.json; lagos e terra têm prompts-lagos-v1.json e prompts-morro-v1.json. Variantes anteriores permanecem como referência no acervo e nas fontes. Os sprites preservam o tênis floral canônico. A fonte de susto conserva pequenos pontos nos laços.

QA recuperável: `npm run journal:qa -- test:sonho:lagos` e `test:sonho:lagos:browser`; reavaliação dirigida: `test:sonho:lagos:arte:browser`. Resultados e limites da revisão artística, incluindo a última emergência gradual, são registrados no diário. A existência do comando não certifica sua execução ou aprovação.

Saves nightmare6 em entrada antiga retomam já submersos no mesmo lago, após validação, para evitar um salto reiniciado no meio do afundamento. Demais posições/relógios válidos são conservados; versões anteriores continuam migrando. O domínio aéreo5 e o envelope1 permanecem iguais. `DreamNightmareCinematic` recebe o relógio salvo e compõe quatro planos independentes; não avança a simulação. Pausa e save/load conservam plano, atuação e corte direto ao piquenique.

O pulo gravado usa ganho0,325 antes do volume mestre em todas as fases, metade do nível inicial. Lama e asas de besouros conservam seus níveis; abelhas/rasantes recebem multiplicador2 na revisão atual. `prepareTerrain` reutiliza `morro-terra-v1` em caches registrados no perfil existente; não use o bitmap deformado para recalcular colisões.


## Entrada cinematográfica e peso da criatura

Bug attack inicia no primeiro quadro após o pouso no planalto. Na cena em tela cheia, Yuna caminha em terra; as duas falas existentes conservam6/14s e avanço automático/individual. A barata emerge por trás das árvores, assusta Yuna, que corre e se esconde numa pedra. Só então começam os controles da perseguição. A revelação conserva8s. NIGHTMARE_FALL é o nome legado da chegada, sem animação de queda.

As seis pernas têm joelhos sobre quitina opaca e segmentos sobrepostos. Tripés alternam apoio longo e transferência curta; a captura respeita o sentido e o alcance dos membros. Passos geram poeira, impacto grave e tremor visual, mais forte na captura. Interface, geometria e frame físico permanecem estáveis; pausa/restauração conservam os efeitos pelo relógio salvo.

No EASY, a captura usa só um núcleo de0,045rad dentro do feixe visual existente de0,17rad. NORMAL mantém0,21rad e a regra anterior. Pedras e lama continuam bloqueando luz. QA atual: test:barata:revisao, test:barata:revisao:browser e review:barata:browser.


## Fim da sustentação e controles amplos

Após os últimos espinhos, o vento termina. Yuna preocupa-se ainda segurando a folha; ela escapa das mãos, e a menina cai verticalmente para o meio de um terreno já visível. Amortece o pouso e recupera o equilíbrio, sem atravessar uma borda recortada de solo. O trecho é uma cena em tela cheia, com atuação própria; a música Misty Blues continua até a chegada seguinte, quando começa Bug attack.

No pântano, chão sob as patas, sombras, troncos/tocos em camadas e paralaxe lateral integram a criatura ao ambiente. São elementos decorativos; não mudam abrigos ou detecção. Em retrato mobile, Yuna fica acima da área do D-pad por enquadramento fixo.

Jardim e sonho compartilham D-pad grande com oito direções e pulo amplo. No sonho, diagonais combinam os eixos; PULAR é separado. No jardim, cima também salta. No voo apenas subir/descer tem efeito na trajetória. Arrastar pelo centro neutro não perde o contato. Asas de todas as abelhas, incluindo rasantes, têm o dobro do ganho anterior; demais efeitos mantêm os níveis.


## Abertura com Yuna e Nanda — 01/11/2026

O sonho agora começa com uma cinemática em tela cheia, antes do percurso. Yuna sente frio naquele ambiente e vê Nanda, estranhamente do mesmo tamanho. Ajoelha-se e a balança: “Nanda, onde estamos? Está frio aqui.” A irmã continua dormindo. “Nanda, estou com medo! Me fale como sair daqui.” Sem orientação, Yuna decide seguir e deixa Nanda dormindo.

Não toca música durante a descoberta e os pedidos; há apenas um zunido baixo de silêncio inquietante. Misty Blues entra na transição final da partida e continua no gameplay. Toda fala avança sozinha; um gesto adianta apenas a fala atual, preservando o mínimo da atuação. Não é necessário clicar para a fase começar. Orientações de escalada/lombo aparecem depois, enquanto o jogador já controla Yuna.

O save usa domínio6/envelope1/nightmare7. Abertura guarda momento, tempo, relógio de atuação e dispensa da fala. Saves anteriores mantêm seu percurso sem repetir a cena. QA recuperável: test:sonho:abertura, test:sonho:abertura:browser e review:sonho:abertura:browser.
