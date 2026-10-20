# Iluminação e sombras na perseguição

Sessão `20261020T175621-ad0230422f52`. Pedido: luz pelas janelas, sombras nos
objetos/personagem e luz global à frente do urso, com sombra para trás.

## Diagnóstico e execução

Superfícies da sala usavam MeshBasicMaterial e ignoravam iluminação. Personagens
tinham preenchimento hemisférico 1,8 e direcionais 2,4/0,8, sem shadow maps.
Isso combinava ambiente uniformemente claro e objetos sem contato por sombra.

`ChaseLighting` recebe o compositor e mantém propriedade explícita das luzes e
mapas. Piso, parede, rodapés, teto e tapete usam MeshStandardMaterial fosco.
Personagens/props passam a castShadow/receiveShadow, incluindo brinquedos criados
durante o voo. Fada transparente continua luminosa e não projeta seu retângulo.

Preenchimento hemisférico 1,05 e luz de rebatimento fria 0,35 preservam leitura.
Direcional principal quente 1,65 fica além do urso, mirando em direção à menina;
sombra do urso se estende para trás. Janela usa SpotLight e máscara técnica de
vidraças em CanvasTexture, sem editar artes. Três projetores acompanham posições
fixas de janelas e só mudam de identidade quando apagados. A janela dominante
projeta máscara e sombra; as demais contribuem como preenchimento local.

São dois produtores de sombra simultâneos, PCFShadowMap da versão r186 local.
Mapas principal/janelas: 2048²/1024² em paisagem e 1024²/512² em retrato. Podem
ficar quatro mapas alocados ao passar pelas janelas; o controlador os descarta.
Esse custo adicional não aparece integralmente na contagem do Set de recursos
do compositor, por isso mapas são registrados separadamente no QA. Teto recebe
luz, mas não bloqueia a direcional global de apresentação. Indireta é aproximada
por luzes de preenchimento/rebatimento, sem GI físico ou ray tracing.

HUD recebeu fundo de contraste para o progresso, que ficara pouco legível sobre
o teto agora escuro. Sem alterações no domínio, dificuldade, colisões ou artes.

## Validação e correções

Primeiro QA do percurso falhou com 312 chamadas, acima da referência de 310.
Limitação à janela dominante reduziu custo; o limite existente foi mantido.
Percurso foi reexecutado após mudanças. Primeira imagem também motivou aumentar
o rebatimento para preservar a menina sem retornar ao preenchimento lavado.

QA `test:bear-chase:lighting`: doze cenas em desktop/retrato/paisagem, mapas reais,
219–292 chamadas e 208 recursos próprios. Pixels escurecem com recepção de sombras;
raycast a partir do corpo do urso confirma projeção no piso para trás e luz à
frente. Meshas da menina recebem/projetam sombra. Estado preservado, janelas
trocam apagadas em 1.441 amostras, descarte idempotente em zero.

Primeira comparação alternava shadowMap.enabled e não invalidava a programação
de shader já armazenada; apenas um pixel mudou. Corrigida a fixture para alternar
receiveShadow sem mudar câmera, materiais, luz ou estado. Não relaxadas asserções.
Falha original e repetição preservadas no diário.

QA de percurso cobre quinze modelos, três formatos, 36 finais, raycasts nas curvas,
dois percursos sem colisão, contexto WebGL recuperado e descarte. Build, lint,
66 recursos, sintaxe e mapa executados. Inventário: 422 arquivos/99 recortes/29
assinaturas. Fontes e resultados estão no acervo; capturas regeneráveis têm
hash/tamanho/caminho antes do descarte. Não repetida suíte geral nesta revisão
de apresentação. Sem dispositivos físicos, medição de FPS/VRAM ou aceite artístico.

## Situação Git observada

Merge autorizado já havia sido concluído por outra execução em `f9e7c4e3` quando
o comando local desta IA foi executar. Commit documental `8cf9291d` e origin
estavam alinhados. `git commit` retornou árvore limpa; o merge encadeado não rodou.
Não foi feito push por esta execução. Iluminação é mudança local posterior.
