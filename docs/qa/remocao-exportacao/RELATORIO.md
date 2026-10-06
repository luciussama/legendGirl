# Remoção do recurso de exportação

6 de outubro de 2026. Removidos botões, modal, estilos exclusivos, eventos, gravação/streaming, página dedicada, pacote gerado, endpoints e geração automática do servidor. Excluídos scripts de exportação/verificação e a dependência `archiver`, com atualização do lockfile. README, manual e referência de métodos atualizados. Os testes visuais usam agora a página principal.

Não há implementação nem instrução ativa de exportação. Referências negativas no novo teste comprovam a ausência do recurso. Evidências históricas de QA continuam descrevendo as versões auditadas; não foram reescritas.

Teste integrado no servidor real e Chrome isolado, em 960×580, 390×844 e 915×412: entrada pela interface, pausa/continuação, som, movimento por teclado CDP, oito coletas/armazenamentos por tela, vitória, save e restauração após recarga. As posições junto aos brinquedos/baú foram preparadas pelo teste; não se afirma percurso completo entre objetos. Zero exceções JavaScript. Rotas antigas retornam 404. [Resultados](ponta-a-ponta.json).

`npm test`, lint, manifesto, sintaxe e verificação de whitespace aprovados. [Suíte](testes.log). A remoção antecedeu a retomada das correções artísticas autorizadas.
