# Jardim dos sonhos — floresta aérea 2D

Direção de 30/10/2026: o usuário substituiu o jardim 3D por uma floresta lateral 2D para limitar custo de GPU e escolheu duração aproximada de cinco minutos. A nova mecânica é agarrar/escalar e saltar entre gramas ao vento e insetos gigantes móveis. O foco anterior em furtividade foi substituído; não há combate, espada ou pisão ofensivo.

## Percurso e controles

São seis ambientes: gramas iniciais, vento mais forte, lombos de besouros, abelhas elevatórias, teias com aranhas e a base da passagem por galhos ao vento. A floresta mede 30.018 unidades; a duração depende da leitura do vento e das tentativas. Folhas estáveis são pontos de descanso, e o destino é uma clareira. A narração final dura sete segundos ou pode ser adiantada; depois, o ambiente continua animado sem novo capítulo ou botão de saída. O mapa tem 90 objetos físicos e apenas quatro besouros (antes eram 27). Cada besouro espera Yuna apoiar os pés no lombo, prepara a decolagem por 0,65 s e faz uma viagem de 12–14 s até perto do próximo apoio. As rotas alternam curvas de subida e descida, com aceleração e desaceleração suaves. Ele permanece no destino para permitir o salto; agarrar sua lateral ainda não inicia a viagem. O percurso anterior até a folha após as abelhas foi aprovado e conserva seus 80 objetos; o trecho seguinte foi substituído. Insetos transportam a menina e suas laterais podem ser escaladas.

| Dispositivo | Andar / orientar salto | Subir / descer | Saltar |
| --- | --- | --- | --- |
| Teclado | A/D ou esquerda/direita | W/S ou cima/baixo | Espaço |
| Touch | ◀ / ▶ | ▲ / ▼ | PULAR, simultâneo com a direção |
| Gamepad | Eixo horizontal / D-pad | Eixo vertical / D-pad | A/X |

As gramas se prolongam em caules gigantes, cuja base fica abaixo da borda inferior em qualquer viewport. A lâmina continua flexionando ao vento e o trecho inferior mantém sua ligação com o chão fora do enquadramento.

A aderência ocorre automaticamente quando o corpo/mãos alcançam qualquer haste próxima ou a lateral do inseto, pelos dois lados. Ela inclui o caule abaixo da lâmina: perder a primeira grama não bloqueia agarrar e escalar a seguinte. Na grama, soltar o direcional conserva a pegada; o vento continua carregando a personagem. Perto da ponta, aguarde a aproximação do próximo apoio e escolha a direção do salto. Uma janela breve impede agarrar de novo somente o mesmo objeto imediatamente após saltar; as outras gramas continuam elegíveis. A pegada conserva o lado de contato até o salto, sem atravessar o caule ao mudar o direcional. Ao chegar ao alto do inseto, a escalada se transforma em apoio sobre o contorno da pintura.

O NORMAL tem queda animada e “Tentar novamente” no último descanso, com a oferta EASY da campanha. O EASY recupera Yuna sem morte. Ao retomar um checkpoint, os transportes daquele trecho em diante voltam aos pontos iniciais; uma queda não deixa o besouro necessário fora de alcance. Pausa/perda de foco libera entradas e congela o vento junto da simulação. Não há perda de energia por esperar agarrada.

## Apresentação e custo

Fundo pintado azul/índigo com névoa, gramas em Canvas, folhas ilustradas e insetos ilustrados e poses próprias de escalada. O besouro usa a pintura original em camadas: asas membranosas batem, três patas articulam alternadamente e cabeça/antenas oscilam. As partes são preparadas em cache uma vez e liberadas ao sair; o casco de apoio conserva a geometria física. Yuna espera em pé durante o transporte. Yuna continua com sua identidade e roupa do jardim. A câmera mantém enquadramento vertical fixo por viewport e só rola lateralmente. O nome do trecho fica abaixo dos controles superiores; os comandos touch têm alvos separados.

A floresta não cria renderer WebGL, modelos 3D, sombras dinâmicas, filtros de tela inteira ou buffers por quadro. Consultas espaciais limitam física e desenho à vizinhança; partículas são catorze pequenos pontos. Recursos são carregados ao entrar e liberados na saída. Isso reduz a carga arquitetural; avaliação de GPU em aparelhos reais ainda depende de homologação no hardware.

O arquivo original **Misty Blues.mp3** enviado pelo usuário foi copiado sem alteração para `assets/audio/`; cerca de 200,04 segundos, em loop, com volume/mudo/pausa do host. `GardenAudio` aceita trilha configurável; o jardim anterior conserva sua música padrão.

## Módulos e persistência

| Módulo | Contrato |
| --- | --- |
| `DreamLevel` | Mapa, setores, consultas espaciais e poses móveis determinísticas pelo tempo. |
| `DreamClimb` | Ciclo visual por distância, mãos na pintura e transição para o topo. |
| `DreamWeb` | Contato corporal com aranhas e disponibilidade real do fio para agarrar. |
| `DreamSimulation` | Domínio em segundos/subpassos de até 1/120 s, leitura, aderência, escalada, saltos, contorno, queda, checkpoints e conclusão. |
| `DreamArt` | Recortes e perfis superiores medidos por alfa, gerados de fontes preservadas. |
| `DreamIllustratedSprites` | Folhas e caules pintados, registro em cache e batimento das asas da abelhinha do bem. |
| `DreamBeetle` | Cache de partes da pintura original, poses de asas/patas/cabeça e desenho articulado. |
| `DreamRenderer` | Pintura e interface; usa a mesma geometria das hastes e contornos dos apoios. |
| `DreamInput` | Complementa GardenInput com eixo vertical, teclado, gamepad e toque simultâneo. |
| `DreamPhase` | Carga, pausa, áudio, save/restore e descarte; recebe apenas host, canvas, dificuldade e origem. |

`toyRoomDream` guarda envelope versão 1, estado versão 3 e posição musical. Estado contém relógio, leitura, checkpoint, progresso, quedas, contatos com aranhas (`hits`), causa da queda (`fallCause`) e jogador (posição, velocidades, apoio, aderência e bloqueio de reagarre). O campo `rides` guarda, para os quatro transportes, `null` antes do embarque ou o instante numérico de partida; posição e fase do voo derivam desse instante e do relógio salvo. Pausa e retomada conservam a viagem. Saves do domínio 1 conservam a migração dos besouros: posições afetadas pela nova seção de besouros retornam à folha `rest-2`, e apoios removidos do trecho misto à `rest-5`; os demais apoios válidos são conservados. Na revisão 3, saves dos domínios 1/2 no trecho substituído retomam na folha `rest-4`; posições anteriores aprovadas continuam válidas. Não serializa imagens, Canvas, áudio, listeners ou ponteiros. No caule inferior, a coordenada de aderência `u` pode ser maior que 1; a altura continua relativa ao comprimento original da lâmina, preservando saves anteriores. `restoreDreamState` valida versões, limites e IDs; a física conserva o relógio das plataformas e o bloqueio de reagarre.

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

O outro lado é um grande galho/checkpoint `rest-5`, seguido por três galhos, incluindo a extremidade provisória. Todos usam pintura com casca, musgo e tronco, com deslocamento leve pelo vento e transporte dos pés. A base permite saltar entre eles; o desafio específico dessa parte aguarda definição do usuário. O repouso no último galho conserva o ambiente vivo, sem inventar um novo capítulo ou um despertar.

`test:sonho:teias` verifica o limite aprovado, travessia, intervalos abertos/fechados, espera perigosa, dano, queda e migração. `test:sonho:teias:browser 1200 720 NORMAL` percorre o novo trecho por teclado após save preparado na folha; aceita os formatos de celular.

A meta de cerca de cinco minutos será recalibrada quando o usuário definir o desafio dos galhos; o segmento atual é uma base para avaliação, e tempos de pilotos automatizados não garantem duração humana.

## Animação de escalada

`yuna-escalada-v2.png` fornece seis poses completas: quatro para subir com braços e pernas flexionando/estendendo e duas para puxar o corpo até o lombo. A escala comum conserva a proporção do corpo. `DreamClimb` usa a mão como âncora; nas hastes e teias, segue a curva de contato, e nos insetos encontra pixels do corpo pintado, sem usar as asas membranosas móveis. Perto da borda, muda para as poses de chegada ao topo. A pose em pé continua a anterior.

O ciclo visual percorre quatro poses a cada72 unidades escaladas, calculadas por climb.u. Descer inverte o ciclo; esperar conserva a pose mesmo com vento ou voo do inseto. Uma inclinação contínua acompanha o empurrão dos pés. Os contornos e âncoras são somente apresentação: física, colisões, distâncias, domínio3/envelope1 e animação sobre o lombo foram preservados. As quatro poses antigas ficam como referência, sem voltar ao runtime.

`test:sonho:escalada` verifica âncoras/contatos em pixels reais e fase por distância; `test:sonho:escalada:browser 1200 720 NORMAL` sobe nos dois lados de abelhas/besouros e na haste, com pausa e save. Também aceita os formatos de celular.
