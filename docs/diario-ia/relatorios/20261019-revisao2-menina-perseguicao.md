# Revisão 2: paleta, silhueta, acabamento, movimento e apresentação

Sessão `20261019T193929-09884af19ec9`. Execução da priorização autorizada pelo
usuário após reprovação expressa da primeira menina. Essa reprovação permanece
preservada; a revisão 2 não possui aprovação humana.

## Mudanças efetivamente entregues

1. **Paleta por região:** `scripts/prepare-chase-palette.js` extrai medianas 7×7 de
   pixels com alfa ≥ 240 do run-sheet atual da arena. `paleta-menina.json` registra
   fonte, hash, coordenadas, método e cores; `ChaseGirlPalette.js` é derivado.
   Pele `#f7b090`, tecido claro `#fce4c0`, salmão `#f2a393`, sombra da roupa
   `#a96458`, cabelo `#4d281b`, mecha `#7b4c3b`, bota `#643125`, guarda
   `#74858b`. Valores são amostras identificadas, não uma declaração de paleta
   oficial de todas as fases. A roupa agora usa salmão no corpo/mangas/saia,
   com corpete e painel frontal claros, sem transformar toda a peça em creme.
2. **Silhueta:** corpo mais compacto, vestido com regiões e borda/pregas próprias,
   cabeça/face, mangas, franja oblíqua e rabo único da família da arena revistos.
   Mechas extrudadas com curvas e rabo varrido em profundidade, membros afunilados
   com junções, botas e espada de madeira. Há 54 instâncias, sem plano de personagem.
   As vistas de costas são interpretações novas; as referências atuais não dão
   uma vista traseira aprovada. Exploração e arena são mostradas separadamente.
3. **Acabamento:** materiais foscos com sombras discretas nos vértices e luz branca
   controlada, evitando o amarelamento pela luz quente forte anterior. Houve
   inspeção visual de versões intermediárias: a primeira extrusão ficou angular
   e plana demais; contornos foram suavizados, luz recalibrada e normais da touca
   e da mecha corrigidas para remover faces internas aparentes. Isso não certifica
   identidade; é a proposta renderizada para nova avaliação do usuário.
4. **Passada/desvio:** pernas resolvem quadril/joelho/tornozelo para apoio no piso,
   com recuperação elevada e transferência de peso. A inclinação/yaw responde à
   velocidade lateral e retorna ao eixo ao cessar o desvio, em vez de depender de
   estar parado numa faixa lateral. Cabelo e saia acompanham. Braços portam espada
   à frente, conforme a família de corrida da arena, em vez de corrida atlética
   de braços soltos. Cadência dos arquivos de passos preservada.
5. **Apresentação:** trem volumétrico remove o cartão com fundo preto; urso ganhou
   volume com pose caída, levantar, corrida para -Z, olhar para trás e gesto de
   lançamento, mantendo captura/retorno definidos pela simulação. Fada ilustrada
   é apresentada atrás/acima da menina; sombra suave ajuda o apoio, sem régua ou
   hitbox. Janelas, móveis e tapetes têm arranjos assimétricos; móveis têm suporte
   estreito texturizado em lugar das caixas marrons profundas. Texto de cutscene
   saiu do centro da atuação. Não houve expansão de duração nem mudança de colisão.

A simulação, quantidade/tempo dos padrões, velocidade, hitboxes, saves e fluxo de
campanha não foram alterados. O modo continua prévia isolada. Fada, blocos/coelho
 e baú conservam ilustrações; a assimetria não equivale a trechos temáticos novos.
Modelagem do urso também requer avaliação humana e pode precisar de refinamento.
Nenhum sprite original foi recolorido, apagado ou substituído nas fases anteriores.

## Comparação solicitada

Página local `docs/diario-ia/qa/perseguicao-20261019/comparacao.html` + `comparacao.js`:

- sprites atuais de exploração e arena identificados e modelo sob luz branca neutra;
- sprite lateral da arena no quarto e modelo na câmera real da perseguição;
- escala de leitura de gameplay, sem esconder o resultado num close;
- controles de repouso/corrida, animação/congelamento e lateral/frente/costas/três quartos;
- aviso explícito de que costas são interpretação nova e a fonte é lateral.

A fonte da arena mantém a luz pintada; não há como “reluminar” o sprite sem mudar
seus pixels. A comparação neutra refere-se à luz do modelo e ao fundo de avaliação.
O modelo tem sombras 3D, portanto material RGB igual não implica pixel final igual.
A página está no acervo de QA, fora da publicação do jogo, servida por npm run dev:
`http://localhost:3000/docs/diario-ia/qa/perseguicao-20261019/comparacao.html`.

Foi tentado abrir uma aba nativa no Chrome. A ferramenta detectou alteração
concorrente do usuário durante a entrada do endereço; não continuei sobrescrevendo
a entrada. A disponibilidade da comparação foi verificada no navegador isolado,
sem afirmar que a aba de trabalho do usuário ficou aberta no endereço correto.

## Resultados reais de validação

- `npm test`: aprovado, incluindo fases anteriores, defesa, saltos e oito percursos
  de domínio da perseguição (NORMAL/EASY × quatro dt). Saídas preservadas nos
  pacotes automáticos do diário, não apenas no log temporário local.
- `test:bear-chase:browser`: aprovado em 1280×800, 390×844 e 844×390, teclado,
  toque, snapshot/pause, 12 passos carregados, mudo, save de campanha preservado,
  percurso controlado até COMPLETE sem dano e descarte com zero recursos próprios.
  Pico 279 recursos GPU (limite existente 300), 308 chamadas no quadro desktop.
- `journal:qa -- test:bear-chase:comparison:browser`: aprovado na apresentação final.
  Paleta dos materiais coincide com o derivado; desvio responde e se dissipa;
  apoio máximo observado a 0,001 unidade do piso em 80 amostras do ciclo;
  trem sem planos, fada Z positivo e urso com profundidade. Sem exceções/HTTP falhos.
  Inspeção visual da comparação em tamanho de gameplay realizada.
- `journal:qa -- test:bear-chase:girl:glb`: aprovado no arquivo final, 848.268 bytes,
  54 instâncias, 29 malhas compartilhadas, 11 materiais usados e pivôs preservados.
  GLB em pose de autoria, sem clipes; execução usa o construtor e o animador JS.
- QA de volume em três ângulos foi executado durante refinamento: 54 instâncias,
  zero planos, 33 recursos próprios, poses repetidas estáveis e movimento detectado.
  Seu limite de recursos foi atualizado de 25 para 50 porque tecidos e mechas
  passaram a ter geometria autoral, com histórico anterior preservado. O orçamento
  global da perseguição de 300 não foi relaxado.
- `npm run docs:sprites`: 416 imagens, 99 recortes, 29 assinaturas; referência de
  métodos: 123 módulos/870 declarações. Build, check-assets, lint, sintaxe dos
  módulos/geradores novos e git diff --check aprovados.

O extrator falhou inicialmente ao exigir alfa 255: a fonte usa predominantemente
alfa 253 nas áreas internas. O limiar documentado ≥240 e erro explícito para região
vazia resolveram isso. O GLTFExporter advertiu sobre normalização de normais e
concluiu; integridade do arquivo foi verificada. Não ocultar esses resultados.

Metadados das capturas regeneráveis finais, preservados também nas saídas do QA:

| Arquivo temporário | Bytes | SHA-256 |
| --- | ---: | --- |
| `/tmp/legendgirl-comparacao-v2.png` | 353620 | bade976c0947859d9d7183acede64de08d388f894d55d9a630ebd5e31f278ffb |
| `/tmp/legendgirl-chase-1280.png` | 804406 | ee3b258511cd63f4b10f5db7feab18727d5ea8f6456e74b8f7e48440e8ca8b23 |
| `/tmp/legendgirl-chase-390.png` | 397989 | b9b80bd759cfe06f2204b83ed119d6ac26e08a5c2c574125f64d95a82c4a8ccd |
| `/tmp/legendgirl-chase-844.png` | 450864 | 5655f2749e28022401e187d741f86dfd0043e4b5519f3aeb22ff5d9fe1ed9d73 |

Capturas temporárias descartadas após inspeção; as fontes de regeneração ficam no
acervo. O GLB e a paleta são artes/recursos de produção e foram preservados.

## Limites e pendências

Os percursos completos foram automatizados com estado consultado e avanço
controlado; não houve nesta sessão um novo playtest humano contínuo de 100 s.
Não certificam dificuldade, desempenho móvel, Safari ou aparelhos físicos.
A identidade e o acabamento da revisão 2, assim como o novo urso, aguardam avaliação
do usuário com a comparação entregue. A implementação reduz a repetição modular;
expansão em ambientes temáticos dentro do quarto e integração na campanha seguem
pendentes da etapa maior. Não houve serviço pago, cobrança, commit ou push.
