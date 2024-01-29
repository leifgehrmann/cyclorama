<script setup lang="ts">
import Cyclorama from './components/Cyclorama.vue'
import Joystick from './components/Joystick.vue';
import Controls from "./components/Controls.vue";
import {onMounted, ref} from "vue";
import {ControlState} from "./utils/types.ts";
import getTouchById, {getAngularDifferenceFromPointers} from "./utils/pointerUtils.ts";
import * as THREE from 'three';

// Plan
// - ✅ Mouse navigation = click-drag changes angle
// - ✅ Mouse navigation = joystick changes position
// - ✅ Touch navigation = touch-drag changes angle
// - ✅ Touch navigation = joystick changes position
// -    Touch navigation = pinch gesture changes zoom
// - ✅ Keyboard navigation = LRUD changes angle
// - ✅ Keyboard navigation = WASD changes position
// - ✅ Keyboard navigation = + / - changes zoom
// - ✅ Keyboard navigation = I / K changes height
// - ✅ Keyboard navigation = J / L changes roll
// -    joystick and other controls fades when no touch or mouse-movement on screen
// - ✅ velocity of mouse/touch release results in acceleration

const controlState = ref({
  sagittalAcc: 0,
  frontalAcc: 0,
  yawAcc: 0,
  pitchAcc: 0,
  yawVel: null,
  pitchVel: null,
  zoomAcc: 0,
  heightAcc: 0,
  rollAcc: 0,
  boundaryBreak: false,
} as ControlState)
const camera = ref(new THREE.PerspectiveCamera());

camera.value.aspect = window.innerWidth / window.innerHeight;
camera.value.updateProjectionMatrix()

let pointer2ndPrev: null | Touch | MouseEvent = null;
let pointerPrev: null | Touch | MouseEvent = null;
let touchId: number | null = null;
let joystickMax = 0.015;
let joystickMinThreshold = 0.1;
let keyboardRotationAcc = 0.002;
let keyboardRotationAccFast = 0.020;
let keyboardFovAccFast = 0.2;
let keyboardHeightAcc = 0.01;
let keyboardWalkingAcc = 0.02;
let keyboardWalkingAccFast = 0.04;
let keyboardShift = false;
let keyboardW = false;
let keyboardA = false;
let keyboardS = false;
let keyboardD = false;

function normaliseControlStateFromKeyboardState() {
  // compute direction from keyboard. Keyboard overrides joystick controls.
  if (keyboardW || keyboardA || keyboardS || keyboardD) {
    controlState.value.sagittalAcc = 0;
    controlState.value.frontalAcc = 0;
    if (keyboardW) {
      controlState.value.sagittalAcc += keyboardShift ? keyboardWalkingAccFast : keyboardWalkingAcc
    }
    if (keyboardA) {
      controlState.value.frontalAcc -= keyboardShift ? keyboardWalkingAccFast : keyboardWalkingAcc
    }
    if (keyboardS) {
      controlState.value.sagittalAcc -= keyboardShift ? keyboardWalkingAccFast : keyboardWalkingAcc
    }
    if (keyboardD) {
      controlState.value.frontalAcc += keyboardShift ? keyboardWalkingAccFast : keyboardWalkingAcc
    }
    if (controlState.value.frontalAcc !== 0 && controlState.value.sagittalAcc !== 0 ) {
      controlState.value.sagittalAcc *= 1 / Math.sqrt(2);
      controlState.value.frontalAcc *= 1 / Math.sqrt(2);
    }
  }
}

onMounted(() => {
  window.addEventListener('mousedown', (e) => {
    pointerPrev = e;
  })

  window.addEventListener('touchstart', (e) => {
    if (touchId !== null) {
      return;
    }
    e.preventDefault();
    let touch = e.changedTouches[0];
    touchId = touch.identifier;
    pointer2ndPrev = null;
    pointerPrev = touch;
  })

  window.addEventListener('mousemove', (e) => {
    if (pointerPrev === null) {
      return
    }
    const {yaw, pitch} = getAngularDifferenceFromPointers(
        camera.value,
        e,
        pointerPrev
    )
    controlState.value.yawVel = (controlState.value.yawVel ?? 0) + yaw;
    controlState.value.pitchVel = (controlState.value.pitchVel ?? 0) + pitch;
    pointer2ndPrev = pointerPrev;
    pointerPrev = e;
    requestAnimationFrame(() => {
      controlState.value.yawVel = null;
      controlState.value.pitchVel = null;
    })
  })

  window.addEventListener('touchmove', (e) => {
    if (touchId === null || pointerPrev === null) {
      return;
    }
    const touch = getTouchById(e.changedTouches, touchId)
    if (touch === null) {
      return;
    }
    const {yaw, pitch} = getAngularDifferenceFromPointers(
        camera.value,
        touch,
        pointerPrev
    )
    controlState.value.yawVel = (controlState.value.yawVel ?? 0) + yaw;
    controlState.value.pitchVel = (controlState.value.pitchVel ?? 0) + pitch;
    pointer2ndPrev = pointerPrev;
    pointerPrev = touch;
    requestAnimationFrame(() => {
      controlState.value.yawVel = null;
      controlState.value.pitchVel = null;
    })
  })

  function clearMouse(e: MouseEvent) {
    if (pointer2ndPrev === null) {
      pointerPrev = null;
      return;
    }
    const {yaw, pitch} = getAngularDifferenceFromPointers(
        camera.value,
        e,
        pointer2ndPrev
    )
    controlState.value.yawVel = null
    controlState.value.pitchVel = null
    controlState.value.yawAcc = yaw;
    controlState.value.pitchAcc = pitch;
    pointer2ndPrev = null;
    pointerPrev = null;
    requestAnimationFrame(() => {
      controlState.value.yawAcc = 0;
      controlState.value.pitchAcc = 0;
    })
  }

  function clearTouch(e: TouchEvent) {
    if (touchId === null) {
      return;
    }
    const touch = getTouchById(e.changedTouches, touchId)
    if (touch === null) {
      // This means the touchend has not yet fired for the touch that is
      // actively controlling the view.
      return;
    }
    if (pointer2ndPrev === null) {
      pointerPrev = null;
      touchId = null;
      return
    }
    const {yaw, pitch} = getAngularDifferenceFromPointers(
        camera.value,
        touch,
        pointer2ndPrev
    )
    controlState.value.yawVel = null
    controlState.value.pitchVel = null
    controlState.value.yawAcc = yaw;
    controlState.value.pitchAcc = pitch;
    pointer2ndPrev = null;
    pointerPrev = null;
    touchId = null;
    requestAnimationFrame(() => {
      controlState.value.yawAcc = 0;
      controlState.value.pitchAcc = 0;
    })
  }

  window.addEventListener('mouseleave', clearMouse)
  window.addEventListener('mouseup', clearMouse)
  window.addEventListener('mouseout', clearMouse)
  window.addEventListener('touchend', clearTouch)
  window.addEventListener('touchcancel', clearTouch)

  window.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowLeft') {
      event.preventDefault();
      controlState.value.yawAcc = event.shiftKey ? -keyboardRotationAccFast : -keyboardRotationAcc;
    } else if (event.code === 'ArrowRight') {
      event.preventDefault();
      controlState.value.yawAcc = event.shiftKey ? keyboardRotationAccFast : keyboardRotationAcc;
    } else if (event.code === 'ArrowDown') {
      event.preventDefault();
      controlState.value.pitchAcc = event.shiftKey ? keyboardRotationAccFast : keyboardRotationAcc;
    } else if (event.code === 'ArrowUp') {
      event.preventDefault();
      controlState.value.pitchAcc = event.shiftKey ? -keyboardRotationAccFast : -keyboardRotationAcc;
    } else if (event.code === 'Minus') {
      controlState.value.zoomAcc = -keyboardFovAccFast;
    } else if (event.code === 'Equal') {
      controlState.value.zoomAcc = keyboardFovAccFast;
    } else if (event.code === 'KeyI') {
      controlState.value.heightAcc = keyboardHeightAcc;
    } else if (event.code === 'KeyK') {
      controlState.value.heightAcc = -keyboardHeightAcc;
    } else if (event.code === 'KeyJ') {
      controlState.value.rollAcc = -keyboardRotationAcc;
    } else if (event.code === 'KeyL') {
      controlState.value.rollAcc = keyboardRotationAcc;
    } else if (event.code === 'KeyB') {
      controlState.value.boundaryBreak = !controlState.value.boundaryBreak;
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
    normaliseControlStateFromKeyboardState();
  })

  window.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowLeft') {
      controlState.value.yawAcc = 0;
    } else if (event.code === 'ArrowRight') {
      controlState.value.yawAcc = 0;
    } else if (event.code === 'ArrowDown') {
      controlState.value.pitchAcc = 0;
    } else if (event.code === 'ArrowUp') {
      controlState.value.pitchAcc = 0;
    } else if (event.code === 'Minus') {
      controlState.value.zoomAcc = 0;
    } else if (event.code === 'Equal') {
      controlState.value.zoomAcc = 0;
    } else if (event.code === 'KeyI') {
      controlState.value.heightAcc = 0;
    } else if (event.code === 'KeyK') {
      controlState.value.heightAcc = 0;
    } else if (event.code === 'KeyJ') {
      controlState.value.rollAcc = 0;
    } else if (event.code === 'KeyL') {
      controlState.value.rollAcc = 0;
    } else if (event.code === 'KeyW') {
      keyboardW = false;
      controlState.value.sagittalAcc = 0;
      controlState.value.frontalAcc = 0;
    } else if (event.code === 'KeyA') {
      keyboardA = false;
      controlState.value.sagittalAcc = 0;
      controlState.value.frontalAcc = 0;
    } else if (event.code === 'KeyS') {
      keyboardS = false;
      controlState.value.sagittalAcc = 0;
      controlState.value.frontalAcc = 0;
    } else if (event.code === 'KeyD') {
      keyboardD = false;
      controlState.value.sagittalAcc = 0;
      controlState.value.frontalAcc = 0;
    } else if (event.code === 'ShiftLeft' || event.code === 'KeyRight') {
      keyboardShift = false;
    }
    normaliseControlStateFromKeyboardState();
  })
})

function joystickUpdate(e: [number, number]) {
  if (Math.abs(e[1]) > joystickMinThreshold) {
    let sign = Math.sign(e[1])
    controlState.value.sagittalAcc = (-(e[1] + sign * joystickMinThreshold)) / (1 + joystickMinThreshold) * joystickMax
  } else {
    controlState.value.sagittalAcc = 0;
  }
  if (Math.abs(e[0]) > joystickMinThreshold) {
    let sign = Math.sign(e[0])
    controlState.value.frontalAcc = (e[0] + sign * joystickMinThreshold) / (1 + joystickMinThreshold) * joystickMax
  } else {
    controlState.value.frontalAcc = 0;
  }
}

</script>

<template>
  <div class="touch-none">
    <Cyclorama :camera="camera" :controlState="controlState"/>
    <Joystick @controlUpdate="joystickUpdate"/>
    <div
        class="absolute top-0 right-0"
    >
      <div class="p-4">
        <Controls
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
