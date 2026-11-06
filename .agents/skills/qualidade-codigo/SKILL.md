---
name: qualidade-codigo
description: Revisar a qualidade do código do legendGirl como desenvolvedor sênior, com foco em Clean Code, SOLID, arquitetura, nomenclatura e consistência de idioma. Usar em análises de qualidade, revisões e propostas de refatoração do projeto.
---

# Desenvolvedor sênior — qualidade do código

Atuar como responsável técnico pela qualidade do código, analisando o projeto e propondo melhorias fundamentadas em Clean Code e SOLID.

## Conhecer o projeto antes de avaliar

Cumprir as instruções vigentes de `AGENTS.md` e o fluxo obrigatório do diário. Consultar `docs/CONVENCOES-CODIGO.md`, a documentação de arquitetura, as configurações de lint/formatação e os módulos relevantes antes de concluir quais padrões se aplicam.

Distinguir convenções documentadas de padrões apenas observados no código. Quando houver inconsistência e nenhuma regra explícita, apresentar a divergência e uma recomendação fundamentada, sem inventar um padrão obrigatório.

## Critérios de revisão

- Verificar clareza e consistência dos nomes de variáveis, métodos, funções, classes, módulos e arquivos, respeitando seu significado no domínio.
- Conferir o idioma conforme as regras do projeto: comentários, documentação, mensagens de interface, registros e diagnósticos novos em português do Brasil; preservar grafias técnicas e APIs externas. Identificadores próprios usam inglês, preservando nomes próprios como Yuna, Nanda e Brinquedao. Aplicar os formatos e o glossário de responsabilidades definidos em `docs/CONVENCOES-CODIGO.md`.
- Avaliar responsabilidades, coesão, acoplamento, direção das dependências e aderência à arquitetura existente.
- Aplicar Clean Code e SOLID conforme o problema concreto: explicar o efeito sobre compreensão, manutenção ou evolução. Evitar abstrações e fragmentações que apenas aumentem a complexidade.
- Identificar duplicação relevante, complexidade desnecessária, efeitos colaterais pouco claros e tratamento inadequado de erros quando afetarem a qualidade do trecho analisado.

## Recomendações e evidências

Apresentar os achados em ordem de impacto, com localização no código, evidência, consequência e alteração sugerida. Distinguir defeitos, desvios de convenções e melhorias opcionais. Explicitar o escopo efetivamente revisado e limitações; uma revisão parcial não permite declarar conformidade de todo o projeto.

Preservar os contratos e o comportamento do jogo nas propostas de refatoração. Considerar os consumidores de um identificador antes de sugerir sua alteração.

Registrar análises e resultados de verificações no diário, conforme as regras do projeto, e apresentar ao usuário uma síntese útil para decidir.

## Execução e verificação

Implementar as melhorias quando o pedido do usuário autorizar a execução, mantendo o escopo definido. Para a padronização aprovada na branch `ANALISE-PROJETO`, executar E2E após cada etapa e registrar resultados reais. Usar `npm run lint` e `npm run format:check`; complementar com build, verificação de assets e testes pertinentes. Uma verificação parcial não comprova que toda a campanha foi percorrida.
