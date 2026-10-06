# Toy Room — Etapa 4: auditoria atualizada após as correções

6 de outubro de 2026. **Somente auditoria. Nenhum código, asset, parâmetro ou gameplay foi alterado.** Este relatório passa a ser a referência para as pendências atuais dos componentes reavaliados. O [relatório anterior](../toy-room-assinatura-profunda/RELATORIO.md) permanece histórico; suas notas e seu ranking não descrevem automaticamente a versão atual.

## Parecer atual

**Nota geral: C — aceitável, com evolução clara de D para C.** A arquitetura, os móveis e os oito brinquedos agora formam uma coleção ilustrada reconhecível. A fada também pertence a essa coleção. A quebra dominante de assinatura migrou dos objetos para a interface, os efeitos e a composição da protagonista. Ainda há componentes D, mas não se encontrou motivo para manter E nos objetos corrigidos e aprovados.

A nota geral é julgamento artístico da composição, não média aritmética das notas nem certificação com jogadores. Arte de objetos corrigidos: **B — bom**. Referências oficiais: conservadas. Interface e parte dos efeitos: **D — precisam revisão**. Não há defeito crítico confirmado de perda do contador equivalente ao antigo V84.

**Os objetos aprovados não precisam ser refeitos.** A próxima etapa deve tratar composição e continuidade do transporte, preservando a arte aprovada e a lógica do jogo. Feedback de interação e interface constituem os grupos seguintes.

## Método e evidências atuais

Inspeção do código atual e novas capturas da aplicação em Chrome isolado: desktop 960×580, retrato 390×844, paisagem 915×412 e tela estreita 320×740. A entrada foi feita pela interface inicial, seguida do acesso à Toy Room. A cena foi pausada para preparar estados de introdução, proximidade, transporte, armazenamento e vitória. Os estados preparados servem para examinar camadas; não representam um novo percurso integral de gameplay nem garantem que a fada já tenha acompanhado a mudança de posição nesses quadros.

A [sala completa](sala-completa.png) usa uma instância de auditoria com Canvas 1600×1200 e câmera integral, sem mudar coordenadas dos assets. A [matriz de transporte](transporte-32-estados.png) mostra oito brinquedos, duas orientações e parada/movimento. A [composição da fada](composicao-fada.png) amplia duas posições relativas empregadas pelo acompanhamento. Foram observadas também 120 atualizações de movimento na instância isolada; [estado posterior](fada-apos-movimento.png) e [medições](medicoes.json).

| Evidência | Desktop | Retrato | Paisagem | 320 px |
| --- | --- | --- | --- | --- |
| Aplicação, estado normal | [Imagem](desktop-aplicacao.png) | [Imagem](retrato-aplicacao.png) | [Imagem](paisagem-aplicacao.png) | [Imagem](estreito-aplicacao.png) |
| Introdução | [Imagem](desktop-introducao.png) | [Imagem](retrato-introducao.png) | [Imagem](paisagem-introducao.png) | [Imagem](estreito-introducao.png) |
| PEGAR e joystick | [Imagem](desktop-pegar.png) | [Imagem](retrato-pegar.png) | [Imagem](paisagem-pegar.png) | [Imagem](estreito-pegar.png) |
| SOLTAR | [Imagem](desktop-soltar.png) | [Imagem](retrato-soltar.png) | [Imagem](paisagem-soltar.png) | [Imagem](estreito-soltar.png) |
| GUARDAR | [Imagem](desktop-guardar.png) | [Imagem](retrato-guardar.png) | [Imagem](paisagem-guardar.png) | [Imagem](estreito-guardar.png) |
| Armazenamento | [Imagem](desktop-armazenamento.png) | [Imagem](retrato-armazenamento.png) | [Imagem](paisagem-armazenamento.png) | [Imagem](estreito-armazenamento.png) |
| Vitória, estado preparado | [Imagem](desktop-vitoria.png) | [Imagem](retrato-vitoria.png) | [Imagem](paisagem-vitoria.png) | [Imagem](estreito-vitoria.png) |

[Inventário em execução, dimensões, fontes e controles](runtime.json). Os 86 recursos carregaram; zero exceções JavaScript observadas durante as capturas. O perfil é exclusivo de auditoria; saves do usuário não foram acessados. A vitória foi preparada para inspeção da faixa; brinquedos ainda visíveis nesse quadro não são evidência de falha de armazenamento.

Referências de evolução: [críticos](../toy-room-etapa3/criticos/RELATORIO.md), [grupos altos](../toy-room-etapa3/altos/RELATORIO.md), [remoção da exportação](../remocao-exportacao/RELATORIO.md) e [integração da fada na primeira fase](../fada-primeira-fase/RELATORIO.md). A aprovação da arte foi dada pelo usuário na conversa; B é a avaliação artística desta auditoria, não uma aprovação nova solicitada.

## 1. Validação dos itens corrigidos

A/B/C/D/E: excelente, bom, aceitável, precisa revisão, fora do padrão. A aprovação do desenho é separada da avaliação de animação, sombra externa ou composição.

| Item / IDs históricos | Nota antiga | Nota atual | Status | Placeholder / protótipo? | Destoa? / aprovação da nova arte |
| --- | --- | --- | --- | --- | --- |
| Estante — V22 | E | B | RESOLVIDO | Não / não | Madeira, espessura e prateleiras coerentes; aprovada. |
| Livros — V23 | E | B | RESOLVIDO | Não / não | Lombadas, páginas e arranjo integrados à estante; aprovados. |
| Poltrona — V24 | E | B | RESOLVIDO | Não / não | Encosto, braços, assento, pés e tecido reconhecíveis; aprovada. |
| Castelo — V25 | E | B | RESOLVIDO | Não / não | Peças de madeira pintada, torres e arco legíveis; aprovado. |
| Ameias — V26 | E | B | RESOLVIDO | Não / não | Blocos verdes com faces e material; aprovados como parte do castelo. |
| Cavalinho — V27 | E | B | RESOLVIDO | Não / não | Cabeça, corpo, sela e base de balanço claros; aprovado. |
| Armário — V28; puxadores V29 | E / D | B / B | RESOLVIDO | Não / não | Portas, molduras, lateral, pés e metal integrados; aprovado. |
| Robô — V33 | E | B | RESOLVIDO | Não / não | Rosto, juntas e material pintado; aprovado. Pequenos detalhes diminuem nas mãos, questão de escala. |
| Coelhinho — V34 | E | B | RESOLVIDO | Não / não | Pelúcia, rosto e patas definidos; aprovado. |
| Torre de blocos — V36 | E | B | RESOLVIDO | Não / não | Faces, quinas e madeira; aprovada. |
| Caixinha de surpresa — V38 | E | B | RESOLVIDO | Não / não | Caixa, tampa, mola e personagem claros; aprovada. |
| Fada, arte — V49 | E | B | RESOLVIDO | Não / não | PNG ilustrado com rosto, vestido, asas e varinha; aprovado. Posição e animação avaliadas adiante. |
| Transporte — V46/V47/V48 | C / C / D | C / C / D | PARCIALMENTE RESOLVIDO | Não como objeto; montagem ainda perceptível | Apoio manual melhorado e aceito anteriormente; conjunto de escala/pose não concluído. Transporte não era E no inventário histórico. |
| Sobreposição controles/contador — V84 | E | B | RESOLVIDO | Não | Contador à esquerda; pausa/som à direita; conflito removido nas quatro telas. |
| Patinho — V35; tambor V37 | D / D | B / B | RESOLVIDO | Não / não | Borracha, olho e asa; pele, casco e aros. Artes aprovadas. |

Os 13 IDs antigos E estão resolvidos nos respectivos desenhos/composição corrigida. Essa constatação não aprova por associação as camadas externas de interação. Os ramos antigos de fallback continuam no código para falha de recurso; não apareceram na apresentação normal auditada e não justificam refazer os sprites ativos.

A aura SVG antiga V50 deixou de ser desenhada na rota normal da fada PNG. Não é uma pendência ativa. V82/V86/V87, relacionados à exportação, foram removidos: não devem integrar o próximo escopo.

## 2. Composição da protagonista

| Aspecto | Nota atual | Resposta e implicação |
| --- | --- | --- |
| Protagonista parada e em movimento — V44/V45 | B | Identidade ilustrada coerente; atlas mais suave que os novos recortes. Conservar; não exige substituição global. |
| Fada isolada | B | Cor quente, expressão e roupa integradas à coleção. Arte aprovada. |
| Competição fada/protagonista — V51 | D | Corpo sólido pode cruzar cabelo e lateral superior da cabeça. Varinha e asas nítidas chamam atenção junto ao atlas mais suave. Não cobre permanentemente todo o rosto, mas a interferência persiste. |
| Naturalidade do posicionamento | C | Acompanhamento e oscilação existem, porém o alvo de ±24 px / y−32 mantém pouco espaço no foco da protagonista. Desenho da fada sempre posterior ao da menina agrava sobreposições. |
| Continuidade chão/mãos — V48 | D | Mudança instantânea de escala ainda visível; não foi corrigida pela troca dos seis brinquedos. |
| Naturalidade da pose — V46/V47 | C | Contato das palmas com a base funciona, mas recortes de tronco/pernas e diferença de nitidez mostram a montagem. |
| Braços sustentam os objetos? | B | Sim na pose observada; dedos e palmas indicam apoio. Não reapresentar a antiga carga sobre o rosto como estado normal. |
| Peso transmitido | C | Apoio sugere sustentação, mas tronco e braços mantêm o mesmo gesto, sem resposta própria ao tipo/peso da carga. Movimento vem sobretudo das pernas e de pequeno balanço. |

Os oito perfis mantêm os fatores de transporte: Ursinho 0,32; Trem 0,40; Robô 0,48; Coelhinho 0,42; Patinho 0,55; Blocos 0,55; Tambor 0,65; Caixa 0,48. Em relação ao chão, isso representa redução de 35% a 68% nas dimensões lineares. Ursinho 64×90 → 20,48×28,8; Trem 84×64 → 33,6×25,6. A nitidez/material dos sprites não elimina esse salto de tamanho.

**Composição conjunta: D**, determinada pelo conflito da fada com a cabeça e pela continuidade de escala. A pose isolada é C, e o apoio manual B. Melhorar apresentação sem alterar colisões, alcance de interação ou velocidade.

## 3. Feedback de interação

| Elemento | Nota artística / funcional | Prioridade | Diagnóstico atual |
| --- | --- | --- | --- |
| Aura de proximidade | D / B | ALTO | Anel amarelo de seleção sem material da coleção; ajuda a localizar interação, mas conserva aparência técnica. |
| Seleção dos brinquedos | D / C | ALTO | Cada brinquedo a menos de 88 px pode desenhar indicação; a ação escolhe o mais próximo. A identidade do alvo depende da proximidade, sem distinção persistente da decoração. |
| Indicador flutuante PEGAR | D / A no desktop | ALTO | Texto comunica ação; placa retangular e glifo ▼ parecem UI provisória. No celular diminui com a escala do mundo. |
| Botão/indicador PEGAR | D / B | MÉDIO | Ação clara ao aproximar; também aparece longe de um alvo, quando pegar não está disponível. Pulso diferencia disponibilidade parcialmente. |
| Botão/indicador SOLTAR | D / B | MÉDIO | Estado verde e rótulo claros. Acabamento de widget; texto secundário pequeno no celular. |
| Botão/indicador GUARDAR | D / B | ALTO | Azul e texto anunciam armazenamento próximo ao baú; alvo em si não recebe destaque correspondente. |
| Resposta visual própria do baú | D / C | ALTO | Imagem permanece fechada e igual, mesmo com `lidOpen`/`glowAlpha` ativos. Comparação direta do ramo raster deu pixels idênticos nos dois estados. |
| Confirmação de armazenamento | C / B | MÉDIO | Brinquedo sai das mãos, contador aumenta e aparecem faíscas/confetes. Portanto não está ausente. Falta resposta do baú e confirmação individual visível. |
| Mensagem individual de ação | Ausente na apresentação | MÉDIO | `ui-feedback` tem `display:none`; não se avaliou texto oculto como asset visto. O painel antigo não deve ser reativado automaticamente. |
| Zona pontilhada do botão | D / C | MÉDIO | Parece exposição técnica da área de toque em produção. É interface, não hitbox física de plataforma. |
| Decoração versus coletáveis | B arte / D função | MÉDIO | Livro, bola, cubo e arco decorativos continuam parecendo brinquedos possíveis de pegar. Agora a qualidade artística dos coletáveis é equivalente; a antiga diferença de acabamento está resolvida. |

O jogador dispõe de sinais suficientes para executar as ações na inspeção, mas não foi medido entendimento com usuários novos. A aparência de debug vem dos aros, traços e zona pontilhada; não se encontrou necessidade de introduzir linhas de contato sobre ilustrações.

## 4. Interface e composição responsiva

| Elemento | Nota artística | Legibilidade atual | Situação |
| --- | --- | --- | --- |
| HUD/card | D | B | Legível e separado dos controles; painel escuro e borda amarela ainda não compartilham material dos objetos. |
| Contador — V62 | B na apresentação do texto | B | Largura adaptada e duas linhas em telas estreitas; perda por sobreposição/excesso de largura resolvida. |
| Emoji e barra de progresso | D | B | Função clara; glifo de sistema e retângulos verdes têm linguagem genérica. |
| Joystick | D | B | Base, oito traços e esfera sugerem controle de aplicativo. Exibido durante toque ativo; marcas técnicas permanecem. |
| PEGAR / SOLTAR / GUARDAR | D / D / D | B no desktop; C em fonte secundária móvel | Estados compreensíveis; gradientes, bordas brancas e emojis não correspondem à coleção ilustrada. |
| Introdução | D | B no desktop; C móvel | Textos cabem nas quatro telas verificadas. Instrução reduzida para cerca de 9,39 px CSS em retrato e 7,70 px em 320 px. |
| Vitória | D | B no desktop; C móvel | Textos cabem. Moldura de 560 px internos ultrapassa Canvas de 540 px em retrato/320: 10 px internos por lado. Frases têm cerca de 10,83/8,89 px CSS. |
| Pausa/som | D | B | Não cobrem mais o contador. Acabamento CSS/emoji permanece genérico; ausência de faixa própria de pausa não impede a ação. |

**Retificação do diagnóstico histórico de cortes:** não há texto truncado confirmado nesta aplicação em retrato. O título da vitória mede aproximadamente 481,38 px internos e cabe nos 540 px disponíveis; a introdução mede 421,84 px. O relatório antigo examinou também uma bancada com Canvas 390 px, na qual os cortes existiam. Não é correto transportar essa geometria para a aplicação atual. O problema real é o dimensionamento pequeno das fontes e o corte da moldura da vitória, além da assinatura visual.

Não se observou conflito entre HUD e pausa/som, nem sobreposição entre HUD e introdução. A intro desloca temporariamente o card para baixo. As faixas centrais sobrepõem a cena por sua própria função, sem perder os textos nas telas medidas. A UI não parece ter o mesmo acabamento material dos móveis e brinquedos, embora mantenha parte da paleta quente.

## 5. Luz, sombras e efeitos

| Componente | Nota | Ancoragem / direção / integração | Prioridade |
| --- | --- | --- | --- |
| Feixes solares | D | Polígonos translúcidos com bordas retas; origem coerente com janelas, mas não respondem aos volumes. Aparência de camada sobreposta. | MÉDIO |
| Sombras dos oito brinquedos | D | Elipses usam dimensões lógicas. Ursinho: centro y+21 versus base pintada y+52; Trem y+16 versus base y+34. Diferença não é somente estética. Nos novos brinquedos algumas bases se aproximam, sem concluir a família. | ALTO |
| Sombras dos cinco móveis novos | B | Incorporadas às ilustrações; os retornos dos ramos raster evitam as cinco elipses procedurais antigas. A antiga avaliação coletiva V30 não permanece D para esses cinco objetos. | BAIXO; conservar |
| Sombra adicional da mesa | D | Elipse escura além da sombra do recorte; massa excessiva e direção pouco definida. | MÉDIO |
| Sombra do baú | B | Parte do recorte ilustrado, assentamento consistente com sua própria pintura. Não confundir com ausência de resposta de armazenamento. | BAIXO; conservar |
| Sombras dos tapetes oval/retangular | D | Elipse e placa retangular planas continuam sob tecido ilustrado; bordas e penumbra pouco naturais. | MÉDIO |
| Sombra dos trilhos | C | Traçado uniforme ajuda assentamento, mas exposição da montagem permanece secundária. | BAIXO |
| Contato da protagonista com o chão | D de integração | Renderizador não fornece sombra de contato própria; contraste aumenta frente aos móveis assentados. Sombreado interno do sprite não equivale a sombra de chão. | MÉDIO |
| Poeira solar | C | Pontos quentes discretos, funcionais; distribuição não acompanha exclusivamente os feixes. | BAIXO |
| Poeira de passos | C | Puffs procedurais legíveis, acabamento simples e adequado à transitoriedade. | BAIXO |
| Faíscas azuis de coleta | D | Emissão ciano em y−30 da protagonista, próxima ao foco do rosto; discos não compartilham luz quente. Código ativo confirmado; não foram confundidos com o brilho pintado da fada. | MÉDIO |
| Faíscas douradas | C | Paleta integrada; desenho de discos ainda básico, confirmação temporária suficiente. | BAIXO |
| Confetes | C | Papel geométrico reconhecível, celebração legível; não precisam ser substituídos por bitmap. | BAIXO |
| Rastro mágico da fada | D | Pequenos círculos próximos ao sprite acumulam ruído com a cabeça. Não acompanha a mesma delicadeza da pintura. | MÉDIO |
| Luz interna da fada PNG | B | Brilho e asas fazem parte da arte aprovada; antiga aura SVG não participa. | BAIXO; conservar |
| Anéis/pulsos de seleção e ação | D | Camada abstrata de interface, sem integração material com luz e chão. | MÉDIO |

A direção geral de iluminação é parcialmente consistente: janelas, paleta e pinturas combinam, mas elipses/placas não oferecem direção e penumbra suficientes para formar uma família. Não há motivo para reabrir a arte dos móveis novos devido às sombras antigas que deixaram de ser executadas.

## 6. Animação da fada

| Aspecto | Nota | Avaliação atual |
| --- | --- | --- |
| Arte e integração de material | B | Rosto e vestido dão identidade; preservar o PNG aprovado. |
| Movimentação | B | Acompanha a protagonista com interpolação e oscilação. As 120 atualizações confirmam mudanças de posição e partículas; não é uma imagem imóvel no mundo. |
| Asas | D em animação | Fixas dentro do PNG. `flutterTime` move o alvo, mas não anima as asas no ramo ilustrado. |
| Expressividade | C | Expressão simpática existente, porém fixa; nenhuma resposta facial a pegar/guardar/vencer. |
| Personalidade | C | Aparência comunica personagem; gestos e respostas secundárias são limitados. |
| Magia do movimento | C | Flutuação e rastro comunicam magia, com acabamento ainda básico. |
| Integração junto à protagonista | D | Sobreposição focal continua mais urgente que acrescentar detalhes de animação. |

**Animação global: C.** A fada parece viva pelo deslocamento, mas usa uma única pose. Batimento de asas, expressões e pequenas reações são melhorias justificadas de prioridade MÉDIA, depois de resolver a composição. Não exigem substituir sua identidade visual aprovada. Esta auditoria não criou quadros ou assets.

## 7. Pendências reais — somente duas listas

**Lista 1 — resolvidos, aprovados/concluídos e fora do escopo de nova revisão de arte:**

- Estante e livros, poltrona, castelo e ameias, cavalinho, armário e puxadores: B; substituições concluídas e aprovadas.
- Robô, Coelhinho, torre de blocos, caixinha de surpresa, patinho e tambor: B; coleção ilustrada concluída e aprovada.
- Desenho da fada: B; aprovado, inclusive reutilizado na primeira fase. Aura SVG antiga ausente da rota normal.
- Conflito controles/contador e largura do texto: resolvidos. Contador legível nas quatro telas verificadas.
- Exportação, botão e modal: removidos; nenhuma implementação futura necessária.
- Cinco sombras procedurais antigas dos móveis substituídos: não executadas na apresentação normal. Sombras dos novos móveis integradas e aceitáveis.
- Ursinho, Trem, baú, mesa, porta verde, tapete central e piso: referências conservadas; não refazer as ilustrações. Parede, janelas, cortinas, frisos, tapetes adicionais e peças dos trilhos permanecem coerentes.
- Antiga apresentação normal de carga sobre o rosto: superada pelo apoio manual atual. Não reintroduzir esse diagnóstico. A bancada histórica de texto cortado em Canvas de 390 px não é o comportamento atual observado da aplicação.

**Lista 2 — restantes e com trabalho futuro justificado:**

- Composição fada/cabeça e rastro na região focal.
- Continuidade de tamanho chão/mãos; nitidez/roupa e montagem da pose de transporte; sustentação dinâmica/peso.
- Ancoragem das sombras dos brinquedos; sombra de contato da protagonista, sombra extra da mesa, tapetes e feixes solares.
- Resposta visual do baú ao estado de armazenamento; confirmação individual, preservando o contador e efeitos já funcionais.
- Seleção, placa PEGAR e distinção entre brinquedos decorativos e coletáveis.
- Acabamento do HUD, barra, emojis, joystick e três estados do botão; anéis e zona pontilhada com aparência técnica.
- Fontes secundárias pequenas e moldura da vitória cortada nas laterais; composição artística das faixas. Não há corte de texto confirmado nas quatro telas.
- Faíscas azuis e rastro mágico; animação de asas, reações e expressões da fada.

## 8. Ranking novo, baseado na versão atual

Não há pendência classificada CRÍTICA nesta inspeção. ALTO significa apresentação prioritária, não autorização de implementação. Questões de objetos já resolvidas foram retiradas do ranking.

| Ordem | Pendência atual | Nota | Prioridade | Razão |
| --- | --- | --- | --- | --- |
| 1 | Fada sobre cabelo/cabeça | D | ALTO | Interferência persistente no foco principal, mesmo com arte boa. |
| 2 | Mudança de escala chão/mãos | D | ALTO | Mesmo objeto encolhe instantaneamente; reduz continuidade material e reconhecimento nas mãos. |
| 3 | Baú sem resposta própria ao armazenamento | D | ALTO | A ação central depende de sinais externos; estado lógico não chega ao desenho do alvo. |
| 4 | Ancoragem das sombras dos brinquedos | D | ALTO | Ursinho/Trem não assentam na mesma base de suas elipses, apesar de arte de referência. |
| 5 | Seleção e placa PEGAR | D | ALTO | Aparência técnica e identificação de alvo pouco integrada à coleção. |
| 6 | Acabamento de HUD/joystick/botões | D | MÉDIO | Grande evolução funcional; assinatura artística ainda abaixo dos objetos. |
| 7 | Fontes secundárias móveis e moldura da vitória | C/D | MÉDIO | Conteúdo cabe, porém chega a 7,70–8,89 px CSS em tela estreita; moldura é cortada. |
| 8 | Coerência da montagem e peso no transporte | C | MÉDIO | Palmas funcionam; troca de acabamento e gesto rígido permanecem. |
| 9 | Sombras restantes, contato da menina e feixes | D | MÉDIO | Camadas sobrepostas e direções pouco consistentes. |
| 10 | Rastro, faíscas azuis e excesso de aros | D | MÉDIO | Ruído no foco da protagonista e linguagem de marcador. |
| 11 | Decoração versus missão e confirmação individual | D/C | MÉDIO | Papéis visuais não se distinguem permanentemente; texto individual oculto. |
| 12 | Asas, expressões e animações secundárias da fada | C/D | MÉDIO | Movimento existe; pose permanece fixa. |
| 13 | Refinamento de poeira, confetes e montagem de trilhos/piso | C | BAIXO | Funcionais; aperfeiçoamento opcional, sem substituir técnicas por princípio. |

## Próxima etapa recomendada

**Etapa 5 — composição da protagonista e continuidade do transporte.** Delimitar o trabalho à posição visual da fada, espaço em torno da cabeça, continuidade chão/mãos e coerência da pose. Reutilizar a arte aprovada. Preservar física, hitboxes, distância de interação, dificuldade e desenho natural dos objetos; não adicionar réguas sobre as ilustrações.

Validar os oito carregáveis nos dois sentidos, parada/movimento, mudanças de direção e coleta/soltura, com comparação antes/depois em desktop/retrato/paisagem. Só então tratar feedback do baú/seleção, seguido da assinatura e dimensionamento da interface e da família de luz/sombras. A animação da fada deve herdar a composição já resolvida.

O [gameplay completo automatizado anterior](../fada-primeira-fase/RELATORIO.md) permanece evidência funcional da versão aprovada, com método e limites próprios. Esta etapa produziu auditoria, não novo playtest integral nem teste de reconhecimento com crianças.

## Integridade e rastreabilidade

[SHA-256 antes/depois](integridade.json): **249 arquivos de produção, assets, testes, scripts e configuração; zero alterações** durante a auditoria. A comparação exclui evidências históricas em `assets/qa-testers/`; relatório histórico preservado. Novos entregáveis restritos a esta pasta de documentação/evidências. Bancadas temporárias foram executadas em `/tmp`; nenhum script do repositório foi editado.

Rotas ativas verificadas: `RoomEnvironmentRenderer.js` (raster de móveis, mesa, baú, feixes/tapetes), `ToyRenderer.js` (raster de brinquedos, sombras, seleção), `ToyCarryPresentation.js` (perfis e composição), `ToyRoomEntities.js` (atlas oficial e fada PNG), `ToyRoomPhase.js` (acompanhamento, efeitos, estados de armazenamento e render), `ToyRoomUI.js` (HUD/controles/faixas), `index.html` e `src/css/styles.css` (controles e feedback oculto). Arquivos presentes no manifesto não foram confundidos com recursos efetivamente desenhados.

**Auditoria concluída. Nenhuma correção iniciada.**
