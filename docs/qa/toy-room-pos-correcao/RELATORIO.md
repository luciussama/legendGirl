# Toy Room — auditoria de validação pós-correção

Data: 5 de outubro de 2026. Escopo: inspeção e validação, sem correções, novos assets de jogo ou alterações de código.

**Nota geral atual: D — Precisa revisão.** A Etapa 1 melhorou claramente o ambiente, mas a sala inteira ainda não apresenta uma assinatura artística unificada. Os oito elementos ambientais tratados atingem B nesta avaliação; cinco móveis e seis brinquedos continuam destoando da família ilustrada de referência.

**Parecer da Etapa 1: aprovada visualmente no escopo ambiental; não aprovada integralmente sem ressalvas.** As mecânicas foram preservadas e não houve perda de FPS observada. Contudo, o requisito anterior de manter o mesmo custo de performance não foi cumprido para transferência de assets e orçamento de memória. Esses aumentos precisam ser aceitos explicitamente na revisão ou tratados em tarefa posterior autorizada.

## Método e evidências

Foi feita nova renderização com os módulos atuais em Chrome headless, comparação com o renderizador anterior preservado, inspeção da sala completa e de enquadramentos de desktop e celular. O teste comparativo foi executado a partir de uma cópia temporária, gravando evidências novas e preservando os registros da Etapa 1.

Também foram verificados os hashes dos arquivos fora do escopo, 4.941 amostras dos limites da sala, 35 contatos específicos nos obstáculos, movimento nas quatro direções, coleta e soltura dos oito brinquedos, armazenamento e conclusão do objetivo. Foram medidos três carregamentos sem cache de cada versão e 600 quadros consecutivos em movimento.

As notas de qualidade artística são julgamentos de inspeção visual, justificados abaixo. Tempos, contagens, dimensões e tamanhos em bytes são dados medidos. As capturas móveis emulam viewports; não são validações em hardware Android ou iPhone.

- [Comparação antes/depois](comparacao.png)
- [Sala atual completa](depois.png)
- [Região inferior](desktop-inferior.png)
- [Viewport de celular em retrato](celular-retrato.png)
- [Validação funcional e do fundo](depois-validacao.json)
- [Comparação de pixels](comparacao-pixels.json)
- [Tempos de quadros completos](performance-quadros.json)
- [Carregamento e estabilidade](performance-extra.json)
- [Testes do projeto nesta auditoria](testes.log)

## 1. Coerência visual global — D

**A sala parece visualmente unificada? Não completamente.** A arquitetura, o piso, os objetos raster e os novos tapetes compartilham cores quentes, textura e volume. Essa unidade se rompe ao observar estante, armário, poltrona, fortaleza e cavalinho, que continuam construídos com preenchimentos lisos e poucas formas.

**Ainda existem elementos com aparência de placeholder? Sim.** O cavalinho, por exemplo, permanece uma elipse amarela sobre um arco, sem cabeça, pescoço ou pernas. A fortaleza é uma grande área laranja com telhados triangulares, sem faces ou madeira. A estante apresenta livros como retângulos coloridos sem lombadas ou volume.

**Há elementos que parecem pertencer a outro jogo? Sim, pela linguagem de renderização.** Urso e trem são ilustrações texturizadas; robô, coelho, blocos e caixa de surpresa têm aparência de ícones geométricos. Essa diferença também existe entre a protagonista raster e a fada vetorial.

**Há diferenças bruscas de acabamento? Sim.** O baú ilustrado está entre estante e armário chapados. O bloco azul decorativo tem faces e sombra pintadas, enquanto a torre de blocos coletável usa formas planas. Esses pares próximos tornam a incompatibilidade verificável dentro da própria sala.

**Há conflitos de estilo? Sim.** Coexistem pintura digital texturizada, sprites de personagem com resolução aparente mais granulada e objetos de cores chapadas. A paleta infantil comum ainda não basta para unificar material, perspectiva, contorno e luz.

A nota global permanece D porque o critério é a assinatura de toda a fase. Isso não significa ausência de evolução: a arquitetura e os tapetes secundários deixaram de ser os principais pontos de ruptura.

## 2. Parede superior — B

**A faixa preta foi eliminada de forma convincente? Sim, na apresentação normal com os recursos carregados.** A região agora tem papel de parede creme e pêssego, fibras e flores discretas. A textura comunica material e preenche o espaço atrás dos móveis e das janelas.

A integração é adequada: a madeira das janelas contrasta com a superfície clara, e o rodapé fecha a junção com o piso. O contraste do papel é menor que o dos brinquedos, evitando que essa área se transforme no foco principal da fase.

Limitação para nota A: as flores e a textura se repetem a cada 512 pixels; a repetição pode ser percebida na visão completa. A parede está corrigida quanto à falha original de área vazia.

## 3. Janelas e cortinas

**Janelas — B.** Parecem elementos ilustrados reais: a moldura tem bordas arredondadas, rebaixos, veios, juntas e luz pintada. Os vidros apresentam pinceladas em vez de gradientes lisos. Os destinos continuam em (520, 30) e (1280, 30), com 160 × 170 pixels.

**Pertencem ao mesmo universo da porta principal? Sim.** Ambas usam ilustração de madeira com contorno e profundidade. A janela é mais dourada e luminosa que a porta verde, mas isso é compatível com materiais e funções diferentes. A iluminação pintada ainda não está plenamente integrada à iluminação global, questão que já existia e não foi tratada nesta etapa.

**Cortinas — B. Parecem tecido real? Sim.** Há trama, dobras, amarrações e diferença de luz entre saliências e recessos. A leitura de tecido substituiu as formas translúcidas simplificadas anteriores. A transparência é pouco perceptível no sprite final; o principal ganho é materialidade e volume. Não atribuo A porque a imagem estática não demonstra comportamento de tecido ou transmissão de luz integrada ao ambiente.

## 4. Tapetes

| Tapete | Nota | Justificativa |
|---|:---:|---|
| Principal | A | Boa integração de textura, borda, franjas, volume e paleta; continua sendo a referência de coleção. |
| Oval | B | Bordado floral próprio, trama e bordas costuradas; compartilha raspberry, teal e dourado com o principal. |
| Retangular | B | Bordado de losangos e flores, campo teal, bordas costuradas e franjas; identidade própria dentro da mesma paleta. |

**Os três parecem parte da mesma coleção? Sim.** Cores, material têxtil, bordas e franjas sustentam a relação. Não são cópias do desenho central.

**Há diferença excessiva de qualidade ou estilo? Não.** Existe uma diferença perceptível: a trama e os bordados dos novos tapetes têm relevo aparente mais forte que o desenho do central. Essa diferença impede uma classificação A homogênea, mas não produz a ruptura de estilo que existia nas versões chapadas.

A relação entre tapete retangular e trilhos merece atenção compositiva: os trilhos continuam passando sobre parte dele. É uma sobreposição do layout anterior, sem mudança de navegação ou posicionamento nesta etapa.

## 5. Circuito de trilhos — B

**Agora parece um brinquedo físico de madeira.** Existem duas bordas de trilho, dormentes, veios, rebaixos e juntas entre as peças. O acabamento quente e a modelagem são compatíveis com o Trenzinho Real a Vapor.

O antigo tracejado com aparência de marcação técnica foi substituído pela construção material. As curvas são legíveis e o circuito conserva o mesmo traçado e a faixa de 24 pixels. A montagem é reutilizada; não entra na física.

Limitações: os dormentes são pequenos no enquadramento amplo, os encaixes das peças podem ser percebidos nas curvas e há pouco contraste entre madeira dos trilhos e madeira do piso. Esses fatores reduzem o refinamento, mas não fazem o circuito voltar a parecer um diagrama.

## 6. Leitura de gameplay — C

**As alterações prejudicaram a leitura da fase? Não foi observada perda funcional nos enquadramentos inspecionados.** Protagonista, fada e brinquedos continuam distinguíveis e as ações de coleta e armazenamento passaram na validação. Os tapetes e frisos não cobrem novos espaços de interação.

**Há competição visual? Sim, moderada.** O piso tem linhas escuras repetidas, as molduras agora têm entalhes contínuos e os novos tapetes têm bordados de alto detalhe. A protagonista é pequena na visão completa e tem contraste local menor que a fortaleza e os brinquedos chapados de cores saturadas. Parte desse desequilíbrio é anterior à Etapa 1.

**Excesso de detalhe:** localizado no acúmulo de piso, frisos e bordados, especialmente na visão ampla. **Excesso de contraste:** continua mais evidente nas cores chapadas de poltrona, fortaleza e brinquedos simplificados. **Ruído visual:** moderado; as linhas do piso e o circuito formam uma rede visual contínua.

Na visão de celular, o enquadramento torna a protagonista legível, mas a fada permanece próxima à cabeça e os brinquedos carregados continuam podendo cobrir o rosto. Essa apresentação não foi corrigida na Etapa 1. A nota C representa legibilidade aceitável com hierarquia visual ainda desigual, e não alteração de gameplay.

## 7. Performance e estabilidade

**Houve regressão? Sim, em volume de recursos e orçamento nominal de memória. Não foi observada regressão de FPS.**

| Indicador | Antes | Depois | Avaliação |
|---|---:|---:|---|
| Intervalo mediano entre quadros | 16,7 ms | 16,7 ms | Aproximadamente 59,9 FPS em ambas as versões. |
| Mediana de renderização completa | 0,8 ms | 0,7 ms | Sem regressão observada; a diferença pequena não prova ganho universal. |
| P90 de renderização completa | 1,0 ms | 0,9 ms | Sem regressão observada. |
| Mediana do fundo isolado | 0,325 ms | 0,3275 ms | Diferença de 0,0025 ms, sem impacto de FPS demonstrado. |
| Mediana de `preload`, três execuções sem cache HTTP | 59,4 ms | 63,2 ms | +3,8 ms no servidor local; amostra curta e rede local. |
| Imagens registradas | 67 | 73 | Seis requisições de imagem adicionais. |
| Bytes dos arquivos de imagem do manifesto | 31.857.801 | 33.297.667 | +1.439.866 bytes, ou +4,52%; exclui cabeçalhos HTTP e outros arquivos. |

Os seis novos PNGs equivalem a **1,373 MiB** de dados de arquivo. Não houve ensaio em rede lenta. Portanto, não há fundamento para afirmar carregamento equivalente em todos os dispositivos.

Para memória, a soma nominal dos pixels dos seis PNGs em RGBA de oito bits é **3.122.000 bytes**. O canvas dos trilhos, 684 × 644, acrescenta **1.761.984 bytes**. O orçamento combinado é **4.883.984 bytes, aproximadamente 4,658 MiB**, além do restante da fase. Esse cálculo é um orçamento de buffers de pixels, não uma medição do RSS, da memória total do processo ou das cópias de textura na GPU.

Na versão atual, 600 quadros em movimento durante aproximadamente 9,983 segundos mantiveram mediana e P95 de intervalo em 16,7 ms, sem coordenadas inválidas. O mesmo canvas dos trilhos foi reutilizado. Após coleta de lixo, o heap JavaScript passou de 1.073.000 para 1.216.924 bytes durante esse ensaio; esse aumento isolado não caracteriza vazamento. Não foi realizado teste prolongado de estabilidade ou medição completa da memória do processo.

Todos os recursos carregaram nos seis ensaios de preload. A validação funcional e `npm test` passaram nesta auditoria. Não foram observadas falhas nesta execução com o servidor Express temporário.

## 8. Comparação com a auditoria original

| Item originalmente D/E | Antes | Depois | Status |
|---|:---:|:---:|---|
| Parede superior | E | B | Falha original resolvida: área vazia eliminada. |
| Janelas | D | B | Corrigidas; acabamento ilustrado compatível. |
| Cortinas | D | B | Corrigidas; tecido reconhecível. |
| Tapete oval | D | B | Corrigido; integração à coleção. |
| Tapete retangular | D | B | Corrigido; integração à coleção. |
| Trilhos | D | B | Corrigidos; leitura de brinquedo de madeira. |
| Estante | E | E | Ainda precisa revisão; livros e estrutura chapados. |
| Armário | E | E | Ainda precisa revisão; material e profundidade ausentes. |
| Poltrona | E | E | Ainda precisa revisão; construção e tecido esquemáticos. |
| Fortaleza | E | E | Ainda precisa revisão; grande massa de cores planas. |
| Cavalinho | E | E | Ainda precisa revisão; identidade incompleta do objeto. |
| Robô | E | E | Ainda precisa revisão; geometria plana incompatível com o trem. |
| Coelho | E | E | Ainda precisa revisão; ausência de pelúcia e volume. |
| Patinho | D | D | Ainda precisa revisão; acabamento e modelagem insuficientes. |
| Torre de blocos | E | E | Ainda precisa revisão; difere até dos blocos decorativos raster. |
| Tambor | D | D | Ainda precisa revisão; material e construção simplificados. |
| Caixa de surpresa | E | E | Ainda precisa revisão; figura e caixa esquemáticas. |
| Pose de carregar | D | D | Ainda precisa revisão; objetos sobre rosto e tronco, sem contato convincente com as mãos. |
| Fada | D | D | Ainda precisa revisão; acabamento vetorial simplificado. |
| Feixes solares | D | D | Ainda precisa revisão; geometria rígida e integração de luz incompleta. |
| Sombras dos móveis | D | D | Ainda precisa revisão; tratamentos e peso visual diferentes. |
| Aura de seleção | D | D | Ainda precisa revisão; anel geométrico sobre a ilustração. |

Rodapés e frisos estavam em C e agora recebem B. Nenhum dos oito itens ambientais da Etapa 1 permanece D ou E. Os demais itens acima foram preservados e não constituem regressões introduzidas pela correção.

### Demais assets e apresentações verificados

| Elementos | Nota atual | Observação |
|---|:---:|---|
| Baú, mesa, urso, trem, porta e piso | B | Mantêm a família artística de referência; repetição do piso e proporções do urso/trem continuam perceptíveis. |
| Tapete central | A | Melhor referência de acabamento e integração. |
| Cubo azul, bloco vermelho em arco, bola e livro decorativos | B | Material e volume coerentes com o conjunto raster. |
| Protagonista parada | B | Identidade ilustrada adequada, resolução aparente mais granulada que parte do ambiente. |
| Protagonista em movimento | C | Apresentação lateral também usada no deslocamento vertical. |
| Sombras dos brinquedos | C | Elipses genéricas; dimensões não acompanham bem o urso e o trem ampliados. |
| Poeira dourada e rastro da fada | B | Cores e escala adequadas ao tema. |
| Poeira dos passos, faíscas e confetes | C | Formas simples e acabamento genérico; ainda legíveis como feedback. |
| Indicador `▼ PEGAR` | C | Legível, mas com caixa rígida de interface. |
| Flash de entrada | B | Tom creme compatível com o ambiente. |
| Contador, botão de ação, joystick e faixas narrativas | C | Unidade interna aceitável; gradientes genéricos e emojis introduzem outra linguagem visual. |

Não há plataformas de salto na Toy Room. Os móveis são obstáculos da fase em vista superior. Arquivos alternativos de personagem e outros elementos não usados da prancha não entram na nota de apresentação da sala.

## Problemas restantes por prioridade

**CRÍTICO:** nenhum defeito crítico funcional foi demonstrado nesta auditoria. A integridade dos arquivos de gameplay e a validação de coleta, colisões e objetivo foram preservadas.

**ALTO**

1. Cinco móveis fora do padrão: estante, armário, poltrona, fortaleza e cavalinho. Grandes áreas da composição ainda têm aparência provisória.
2. Seis brinquedos com acabamento inferior ao urso e ao trem: robô, coelho, patinho, blocos, tambor e caixa de surpresa.
3. Apresentação de carregar: escala do urso/trem, cobertura do rosto e ausência de contato com as mãos.
4. Luz e sombras sem tratamento comum: feixes rígidos, ausência de integração dos personagens e diferenças entre sombras pintadas e elipses genéricas.

**MÉDIO**

5. Fada vetorial e orientação da protagonista no movimento vertical; proximidade da fada com a cabeça na composição.
6. Hierarquia de gameplay: protagonista pequena frente à decoração e aos objetos chapados muito saturados.
7. Aumento de transferência e orçamento de memória; falta de medição em rede lenta, hardware móvel e sessão prolongada.
8. Aura de seleção, poeira de passos, faíscas e confetes ainda genéricos; sombras dos brinquedos desproporcionais em alguns casos.
9. Interface, indicadores e emojis com assinatura diferente da ilustração do cenário.

**BAIXO**

10. Repetição de tábuas, flores do papel de parede e entalhes dos frisos; acúmulo local de textura.
11. Relevo mais acentuado nos novos tapetes, discreta transparência das cortinas e juntas visíveis dos trilhos nas curvas.
12. Sobreposição antiga entre circuito e tapete retangular; integração arquitetônica lateral da porta.

## Resultado final

1. **Evolução visual obtida:** oito elementos ambientais passam a uma família de materiais ilustrados; seis itens antes D/E deixam essas classificações, e rodapés e frisos passam de C para B. A parede deixa de apresentar a área vazia.
2. **Problemas ainda existentes:** a nota global permanece D por acabamento dos móveis e brinquedos, apresentação dos personagens, iluminação, hierarquia e interface. O custo de carregamento e o orçamento de pixels aumentaram.
3. **Recomendação para a próxima etapa:** priorizar móveis e brinquedos, depois apresentação de carregar. Definir um orçamento aceito de transferência e memória antes de ampliar o conjunto raster. Não realizar rearranjo ou alteração de física como parte dessa revisão artística.
4. **Parecer de aprovação:** a correção ambiental pode ser aprovada artisticamente. **A Etapa 1 não recebe aprovação integral sem ressalvas sob o critério estrito de performance inalterada**, pois há aumento objetivo de recursos e orçamento nominal de memória. O FPS estável observado não elimina esse aumento.

Não foram feitas correções, alterações de código, alterações de assets de jogo, mudanças de posições, gameplay ou iluminação. Foram produzidos somente relatório e evidências da auditoria. A próxima implementação não foi iniciada.
