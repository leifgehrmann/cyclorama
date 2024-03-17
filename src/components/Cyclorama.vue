<script setup lang="ts">
import * as THREE from 'three';
import {ref, onMounted, defineProps, defineEmits} from 'vue'
import Stage from "../sceneObjects/stage.ts";
import Sky from "../sceneObjects/sky.ts";
import Ground from "../sceneObjects/ground.ts";
import Person from "../sceneObjects/person.ts";
import Panorama from "../sceneObjects/panorama.ts";
import {ControlState} from "../utils/types.ts";
import {Scene} from "../scenes.ts";

const props = defineProps<{
  scene: Scene,
  camera: THREE.PerspectiveCamera,
  controlState: ControlState
}>()

const emit = defineEmits(['progressUpdate'])

const canvas = ref(null as null | HTMLDivElement)

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000)

const panoramaUrls = props.scene.panoramaUrls;
const panoramaUrlHeights = props.scene.panoramaUrlHeights;
const panoramaHeight = props.scene.panoramaHeight;
const panoramaRadius = props.scene.panoramaRadius;
const panoramaY = props.scene.panoramaY;
const stageRadius = props.scene.stageRadius;
const stageHeight = props.scene.stageHeight;
const umbrellaRadius = props.scene.umbrellaRadius;
const ceilingHeight = props.scene.ceilingHeight;
const groundColor = new THREE.Color(props.scene.groundColor);
const groundYStart = props.scene.groundYStart;
const groundYEnd = props.scene.groundYEnd;
const skyColor = new THREE.Color(props.scene.skyColor);
const skyYStart = props.scene.skyYStart;
const skyYEnd = props.scene.skyYEnd;
const initialCameraYaw = props.scene.initialCameraYaw;

const railingHeight = 0.9;
const railingCount = Math.round(stageRadius * Math.PI * 8);
const railingRadius = 0.02;
const railingPostOffset = 0.1;
const railingOnStageRadius = stageRadius - railingPostOffset - railingRadius;

const averageHeight = 1.70; // Average height for UK in the 1800s.
const breathingRatePerMin = 15; // Usually between 12-18 breaths per minute.
const breathingBobHeight = 0.02;

const renderer = new THREE.WebGLRenderer({antialias: true});

let cameraFov = 50;
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
let cameraYawAcc = 0;
let cameraPitch = 0;
let cameraPitchVel = 0;
let cameraPitchAcc = 0;
let cameraRoll = 0;
let cameraRollVel = 0;
let cameraRollVelDecel = 0.8;
let cameraRollAcc = 0;
let cameraZoom = 1;
let cameraZoomMin = cameraZoom - 0.25;
let cameraZoomMax = cameraZoom + 1.75;
let cameraZoomVel = 0;
let cameraZoomVelDecel = 0.8;
let cameraZoomAcc = 0;
let cameraHeight = 0;
let cameraHeightAcc = 0;
let cameraHeightVel = 0;
let cameraHeightVelDecel = 0.8;
let cameraHeightMin = cameraHeight - 1.0;
let cameraHeightMax = cameraHeight + 1.0;

let totalItemsToLoad = panoramaUrls.length + 4;
let itemsLoaded = 0;
const loadedTextureCallback = () => {
  itemsLoaded += 1;
  emit('progressUpdate', [itemsLoaded/totalItemsToLoad])
}

new Panorama(
    scene,
    panoramaUrls,
    panoramaUrlHeights,
    panoramaRadius,
    panoramaHeight,
    panoramaY,
    loadedTextureCallback
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
    Math.max(stageHeight + ceilingHeight + 0.01, skyYEnd),
    skyYStart,
    skyYEnd,
    skyColor,
);
sky.addToScene(scene)

const ground = new Ground(
    panoramaRadius,
    Math.min(0, groundYStart),
    groundYStart,
    groundYEnd,
    groundColor
);
ground.addToScene(scene)

const person1 = new Person(
    'person-1.png',
    425,
    880,
    0.01 / 5
)
person1.setOpacity(0);
person1.setPosition(stageRadius - 0.7, stageHeight, 0)
person1.addToScene(scene, loadedTextureCallback);

const person2 = new Person(
    'person-2.png',
    500,
    925,
    0.01 / 5
)
person2.setOpacity(0);
person2.setPosition(0, stageHeight, stageRadius - 1)
person2.addToScene(scene, loadedTextureCallback);

const person3 = new Person(
    'person-3.png',
    855,
    950,
    0.01 / 5
)
person3.setOpacity(0);
person3.setPosition(0, stageHeight, (stageRadius - 0.7) * -1)
person3.addToScene(scene, loadedTextureCallback);

const person4 = new Person(
    'person-4.png',
    350,
    865,
    0.01 / 5
)
person4.setOpacity(0);
person4.setPosition((stageRadius - 0.7) * -1, stageHeight, 0)
person4.addToScene(scene, loadedTextureCallback);
let people = [person1, person2, person3, person4];

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
  cameraYawVel *= props.controlState.yawVelDeceleration;
  cameraYawVel += cameraYawAcc;

  cameraPitchAcc = props.controlState.pitchAcc;
  cameraPitchVel *= props.controlState.pitchVelDeceleration;
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

  cameraRoll += cameraRollVel;
  cameraZoom += cameraZoomVel;
  cameraHeight += cameraHeightVel;

  if (props.controlState.yawVel !== null) {
    cameraYawVel = 0;
    cameraYaw += props.controlState.yawVel
  } else {
    cameraYaw += cameraYawVel;
  }

  if (props.controlState.pitchVel !== null) {
    cameraPitchVel = 0;
    cameraPitch += props.controlState.pitchVel
  } else {
    cameraPitch += cameraPitchVel;
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
  props.camera.fov = cameraFov * (1 / cameraZoom);
  props.camera.updateProjectionMatrix();

  people.forEach((person) => {
    const personDistance = Math.hypot(
        props.camera.position.x - person.getPosition().x,
        props.camera.position.z - person.getPosition().z,
    );
    const personTheta = Math.atan2(
        props.camera.position.x - person.getPosition().x,
        props.camera.position.z - person.getPosition().z,
    );
    person.setRotation(personTheta);
    let newOpacity: number;
    if (personDistance > stageRadius) {
      newOpacity = Math.min(1, person.getOpacity() + (new Date().getTime() - lastRenderTime.getTime()) / 1000 / 0.3)
    } else {
      newOpacity = Math.max(0, person.getOpacity() - (new Date().getTime() - lastRenderTime.getTime()) / 1000 / 0.3)
    }
    person.setOpacity(newOpacity);
  });
  renderer.render( scene, props.camera );
  lastRenderTime = new Date();
}
animate();

function updateSize() {
  if (canvas.value === null) {
    return;
  }
  const rect = canvas.value.parentElement?.getBoundingClientRect();
  const width = rect?.width ?? 1;
  const height = rect?.height ?? 1;
  // @ts-ignore
  props.camera.aspect = width / height;
  // @ts-ignore
  props.camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.render(scene, props.camera);
}

onMounted(() => {
  if (canvas.value === null) {
    return;
  }
  canvas.value.appendChild(renderer.domElement);
  updateSize();

  window.addEventListener('resize', () => {
    updateSize();
  });
  // When the element is hidden and displayed, we need to
  // make sure the canvas is correctly sized.
  const resizeObserver = new ResizeObserver(() => {
    requestAnimationFrame(updateSize);
  });
  if (canvas.value.parentElement !== null) {
    resizeObserver.observe(canvas.value.parentElement);
  }
})
</script>

<template>
  <div id="canvas" ref="canvas" class="absolute"></div>
</template>

<style scoped>
</style>
