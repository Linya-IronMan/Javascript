import * as THREE from "three";

/***** 常量定义 ***** */
// 画布尺寸
const width = 800;
const height = 500;

// 创建场景
const scene = new THREE.Scene();

// 物体形状：几何体
const geometry = new THREE.BoxGeometry(100, 100, 100);
// 物体外观：材质
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// 物体：网格 网格模型 Mesh 将物体的材质以及几何体纳入网格模型
const mesh = new THREE.Mesh(geometry, material);
// 物体网格：模型位置：.position
mesh.position.set(0, 0, 0);
scene.add(mesh);

/******** 添加相机 *******/
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
camera.position.set(200, 200, 200);

camera.lookAt(mesh.position);

/******** 创建渲染器 *******/
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.render(scene, camera);
document.body.appendChild(renderer.domElement);
