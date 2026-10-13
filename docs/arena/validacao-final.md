# Validação final da arena imaginária

13/10/2026 · branch `feat-arena` · alterações locais, sem commit ou push.

Os 15 cards foram implementados e validados em sequência. A exploração preserva seu layout, colisões, brinquedos, tutorial e controles. Após a espada, uma transformação temporizada abre a interpretação heroica da própria sala. O tapete forma o campo de batalha, a estante vira fortaleza, o baú vira templo e a janela ocupa a cena como portal.

A arena tem fase, builder, câmera, controller, efeitos, perfil de áudio, HUD e direção do chefe próprios. Reutiliza a simulação do combate existente com parâmetros locais, sem criar outro jogo. As sprites válidas anteriores permanecem nos arquivos; os recortes detalhados de `battle/girl/runtime` foram recuperados seletivamente do commit `c602891` para a protagonista da arena.

## Aprovação técnica

- `npm test`: aprovado, incluindo os testes novos da arena.
- `npm run test:toy-room:qa`: aprovado; 36 percursos de exploração, narrativa, espada e saves.
- `npm run test:battle:polish`: aprovado.
- `npm run test:battle:fairness`: aprovado; o combate legado conserva sua certificação.
- `npm run build`: aprovado, incluindo compatibilidade com subpasta do GitHub Pages.
- `npm run test:toy-room:arena:browser`: aprovado em desktop, Android retrato e Android paisagem.
- Teclado, joystick, gamepad, pausa, repertórios completos, esquivas, derrota e nova tentativa validados.
- Save/load antes da transformação, durante ela, dentro da arena, durante combate, pós-chefe, durante retorno e depois do retorno; migração de saves antigos validada.

O navegador percorreu coleta, baú, recorrência, investigação, busca da espada, transformação, Trem, Robô, Dinossauro, Urso e retorno automático. Todos os recursos do manifesto carregaram. Nenhuma exceção JavaScript ou falha HTTP de recursos foi registrada. A instrumentação confirma que os recortes detalhados foram efetivamente desenhados e que o render não altera o estado persistido.

| Perfil | Coletas | Quadros de combate | Amostras de render | Mediana | p95 |
| --- | --- | --- | --- | --- | --- |
| desktop | 11 | 1437 | 408 | 5.6 ms | 7.6 ms |
| android | 11 | 1437 | 407 | 2.9 ms | 4.9 ms |
| android-paisagem | 11 | 1437 | 407 | 3.6 ms | 5.5 ms |

As medições incluem sincronização do canvas por leitura de pixels, em Chrome no computador de desenvolvimento. Os perfis Android são emulados; esta aprovação técnica não substitui a revisão final em aparelho físico. Os efeitos têm limite de 80 partículas.

## Revisão visual

Capturas inspecionadas: transformação, arena, ataque, fúria do guardião, salto, agachamento, derrota, retorno e exploração restaurada. O enquadramento em paisagem foi ajustado para preservar o tamanho heroico sem ocupar toda a faixa inferior com reserva de controles. A frente do templo encobre os brinquedos durante suas transições; nenhuma régua de pouso ou hitbox foi desenhada sobre as ilustrações.

- [Arena e Guardião em fúria](../qa/toy-room-arena/desktop-arena-bear-furia.png)
- [Android retrato](../qa/toy-room-arena/android-arena-bear-movimento.png)
- [Android paisagem](../qa/toy-room-arena/android-paisagem-arena-bear-movimento.png)
- [Transformação](../qa/toy-room-arena/desktop-transformacao.png)
- [Retorno à Toy Room](../qa/toy-room-arena/desktop-final.png)

## Como revisar

Com o servidor em `http://127.0.0.1:3001`, abra `/tests/toy-room-arena.html`. O botão “Percorrer exploração → arena → retorno” executa o fluxo completo com os runners de inputs reais. Também é possível jogar usando setas/WASD, Espaço/X, toque ou gamepad. A produção usa a arena por padrão.

Para regenerar as evidências, execute o servidor com `PORT=3001 npm run dev`, inicie um Chrome isolado com `--remote-debugging-port=9222 --user-data-dir=/tmp/legendgirl-arena-review` e rode `npm run test:toy-room:arena:browser`. JSONs, PNGs e logs são gravados em `docs/qa/toy-room-arena`, pasta de evidências locais ignorada pelo Git.

A implementação está pronta para a validação humana final solicitada. Não foi realizada publicação, commit ou push.
