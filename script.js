import * as THREE from "https://cdn.skypack.dev/three";

import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/DRACOLoader.js";

import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";

import store from "./store.js";

import * as THREE from '//cdn.skypack.dev/three@0.129.0?min'
import { OrbitControls } from '//cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls?min'
import webfontloader from '//cdn.skypack.dev/webfontloader@1.6.28?min'

// ----
// tex
// ----

const can = document.createElement('canvas');
const tex0 = new THREE.CanvasTexture(can, THREE.UVMapping, THREE.RepeatWrapping);
const fontSize = 256;
const font = `bold ${fontSize}px "Viaoda Libre"`;
const text = `  wraparound  `.repeat(2) // the msg

webfontloader.load({
  google: {
    families: ['Viaoda Libre']
  },
  active: makeTex,
  inactive: () => alert('failed to load font, bye.')
});

function makeTex() {
  const ctx = can.getContext('2d');
  ctx.font = font;

  can.width = ctx.measureText(text).width;
  can.height = fontSize * 4 / 3;

  ctx.font = font;
  ctx.fillStyle = 'lime';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, can.height / 2);

  tex0.needsUpdate = true;
}

// ----
// main
// ----

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 2, .1, 100);
const controls = new OrbitControls(camera, renderer.domElement);

scene.background = new THREE.Color('#ddd');
camera.position.set(0, 2, 12);
controls.enableDamping = true;
renderer.shadowMap.enabled = true;

const light = new THREE.DirectionalLight('white', .5);
light.castShadow = true;
light.position.set(0, 5, 5);
light.shadow.camera.far = 32;
light.shadow.camera.bottom = -20;
light.shadow.mapSize.setScalar(1024);
scene.add(light);

scene.add(new THREE.AmbientLight('white', .5));

// ----
// prod model - stub
// ----

{
  const geom = new THREE.CylinderGeometry(2, 2, 15, 50);
  const mat = new THREE.MeshPhongMaterial({});
  const mesh = new THREE.Mesh(geom, mat);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  scene.add(mesh);
}

// ----
// ribbon
// ----

const ribbon = (() => {
  const W = 15; // width
  const H = 4; // height
  const F = 3; // n turns
  const R = 2 + 1; // radius
  const tex1 = new THREE.TextureLoader().load('https://images.unsplash.com/photo-1469980098053-382eb10ba017?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OTl8fHN0YXJ8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60');

  const geom = new THREE.ParametricGeometry((u, v, dst) => {
    const a = (u * F * 2 + 1) * Math.PI; // twist 90d to hide seam
    const x = R * Math.sin(a);
    const z = R * Math.cos(a);
    const y = (0.5 - u) * W + (v - 0.5) * H;
    dst.set(x, y, z);
  }, 100, 1);
  const mat = new THREE.MeshPhongMaterial({
    map: tex1, // tint
    side: THREE.DoubleSide,
    alphaMap: tex0,
    alphaTest: 0.5,
  });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.castShadow = true;
  mesh.customDepthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
    alphaMap: mat.alphaMap,
    alphaTest: mat.alphaTest
  });
  return mesh;
})();
scene.add(ribbon);

// ----
// render
// ----

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
  controls.update();
  tex0.offset.x += 0.001;
  ribbon.material.map.offset.x += 0.001;
});

// ----
// view
// ----

function resize(w, h, dpr = devicePixelRatio) {
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
addEventListener('resize', () => resize(innerWidth, innerHeight));
dispatchEvent(new Event('resize'));
document.body.prepend(renderer.domElement);
