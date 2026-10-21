# Diário do projeto para pessoas

Este diário acompanha as decisões e mudanças do produto em linguagem humana. Guias de desenvolvimento, design e arquitetura continuam na documentação. Resultados de máquina, testes, medições, homologações e registros de evidências ficam exclusivamente no diário de IA.

## A experiência atual

A tela inicial oferece Novo jogo, Carregar e Modo fácil para a nova aventura. A menina atravessa o quarto escuro e seu retorno de plataformas, explora uma sala de brinquedos, interage com os objetos e recebe uma espada. A imaginação transforma a mesma sala numa arena heroica: móveis e brinquedos ganham escala épica. A vitória sobre o urso conduz à perseguição: a menina se aproxima da pelúcia caída, ele se levanta e foge. Ela corre desviando dos brinquedos até alcançá-lo e levá-lo ao baú. Exploração, arena e fuga pertencem à mesma campanha.

## 13 de outubro de 2026 — organização do trabalho visual

Foi criado um guia para a equipe de design localizar imagens, poses e consumidores no código. O README ganhou “Orientações para o designer”. A equipe deve preservar a identidade da menina, os materiais ilustrados e as proporções, além de coordenar mudanças em recortes e âncoras com desenvolvimento.

As imagens e os desenhos antigos classificados pelo responsável foram retirados. Alguns elementos receberam novos sprites com a assinatura atual; outros reutilizam artes existentes. A aprovação artística de mudanças novas precisa ser registrada explicitamente, sem presumir que a aprovação anterior da arena vale para cada recurso novo.

## 13 de outubro de 2026 — contexto compartilhado entre pessoas e IAs

O projeto passou a ter um diário de IA com documentos e instruções preservados, histórico disponível no Git e registros por sessão. Toda IA começa consultando esse acervo e registra as mudanças ao concluir. As regras vigentes e o contexto atual são as entradas para interpretar o histórico.

## 13 de outubro de 2026 — separação da documentação e dos registros de máquina

Relatórios técnicos e arquivos de QA foram retirados das pastas do projeto após registro no acervo. O código das verificações pode ser recuperado em ambiente temporário; os resultados voltam para o diário de IA. Capturas regeneráveis são descartadas, mantendo sua identificação e hash para consulta. Artes de produção continuam no jogo, mesmo quando antes estavam agrupadas com materiais de homologação.

Essa organização evita que designers e desenvolvedores precisem navegar por relatórios de máquina para entender o produto. Para detalhes técnicos históricos, consulte o [diário de IA](diario-ia/README.md); para editar o visual, consulte o [guia de designers](sprites/GUIA-DESIGNERS.md).

## 13 de outubro de 2026 — diálogos consistentes entre as fases

As falas da Toy Room passaram a usar a mesma caixa com retrato e nome do interlocutor da primeira fase. Nanda e a menina conversam em uma faixa ampla, em vez do quadrado central. No celular, a caixa respeita o espaço dos controles. Os textos e o ritmo da história permanecem iguais; trechos do narrador continuam distintos das falas dos personagens.

## 14 de outubro de 2026 — inimigos que leem o estilo da jogadora

Robô, dinossauro e Urso agora ajustam a escolha dos golpes existentes ao jeito recente de jogar: observam se a menina costuma ficar longe, pular ou atacar com frequência. O Trem mantém sua sequência introdutória. As decisões são determinísticas e usam uma memória curta, sem mudar os golpes, tempos, corações ou regras de combate. A intenção é aumentar o desafio sem retirar da jogadora oportunidades de leitura e resposta.

## 14 de outubro de 2026 — esquivar para abrir o contra-ataque

A arena passa a exigir leitura do adversário: Robô, dinossauro e Urso respondem aos golpes recebidos e protegem a preparação dessa resposta. A menina precisa abaixar, pular ou recuar e atacar na abertura seguinte. Insistir contra a proteção não recupera corações e prolonga a recuperação da espada. O HUD anuncia a ameaça e a abertura; a evasão dos inimigos considera o alcance real e tem alternativa nas bordas. O Trem conserva seu papel introdutório, e os corações e as artes permanecem os mesmos.

## 14 de outubro de 2026 — peso e clareza da espada

A espada ganhou 10% de alcance e um contato mais claro. O som diferencia o corte no ar, o acerto com peso e o ricochete contra a proteção. Faíscas e efeitos acompanham a lâmina; os acertos têm uma pausa e um tremor um pouco mais marcados. A menina continua precisando esquivar e aproveitar a abertura do inimigo, com os mesmos corações e recuo.

## 15 de outubro de 2026 — organização da arquitetura e documentação

A sala passou a separar controles, movimento, interação, história, tutorial, câmera, efeitos, desenho e persistência em componentes com responsabilidades explícitas. A integração conserva o fluxo da aventura e os mesmos recursos visuais. Os adaptadores consultam os atores e brinquedos atuais ao restaurar a campanha.

A documentação tem agora um [catálogo da arquitetura e entidades](ARQUITETURA.md), uma [referência de métodos](REFERENCIA-METODOS.md) e um [catálogo de comandos](COMANDOS.md). O design inicial de batalha permanece identificado como origem histórica, com diferenças para a arena atual descritas no guia vigente. A separação de responsabilidades continua no combate, na arena e no coordenador principal; não foi declarada uma nova engine genérica.

## 19 a 21 de outubro de 2026 — menu e continuidade da aventura

A tela inicial ganhou a cena da menina lendo e opções para iniciar ou carregar a aventura. O modo fácil acompanha a campanha salva. A vitória da arena agora entrega diretamente à introdução da fuga, com escurecimento durante a troca e preservação do progresso. A conclusão da perseguição ainda precisa de navegação própria; sua derrota agora oferece nova tentativa.

O NORMAL exige desvios sucessivos na fuga: nos trechos densos há até três brinquedos, e o final alterna pares com um corredor mais amplo. O EASY conserva sua distribuição anterior e recebe mais vidas; na arena, oferece maior alcance e mais tempo para reagir.

Os pousos do retorno passaram a reconhecer o contato durante a descida, evitando perder um apoio que foi cruzado entre quadros. A apresentação móvel usa um enquadramento contínuo. O piso da fuga recebeu um ajuste de compatibilidade de textura; o relato de ausência da madeira no Safari ainda aguarda confirmação. Novas artes e modelos continuam sujeitos à aprovação específica do responsável.

## 21 de outubro de 2026 — ajuda após três derrotas

A perseguição passa a perguntar “A menina não alcançou o urso. Tentar novamente?” quando a tentativa termina. É possível tentar essa fase de novo sem voltar ao menu.

Depois de três derrotas completas na campanha, em qualquer parte da aventura, o jogo pergunta “deseja tentar no fácil?”. Aceitar muda a dificuldade e mantém a parte atual: checkpoint do quarto, adversário da arena ou progresso na perseguição. Recusar mantém o NORMAL; outras três derrotas permitem nova oferta. A contagem e a escolha acompanham a aventura salva.

## 21 de outubro de 2026 — composição da arena

A arena ganhou um piso contínuo de madeira e móveis apoiados em planos coerentes. A janela central fica livre, o armário ocupa a lateral e o cavalinho tem espaço próprio. O tapete aparece sob os móveis, com proporções compatíveis com o piso. O enquadramento mostra mais do quarto e mantém os nomes dos adversários abaixo dos botões superiores. A entrada e a saída dos brinquedos acompanham o baú visível. As artes e as regras de combate foram preservadas.

## Próximas entradas

Acrescente uma entrada quando mudar a experiência, a direção visual ou a forma de trabalho. Descreva o impacto para pessoas; não copie logs, métricas ou saídas de testes para este arquivo.

## 21/10/2026 — Especial da menina na arena

A espada arco-íris pode ser usada uma vez na batalha inteira, por R, Y ou ESPECIAL no touch. A câmera aproxima do rosto durante a preparação e retorna antes do corte que lança o raio. O golpe elimina um brinquedo comum ou deixa o Urso com um coração. A troca de adversário e o carregamento preservam o consumo; uma nova tentativa completa renova o uso. A sequência reaproveita as poses da menina e acrescenta efeitos em Canvas.

### Close dramático do especial

O enquadramento da carga passou a usar um corte de anime centrado nos dois olhos, com expressão intensa e reflexos arco-íris, conforme a referência enviada. Uma ilustração frontal própria substitui a ampliação do sprite como foco da cena. O corte sai rapidamente antes do retorno à arena e do disparo.
