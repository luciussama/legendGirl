# Percurso contínuo e catálogo completo

Sessão `20261020T154508-0ea59f401567`, Codex, 20/10/2026.

## Pedido e diagnóstico

Após aprovação dos refinamentos, usuário autorizou concluir os oito objetos
restantes e corrigir a sala repetida, adicionando curvas e morros à dificuldade.
A janela anterior reposicionava os mesmos doze módulos em cada avanço de 12 m,
mantendo a decoração ligada ao índice relativo. Assim, um móvel mudava no mesmo
ponto do percurso. O problema incluía identidade dos módulos, além da repetição
artística. A instrução atual autoriza mudar traçado/padrões, ampliando o escopo
do plano anterior. Fases 2D, plataformas e campanha não foram modificadas.

## Implementação

- `ChaseRoute`: interpolação Hermite, referenciais, inclinação e curvatura, sem
  dependência gráfica. Distância longitudinal continua como progressão e save.
- `ChaseRoom`: seis superfícies contínuas de piso/teto/paredes/rodapés, amostradas
  a cada metro, com UVs longitudinais. Adereços fixos, junto às paredes, com
  visibilidade distante limitada além da neblina. Não há reciclagem à frente.
- Renderer: menina, urso, fada, brinquedos, baú e câmera no mesmo traçado;
  sombra/móveis acompanham as rampas. Luz existente preservada.
- Simulação: deriva externa proporcional à curvatura e velocidade, menor no
  FÁCIL; velocidade de rampa limitada a 84–112% da base. Nove alvos de emboscada
  em 82, 148, 208, 274, 338, 404, 468, 538 e 603 m, lançados 20 m antes.
  Faixa interna livre e padrões próximos suspensos para evitar grupos apertados.
  RNG continua determinístico, mas sequências mudam intencionalmente.
- `DecorativeProps`: oito fábricas por composição para ursinho, robô, pato,
  tambor, caixa de surpresa, poltrona, cavalinho e mesa. Quinze IDs completos;
  novos objetos decorativos, sem novos tipos no gerador de obstáculos.
- Materiais: quatro atlas existentes compartilhados por regiões e tecido da
  poltrona por UV de região limpa do original. Nenhum PNG alterado ou gerado.
  Silhuetas e detalhes são interpretações simplificadas sujeitas à revisão.
- Painel: quinze fontes/modelos, quatro vistas, escala e controle de distância.
  Guia de prévia atualizado com arquitetura e mudança de dificuldade.

## Validação e correções

`npm test` passou: regressões gerais, defesa, progressão/bailarina e oito percursos
do domínio, incluindo RNG/save. Executado após mudanças da simulação; refinamentos
posteriores foram visuais e cobertos no navegador. `test:bear-chase:browser` passou
com teclado/toque CDP, áudio/mudo, pause/snapshot, percurso até COMPLETE, campanha
preservada e descarte zero.

Novo `test:bear-chase:route`, via `journal:qa`, em workspace temporário e servidor
127.0.0.1, verificou:

- Quinze modelos com volume, apoio e recursos compartilhados; duas a seis chamadas
  por modelo. Quatro vistas capturadas dos oito novos objetos.
- Identidade/posição dos adereços em 1.441 amostras; recursos estáveis abaixo de 300.
- Dezoito enquadramentos de corrida em desktop/retrato/paisagem e 36 cenários
  finais com baú enquadrado, dentro da parede e fora da faixa central.
- Raycasts para as três faixas a 14 m das nove emboscadas, sem parede bloqueando.
- Percursos automáticos NORMAL/FÁCIL sem dano, 35 brinquedos lançados, decisões a
  cada 300 ms. Bot consulta estado; não simula visão ou julgamento humano.
- Perda/restauração WebGL com estado e recursos preservados, ausência de erros
  de execução/rede e descarte idempotente em zero.

Inspeção visual corrigiu escala das tábuas, cores do robô/caixa, tecido da poltrona
e alinhamento à rampa. Um retângulo claro sob a menina foi identificado após QA
numérico aprovado: piso opaco e sombra sem escrita de profundidade corrigem a
ordenação. QA repetido após a correção; sucesso numérico não comprova arte.

Cena com aproximadamente 199 recursos próprios, antes 128 no lote anterior,
abaixo do limite de 300. Quadros de referência cerca de 100–135 chamadas, antes
282–284 com três brinquedos. São cenários diferentes, não benchmark de FPS/VRAM.
A superfície contínua reduz chamadas, mantendo a malha inteira carregada.

Build/lint, 66 assets, sintaxe dos módulos, mapa e diff aprovados. Mapa: 420
arquivos, 99 recortes, 29 assinaturas. Capturas regeneráveis identificadas por
caminho/hash/tamanho antes do descarte; artes de produção preservadas.

## Limites

E5/E6 implementados e regressão técnica E7 executada. Falta avaliação humana da
dificuldade e acabamento dos oito objetos. Sem hardware físico, Safari/Firefox
ou medição FPS/VRAM. Iluminação, campanha, duração definitiva e áudio final
continuam separados. Prévia pelo debug; sem commit, push, publicação, dependência
nova ou serviço pago.
