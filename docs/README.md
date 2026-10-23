# Documentação do aplicativo

Revisão: 22/10/2026. Use o documento conforme a pergunta; relatórios e evidências de máquina ficam exclusivamente no diário de IA.

| Entrada | Conteúdo |
| --- | --- |
| [README do projeto](../README.md) | Experiência, ambiente, controles, execução e visão geral. |
| [Arquitetura e entidades](ARQUITETURA.md) | Todos os módulos src/js, seus exports, proprietários de dados, contextos, estados, saves, fronteiras e ferramenta de revisão local. |
| [Manual de desenvolvimento](MANUAL-DESENVOLVIMENTO.md) | Integração, receitas, pipeline visual, controllers, classes, publicação e diagnóstico. |
| [Referência de métodos](REFERENCIA-METODOS.md) | Declarações, acessores e contratos exportados/reexportados, com links e assinaturas. |
| [Comandos e ferramentas](COMANDOS.md) | Todos os aliases package.json, scripts de produção/documentação/diário e QA temporário. |
| [Dependências](DEPENDENCIAS.md) | Pacotes/lockfile, APIs nativas, Python/SQLite, CDP e CI. |
| [Primeiro salto](TUTORIAL-PRIMEIRO-SALTO.md) | Fluxo, entradas, apresentação e migração de saves do tutorial do quarto. |
| [Arena atual](arena/GUIA-ARENA.md) / [valores documentados](arena/configuracao-atual.json) | Perfis legado/arena, HP, combate, IA, controles, retorno, áudio e persistência. |
| [Perseguição 3D](bear-chase/GUIA-PREVIA.md) | Campanha após a vitória da arena, acesso isolado de debug, abertura ilustrada, pista, vidas, áudio, materiais e dificuldades. |
| [Manual: vitória da arena para a fuga](bear-chase/MANUAL-TRANSICAO-VITORIA-ARENA-FUGA.md) | Contrato implementado de fluxo, recuperação de erro, persistência e critérios de manutenção da passagem arena–fuga. |
| [Animação da menina](arena/GUIA-ANIMACAO.md) / [prompts](arena/animacao-menina-prompts.md) | Poses, dados, âncoras, reação de dano e origem das pranchas. |
| [Produção de batalha](battle-mode/battle-sprite-production.md) | Origem dos lotes de sprites e integração/derivados atuais. |
| [Guia de designers](sprites/GUIA-DESIGNERS.md) | Como localizar/editar artes sem alterar física ou identidade. |
| [Mapa de imagens](sprites/MAPA-SPRITES.md), [recortes](sprites/RECORTES.md), [desenhos em código](sprites/DESENHOS-EM-CODIGO.md), [inventário](sprites/inventario.json) | Localização, consumidores, dimensões, hashes e metadados gerados. |
| [Diário humano](DIARIO-HUMANO.md) | Decisões de produto e forma de trabalho, sem relatórios de execução. |
| [Diário de IA](diario-ia/README.md) / [contexto vigente](diario-ia/CONTEXTO-ATUAL.md) | Histórico imutável, sessões, evidências, decisões recentes e pendências. |

## Design inicial e origem das artes

O design inicial de batalha, seus três JSONs e o diagrama conceitual foram consolidados integralmente no [diário de IA](diario-ia/README.md). Consulte `npm run journal:search -- "battle-mode-rules.md"` ou o nome original; o pacote `documentacao-20261022-d61a324b2364` conserva também o bitmap do diagrama. A configuração vigente fica no guia da arena. O guia de produção de sprites continua disponível por orientar os recursos atuais.

As pastas de arte mantêm guias de origem: [personagem oficial](../assets/art/dark-room/OFFICIAL-CHARACTER.md), [abertura](../assets/art/dark-room/opening/README.md), [arte complementar](../assets/art/dark-room/modern/README.md), Toy Room [stage1](../assets/art/toy-room/stage1/README.md)/[stage2](../assets/art/toy-room/stage2/README.md)/[stage3](../assets/art/toy-room/stage3/README.md) e [poses de dano](../assets/art/toy-room/battle/damage-v2/README.md). Prompts/manifestos junto às imagens descrevem origem e recortes, não novas regras físicas.

## Atualizar documentação junto ao código

Ao mudar um contrato, atualize seu proprietário/consumidores na arquitetura e as receitas afetadas no manual. Regere `node scripts/generate-method-reference.js`; após mudanças visuais/de consumidores, regere `npm run docs:sprites`. Novas ferramentas/aliases entram no catálogo de comandos; novas dependências exigem package.json e lockfile coerentes. Se alterar parâmetros da arena, atualize a referência documental derivada dos módulos reais. Preserve o design inicial sem transformar sua história numa aprovação nova.

Registre validações reais e arquivos revisados no diário, sem espalhar relatórios ou fixtures. Links e inventários gerados não substituem a leitura dos contratos: referências dinâmicas, callbacks e ciclo de vida precisam ser explicitados. Teste a publicação em subpasta e os saves quando a integração mudar.

- [Um dia no jardim](garden/GUIA-JARDIM.md): controles, percurso, arte e persistência da fase lateral.
