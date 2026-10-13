# Revisão de gameplay — Prompt 16

**Resultado: PASS WITH OBSERVATIONS para avaliação controlada.**

O Prompt 16 autorizou temporariamente os defeitos visuais conhecidos. O usuário autorizou implementar HP inicial no máximo, parâmetros provisórios e conclusão com retorno ao título. Esta avaliação não homologa artisticamente o Prompt 14 nem converte o gate histórico do Prompt 15 em PASS.

## Implementação avaliada

`ToyRoomBattle` assume atualização e desenho ao terminar a aquisição da espada. A exploração termina; a câmera de simulação permanece fixa, e a apresentação se encaixa na área segura. A menina só anda horizontalmente; cima pula, baixo abaixa e ataque usa a espada. A ordem é Trem → Robô → Dinossauro → Urso. Cada morte termina sua animação antes do próximo confronto.

HP inicial/máximo: menina 3, inimigos comuns 2, Urso 4. Cada impacto válido transfere um coração; cura excedente é descartada. O Urso ativa Enrage ao atingir um coração. Vitória e derrota oferecem retorno ao título depois de uma breve espera. O combate faz parte do snapshot da sala.

A menina recebeu escala visual **2×**, incluindo espada e poses de golpe, ancorada nos pés. Esse ajuste não muda movimento, alcance, HP ou colisões. São usados o atlas oficial da menina, oito quadros de espada e o manifesto candidato `remediation/manifest.json`, sem substitutos geométricos para personagens.

## Respostas obrigatórias

| Pergunta | Resultado |
| --- | --- |
| A batalha pode ser concluída? | Sim: campanha com inputs chegou a VICTORY na ordem obrigatória. |
| Os inimigos podem ser derrotados? | Sim: os quatro registraram DEFEATED. |
| A menina pode ser derrotada? | Sim: ataques reais reduziram HP a zero e acionaram DEFEAT. |
| Os ataques disparam? | Sim: espada e os nove ataques dos inimigos foram exercitados. |
| As animações reproduzem? | Sim nas execuções observadas; os 144 PNGs carregaram no Chrome. Isso não certifica qualidade artística de todos os quadros. |
| O chefe funciona? | Sim: quatro corações, três golpes, Enrage no último coração e vitória após morte. |
| O jogo permanece estável? | Sem crash ou softlock nos percursos executados, inclusive save/load e passos de atualização diferentes. |

## Método e limites

O percurso automatizado usa `ToyRoomPhase.update()` e `triggerAction()`, sem reduzir HP ou matar inimigos diretamente. No Chrome, `/tests/battle-gameplay.html` executou exploração, investigação, espada, quatro confrontos e conclusão com os recursos reais. A observação contínua usa a mesma implementação; seleção de adversário e posicionamento da fixture de derrota são exclusivos da página de QA.

Foram observados confrontos isolados e estados de ataque no Chrome, com esquiva por inputs. Capturas de momentos do gameplay não equivalem a estudo com jogadores nem a inspeção quadro a quadro de cada transição. A legibilidade dos ataques destacados permanece pendente para release; veja o [backlog](known-issues-backlog.md).

Teclado, joystick e gamepad têm regressões automatizadas de orientação/input. Não houve teste desta batalha em Android físico ou gamepad físico. Balanceamento humano, correspondência detalhada entre silhueta ampliada e regiões de impacto e homologação visual completa continuam necessários antes de aprovação final de release.

## Parâmetros provisórios

Os tempos usam quadros de 60 Hz: preparação 54, janela ativa 18, recuperação 36, imunidade 48, reação ao dano 28 e morte 60. Espada: alcance 112, intervalo 26, animação 12. Movimento: velocidade 4, impulso de salto 8,5, gravidade 0,3. A IA alterna apenas os ataques aprovados, aproxima e recua; Enrage permanece ativo depois de iniciado, mesmo se o Urso recuperar vida. Esses valores são parâmetros de avaliação, não alteração das regras congeladas de HP, controles ou repertório.

## Reprodução

`npm run test:toy-room:battle` valida HP, transferência, limites, repertórios, esquiva, Enrage, conclusão, derrota, câmera e persistência. `npm run test:toy-room:qa` valida exploração/narrativa/input e passagem para a arena. O [playtest](battle-playtest-report.md) registra os resultados.
