# Revisão de sprites e assinaturas visuais

## Inventário

A análise do repositório encontrou **404 imagens**, **93 recortes de spritesheets** e **75 assinaturas visuais desenhadas por código**. A página apresenta os 572 itens para classificação humana, sem presumir que uma imagem antiga deva ser excluída.

Foram examinados os recursos de arte, manifestos, carregadores, configurações de fases, renderizadores e referências em JavaScript, HTML, CSS, JSON, Python e documentos. Capturas de QA, dependências e arquivos ignorados pelo Git não pertencem ao inventário de recursos do jogo.

O catálogo relaciona caminhos, dimensões, hashes, recortes e referências encontradas. Há 253 imagens com referências em código do jogo, 115 com referências apenas de apoio e 36 sem referência estática localizada. Referência estática não comprova uso efetivo em uma cena; ausência de referência não comprova desuso, pois existem caminhos dinâmicos.

## Famílias que merecem revisão

- A família `assets/images/toy-room/player*` reúne 20 arquivos com versões anteriores e poses alternativas da protagonista. A página permite comparar cada arquivo, sem substituir as artes aprovadas.
- Ilustrações SVG e recursos pequenos recebem indicações para inspeção de linguagem gráfica e detalhamento. Formato ou resolução não determinam, isoladamente, que a arte é antiga.
- Pranchas da protagonista e da arena são mostradas inteiras e por recorte. Os metadados de `OFFICIAL_FRAMES`, `ARENA_GIRL_ANIMATION_FRAMES` e dos atlas são usados para localizar poses individuais.
- Plataformas, cenário, móveis, brinquedos, retratos e fadas também possuem desenhos procedurais. As prévias executam os renderizadores existentes com configurações do jogo, permitindo identificar assinaturas que não existem como imagens em disco.
- Os renderizadores de exploração, arena e fases anteriores permanecem separados. Uma assinatura antiga pode continuar necessária a uma fase ou servir como fallback; as referências ajudam a avaliar isso.

## Uso

Com o servidor em execução, abra `/tools/sprite-review/`. Nesta sessão: **http://127.0.0.1:3002/tools/sprite-review/**.

Cada item oferece `Antiga — excluir`, `Atual — manter` e `Não analisada`. É possível filtrar por caminho, tipo, referências e classificação, ampliar a prévia e mudar o fundo para avaliar transparência. As escolhas são gravadas automaticamente em `docs/sprite-review/selecoes-exclusao.json`. O botão de download também exporta o JSON.

Marcar um item não remove nenhum recurso. O JSON registra três grupos distintos:

- `selectedForDeletion`: arquivos de imagem completos.
- `selectedRegions`: poses selecionadas dentro de pranchas, que exigem recomposição específica.
- `selectedCode`: desenhos específicos de renderizadores, que exigem alteração do código correspondente.

Selecionar uma pose não significa excluir a prancha inteira. Selecionar uma assinatura procedural não significa excluir o módulo JavaScript.

## Aplicação posterior

`npm run review:sprites:apply` apresenta uma simulação baseada no JSON. `npm run review:sprites:apply -- --apply` move somente as imagens selecionadas para uma quarentena reversível em `.sprite-review-quarantine/`, com registro. Arquivos referenciados pelo jogo são bloqueados por padrão: suas dependências precisam ser tratadas antes da remoção. A opção explícita `--include-referenced` permite essa aplicação quando as referências já tiverem sido avaliadas.

A aplicação verifica catálogo, seleção, caminho, hash e conflitos com recortes classificados como atuais. Alterações em pranchas e renderizadores aparecem no plano, mas não são executadas automaticamente pela ferramenta de arquivos. A limpeza deve incluir atualização das referências e regressão do jogo.

Para reconstruir o inventário: `npm run review:sprites:catalog`. As escolhas existentes são preservadas. Os testes de persistência e aplicação usam arquivos temporários; os testes de navegador usam um servidor isolado na porta 3003 com `SPRITE_REVIEW_SELECTION_PATH=/tmp/legendgirl-sprite-review-test-selection.json` e Chrome de teste na porta 9222.

## Validação

A suíte existente do jogo aprovou. Os testes adicionais verificaram persistência após recarga, gravação real em JSON, concorrência, validação de alvos, proteção de pranchas compartilhadas e quarentena reversível. No navegador, todas as 404 imagens carregaram e as 75 prévias procedurais produziram conteúdo visível, sem exceções JavaScript. Nenhum recurso do jogo foi excluído durante a análise.
