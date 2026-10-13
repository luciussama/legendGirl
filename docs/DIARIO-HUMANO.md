# Diário do projeto para pessoas

Este diário acompanha as decisões e mudanças do produto em linguagem humana. Guias de desenvolvimento, design e arquitetura continuam na documentação. Resultados de máquina, testes, medições, homologações e registros de evidências ficam exclusivamente no diário de IA.

## A experiência atual

A menina explora um quarto de brinquedos, interage com os objetos e recebe uma espada. A imaginação transforma a mesma sala numa arena heroica: móveis e brinquedos ganham escala épica. Depois do combate, ela retorna à sala. A exploração e a arena pertencem à mesma aventura.

## 13 de outubro de 2026 — organização do trabalho visual

Foi criado um guia para a equipe de design localizar imagens, poses e consumidores no código. O README ganhou “Orientações para o designer”. A equipe deve preservar a identidade da menina, os materiais ilustrados e as proporções, além de coordenar mudanças em recortes e âncoras com desenvolvimento.

As imagens e os desenhos antigos classificados pelo responsável foram retirados. Alguns elementos receberam novos sprites com a assinatura atual; outros reutilizam artes existentes. A aprovação artística de mudanças novas precisa ser registrada explicitamente, sem presumir que a aprovação anterior da arena vale para cada recurso novo.

## 13 de outubro de 2026 — contexto compartilhado entre pessoas e IAs

O projeto passou a ter um diário de IA com documentos e instruções preservados, histórico disponível no Git e registros por sessão. Toda IA começa consultando esse acervo e registra as mudanças ao concluir. As regras vigentes e o contexto atual são as entradas para interpretar o histórico.

## 13 de outubro de 2026 — separação da documentação e dos registros de máquina

Relatórios técnicos e arquivos de QA foram retirados das pastas do projeto após registro no acervo. O código das verificações pode ser recuperado em ambiente temporário; os resultados voltam para o diário de IA. Capturas regeneráveis são descartadas, mantendo sua identificação e hash para consulta. Artes de produção continuam no jogo, mesmo quando antes estavam agrupadas com materiais de homologação.

Essa organização evita que designers e desenvolvedores precisem navegar por relatórios de máquina para entender o produto. Para detalhes técnicos históricos, consulte o [diário de IA](diario-ia/README.md); para editar o visual, consulte o [guia de designers](sprites/GUIA-DESIGNERS.md).

## 13 de outubro de 2026 — diálogos consistentes entre as fases

As falas da Toy Room passaram a usar a mesma caixa com retrato e nome do interlocutor da primeira fase. Nanda e a menina conversam em uma faixa ampla, em vez do quadrado central. No celular, a caixa respeita o espaço dos controles. Os textos e o ritmo da história permanecem iguais; trechos do narrador continuam distintos das falas dos personagens.

## Próximas entradas

Acrescente uma entrada quando mudar a experiência, a direção visual ou a forma de trabalho. Descreva o impacto para pessoas; não copie logs, métricas ou saídas de testes para este arquivo.
