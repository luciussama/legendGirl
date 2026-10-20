# Roteiro: brinquedos e cena da Toy Room em 3D

Data: 19/10/2026. Solicitação do usuário registrada na sessão
`20261019T205052-b1205f7a4e4a`. Status: plano de trabalho; nenhuma arte, malha,
textura ou runtime foi alterado por esta sessão.

## Direção aprovada para o trabalho

Dar profundidade aos brinquedos arremessados pelo urso e converter os brinquedos,
armários e itens visuais da cena para apresentação por modelos 3D. Os modelos
devem conservar a estética ilustrada, a paleta regional e a leitura dos materiais
presentes nos sprites originais. O modelo não deve se tornar uma interpretação
genérica, fotorealista ou de aparência plástica.

A mudança da personagem está **parcialmente aprovada** pelo usuário e será
trabalhada outra vez no futuro. Essa aprovação não se estende a brinquedos, móveis,
fada ou cenário, nem autoriza marcar a personagem como finalizada.

## Limite desta rodada e área de integração

Este roteiro planeja os modelos consumidos pela prévia 3D da perseguição,
`src/js/bear-chase/`. O primeiro objetivo é substituir ali os planos ilustrados e
os proxies simples por malhas/texturas 3D consistentes. As fontes atuais de arte
da Toy Room continuam sendo referências e mapas de textura.

A migração da exploração ou arena 2D para uma apresentação 3D não está incluída
neste escopo: esses modos compartilham móveis, brinquedos, colisões e saves sob
contratos próprios. Qualquer ampliação futura para eles deve ser avaliada e
integrada separadamente, sem alterar esta prévia por efeitos colaterais.

## Inventário inicial a conferir antes da produção

O levantamento final deve cruzar `docs/sprites/inventario.json`,
`docs/sprites/MAPA-SPRITES.md`, `assets/manifest.json`, prompts/READMEs de arte e
todos os consumidores encontrados no código. Os seguintes grupos já aparecem
nos consumidores examinados:

### Brinquedos arremessados pelo urso

`ChaseSimulation` emite `blocks`, `train` e `bunny`; hoje o trem usa
`ChaseToyModels`, enquanto blocos e coelho ainda podem ser planos ilustrados.
Criar modelos coerentes com os originais:

- Blocos empilháveis: madeira pintada, arestas suaves e cores/figuras preservadas.
- Trem: locomotiva de madeira em peças articuladas visualmente legíveis, sem fundo
  retangular; manter o padrão cromático e a leitura de rodas/chaminé do sprite.
- Coelho de pelúcia: volume macio, costuras e detalhes de rosto coerentes com a
  referência, sem converter o tecido em plástico.

O padrão de lançamento, percurso, escala de colisão, largura lógica, tempos,
velocidade, dano e hitboxes permanecem os mesmos. O enquadramento 3D pode mudar
somente a representação visual.

### Brinquedos encontrados na Toy Room

Auditar e representar como modelos, incluindo os casos que também são lançados:

- Ursinho de pelúcia (`environment-sheet.png` e recorte atual).
- Trem de madeira (`environment-sheet.png` e recorte atual).
- Robô retrô.
- Coelho de algodão.
- Patinho de banho.
- Blocos empilháveis.
- Tambor encantado.
- Caixinha surpresa da fada.

Os assets independentes da etapa 3 incluem
`retro-robot-v1.png`, `rocking-horse-v1.png`, `royal-duck-v1.png`,
`cotton-bunny-v1.png`, `stacking-blocks-v1.png`, `enchanted-drum-v1.png` e
`fairy-jack-box-v1.png`. O trem e o ursinho também usam recortes da prancha
`environment-sheet.png`. Confirmar se a etapa 3 tem fontes mais específicas antes
de criar qualquer peça substituta.

### Móveis e objetos da cena

Revisar os móveis descritos em `ToyRoomInitialEntities` e `RoomEnvironmentRenderer`:

- Baú de brinquedos, incluindo tampa e seus detalhes de madeira.
- Estante e livros.
- Poltrona infantil.
- Fortaleza/castelo de blocos.
- Mesa.
- Cavalinho de balanço.
- Armário baixo e armário/guarda-roupa da composição.

Fontes existentes incluem `chest-brinquedos-v1.png` e os assets de etapa 3
`armchair-v1.png`, `bookshelf-v1.png`, `block-castle-v1.png`,
`oak-cabinet-v1.png` e `rocking-horse-v1.png`. O levantamento deve resolver
sinônimos entre IDs lógicos, tipos de renderização e arquivos reais; não presumir
que cada tipo lógico tem um PNG exclusivo.

### Superfícies e adereços ambientais

Auditar os componentes atuais da cena 3D e os materiais de `stage1/`:
papel de parede, janela/cortinas, frisos de carvalho, tapetes e trilho de madeira,
além de detalhes e recortes da prancha ambiental. Superfícies planas podem
continuar sendo planos 3D quando essa for a forma física do material; a meta é
texturizá-las corretamente e integrar suas bordas/espessuras naturais, não forçar
volume onde o original não o possui. Não desenhar linhas auxiliares de pouso,
hitboxes ou réguas sobre os objetos.

Fada, personagens, UI, arquitetura estrutural não listada e inimigos de arena não
são parte da conversão de props nesta etapa. Podem aparecer no comparativo para
avaliar consistência visual, mas não devem ser alterados incidentalmente.

## Roteiro de execução

### 1. Fechar o mapa de referências e contratos

- Listar cada objeto visível, nome lógico, imagem(s) atual(is), hash, tamanho,
  família de material e todos os renderizadores/consumidores.
- Examinar os PNGs de origem e seus prompts/READMEs; diferenciar textura, sombra
  pintada, transparência, recorte e sombra que pertence ao chão.
- Registrar para cada modelo a dimensão visual de apresentação e o ponto de
  origem/apoio, separando-os das dimensões de colisão existentes.
- Conferir duplicação entre arte `stage3`, recortes do `environment-sheet.png`,
  decoração da perseguição e aliases do manifesto.
- Preservar os PNGs existentes e seus hashes. Modelos 3D substituem sua
  apresentação no renderer, não apagam nem reescrevem as fontes aprovadas.

### 2. Fazer uma prova visual pequena, antes de escalar

Produzir um brinquedo arremessado e um móvel representativo de materiais e
silhuetas diferentes (proposta: trem e armário de carvalho). Montar um comparativo
com sprite de origem e modelo:

- vista neutra e vistas frontal, lateral, traseira e três-quartos;
- escala e câmera reais da perseguição, além de close apenas para inspeção;
- luz neutra e iluminação efetiva do quarto;
- amostras das cores e materiais por região, sem reduzir o objeto a cores
  aproximadas em material uniforme;
- textura/malha em movimento e oclusão real, inclusive no voo do brinquedo.

Solicitar avaliação humana desta prova antes de criar em lote. Critérios:
silhueta e identidade reconhecíveis, distribuição de cores fiel, material
plausível (pelúcia, madeira pintada, madeira natural, tecido), ausência de halos,
fundos retangulares e faces sem acabamento. Aprovação parcial ou rejeição abre
refinamento desta prova; não avançar para a conversão completa por aprovação
técnica isolada.

### 3. Construir catálogo e famílias reutilizáveis

- Extrair modelos em módulos por responsabilidade, mantendo `ChaseRenderer3D`
  como compositor e definindo proprietário claro dos recursos GPU.
- Compartilhar geometrias e materiais por instância/catálogo, sem duplicá-los por
  brinquedo ativo ou setor reciclado.
- Usar geometria específica nas silhuetas principais; aplicar texturas derivadas
  das fontes originais em regiões identificáveis, com UVs auditáveis.
- Usar detalhes geométricos para costuras, rodas, puxadores e bordas apenas onde
  contribuam para leitura em escala de gameplay.
- Preservar transparência e detalhes pintados úteis, mas eliminar o cartão inteiro
  quando houver fundo opaco indesejado; não achatar novamente a silhueta final.
- Definir limites de resolução, draw calls, materiais e memória por objeto e para
  a cena total antes de expandir o catálogo.

### 4. Substituir a apresentação dos brinquedos

Integrar primeiro os três objetos arremessados com catálogo de modelos; depois
usar os mesmos modelos ou as mesmas fontes de material para os coletáveis da sala.
Validar que cada brinquedo continua:

- no mesmo ID/tipo lógico, posição, escala global de jogo e âncora visual;
- sujeito aos mesmos eventos, padrões, saves, coleta e apresentação de transporte;
- legível quando parado, carregado, organizado e arremessado, sem modelo duplicado
  incompatível entre estados;
- livre de interseções visuais ou mudanças de tamanho aparente que escondam
  obstáculos sem mudar a hitbox.

### 5. Substituir a apresentação dos móveis e itens ambientais

Modelar cada móvel com faces completas e material contínuo em todas as vistas
visíveis da câmera. Aplicar madeiras, tecidos, pintura, papel e detalhes conforme
as referências originais. Reaproveitar a textura de parede/piso em superfícies
3D; representar geometria que já faz parte do objeto sem caixas genéricas ou
suportes técnicos expostos. A cena deve continuar reconhecível como a mesma Toy
Room, inclusive nos módulos reciclados e nas mudanças de enquadramento.

### 6. Integrar, medir e revisar

- Ligar a nova apresentação à fase sem transferir decisões de simulação ou estado
  para os modelos.
- Manter movimentos, colisões, distâncias, obstáculos, RNG, saves, duração,
  checkpoints e dificuldade idênticos.
- Verificar culling/visibilidade com rotação de câmera, iluminação, transparência,
  texturas ausentes, perda/restauração de WebGL e descarte de recursos.
- Executar percurso de gameplay completo; conferir que o brinquedo é visto e
  permanece visualmente igual durante lançamento, queda, contato e remoção.
- Fazer revisão humana em escala real e depois de novo em quadros estáticos. Não
  chamar uma fase de “aprovada” apenas porque passou no teste automatizado.
- Atualizar manifesto, inventário, mapa e guia de designers após mudanças visuais;
  reconstruir mapa com `npm run docs:sprites`.

## Critérios de aceite

1. Todo brinquedo arremessável e todo móvel/prop dentro do escopo visualizado pela
   prévia tem modelo 3D com profundidade real; nenhum substituto é um cartão plano
   com fundo perceptível.
2. A aparência é fiel aos sprites de origem em paleta regional, silhueta,
   distribuição de material, detalhes e proporção. As fontes originais permanecem
   intactas.
3. Todas as vistas efetivamente usadas na câmera têm acabamento coerente;
   as vistas não fornecidas pelos sprites originais são interpretações novas e
   precisam de avaliação humana.
4. Não há alteração em hitboxes, posições lógicas, escala de colisão, controles,
   padrões de lançamento, dificuldade, save ou regras da fase.
5. A geometria, texturas e materiais são reutilizados e descartados com segurança;
   recursos totais, draw calls e tempo de quadro respeitam orçamento medido.
6. Testes de assets/build e regressões relevantes passam; inventário/mapa refletem
   os novos consumidores; validação técnica e aprovação artística ficam registradas
   separadamente no diário.

## Não fazer

- Não modificar os sprites originais para “pintar” neles a profundidade do modelo.
- Não inventar paleta/material por conveniência nem trocar o estilo por PBR
  fotorealista, plástico liso ou geometria genérica.
- Não expandir a migração à menina parcialmente aprovada, à fada ou a fases 2D sem
  nova solicitação e avaliação do impacto.
- Não mudar colisões ou hitboxes para acomodar a silhueta do modelo.
- Não apagar assets, prompts, inventário ou evidências históricas; não usar recursos
  aposentados como fallback.
- Não chamar serviços pagos nem consumir créditos automaticamente. Se uma
  ferramenta externa exigir pagamento, parar e solicitar autorização pessoal do
  usuário na plataforma correspondente.

Este plano não autoriza commit, push, geração de arte nem integração da conversão.
