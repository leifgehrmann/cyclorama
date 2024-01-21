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
scene.background = new THREE.Color(0x000000)

const mode = 'barker' as 'london' | 'barker' | 'edinburgh' | 'alps';

const ft2m = (feet: number): number => {
  return 0.3048 * feet;
}

let texture1: THREE.Texture;
let panoramaRadius: number;
let panoramaHeight: number;
let panoramaCeilingY: number = 100;
let groundColor: THREE.Color = new THREE.Color(0x000000);
let groundYStart: number = 100;
let groundYEnd: number = 100;
let skyColor: THREE.Color = new THREE.Color(0x000000);
let skyYStart: number = 100;
let skyYEnd: number = 100;
let panoramaY: number;
let stageRadius = ft2m(30/2);
//let stageHeight = ft2m(1);
let stageHeight = 0;
let umbrellaRadius = ft2m(50/2);
let ceilingHeight = 4;
let initialCameraYaw = 0;
// noinspection JSUnreachableSwitchBranches
switch (mode) {
  case 'alps': {
    texture1 = new THREE.TextureLoader().load('public/alps.jpg');
    skyColor = new THREE.Color(0xD8CFC8);
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
    texture1 = new THREE.TextureLoader().load('public/lanorama.jpg');
    skyColor = new THREE.Color(0xD8CFC8);
    const imageWidth = 4000;
    const imageHeight = 544;
    panoramaRadius = ft2m(84 / 2);
    panoramaHeight = panoramaRadius * 2 * Math.PI / imageWidth * imageHeight;
    panoramaY = -panoramaHeight * 0.45;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY - 0.5;
    groundYEnd = panoramaY + 2;
    break;
  }
  case 'london': {
    texture1 = new THREE.TextureLoader().load('public/London_360_from_St_Paul\'s_Cathedral_-_Sept_2007.jpg');
    texture1.colorSpace = 'srgb'
    skyColor = new THREE.Color(0xAACCED);
    groundColor = new THREE.Color(0x111121);
    panoramaRadius = ft2m(130 / 2);
    panoramaHeight = ft2m(130 / 2);
    panoramaY = -panoramaHeight * 0.7;
    skyYStart = 4
    skyYEnd = panoramaY + panoramaHeight
    panoramaCeilingY = skyYEnd;
    groundYStart = panoramaY - 0.5;
    groundYEnd = panoramaY + 2;
    break;
  }
  default: {
    texture1 = new THREE.TextureLoader().load('public/Barker_Panorama.jpg');
    texture1.colorSpace = 'srgb'
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
    groundYStart = panoramaY - 0.5;
    groundYEnd = panoramaY + 1;
    initialCameraYaw = Math.PI * 0.8;
    break;
  }
}

const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({antialias: true});
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
panorama.geometry.translate(0, panoramaHeight / 2 + panoramaY, 0);
scene.add( panorama );

const stageGeom = new THREE.CylinderGeometry( stageRadius, stageRadius, stageHeight, 60, 1, false);
const stageMat = new THREE.MeshBasicMaterial( { color: 0x333343 } );
const stage = new THREE.Mesh( stageGeom, stageMat );
stage.translateY(stageHeight/2);
scene.add( stage );

const umbrellaGeom = new THREE.CylinderGeometry( umbrellaRadius, umbrellaRadius, 0.1, 60, 1, false);
const umbrellaMat = new THREE.MeshBasicMaterial( { color: 0x333343 } );
const umbrella = new THREE.Mesh( umbrellaGeom, umbrellaMat );
umbrella.translateY(stageHeight + ceilingHeight)
scene.add( umbrella );

const railingGeom = new THREE.TorusGeometry( railingOnStageRadius, railingRadius, 16, 100 );
const railingMat = new THREE.MeshBasicMaterial( { color: 0x222232 } );
const railing = new THREE.Mesh( railingGeom, railingMat );
railing.translateY(stageHeight + railingHeight)
railing.rotateX(Math.PI/2);
scene.add(railing);

for (let i = 0; i < railingCount; i++) {
  const theta = i / railingCount * Math.PI * 2;
  const railingPostX = Math.sin(theta) * (railingOnStageRadius);
  const railingPostZ = Math.cos(theta) * (railingOnStageRadius);
  const railingPostGeom = new THREE.CylinderGeometry( railingRadius, railingRadius, railingHeight, 16, 1, false);
  const railingPostMat = new THREE.MeshBasicMaterial( { color: 0x222232 } );
  const railingPost = new THREE.Mesh( railingPostGeom, railingPostMat );
  railingPost.translateX(railingPostX)
  railingPost.translateZ(railingPostZ)
  railingPost.translateY(stageHeight + railingHeight/2)
  scene.add(railingPost);
}

const skyGeom = new THREE.CylinderGeometry(panoramaRadius - 0.01, panoramaRadius - 0.01, skyYEnd - skyYStart, 60, 1, true);
const skyMat = new THREE.ShaderMaterial({
  uniforms: {
    color1: {
      value: skyColor.clone().convertLinearToSRGB()
    },
    color2: {
      value: skyColor.clone().convertLinearToSRGB()
    }
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;

    varying vec2 vUv;

    void main() {

      gl_FragColor = vec4(mix(color1, color2, vUv.y), vUv.y);
    }
  `
});
skyMat.transparent = true;
const sky = new THREE.Mesh(skyGeom, skyMat);
sky.geometry.scale(-1, -1, -1)
sky.geometry.rotateZ(Math.PI)
sky.geometry.translate(0, (skyYEnd - skyYStart) / 2 + skyYStart, 0);
scene.add(sky);

const panoramaCeilingGeom = new THREE.PlaneGeometry(
    panoramaRadius * 2.2,
    panoramaRadius * 2.2
);
const panoramaCeilingMat = new THREE.MeshBasicMaterial( { color: skyColor, side: THREE.DoubleSide } );
const panoramaCeiling = new THREE.Mesh(panoramaCeilingGeom, panoramaCeilingMat);
panoramaCeiling.geometry.rotateX(Math.PI/2);
panoramaCeiling.geometry.translate(0, panoramaCeilingY, 0);
scene.add(panoramaCeiling);

const groundGeom = new THREE.CylinderGeometry(panoramaRadius - 0.01, panoramaRadius - 0.01, skyYEnd - skyYStart, 60, 1, true);
const groundMat = new THREE.ShaderMaterial({
  uniforms: {
    color1: {
      value: groundColor.clone().convertLinearToSRGB()
    },
    color2: {
      value: groundColor.clone().convertLinearToSRGB()
    }
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;

    varying vec2 vUv;

    void main() {

      gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0 - vUv.y);
    }
  `
});
groundMat.transparent = true;
const ground = new THREE.Mesh(groundGeom, groundMat);
ground.geometry.scale(-1, -1, -1)
ground.geometry.rotateZ(Math.PI)
ground.geometry.translate(0, (groundYEnd - groundYStart) / 2 + groundYStart, 0);
scene.add(ground);

const panoramaGroundGeom = new THREE.PlaneGeometry(
    panoramaRadius * 2.2,
    panoramaRadius * 2.2
);
const panoramaGroundMat = new THREE.MeshBasicMaterial( { color: groundColor, side: THREE.DoubleSide } );
const panoramaGround = new THREE.Mesh(panoramaGroundGeom, panoramaGroundMat);
panoramaGround.geometry.rotateX(Math.PI/2);
panoramaGround.geometry.translate(0, groundYStart, 0);
scene.add(panoramaGround);

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
