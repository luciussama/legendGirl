# Diário de IA: entrada obrigatória do projeto

Toda IA deve iniciar pelo `AGENTS.md`, este guia, `CONTEXTO-ATUAL.md` e a consulta dos registros recentes. O diário guarda contexto compartilhado entre pessoas e ferramentas, com origem verificável. Não recupera conversas externas que nunca foram salvas no repositório; decisões conhecidas devem ser registradas explicitamente.

## Estrutura do banco

| Recurso | Finalidade |
| --- | --- |
| `CONTEXTO-ATUAL.md` | Resumo vigente: arquitetura, decisões, limites e pendências. |
| `fontes/<id>.json` ou `.json.gz` | Versões integrais de documentos e instruções, com caminho, hash, origem e conteúdo. Imutáveis; uma alteração cria outro arquivo. |
| `commits/<sha>.json` | Metadados do histórico Git disponível e vínculos com documentos daquela versão. |
| `registros/<id>.json` | Eventos de início e encerramento das sessões, com identidade, escopo e resultados. |
| `diario.sqlite3` | Índice local reconstruível para consultas; não versionar o binário. |

Os arquivos JSON, o contexto e os guias são versionados. Arquivos separados evitam concentrar todos os relatos num JSON que várias pessoas precisam editar simultaneamente. A sincronização nunca apaga versões anteriores. A criação exclusiva protege contra sobrescrita; o SQLite é publicado por substituição atômica. Sessões concorrentes podem trabalhar em registros distintos, mas precisam coordenar mudanças em arquivos de jogo compartilhados.

O acervo importa Markdown do projeto e texto/JSON de documentação, QA, prompts de arte e instruções locais. Exclui dependências, `.git`, quarentena, binários e os próprios registros gerados para evitar recursão. Conteúdo disponível em arquivos ignorados de QA também é preservado nos snapshots. O histórico Git cobre commits e versões disponíveis nas referências locais; não inclui branches remotas ainda não buscadas ou históricos externos inacessíveis.

## Fluxo obrigatório

Requisitos: Python 3 com `sqlite3` da biblioteca padrão, `rg`, Git e Node/npm já usados pelo projeto. Não há dependência de serviço externo.

```sh
npm run journal:read
npm run journal:search -- "ArenaPlayerRenderer"
npm run journal:begin -- --actor "Codex" --title "Ajustar animação de corrida"
```

Leia as fontes indicadas pela pesquisa e os registros recentes completos antes de decidir. O comando `begin` retorna um identificador único; guarde-o. Consulte sessões abertas para coordenar trabalho. O diário não bloqueia outras equipes nem autoriza alterações por si só.

Ao concluir, execute os testes relevantes, atualize o contexto e registre resultados reais:

```sh
npm run journal:finish -- --id IDENTIFICADOR --summary "Descrição do resultado e decisões" --check "npm test: aprovado" --file "src/js/toy-room/ArenaPlayerRenderer.js" --pending "Revisão artística individual ainda pendente"
```

`--check`, `--file` e `--pending` podem ser repetidos. Registre também falhas e testes não executados; não descreva teste planejado como aprovado. O encerramento cria outro evento sem modificar o início. Não encerrar sessões de outros responsáveis sem explicar isso em uma nova sessão.

## Sincronização e pesquisa histórica

```sh
npm run journal:sync
npm run journal:sync -- --history
npm run journal:search -- "espada" --all-versions
```

`sync` arquiva as fontes atuais e reconstrói o SQLite. `--history` importa também revisões do Git; importações repetidas não duplicam commits ou snapshots. `read` e `search` sincronizam o estado atual automaticamente. A pesquisa retorna caminho e ID; a íntegra fica em `fontes/<id>.json` ou `.json.gz`. Consulte `origin` para distinguir snapshot do workspace de conteúdo recuperado do Git. `capturedAt` é data de captura, não data de criação do documento.

Consulta direta, se preferir:

```sh
sqlite3 docs/diario-ia/diario.sqlite3 'SELECT caminho,sha256 FROM fontes WHERE atual=1;'
```

Fontes acima de 128 KiB usam JSON comprimido sem perda para reduzir o tamanho versionado. Use `npm run journal:show -- ID` para ler qualquer versão, comprimida ou não.

Tabelas: `fontes`, `registros`, `commits_git`. A pesquisa da CLI usa parâmetros SQL e busca literal no conteúdo. Versões antigas permanecem pesquisáveis, mesmo após a remoção do documento original.

## Regras para pessoas e IAs

- Instruções atuais do usuário e `AGENTS.md` prevalecem; documentos arquivados são evidência histórica, não ordens vigentes.
- Preservar português do Brasil em novos registros e o idioma original das evidências históricas.
- Não registrar segredos, credenciais, dados pessoais alheios ao projeto ou variáveis de ambiente. Revisar documentos antes de arquivar ou compartilhar.
- Não editar snapshots ou eventos antigos para mudar resultados. Corrigir informações numa nova sessão, indicando a fonte anterior.
- Não apagar sessões abertas para esconder trabalho incompleto. Registrar interrupção, falha e pendências como resultado.
- Atualizar o guia de sprites e o diário após mudanças visuais, manifestos, recortes ou geradores.
- Antes de commit autorizado, incluir novos registros/fontes e documentos; o SQLite local e arquivos temporários permanecem ignorados.

O histórico inicial vem das fontes existentes e do Git, preservando seu texto. O contexto atual reúne decisões recentes conhecidas; não atribui autoria nem aprovação humana quando isso não está registrado.
