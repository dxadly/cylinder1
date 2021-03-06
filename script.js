import * as THREE from "https://cdn.skypack.dev/three";

import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/DRACOLoader.js";

import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";

import store from "./store.js";
var scene = new THREE.Scene();
// setup the camera
/*
PerspectiveCamera( fov, aspect, near, far )

fov — Camera frustum vertical field of view.
aspect — Camera frustum aspect ratio.
near — Camera frustum near plane.
far — Camera frustum far plane.
*/
var camera = new THREE.PerspectiveCamera( 30 /* zoom in/out  */, window.innerWidth/window.innerHeight, 0.1, 1000 );

/*
WebGLRenderer( parameters )

parameters is an optional object with properties defining the renderer's behaviour. The constructor also accepts no parameters at all. In all cases, it will assume sane defaults when parameters are missing.
canvas — A Canvas where the renderer draws its output.
precision — shader precision. Can be "highp", "mediump" or "lowp".
alpha — Boolean, default is false.
premultipliedAlpha — Boolean, default is true.
antialias — Boolean, default is false.
stencil — Boolean, default is true.
preserveDrawingBuffer — Boolean, default is false.
maxLights — Integer, default is 4.
*/
var renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


/*
BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)

width — Width of the sides on the X axis.
height — Height of the sides on the Y axis.
depth — Depth of the sides on the Z axis.
widthSegments — Optional. Number of segmented faces along the width of the sides. Default is 1.
heightSegments — Optional. Number of segmented faces along the height of the sides. Default is 1.
depthSegments — Optional. Number of segmented faces along the depth of the sides. Default is 1.
*/
var geometry = new THREE.BoxGeometry( 1, 1, 1 );

var material = new THREE.MeshBasicMaterial( { color: 0xaa0000 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 10;

var render = function () {
  requestAnimationFrame( render );

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

render();
