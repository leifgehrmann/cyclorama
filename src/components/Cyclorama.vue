<script setup lang="ts">
import * as THREE from 'three';
import { ref, onMounted } from 'vue'
import Stage from "../sceneObjects/stage.ts";
import Sky from "../sceneObjects/sky.ts";
import Ground from "../sceneObjects/ground.ts";
import Person from "../sceneObjects/person.ts";
import Panorama from "../sceneObjects/panorama.ts";

// Plan
// -    Mouse navigation = click-drag changes angle, joystick changes position
// -    Touch navigation = touch-drag changes angle, joystick changes position
// - ✅ Keyboard navigation = LRUD changes angle, WASD changes position
// -    joystick and other controls fades when no touch or mouse-movement on screen
// -    velocity of mouse/touch release results in acceleration
// -    Pinch to zoom changes FOV.
// -    scroll changes FOV
// -    + / - changes FOV
// -    Q / E changes height

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000)

const mode = 'london' as 'london' | 'barker' | 'edinburgh' | 'alps' | 'constantinople';

const ft2m = (feet: number): number => {
  return 0.3048 * feet;
}

let panoramaUrl: string;
let panoramaRadius: number;
let panoramaHeight: number;
let panoramaCeilingY: number;
let groundColor: THREE.Color = new THREE.Color(0x000000);
let groundYStart: number;
let groundYEnd: number;
let skyColor: THREE.Color;
let skyYStart: number;
let skyYEnd: number;
let panoramaY: number;
let stageRadius = ft2m(30/2);
let stageHeight = 0;
let umbrellaRadius = ft2m(50/2);
let ceilingHeight = 4;
let initialCameraYaw = 0;
// noinspection JSUnreachableSwitchBranches
switch (mode) {
  case 'constantinople': {
    panoramaUrl = 'public/Constantinople.jpg';
    skyColor = new THREE.Color(0xD8CFC8);
    groundColor = new THREE.Color(0x000000);
    const imageWidth = 1875;
    const imageHeight = 319;
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.4;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 2;
    break;
  }
  case 'alps': {
    panoramaUrl = 'public/alps.jpg';
    skyColor = new THREE.Color(0xD8CFC8);
    groundColor = new THREE.Color(0x000000);
    const imageWidth = 4096;
    const imageHeight = 1491;
    panoramaRadius = ft2m(227 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.4;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 10;
    break;
  }
  case 'edinburgh': {
    panoramaUrl = 'public/lanorama.jpg';
    skyColor = new THREE.Color(0xD8CFC8);
    const imageWidth = 4000;
    const imageHeight = 544;
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.45;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 1;
    break;
  }
  case 'london': {
    panoramaUrl = 'public/London_360_from_St_Paul\'s_Cathedral_-_Sept_2007.jpg';
    skyColor = new THREE.Color(0xAACCED);
    groundColor = new THREE.Color(0x111121);
    panoramaRadius = ft2m(130 / 2);
    panoramaHeight = ft2m(130 / 2);
    panoramaY = -panoramaHeight * 0.7;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 2;
    break;
  }
  default: {
    panoramaUrl = 'public/Barker_Panorama.jpg';
    skyColor = new THREE.Color(0xDCD7B7);
    groundColor = new THREE.Color(0x212111);
    const imageWidth = 18237;
    const imageHeight = 2248;
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.5;
    stageRadius = ft2m(27/2);
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY;
    groundYEnd = panoramaY + 1;
    initialCameraYaw = Math.PI * 0.8;
    break;
  }
}

const railingHeight = 0.9;
const railingCount = Math.round(stageRadius * Math.PI * 8);
const railingRadius = 0.02;
const railingPostOffset = 0.1;
const railingOnStageRadius = stageRadius - railingPostOffset - railingRadius;

const averageHeight = 1.70; // Average height for UK in the 1800s.
const breathingRatePerMin = 15; // Usually between 12-18 breaths per minute.
const breathingBobHeight = 0.02;

const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );

let controlState = {
  sagittal: 0, // forwards-backward
  frontal: 0, // crab-walk, left-right
  yaw: 0, // turning left-right
  pitch: 0, // looking up-down
  zoom: 0, // zoom in-out
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
let cameraYaw = initialCameraYaw;
let cameraYawVel = 0;
let cameraYawVelMax = 0.7;
let cameraYawVelDecel = 0.7;
let cameraYawAcc = 0;
let cameraPitch = 0;
let cameraPitchVel = 0;
let cameraPitchVelMax = 0.7;
let cameraPitchVelDecel = 0.7;
let cameraPitchAcc = 0;
let cameraZoom = camera.getFocalLength();
let cameraZoomMin = cameraZoom;
let cameraZoomMax = cameraZoom + 30;
let cameraZoomVel = 0;
let cameraZoomVelMax = 0.7;
let cameraZoomVelDecel = 0.7;
let cameraZoomAcc = 0;

let keyboardRotationAcc = 0.005;
let keyboardRotationAccFast = 0.050;
let keyboardFovAccFast = 0.2;
let keyboardWalkingAcc = 0.02;
let keyboardWalkingAccFast = 0.04;
let keyboardShift = false;
let keyboardW = false;
let keyboardA = false;
let keyboardS = false;
let keyboardD = false;

new Panorama(
    scene,
    panoramaUrl,
    panoramaRadius,
    panoramaHeight,
    panoramaY
);

const stage = new Stage(
    stageRadius,
    stageHeight,
    umbrellaRadius,
    ceilingHeight,
    railingHeight,
    railingCount,
    railingRadius,
    railingOnStageRadius
);
stage.addToScene(scene)

const sky = new Sky(
    panoramaRadius,
    panoramaCeilingY,
    skyYStart,
    skyYEnd,
    skyColor,
);
sky.addToScene(scene)

const ground = new Ground(
    panoramaRadius,
    groundYStart,
    groundYEnd,
    groundColor,
);
ground.addToScene(scene)

const person1 = new Person(
    scene,
    'person-1.svg',
    1.76,
)
person1.setPosition(stageRadius - 0.7, stageHeight, 0)

const person2 = new Person(
    scene,
    'person-2.svg',
    1.85,
)
person2.setPosition(0, stageHeight, stageRadius - 1)

camera.position.y = stageHeight + 1;

function resizeRendererToDisplaySize(renderer: THREE.Renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width  = window.innerWidth  * pixelRatio | 0;
  const height = window.innerHeight * pixelRatio | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowLeft') {
    controlState.yaw = event.shiftKey ? -keyboardRotationAccFast : -keyboardRotationAcc;
  } else if (event.code === 'ArrowRight') {
    controlState.yaw = event.shiftKey ? keyboardRotationAccFast : keyboardRotationAcc;
  } else if (event.code === 'ArrowDown') {
    controlState.pitch = event.shiftKey ? keyboardRotationAccFast : keyboardRotationAcc;
  } else if (event.code === 'ArrowUp') {
    controlState.pitch = event.shiftKey ? -keyboardRotationAccFast : -keyboardRotationAcc;
  } else if (event.code === 'KeyQ') {
    controlState.zoom = -keyboardFovAccFast;
  } else if (event.code === 'KeyE') {
    controlState.zoom = keyboardFovAccFast;
  } else if (event.code === 'KeyW') {
    keyboardW = true;
  } else if (event.code === 'KeyA') {
    keyboardA = true;
  } else if (event.code === 'KeyS') {
    keyboardS = true;
  } else if (event.code === 'KeyD') {
    keyboardD = true;
  } else if (event.code === 'ShiftLeft' || event.code === 'KeyRight') {
    keyboardShift = true;
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
  } else if (event.code === 'KeyQ') {
    controlState.zoom = 0;
  } else if (event.code === 'KeyE') {
    controlState.zoom = 0;
  }if (event.code === 'KeyW') {
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
  } else if (event.code === 'ShiftLeft' || event.code === 'KeyRight') {
    keyboardShift = false;
  }
})

let lastRenderTime = new Date();

function animate() {
  requestAnimationFrame( animate );
  // compute direction from keyboard. Keyboard overrides joystick controls.
  if (keyboardW || keyboardA || keyboardS || keyboardD) {
    controlState.sagittal = 0;
    controlState.frontal = 0;
    if (keyboardW) {
      controlState.sagittal += keyboardShift ? keyboardWalkingAccFast : keyboardWalkingAcc
    }
    if (keyboardA) {
      controlState.frontal -= keyboardShift ? keyboardWalkingAccFast : keyboardWalkingAcc
    }
    if (keyboardS) {
      controlState.sagittal -= keyboardShift ? keyboardWalkingAccFast : keyboardWalkingAcc
    }
    if (keyboardD) {
      controlState.frontal += keyboardShift ? keyboardWalkingAccFast : keyboardWalkingAcc
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

  cameraZoomAcc = controlState.zoom;
  cameraZoomVel += cameraZoomAcc;
  cameraZoomVel *= cameraZoomVelDecel;
  cameraZoomVel = THREE.MathUtils.clamp(cameraZoomVel, -cameraZoomVelMax, cameraZoomVelMax)

  cameraYaw += cameraYawVel;
  cameraPitch += cameraPitchVel;
  cameraZoom += cameraZoomVel;
  cameraPitch = THREE.MathUtils.clamp(cameraPitch, -Math.PI/2, Math.PI/2);
  cameraZoom = THREE.MathUtils.clamp(cameraZoom, cameraZoomMin, cameraZoomMax);

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
  camera.setFocalLength(cameraZoom);
  // camera.setFocalLength(Math.sin(new Date().getTime() / (60 / breathingRatePerMin * 1000) * Math.PI) * 0.1 + 0.2)

  const person1Distance = Math.hypot(
    camera.position.x - person1.getPosition().x,
    camera.position.z - person1.getPosition().z,
  );
  const person1Theta = Math.atan2(
      camera.position.x - person1.getPosition().x,
      camera.position.z - person1.getPosition().z,
  );
  person1.setRotation(person1Theta);
  let newOpacity: number;
  if (person1Distance > stageRadius) {
    newOpacity = Math.min(1, person1.getOpacity() + (new Date().getTime() - lastRenderTime.getTime()) / 1000 / 0.3)
  } else {
    newOpacity = Math.max(0, person1.getOpacity() - (new Date().getTime() - lastRenderTime.getTime()) / 1000 / 0.3)
  }
  person1.setOpacity(newOpacity);

  const person2Distance = Math.hypot(
      camera.position.x - person2.getPosition().x,
      camera.position.z - person2.getPosition().z,
  );
  const person2Theta = Math.atan2(
      camera.position.x - person2.getPosition().x,
      camera.position.z - person2.getPosition().z,
  )
  person2.setRotation(person2Theta);
  if (person2Distance > stageRadius) {
    newOpacity = Math.min(1, person2.getOpacity() + (new Date().getTime() - lastRenderTime.getTime()) / 1000 / 0.3)
  } else {
    newOpacity = Math.max(0, person2.getOpacity() - (new Date().getTime() - lastRenderTime.getTime()) / 1000 / 0.3)
  }
  person2.setOpacity(newOpacity);

  renderer.render( scene, camera );
  lastRenderTime = new Date();
}
animate();

const canvas = ref(null as null | HTMLDivElement)

onMounted(() => {
  if (canvas.value === null) {
    return;
  }
  canvas.value.appendChild(renderer.domElement);
})

window.addEventListener('resize', () => {
  // @ts-ignore
  camera.aspect = window.innerWidth / window.innerHeight;
  // @ts-ignore
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});
</script>

<template>
  <div ref="canvas"></div>
</template>

<style scoped>
</style>
