# Animações de dano da arena

Artes geradas com o imagegen integrado a partir dos sprites atuais. São seis quadros por ator, com impacto, contração, recuo máximo, oscilação, recuperação e equilíbrio. A menina conserva pixel art; os brinquedos conservam acabamento ilustrado. O trem expressa o golpe pela compressão do chassis e inclinação, sem adicionar rosto humano.

| Ator | Canvas de cada PNG |
| --- | --- |
| Menina | 296 × 303 |
| Trem | 201 × 139 |
| Robô | 148 × 236 |
| Dinossauro | 218 × 205 |
| Urso | 144 × 177 |

`sources/` preserva as pranchas de geração. `prompts.json` documenta os pedidos e referências. `manifest.json` registra os quadros exportados, dimensões, âncoras e hashes. A transparência da prancha do dinossauro foi corrigida pelo imagegen antes da extração.

Na raiz do repositório, execute `node scripts/prepare-damage-sprites.js` para reconstruir os PNGs e `DamageSpriteFrames.js`. A exportação usa escala comum por ator, sem redimensionar cada pose isoladamente; usa vizinho mais próximo para a menina e alpha pré-multiplicado para as bordas dos brinquedos. Os originais de repouso, ataque e exploração permanecem preservados.

A menina percorre os seis quadros dentro da reação existente de 22 quadros; os inimigos usam o estado `HIT` e sua duração existente. As imagens não definem hitboxes ou dano. O responsável aprovou os sprites em 14/10/2026; resultados de QA ficam exclusivamente no diário de IA.

O som acompanha quem recebeu o golpe. `DamageAudio.js` sintetiza contato e reação curta, com voz estilizada para a menina, apito comprimido para o trem, queda eletrônica para o robô, guincho para o dinossauro e gemido grave para o urso. Os sons seguem o ganho mestre, o silenciamento e a limpeza de efeitos do sistema de áudio. A pose de dor tem prioridade desde o primeiro quadro do impacto, inclusive durante a pausa curta de contato.

BattleAssets injeta as sequências Hit no manifesto de remediação; BattleRenderer apresenta os inimigos e ArenaPlayerRenderer apresenta a menina. Os eventos são decididos por ToyRoomBattle, sem mudar a ordem de dano/recuo por uma troca de imagem. Consulte o [guia da arena](../../../../../docs/arena/GUIA-ARENA.md).
