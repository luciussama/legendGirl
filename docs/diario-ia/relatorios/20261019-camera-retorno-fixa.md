# Remoção do ajuste de câmera por salto no retorno

Sessão `20261019T122138-031808675e39`, Codex, 19/10/2026.

## Pedido e alteração

O usuário rejeitou o pequeno reenquadramento por salto na segunda parte do clímax. O escopo aplicado é o gameplay do retorno após a porta falsa (`isPhase3`), preservando narrativa, tutorial e transição do portal.

O desenho desse trecho deixa de usar a recuperação visual após pouso, o rastreamento vertical do arco do salto, o zoom lógico de recuperação e o offset contextual Android. A escala móvel continua em 0,8, com deslocamento fixo de 32% da largura; deixa de corrigir sua posição ao chegar às bordas. O enquadramento acompanha a rolagem horizontal base e uma trajetória vertical contínua calculada entre as extremidades do cenário. Essa trajetória depende apenas da posição horizontal da câmera e do viewport: não muda com altura/velocidade da menina, fada, contato ou índice da plataforma. Não existe novo alvo a cada pouso.

A última pose desenhada permanece registrada em `CameraPresentation` para a próxima transição narrativa. A câmera lógica usada pelo teto, derrota e simulação continua intacta. Nenhuma alteração foi feita na física, geometria, alcances ou curva de dificuldade. Qualquer necessidade de ajuda adicional deve ser avaliada posteriormente, conforme solicitado.

Arquivos de produção: `CameraPresentation.js`, `MobileZoom.js` e `DarkRoomRenderPipeline.js`. Guias e contexto vigente foram atualizados. As modificações anteriores da bailarina e os demais arquivos já alterados foram preservados.

## Verificações

- `test:camera:retorno:browser`: 288 variações em 16 apoios × três perfis (desktop, Android e iPhone emulados). Em cada posição horizontal, a matriz de renderização permanece idêntica entre chão, subida, ápice, troca de apoio, deslocamento da fada e variação do zoom lógico. Renderizar não altera a personagem. Os 48 cenários de apoio mantêm a personagem no viewport; a trajetória não apresenta descontinuidade nas amostras verificadas. Capturas de início, meio e final foram preservadas por hash no diário; início móvel e final desktop foram inspecionados.
- `npm test`: aprovado, incluindo contratos do zoom móvel, geometria/física, progressão, bailarina, persistência, sala e arena.
- `test:jogabilidade:browser`: seis percursos finais aprovados, NORMAL/EASY × desktop/Android/iPhone emulado, 38 apoios por percurso, exploração, recargas e os quatro inimigos. Essa automação consulta estado e procura o instante de salto; é verificação funcional complementar, sem certificar a sensação humana.
- `npm run build`: aprovado. `git diff --check`: aprovado.

Uma tentativa intermediária de centralizar a imagem móvel em 10% da largura falhou no contrato existente de 32%; foi retirada. A posição original de antecipação foi preservada como constante, removendo somente sua correção contextual. A expectativa histórica que exigia recentralizar a menina junto à borda foi substituída por invariância do enquadramento; a versão anterior permanece no acervo.

Os testes focados usam checkpoints preparados e renderização da produção, com variações controladas de estado para verificar invariância. Não são avaliação de percepção humana nem certificação de Android físico ou Safari. Não atribuem nota de dificuldade.
