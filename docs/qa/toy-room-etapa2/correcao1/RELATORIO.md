# Toy Room — Etapa 2, Correção 1

## Resultado e ponto de parada

O sistema de carregar passou de **E para B na avaliação técnica e visual interna**. A aprovação do usuário está pendente. Somente a Correção 1 foi implementada. A Etapa 2 completa permanece em andamento; Coelhinho, poltrona e cavalinho ainda não foram refeitos.

A instrução recebida exige: **“Não prosseguir para o próximo item sem aprovação do anterior.”** Por isso, a implementação para neste ponto para avaliação da apresentação de transporte.

## Antes e depois

Antes, a pose de coleta erguia os braços e o brinquedo era desenhado sobre o rosto e tronco, na posição lógica atualizada pelo controlador. Não havia contato convincente com as mãos.

Agora, uma pose específica apresenta braços dobrados e palmas sob a carga. Cada brinquedo possui escala e offset próprios, fora da silhueta da cabeça. Os dedos são desenhados em primeiro plano para comunicar sustentação. Personagem, mãos e brinquedo espelham juntos ao virar à esquerda. A carga e os braços compartilham a oscilação leve do movimento; as pernas reutilizam o ciclo oficial de corrida.

As posições lógicas dos brinquedos continuam exatamente iguais. A transformação acontece apenas na renderização. Nenhum parâmetro de peso, velocidade, coleta, colisão, objetivo ou progressão foi alterado. Brinquedos no chão conservam sua arte, escala e posições anteriores.

| Transporte do brinquedo | Antes | Depois | Leitura observada |
| --- | --- | --- | --- |
| Ursinho Pipoca | E | B | Pelúcia apoiada nas palmas, cabeça da protagonista livre. |
| Trenzinho Real a Vapor | E | B | Apoio sob a locomotiva; extensão do vagão comunica brinquedo rígido. |
| Robô Estelar Faísca | E | B | Base sustentada; antena afastada do cabelo. |
| Coelhinho de Algodão | E | B | Corpo apoiado e orelhas ao lado da cabeça, sem sobreposição. |
| Patinho de Banho Imperial | D | B | Base do corpo apoiada; bico acompanha a direção. |
| Torre de Blocos Coloridos | D | B | Mãos sob a base da torre. |
| Tamborzinho Encantado | D | B | Apoio sob o tambor, sem atravessar os braços. |
| Caixinha de Surpresa da Fada | D | B | Caixa sustentada pela base; parte superior livre. |

As notas acima avaliam **transporte**, não aprovam a arte dos brinquedos. O Coelhinho continua E como asset ilustrado até a Correção 2. O mesmo vale para outros placeholders identificados na auditoria anterior.

## Evidências

- [Comparativo visual navegável](comparacao.html).
- [Antes: oito brinquedos nas duas direções](antes.png) e [depois](depois.png).
- [Matriz de estados antes](estados-antes.png) e [depois](estados-depois.png).
- [Coelho coletado pelo controlador antes](coelho-jogo-antes.png) e [depois](coelho-jogo-depois.png).
- Enquadramentos [desktop](desktop.png), [Android em paisagem](android-paisagem.png) e [celular em retrato](celular-retrato.png).
- [Resultados automatizados](validacao.json) e [checagem de pixels da cabeça](cabeca-validacao.json).

As matrizes usam dados controlados para permitir comparação dos mesmos estados. A coleta real do coelho utiliza movimentos e `triggerAction()` existentes. Os testes dos oito itens posicionam a personagem como preparação do cenário e exercitam as ações do controlador real; isso não altera o layout do jogo.

## Validação funcional

`node scripts/test-toy-room-carry-browser.js` aprovado:

- 8 coletas, 8 solturas e 8 armazenamentos no baú.
- 960 quadros de movimento comparados com o controlador anterior, nas quatro direções.
- 4.941 amostras de colisão idênticas à referência.
- Vitória após armazenar os oito brinquedos.
- Métodos `update`, `triggerAction`, `resolveCollisions`, `snapshot` e `restore` idênticos à versão anterior.
- Renderização sem alteração do estado em todos os quadros exercitados.
- 32 verificações de cabeça: oito itens × duas direções × parada/movimento, sem pixels sobrepostos na região superior avaliada.
- 74 recursos carregados sem falhas.

`npm test`, `npm run check-assets`, verificação de sintaxe dos novos módulos e `git diff --check` aprovados.

Não existe modo de caminhada/corrida com velocidades distintas nesta fase. Foram verificados estados parado e em movimento e diferentes pontos do ciclo oficial de corrida, preservando a velocidade existente.

## Performance e riscos

A medição local do transporte preservou a cadência de aproximadamente 16,7 ms por quadro. A mediana de desenho ficou próxima de 0,1 ms; o percentil 90 passou aproximadamente de 0,1 para 0,2 ms. Não foi detectada regressão de cadência neste Chrome de teste. Isso não demonstra custo absolutamente idêntico nem substitui avaliação em um celular físico.

Foi acrescentada uma imagem PNG de 69.753 bytes e 167 × 256 px, equivalente a 171.008 bytes de pixels RGBA nominalmente decodificados. Essa estimativa não mede memória total do navegador.

Pontos para aprovação visual:

1. Os brinquedos carregados usam escala menor que no chão para caber nas mãos e liberar a cabeça. A mudança de escala ao pegar/soltar é imediata, assim como a transição existente; não foi acrescentada interpolação.
2. A pose de transporte foi derivada da referência oficial por `imagegen`, com identidade, paleta e roupa correspondentes. A fidelidade artística fina deve ser avaliada no comparativo pelo usuário.
3. A extensão visual dos antebraços e o recorte de dedos sustentam a carga sem alterar o atlas oficial. A combinação com pernas animadas é uma composição de sprites, não uma animação inédita quadro a quadro.
4. Direções para cima/baixo mantêm a convenção lateral existente da personagem. Não foi criado um novo conjunto de vistas direcionais.
5. Fada, partículas e demais assets permanecem como estavam; suas questões da auditoria anterior não foram corrigidas nesta intervenção.
6. Se o novo recurso não estiver disponível, o renderizador preserva a apresentação antiga para não ocultar a carga. A nova apresentação exige carregamento bem-sucedido da pose, confirmado nos testes.

O reconhecimento por jogadores novos e crianças não foi medido. A nota B é julgamento de inspeção visual, não resultado de pesquisa com usuários.

## Arquivos e origem da arte

Implementação em `src/js/toy-room/ToyCarryPresentation.js`, integração em `ToyRoomEntities.js` e exclusivamente no bloco de renderização da personagem de `ToyRoomPhase.js`. Registro do recurso em `assets/manifest.json`.

Pose em `assets/art/toy-room/stage2/carry-pose-v1.png`. Ferramenta integrada `imagegen`; referência `assets/art/dark-room/sprites/official-character.png`; prompt preservado em `assets/art/toy-room/stage2/prompts.json`. O atlas original não foi modificado.

As cópias `ToyRoomEntities-antes.txt` e `ToyRoomPhase-antes.txt` congelam a referência deste comparativo, sem substituir os módulos do jogo.

## Próximos itens autorizados, sujeitos à aprovação anterior

1. Correção 2: reconstrução do Coelhinho e comparação com Ursinho e Trem.
2. Correção 3: poltrona vermelha com silhueta inequívoca.
3. Correção 4: cavalinho de balanço reconhecível.
4. Correção 5: auditoria final dos quatro itens.

Nenhum desses itens foi iniciado. Os demais candidatos da auditoria anterior permanecem fora desta intervenção.
