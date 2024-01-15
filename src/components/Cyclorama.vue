<script setup lang="ts">
import * as THREE from 'three';
import { ref, onMounted } from 'vue'

const scene = new THREE.Scene();

const mode = 'london' as 'london' | 'barker';

const ft2m = (feet: number): number => {
  return 0.3048 * feet;
}

let texture1: THREE.Texture;
let panoramaRadius: number;
let panoramaHeight: number;
let panoramaY: number;
// noinspection JSUnreachableSwitchBranches
switch (mode) {
  case 'london':
    texture1 = new THREE.TextureLoader().load( 'public/London_360_from_St_Paul\'s_Cathedral_-_Sept_2007.jpg' );
    scene.background = new THREE.Color( 0xAACCED );
    panoramaRadius = ft2m(130/2);
    panoramaHeight = ft2m(130/2);
    panoramaY = -5;
    break;
  default:
    scene.background = new THREE.Color( 0xF8EFE8 );
    texture1 = new THREE.TextureLoader().load( 'public/Barker_Panorama.jpg' );
    panoramaRadius = ft2m(130/2);
    panoramaHeight = ft2m(70.3);
    panoramaY = 0;
    break;
}

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

const stageRadius = ft2m(30/2);
const stageHeight = ft2m(1);
const umbrellaRadius = ft2m(50/2);
const ceilingHeight = 4;
const railingHeight = 0.8;
const railingCount = Math.round(stageRadius * Math.PI * 8);
const railingRadius = 0.02;
const railingPostOffset = 0.05;

const averageHeight = 1.70; // Average height for UK in the 1800s.
const breathingRatePerMin = 15; // Usually between 12-18 breaths per minute.
const breathingBobHeight = 0.02;

let cameraPosX = camera.position.x;
let cameraPosZ = camera.position.z;
let cameraVel = 0;
let cameraAcc = 0;
let cameraAngle = 0;

const panoramaGeom = new THREE.CylinderGeometry( panoramaRadius, panoramaRadius, panoramaHeight, 60, 1, true);
const panoramaMat = new THREE.MeshBasicMaterial( { map: texture1 } );
const panorama = new THREE.Mesh( panoramaGeom, panoramaMat );

panorama.geometry.scale(-1, -1, -1)
panorama.geometry.rotateZ(Math.PI)
panorama.geometry.translate(0, panoramaY, 0);
scene.add( panorama );

const stageGeom = new THREE.CylinderGeometry( stageRadius, stageRadius, stageHeight, 60, 1, false);
const stageMat = new THREE.MeshBasicMaterial( { color: 0x888888 } );
const stage = new THREE.Mesh( stageGeom, stageMat );
stage.translateY(stageHeight/2);
scene.add( stage );

const umbrellaGeom = new THREE.CylinderGeometry( umbrellaRadius, umbrellaRadius, 0.1, 60, 1, false);
const umbrellaMat = new THREE.MeshBasicMaterial( { color: 0x333333 } );
const umbrella = new THREE.Mesh( umbrellaGeom, umbrellaMat );
umbrella.translateY(stageHeight + ceilingHeight)
scene.add( umbrella );

const railingGeom = new THREE.TorusGeometry( stageRadius - railingPostOffset - railingRadius, railingRadius, 16, 100 );
const railingMat = new THREE.MeshBasicMaterial( { color: 0x555555 } );
const railing = new THREE.Mesh( railingGeom, railingMat );
railing.translateY(stageHeight + railingHeight)
railing.rotateX(Math.PI/2);
scene.add(railing);

for (let i = 0; i < railingCount; i++) {
  const theta = i / railingCount * Math.PI * 2;
  const railingPostX = Math.sin(theta) * (stageRadius - railingPostOffset - railingRadius);
  const railingPostZ = Math.cos(theta) * (stageRadius - railingPostOffset - railingRadius);
  const railingPostGeom = new THREE.CylinderGeometry( railingRadius, railingRadius, railingHeight, 16, 1, false);
  const railingPostMat = new THREE.MeshBasicMaterial( { color: 0x555555 } );
  const railingPost = new THREE.Mesh( railingPostGeom, railingPostMat );
  railingPost.translateX(railingPostX)
  railingPost.translateZ(railingPostZ)
  railingPost.translateY(stageHeight + railingHeight/2)
  scene.add(railingPost);
}

camera.position.y = stageHeight + 1;

function resizeRendererToDisplaySize(renderer: THREE.Renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width  = canvas.clientWidth  * pixelRatio | 0;
  const height = canvas.clientHeight * pixelRatio | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'Minus') {
    // updateZoomDirection(-1);
  } else if (event.code === 'Equal') {
    // updateZoomDirection(1);
  } else if (event.shiftKey && event.code === 'ArrowLeft') {
    cameraAngle -= 0.1;
  } else if (event.shiftKey && event.code === 'ArrowRight') {
    cameraAngle += 0.1;
  } else if (event.code === 'ArrowLeft') {
    cameraAngle -= 0.02;
  } else if (event.code === 'ArrowRight') {
    cameraAngle += 0.02;
  } else if (event.code === 'ArrowDown') {
    cameraPosX += Math.sin(cameraAngle) * 0.1;
    cameraPosZ += Math.cos(cameraAngle) * 0.1;
  } else if (event.code === 'ArrowUp') {
    cameraPosX -= Math.sin(cameraAngle) * 0.1;
    cameraPosZ -= Math.cos(cameraAngle) * 0.1;
  }
})

function animate() {
  requestAnimationFrame( animate );
  resizeRendererToDisplaySize(renderer);
  camera.rotation.y = cameraAngle;
  camera.position.x = cameraPosX;
  camera.position.z = cameraPosZ;
  camera.position.y = stageHeight + averageHeight + Math.sin(new Date().getTime() / (60 / breathingRatePerMin * 1000) * Math.PI) * breathingBobHeight / 2;
  renderer.render( scene, camera );
}
animate();

const canvas = ref(null)

onMounted(() => {
  canvas.value.appendChild(renderer.domElement);
})
</script>

<template>
  <div ref="canvas"></div>
</template>

<style scoped>
</style>
