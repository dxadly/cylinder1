import * as THREE from '//cdn.skypack.dev/three@0.129?min'
import { OrbitControls } from '//cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls?min'
import { EffectComposer, Pass, FullScreenQuad } from '//cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/EffectComposer?min'
import { RenderPass } from '//cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/RenderPass?min'
import gsap from '//cdn.skypack.dev/gsap';
import { CSGModeller } from '//cdn.jsdelivr.net/gh/ycw/three-csg-modeller@0.1.10/src/index.js'
import { DualBloomPassGen } from '//cdn.jsdelivr.net/gh/ycw/three-dual-bloom@1.1.7/src/index.js'

// ----
// main ( @2021-05-31 )
// ----

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 2, .1, 100);
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(1, 2, 7);
controls.enableDamping = true;

const light = new THREE.PointLight('tomato', 1);
scene.add(light);

// ----
// csg mod
// ----

const modeller = new CSGModeller(THREE);
const model0 = modeller.model(new THREE.Mesh(
  new THREE.BoxBufferGeometry(),
  new THREE.MeshPhongMaterial()
));
const model1 = model0.applyMatrix4(new THREE.Matrix4().makeScale(.7, .7, 2));
const model2 = model0.applyMatrix4(new THREE.Matrix4().makeScale(.7, 2, .7));
const model3 = model0.applyMatrix4(new THREE.Matrix4().makeScale(2, .7, .7));
const mesh = model0.subtract(model1).subtract(model2).subtract(model3).build();

// ----
// array mod
// ----

const rSeg = 20;
const hSeg = 40;
const geom = new THREE.CylinderBufferGeometry(6, 6, 100, rSeg, hSeg, true, 0, Math.PI * 2 * (rSeg - 1) / rSeg);
const nInst = geom.attributes.position.count;

const inst = new THREE.InstancedMesh(mesh.geometry, mesh.material, nInst);
const instMatrix = new THREE.Matrix4();
for (let i = 0, I = nInst; i < I; ++i) {
  const n = (i % rSeg) / rSeg * 5;
  instMatrix.setPosition(
    geom.attributes.position.getX(i),
    geom.attributes.position.getY(i),
    geom.attributes.position.getZ(i),
  ).multiply(new THREE.Matrix4().makeRotationZ(n * Math.PI));
  inst.setMatrixAt(i, instMatrix);
  inst.setColorAt(i, new THREE.Color().setHSL(n, .5, .5));
}
inst.instanceMatrix.needsUpdate = true;
inst.instanceColor.needsUpdate = true;
scene.add(inst);
geom.dispose();

// ----
// render
// ----

const DualBloomPass = new DualBloomPassGen({ THREE, Pass, FullScreenQuad });
const dualBloomPass = new DualBloomPass({
  threshold: .8,
  blurriness: .2,
  intensity: 5,
});

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(dualBloomPass);

renderer.setAnimationLoop(() => {
  composer.render();
  controls.update();
});

gsap.to(dualBloomPass, { threshold: .1, intensity: 2, duration: 5 });
gsap.to(inst.position, { y: 10, duration: 5, repeat: -1, ease: 'none' });
gsap.to(inst.rotation, { y: Math.PI * 2, duration: 5 * 12, repeat: -1, ease: 'none' });

// ----
// view
// ----

function resize(w, h, dpr = devicePixelRatio) {
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  composer.setPixelRatio(dpr);
  composer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
addEventListener('resize', () => resize(innerWidth, innerHeight));
dispatchEvent(new Event('resize'));
document.body.prepend(renderer.domElement);
