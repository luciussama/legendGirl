# Convenções de código

Código próprio usa inglês, preservando nomes próprios como Yuna, Nanda e Brinquedao. Comentários, documentação, diagnósticos, interface e diálogos permanecem em português do Brasil. APIs externas, formatos reservados e registros históricos mantêm a grafia original.

| Categoria | Formato | Exemplo |
| --- | --- | --- |
| Classes e seus arquivos | PascalCase | `PlayerController.js` |
| Funções, variáveis e módulos funcionais | camelCase | `updatePlayer`, `playerMovement.js` |
| Constantes de domínio | UPPER_SNAKE_CASE | `MAX_JUMP_SPEED` |
| Diretórios e assets | kebab-case | `toy-room`, `girl-running.png` |

Em Python, usar snake_case para módulos, funções e variáveis, conforme a linguagem. Arquivos de configuração mantêm os nomes reconhecidos pelas ferramentas.

## Vocabulário

- `player`: entidade jogável, estado, entrada e regras da personagem.
- `girl`: ilustrações, poses e recursos de arte da protagonista.
- `Yuna`, `Nanda`, `Brinquedao`: nomes próprios preservados.
- `player`: nome histórico aceito somente na leitura/adaptação de saves anteriores.

Modelos de fases diferentes podem ter contratos distintos. Compartilhar o termo `player` não exige compartilhar o mesmo objeto ou representação.

## Verificações

`npm run lint` verifica as fontes JavaScript próprias e os scripts; avisos de código legado devem ser avaliados, sem alterar comportamento apenas para suprimi-los. `npm run format:check` confere formatação e `npm run format` aplica Prettier. Metadados gerados e dependências externas conservam seu fluxo de geração.

ESLint e Prettier não comprovam a coerência semântica do idioma. O glossário e a revisão continuam necessários. Renomeações devem atualizar consumidores, imports, geradores, manifestos e documentação em conjunto; saves antigos devem continuar legíveis.

Na padronização da branch `ANALISE-PROJETO`, cada etapa exige teste end to end com resultado e limites no diário, além dos testes de domínio pertinentes. Preservar física, câmera, dificuldade e bytes das artes. A consolidação dos valores iniciais pertence a `createDefaultStateVariables`; a criação do jogo não deve repetir esses defaults.

## Compatibilidade e proveniência

A chave de armazenamento `legendGirl.campaign.v1` continua descobrindo a campanha; o envelope atual é v2. O leitor adapta campos legados sem alterar o save recebido. Registros históricos e prompts originais conservam seus nomes e caminhos de autoria; o mapa imutável de renomeações fica no diário. Títulos de faixas fornecidas pelo usuário e nomes reservados de comandos/configurações são preservados.

Chaves de atlas, IDs serializados, esquema do diário e nomes de comandos já publicados são contratos de dados/compatibilidade. Não são exemplos para novos identificadores e não devem ser traduzidos sem migração específica.
