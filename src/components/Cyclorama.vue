<script setup lang="ts">
import * as THREE from 'three';
import {ref, onMounted, defineProps} from 'vue'
import Stage from "../sceneObjects/stage.ts";
import Sky from "../sceneObjects/sky.ts";
import Ground from "../sceneObjects/ground.ts";
import Person from "../sceneObjects/person.ts";
import Panorama from "../sceneObjects/panorama.ts";
import {ControlState} from "../utils/types.ts";

const props = defineProps<{
  camera: THREE.PerspectiveCamera,
  controlState: ControlState
}>()

const canvas = ref(null as null | HTMLDivElement)

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000)

const mode = 'edinburgh' as 'london' | 'barker' | 'edinburgh' | 'alps' | 'constantinople';

const ft2m = (feet: number): number => {
  return 0.3048 * feet;
}

let panoramaUrls: string[];
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
    panoramaUrls = ['Constantinople.jpg'];
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
    panoramaUrls = ['alps.jpg'];
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
    panoramaUrls = ['lanorama.jpg'];
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
    panoramaUrls = [
        'london-00.jpg',
        'london-01.jpg',
        'london-02.jpg',
        'london-03.jpg',
        'london-04.jpg',
    ];
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
    panoramaUrls = [
        'barker-00.jpg',
        'barker-01.jpg',
        'barker-02.jpg',
        'barker-03.jpg',
        'barker-04.jpg',
    ];
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

props.camera.aspect = window.innerWidth / window.innerHeight;
props.camera.updateProjectionMatrix();

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.visualViewport.width, window.innerHeight );

let cameraPosX = props.camera.position.x;
let cameraPosZ = props.camera.position.z;
let cameraSagittalVel = 0;
let cameraSagittalVelDecel = 0.7;
let cameraSagittalAcc = 0;
let cameraFrontalVel = 0;
let cameraFrontalVelDecel = 0.7;
let cameraFrontalAcc = 0;
let cameraYaw = initialCameraYaw;
let cameraYawVel = 0;
let cameraYawVelDecel = 0.8;
let cameraYawAcc = 0;
let cameraPitch = 0;
let cameraPitchVel = 0;
let cameraPitchVelDecel = 0.8;
let cameraPitchAcc = 0;
let cameraRoll = 0;
let cameraRollVel = 0;
let cameraRollVelDecel = 0.8;
let cameraRollAcc = 0;
let cameraZoom = props.camera.getFocalLength();
let cameraZoomMin = cameraZoom - 10;
let cameraZoomMax = cameraZoom + 30;
let cameraZoomVel = 0;
let cameraZoomVelDecel = 0.8;
let cameraZoomAcc = 0;
let cameraHeight = 0;
let cameraHeightAcc = 0;
let cameraHeightVel = 0;
let cameraHeightVelDecel = 0.8;
let cameraHeightMin = cameraHeight - 1.0;
let cameraHeightMax = cameraHeight + 1.0;

new Panorama(
    scene,
    panoramaUrls,
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

props.camera.position.y = stageHeight + 1;

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

let lastRenderTime = new Date();

function animate() {
  requestAnimationFrame( animate );

  // Update View
  cameraYawAcc = props.controlState.yawAcc;
  cameraYawVel *= cameraYawVelDecel;
  cameraYawVel += cameraYawAcc;

  cameraPitchAcc = props.controlState.pitchAcc;
  cameraPitchVel *= cameraPitchVelDecel;
  cameraPitchVel += cameraPitchAcc;

  cameraRollAcc = props.controlState.rollAcc;
  cameraRollVel *= cameraRollVelDecel;
  cameraRollVel += cameraRollAcc;

  cameraZoomAcc = props.controlState.zoomAcc;
  cameraZoomVel *= cameraZoomVelDecel;
  cameraZoomVel += cameraZoomAcc;

  cameraHeightAcc = props.controlState.heightAcc;
  cameraHeightVel *= cameraHeightVelDecel;
  cameraHeightVel += cameraHeightAcc;

  cameraYaw += cameraYawVel;
  cameraPitch += cameraPitchVel;
  cameraRoll += cameraRollVel;
  cameraZoom += cameraZoomVel;
  cameraHeight += cameraHeightVel;

  if (props.controlState.yawVel !== null) {
    cameraYaw += props.controlState.yawVel
  }

  if (props.controlState.pitchVel !== null) {
    cameraPitch += props.controlState.pitchVel
  }

  if (!props.controlState.boundaryBreak) {
    cameraPitch = THREE.MathUtils.clamp(cameraPitch, -Math.PI / 2, Math.PI / 2);
    cameraRoll = THREE.MathUtils.clamp(cameraRoll, -Math.PI / 2, Math.PI / 2);
    cameraZoom = THREE.MathUtils.clamp(cameraZoom, cameraZoomMin, cameraZoomMax);
    cameraHeight = THREE.MathUtils.clamp(cameraHeight, cameraHeightMin, cameraHeightMax);
  }

  // Update movement
  cameraSagittalAcc = props.controlState.sagittalAcc;
  cameraSagittalVel *= cameraSagittalVelDecel;
  cameraSagittalVel += cameraSagittalAcc;

  cameraFrontalAcc = props.controlState.frontalAcc;
  cameraFrontalVel *= cameraFrontalVelDecel;
  cameraFrontalVel += cameraFrontalAcc;

  cameraPosX -= Math.sin(-cameraYaw) * cameraSagittalVel + Math.sin(-cameraYaw - Math.PI / 2) * cameraFrontalVel;
  cameraPosZ -= Math.cos(-cameraYaw) * cameraSagittalVel + Math.cos(-cameraYaw - Math.PI / 2) * cameraFrontalVel;

  // Prevent out of bounds by resetting position to railing radius
  if (!props.controlState.boundaryBreak) {
    const angleFromCenter = Math.atan2(cameraPosX, cameraPosZ)
    const maxDistAtRailingX = Math.abs(Math.sin(angleFromCenter) * railingOnStageRadius);
    const maxDistAtRailingZ = Math.abs(Math.cos(angleFromCenter) * railingOnStageRadius);
    cameraPosX = THREE.MathUtils.clamp(cameraPosX, -maxDistAtRailingX, maxDistAtRailingX)
    cameraPosZ = THREE.MathUtils.clamp(cameraPosZ, -maxDistAtRailingZ, maxDistAtRailingZ)
  }

  resizeRendererToDisplaySize(renderer);
  props.camera.setRotationFromEuler(new THREE.Euler(
      -cameraPitch,
      -cameraYaw,
      -cameraRoll,
      'YZX'
  ))
  props.camera.position.x = cameraPosX;
  props.camera.position.z = cameraPosZ;
  props.camera.position.y = stageHeight + averageHeight + cameraHeight + Math.sin(new Date().getTime() / (60 / breathingRatePerMin * 1000) * Math.PI) * breathingBobHeight / 2;
  props.camera.setFocalLength(cameraZoom);

  const person1Distance = Math.hypot(
    props.camera.position.x - person1.getPosition().x,
    props.camera.position.z - person1.getPosition().z,
  );
  const person1Theta = Math.atan2(
      props.camera.position.x - person1.getPosition().x,
      props.camera.position.z - person1.getPosition().z,
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
      props.camera.position.x - person2.getPosition().x,
      props.camera.position.z - person2.getPosition().z,
  );
  const person2Theta = Math.atan2(
      props.camera.position.x - person2.getPosition().x,
      props.camera.position.z - person2.getPosition().z,
  )
  person2.setRotation(person2Theta);
  if (person2Distance > stageRadius) {
    newOpacity = Math.min(1, person2.getOpacity() + (new Date().getTime() - lastRenderTime.getTime()) / 1000 / 0.3)
  } else {
    newOpacity = Math.max(0, person2.getOpacity() - (new Date().getTime() - lastRenderTime.getTime()) / 1000 / 0.3)
  }
  person2.setOpacity(newOpacity);

  renderer.render( scene, props.camera );
  lastRenderTime = new Date();
}
animate();

onMounted(() => {
  if (canvas.value === null) {
    return;
  }
  canvas.value.appendChild(renderer.domElement);
})

window.addEventListener('resize', () => {
  const width = window.innerWidth
  const height = window.innerHeight
  // @ts-ignore
  props.camera.aspect = width / height;
  // @ts-ignore
  props.camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.render(scene, props.camera);
});
</script>

<template>
  <div ref="canvas"></div>
</template>

<style scoped>
</style>
