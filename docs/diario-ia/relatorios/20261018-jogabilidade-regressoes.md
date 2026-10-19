# Teste de jogabilidade e regressões — 18/10/2026

Sessão: `20261018T170852-f832075f0014`. Código testado: workspace atual da branch `fix-balanceamento-luta`, incluindo as mudanças de defesa, orientação, sprites, direcional e câmera da sessão anterior. Essas alterações já estavam pendentes no início e foram preservadas. Nenhum ajuste de produção foi necessário durante esta verificação.

## Resultado

Nenhuma regressão funcional reproduzida nos cenários de jogo concluídos. Foram encontrados contratos antigos de automação incompatíveis com o acervo/fluxo atual; as correções ficaram nas fontes de QA, sem alterar produção. Todas as execuções finais passaram; as tentativas iniciais com falha permanecem registradas. A validação é automatizada e emulada: não equivale a um jogador humano ou a uma campanha conduzida por um agente visual sem acesso a estado/estratégias.

## Cobertura executada

| Área | Cenários | Resultado |
| --- | --- | --- |
| Suíte geral | Plataformas, narrativa, persistência, controles, arte, Toy Room, combate legado, arena e defesa | `npm test` aprovado |
| Campanha completa no navegador | Desktop, Android e iPhone × NORMAL/EASY | Seis percursos completos aprovados |
| Ida e retorno | 22 apoios na ida e 16 no retorno em cada percurso | 228 saltos entre apoios; castelo, porta falsa, diálogos e portal preservados |
| Exploração | Coleta/baú, recorrência, investigação, espada e transformação | Seis percursos, 11 coletas e seis restaurações por percurso |
| Arena completa | Trem → Robô → Dinossauro → Urso, vitória e retorno | Seis conclusões; restauração durante combate e após retorno |
| Arena em três apresentações | Desktop, Android retrato e paisagem | Vitória/retorno, derrota e nova tentativa aprovados; sem exceções ou recursos ausentes |
| Matriz de entradas | NORMAL/EASY × teclado/gamepad/toque × quatro inimigos × dois lados | 48 combinações aprovadas |
| Interrupções | Pausa, cancelamento de ponteiro, perda de foco, restauração e desconexão de gamepad | Sem movimento/defesa presos ou avanço durante pausa nas verificações executadas |
| Tutorial: espera, apresentação e entradas | 600 quadros sem movimento; toque, teclado, mouse e gamepad; retry/restore | Aprovados após atualizar instrumentação/contratos históricos |
| Toque nativo na arena | Retrato 390×844 e paisagem 844×390 | Defesa, arraste diagonal, salto + espada simultâneos e soltura aprovados |
| Abertura/tutorial de produção | Nova campanha, saves antigos/migrados, retomada e conclusão × três perfis | 18 cenários aprovados, com entrada nativa por toque/teclado |
| Persistência na página real | NORMAL/EASY, pausa, salvar, restaurar e recarregar a página | Aprovados; mais 76 saltos de percurso nesta verificação |
| Publicação | Build e recursos locais | Aprovados; 66 recursos registrados |

Nos percursos completos, a simulação usa o código real da aplicação com instrumentação temporária para avançar quadros e buscar o momento dos saltos; a Toy Room/arena usam os controladores e políticas determinísticas do acervo. A renderização, os assets e os snapshots são reais. A matriz de entradas chama os manipuladores reais da fase; o gamepad é simulado por `navigator.getGamepads`. Não foi usado controle físico.

## Regressões procuradas

- Travamento de abertura/tutorial, narrativa, portal ou transformação.
- Mudança involuntária de física e perda de progresso entre ida, retorno e Toy Room.
- Impossibilidade de coletar, guardar, investigar, equipar espada ou concluir a sequência dos quatro inimigos.
- Orientação incorreta ao recuar ou trocar de lado; defesa aérea indevida; espada indisponível durante salto diagonal.
- Agachamento, direção ou defesa mantidos após soltura, cancelamento, perda de foco e desconexão.
- Estado alterado durante pausa; incompatibilidade de dificuldade ou save/load; arena reiniciando após conclusão.
- Exceções JavaScript, imagens ausentes e falhas no retorno à exploração.

A primeira execução da nova matriz de entradas falhou ao comparar o snapshot imediatamente após soltar um toque, antes de o controlador atualizar `isMoving`. A pausa corretamente limpa esse indicador. O teste foi ajustado para estabilizar a soltura antes da comparação; as 48 combinações passaram. Não foi necessária mudança no jogo, e a evidência da tentativa inicial permanece no diário.

## Problemas encontrados nas automações

1. O teste histórico `test-first-jump-production-browser.js` executou os cenários de abertura/tutorial, mas terminou com `ENOENT` ao tentar escrever em `assets/qa-testers/current-logs/`, diretório ausente na cópia temporária. A nova fonte `jogabilidade-tutorial-producao-browser.js` cria o destino e grava resultados/capturas em `docs/diario-ia/qa-resultados/`.
2. A fixture histórica `game-difficulty-browser.js` chamava `story.attack()` diretamente enquanto a transformação da arena ainda estava em andamento e cobrava que o contador narrativo terminasse em 20 quadros. Isso ignora a entrada pública (`triggerAction` → arena), que bloqueia ataques fora de COMBAT. A fixture atual aguarda artes/entrada e usa a ação pública para verificar que o ataque começa e termina, preservando os testes de pausa, save, dificuldade e recarga.

3. Um teste de espera do tutorial enviava saltos válidos e exigia que nada acontecesse. O guia vigente exige que o primeiro salto válido conclua o tutorial. A fonte atual verifica 600 quadros sem entrada com simulação/câmera paradas e, em seguida, que a entrada aceita produz salto e conclusão.
4. A fixture antiga `first-jump-tutorial.html` continha sintaxe inválida na instrumentação (`standby:isStandbyActive: state.isStandbyActive`) e tentava observar o renderer dentro de `game.js`, embora ele já esteja em `DarkRoomRenderPipeline`. A nova fixture se baseia na instrumentação válida dos percursos e observa o retorno do renderer extraído, sem modificar o código de produção.

O alias padrão `test:tutorial:browser` foi atualizado por um novo pacote imutável para usar as fontes corrigidas. Os arquivos históricos continuam intactos. As falhas iniciais permanecem no acervo. Nenhum requisito de jogabilidade foi relaxado para obter aprovação; os testes passaram a respeitar o fluxo atual de entrada e o diretório de evidências definido pelo projeto.

## Evidências e repetição

- `npm test`.
- `npm run test:toy-room:arena:browser`.
- `npm run journal:qa -- test:jogabilidade:browser`.
- `npm run journal:qa -- test:jogabilidade:entradas`.
- `npm run journal:qa -- test:jogabilidade:tutorial:browser`.
- `npm run journal:qa -- test:jogabilidade:persistencia:browser`.
- `npm run journal:qa -- test:jogabilidade:complementos:browser`.
- `npm run build` e `npm run check-assets`.

Resultados e metadados de capturas estão nos pacotes/registros do diário. Fontes novas: `docs/diario-ia/qa/jogabilidade-percurso-browser.js`, `jogabilidade-entradas.js` e `jogabilidade-persistencia-browser.js`. O executor roda sobre uma cópia temporária do projeto e descarta bitmaps regeneráveis após registrar hash e tamanho.

## Limites

Android e iPhone são perfis emulados no Chrome; não certificam Safari/iOS nem aparelhos físicos. Os resultados não atribuem notas de dificuldade, não validam a sensação humana e não provam ausência de todo defeito. Especial/Y continua sendo uma função reservada, conforme o contrato atual; não é uma regressão. Recomenda-se repetir a avaliação humana no dispositivo usado pelos jogadores, sobretudo contra Robô, Dinossauro e Urso.
