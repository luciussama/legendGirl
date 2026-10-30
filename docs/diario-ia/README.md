# Diário de IA: entrada obrigatória do projeto

Leia `AGENTS.md`, este guia e `CONTEXTO-ATUAL.md` antes de trabalhar. As instruções atuais do usuário prevalecem sobre documentos históricos. Para diálogos e cenas, consulte também [DIALOGOS-E-CENAS.md](padroes/DIALOGOS-E-CENAS.md).

Ao retomar uma sessão interrompida, consulte seu início, os registros completos de QA e os pacotes/fontes associados antes de repetir tarefas. O contexto vigente resume o estado atual e aponta as fontes de retomada; versões anteriores e checkpoints completos permanecem no acervo. Uma fila antiga não volta a ser pendência quando um registro posterior informa sua resolução. Confirme a decisão mais recente nas fontes e no checkout atual. Arquivos temporários de progresso podem pertencer a outra execução; só atribua resultados à execução identificada pelo registro correspondente.

## Regras obrigatórias de documentação e commit

Determinação do usuário em 29/10/2026, aplicável a todas as próximas sessões:

1. **A cada nova implementação autorizada, a documentação DEVE ser atualizada na mesma entrega.** Conferir funcionalidades, módulos, métodos, contratos, comandos, recursos, persistência e guias afetados. Regenerar os índices pertinentes e registrar no encerramento os documentos atualizados e as verificações realizadas. Uma implementação não está concluída enquanto sua documentação necessária estiver desatualizada.
2. **A cada pedido de realizar commit, relatórios, imagens de aprovação e outros documentos desnecessários ao projeto DEVEM ser excluídos da árvore de trabalho antes do commit.** A limpeza é parte obrigatória da preparação: localizar esses arquivos em todo o projeto, preservar texto/código integralmente no acervo e verificar a recuperação antes de remover as cópias. Para evidências visuais regeneráveis, registrar caminho, hash e tamanho. Sincronizar o diário e incluir seus novos segmentos no commit. Nenhum relatório avulso ou bitmap descartável de homologação deve integrar a entrega.

A limpeza conserva o código, as artes consumidas pelo jogo, referências artísticas necessárias, ferramentas, documentação de uso/manutenção e o histórico imutável do diário. Banco com exportações pendentes e segmentos nunca são descartados para cumprir essa regra. A preparação documental e a limpeza não concedem autorização para commit, push ou publicação por conta própria.

## Armazenamento e arquivos essenciais

O SQLite local é o armazenamento operacional do diário. JSON continua sendo o formato dos envelopes históricos, guardados integralmente no banco e exportados em lotes JSONL/gzip imutáveis. Os milhares de JSONs individuais foram consolidados com verificação de bytes, hashes e restauração isolada; seus caminhos antigos continuam identificando conteúdo recuperável.

| Recurso | Função |
| --- | --- |
| `README.md`, `CONTEXTO-ATUAL.md`, `padroes/` | Entrada humana e regras de produto acessíveis antes de abrir o banco. |
| `diario.sqlite3` | Banco operacional local, ignorado pelo Git. Contém envelopes completos, fontes, eventos, pacotes, commits e anexos. |
| `segmentos/<sha256>.jsonl.gz` | Exportações compactadas e imutáveis para Git, clones e recuperação. Cada linha preserva tipo, ID, caminho, hash e bytes originais em base64. |

Não editar envelopes históricos, reescrever segmentos nem escolher uma versão binária do banco para resolver merges. Correções geram eventos novos. Segmentos de duas branches se unem por IDs; mesma identidade com bytes diferentes é erro explícito. Novas capturas independentes têm identidade própria, com deduplicação local por caminho/hash, preservando datas e origens.

O banco não deve ser apagado enquanto houver objetos pendentes de exportação. `journal:read` informa `pendentesExportacao`. Execute `journal:sync` antes de commit, troca destrutiva de checkout, limpeza ou compartilhamento. Depois de exportar e verificar, um clone sem banco restaura automaticamente o acervo dos segmentos disponíveis. O banco não é versionado; os segmentos novos precisam acompanhar o commit.

## Fluxo obrigatório

Requisitos: Python 3 com biblioteca padrão (`sqlite3`, `gzip`, `fcntl` etc.), Git, `rg` e Node/npm. Sem serviço externo ou instalação pip obrigatória. O bloqueio local usa `fcntl`, disponível em macOS/Linux; Windows nativo exige adaptação.

```sh
npm run journal:read
npm run journal:search -- "ArenaPlayerRenderer"
npm run journal:show -- ID_DA_FONTE
npm run journal:show -- ID_DA_SESSAO --kind registros
npm run journal:begin -- --actor "Codex" --title "Objetivo"
```

Leia os registros recentes completos e as sessões abertas. A pesquisa continua literal, com `--all-versions` para incluir revisões antigas; retorna caminho e ID. `show` recupera a íntegra pelo banco. Consulte `origin`: data de captura não equivale a data de autoria. Não há autorização implícita em registros antigos.

Ao concluir, atualize o contexto quando necessário e registre resultados reais:

```sh
npm run journal:finish -- --id IDENTIFICADOR --summary "Resultado" --check "Verificação realmente executada" --file "caminho" --pending "Pendência real"
npm run journal:sync
npm run journal:verify
```

`--check`, `--file` e `--pending` são repetíveis. `finish` exporta o lote pendente da sessão. `sync` captura documentos atuais e exporta o restante. Operações intermediárias e QA gravam no SQLite, sem criar um arquivo por evento. Se a sessão for interrompida, preserve o banco e sincronize assim que possível; não declare conclusão inexistente nem encerre sessões alheias.

## Consultas, histórico e concorrência

As tabelas `envelopes`, `fontes`, `registros`, `commits_git`, `pacotes` e `arquivos_arquivados` preservam o acervo e suas relações. `envelopes` conserva os bytes e campos opcionais originais, inclusive fontes antigas sem `encoding`, arquivos gzip e artes aposentadas em base64. Projeções indexam metadados; o texto comprimido é recuperado pela CLI. Não depender de uma coluna textual `fontes.conteudo` do índice antigo.

```sh
sqlite3 docs/diario-ia/diario.sqlite3 'SELECT caminho,sha256 FROM fontes WHERE atual=1;'
npm run journal:sync -- --history
```

A sincronização é incremental. A importação do histórico Git é explícita e cobre referências locais disponíveis. O diário local acumula o histórico entre branches, mas `atual` é recalculado pelos arquivos do checkout visível; uma consulta não transforma versão de outra branch em regra atual. Cada worktree tem seu banco, e recebe contribuições compartilhadas pelos segmentos. Sessões novas registram branch e HEAD.

Escritas são serializadas por bloqueio local e transações SQLite com WAL/synchronous FULL. Não compartilhar o arquivo ativo por pasta de rede nem sincronizar arquivos WAL manualmente entre computadores. Mescle segmentos pelo Git e deixe a importação unir os objetos. O bloqueio do diário não substitui coordenação sobre código do jogo.

## Recuperação, backup e extração

```sh
npm run journal:export
npm run journal:verify
npm run journal:backup -- --output /tmp/diario-backup.sqlite3
npm run journal:extract -- docs/diario-ia/arte/caminho-original.png --output /tmp/referencia.png
```

Backup usa a API SQLite e recusa sobrescrita. Guarde cópia durável fora do mesmo disco conforme sua política. Não copie apenas o arquivo principal de um banco ativo em WAL. `verify` confere integridade estrutural, hashes dos envelopes/fontes e referências de fontes em pacotes; não substitui backup e teste de restauração.

`extract` recupera anexo pelo caminho original ou a versão mais recente de uma fonte, sem sobrescrever o destino. Se um anexo possuir várias versões, o comando lista os IDs e exige `--id` para escolher. Para uma revisão exata de fonte, use seu ID em `show`; não presuma que o caminho representa uma versão histórica específica. Referências antigas a `arte/`, `relatorios/`, `limpeza/` e JSONs soltos pertencem ao acervo e podem ser extraídas, inclusive referências artísticas que conservaram seus bytes completos.

`journal:migrate` importa acervo antigo e anexos, exporta segmentos e testa a restauração em diretório isolado. A opção `--prune` retira as cópias soltas somente depois de verificar que cada byte pode ser recuperado; não reescreve o histórico Git. Use-a em migrações autorizadas, sem escritores antigos concorrentes. Não use scripts antigos que reconstruíam o SQLite a partir dos diretórios removidos.

## QA e evidências

Relatórios de máquina, fontes de testes, fixtures e resultados pertencem ao diário. `npm test` e `journal:qa` recuperam automações e fixtures do SQLite somente em diretório temporário, executam contra o código atual e gravam resultados no banco. O próximo `finish`/`sync` exporta esses resultados. O executor não copia o banco nem os segmentos para cada ambiente de QA.

```sh
npm test
npm run journal:qa -- script:test-opening-sequence.js
npm run journal:archive -- --manifest /tmp/lista-de-caminhos.json --title "Descrição"
```

O manifesto é uma lista JSON de caminhos relativos ao projeto. `archive` preserva texto/código integralmente. Evidências regeneráveis de imagem conservam caminho, hash e tamanho (`metadataOnly`), sem bitmap. Artes de produção e referências artísticas preservadas não são evidências descartáveis. Não remover conteúdo antes de verificar seu arquivamento. Testes novos são arquivados e executados temporariamente; não devolva arquivos de QA à árvore do projeto.

Documentação humana permanece nos guias e em `docs/DIARIO-HUMANO.md`. Não registrar segredos, credenciais ou informações pessoais alheias ao projeto. Preservar português do Brasil nos registros novos e o idioma original das evidências antigas.

Se a automação falhar, preserve o banco e os segmentos; registre um evento JSON de contingência conforme o esquema em local temporário dentro do diário e documente a limitação. Importe e exporte esse evento assim que a ferramenta voltar. Não ignore o diário nem reconstrua o banco por cima de dados não exportados.
