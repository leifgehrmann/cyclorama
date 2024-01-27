<script setup lang="ts">
import Cyclorama from './components/Cyclorama.vue'
import Joystick from './components/Joystick.vue';
import Controls from "./components/Controls.vue";
import {onMounted, ref} from "vue";
import {ControlState} from "./utils/types.ts";

type Position = [number, number];

// Plan
// -    Mouse navigation = click-drag changes angle
// - ✅ Mouse navigation = joystick changes position
// -    Mouse navigation = mouse scroll changes zoom
// -    Touch navigation = touch-drag changes angle
// -    Touch navigation = joystick changes position
// -    Touch navigation = pinch gesture changes zoom
// - ✅ Keyboard navigation = LRUD changes angle
// - ✅ Keyboard navigation = WASD changes position
// - ✅ Keyboard navigation = + / - changes zoom
// -    Keyboard navigation = Q / E changes height
// -    joystick and other controls fades when no touch or mouse-movement on screen
// -    velocity of mouse/touch release results in acceleration

const controlState = ref({
  sagittal: 0,
  frontal: 0,
  yaw: 0,
  pitch: 0,
  zoom: 0,
} as ControlState)

let mouseDown: null | Position = null;
let joystickMax = 0.025;
let joystickMinThreshold = 0.1;
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

function normaliseControlStateFromKeyboardState() {
  // compute direction from keyboard. Keyboard overrides joystick controls.
  if (keyboardW || keyboardA || keyboardS || keyboardD) {
    controlState.value.sagittal = 0;
    controlState.value.frontal = 0;
    if (keyboardW) {
      controlState.value.sagittal += keyboardShift ? keyboardWalkingAccFast : keyboardWalkingAcc
    }
    if (keyboardA) {
      controlState.value.frontal -= keyboardShift ? keyboardWalkingAccFast : keyboardWalkingAcc
    }
    if (keyboardS) {
      controlState.value.sagittal -= keyboardShift ? keyboardWalkingAccFast : keyboardWalkingAcc
    }
    if (keyboardD) {
      controlState.value.frontal += keyboardShift ? keyboardWalkingAccFast : keyboardWalkingAcc
    }
    if (controlState.value.frontal !== 0 && controlState.value.sagittal !== 0 ) {
      controlState.value.sagittal *= 1 / Math.sqrt(2);
      controlState.value.frontal *= 1 / Math.sqrt(2);
    }
  }
}

onMounted(() => {
  window.addEventListener('mousedown', (e) => {
    mouseDown = [e.clientX, e.clientY];
  })

  window.addEventListener('mousemove', (e) => {
    if (mouseDown === null) {
      return
    }
    console.log([e.clientX - mouseDown[0], e.clientY - mouseDown[1]]);
  })

  function clearMouse() {
    mouseDown = null;
  }

  window.addEventListener('mouseleave', clearMouse)
  window.addEventListener('mouseup', clearMouse)
  window.addEventListener('mouseout', clearMouse)

  window.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowLeft') {
      controlState.value.yaw = event.shiftKey ? -keyboardRotationAccFast : -keyboardRotationAcc;
    } else if (event.code === 'ArrowRight') {
      controlState.value.yaw = event.shiftKey ? keyboardRotationAccFast : keyboardRotationAcc;
    } else if (event.code === 'ArrowDown') {
      controlState.value.pitch = event.shiftKey ? keyboardRotationAccFast : keyboardRotationAcc;
    } else if (event.code === 'ArrowUp') {
      controlState.value.pitch = event.shiftKey ? -keyboardRotationAccFast : -keyboardRotationAcc;
    } else if (event.code === 'Minus') {
      controlState.value.zoom = -keyboardFovAccFast;
    } else if (event.code === 'Equal') {
      controlState.value.zoom = keyboardFovAccFast;
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
      controlState.value.yaw = 0;
    } else if (event.code === 'ArrowRight') {
      controlState.value.yaw = 0;
    } else if (event.code === 'ArrowDown') {
      controlState.value.pitch = 0;
    } else if (event.code === 'ArrowUp') {
      controlState.value.pitch = 0;
    } else if (event.code === 'Minus') {
      controlState.value.zoom = 0;
    } else if (event.code === 'Equal') {
      controlState.value.zoom = 0;
    } else if (event.code === 'KeyW') {
      keyboardW = false;
      controlState.value.sagittal = 0;
      controlState.value.frontal = 0;
    } else if (event.code === 'KeyA') {
      keyboardA = false;
      controlState.value.sagittal = 0;
      controlState.value.frontal = 0;
    } else if (event.code === 'KeyS') {
      keyboardS = false;
      controlState.value.sagittal = 0;
      controlState.value.frontal = 0;
    } else if (event.code === 'KeyD') {
      keyboardD = false;
      controlState.value.sagittal = 0;
      controlState.value.frontal = 0;
    } else if (event.code === 'ShiftLeft' || event.code === 'KeyRight') {
      keyboardShift = false;
    }
    normaliseControlStateFromKeyboardState();
  })
})

function joystickUpdate(e: [number, number]) {
  if (Math.abs(e[1]) > joystickMinThreshold) {
    let sign = Math.sign(e[1])
    controlState.value.sagittal = (-(e[1] + sign * joystickMinThreshold)) / (1 + joystickMinThreshold) * joystickMax
  } else {
    controlState.value.sagittal = 0;
  }
  if (Math.abs(e[0]) > joystickMinThreshold) {
    let sign = Math.sign(e[0])
    controlState.value.frontal = (e[0] + sign * joystickMinThreshold) / (1 + joystickMinThreshold) * joystickMax
  } else {
    controlState.value.frontal = 0;
  }
}

</script>

<template>
  <div class="touch-none">
    <Cyclorama :controlState="controlState"/>
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
