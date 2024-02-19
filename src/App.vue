<script setup lang="ts">
import Cyclorama from './components/Cyclorama.vue'
import Joystick from './components/Joystick.vue';
import Controls from "./components/Controls.vue";
import {onMounted, ref} from "vue";
import {ControlState} from "./utils/types.ts";
import getTouchById, {getAngularDifferenceFromPointers, getDistanceBetweenPointers} from "./utils/pointerUtils.ts";
import * as THREE from 'three';
import Info from "./components/Info.vue";
import Loading from "./components/Loading.vue";

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
  yawVelDeceleration: 0.8,
  pitchVelDeceleration: 0.8,
  zoomAcc: 0,
  heightAcc: 0,
  rollAcc: 0,
  boundaryBreak: false,
} as ControlState)
const camera = ref(new THREE.PerspectiveCamera());
const interactive = ref(null as null | HTMLDivElement)
const showInfo = ref(false)
const progress = ref(0)

camera.value.aspect = window.innerWidth / window.innerHeight;
camera.value.updateProjectionMatrix()

let pointer2ndPrev: null | Touch | MouseEvent = null;
let pointerPrev: null | Touch | MouseEvent = null;
let touchId: number | null = null;
let joystickMax = 0.015;
let joystickMinThreshold = 0.1;
let controlZoomMax = 0.005;
let keyboardRotationAcc = 0.0015;
let keyboardRotationAccSlow = 0.0001;
let keyboardRotationAccFast = 0.020;
let keyboardFovAcc = 0.01;
let keyboardHeightAcc = 0.01;
let keyboardWalkingAcc = 0.01;
let keyboardWalkingAccFast = 0.02;
let keyboardWalkingAccSlow = 0.001;
let keyboardShift = false;
let keyboardAlt = false;
let keyboardW = false;
let keyboardA = false;
let keyboardS = false;
let keyboardD = false;
let keyboardUp = false;
let keyboardDown = false;
let keyboardLeft = false;
let keyboardRight = false;
let keyboardPlus = false;
let keyboardMinus = false;
let keyboardI = false;
let keyboardK = false;
let keyboardJ = false;
let keyboardL = false;
let keyboardRotationDeceleration = 0.8;
let pointerRotationDeceleration = 0.95;

function selectNormSlowFast(
    fastSelected: boolean,
    slowSelected: boolean,
    normSpeed: number,
    slowSpeed: number,
    fastSpeed: number,
) {
  if (fastSelected && !slowSelected) {
    return fastSpeed;
  } else if (slowSelected && !fastSelected) {
    return slowSpeed;
  } else {
    return normSpeed;
  }
}

function normaliseControlStateFromKeyboardState() {
  // compute direction from keyboard. Keyboard overrides joystick controls.
  if (keyboardW || keyboardA || keyboardS || keyboardD) {
    controlState.value.sagittalAcc = 0;
    controlState.value.frontalAcc = 0;
    if (keyboardW) {
      controlState.value.sagittalAcc += selectNormSlowFast(
          keyboardShift,
          keyboardAlt,
          keyboardWalkingAcc,
          keyboardWalkingAccSlow,
          keyboardWalkingAccFast
      );
    }
    if (keyboardA) {
      controlState.value.frontalAcc -= selectNormSlowFast(
          keyboardShift,
          keyboardAlt,
          keyboardWalkingAcc,
          keyboardWalkingAccSlow,
          keyboardWalkingAccFast
      );
    }
    if (keyboardS) {
      controlState.value.sagittalAcc -= selectNormSlowFast(
          keyboardShift,
          keyboardAlt,
          keyboardWalkingAcc,
          keyboardWalkingAccSlow,
          keyboardWalkingAccFast
      );
    }
    if (keyboardD) {
      controlState.value.frontalAcc += selectNormSlowFast(
          keyboardShift,
          keyboardAlt,
          keyboardWalkingAcc,
          keyboardWalkingAccSlow,
          keyboardWalkingAccFast
      );
    }
    if (controlState.value.frontalAcc !== 0 && controlState.value.sagittalAcc !== 0 ) {
      controlState.value.sagittalAcc *= 1 / Math.sqrt(2);
      controlState.value.frontalAcc *= 1 / Math.sqrt(2);
    }
  }
  if (keyboardLeft || keyboardRight) {
    controlState.value.yawAcc = 0
    if (keyboardLeft) {
      controlState.value.yawAcc -= selectNormSlowFast(
        keyboardShift,
        keyboardAlt,
        keyboardRotationAcc,
        keyboardRotationAccSlow,
        keyboardRotationAccFast
      );
    }
    if (keyboardRight) {
      controlState.value.yawAcc += selectNormSlowFast(
        keyboardShift,
        keyboardAlt,
        keyboardRotationAcc,
        keyboardRotationAccSlow,
        keyboardRotationAccFast
      );
    }
  }
  if (keyboardUp || keyboardDown) {
    controlState.value.pitchAcc = 0
    if (keyboardUp) {
      controlState.value.pitchAcc -= selectNormSlowFast(
          keyboardShift,
          keyboardAlt,
          keyboardRotationAcc,
          keyboardRotationAccSlow,
          keyboardRotationAccFast
      );
    }
    if (keyboardDown) {
      controlState.value.pitchAcc += selectNormSlowFast(
          keyboardShift,
          keyboardAlt,
          keyboardRotationAcc,
          keyboardRotationAccSlow,
          keyboardRotationAccFast
      );
    }
  }

  if (keyboardMinus || keyboardPlus) {
    controlState.value.zoomAcc = 0;
    if (keyboardMinus) {
      controlState.value.zoomAcc -= keyboardFovAcc;
    }
    if (keyboardPlus) {
      controlState.value.zoomAcc += keyboardFovAcc;
    }
  }

  if (keyboardI || keyboardK) {
    controlState.value.heightAcc = 0;
    if (keyboardK) {
      controlState.value.heightAcc -= keyboardHeightAcc;
    }
    if (keyboardI) {
      controlState.value.heightAcc += keyboardHeightAcc;
    }
  }

  if (keyboardJ || keyboardL) {
    controlState.value.rollAcc = 0;
    if (keyboardJ) {
      controlState.value.rollAcc -= keyboardRotationAcc;
    }
    if (keyboardL) {
      controlState.value.rollAcc += keyboardRotationAcc;
    }
  }
}

onMounted(() => {
  window.addEventListener('mousedown', (e) => {
    controlState.value.yawVel = 0
    controlState.value.pitchVel = 0
    controlState.value.yawAcc = 0;
    controlState.value.pitchAcc = 0;
    controlState.value.yawVelDeceleration = pointerRotationDeceleration;
    controlState.value.pitchVelDeceleration = pointerRotationDeceleration;
    pointerPrev = e;
  })

  window.addEventListener('touchstart', (e) => {
    if (touchId !== null) {
      return;
    }
    e.preventDefault();
    let touch = e.changedTouches[0];
    touchId = touch.identifier;
    controlState.value.yawVel = 0
    controlState.value.pitchVel = 0
    controlState.value.yawAcc = 0;
    controlState.value.pitchAcc = 0;
    controlState.value.yawVelDeceleration = pointerRotationDeceleration;
    controlState.value.pitchVelDeceleration = pointerRotationDeceleration;
    pointer2ndPrev = null;
    pointerPrev = touch;
  })

  window.addEventListener('mousemove', (e) => {
    if (pointerPrev === null || interactive.value === null) {
      return
    }
    const {yaw, pitch} = getAngularDifferenceFromPointers(
        camera.value,
        e,
        pointerPrev,
        interactive.value
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
    if (touchId === null || pointerPrev === null || interactive.value === null) {
      return;
    }
    const touch = getTouchById(e.changedTouches, touchId)
    if (touch === null) {
      return;
    }
    const {yaw, pitch} = getAngularDifferenceFromPointers(
        camera.value,
        touch,
        pointerPrev,
        interactive.value
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
    if (pointer2ndPrev === null || interactive.value === null) {
      pointerPrev = null;
      return;
    }
    const {yaw, pitch} = getAngularDifferenceFromPointers(
        camera.value,
        e,
        pointer2ndPrev,
        interactive.value
    )
    // Only perform momentum if the difference is big enough.
    if (getDistanceBetweenPointers(e, pointer2ndPrev) > 2) {
      controlState.value.yawVel = null
      controlState.value.pitchVel = null
      controlState.value.yawAcc = yaw;
      controlState.value.pitchAcc = pitch;
    }
    pointer2ndPrev = null;
    pointerPrev = null;
    requestAnimationFrame(() => {
      controlState.value.yawAcc = 0;
      controlState.value.pitchAcc = 0;
    })
  }

  function clearTouch(e: TouchEvent) {
    if (touchId === null || interactive.value === null) {
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
        pointer2ndPrev,
        interactive.value
    )
    // Only perform momentum if the difference is big enough.
    if (getDistanceBetweenPointers(touch, pointer2ndPrev) > 2) {
      controlState.value.yawVel = null
      controlState.value.pitchVel = null
      controlState.value.yawAcc = yaw;
      controlState.value.pitchAcc = pitch;
    }
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
    if (
        event.code === 'ArrowLeft' ||
        event.code === 'ArrowRight' ||
        event.code === 'ArrowDown' ||
        event.code === 'ArrowUp'
    ) {
      controlState.value.yawVel = null;
      controlState.value.pitchVel = null;
      controlState.value.yawVelDeceleration = keyboardRotationDeceleration;
      controlState.value.pitchVelDeceleration = keyboardRotationDeceleration;
    }

    if (event.code === 'ArrowLeft') {
      event.preventDefault();
      keyboardLeft = true;
    } else if (event.code === 'ArrowRight') {
      event.preventDefault();
      keyboardRight = true;
    } else if (event.code === 'ArrowDown') {
      event.preventDefault();
      keyboardDown = true;
    } else if (event.code === 'ArrowUp') {
      event.preventDefault();
      keyboardUp = true;
    } else if (event.code === 'Minus') {
      keyboardMinus = true;
      controlState.value.zoomAcc = -keyboardFovAcc;
    } else if (event.code === 'Equal') {
      keyboardPlus = true;
      controlState.value.zoomAcc = keyboardFovAcc;
    } else if (event.code === 'KeyI') {
      keyboardI = true;
      controlState.value.heightAcc = keyboardHeightAcc;
    } else if (event.code === 'KeyK') {
      keyboardK = true;
      controlState.value.heightAcc = -keyboardHeightAcc;
    } else if (event.code === 'KeyJ') {
      keyboardJ = true;
      controlState.value.rollAcc = -keyboardRotationAcc;
    } else if (event.code === 'KeyL') {
      keyboardL = true;
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
    }
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      keyboardShift = true;
    }
    if (event.code === 'AltLeft' || event.code === 'AltRight') {
      keyboardAlt = true;
    }
    normaliseControlStateFromKeyboardState();
  })

  window.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowLeft') {
      controlState.value.yawAcc = 0;
      keyboardLeft = false;
    } else if (event.code === 'ArrowRight') {
      controlState.value.yawAcc = 0;
      keyboardRight = false;
    } else if (event.code === 'ArrowDown') {
      controlState.value.pitchAcc = 0;
      keyboardDown = false;
    } else if (event.code === 'ArrowUp') {
      controlState.value.pitchAcc = 0;
      keyboardUp = false;
    } else if (event.code === 'Minus') {
      controlState.value.zoomAcc = 0;
      keyboardMinus = false;
    } else if (event.code === 'Equal') {
      controlState.value.zoomAcc = 0;
      keyboardPlus = false;
    } else if (event.code === 'KeyI') {
      controlState.value.heightAcc = 0;
      keyboardI = false;
    } else if (event.code === 'KeyK') {
      controlState.value.heightAcc = 0;
      keyboardK = false;
    } else if (event.code === 'KeyJ') {
      controlState.value.rollAcc = 0;
      keyboardJ = false;
    } else if (event.code === 'KeyL') {
      controlState.value.rollAcc = 0;
      keyboardL = false;
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
    }
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      keyboardShift = false;
    }
    if (event.code === 'AltLeft' || event.code === 'AltRight') {
      keyboardAlt = false;
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

function controlZoomUpdate(e: [number]) {
  controlState.value.zoomAcc = e[0] * controlZoomMax;
}

function toggleInfo() {
  showInfo.value = !showInfo.value;
}

function updateProgress (e: [number]) {
  progress.value = e[0];
}

</script>

<template>
  <div
      class="absolute w-screen h-screen max-h-screen min-h-screen bg-black z-10 pointer-events-none flex items-center justify-center flex-col gap-5"
      :class="{hidden: progress === 1}"
  >
    <Loading :progress="progress" />
  </div>
  <div
      class="grid w-screen h-screen max-h-screen min-h-screen grid-rows-1 grid-cols-1"
      :class="{
    'md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-[1fr_minmax(20rem,_33%)]': showInfo,
      }"
      style="height: 100dvh; min-height: 100dvh; max-height: 100dvh;">
    <div ref="interactive" class="touch-none relative md:block"
         :class="{ hidden: showInfo }"
    >
      <Cyclorama
          :camera="camera"
          :controlState="controlState"
          @progressUpdate="updateProgress"
      />
      <div
          class="absolute bottom-0 left-0 pointer-events-none"
      >
        <div class="p-6">
          <Joystick @controlUpdate="joystickUpdate"/>
        </div>
      </div>
      <div
          class="absolute top-0 right-0 pointer-events-none"
      >
        <div class="p-4 pointer-events-auto">
          <Controls
              :show-info="showInfo"
              @toggle-info="toggleInfo"
              @zoom-update="controlZoomUpdate"
          />
        </div>
      </div>
    </div>
    <div class="overflow-y-auto"
         :class="{ hidden: !showInfo, 'md:block': showInfo }"
    >
      <Info @toggle-info="toggleInfo"/>
    </div>
  </div>
</template>

<style scoped>
</style>
