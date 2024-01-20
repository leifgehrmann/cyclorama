<script setup lang="ts">
import * as THREE from 'three';
import { ref, onMounted } from 'vue'

// Plan
// -    Mouse navigation = click-drag changes angle, joystick changes position
// -    Touch navigation = touch-drag changes angle, joystick changes position
// - ✅ Keyboard navigation = LRUD changes angle, WASD changes position
// -    joystick and other controls fades when no touch or mouse-movement on screen
// -    velocity of mouse/touch release results in acceleration

const scene = new THREE.Scene();

const mode = 'london' as 'london' | 'barker' | 'edinburgh' | 'alps';

const ft2m = (feet: number): number => {
  return 0.3048 * feet;
}

let texture1: THREE.Texture;
let panoramaRadius: number;
let panoramaHeight: number;
let panoramaY: number;
let stageRadius = ft2m(30/2);
let stageHeight = ft2m(1);
let umbrellaRadius = ft2m(50/2);
let ceilingHeight = 4;
// noinspection JSUnreachableSwitchBranches
switch (mode) {
  case 'alps': {
    texture1 = new THREE.TextureLoader().load('public/alps.jpg');
    scene.background = new THREE.Color(0xD8CFC8);
    const imageWidth = 4096;
    const imageHeight = 1491;
    panoramaRadius = ft2m(227 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = 5;
    break;
  }
  case 'edinburgh': {
    texture1 = new THREE.TextureLoader().load('public/lanorama.jpg');
    scene.background = new THREE.Color(0xD8CFC8);
    const imageWidth = 4000;
    const imageHeight = 544;
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = 0;
    stageRadius = ft2m(27/2);
    break;
  }
  case 'london': {
    texture1 = new THREE.TextureLoader().load('public/London_360_from_St_Paul\'s_Cathedral_-_Sept_2007.jpg');
    scene.background = new THREE.Color(0xAACCED);
    panoramaRadius = ft2m(130 / 2);
    panoramaHeight = ft2m(130 / 2);
    panoramaY = -5;
    break;
  }
  default: {
    scene.background = new THREE.Color(0xF8EFE8);
    texture1 = new THREE.TextureLoader().load('public/Barker_Panorama.jpg');
    const imageWidth = 18237;
    const imageHeight = 2248;
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = 0;
    stageRadius = ft2m(27/2);
    break;
  }
}

const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

const railingHeight = 0.8;
const railingCount = Math.round(stageRadius * Math.PI * 8);
const railingRadius = 0.02;
const railingPostOffset = 0.05;
const railingOnStageRadius = stageRadius - railingPostOffset - railingRadius;

const averageHeight = 1.70; // Average height for UK in the 1800s.
const breathingRatePerMin = 15; // Usually between 12-18 breaths per minute.
const breathingBobHeight = 0.02;

let controlState = {
  sagittal: 0, // forwards-backward
  frontal: 0, // crab-walk, left-right
  yaw: 0, // turning left-right
  pitch: 0, // looking up-down
}
let cameraPosX = camera.position.x;
let cameraPosZ = camera.position.z;
let cameraSagittalVel = 0;
let cameraSagittalVelMax = 0.7;
let cameraSagittalVelDecel = 0.7;
let cameraSagittalAcc = 0;
let cameraFrontalVel = 0;
let cameraFrontalVelMax = 0.7;
let cameraFrontalVelDecel = 0.7;
let cameraFrontalAcc = 0;
let cameraYaw = 0;
let cameraYawVel = 0;
let cameraYawVelMax = 0.7;
let cameraYawVelDecel = 0.7;
let cameraYawAcc = 0;
let cameraPitch = 0;
let cameraPitchVel = 0;
let cameraPitchVelMax = 0.7;
let cameraPitchVelDecel = 0.7;
let cameraPitchAcc = 0;

let keyboardRotationAcc = 0.005;
let keyboardWalkingAcc = 0.02;
let keyboardW = false;
let keyboardA = false;
let keyboardS = false;
let keyboardD = false;

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

const railingGeom = new THREE.TorusGeometry( railingOnStageRadius, railingRadius, 16, 100 );
const railingMat = new THREE.MeshBasicMaterial( { color: 0x555555 } );
const railing = new THREE.Mesh( railingGeom, railingMat );
railing.translateY(stageHeight + railingHeight)
railing.rotateX(Math.PI/2);
scene.add(railing);

for (let i = 0; i < railingCount; i++) {
  const theta = i / railingCount * Math.PI * 2;
  const railingPostX = Math.sin(theta) * (railingOnStageRadius);
  const railingPostZ = Math.cos(theta) * (railingOnStageRadius);
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
  if (event.code === 'ArrowLeft') {
    controlState.yaw = -keyboardRotationAcc;
  } else if (event.code === 'ArrowRight') {
    controlState.yaw = keyboardRotationAcc;
  } else if (event.code === 'ArrowDown') {
    controlState.pitch = keyboardRotationAcc;
  } else if (event.code === 'ArrowUp') {
    controlState.pitch = -keyboardRotationAcc;
  } else if (event.code === 'KeyW') {
    keyboardW = true;
  } else if (event.code === 'KeyA') {
    keyboardA = true;
  } else if (event.code === 'KeyS') {
    keyboardS = true;
  } else if (event.code === 'KeyD') {
    keyboardD = true;
  }
})

window.addEventListener('keyup', (event) => {
  if (event.code === 'ArrowLeft') {
    controlState.yaw = 0;
  } else if (event.code === 'ArrowRight') {
    controlState.yaw = 0;
  } else if (event.code === 'ArrowDown') {
    controlState.pitch = 0;
  } else if (event.code === 'ArrowUp') {
    controlState.pitch = 0;
  } else if (event.code === 'KeyW') {
    keyboardW = false;
    controlState.sagittal = 0;
    controlState.frontal = 0;
  } else if (event.code === 'KeyA') {
    keyboardA = false;
    controlState.sagittal = 0;
    controlState.frontal = 0;
  } else if (event.code === 'KeyS') {
    keyboardS = false;
    controlState.sagittal = 0;
    controlState.frontal = 0;
  } else if (event.code === 'KeyD') {
    keyboardD = false;
    controlState.sagittal = 0;
    controlState.frontal = 0;
  }
})

function animate() {
  requestAnimationFrame( animate );
  // compute direction from keyboard. Keyboard overrides joystick controls.
  if (keyboardW || keyboardA || keyboardS || keyboardD) {
    controlState.sagittal = 0;
    controlState.frontal = 0;
    if (keyboardW) {
      controlState.sagittal += keyboardWalkingAcc
    }
    if (keyboardA) {
      controlState.frontal -= keyboardWalkingAcc
    }
    if (keyboardS) {
      controlState.sagittal -= keyboardWalkingAcc
    }
    if (keyboardD) {
      controlState.frontal += keyboardWalkingAcc
    }
    if (controlState.frontal !== 0 && controlState.sagittal !== 0 ) {
      controlState.sagittal *= 1 / Math.sqrt(2);
      controlState.frontal *= 1 / Math.sqrt(2);
    }
  }

  // Update View
  cameraYawAcc = controlState.yaw;
  cameraYawVel += cameraYawAcc;
  cameraYawVel *= cameraYawVelDecel;
  cameraYawVel = THREE.MathUtils.clamp(cameraYawVel, -cameraYawVelMax, cameraYawVelMax)

  cameraPitchAcc = controlState.pitch;
  cameraPitchVel += cameraPitchAcc;
  cameraPitchVel *= cameraPitchVelDecel;
  cameraPitchVel = THREE.MathUtils.clamp(cameraPitchVel, -cameraPitchVelMax, cameraPitchVelMax)

  cameraYaw += cameraYawVel;
  cameraPitch += THREE.MathUtils.clamp(cameraPitchVel, -Math.PI/2, Math.PI/2);

  // Update movement
  cameraSagittalAcc = controlState.sagittal;
  cameraSagittalVel += cameraSagittalAcc;
  cameraSagittalVel *= cameraSagittalVelDecel;
  cameraSagittalVel = THREE.MathUtils.clamp(cameraSagittalVel, -cameraSagittalVelMax, cameraSagittalVelMax)

  cameraFrontalAcc = controlState.frontal;
  cameraFrontalVel += cameraFrontalAcc;
  cameraFrontalVel *= cameraFrontalVelDecel;
  cameraFrontalVel = THREE.MathUtils.clamp(cameraFrontalVel, -cameraFrontalVelMax, cameraFrontalVelMax)

  cameraPosX -= Math.sin(-cameraYaw) * cameraSagittalVel + Math.sin(-cameraYaw - Math.PI / 2) * cameraFrontalVel;
  cameraPosZ -= Math.cos(-cameraYaw) * cameraSagittalVel + Math.cos(-cameraYaw - Math.PI / 2) * cameraFrontalVel;

  // Prevent out of bounds by resetting position to railing radius
  const angleFromCenter = Math.atan2(cameraPosX, cameraPosZ)
  const maxDistAtRailingX = Math.abs(Math.sin(angleFromCenter) * railingOnStageRadius);
  const maxDistAtRailingZ = Math.abs(Math.cos(angleFromCenter) * railingOnStageRadius);
  cameraPosX = THREE.MathUtils.clamp(cameraPosX, -maxDistAtRailingX, maxDistAtRailingX)
  cameraPosZ = THREE.MathUtils.clamp(cameraPosZ, -maxDistAtRailingZ, maxDistAtRailingZ)

  resizeRendererToDisplaySize(renderer);
  camera.setRotationFromEuler(new THREE.Euler(
      -cameraPitch,
      -cameraYaw,
      0,
      'YZX'
  ))
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
