# Toy Room — Auditoria profunda de assinatura visual

Data: 6 de outubro de 2026. Escopo: versão atual da sala, incluindo a Correção 1 do transporte. **Somente auditoria; nenhum código, asset de jogo, escala, posição ou mecânica foi alterado.**

## Diagnóstico

**Assinatura artística global: D — precisa revisão.** A sala combina ilustrações finais convincentes com móveis e brinquedos geométricos, uma fada vetorial simples e interface procedural sem a mesma linguagem material. A melhoria do apoio manual não conclui a refatoração artística dos objetos.

A inspeção desta vez incluiu a aplicação real com os controles HTML, estados de proximidade, joystick ativo, coleta, transporte, introdução, armazenamento preparado e vitória. Isso revelou problemas que a vista estática da sala não mostrava: contador coberto, textos cortados no retrato, círculos técnicos da área de toque, feedback do baú ausente na rota ilustrada e discrepância entre brinquedos decorativos bem acabados e coletáveis simplificados.

As sete referências obrigatórias foram conferidas: Ursinho Pipoca, Trenzinho Real a Vapor, baú, mesa redonda, porta verde principal, tapete central e piso de madeira. Seus materiais pintados, volume, textura e iluminação constituem o padrão usado em todas as comparações.

Não há medição com jogadores novos ou crianças. As notas de reconhecimento são estimativas de inspeção visual; não demonstram tempo de identificação inferior a um segundo.

## Evidências e método

- [Sala completa atual](sala-completa.png): visão de todos os objetos no mundo, com câmera de auditoria, sem mudar coordenadas dos assets.
- [Aplicação real](aplicacao-real.png) e [pausa real](pausa-real.png): incluem os controles HTML que não aparecem nas capturas isoladas de Canvas.
- [Detalhes decorativos](detalhes-decorativos.png): ampliações dos recortes existentes e amostras na escala de jogo; não são novos assets.
- [Seleção e joystick](joystick-pegar.png), [guardar e joystick em retrato](joystick-guardar.png), [efeitos e movimento](movimento-efeitos.png).
- Introdução [desktop](intro-desktop.png)/[retrato](intro-retrato.png), vitória [desktop](vitoria-desktop.png)/[retrato](vitoria-retrato.png), [modal global](download-modal.png).
- [Origem e estado em execução](inventario-runtime.json), [controles da aplicação](aplicacao.json), [inventário estruturado](inventario.json).
- O transporte dos oito itens também foi confrontado com a [matriz atual de estados](../toy-room-etapa2/correcao1/estados-depois.png). Não se reutilizou a antiga apresentação sobre o rosto como se ainda estivesse ativa.

A instância temporária de auditoria prepara alguns estados para observar camadas transitórias. A aplicação real foi capturada separadamente. São evidências de renderização, não um novo playtest integral de gameplay. Não foram alterados saves do usuário; a navegação ocorreu em perfil de Chrome de teste.

Código consultado: `RoomEnvironmentRenderer.js` (arquitetura, piso, sombras e móveis), `ToyRenderer.js` (oito brinquedos e seleção), `ToyRoomEntities.js` (personagem/fada), `ToyCarryPresentation.js` (transporte), `ToyRoomUI.js` (HUD/controles/faixas), `ToyRoomPhase.js` (instâncias e efeitos), `assets/manifest.json`, `index.html`, `src/css/styles.css`, `main.js` e `game.js` (camadas globais).

## Como ler o inventário

**Origem:** A = raster ilustrado que corresponde ao caminho de arte final; B = SVG; C = Canvas procedural; D = formas geométricas simples, em Canvas ou CSS; E = placeholder explicitamente identificado como recurso temporário; F = recurso gráfico individual não identificado. Combinações indicam composição de origens. A não significa aprovação definitiva de todo raster. Os objetos com aparência de placeholder, mas feitos por geometria conhecida, têm origem D e nota E; não se presume a intenção histórica de quem os desenhou.

Os glifos/emoji de plataforma usam F porque não foi identificado um asset gráfico próprio que controle sua aparência. O mecanismo é conhecido: fonte do sistema. Controles HTML/CSS têm origem D quando a aparência vem de discos, gradientes e molduras, sem fingir que são desenhados por Canvas.

**Critérios T/V/M/L/F/S:** textura, volume, material reconhecível, iluminação integrada, acabamento consistente, pertencimento à Toy Room. S = sim; P = parcial; N = não; — = não aplicável. Material e volume não são exigências literais para texto ou luz. A pergunta “mesma equipe?” compara o acabamento isolado com Ursinho/Trem/baú/tapete; por isso um efeito procedural aceitável pode receber NÃO nessa comparação literal sem ter que ser removido.

**Nota artística:** A excelente; B bom; C aceitável, ainda abaixo do alvo; D precisa revisão; E deve ser substituído. **Legibilidade O/F:** nota de identificação do objeto / nota de entendimento de função e interatividade (A instantâneo, B rápido, C aceitável, D ambíguo, E incompreensível). Decoração e coletáveis podem ter objeto A e função D.

Cada linha representa um elemento ou componente visual com avaliação própria, não cada chamada de desenho nem cada instância de partícula. Todas as instâncias equivalentes são explicitadas; os estados alternativos dos botões e personagens aparecem separadamente. Sombras e efeitos não foram ocultados dentro da nota do objeto.

Inventário: **87 entradas**. Distribuição artística: A: 7, B: 16, C: 11, D: 40, E: 13. Os totais incluem componentes e relações de composição; não representam essa quantidade de arquivos distintos.

### Arquitetura e cenário

| ID / elemento | Origem | Nota | T/V/M/L/F/S | Mesma equipe? | Legibilidade O/F | Localização | Problema / função | Prioridade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| V01 — Piso de madeira ilustrado | A | A | S/S/S/S/S/S | SIM | A/A | Mundo: y=240–1200 | Superfície navegável; veios e material correspondem à referência oficial. Conservar a ilustração. | BAIXO |
| V02 — Faixas de perspectiva e sombreado do piso | C | C | N/P/P/P/P/S | NÃO | B/A | 18 bandas no piso | Integração: repetição em bandas e emendas horizontais podem expor montagem; material vem do raster, não do sombreado. Refinamento de composição, sem substituir o piso. | BAIXO |
| V03 — Papel de parede floral | A | B | S/P/S/P/S/S | SIM | A/A | x=54–1546; y=54–240 | Decoração arquitetônica; textura e paleta integradas. Repetição regular perceptível, sem aparência de placeholder. | BAIXO |
| V04 — Moldura de carvalho periférica | A | B | S/S/S/P/S/S | SIM | A/A | Perímetro de 54 px | Madeira ilustrada; repetição de módulos e cantos são um limite de montagem, não um problema grave de assinatura. | BAIXO |
| V05 — Friso superior | A | B | S/P/S/P/S/S | SIM | B/A | x=54; y=74; h=9 | Acabamento arquitetônico; detalhe reduzido pela faixa estreita. Não é régua de colisão. | BAIXO |
| V06 — Rodapé da parede | A | B | S/P/S/P/S/S | SIM | B/A | x=54; y=231; h=9 | Junção parede/piso; acabamento coerente, sem necessidade de refazer nesta auditoria. | BAIXO |
| V07 — Janela esquerda: arco, madeira e vidro | A | B | S/S/S/P/S/S | SIM | A/A | (520,30), 160×170 | Ilustração com material identificável; perspectiva simplificada mas compatível. | BAIXO |
| V08 — Janela direita: arco, madeira e vidro | A | B | S/S/S/P/S/S | SIM | A/A | (1280,30), 160×170 | Repetição da janela esquerda; pertence à família corrigida, sem defeito independente grave. | BAIXO |
| V09 — Cortinas esquerda e direita | A | B | S/S/S/P/S/S | SIM | A/A | Integradas aos dois sprites de janela | Tecido com pregas; mesmo recorte da janela. Duas ocorrências, ambas inventariadas. | BAIXO |
| V10 — Feixes solares das duas janelas | C | D | N/P/—/P/N/P | NÃO | B/B | Polígonos de (wx+10,wy+160) até (wx−260,wy+640) | Iluminação: planos amarelos com bordas retas, sem interação com volumes; parecem camadas gráficas sobre o piso. Exigem acabamento de efeito, não troca da janela. | MÉDIO |
| V11 — Porta verde principal e moldura | A | A | S/S/S/S/S/S | SIM | A/C | (50,550), 88×136 | Entrada visual, não saída acionável neste controlador. Arte referência; função interativa é menos clara que a identidade de porta. | BAIXO |
| V12 — Tapete central: anéis, franjas e ornamento solar | A | A | S/S/S/S/S/S | SIM | A/A | (650,555), 300×255 | Referência oficial; material tecido e silhueta claros. Conservar. | BAIXO |
| V13 — Tapete oval floral | A | B | S/S/S/P/S/S | SIM | A/A | ≈(1173.5,518.5), 263×163 | Tecido ilustrado coerente; ornamentação mais fina que o tapete central, ainda dentro da família. | BAIXO |
| V14 — Tapete retangular e franjas | A | B | S/S/S/P/S/S | SIM | A/A | (280,914), 180×132 | Tecido ilustrado; sobreposição com trilhos e poltrona dificulta bordas em alguns pontos, sem invalidar o asset. | BAIXO |
| V15 — Sombra do tapete oval | D | D | N/N/—/N/N/P | NÃO | C/A | Elipse sob o tapete oval | Sombra: carimbo escuro rígido, não acompanha trama nem espessura do tecido; iluminação não compartilha o tratamento pintado. | MÉDIO |
| V16 — Sombra do tapete retangular | D | D | N/N/—/N/N/P | NÃO | C/A | Retângulo (276,916), 188×128 | Sombra: placa retangular uniforme, borda dura e deslocamento de aparência artificial sob tecido ilustrado. | MÉDIO |
| V17 — Trilhos de madeira ilustrados | A+C | B | S/S/S/P/S/S | SIM | A/C | Circuito entre x≈308–992 e y≈408–1052 | Peças ilustradas montadas em caminho. Circuito decorativo, não trilho funcional do trem; a expectativa de interação merece clareza. | BAIXO |
| V18 — Sombra contínua do circuito | C | C | N/P/—/P/P/S | NÃO | B/A | Stroke sob o circuito de trilhos | Ajuda a assentar a madeira, mas espessura/opacidade uniformes revelam o traçado. Refinamento secundário. | BAIXO |

### Móveis e seus componentes visíveis

| ID / elemento | Origem | Nota | T/V/M/L/F/S | Mesma equipe? | Legibilidade O/F | Localização | Problema / função | Prioridade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| V19 — Baú de brinquedos: tampa, painel, fechadura e pés | A | A | S/S/S/S/S/S | SIM | A/C | (1040,190), desenho 198×137 | Destino de armazenamento. Referência de arte; falta feedback visual próprio da tampa e do alvo no caminho ilustrado, detalhado fora do inventário de renderização. | MÉDIO |
| V20 — Mesa redonda: tampo, estrutura e material | A | A | S/S/S/S/S/S | SIM | A/A | (620,780), desenho 168×138 | Móvel decorativo/obstáculo com madeira pintada clara. Conservar. | BAIXO |
| V21 — Sombra adicional da mesa | D | D | N/N/—/N/N/P | NÃO | C/A | Elipse sob o tampo, próxima a (700,888) | Carimbo adicional sobre asset que já possui sombra; produz área escura espessa e tratamento diferente dos demais objetos finais. | MÉDIO |
| V22 — Estante: caixa externa e fundo | D | E | N/N/P/N/N/N | NÃO | B/C | (380,170), 220×90 | Móvel/obstáculo: dois retângulos chapados sem prateleiras, espessura, veios ou perspectiva. Parece diagrama de estante, não madeira da mesma coleção do baú. | ALTO |
| V23 — Livros da estante | D | E | N/N/N/N/N/N | NÃO | C/C | Retângulos coloridos no interior da estante | Decoração: lombadas são barras saturadas sem capa, papel, lombada ou sombra. São componentes próprios do placeholder da estante. | ALTO |
| V24 — Poltrona vermelha: corpo, placa amarela e disco azul | D | E | N/N/N/N/N/N | NÃO | D/C | (180,840); silhueta inicia em y≈815 | Móvel/obstáculo: arco, bloco e círculo não mostram encosto, assento, braços ou tecido. Parece símbolo genérico, em contraste direto com o baú vermelho ilustrado. | CRÍTICO |
| V25 — Castelo de blocos: corpo e telhados | D | E | N/N/N/N/N/N | NÃO | C/C | (1240,800), 220×170 | Obstáculo decorativo: retângulo laranja e triângulos puros, sem blocos, encaixes ou madeira. Grande massa chapada domina o quadrante inferior direito. | ALTO |
| V26 — Ameias verdes do castelo | D | E | N/N/N/N/N/N | NÃO | D/C | Pequenos retângulos no topo do castelo | Decoração estrutural: barras isoladas não comunicam torres ou blocos; reforçam a aparência de desenho temporário do castelo. | ALTO |
| V27 — Cavalinho de balanço: elipse e arco | D | E | N/N/N/N/N/N | NÃO | E/C | (480,420), configuração 100×80 | Obstáculo: não há cabeça, pescoço, patas ou estrutura de madeira. Identidade incompreensível sem o identificador do código. | CRÍTICO |
| V28 — Armário: corpo e duas portas | D | E | N/N/P/N/N/N | NÃO | B/C | (740,170), 140×90 | Móvel/obstáculo: retângulos sem espessura, tábuas ou molduras; madeira apenas sugerida pela cor marrom. Incompatível com o baú. | ALTO |
| V29 — Puxadores do armário | D | D | N/N/P/N/N/P | NÃO | B/C | Dois círculos amarelos no armário | Detalhe: pontos sem metal, brilho localizado ou encaixe; deve ser integrado ao redesenho do armário, não tratado como peça pronta. | MÉDIO |
| V30 — Sombras de estante, poltrona, castelo, cavalinho e armário | D | D | N/N/—/N/N/P | NÃO | C/A | Cinco elipses nas bases dos móveis | Carimbos idênticos para formas e materiais diferentes, sem penumbra ou direção comum. Não compensam a ausência de volume dos móveis. | MÉDIO |

### Brinquedos e decoração pequena

| ID / elemento | Origem | Nota | T/V/M/L/F/S | Mesma equipe? | Legibilidade O/F | Localização | Problema / função | Prioridade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| V31 — Ursinho Pipoca | A | A | S/S/S/S/S/S | SIM | A/C | (340,480); desenho 64×90 | Coletável; pelúcia e expressão claras, referência oficial. A interação fica explícita principalmente pela indicação de proximidade. | BAIXO |
| V32 — Trenzinho Real a Vapor | A | A | S/S/S/S/S/S | SIM | A/C | (760,520); desenho 84×64 | Coletável; madeira e locomotiva claras. O posicionamento fora do trilho pode sugerir trem funcional, mas a missão explica armazenamento. | BAIXO |
| V33 — Robô Estelar Faísca | D | E | N/N/P/N/N/N | NÃO | B/C | (1140,540) | Coletável: retângulos ciano, barra amarela, antena e disco vermelho; nenhuma junta, metal ou acabamento. Identidade de robô não basta para validar a arte. | ALTO |
| V34 — Coelhinho de Algodão | D | E | N/N/N/N/N/N | NÃO | A/C | (460,980) | Coletável: orelhas tornam a espécie clara, mas círculos/elipses rosa não mostram pelúcia, patas, volume ou costura. Placeholder ao lado do Ursinho. | CRÍTICO |
| V35 — Patinho de Banho Imperial | D | D | N/N/P/N/N/P | NÃO | A/C | (940,840) | Coletável: silhueta clara, porém ausência de olho e relevo, borracha sem brilho e detalhe superior ambíguo. Exige reconstrução de acabamento. | ALTO |
| V36 — Torre de Blocos Coloridos | D | E | N/N/N/N/N/N | NÃO | B/C | (1180,720) | Coletável: faixas retangulares e triângulo, sem espessura, quinas ou madeira. Os cubos decorativos raster da mesma sala já demonstram um padrão superior. | ALTO |
| V37 — Tamborzinho Encantado | D | D | N/P/P/N/N/P | NÃO | B/C | (640,960) | Coletável: cilindro sugerido por elipses e linhas; faltam couro, madeira/metal, amarrações e iluminação. Leitura melhor que acabamento. | ALTO |
| V38 — Caixinha de Surpresa da Fada | D | E | N/N/N/N/N/N | NÃO | D/C | (880,360) | Coletável: quadrado roxo, losango, zigue-zague e bola rosa não mostram palhaço, caixa materializada ou mola com volume. Mistura de ícones. | ALTO |
| V39 — Sombras dos oito brinquedos no chão | D | D | N/N/—/N/N/P | NÃO | C/A | Elipses sob cada coletável | Dimensões baseadas em w/h lógicos, não no recorte ilustrado: Ursinho 64 px de largura recebe elipse de aproximadamente 48 px. Carimbos planos não formam família de sombras pintadas. A âncora também vem do h lógico: Ursinho recebe sombra em y=501, mas o desenho chega a y=532; trem recebe sombra em y=536, enquanto o recorte chega a y=554. | MÉDIO |
| V40 — Cubo azul decorativo | A | B | S/S/S/S/S/S | SIM | A/D | (1350,470), 34×34 | Decoração não coletável com material e volume; visualmente também é brinquedo. Falta diferenciação de papel em relação aos oito itens da missão. | MÉDIO |
| V41 — Bloco/arco vermelho decorativo | A | B | S/S/S/S/S/S | SIM | B/D | (1430,615), 42×34 | Decoração não coletável; ilustração superior aos blocos coletáveis. Pequena escala torna a peça menos imediata, mas não é geometria Canvas. | MÉDIO |
| V42 — Bola listrada decorativa | A | B | S/S/S/S/S/S | SIM | A/D | (1180,930), 42×44 | Brinquedo ilustrado sem coleta; ausência de indicação permanente de papel gera expectativa de pegar, diferente do patinho simplificado que é interativo. | MÉDIO |
| V43 — Livro com ursinho na capa | A | B | S/S/S/S/S/S | SIM | A/D | (220,520), 54×52 | Decoração no piso, com capa e volume. Parece item de missão, mas não é coletável. Arte boa; papel visual precisa revisão. | MÉDIO |

### Personagens e apresentação dos carregáveis

| ID / elemento | Origem | Nota | T/V/M/L/F/S | Mesma equipe? | Legibilidade O/F | Localização | Problema / função | Prioridade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| V44 — Protagonista: pose parada do atlas oficial | A | B | S/S/S/P/S/S | SIM | A/A | Posição inicial (280,640), altura visual ≈80 | Personagem ilustrada; recorte de baixa resolução é mais suave/borrado que móveis. A identidade pertence à sala, sem placeholder. | BAIXO |
| V45 — Protagonista: nove quadros de movimento | A | B | S/S/S/P/S/S | SIM | A/A | Atlas official-character, estado run | Movimento com desenho ilustrado consistente; segue a convenção lateral existente, não possui vistas próprias para cima/baixo nesta sala. | BAIXO |
| V46 — Pose ilustrada de transporte | A | C | S/S/S/P/P/P | NÃO | A/A | carry-pose-v1.png, altura visual 80 | Desenho mais nítido e detalhado que o atlas original; mesma identidade geral, mas acabamento e roupa não são reprodução exata quadro a quadro. A troca de pose mostra uma segunda fonte de arte. | MÉDIO |
| V47 — Composição de braços, dedos e pernas no transporte | A+C | C | P/P/P/P/P/P | NÃO | B/B | Recortes e extensão de 4 px nos antebraços | Contato manual melhorou; pernas oficiais e tronco novo possuem reamostragem distinta, recortes rígidos e apoio estático. Apoio das mãos isoladamente B; assinatura global da montagem C. | MÉDIO |
| V48 — Escala e troca chão/mãos dos oito brinquedos | A+D | D | P/P/P/P/N/P | NÃO | C/B | Escalas de 0,32 a 0,65 no transporte | Mesmo objeto muda instantaneamente de tamanho: Ursinho 64×90 → ≈20,5×28,8; trem 84×64 → 33,6×25,6. Resolve o rosto, mas enfraquece escala material e legibilidade dos detalhes em movimento. | ALTO |
| V49 — Fada: corpo, cabeça, vestido, asas e varinha | B | E | N/N/P/P/N/N | NÃO | B/C | fairy.svg, desenho 60×60, próxima à protagonista | SVG de círculo, vestido triangular e asas de traço; cabeça sem rosto e vestido sem tecido. Acompanhante permanente com assinatura vetorial incompatível com a menina pintada. | ALTO |
| V50 — Aura da fada integrada ao SVG | B | D | N/P/—/P/N/P | NÃO | B/C | Círculo radial atrás da fada | Gradiente circular simples, sem desenho de luz ou partículas integradas ao corpo. Suaviza a silhueta e parece efeito genérico de interface. | MÉDIO |
| V51 — Composição fada/cabeça da protagonista | A+B | D | P/P/P/P/N/P | NÃO | D/C | Fada segue x≈player.x±24, y≈player.y−32 | Sobreposição frequente com cabelo/cabeça, inclusive na sala completa. A ordem de desenho coloca a fada sempre por cima; ruído focal permanece apesar da correção do transporte. | ALTO |

### Efeitos e indicadores em espaço de mundo

| ID / elemento | Origem | Nota | T/V/M/L/F/S | Mesma equipe? | Legibilidade O/F | Localização | Problema / função | Prioridade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| V52 — Poeira dourada solar: 45 partículas | D | C | N/N/—/P/P/S | NÃO | B/A | Distribuída pela sala | Círculos pequenos e discretos; atmosfera funcional. Não precisam virar sprites só por serem Canvas, mas poderiam ter distribuição orientada pelos feixes. | BAIXO |
| V53 — Poeira de passos | D | C | N/N/—/P/P/S | NÃO | B/B | Atrás dos pés em movimento | Círculos que crescem e desaparecem; leitura de puff aceitável, sem desenho de poeira. Refinamento secundário, não substituição obrigatória. | BAIXO |
| V54 — Rastro da fada | D | D | N/N/—/P/N/P | NÃO | C/B | Círculos amarelos perto da fada | Mais bolinhas que magia ilustrada; soma brilho ao foco da protagonista e perde hierarquia. Requer desenho de efeito e densidade artística. | MÉDIO |
| V55 — Faíscas azuis ao coletar | D | D | N/N/—/N/N/P | NÃO | C/B | spawnSparkles(player.x, player.y−30) | Discos ciano saturados sobre o rosto sem núcleo/raio ou relação com a luz quente; aparência de marcador de teste, não faísca pintada. | ALTO |
| V56 — Faíscas douradas ao soltar/guardar | D | C | N/N/—/P/P/S | NÃO | B/B | Ponto de soltura ou baú | Discos claros que desaparecem; paleta coerente, mas sem desenho de faísca. Melhorar acabamento sem necessidade de eliminar a técnica procedural. | BAIXO |
| V57 — Confetes | D | C | N/N/P/P/P/S | NÃO | A/B | Guardar e comemoração | Retângulos giratórios reconhecíveis como papel; função clara. Saturação e variedade não são refinadas, mas o caráter geométrico é adequado a confete. | BAIXO |
| V58 — Aura de proximidade dos coletáveis | C | D | N/N/—/N/N/P | NÃO | B/B | Círculo de raio 30±4 px ao aproximar | Anel amarelo fino parece seleção de editor/UI no chão, não encantamento. Raio comum ignora a silhueta do Ursinho e do Trem. | ALTO |
| V59 — Placa flutuante ▼ PEGAR | C | D | N/N/—/N/N/P | NÃO | A/A | Acima de cada coletável próximo, ty−42 | Retângulo roxo com linha amarela e texto pequeno: rótulo técnico sobre arte final. Pode competir com o botão de ação e com o topo do brinquedo. | ALTO |
| V60 — Triângulo/símbolo ▼ do indicador | C | D | N/N/—/N/N/P | NÃO | A/B | Dentro da placa PEGAR | Glifo funcional sem ícone ilustrado próprio; parte da mesma placa, sem tratamento de coleção. | MÉDIO |

### HUD, controles e sobreposições

| ID / elemento | Origem | Nota | T/V/M/L/F/S | Mesma equipe? | Legibilidade O/F | Localização | Problema / função | Prioridade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| V61 — Card de progresso: fundo e moldura | C | D | N/P/—/P/N/P | NÃO | A/A | Tela: canto superior direito, 220×46 | RoundRect escuro translúcido e linha amarela não seguem madeira/tecido/metal do ambiente. Parece painel de protótipo com paleta parcialmente compatível. | ALTO |
| V62 — Texto e contador de brinquedos | C | D | N/—/—/—/N/P | NÃO | D/A | Dentro do card, início x+16 | Texto medido em ≈209,4 px para área útil de 188 px. Invade a margem direita; controles HTML também o encobrem. Identidade de contador clara, número não é confiavelmente legível. | CRÍTICO |
| V63 — Emoji de ursinho do contador | F | D | P/P/P/P/N/P | NÃO | A/B | Início do texto do card | Glifo de emoji do sistema, sem asset próprio identificado. Renderização varia por plataforma e difere do Ursinho Pipoca. | MÉDIO |
| V64 — Barra de progresso: trilho e preenchimento | D | D | N/N/—/N/N/P | NÃO | A/A | Card: 188×8, verde esmeralda | Dois retângulos sem acabamento; verde digital não tem moldura ilustrada nem relação material com o baú. Funcional, mas abaixo da assinatura premium. | MÉDIO |
| V65 — Joystick: base e aura | C | D | N/P/—/P/N/P | NÃO | A/A | Ponto inicial do toque, raio 56 | Disco escuro com gradiente básico e aro amarelo; estética de controle genérico, não de brinquedo/material pintado. | MÉDIO |
| V66 — Joystick: marcas de oito direções | C | D | N/N/—/N/N/P | NÃO | B/A | Oito traços entre raios 46 e 56 | Marcas de instrumento técnico; lembram régua de depuração. Revisão de acabamento, sem mudar controle ou área de toque. | MÉDIO |
| V67 — Joystick: alavanca e sua sombra | C | D | N/P/P/P/N/P | NÃO | A/A | Disco de raio 24, branco/âmbar | Gradiente simula esfera, mas não fornece textura/metal reconhecível. Contorno branco e sombra circular dão assinatura de widget. | MÉDIO |
| V68 — Botão PEGAR | C | D | N/P/P/P/N/P | NÃO | A/A | Tela: width−85,height−85, raio 48 | Círculo com gradiente amarelo e contorno branco; ícone/subtexto TOQUE aparecem também no desktop. Necessita acabamento da coleção, preservando contraste. | ALTO |
| V69 — Botão SOLTAR | C | D | N/P/P/P/N/P | NÃO | A/A | Mesma posição; estado carregando | Gradiente verde e branco de aplicativo; difere materialmente do botão PEGAR e do baú, embora a ação seja clara. | ALTO |
| V70 — Botão GUARDAR | C | D | N/P/P/P/N/P | NÃO | A/A | Mesma posição; perto do baú carregando | Gradiente azul com subtexto/emoji de presente; leitura funcional clara, assinatura genérica. A cor não conecta visualmente ao alvo pintado. | ALTO |
| V71 — Botão pressionado e sombra | C | C | N/P/—/P/P/P | NÃO | A/A | Raio muda de 48 para 42; sombra deslocada | Feedback de pressão compreensível; aparência circular digital pode herdar o redesenho do botão. Sem falha artística independente grave. | BAIXO |
| V72 — Pulso do botão de ação | C | D | N/N/—/N/N/P | NÃO | B/B | Anel de raio ≈btnRadius+8±5 | Mais um aro luminoso de interface, acumulado com a aura de seleção e a zona pontilhada. Excesso de contornos abstratos. | MÉDIO |
| V73 — Zona pontilhada do botão de ação | C | D | N/N/—/N/N/N | NÃO | D/C | Círculo de raio 78, tracejado 4/4 | Expõe representação visual da área ampla de toque durante o jogo, semelhante a overlay técnico. Não é hitbox física nem superfície de pulo; é área de interface. | ALTO |
| V74 — Textos e emojis dos botões de ação | C+F | D | N/—/—/—/N/P | NÃO | A/A | PEGAR/TOQUE, SOLTAR/NO CHÃO, GUARDAR/NO BAÚ | Textos são úteis; emojis de mão, caixa e presente não pertencem à família de brinquedos. Símbolos e fonte têm tratamento de UI genérica. | MÉDIO |
| V75 — Transição inicial clara | D | C | N/N/—/P/P/S | NÃO | B/B | FillRect sobre toda a tela, introAlpha | Fade simples e legível; efeito transitório adequado. Não é placeholder só por ser retângulo procedural. | BAIXO |
| V76 — Faixa de introdução: painel e moldura | C | D | N/N/—/N/N/P | NÃO | D/B | 520×58, centrada em y=80 | Painel roxo retangular sem arte própria; em tela de 390 px perde 65 px de cada lado. Texto central cortado torna a experiência de entrada incompleta. | ALTO |
| V77 — Título, instrução e emojis da introdução | C+F | D | N/—/—/—/N/P | NÃO | D/A | Duas linhas dentro da faixa | Texto explica missão, mas largura fixa corta início/fim no retrato. Ornamentos são glifos de brilho; sem composição tipográfica artística. | ALTO |
| V78 — Faixa de vitória: painel e moldura | C | D | N/N/—/N/N/P | NÃO | D/B | 560×140, centro da tela | Retângulo roxo com borda amarela; em tela de 390 px perde 85 px de cada lado, cobrindo protagonista e cortando conteúdo. | ALTO |
| V79 — Título, frases e emojis da vitória | C+F | D | N/—/—/—/N/P | NÃO | D/A | Três linhas na faixa de vitória | Hierarquia funcional no desktop; frases e título cortados no retrato. Celebração depende de emojis e moldura básica, distante do acabamento da sala. | ALTO |
| V80 — Controle global de pausa/continuar | D+F | D | N/P/—/P/N/P | NÃO | A/A | HTML: #btn-pause-toggle, topo direito | Círculo CSS escuro e emoji; recobre parte do contador Canvas. Forma de widget externo e conflito de camadas, não botão da coleção. | ALTO |
| V81 — Controle global de som/mudo | D+F | D | N/P/—/P/N/P | NÃO | A/A | HTML: #btn-sound-toggle, topo direito | Círculo CSS e emoji de alto-falante; também fica sobre o contador. Recurso claro, acabamento e composição incompatíveis. | ALTO |
| V82 — Controle global de download | D+F | D | N/P/—/P/N/N | NÃO | B/D | HTML: #btn-download-zip, topo direito | Ferramenta de projeto visível durante a sala, concorrendo com progresso. Glifo técnico e estilo escuro não contribuem para a fantasia da Toy Room. | ALTO |
| V83 — Brilho e pulso da pausa | D | D | N/P/—/P/N/P | NÃO | B/B | CSS .paused, box-shadow e animação | Glow de aplicativo em torno do círculo; estado é claro, assinatura ainda genérica. Sem faixa de pausa própria na Toy Room. | MÉDIO |
| V84 — Sobreposição controles globais/contador | C+D | E | N/—/—/—/N/N | NÃO | D/D | Mesma região superior direita, Canvas + HTML | Captura real confirma três botões sobre o texto do card. Camadas não possuem composição conjunta: problema crítico de legibilidade, não novo asset defeituoso. | CRÍTICO |
| V85 — Moldura externa do aplicativo e áreas escuras | D | C | N/P/—/P/P/P | NÃO | A/A | CSS #game-container e body | Arredondamento e bordas escuras de apresentação; discretos, porém assinatura de site/app. Não precisam substituir a arquitetura interna. | BAIXO |
| V86 — Modal global de download: fundo, painel, abas e textos | D+F | D | N/P/—/P/N/N | NÃO | B/A | Overlay HTML aberto pelo download | Painel técnico com instruções de instalação/ZIP e referências de ambiente externo. Não integra a fantasia da fase; pertence à ferramenta global, não ao cenário. | MÉDIO |
| V87 — Modal: ações de baixar, página, copiar e fechar | D+F | D | N/P/—/P/N/N | NÃO | B/A | Botões/links do modal: ZIP, baixar.html, copiar URL/curl, download direto, X e fechar | Estilos CSS de utilitário e glifos de plataforma; coerentes com ferramenta de download, não com a coleção artística da sala. Capturados e mantidos separados do inventário de brinquedos. | MÉDIO |

## Lista completa de notas E

- **V22 — Estante: caixa externa e fundo** (ALTO): Móvel/obstáculo: dois retângulos chapados sem prateleiras, espessura, veios ou perspectiva. Parece diagrama de estante, não madeira da mesma coleção do baú.
- **V23 — Livros da estante** (ALTO): Decoração: lombadas são barras saturadas sem capa, papel, lombada ou sombra. São componentes próprios do placeholder da estante.
- **V24 — Poltrona vermelha: corpo, placa amarela e disco azul** (CRÍTICO): Móvel/obstáculo: arco, bloco e círculo não mostram encosto, assento, braços ou tecido. Parece símbolo genérico, em contraste direto com o baú vermelho ilustrado.
- **V25 — Castelo de blocos: corpo e telhados** (ALTO): Obstáculo decorativo: retângulo laranja e triângulos puros, sem blocos, encaixes ou madeira. Grande massa chapada domina o quadrante inferior direito.
- **V26 — Ameias verdes do castelo** (ALTO): Decoração estrutural: barras isoladas não comunicam torres ou blocos; reforçam a aparência de desenho temporário do castelo.
- **V27 — Cavalinho de balanço: elipse e arco** (CRÍTICO): Obstáculo: não há cabeça, pescoço, patas ou estrutura de madeira. Identidade incompreensível sem o identificador do código.
- **V28 — Armário: corpo e duas portas** (ALTO): Móvel/obstáculo: retângulos sem espessura, tábuas ou molduras; madeira apenas sugerida pela cor marrom. Incompatível com o baú.
- **V33 — Robô Estelar Faísca** (ALTO): Coletável: retângulos ciano, barra amarela, antena e disco vermelho; nenhuma junta, metal ou acabamento. Identidade de robô não basta para validar a arte.
- **V34 — Coelhinho de Algodão** (CRÍTICO): Coletável: orelhas tornam a espécie clara, mas círculos/elipses rosa não mostram pelúcia, patas, volume ou costura. Placeholder ao lado do Ursinho.
- **V36 — Torre de Blocos Coloridos** (ALTO): Coletável: faixas retangulares e triângulo, sem espessura, quinas ou madeira. Os cubos decorativos raster da mesma sala já demonstram um padrão superior.
- **V38 — Caixinha de Surpresa da Fada** (ALTO): Coletável: quadrado roxo, losango, zigue-zague e bola rosa não mostram palhaço, caixa materializada ou mola com volume. Mistura de ícones.
- **V49 — Fada: corpo, cabeça, vestido, asas e varinha** (ALTO): SVG de círculo, vestido triangular e asas de traço; cabeça sem rosto e vestido sem tecido. Acompanhante permanente com assinatura vetorial incompatível com a menina pintada.
- **V84 — Sobreposição controles globais/contador** (CRÍTICO): Captura real confirma três botões sobre o texto do card. Camadas não possuem composição conjunta: problema crítico de legibilidade, não novo asset defeituoso.

Estante/livros e castelo/ameias são separados para evitar esconder os componentes chapados dentro do móvel. Não são quatro móveis diferentes. A sobreposição HUD/controles é E como composição, não um arquivo de imagem.

## Lista completa de notas D

- **V10 — Feixes solares das duas janelas** (MÉDIO): Iluminação: planos amarelos com bordas retas, sem interação com volumes; parecem camadas gráficas sobre o piso. Exigem acabamento de efeito, não troca da janela.
- **V15 — Sombra do tapete oval** (MÉDIO): Sombra: carimbo escuro rígido, não acompanha trama nem espessura do tecido; iluminação não compartilha o tratamento pintado.
- **V16 — Sombra do tapete retangular** (MÉDIO): Sombra: placa retangular uniforme, borda dura e deslocamento de aparência artificial sob tecido ilustrado.
- **V21 — Sombra adicional da mesa** (MÉDIO): Carimbo adicional sobre asset que já possui sombra; produz área escura espessa e tratamento diferente dos demais objetos finais.
- **V29 — Puxadores do armário** (MÉDIO): Detalhe: pontos sem metal, brilho localizado ou encaixe; deve ser integrado ao redesenho do armário, não tratado como peça pronta.
- **V30 — Sombras de estante, poltrona, castelo, cavalinho e armário** (MÉDIO): Carimbos idênticos para formas e materiais diferentes, sem penumbra ou direção comum. Não compensam a ausência de volume dos móveis.
- **V35 — Patinho de Banho Imperial** (ALTO): Coletável: silhueta clara, porém ausência de olho e relevo, borracha sem brilho e detalhe superior ambíguo. Exige reconstrução de acabamento.
- **V37 — Tamborzinho Encantado** (ALTO): Coletável: cilindro sugerido por elipses e linhas; faltam couro, madeira/metal, amarrações e iluminação. Leitura melhor que acabamento.
- **V39 — Sombras dos oito brinquedos no chão** (MÉDIO): Dimensões baseadas em w/h lógicos, não no recorte ilustrado: Ursinho 64 px de largura recebe elipse de aproximadamente 48 px. Carimbos planos não formam família de sombras pintadas. A âncora também vem do h lógico: Ursinho recebe sombra em y=501, mas o desenho chega a y=532; trem recebe sombra em y=536, enquanto o recorte chega a y=554.
- **V48 — Escala e troca chão/mãos dos oito brinquedos** (ALTO): Mesmo objeto muda instantaneamente de tamanho: Ursinho 64×90 → ≈20,5×28,8; trem 84×64 → 33,6×25,6. Resolve o rosto, mas enfraquece escala material e legibilidade dos detalhes em movimento.
- **V50 — Aura da fada integrada ao SVG** (MÉDIO): Gradiente circular simples, sem desenho de luz ou partículas integradas ao corpo. Suaviza a silhueta e parece efeito genérico de interface.
- **V51 — Composição fada/cabeça da protagonista** (ALTO): Sobreposição frequente com cabelo/cabeça, inclusive na sala completa. A ordem de desenho coloca a fada sempre por cima; ruído focal permanece apesar da correção do transporte.
- **V54 — Rastro da fada** (MÉDIO): Mais bolinhas que magia ilustrada; soma brilho ao foco da protagonista e perde hierarquia. Requer desenho de efeito e densidade artística.
- **V55 — Faíscas azuis ao coletar** (ALTO): Discos ciano saturados sobre o rosto sem núcleo/raio ou relação com a luz quente; aparência de marcador de teste, não faísca pintada.
- **V58 — Aura de proximidade dos coletáveis** (ALTO): Anel amarelo fino parece seleção de editor/UI no chão, não encantamento. Raio comum ignora a silhueta do Ursinho e do Trem.
- **V59 — Placa flutuante ▼ PEGAR** (ALTO): Retângulo roxo com linha amarela e texto pequeno: rótulo técnico sobre arte final. Pode competir com o botão de ação e com o topo do brinquedo.
- **V60 — Triângulo/símbolo ▼ do indicador** (MÉDIO): Glifo funcional sem ícone ilustrado próprio; parte da mesma placa, sem tratamento de coleção.
- **V61 — Card de progresso: fundo e moldura** (ALTO): RoundRect escuro translúcido e linha amarela não seguem madeira/tecido/metal do ambiente. Parece painel de protótipo com paleta parcialmente compatível.
- **V62 — Texto e contador de brinquedos** (CRÍTICO): Texto medido em ≈209,4 px para área útil de 188 px. Invade a margem direita; controles HTML também o encobrem. Identidade de contador clara, número não é confiavelmente legível.
- **V63 — Emoji de ursinho do contador** (MÉDIO): Glifo de emoji do sistema, sem asset próprio identificado. Renderização varia por plataforma e difere do Ursinho Pipoca.
- **V64 — Barra de progresso: trilho e preenchimento** (MÉDIO): Dois retângulos sem acabamento; verde digital não tem moldura ilustrada nem relação material com o baú. Funcional, mas abaixo da assinatura premium.
- **V65 — Joystick: base e aura** (MÉDIO): Disco escuro com gradiente básico e aro amarelo; estética de controle genérico, não de brinquedo/material pintado.
- **V66 — Joystick: marcas de oito direções** (MÉDIO): Marcas de instrumento técnico; lembram régua de depuração. Revisão de acabamento, sem mudar controle ou área de toque.
- **V67 — Joystick: alavanca e sua sombra** (MÉDIO): Gradiente simula esfera, mas não fornece textura/metal reconhecível. Contorno branco e sombra circular dão assinatura de widget.
- **V68 — Botão PEGAR** (ALTO): Círculo com gradiente amarelo e contorno branco; ícone/subtexto TOQUE aparecem também no desktop. Necessita acabamento da coleção, preservando contraste.
- **V69 — Botão SOLTAR** (ALTO): Gradiente verde e branco de aplicativo; difere materialmente do botão PEGAR e do baú, embora a ação seja clara.
- **V70 — Botão GUARDAR** (ALTO): Gradiente azul com subtexto/emoji de presente; leitura funcional clara, assinatura genérica. A cor não conecta visualmente ao alvo pintado.
- **V72 — Pulso do botão de ação** (MÉDIO): Mais um aro luminoso de interface, acumulado com a aura de seleção e a zona pontilhada. Excesso de contornos abstratos.
- **V73 — Zona pontilhada do botão de ação** (ALTO): Expõe representação visual da área ampla de toque durante o jogo, semelhante a overlay técnico. Não é hitbox física nem superfície de pulo; é área de interface.
- **V74 — Textos e emojis dos botões de ação** (MÉDIO): Textos são úteis; emojis de mão, caixa e presente não pertencem à família de brinquedos. Símbolos e fonte têm tratamento de UI genérica.
- **V76 — Faixa de introdução: painel e moldura** (ALTO): Painel roxo retangular sem arte própria; em tela de 390 px perde 65 px de cada lado. Texto central cortado torna a experiência de entrada incompleta.
- **V77 — Título, instrução e emojis da introdução** (ALTO): Texto explica missão, mas largura fixa corta início/fim no retrato. Ornamentos são glifos de brilho; sem composição tipográfica artística.
- **V78 — Faixa de vitória: painel e moldura** (ALTO): Retângulo roxo com borda amarela; em tela de 390 px perde 85 px de cada lado, cobrindo protagonista e cortando conteúdo.
- **V79 — Título, frases e emojis da vitória** (ALTO): Hierarquia funcional no desktop; frases e título cortados no retrato. Celebração depende de emojis e moldura básica, distante do acabamento da sala.
- **V80 — Controle global de pausa/continuar** (ALTO): Círculo CSS escuro e emoji; recobre parte do contador Canvas. Forma de widget externo e conflito de camadas, não botão da coleção.
- **V81 — Controle global de som/mudo** (ALTO): Círculo CSS e emoji de alto-falante; também fica sobre o contador. Recurso claro, acabamento e composição incompatíveis.
- **V82 — Controle global de download** (ALTO): Ferramenta de projeto visível durante a sala, concorrendo com progresso. Glifo técnico e estilo escuro não contribuem para a fantasia da Toy Room.
- **V83 — Brilho e pulso da pausa** (MÉDIO): Glow de aplicativo em torno do círculo; estado é claro, assinatura ainda genérica. Sem faixa de pausa própria na Toy Room.
- **V86 — Modal global de download: fundo, painel, abas e textos** (MÉDIO): Painel técnico com instruções de instalação/ZIP e referências de ambiente externo. Não integra a fantasia da fase; pertence à ferramenta global, não ao cenário.
- **V87 — Modal: ações de baixar, página, copiar e fechar** (MÉDIO): Estilos CSS de utilitário e glifos de plataforma; coerentes com ferramenta de download, não com a coleção artística da sala. Capturados e mantidos separados do inventário de brinquedos.

## Canvas: ocorrências, localização, função e impacto

Esta lista considera desenho efetivo de formas, sombras, texto e gradientes. `drawImage()` de um raster em Canvas não transforma esse asset em placeholder. Composição de trilhos e sprites ilustrados é tratada separadamente.

| Elemento | Localização | Função / impacto | Gravidade | Encaminhamento artístico |
| --- | --- | --- | --- | --- |
| V02 — Faixas de perspectiva e sombreado do piso | 18 bandas no piso | Integração: repetição em bandas e emendas horizontais podem expor montagem; material vem do raster, não do sombreado. Refinamento de composição, sem substituir o piso. | BAIXO | Refinamento opcional; substituição por bitmap não obrigatória. |
| V10 — Feixes solares das duas janelas | Polígonos de (wx+10,wy+160) até (wx−260,wy+640) | Iluminação: planos amarelos com bordas retas, sem interação com volumes; parecem camadas gráficas sobre o piso. Exigem acabamento de efeito, não troca da janela. | MÉDIO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V15 — Sombra do tapete oval | Elipse sob o tapete oval | Sombra: carimbo escuro rígido, não acompanha trama nem espessura do tecido; iluminação não compartilha o tratamento pintado. | MÉDIO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V16 — Sombra do tapete retangular | Retângulo (276,916), 188×128 | Sombra: placa retangular uniforme, borda dura e deslocamento de aparência artificial sob tecido ilustrado. | MÉDIO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V17 — Trilhos de madeira ilustrados | Circuito entre x≈308–992 e y≈408–1052 | Peças ilustradas montadas em caminho. Circuito decorativo, não trilho funcional do trem; a expectativa de interação merece clareza. | BAIXO | Refinamento opcional; substituição por bitmap não obrigatória. |
| V18 — Sombra contínua do circuito | Stroke sob o circuito de trilhos | Ajuda a assentar a madeira, mas espessura/opacidade uniformes revelam o traçado. Refinamento secundário. | BAIXO | Refinamento opcional; substituição por bitmap não obrigatória. |
| V21 — Sombra adicional da mesa | Elipse sob o tampo, próxima a (700,888) | Carimbo adicional sobre asset que já possui sombra; produz área escura espessa e tratamento diferente dos demais objetos finais. | MÉDIO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V22 — Estante: caixa externa e fundo | (380,170), 220×90 | Móvel/obstáculo: dois retângulos chapados sem prateleiras, espessura, veios ou perspectiva. Parece diagrama de estante, não madeira da mesma coleção do baú. | ALTO | Refazer a forma como arte final ilustrada. |
| V23 — Livros da estante | Retângulos coloridos no interior da estante | Decoração: lombadas são barras saturadas sem capa, papel, lombada ou sombra. São componentes próprios do placeholder da estante. | ALTO | Integrar ao redesenho ilustrado do móvel correspondente. |
| V24 — Poltrona vermelha: corpo, placa amarela e disco azul | (180,840); silhueta inicia em y≈815 | Móvel/obstáculo: arco, bloco e círculo não mostram encosto, assento, braços ou tecido. Parece símbolo genérico, em contraste direto com o baú vermelho ilustrado. | CRÍTICO | Refazer a forma como arte final ilustrada. |
| V25 — Castelo de blocos: corpo e telhados | (1240,800), 220×170 | Obstáculo decorativo: retângulo laranja e triângulos puros, sem blocos, encaixes ou madeira. Grande massa chapada domina o quadrante inferior direito. | ALTO | Refazer a forma como arte final ilustrada. |
| V26 — Ameias verdes do castelo | Pequenos retângulos no topo do castelo | Decoração estrutural: barras isoladas não comunicam torres ou blocos; reforçam a aparência de desenho temporário do castelo. | ALTO | Integrar ao redesenho ilustrado do móvel correspondente. |
| V27 — Cavalinho de balanço: elipse e arco | (480,420), configuração 100×80 | Obstáculo: não há cabeça, pescoço, patas ou estrutura de madeira. Identidade incompreensível sem o identificador do código. | CRÍTICO | Refazer a forma como arte final ilustrada. |
| V28 — Armário: corpo e duas portas | (740,170), 140×90 | Móvel/obstáculo: retângulos sem espessura, tábuas ou molduras; madeira apenas sugerida pela cor marrom. Incompatível com o baú. | ALTO | Refazer a forma como arte final ilustrada. |
| V29 — Puxadores do armário | Dois círculos amarelos no armário | Detalhe: pontos sem metal, brilho localizado ou encaixe; deve ser integrado ao redesenho do armário, não tratado como peça pronta. | MÉDIO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V30 — Sombras de estante, poltrona, castelo, cavalinho e armário | Cinco elipses nas bases dos móveis | Carimbos idênticos para formas e materiais diferentes, sem penumbra ou direção comum. Não compensam a ausência de volume dos móveis. | MÉDIO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V33 — Robô Estelar Faísca | (1140,540) | Coletável: retângulos ciano, barra amarela, antena e disco vermelho; nenhuma junta, metal ou acabamento. Identidade de robô não basta para validar a arte. | ALTO | Refazer a forma como arte final ilustrada. |
| V34 — Coelhinho de Algodão | (460,980) | Coletável: orelhas tornam a espécie clara, mas círculos/elipses rosa não mostram pelúcia, patas, volume ou costura. Placeholder ao lado do Ursinho. | CRÍTICO | Refazer a forma como arte final ilustrada. |
| V35 — Patinho de Banho Imperial | (940,840) | Coletável: silhueta clara, porém ausência de olho e relevo, borracha sem brilho e detalhe superior ambíguo. Exige reconstrução de acabamento. | ALTO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V36 — Torre de Blocos Coloridos | (1180,720) | Coletável: faixas retangulares e triângulo, sem espessura, quinas ou madeira. Os cubos decorativos raster da mesma sala já demonstram um padrão superior. | ALTO | Refazer a forma como arte final ilustrada. |
| V37 — Tamborzinho Encantado | (640,960) | Coletável: cilindro sugerido por elipses e linhas; faltam couro, madeira/metal, amarrações e iluminação. Leitura melhor que acabamento. | ALTO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V38 — Caixinha de Surpresa da Fada | (880,360) | Coletável: quadrado roxo, losango, zigue-zague e bola rosa não mostram palhaço, caixa materializada ou mola com volume. Mistura de ícones. | ALTO | Refazer a forma como arte final ilustrada. |
| V39 — Sombras dos oito brinquedos no chão | Elipses sob cada coletável | Dimensões baseadas em w/h lógicos, não no recorte ilustrado: Ursinho 64 px de largura recebe elipse de aproximadamente 48 px. Carimbos planos não formam família de sombras pintadas. A âncora também vem do h lógico: Ursinho recebe sombra em y=501, mas o desenho chega a y=532; trem recebe sombra em y=536, enquanto o recorte chega a y=554. | MÉDIO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V47 — Composição de braços, dedos e pernas no transporte | Recortes e extensão de 4 px nos antebraços | Contato manual melhorou; pernas oficiais e tronco novo possuem reamostragem distinta, recortes rígidos e apoio estático. Apoio das mãos isoladamente B; assinatura global da montagem C. | BAIXO | Refinamento opcional; substituição por bitmap não obrigatória. |
| V52 — Poeira dourada solar: 45 partículas | Distribuída pela sala | Círculos pequenos e discretos; atmosfera funcional. Não precisam virar sprites só por serem Canvas, mas poderiam ter distribuição orientada pelos feixes. | BAIXO | Refinamento opcional; substituição por bitmap não obrigatória. |
| V53 — Poeira de passos | Atrás dos pés em movimento | Círculos que crescem e desaparecem; leitura de puff aceitável, sem desenho de poeira. Refinamento secundário, não substituição obrigatória. | BAIXO | Refinamento opcional; substituição por bitmap não obrigatória. |
| V54 — Rastro da fada | Círculos amarelos perto da fada | Mais bolinhas que magia ilustrada; soma brilho ao foco da protagonista e perde hierarquia. Requer desenho de efeito e densidade artística. | MÉDIO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V55 — Faíscas azuis ao coletar | spawnSparkles(player.x, player.y−30) | Discos ciano saturados sobre o rosto sem núcleo/raio ou relação com a luz quente; aparência de marcador de teste, não faísca pintada. | ALTO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V56 — Faíscas douradas ao soltar/guardar | Ponto de soltura ou baú | Discos claros que desaparecem; paleta coerente, mas sem desenho de faísca. Melhorar acabamento sem necessidade de eliminar a técnica procedural. | BAIXO | Refinamento opcional; substituição por bitmap não obrigatória. |
| V57 — Confetes | Guardar e comemoração | Retângulos giratórios reconhecíveis como papel; função clara. Saturação e variedade não são refinadas, mas o caráter geométrico é adequado a confete. | BAIXO | Refinamento opcional; substituição por bitmap não obrigatória. |
| V58 — Aura de proximidade dos coletáveis | Círculo de raio 30±4 px ao aproximar | Anel amarelo fino parece seleção de editor/UI no chão, não encantamento. Raio comum ignora a silhueta do Ursinho e do Trem. | ALTO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V59 — Placa flutuante ▼ PEGAR | Acima de cada coletável próximo, ty−42 | Retângulo roxo com linha amarela e texto pequeno: rótulo técnico sobre arte final. Pode competir com o botão de ação e com o topo do brinquedo. | ALTO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V60 — Triângulo/símbolo ▼ do indicador | Dentro da placa PEGAR | Glifo funcional sem ícone ilustrado próprio; parte da mesma placa, sem tratamento de coleção. | MÉDIO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V61 — Card de progresso: fundo e moldura | Tela: canto superior direito, 220×46 | RoundRect escuro translúcido e linha amarela não seguem madeira/tecido/metal do ambiente. Parece painel de protótipo com paleta parcialmente compatível. | ALTO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V62 — Texto e contador de brinquedos | Dentro do card, início x+16 | Texto medido em ≈209,4 px para área útil de 188 px. Invade a margem direita; controles HTML também o encobrem. Identidade de contador clara, número não é confiavelmente legível. | ALTO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V63 — Emoji de ursinho do contador | Início do texto do card | Glifo de emoji do sistema, sem asset próprio identificado. Renderização varia por plataforma e difere do Ursinho Pipoca. | BAIXO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V64 — Barra de progresso: trilho e preenchimento | Card: 188×8, verde esmeralda | Dois retângulos sem acabamento; verde digital não tem moldura ilustrada nem relação material com o baú. Funcional, mas abaixo da assinatura premium. | MÉDIO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V65 — Joystick: base e aura | Ponto inicial do toque, raio 56 | Disco escuro com gradiente básico e aro amarelo; estética de controle genérico, não de brinquedo/material pintado. | MÉDIO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V66 — Joystick: marcas de oito direções | Oito traços entre raios 46 e 56 | Marcas de instrumento técnico; lembram régua de depuração. Revisão de acabamento, sem mudar controle ou área de toque. | MÉDIO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V67 — Joystick: alavanca e sua sombra | Disco de raio 24, branco/âmbar | Gradiente simula esfera, mas não fornece textura/metal reconhecível. Contorno branco e sombra circular dão assinatura de widget. | MÉDIO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V68 — Botão PEGAR | Tela: width−85,height−85, raio 48 | Círculo com gradiente amarelo e contorno branco; ícone/subtexto TOQUE aparecem também no desktop. Necessita acabamento da coleção, preservando contraste. | ALTO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V69 — Botão SOLTAR | Mesma posição; estado carregando | Gradiente verde e branco de aplicativo; difere materialmente do botão PEGAR e do baú, embora a ação seja clara. | ALTO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V70 — Botão GUARDAR | Mesma posição; perto do baú carregando | Gradiente azul com subtexto/emoji de presente; leitura funcional clara, assinatura genérica. A cor não conecta visualmente ao alvo pintado. | ALTO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V71 — Botão pressionado e sombra | Raio muda de 48 para 42; sombra deslocada | Feedback de pressão compreensível; aparência circular digital pode herdar o redesenho do botão. Sem falha artística independente grave. | BAIXO | Refinamento opcional; substituição por bitmap não obrigatória. |
| V72 — Pulso do botão de ação | Anel de raio ≈btnRadius+8±5 | Mais um aro luminoso de interface, acumulado com a aura de seleção e a zona pontilhada. Excesso de contornos abstratos. | MÉDIO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V73 — Zona pontilhada do botão de ação | Círculo de raio 78, tracejado 4/4 | Expõe representação visual da área ampla de toque durante o jogo, semelhante a overlay técnico. Não é hitbox física nem superfície de pulo; é área de interface. | ALTO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V74 — Textos e emojis dos botões de ação | PEGAR/TOQUE, SOLTAR/NO CHÃO, GUARDAR/NO BAÚ | Textos são úteis; emojis de mão, caixa e presente não pertencem à família de brinquedos. Símbolos e fonte têm tratamento de UI genérica. | MÉDIO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V75 — Transição inicial clara | FillRect sobre toda a tela, introAlpha | Fade simples e legível; efeito transitório adequado. Não é placeholder só por ser retângulo procedural. | BAIXO | Refinamento opcional; substituição por bitmap não obrigatória. |
| V76 — Faixa de introdução: painel e moldura | 520×58, centrada em y=80 | Painel roxo retangular sem arte própria; em tela de 390 px perde 65 px de cada lado. Texto central cortado torna a experiência de entrada incompleta. | ALTO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V77 — Título, instrução e emojis da introdução | Duas linhas dentro da faixa | Texto explica missão, mas largura fixa corta início/fim no retrato. Ornamentos são glifos de brilho; sem composição tipográfica artística. | ALTO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V78 — Faixa de vitória: painel e moldura | 560×140, centro da tela | Retângulo roxo com borda amarela; em tela de 390 px perde 85 px de cada lado, cobrindo protagonista e cortando conteúdo. | ALTO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |
| V79 — Título, frases e emojis da vitória | Três linhas na faixa de vitória | Hierarquia funcional no desktop; frases e título cortados no retrato. Celebração depende de emojis e moldura básica, distante do acabamento da sala. | ALTO | Revisar acabamento, material visual, forma ou composição; pode continuar procedural. |

### Lista completa de formas Canvas que precisam de arte final

**Substituição obrigatória de arte de objeto:** estante e livros; poltrona; castelo e ameias; cavalinho; armário e puxadores; Robô; Coelhinho; torre de blocos; caixa de surpresa. **Reacabamento ilustrado dos objetos ainda D:** patinho e tambor. O corpo da fada é SVG, e portanto não entra nesta lista de Canvas, embora também deva ser substituído.

**Acabamento visual obrigatório, sem exigir bitmap:** sombras chapadas dos tapetes, da mesa, dos cinco móveis e dos oito brinquedos; feixes solares; rastro da fada; faíscas azuis; aura de proximidade; placa e símbolo PEGAR; card, contador e barra; base, marcas e alavanca do joystick; três estados do botão; seu pulso e zona pontilhada; textos/ícones dos botões; faixas e conteúdo da introdução/vitória.

A poeira solar, os puffs de passos, as faíscas douradas, os confetes, o fade inicial, o feedback de pressão, o sombreado do piso e a montagem dos trilhos podem permanecer procedurais. Não devem ser refeitos apenas para reduzir o número de chamadas Canvas. A recomendação é de linguagem artística e hierarquia visual.

## Efeitos: interface, transitoriedade e placeholder

| Camada | Natureza percebida | Placeholder? | Relação com a direção de arte | Nota |
| --- | --- | --- | --- | --- |
| Feixes solares | Luz de cenário | Aparência procedural básica | Bordas poligonais e planos não interagem com volumes | D |
| Poeira solar | Atmosfera | Não; simples porém funcional | Discreta, quente; merece distribuição mais intencional | C |
| Poeira de passos | Efeito temporário | Não obrigatório | Puffs aceitáveis, com acabamento básico | C |
| Confetes | Celebração temporária | Não; papel pode ser geométrico | Saturação alta, mas material/função legíveis | C |
| Faíscas azuis | Marcadores temporários de coleta | Sim, na aparência | Discos ciano competem com o rosto e a luz quente | D |
| Faíscas douradas | Feedback temporário | Não obrigatório | Paleta coerente; forma ainda de bolinha | C |
| Rastro da fada | Magia temporária | Acabamento de protótipo | Círculos sem desenho de brilho e excesso perto da cabeça | D |
| Aura SVG da fada | Glow permanente | Gradiente genérico | Tem calor, mas não assinatura pintada | D |
| Aura dos coletáveis | Seleção/UI no mundo | Sim, na aparência | Aro técnico com tamanho uniforme | D |
| Placa e triângulo PEGAR | Interface no mundo | Sim, na aparência | Rótulo de protótipo, não sinalização da coleção | D |
| Pulso do botão | Interface | Acabamento genérico | Mais um contorno abstrato de aplicativo | D |
| Zona pontilhada do botão | Interface técnica | Sim, na aparência | Parece exibição de área de toque em produção | D |
| Glow da pausa | Interface global | Acabamento genérico | Box-shadow de aplicativo, sem motivo da sala | D |
| Fade da entrada | Transição temporária | Não | Simples, mas apropriado para transição | C |

Não existe um efeito de seleção adicional fora da aura e da placa encontrados no renderizador. A fada carregada do SVG não usa o fallback Canvas animado de asas; atribuir esse fallback à apresentação normal seria incorreto.

## Achados novos ou anteriormente subestimados

1. **Controles globais sobre o contador — E.** A captura da aplicação real mostra download, pausa e som sobre o card. Na captura isolada de Canvas eles não aparecem. A posição da barra global e do HUD foi verificada por DOM e screenshot; não é especulação.
2. **Contador excede sua largura útil — D.** Medição de texto: aproximadamente 209,4 px; espaço útil: 188 px. São 21,4 px além do espaço planejado, chegando cerca de 5,4 px além da borda do card antes de considerar os botões HTML. O valor depende da fonte/plataforma, mas a falha foi medida neste ambiente.
3. **Introdução e vitória cortadas em retrato — D.** Painéis fixos de 520 e 560 px em Canvas de 390 px; cortes geométricos de 65/85 px por lado. Screenshots confirmam frases truncadas. Isso é composição de interface, não art quality dos tapetes.
4. **Baú ilustrado não apresenta abertura/glow do estado lógico.** O ramo com `environmentChest` desenha a imagem e retorna antes dos blocos que usam `lidOpen` e `glowAlpha`. Não há tampa animada, etiqueta do baú ou destaque desse ramo procedural na apresentação normal. Os efeitos externos e o contador ainda existem. Arte do baú A; apresentação do armazenamento precisa revisão D.
5. **Mensagens de ação existem, mas estão ocultas.** `uiFeedback` recebe mensagens de coleta/soltura/armazenamento; `index.html` e CSS o mantêm `display:none !important`. São feedbacks não renderizados, não assets ruins que foram “vistos”. Isso reduz a informação de nome e confirmação individual; não se recomenda automaticamente exibir o painel antigo sem direção de arte.
6. **Quatro brinquedos decorativos têm melhor acabamento que vários coletáveis.** Cubo, arco vermelho, bola e livro são raster com material, porém sem coleta. A função é D na legibilidade, apesar de arte B. A missão não possui distinção material persistente entre brinquedo de decoração e brinquedo a guardar.
7. **Livros e ameias também são placeholders.** Foram separados da estante e do castelo para não se perderem no inventário. Não basta refazer molduras e deixar as barras coloridas intactas.
8. **Sombras são uma camada própria inconsistente.** Tapete retangular usa placa plana, oval usa elipse, móveis repetem carimbos e mesa recebe sombra adicional sobre o raster. Os oito brinquedos usam dimensões lógicas para elipses que não necessariamente correspondem aos recortes pintados. No Ursinho, o centro da sombra fica em y=501 e a base do desenho em y=532; no Trem, y=536 versus y=554. Isso revela diferença de ancoragem além da diferença de acabamento.
9. **A fada é um SVG estático, sem rosto.** O corpo vetorial permanece ativo em 60×60; a animação de asas do fallback não participa quando esse asset carrega. Comparada à menina e ao Ursinho, a exigência estrita desta auditoria coloca o corpo em E, em vez de aceitar apenas ajuste superficial D.
10. **Escala do transporte mantém um problema de continuidade.** O apoio manual melhorou para B, mas a redução instantânea do brinquedo (especialmente Ursinho e Trem) é D como apresentação de escala. A arte do novo tronco também é mais nítida que o atlas original. Essas são questões diferentes da antiga sobreposição sobre o rosto.
11. **Anéis de UI se acumulam.** A seleção do brinquedo, o pulso do botão, a área pontilhada e o joystick geram círculos/traços semelhantes de finalidade diferente. O jogador recebe muitas marcas abstratas ao redor de objetos pintados.
12. **A ferramenta de download participa da composição durante o jogo.** O botão técnico persiste na Toy Room e abre um modal global com linguagem de ferramenta. Foi inventariado, sem confundi-lo com móvel ou objetivo da fase.

## Estados ausentes, fallback e assets não usados

Estes itens não são contados como elementos ativos normais:

| Elemento | Estado real | Consequência / avaliação |
| --- | --- | --- |
| Tampa animada, glow e rótulo do baú | Apenas no ramo procedural sem imagem; não desenhados com o raster | Apresentação de armazenamento D; não classificar o asset do baú como E |
| Mensagens individuais de coleta e armazenamento | Texto é atualizado, mas elemento DOM está oculto | Feedback visual ausente; investigar desenho de comunicação em próxima etapa autorizada |
| Fada procedural com asas que batem | Fallback apenas quando SVG não carrega | Formas básicas ainda mais simplificadas; não fingir que estão na apresentação normal |
| Ursinho SVG alternativo | Só usado quando recorte do environment-sheet não está disponível | Fallback vetorial; não atribuir seu estilo ao Ursinho raster visto nesta auditoria |
| Porta, mesa, baú, tapete central, janelas, frisos, trilhos e tapetes procedurais antigos | Ramos de fallback para falha de recursos | Permanecem no código; aparência de protótipo reaparece sob falha. Substituição normal já ocorre por raster nos itens corrigidos |
| Antiga pose com brinquedo sobre o rosto | Fallback de transporte quando a pose nova está indisponível | Não é o transporte normal atual; reaparece em falha de recurso |
| SVGs de direção da personagem e sprites de personagem do environment-sheet | Não usados por `ToyRoomEntities.renderPlayer()` atual | Arquivos existentes ou pré-carregados não equivalem a assets renderizados |
| Botão de pular para fase 2 | Visível na tela inicial; oculto durante a sala | Não é controle ativo da Toy Room; não foi reportado como desaparecido por falha visual |
| Tela inicial, reinício de campanha e game over de outra fase | Fora do percurso visual normal desta sala | Não usados para inflar o inventário da Toy Room |
| Sombra de contato própria da protagonista | Não há chamada específica no renderizador da personagem; o atlas fornece somente o recorte | Integração ao chão precisa revisão D de apresentação; não se afirma ausência de todo sombreado interno do desenho |
| Overlay de pausa da fase anterior | Não é desenhado no ramo Toy Room | A Toy Room mantém cena e muda apenas o botão global; não há faixa de pausa própria |
| Ilustrações de UI, brilho, símbolo de interação e sombras existentes na prancha | Não são os recursos empregados nesses elementos no renderizador atual | Há linguagem de arte de referência não aproveitada; não se considera integração concluída só por existir na imagem |

Nenhum asset ativo ficou sem origem técnica identificada, exceto o recurso gráfico individual dos glifos de plataforma (categoria F). A origem e a aparência de placeholder não foram inferidas apenas pelo nome de arquivo.

## Ranking dos 20 maiores problemas visuais restantes

Ordem combina quebra de assinatura, tamanho/persistência na tela, ambiguidade e perda de informação. Não é uma lista de implementação autorizada.

| Posição | Problema | Nota | Prioridade | Motivo |
| --- | --- | --- | --- | --- |
| 1 | Controles globais sobre o contador | E | CRÍTICO | Progresso deixa de ser legível na aplicação real |
| 2 | Cavalinho abstrato | E | CRÍTICO | Objeto não comunica cavalo nem brinquedo de balanço |
| 3 | Poltrona sem assento/encosto/braços | E | CRÍTICO | Móvel grande e não reconhecível, com massa chapada |
| 4 | Coelhinho sem pelúcia/volume | E | CRÍTICO | Coletável importante rompe a coleção do Ursinho |
| 5 | Fada vetorial sem rosto/acabamento | E | ALTO | Personagem permanentemente junto ao foco da protagonista |
| 6 | Castelo e ameias geométricos | E | ALTO | Maior massa de cor primária sem material no cenário |
| 7 | Estante e livros em barras | E | ALTO | Móvel inteiro e detalhes continuam diagrama de protótipo |
| 8 | Armário e puxadores planos | E/D | ALTO | Madeira incoerente com o baú e ausência de volume |
| 9 | Robô de retângulos | E | ALTO | Metal/juntas inexistentes ao lado de brinquedos pintados |
| 10 | Caixa de surpresa sem personagem/material | E | ALTO | Identidade ambígua e assinatura de ícone |
| 11 | Torre de blocos chapada | E | ALTO | Contraste explícito com cubo/arco decorativos ilustrados |
| 12 | Faixas de introdução e vitória cortadas | D | ALTO | Conteúdo principal truncado no retrato |
| 13 | Contador maior que área útil | D | ALTO | Texto excede moldura mesmo antes da sobreposição global |
| 14 | Botões de ação, card, barra e joystick genéricos | D | ALTO | Área persistente de interface sem direção material da sala |
| 15 | Faíscas azuis, fada/rastro sobre a cabeça | D | ALTO | Ruído e cor de marcador sobre a identidade da protagonista |
| 16 | Baú sem feedback de abertura/alvo no caminho ilustrado | D de apresentação | ALTO | Armazenamento não usa o feedback visual previsto pelo estado |
| 17 | Escala instantânea chão/mãos e transporte composto | D/C | ALTO | Continuidade material e tamanho dos brinquedos enfraquecidos |
| 18 | Aura, rótulo PEGAR e zona pontilhada de toque | D | ALTO | Sinalização de editor/interface acumulada dentro da fantasia |
| 19 | Patinho e tambor sem acabamento final | D | ALTO | Reconhecíveis, mas borracha/couro/madeira não atingem referência |
| 20 | Família de sombras e feixes sem luz integrada | D | MÉDIO | Carimbos e polígonos expõem os diferentes processos de desenho |

A função dos quatro brinquedos decorativos e os emojis/glows/modal técnico continuam pendências reais, embora fora dos vinte primeiros. Todos constam do inventário, com prioridade própria.

## Parecer final

Os assets de referência continuam válidos. O problema é a coexistência deles com uma quantidade significativa de componentes abaixo da assinatura visual, inclusive camadas que não apareciam nas capturas anteriores.

**O cenário não está artisticamente concluído.** Há substituições de objetos obrigatórias, revisão da fada e composição de HUD urgente. O resultado funcional dos testes anteriores de transporte não certifica a qualidade de cada asset, de cada sombra nem das sobreposições HTML.

Esta auditoria não autoriza ou inicia correções. Nenhuma nova arte foi criada. O trabalho termina com este inventário e suas evidências.

## Integridade da auditoria

Comparação SHA-256 antes/depois em **218 arquivos** de código, arte, manifesto, HTML, scripts e configuração: **zero alterações**. [Evidência de integridade](integridade.json). Os únicos entregáveis são documentação, inventário e capturas desta auditoria. Não houve execução de geração de arte nem correção de código.

## Rastreabilidade da origem

- Referências e detalhes pequenos: `assets/art/toy-room/environment-sheet.png`. Recortes atuais do controlador: piso (27,151,186,48), Ursinho (424,44,86,120), tapete central (39,355,291,247), porta (304,158,88,136), baú (551,192,138,128), Trem (689,76,116,88) e mesa (548,44,137,119). Detalhes: cubo (832,482,45,45), arco (878,482,54,45), bola (839,555,50,52), livro (1038,561,66,63).
- Parede, janela/cortina, friso, rodapé, tapetes adicionais e trilhos: imagens em `assets/art/toy-room/stage1/`, com montagem em `RoomEnvironmentRenderer.js`.
- Móveis geométricos: ramo `renderFurniture()` de `RoomEnvironmentRenderer.js`; livros e ameias pertencem a esses ramos.
- Seis brinquedos geométricos: ramos por `t.type` em `ToyRenderer.renderToy()`. Ursinho e Trem usam os recortes raster antes desses ramos.
- Personagem: `official-character` e tabela `OFFICIAL_FRAMES`, renderizados por `BabyRenderer`; transporte: `carry-pose-v1.png` e composição de `ToyCarryPresentation.js`.
- Fada ativa: `assets/art/toy-room/fairy.svg`, selecionada por `ToyRoomEntities.renderFairy()`. Aura é parte do SVG.
- Efeitos no mundo: loops de `ToyRoomPhase.render()` e seus emissores `spawnSparkles()`/`spawnConfetti()`. Seleção/placa: `ToyRenderer.renderToy()`.
- Interface Canvas: `ToyRoomUI.renderUI()`. Controles, moldura externa e modal: `index.html`, `src/css/styles.css` e eventos em `main.js`.

O inventário identifica também as origens das composições; não confunde a presença de um arquivo no manifesto com sua efetiva utilização na tela.
