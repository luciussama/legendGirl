# Capítulos e passagem para o sonho

Direção recebida em 29/10/2026. A separação narrativa mantém as fases existentes e acrescenta as cenas abaixo. Cenas, textos e apresentação aprovados pelo usuário em 29/10/2026, após a correção do encerramento pela bandeira. A fase jogável do sonho permanece para uma entrega posterior.

## Capítulo 1 — Quarto de brinquedos

Depois de a menina levantar da cama, começa a música de fundo. Antes de liberar a primeira fase, a pintura do quarto apresenta **CAPÍTULO 1 - Quarto de brinquedos**. O capítulo reúne a aventura atual até o fim da perseguição do urso.

Depois de guardar o urso, o quarto reaparece arrumado, com o baú fechado e nenhum brinquedo ou objeto solto no chão. A menina está cansada. Nanda diz: “Ufa, conseguimos. Guardamos os brinquedos a tempo. Agora podemos brincar.”

O narrador acompanha a mudança de expressão:

> A menina sorriu.
> De canto a canto, passeou os olhos pelo quarto.
>
> Onde antes havia brinquedos, agora havia espaço.
> O sorriso ficou pequeno. Uma pergunta cresceu no lugar.

A menina pergunta: “Mas… agora todos os brinquedos estão guardados. Como vamos brincar? Vamos pegar os brinquedos de novo?”

Nanda leva a mão à testa. O plano silencioso conserva seu tempo enquanto a câmera se aproxima dela. Em seguida, abre a gravura do jardim.

## Capítulo 2 — Dia de piquenique no jardim

A gravura apresenta **CAPÍTULO 2 - DIA DE PIQUENIQUE NO JARDIM**. Seguem a saída de casa, o percurso e o piquenique existentes. Nanda continua revelando o nome de Yuna na entrada do jardim.

Depois das falas atuais, Yuna come mais pão na chapa e bebe suco de laranja. O narrador conduz o sono:

> Veio outro pão na chapa. E mais um gole de laranja.
> Na toalha, a tarde foi ficando macia.
>
> A barriga ficou quentinha. As pálpebras, pesadas.
> Yuna tentou guardar um último sorriso.
>
> O sono chegou sem fazer barulho.
> Nanda dobrou as asas e se aconchegou ao lado dela.
>
> Lá fora, o jardim continuou do mesmo tamanho.
> Dentro do sonho, uma folha já podia ser floresta.

As duas ficam adormecidas na toalha, com respiração discreta. Não inventar um botão de saída ou um combate para encerrar a cena.

## Regras da futura fase do sonho

O sono prepara a fase 2 descrita pelo usuário, em um jardim 3D. Yuna fica minúscula; formigas, besouros, abelhas e minhocas parecem gigantes. O objetivo é atravessar o jardim usando a grama alta como esconderijo. Ela só pode fugir: sem espada, ataque, pisão ofensivo ou outro recurso de combate.

O usuário confirmou concluir as cenas nesta entrega e preparar o jardim3D para implementação posterior. Para a etapa seguinte, a recomendação é começar com um trecho curto jogável com Yuna, grama alta e uma formiga gigante; os outros tipos entram após validar a base. Não confundir o percurso atual do jardim 2D com essa futura fase, nem apresentar a cena de sono como um jardim 3D já construído. Não foi solicitado um título adicional para o sonho.

## Contrato das novas cenas

As gravuras duram cinco segundos e permitem adiantar a leitura. As falas do epílogo usam 7, 6, 7 e 8 segundos; o facepalm silencioso dura 4,5 segundos. As quatro falas novas do piquenique duram sete segundos cada. O avanço automático continua ativo; clique/toque ou Enter adianta somente o quadro visível, consumindo o gesto. O facepalm não é abreviado pelo avanço de fala.

Pausa congela os relógios; a cena de organização guarda índice e idade no save. A revisão 11 do jardim retoma o sono novo em saves já concluídos da revisão 10, preservando o percurso e as falas já lidas. Os relógios narrativos não avançam física nem corrigem câmeras de gameplay.


## Ponto de encaixe da fase futura

O repouso final permanece no jardim2D com `state.stage === 'COMPLETE'` e `state.story.endingDone === true`; o último índice de `GARDEN_ENDING` apresenta as duas personagens dormindo. Esses dados já integram `GardenPhase.snapshot()` e o campo `toyRoomGarden` da campanha. A cena não dispara uma fase inexistente nem depende de um botão provisório.

Quando o sonho for construído, `ToyRoomPhase.updateActiveMode` poderá entregar esse estado concluído ao coordenador da nova fase, depois do corte narrativo escolhido. A nova simulação, os controles e os recursos3D devem ter ciclo próprio de carga, pausa, save/restore e descarte, como acontece hoje na passagem entre perseguição e jardim. O sono continuará sendo um ponto de retomada válido para os saves anteriores à nova fase.

A passagem não deve reaproveitar os ataques/pisões do jardim2D: a fase do sonho permite somente fugir e se esconder. Distância do protótipo, detecção, comportamento da grama, câmera e condições de fracasso serão calibrados na implementação específica.


A revisão pelo seletor de fases também percorre o epílogo após a perseguição. Ela continua isolada da campanha salva, inclusive ao entrar no jardim; a bandeira permite conferir o encerramento do capítulo sem repetir todas as fases.

## Próximas entregas planejadas

Esta sequência organiza o trabalho futuro; sua implementação começa em uma nova solicitação.

1. **Protótipo curto:** Yuna minúscula, um trecho de jardim 3D, uma formiga gigante e um esconderijo de grama alta. Validar deslocamento, câmera e leitura da escala em desktop e celular antes de ampliar o mapa.
2. **Fuga e esconderijos:** definir patrulha, percepção, perseguição e perda de contato; a grama deve comunicar quando Yuna está protegida. Calibrar o encontro e a retomada após ser encontrada, sem combate.
3. **Integração do sonho:** conectar o sono ao novo coordenador; carregar recursos sob demanda, preservar saves antigos e implementar pausa, retomada e descarte do 3D. Definir o corte narrativo sem inventar um novo número de capítulo.
4. **Variedade e travessia:** acrescentar besouros, abelhas e minhocas gigantes com comportamentos distintos; compor o percurso e seus esconderijos após a base ser validada. Distância, duração, desfecho e condições de fracasso ainda precisam de definição.
5. **Acabamento e validação:** revisar identidade de Yuna, animação, áudio, legibilidade dos esconderijos, controles de toque e desempenho em aparelho real; testar a passagem desde o piquenique, restauração e isolamento do seletor.

Critério da primeira entrega: conseguir atravessar o trecho evitando a formiga e usando a grama de maneira compreensível, somente com fuga e esconderijo. Não é necessário construir todas as espécies ou o mapa definitivo para avaliar essa base.
