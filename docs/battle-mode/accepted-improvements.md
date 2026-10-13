# Melhorias aceitas — Prompt 17

| Passe | Melhoria | Limites preservados |
| --- | --- | --- |
| 02 | Rocket Punch: textura e sombreamento mais próximos da referência pintada. | Seis poses, extensão, escala, referência corporal, tempos, alcance e lógica. |
| 04 | Steam Blast: compressão seguida de abertura da válvula frontal antes da emissão. | Seis poses, escala, tempos, dano e alcance. |
| 05 | Laser Beam: mira para a frente, punho apoiado e palma aberta antes do feixe. | Seis poses, escala, tempos, dano e alcance; âncora ligada ao torso. |
| 06 | Rush: duas poses durante a janela ativa, com preparação e recuperação próprias. | Mesmos PNGs, velocidades, janela de 18 quadros, dano, alcance e IA. |

Pranchas aceitas em `assets/art/toy-room/battle/polish/`: `rocket-punch-v1.png`, `steam-blast-v1.png` e `laser-beam-v1.png`; seus recortes são referenciados pelo manifesto ativo. O Rush conserva a arte anterior e usa `battleAnimationFrame()` para apresentação.

Cada passe teve verificação técnica, regressão completa e campanha Trem → Robô → Dinossauro → Urso. O combate no Chrome manteve 583 atualizações, 3 HP e recarga. Isso demonstra ausência de regressão nesses percursos, não aprovação de todas as colisões ou estudo de dificuldade com jogadores.

Produção raster feita com a skill `imagegen`, usando o tool integrado. Os prompts completos e invariantes estão em `assets/art/toy-room/battle/polish/prompts.json`. Nenhuma regra de HP, controle, transferência ou repertório foi alterada. Aprovação incremental não equivale à homologação artística integral.
