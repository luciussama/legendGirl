import * as T from '../../vendor/three/three.module.js';
import { routeFrame } from './ChaseRoute.js';

/** Pequeno núcleo luminoso com quatro asas em volume e voo orbital ao redor da menina. */
export class ChaseFairyModel {
  /** Cria malhas compartilhadas e um rastro instanciado, sem sprite ou pós-processamento. */
  constructor(own) {
    this.root = new T.Group(); this.root.name = 'Fadinha3D';
    this.anchor = new T.Vector3(); this.offset = new T.Vector3(); this.previous = new T.Vector3();
    this.particleMatrix = new T.Matrix4(); this.particleScale = new T.Vector3();
    this.particleRotation = new T.Quaternion();
    const sphere = own(new T.SphereGeometry(1, 20, 12));
    this.core = new T.Mesh(sphere, own(new T.MeshBasicMaterial({ color: '#efffff', toneMapped: false })));
    this.core.name = 'NucleoDeLuz'; this.core.scale.setScalar(.065); this.root.add(this.core);
    // A casca esférica some suavemente na silhueta; o núcleo branco continua nítido.
    this.glowMaterial = own(new T.ShaderMaterial({
      uniforms: { pulse: { value: 1 } }, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      vertexShader: `varying vec3 vNormal; varying vec3 vView;
        void main() { vec4 p = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal); vView = -p.xyz; gl_Position = projectionMatrix * p; }`,
      fragmentShader: `uniform float pulse; varying vec3 vNormal; varying vec3 vView;
        void main() { float facing = max(0.0, dot(normalize(vNormal), normalize(vView)));
          gl_FragColor = vec4(0.12, 0.72, 1.0, pow(facing, 1.7) * 0.48 * pulse);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    }));
    this.glow = new T.Mesh(sphere, this.glowMaterial); this.glow.name = 'AuraAzul';
    this.glow.scale.setScalar(.145); this.root.add(this.glow);
    const wingMaterial = own(new T.MeshStandardMaterial({ color: '#edf9ff', emissive: '#cbeeff', emissiveIntensity: .55,
      roughness: .78, metalness: 0, transparent: true, opacity: .8, depthWrite: false, vertexColors: true }));
    const wings = own(this.wingGeometry()); this.wings = [];
    for (const side of [-1, 1]) {
      const pivot = new T.Group(); pivot.name = 'AsasDaFada'; pivot.position.set(side * .03, 0, .015);
      pivot.scale.x = side;
      const mesh = new T.Mesh(wings, wingMaterial); mesh.name = 'AsasPeroladasComEspessura'; pivot.add(mesh);
      this.root.add(pivot); this.wings.push(pivot);
    }
    this.trail = new T.InstancedMesh(own(new T.IcosahedronGeometry(.014, 0)),
      own(new T.MeshBasicMaterial({ color: '#b4efff', transparent: true, opacity: .55,
        blending: T.AdditiveBlending, depthWrite: false, toneMapped: false })), 6);
    this.trail.name = 'RastroDeLuz'; this.trail.instanceMatrix.setUsage(T.DynamicDrawUsage);
    this.trail.frustumCulled = false; this.root.add(this.trail);
    this.root.traverse(object => {
      if (!object.isMesh) return;
      object.userData.fairyLuminous = true; object.castShadow = false; object.receiveShadow = false;
    });
    this.root.userData.authoring = 'Núcleo branco/ciano com quatro asas peroladas e voo orbital, conforme referência enviada pelo usuário; sem corpo humanoide.';
  }

  /** Modela asas afuniladas, levemente abauladas nas duas faces, com nervuras por vértice. */
  wingGeometry() {
    const positions = [], colors = [], indices = [], rings = 5, segments = 20;
    for (const [cx, cy, rx, ry, angle] of [[.145, .13, .062, .215, -.68], [.102, -.065, .084, .043, -.45]]) {
      const start = positions.length / 3;
      for (const face of [-1, 1]) for (let ring = 0; ring <= rings; ring++) for (let i = 0; i <= segments; i++) {
        const r = ring / rings, a = i / segments * Math.PI * 2;
        const x = Math.cos(a) * rx * r, y = Math.sin(a) * ry * r;
        positions.push(cx + x * Math.cos(angle) - y * Math.sin(angle), cy + x * Math.sin(angle) + y * Math.cos(angle), face * .009 * (1 - r * r));
        const vein = .87 + .13 * Math.abs(Math.cos(a * 3 + r * 5));
        colors.push(vein * .94, vein * .98, vein);
      }
      const count = (rings + 1) * (segments + 1);
      for (let face = 0; face < 2; face++) for (let ring = 0; ring < rings; ring++) for (let i = 0; i < segments; i++) {
        const a = start + face * count + ring * (segments + 1) + i, b = a + segments + 1;
        if (face) indices.push(a, b, a + 1, b, b + 1, a + 1); else indices.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
    const geometry = new T.BufferGeometry(); geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new T.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices); geometry.computeVertexNormals(); return geometry;
  }

  /** Órbita elíptica com variação de altura: passa dos dois lados, à frente e atrás da menina. */
  flightOffset(time, target) {
    const phase = time * 1.55, radius = .72 + Math.sin(time * .73) * .065;
    return target.set(Math.cos(phase) * radius, .12 + Math.sin(phase * 1.35) * .22 + Math.sin(time * 5.2) * .035,
      Math.sin(phase) * .54);
  }

  /** Resolve órbita, asas e rastro pelo relógio salvo; renderizações repetidas não avançam o voo. */
  apply(state, girlModel) {
    girlModel.head.updateWorldMatrix(true, false);
    this.anchor.set(0, .28, 0).applyMatrix4(girlModel.head.matrixWorld);
    const yaw = routeFrame(state.distance).yaw, t = state.time;
    this.flightOffset(t, this.offset);
    this.root.position.copy(this.anchor);
    this.root.position.x += Math.cos(yaw) * this.offset.x + Math.sin(yaw) * this.offset.z;
    this.root.position.z += -Math.sin(yaw) * this.offset.x + Math.cos(yaw) * this.offset.z;
    this.root.position.y += this.offset.y;
    this.root.rotation.set(Math.sin(t * 2.1) * .08, yaw + Math.cos(t * 1.55) * .22, Math.sin(t * 1.55) * .16);
    const pulse = 1 + Math.sin(t * 3.6) * .055;
    this.core.scale.setScalar(.065 * pulse); this.glow.scale.setScalar(.145 * pulse);
    this.glowMaterial.uniforms.pulse.value = pulse;
    for (let i = 0; i < this.wings.length; i++) this.wings[i].rotation.y = (i ? 1 : -1) * (.24 + Math.sin(t * 26) * .7);
    for (let i = 0; i < this.trail.count; i++) {
      this.flightOffset(t - (i + 1) * .075, this.previous);
      this.previous.sub(this.offset); this.previous.z += (i + 1) * .025;
      this.particleScale.setScalar((1 - i / this.trail.count) * (.65 + .2 * Math.sin(t * 5 + i)));
      this.particleMatrix.compose(this.previous, this.particleRotation, this.particleScale); this.trail.setMatrixAt(i, this.particleMatrix);
    }
    this.trail.instanceMatrix.needsUpdate = true;
    this.root.visible = true; this.root.updateMatrixWorld(true);
  }
}
