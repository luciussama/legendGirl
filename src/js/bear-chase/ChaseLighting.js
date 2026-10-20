import * as T from '../../vendor/three/three.module.js';
import { routePoint } from './ChaseRoute.js';

/**
 * Compõe a iluminação da perseguição sem modificar a simulação ou as colisões.
 *
 * Há três funções visuais distintas:
 * - bounce/reflected: preenchimento que simula luz rebatida e preserva as texturas;
 * - front: luz alta, adiante do urso, cuja sombra se estende para trás dele;
 * - windows: três projetores associados às janelas fixas do quarto.
 *
 * Ciclo de vida: o renderer cria esta classe após carregar a sala, chama update()
 * em cada desenho e dispose() ao sair. Objetos novos passam por prepareObject().
 * O preenchimento é uma aproximação artística, sem cálculo físico de luz indireta.
 */
export class ChaseLighting {
  /**
   * Cria luzes, configura sombras e prepara as malhas já carregadas.
   *
   * `owner` é o compositor ChaseRenderer3D: fornece scene, renderer, room, fairy
   * e own(). Este último registra a máscara entre os recursos que ele descartará.
   * `lights` contém apenas luzes que podem precisar de mapas de sombra; as duas
   * luzes de preenchimento ficam fora dessa lista para não alocar mapas inúteis.
   *
   * @param {import('./ChaseRenderer3D.js').ChaseRenderer3D} owner Compositor da cena pronta.
   */
  constructor(owner) {
    this.owner = owner;
    this.lights = [];
    this.disposed = false;

    // PCF filtra as bordas do mapa de profundidade. Não altera a geometria da sala.
    owner.renderer.shadowMap.enabled = true;
    owner.renderer.shadowMap.type = T.PCFShadowMap;

    // A hemisférica mistura luz fria de cima e luz quente de baixo, sem gerar sombra.
    this.bounce = new T.HemisphereLight('#c9d8ef', '#957453', 1.05);
    owner.scene.add(this.bounce);

    this.front = new T.DirectionalLight('#fff1d9', 1.65);
    this.front.castShadow = true;
    // Limites em unidades da cena, vistos pela câmera da luz, não pela câmera do jogo.
    // Um volume grande demais perde detalhe e inclui objetos distantes no passe de sombras.
    Object.assign(this.front.shadow.camera, {
      left: -12.5, right: 12.5, top: 24, bottom: -24, near: .5, far: 80,
    });
    // bias/normalBias afastam a comparação da própria superfície, evitando manchas de auto-sombra.
    // Valores excessivos separam a sombra dos pés; radius controla a filtragem da borda em PCF.
    this.front.shadow.bias = -.00025;
    this.front.shadow.normalBias = .035;
    this.front.shadow.radius = 3;
    owner.scene.add(this.front, this.front.target);
    this.lights.push(this.front);

    this.reflected = new T.DirectionalLight('#dce9ff', .35);
    owner.scene.add(this.reflected, this.reflected.target);

    this.cookie = this.windowMask();
    this.windows = [];
    for (let i = 0; i < 3; i++) {
      // SpotLight: cor, intensidade, alcance, abertura em radianos, penumbra e decaimento.
      // O alcance local evita iluminar/projetar sombras através de vários trechos da curva.
      const light = new T.SpotLight('#ffe7ba', 100, 18, .69, .45, 2);
      light.castShadow = false;
      light.map = this.cookie;
      light.shadow.bias = -.0002;
      light.shadow.normalBias = .025;
      light.shadow.radius = 2;
      light.shadow.camera.near = .3;
      light.shadow.camera.far = 18;
      owner.scene.add(light, light.target);
      this.windows.push(light);
      this.lights.push(light);
    }
    this.resize(false);

    owner.scene.traverse(object => {
      if (!object.isMesh) return;
      const solid = !object.material.transparent;
      object.castShadow = solid;
      object.receiveShadow = solid || object.material.isMeshStandardMaterial;
      // A luz principal é de apresentação, acima do quarto: o teto não deve bloqueá-la.
      if (object.name === 'teto contínuo') object.castShadow = false;
    });
    // A fada ilustrada mantém transparência sem projetar o retângulo da sua prancha.
    owner.fairy.castShadow = false;
    owner.fairy.receiveShadow = false;
  }

  /**
   * Desenha a máscara compartilhada das quatro vidraças: branco deixa passar luz,
   * preto representa moldura/divisórias. É uma textura técnica para o projetor,
   * não uma substituição da arte visível da janela.
   *
   * A textura pertence a owner.own(); dispose() desta classe não a descarta duas vezes.
   * @returns {T.CanvasTexture} Máscara de 256 × 256 pixels, em espaço de cor sRGB.
   */
  windowMask() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.roundRect(32, 16, 192, 224, [64, 64, 8, 8]);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.fillRect(123, 12, 10, 232);
    ctx.fillRect(28, 124, 200, 9);
    const texture = this.owner.own(new T.CanvasTexture(canvas));
    texture.colorSpace = T.SRGBColorSpace;
    return texture;
  }

  /**
   * Escolhe a resolução dos mapas conforme a orientação da tela.
   * Paisagem: principal 2048² e janelas 1024²; retrato: 1024² e 512².
   * Isso muda nitidez/custo de memória, sem mudar alcance ou posição das luzes.
   *
   * Só libera/recria um mapa quando a resolução muda. Os alvos antigos da GPU
   * precisam ser descartados antes de limpar as referências e pedir novo desenho.
   * @param {boolean} portrait Indica tela mais alta que larga.
   */
  resize(portrait) {
    const frontSize = portrait ? 1024 : 2048;
    const windowSize = portrait ? 512 : 1024;
    for (const light of this.lights) {
      const size = light === this.front ? frontSize : windowSize;
      if (light.shadow.mapSize.x === size) continue;
      light.shadow.dispose();
      light.shadow.map = null;
      light.shadow.mapPass = null;
      light.shadow.mapSize.set(size, size);
      light.shadow.needsUpdate = true;
    }
  }

  /**
   * Converte origem e alvo do referencial do percurso para coordenadas do mundo.
   * routePoint() incorpora curvas e altura do piso; somar somente ao eixo Z faria
   * a luz se afastar do quarto nas curvas. O alvo define para onde a luz aponta.
   *
   * @param {T.DirectionalLight|T.SpotLight} light Luz a posicionar.
   * @param {number} s Posição longitudinal da origem no percurso.
   * @param {number} x Deslocamento lateral da origem em relação ao centro.
   * @param {number} height Altura da origem acima do piso local.
   * @param {number} targetS Posição longitudinal do alvo.
   * @param {number} targetX Deslocamento lateral do alvo.
   * @param {number} [targetHeight=0] Altura do alvo acima do piso local.
   */
  place(light, s, x, height, targetS, targetX, targetHeight = 0) {
    const p = routePoint(s, x, height);
    const t = routePoint(targetS, targetX, targetHeight);
    light.position.set(p.x, p.y, p.z);
    light.target.position.set(t.x, t.y, t.z);
    light.target.updateMatrixWorld();
  }

  /**
   * Atualiza a composição para o estado atual, sem avançar o tempo do jogo.
   * A luz frontal acompanha o urso; as luzes de janela ficam em posições fixas
   * enquanto visíveis. Três posições reutilizáveis atendem sucessivamente às
   * janelas 0/3/6, 1/4/7 e 2/5/8, com troca somente após sair da influência local.
   *
   * smoothstep() faz transições suaves entre 0 e 1. A intensidade da luz controla
   * o clareamento; shadow.intensity controla só a força da sombra projetada.
   * A sombra da janela dominante desaparece antes de passar à seguinte, evitando
   * saltos e mantendo no máximo dois produtores ativos: frontal e uma janela.
   *
   * @param {object} state Estado da perseguição, consultado sem alteração.
   * @param {number} state.distance Posição longitudinal da menina.
   * @param {number} state.gap Distância longitudinal entre menina e urso.
   * @param {boolean} portrait Orientação da tela para a resolução dos mapas.
   */
  update(state, portrait) {
    this.resize(portrait);
    const bearS = state.distance + state.gap;
    this.place(this.reflected, state.distance - 6, 2, 4.5, state.distance + 6, 0, 1);
    // A altura de 28 evita a luz rasante que fazia a parede curva sombrear a pista inteira.
    this.place(this.front, bearS + 12, -1, 28, bearS - 8, 0);

    const windows = this.owner.room.decorations.filter(object => object.userData.windowIndex !== undefined);
    for (let slot = 0; slot < 3; slot++) {
      let index = slot;
      while (index < windows.length && windows[index].userData.routeDistance < state.distance - 22) index += 3;
      const light = this.windows[slot];
      const win = windows[index];
      if (!win) {
        light.intensity = 0;
        light.visible = false;
        continue;
      }
      const s = win.userData.routeDistance;
      const side = Math.sign(win.userData.lateral);
      const delta = s - state.distance;
      // Entrada de 53 a 37 unidades à frente; saída de 8 a 22 unidades atrás da menina.
      const fadeIn = T.MathUtils.smoothstep(53 - delta, 0, 16);
      const fadeOut = T.MathUtils.smoothstep(delta + 22, 0, 14);
      light.intensity = 100 * fadeIn * fadeOut;
      light.visible = light.intensity > .01;
      this.place(light, s, side * 5.2, 3.65, s + 5, -side * 1.7, .15);
      light.userData.windowDistance = s;
    }

    // Todas as janelas mantêm a mesma máscara, independentemente de qual projeta sombra.
    const dominant = this.windows.filter(light => light.visible).sort((a, b) =>
      Math.abs(a.userData.windowDistance - state.distance - 6) -
      Math.abs(b.userData.windowDistance - state.distance - 6))[0];
    for (const light of this.windows) {
      // O foco de interesse fica 6 unidades à frente da menina. Janelas estão espaçadas em 25:
      // a 12,5 unidades desse foco chega-se ao ponto médio, onde a sombra deve estar apagada.
      const separation = Math.abs(light.userData.windowDistance - state.distance - 6);
      light.shadow.intensity = light === dominant ? 1 - T.MathUtils.smoothstep(separation, 6, 12.5) : 0;
      light.castShadow = light.shadow.intensity > .0001;
    }
  }

  /**
   * Habilita sombras em brinquedos instanciados após o carregamento inicial.
   * A hierarquia é percorrida porque um brinquedo pode conter várias malhas.
   * Não clona nem descarta materiais/geometrias compartilhados pelo catálogo.
   * @param {T.Object3D} root Raiz do brinquedo recém-adicionado à cena.
   */
  prepareObject(root) {
    root.traverse(object => {
      if (!object.isMesh) return;
      object.castShadow = !object.material.transparent;
      object.receiveShadow = true;
    });
  }

  /**
   * Libera os mapas GPU e remove luzes/alvos da cena. Pode ser chamado novamente
   * com segurança: a marca disposed impede repetir o descarte.
   * Texturas e materiais registrados por owner.own() ficam a cargo do compositor.
   */
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    for (const light of this.lights) {
      light.shadow.dispose();
      light.removeFromParent();
      light.target.removeFromParent();
    }
    this.bounce.removeFromParent();
    this.reflected.removeFromParent();
    this.reflected.target.removeFromParent();
  }
}
