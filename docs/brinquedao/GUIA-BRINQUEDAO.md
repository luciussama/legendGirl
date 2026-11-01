# Brinquedão

Depois do despertar do pesadelo, Yuna continua assustada e desanimada. Nanda a tranquiliza e a convida para brincar. A cinemática usa atores separados, expressões próprias, piquenique canônico, moldura compartilhada e corte para o jardim ensolarado. Nanda volta ao seu tamanho habitual. A trilha enviada começa no convite e segue em loop durante a fase.

São sete momentos de 5/5/5/7/4/4/5 segundos. As falas avançam automaticamente; Enter, Espaço ou toque adianta apenas o momento atual. A saída consome o gesto e exige liberar o pulo antes de saltar. Pausa e perda de foco suspendem a cena.

O circuito lateral tem 35.600 unidades, três escorregadores, três piscinas de bolinhas, pontes de madeira e passarelas acolchoadas coloridas. A referência do Sonic orientou somente a ideia de circuito rápido com alturas e caminhos alternativos; nenhum recurso visual dessa imagem é consumido pelo jogo. Arte própria em [assets/art/brinquedao](../../assets/art/brinquedao), com [prompts e origem](../../assets/art/brinquedao/prompts-brinquedao-v1.json).

Use A/D ou setas para mover e Espaço para saltar. No celular, D-pad grande, diagonais e PULAR. Cima também salta, seguindo o jardim. Aceleração 1.350, velocidade normal 700, escorregadores até 980, gravidade 1.500 e impulso 730. Bolinhas amortecem o movimento e permitem novo salto. Três desníveis de 100 unidades exigem salto; dois atalhos elevados oferecem outro percurso. A corrida inicial conserva a recuperação amortecida. Na continuação, sair da estrutura e perder os apoios causa Game Over, inclusive no EASY; Tentar novamente retorna ao último terraço alcançado. A chegada tem uma narração de seis segundos, sem inventar outro capítulo.

## Contratos de implementação

| Módulo | Responsabilidade |
| --- | --- |
| `BrinquedaoLevel` | Geometria, consultas, alturas, materiais, desníveis e checkpoints. |
| `BrinquedaoSimulation` | Estado puro, aceleração, subpassos de até 1/180 s, salto manual, colisão lateral dos desníveis, apoio e recuperação. |
| `BrinquedaoStory` | Falas, prazos e transição para controle. |
| `BrinquedaoPhase` | Carga, entrada, disponibilidade, pausa, snapshot e descarte. |
| `BrinquedaoRenderer` | Câmera lateral no início e acompanhamento de altitude na continuação, escala fixa por viewport, HUD e controles. |
| `BrinquedaoCinematic` | Atuação, enquadramento narrativo e leitura segura em retrato/paisagem. |
| `BrinquedaoTerrain` | Materiais pintados projetados sobre os apoios físicos, postes, rede e frente opaca das bolinhas. |
| `BrinquedaoExtension` | Geometria dos trampolins, castelos, pontes frágeis, rampa e limites de queda. |
| `BrinquedaoObstacles` | Contatos, impulsos, colapso, relógios persistidos e validação das atrações. |
| `BrinquedaoAttractions` | Componentes pintados, castelos, lonas e painel elástico em camadas. |
| `BrinquedaoRecovery` | Plataformas inferiores, calhas, camas laterais e resposta física das rebatidas. |
| `BrinquedaoArt` | Recortes e máscaras gerados; não editar manualmente. |
| `BrinquedaoAudio` | Especialização de GardenAudio, trilha própria e efeitos, sem asas herdadas de outra fase. |

O domínio é versão 4 e o envelope continua versão 1. Saves do domínio1 conservam o percurso; uma chegada antiga concluída volta a RUNNING na mesma posição, liberando a continuação sem repetir o convite. `toyRoomBrinquedao` guarda estado e posição musical somente em campanha. A restauração prioriza Brinquedão antes de sonho/jardim/epílogo/fuga. Saves antigos sem esse campo mantêm seu fluxo; um sonho concluído com despertar completo abre o convite após um segundo. A bandeira Brinquedão reproduz a entrada sem sobrescrever a campanha.

Modo/apoio, referências, números e índices são validados ao restaurar. Entrada, imagens, listeners, caches e nós de áudio ficam fora do save. Trocar de fase descarta esses recursos. A fase compartilha controles e áudio com o jardim, mas possui corpo e física próprios.

## Manutenção

Após editar as pinturas, executar `node scripts/prepare-brinquedao.js` e `npm run docs:sprites`. O gerador mede componentes completos e máscaras, preservando cabelo, mãos e sapatos. A prancha v1 de Yuna é referência preservada; a v2 separa as quatro poses e é a fonte consumida. Não desenhar linhas auxiliares sobre superfícies. Manter apoios alinhados com o topo pintado sem modificar a física para disfarçar erros de arte.

QA recuperável no diário: `test:brinquedao:dominio`, `test:brinquedao:browser LARGURA ALTURA DIRETORIO` e `review:brinquedao:browser LARGURA ALTURA DIRETORIO`. O segundo percorre o jogo por RAF e teclado; em retrato Android também verifica toque diagonal. O terceiro prepara quadros dirigidos para inspeção, sem equivaler a percurso. Evidências e fontes de QA pertencem exclusivamente ao diário.

## Continuação: do escorregador gigante aos castelos altos

O fim da corrida em14.800 agora emenda num escorregador de2.200unidades até o primeiro conjunto de camas elásticas. Três lonas lançam Yuna até torres acolchoadas de castelo, com pontes de madeira que cedem. A queda da terceira torre encontra outro escorregador, terminando num painel elástico lateral oblíquo. O impacto carrega a rampa reversa, transforma o embalo em lançamento para o céu e conduz a um conjunto mais alto de três camas e castelos. O terraço final termina em35.600.

As lonas impulsionam ao receber os pés em descida. Segurar PULAR no impacto aumenta o impulso em12%; a altura e a direção exigem controle para evitar passar do pouso. Acelerar, frear ou inverter a direção funciona no ar. O painel fornece2350unidades/s à rampa; o lábio lança com velocidade horizontal entre650–850 e vertical1550 para cima. A posição não é corrigida durante o voo.

As24peças de ponte começam a ceder ao contato:0,28s nas torres inferiores e0,24s nas superiores. EASY multiplica esses prazos por1,6. Depois disso, a peça perde o apoio e cai/roda visualmente; os postes ficam presos à estrutura. No segundo castelo alto, o terraço mais estreito pede ajuste no ar e há um salto até uma ponte elevada separada por um vão. Outro salto atravessa o vão antes do terraço final. Na rota alta direta, correr segurando apenas uma direção faz perder apoios; as rotas inferiores oferecem outra chance.

Depois de14.800, os vãos são reais. Cair abaixo da estrutura causa derrota; a área superior tem seu próprio limite de queda. A tela usa o título BRINQUEDÃO e informa a retomada no terraço. Checkpoints novos só se ativam ao alcançar seu terraço real; sobrevoar não conta. Retry rearma as pontes posteriores e mantém os registros de impulsos anteriores. Contagem global de derrotas e oferta de EASY seguem o contrato da campanha.

Na primeira corrida, o enquadramento continua lateral. Na parte vertical, a câmera acompanha a altitude sem alterar a escala, o corpo ou o salto. Jardim e céu se misturam gradualmente, com borda dissolvida para não aparecer um retângulo ao subir. Controles de celular e área segura ficam preservados.

`obstacles` salva horários de contato das pontes/lonas, último impacto lateral e contagens de impulsos/lançamentos. Desde o domínio2, o estado salva `failures`; derrota congela a física. Relógios ficam suspensos durante pausa e carga de recursos. Restaurar uma ponte já caída como apoio é inválido; restaurar a história do colapso é permitido. Novo recurso: [atracoes-elasticas-v1.png](../../assets/art/brinquedao/atracoes-elasticas-v1.png), [prompt e hash](../../assets/art/brinquedao/prompts-atracoes-elasticas-v1.json).

QA: `test:brinquedao:elastico`, `test:brinquedao:elastico:browser LARGURA ALTURA DIRETORIO` e `review:brinquedao:elastico:browser LARGURA ALTURA DIRETORIO` pelo diário. Os aliases anteriores de domínio/percurso passam a apontar para a sequência atual; fontes anteriores permanecem no acervo. O navegador percorre o circuito por RAF, salva/retoma sobre ponte frágil e verifica game over, restauração sem duplicar derrota e retry pelo botão real.

## Segunda chance nas partes inferiores

Quedas das torres agora podem encontrar três plataformas baixas com escorregadores de retorno, antes do limite de falha. Sob a área alta há três calhas em U, ligadas a patamares e outras rampas. Nas extremidades dessas calhas ficam18camas elásticas laterais: Yuna bate numa parede, volta para a outra, percorre a rampa e muda de altura com o embalo. A geometria é apoio real, não apenas decoração.

Cada rebatida devolve velocidade horizontal de1280–1550 e impulso vertical conforme a altura da lona. A direção responde com32% da força normal durante0,18s após o impacto, recuperando a força total em seguida. Isso conserva a sensação de descontrole sem bloquear a entrada. A calha mantém mais embalo que a passarela; frear e saltar pela borda permite sair. As três lonas de retorno amortecem a velocidade horizontal e lançam verticalmente para os castelos ou o terraço final; o jogador pode ajustar o voo.

O limite fatal da área alta passa de400 para1800, abaixo dessas rotas. Ainda há pontos sem apoio e Game Over ao perder também a segunda chance. Patamares inferiores não ativam checkpoints das torres que estão acima. O percurso principal e os controles anteriores continuam disponíveis.

Domínio3 migra saves1/2; saves2 conservam o estado das pontes e lonas anteriores e recebem os novos relógios vazios. No domínio4, COMPLETE de saves2/3 abre o novo interior. `obstacles.bumpers` guarda os18instantes de contato, `ricochets` conta rebatidas e `recoveryLandings` registra apoios inferiores. O save preserva o movimento e o breve recuo do corpo/lona durante pausa e retomada. Não há reposicionamento automático até outro brinquedo.

As calhas, plataformas e camas verticais reutilizam as pinturas existentes em memória. Não foram criados ou sobrescritos PNGs. QA específico pelo diário: `test:brinquedao:recuperacao`, `test:brinquedao:recuperacao:browser LARGURA ALTURA DIRETORIO` e `review:brinquedao:recuperacao:browser LARGURA ALTURA DIRETORIO`. O percurso principal continua coberto pelos aliases de domínio/elástico e navegador.


## Interior: três seções de velocidade e cuidado

Antes da chegada, o portal do terraço conduz ao interior ensolarado do brinquedão. São três seções com três tubos e três piscinas cada: nove alternâncias. Tubos fechados translúcidos acompanham curvas arredondadas, descidas e subidas a2300/2500/2700unidades/s. O percurso é conduzido pela curva; segurar para trás reduz a velocidade a85%. Nas piscinas, a velocidade máxima cai para220, permitindo parar, esperar e saltar manualmente. Bolinhas e bordas acolchoadas conectam as entradas e saídas.

Os peixinhos de corda emergem das bolinhas em ciclos alternados, com aviso visual de0,55s antes do salto. As seções contêm dois, três e quatro peixes por piscina, com períodos progressivamente menores. Espere a passagem e atravesse durante o mergulho. O contato do corpo com o peixe dá dano; o primeiro causa recuo e1,4s de proteção. Dois acertos ao longo da tentativa interna inteira causam Game Over. Não há cura automática entre piscinas. O HUD mostra dois corações; retry retoma na borda segura da piscina atual com ambos restaurados. Depois da nona piscina ocorre a chegada ao jardim.

O domínio4 mantém o envelope1 e acrescenta interior versão1: seção, trecho, modo tube/pool, progresso da curva, relógios, corpo local, danos, proteção e checkpoint. Saves1/2/3 migram conservando o percurso externo; a antiga chegada concluída abre o primeiro tubo. Pausa e save/restore preservam a curva, o ciclo dos peixes e a proteção. Trajetórias amostradas, imagens e recursos de áudio ficam fora do snapshot.

| Módulo | Responsabilidade e contratos |
| --- | --- |
| `BrinquedaoTubes` | `BRINQUEDAO_INSIDE`, `BRINQUEDAO_TUBES`, `brinquedaoTubePose`, `brinquedaoInsideFloor`: nove trajetórias por comprimento e piso das piscinas. |
| `BrinquedaoFish` | `brinquedaoFishSpecs`, `brinquedaoFishPose`, `brinquedaoFishTouches`: ciclos, aviso e contato elíptico contra o tronco. |
| `BrinquedaoInterior` | `createBrinquedaoInterior`, `beginBrinquedaoInterior`, `retryBrinquedaoInterior`, `stepBrinquedaoInterior`, `validateBrinquedaoInterior`: alternância, vida, retomada e contrato serializável. |
| `BrinquedaoInteriorRenderer` | `prepareBrinquedaoInterior`, `drawBrinquedaoInteriorDoor`, `renderBrinquedaoInterior`: portal, cilindros pintados projetados sobre curvas, piscinas em camadas e HUD. |

Novas pinturas: interior, dois módulos de tubo e quatro poses de peixes. [Prompts e proveniência](../../assets/art/brinquedao/prompts-interior-v1.json). Gerar metadados com prepare-brinquedao e reconstruir o mapa de sprites. QA recuperável: `test:brinquedao:interior`, `test:brinquedao:interior:browser LARGURA ALTURA DIRETORIO` e `review:brinquedao:interior:browser LARGURA ALTURA DIRETORIO`. O primeiro verifica percursos estratégicos NORMAL/EASY, cadências, dano e migração; o segundo usa teclado/RAF; o terceiro produz quadros dirigidos para inspeção.
