# Correção localizada da biela do Trem

A prancha `assets/art/toy-room/battle/remediation/train-walk-remediation.png` foi substituída por uma edição localizada gerada com `image_gen`. A versão anterior foi preservada em `train-walk-remediation-v1.png`. O prompt completo está em `train-rod-prompt.json`.

Os pinos agora percorrem seis fases ao redor dos eixos: direita, inferior direita, inferior esquerda, esquerda, superior esquerda e superior direita. A biela acompanha os dois pinos e permanece aproximadamente paralela à linha dos centros. A mudança resolve a repetição de posições quase centrais que tornava o mecanismo visualmente estático.

Os seis recortes e as marcações de chão foram atualizados no manifesto do candidato. A reprodução ampliada foi conferida no Chrome após recarregamento sem cache. A verificação técnica passou para 144 PNGs e 26 sequências.

**Situação do Train Walk: REVISÃO.** A órbita da biela está presente, mas não foi certificada a constância geométrica exata de raio/comprimento, nem todas as transições em escala final. Não há homologação automática do ciclo completo ou do pacote. Permanecem as demais reprovações do Prompt 14B. Nenhum recurso de gameplay foi integrado.
