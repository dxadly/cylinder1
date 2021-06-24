import * as THREE from "https://cdn.skypack.dev/three";

import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/DRACOLoader.js";

import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";

import store from "./store.js";

// 准备场景、相机、渲染器、光线
let scene = null;
let camera = null;
let renderer = null;
let light = null;
let initThree =  function() {
    // 创建渲染器
    const canvas = document.querySelector('#three_canvas');
    renderer = new THREE.WebGLRenderer({canvas});// 创建渲染器，canvas可传可不传。传一个canvas对象更灵活
    renderer.setSize(window.innerWidth, window.innerHeight);// 设置渲染器的宽高

    // 创建相机
    const fov = 75;// 视野范围，垂直方向75度角
    const aspect = window.innerWidth / window.innerHeight;// 画布的宽高比，默认是2，建议使用画布在浏览器里的大小比，
    const near = 0.1;// 近平面
    const far = 1000;// 远平面，近平面和远平面限制了摄像机面朝方向的可绘区域，任何距离小于或超过这个范围的物体都将被裁剪掉(不绘制)
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 10;

    // 创建场景
    scene = new THREE.Scene();

    // 创建一束光线
    const color = 0xFFFFFF;// 光颜色
    const intensity = 2;// 光照强度
    light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 0, 10);// 设置光源发射点的位置
    scene.add(light);
}

// 初始化球体
let sunMesh = null;
let initBox = function() {
    const radius = 1;
    const widthSegments = 32;
    const heightSegments = 32;
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

    // 太阳
    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://webjunjun.github.io/wechat/earth.jpg');
    texture.offset.y = 0.1;// 偏移贴图
    const sunMaterial = new THREE.MeshPhongMaterial({
        map: texture,
    });
    sunMesh = new THREE.Mesh(geometry, sunMaterial);
    sunMesh.scale.set(4, 4, 4);
    scene.add(sunMesh);
}

function animate(time) {
    time *= 0.0002;
    sunMesh.rotation.y = time;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// 启动方法或其他初始化方法
initThree();
initBox();
animate();
