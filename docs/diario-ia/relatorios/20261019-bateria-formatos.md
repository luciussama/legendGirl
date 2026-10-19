# Bateria de jogabilidade em formatos e modos — 19/10/2026

Sessão `20261019T124120-b85e3d717fa6`, Codex. Workspace da branch `fix-balanceamento-luta`, incluindo as correções anteriores da bailarina e do enquadramento. Modificações existentes preservadas. Esta rodada amplia o QA; não altera o código de produção ou o balanceamento.

## Resultado

Foi possível concluir os percursos em todos os formatos e modos executados. Não foi reproduzido bloqueio funcional que exigisse correção no jogo. A bateria complementar final passou integralmente em execução isolada; as duas falhas iniciais de espera não se repetiram. Isso é compatível com interferência da execução simultânea sob carga, sem estabelecer uma causa única comprovada. Nenhum prazo ou requisito foi relaxado.

## Campanhas completas

Foram concluídos 16 percursos completos: oito perfis × NORMAL/EASY. Cada percurso atravessou os 22 apoios da ida, 16 do retorno, castelo, porta falsa, tutorial de retorno, portal, exploração, investigação, espada, transformação, Trem, Robô, Dinossauro, Urso e retorno à sala. Total: 608 saltos entre apoios, 176 coletas e 96 restaurações da exploração. Não houve exceções JavaScript ou recurso indisponível nos percursos aceitos.

| Formato | Viewport CSS | NORMAL | FÁCIL |
| --- | --- | --- | --- |
| Desktop | 960×540 | Concluído | Concluído |
| Android retrato | 390×844 | Concluído | Concluído |
| iPhone retrato | 390×844 | Concluído | Concluído |
| Android paisagem | 844×390 | Concluído | Concluído |
| iPhone paisagem | 844×390 | Concluído | Concluído |
| Tablet retrato | 768×1024 | Concluído | Concluído |
| Tablet paisagem | 1024×768 | Concluído | Concluído |
| Celular compacto | 320×568 | Concluído | Concluído |

## Cobertura complementar

- Suíte padrão (`npm test`): aprovada. Inclui física/colisões, dificuldade, salto da bailarina, narrativa, persistência, dispositivos, exploração, arena e defesa.
- Matriz de entradas: 48 combinações de NORMAL/EASY, teclado/gamepad/toque, quatro inimigos e dois lados. Defesa frontal, salto diagonal, espada simultânea, agachamento, restauração, pausa, foco e desconexão aprovados.
- Arena em desktop, Android retrato e paisagem: exploração, quatro adversários, vitória, derrota/nova tentativa e retorno aprovados pelo teste específico. As medianas de renderização são medições locais da automação; não medem FPS de aparelho físico.
- Toque nativo CDP: defesa, arraste do direcional, salto diagonal, segundo dedo na espada e soltura aprovados em 390×844, 844×390, 768×1024, 1024×768, 320×568 e 568×320.
- Tutorial na página real: 18 cenários em Android/iPhone/desktop, com novas campanhas, migração de saves, retomada e primeiro salto por teclado/toque. Todos aprovados na repetição isolada.
- Persistência: NORMAL/EASY, mais 76 saltos, pausa, salvar/restaurar e recarga real da página aprovados.
- Câmera: 288 variações de salto/pouso e 48 apoios apresentados em três perfis; bailarina: nove saltos com teclado/toque aprovados, além das 24 combinações da suíte.
- Build, verificação dos 66 recursos registrados e `git diff --check`: aprovados.

Capturas inspecionadas: retorno intermediário em Android paisagem, chegada ao portal em celular compacto e tablet paisagem, defesa em celular compacto retrato e paisagem. Seus hashes e tamanhos foram preservados pelo executor temporário; bitmaps regeneráveis foram descartados do projeto.

## Falhas iniciais e repetição

Com baterias simultâneas no mesmo Chrome, o teste de tutorial falhou ao aguardar `FIRST_JUMP_TUTORIAL` em Android/nova campanha; o teste da câmera não encontrou a fixture pronta dentro da espera. As execuções com falha permanecem no diário. A repetição isolada passou nas cinco áreas, sem aumentar prazos, remover asserções ou alterar o jogo. O diagnóstico observou abertura ativa e relógio avançando. Os pacotes preservam tanto a primeira falha quanto o resultado final; não se atribui uma regressão de produção a essas falhas não reproduzidas. As execuções futuras devem manter as baterias de navegador em sequência.

## Alcance da conclusão

Os percursos completos importam produção e usam instrumentação temporária para avançar quadros, procurar o instante de salto e conduzir a exploração/arena por políticas determinísticas. Demonstram conclusão funcional, sem certificar facilidade humana. A regressão da bailarina continua coberta por saídas comuns, e os controles foram exercitados com toque nativo; esses testes complementam a busca de trajetórias.

Android, iPhone e tablets são perfis emulados no Chrome. Não houve aparelho físico, controle físico, Safari/WebKit ou Firefox. Não foram atribuídas notas de dificuldade e não se declara ausência de todo defeito nem homologação humana.

## Repetição da bateria

Executar as baterias de navegador sequencialmente no Chrome de QA, com CDP em 9222:

```sh
npm test
npm run journal:qa -- test:formatos:browser
npm run journal:qa -- test:formatos:complementos:browser
npm run journal:qa -- test:jogabilidade:entradas
npm run test:toy-room:arena:browser
npm run build
npm run check-assets
```

Fontes novas em `docs/diario-ia/qa/formatos-bateria-browser.js`, `formatos-complementos-browser.js` e `formatos-toque-browser.js`. A matriz de perfis do percurso existente foi ampliada, conservando as verificações anteriores. Relatórios, JSONs, logs e metadados das imagens ficam exclusivamente no diário.
