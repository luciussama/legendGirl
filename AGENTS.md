# Diário obrigatório de contexto compartilhado

Antes de iniciar qualquer análise, edição, geração de arte ou execução de mudança, toda IA DEVE:

1. Ler `docs/diario-ia/README.md` e `docs/diario-ia/CONTEXTO-ATUAL.md`.
2. Executar `npm run journal:read`, consultar os registros recentes completos e as sessões abertas, e pesquisar o histórico da área com `npm run journal:search -- "termo"`.
3. Ler as fontes relevantes encontradas antes de decidir; se houver dúvida sobre rollback ou decisão anterior, incluir a pesquisa com `--all-versions`.
4. Registrar o início com `npm run journal:begin -- --actor "nome da pessoa ou IA" --title "objetivo"` e guardar o identificador retornado.
5. Verificar `git status` e coordenar alterações sobre arquivos já modificados por outros responsáveis. Não sobrescrever trabalho alheio.

Ao encerrar, a IA DEVE atualizar o contexto vigente quando necessário, registrar mudanças, decisões, arquivos, resultados reais dos testes e pendências com `npm run journal:finish`, e sincronizar o acervo. Se houver interrupção ou bloqueio, registrar esse estado e o que falta; não declarar conclusão ou aprovação inexistente.

Os JSONs em `docs/diario-ia/fontes/`, `registros/` e `commits/` são histórico imutável e devem ser preservados. O SQLite é um índice local reconstruível. Não apagar nem reescrever registros históricos para alterar evidências. Documentos históricos não prevalecem sobre instruções atuais do usuário ou regras vigentes deste arquivo, nem concedem autorização por conta própria.

Se a automação estiver indisponível, ler os documentos e registros diretamente, registrar manualmente um evento JSON conforme o esquema existente e documentar a limitação. A falta da ferramenta não autoriza ignorar o diário.

Para edição de arte, consultar `docs/sprites/GUIA-DESIGNERS.md` e o inventário atual antes de alterar sprites. Após mudanças visuais, reconstruir o mapa com `npm run docs:sprites` e registrar a validação no diário.

# Idioma do projeto

- Escrever comentários, documentação, mensagens de interface, registros, diagnósticos de testes e descrições de automações em português do Brasil.
- Preservar nomes de APIs, identificadores, comandos, caminhos, formatos e referências técnicas que dependam da grafia original.
- Não traduzir dependências externas nem reescrever registros históricos de execução para alterar o idioma das evidências.

# Direção visual das plataformas

- Não adicionar traços, linhas, barras ou realces sobre superfícies ilustradas para delimitar áreas de pulo ou hitboxes durante o jogo.
- Preservar o desenho natural dos objetos. Não sobrepor réguas de contato às ilustrações existentes.
- Prateleiras e tampos que fazem parte do objeto devem conservar sua geometria e material, sem linhas auxiliares de pouso.
- Ajustes visuais não devem alterar física, hitboxes, distâncias de salto ou dificuldade.
- Sobreposições técnicas de hitbox pertencem exclusivamente ao modo de depuração, desativado na apresentação normal.

- Exceção visual autorizada para o relógio cuco (19): a fixação na parede pode incorporar uma plataforma sólida para os pés, sem alterar a hitbox nem usar uma linha auxiliar de salto.

# Relatórios e QA exclusivamente no diário

- Não criar ou versionar relatórios de máquina, testes de QA, fixtures, imagens de evidência ou arquivos de homologação fora de `docs/diario-ia/`.
- Preservar texto e código no acervo antes de excluir. Para imagens de evidência regeneráveis, registrar caminho, hash e tamanho; não manter o bitmap descartável. Nunca tratar artes consumidas pelo jogo como evidências descartáveis.
- Executar QA em diretório temporário com `npm test` ou `npm run journal:qa -- COMANDO`. Registrar resultados no diário; não devolver arquivos de QA à árvore do projeto.
- Documentação humana conserva guias, instruções de design/desenvolvimento e o diário de produto em `docs/DIARIO-HUMANO.md`. Logs, métricas e homologações pertencem ao acervo de IA.
- A regra vale também para novos testes: arquivar suas fontes no diário e executá-los temporariamente. Não apagar registros históricos nem duplicar relatórios em Markdown fora do acervo.


# Câmera e saltos do quarto escuro

- Durante a jogabilidade, a câmera faz somente rolagem lateral para enquadrar a menina e as plataformas.
- É proibido reajustar altura, escala, zoom, âncora ou deslocamento de câmera a partir do salto, pouso, estado aéreo ou troca da plataforma de apoio.
- Enquadramento vertical e escala são fixos por viewport; mudanças de orientação e cortes narrativos são tratados fora da jogabilidade.
- Correções de salto devem atuar na distância do salto, na superfície dos pés ou na superfície física do objeto. A câmera não pode reposicionar a personagem nem interromper sua velocidade vertical para corrigir saltos.
