# Brinquedão

Depois do pesadelo, Nanda convida Yuna para correr pelas pontes e voar nos tobogãs. A abertura conserva sete momentos, atores separados, piquenique canônico e leitura compartilhada. A música enviada começa no convite e segue durante a fase; pausa, mestre e mudo continuam compartilhados com o jardim.

## Circuito externo

O circuito ensolarado tem35.600unidades. As três antigas piscinas jogáveis viraram pontes rápidas de madeira. Não há resistência de bolinhas: a menina conserva o embalo da descida. Os identificadores `bolinhas-sol`, `bolinhas-vento`, `bolinhas-grande` permanecem apenas para compatibilidade de saves; o tipo atual é `fish-bridge`, com superfície plana.

Dois peixes saltam em pontos fixos de cada ponte. A trajetória depende só do relógio e do ponto de origem: não mira nem persegue Yuna. Durante o salto, o contato arremessa a menina para trás com velocidade de650–1000 e impulso vertical660. A rotação é do corpo inteiro, sem separar cabeça/pescoço. Por0,4s a força direcional fica reduzida, e há1,6s entre danos para impedir múltiplos contatos no mesmo golpe. O golpe interrompe a corrida; não utiliza o antigo limite de dois corações das piscinas. Uma queda fora da estrutura ainda pode causar derrota.

A/D ou setas movem; Espaço salta. No celular, D-pad e PULAR amplos. Aceleração1350, corrida700, escorregadores até980, gravidade1500 e salto730. Desníveis em3700/7900/12300 continuam pedindo salto; os dois atalhos elevados continuam acessíveis.

Depois do escorregador gigante, seis camas elásticas levam a castelos com pontes frágeis. O painel da descida transfere embalo à rampa reversa, lançando para os castelos altos. Pontes cedem após0,28s/0,24s, com prazo1,6vez maior no EASY. Checkpoints só ativam sobre o terraço real. Retry externo rearma as pontes futuras.

Três plataformas inferiores e rampas ligam a recuperação à próxima lona/descida. Nas três calhas altas, as duas primeiras rebatidas conservam o descontrole; depois, o painel direito se inclina e lança até a própria lona de retorno. Segurar direita permite sair, sem frenagem precisa. O lançamento preserva impulso até a lona ou2,2s e permite frear para trás. Vãos fora das recuperações continuam fatais.

## Interior: quatro tobogãs em sequência

A torre no terraço final dá acesso à nova corrida interna. Não há piscinas ou peixes no interior. As bocas compartilham centro e piso com as pistas; previews mostram a sala real de origem/destino, evitando cilindros retos duplicados sobre curvas.

1. **Primeiro tobogã → pista lisa e triângulo.** A menina sai com embalo760; manter direita acelera até900. É preciso saltar o bloco triangular azul em1120 (170de largura/94de altura). A colisão causa dano/recuo, mostra a reação por0,8s e reinicia o primeiro tubo. Não é Game Over nem consome o antigo sistema de dois corações.
2. **Segundo tobogã → camas laterais automáticas.** Seis voos de0,65s ligam as lonas alternadas e o bocal do terceiro cano. Os controles não alteram a sequência e não há dano. Câmera/rotação acompanham a desorientação solicitada; pausa/save/restore conservam o ponto exato.
3. **Terceiro tobogã → ponte de blocos.** A ponte tem15blocos entre300 e2100. Ao entrar no trecho, uma onda de colapso avança: primeiro bloco após0,55s, seguintes a cada0,15s. EASY amplia o prazo em30%. Manter direita permite atravessar. Parar/frear pode fazer perder o apoio; a queda é mostrada antes do Game Over. Retry refaz o terceiro tubo, preservando o desafio sem repetir o circuito externo.
4. **Quarto tobogã → chegada.** Termina no portal CHEGADA e encerra o Brinquedão. A conclusão permanece nesse cenário; não retorna visualmente à antiga entrada externa. A narração final usa o padrão compartilhado.

As velocidades-base dos tubos são2300/2950/3150/3450, com variação suave de12%. Pista e blocos usam caminhada900, salto730 e gravidade1500. Sem direção, o embalo é perdido gradualmente; a corrida não é concluída automaticamente. A segunda ligação é a única sequência de movimento inteiramente automática.

## Estado e persistência

Domínio7/envelope1; interior versão3. Migra versões1–6 antes de validar. O corpo apoiado numa piscina antiga passa ao piso plano da ponte correspondente. Interior antigo é encaminhado proporcionalmente para um dos quatro tubos; conclusões continuam concluídas. Derrota interna antiga migra para a retomada do terceiro tubo.

O interior guarda `leg`, modo, `u`, relógios, checkpoint, tropeços, índice da rebatida automática, início da onda de colapso e corpo. Não há atores/estados de perseguição ou corações internos. `obstacles.fishImpact` registra contagem e horário do golpe externo, preservando recuo/proteção após restore. Outlets, contatos das pontes/lonas, música e demais checkpoints permanecem nos contratos anteriores. Recursos de imagem, listeners e nós de áudio ficam fora do snapshot.

| Módulo | Responsabilidade / contratos |
| --- | --- |
| `BrinquedaoLevel` | Circuito, pontes rápidas, alturas, desníveis e checkpoints. |
| `BrinquedaoSimulation` | Corpo externo, impacto dos peixes, migração e delegação interna. |
| `BrinquedaoFish` | `brinquedaoFishSpecs`, `brinquedaoFishPose`, `brinquedaoFishTouches`, `brinquedaoFishImpactAge`: salto fixo e contato, sem perseguição. |
| `BrinquedaoGauntlet` | `BRINQUEDAO_GAUNTLET`, `BRINQUEDAO_REBOUNDS`, `brinquedaoBlockSolid`, `brinquedaoTriangleTouches`, `brinquedaoReboundPose`: objetos e desafios entre tubos. |
| `BrinquedaoTubes` | Quatro trajetos por comprimento e tangente. |
| `BrinquedaoInterior` | Criação, transições, restart do triângulo, rebatidas, colapso, retry e validação. |
| `BrinquedaoInteriorRenderer` | Materiais, pistas/obstáculos, lonas, queda dos blocos e chegada. |
| `BrinquedaoAttractions` | Torres/lonas e `drawBrinquedaoBridgeFish`, com salto visível sob as pontes. |
| `BrinquedaoRecovery` | Rotas inferiores e saídas das calhas. |
| `BrinquedaoPhase` | Ciclo de carga, entrada, pausa, áudio e descarte. |

## Arte e manutenção

Os peixes reutilizam a prancha de brinquedos existente. Triângulo: topo de `toy-room/stage3/stacking-blocks-v1.png`; blocos: material pintado `toy-room/bear-chase/materials/blocos-atlas-v1.png`. Não houve geração ou edição de PNG. Os antigos recursos de piscinas permanecem como fontes preservadas, sem piscinas jogáveis. `BrinquedaoPools` foi arquivado no diário antes da remoção do runtime. Após alterações visuais, reconstruir o mapa com `npm run docs:sprites`; não desenhar linhas auxiliares de hitbox sobre os objetos.

QA recuperável: `test:brinquedao:corrida`, `test:brinquedao:pontes`, `test:brinquedao:corrida:migracao`, `test:brinquedao:corrida:browser`, `test:brinquedao:corrida:toque:browser` e `review:brinquedao:corrida:browser`. Navegadores recebem largura, altura e diretório de evidência dentro do diário. Casos de sucesso e falha são registrados separadamente; emulação não equivale a aparelho físico.
