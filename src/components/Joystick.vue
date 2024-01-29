<script setup lang="ts">

import {onMounted, ref, defineEmits} from "vue";
import getTouchById from "../utils/pointerUtils.ts";

const emit = defineEmits(['controlUpdate'])

const joystick = ref(null as null | HTMLDivElement)
const handle = ref(null as null | HTMLDivElement)

let mouseDown: boolean = false;
let touchId: number | null = null;
let originX = 0;
let originY = 0;
let handlePositionX = 0;
let handlePositionY = 0;
let angle = 0;
let magnitude = 0;

onMounted(() => {
  if (joystick.value === null || handle.value === null) {
    return;
  }
  joystick.value.addEventListener('touchstart', (e: TouchEvent) => {
    if (touchId !== null) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    let touch = e.changedTouches[0];
    touchId = touch.identifier;
    cursorStart(touch.clientX, touch.clientY);
  })
  joystick.value.addEventListener('mousedown', (e) => {
    if (e.button !== 0) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    mouseDown = true;
    cursorStart(e.clientX, e.clientY);
  })

  window.addEventListener('touchmove', (e) => {
    if (touchId === null) {
      return
    }
    let touch = getTouchById(e.changedTouches, touchId)
    if (touch === null) {
      return;
    }
    cursorMove(touch.clientX, touch.clientY);
  })

  window.addEventListener('mousemove', (e) => {
    if (!mouseDown) {
      return
    }
    cursorMove(e.clientX, e.clientY);
  })

  function clearMouse() {
    mouseDown = false;
    animate();
  }
  function clearTouch(e: TouchEvent) {
    if (touchId === null) {
      return;
    }
    let touch = getTouchById(e.changedTouches, touchId)
    if (touch === null) {
      // This means the touchend has not yet fired for the touch that is
      // actively controlling the joystick.
      return;
    }
    touchId = null;
    animate();
  }

  window.addEventListener('mouseleave', clearMouse)
  window.addEventListener('mouseup', clearMouse)
  window.addEventListener('touchend', clearTouch)
  window.addEventListener('touchcancel', clearTouch)

  function animate() {
    if (joystick.value === null || handle.value === null) {
      return;
    }
    const joyRect = joystick.value.getBoundingClientRect();
    const handleRect = handle.value.getBoundingClientRect();
    if (!mouseDown && touchId === null) {
      magnitude = Math.min((joyRect.width/2 - handleRect.width/2), magnitude);
      magnitude *= 0.6;
    }
    handlePositionX = Math.cos(angle) * Math.min((joyRect.width/2 - handleRect.width/2), magnitude) + (joyRect.width / 2 - handleRect.width / 2);
    handlePositionY = Math.sin(angle) * Math.min((joyRect.width/2 - handleRect.width/2), magnitude) + (joyRect.width / 2 - handleRect.width / 2);
    handle.value.style.left = `${handlePositionX}px`
    handle.value.style.top = `${handlePositionY}px`

    const valueX = (handlePositionX - (joyRect.width / 2 - handleRect.width / 2)) / (joyRect.width / 2 - handleRect.width / 2)
    const valueY = (handlePositionY - (joyRect.width / 2 - handleRect.width / 2)) / (joyRect.width / 2 - handleRect.width / 2)
    emit('controlUpdate', [valueX, valueY]);
    if (!mouseDown && touchId === null && magnitude > 0.0001) {
      requestAnimationFrame(animate);
    }
  }

  function cursorStart(clientX: number, clientY: number) {
    if (joystick.value === null || handle.value === null) {
      return
    }
    const rect = joystick.value.getBoundingClientRect();
    const handleRect = handle.value.getBoundingClientRect();
    originX = rect.left + rect.width / 2
    originY = rect.top + rect.height / 2
    if (Math.hypot(originX - clientX, originY - clientY) < handleRect.width / 2) {
      originX = clientX
      originY = clientY
    }
    handle.value.style.left = `${(clientX - originX)}px`;
    handle.value.style.top = `${(clientY - originY)}px`;
    magnitude = Math.hypot(
        clientX - originX,
        clientY - originY
    );
    angle = Math.atan2(
        clientY - originY,
        clientX - originX,
    );
    animate();
  }

  function cursorMove(clientX: number, clientY: number) {
    if (joystick.value === null || handle.value === null) {
      return
    }
    handle.value.style.left = `${(clientX - originX)}px`;
    handle.value.style.top = `${(clientY - originY)}px`;
    magnitude = Math.hypot(
        clientX - originX,
        clientY - originY
    );
    angle = Math.atan2(
        clientY - originY,
        clientX - originX,
    );
    animate();
  }

  window.addEventListener('resize', () => {
    // The same transition duration that is in style.css.
    setTimeout(animate, 150)
  });
})

</script>

<template>
  <div class="absolute bottom-10 left-10">
    <div ref="joystick" class="rounded-full w-24 aspect-square bg-gray-800 bg-opacity-40 backdrop-filter backdrop-blur-xl flex justify-center items-center relative shadow-lg">
      <div class="absolute left-[0.45rem] w-1.5 aspect-square text-white"><img src="../assets/arrow.svg" aria-hidden="true" class="w-full rotate-[270deg]"></div>
      <div class="absolute right-[0.45rem] w-1.5 aspect-square text-white"><img src="../assets/arrow.svg" aria-hidden="true" class="w-full rotate-[90deg]"></div>
      <div class="absolute top-[0.45rem] w-1.5 aspect-square text-white"><img src="../assets/arrow.svg" aria-hidden="true" class="w-full rotate-[0deg]"></div>
      <div class="absolute bottom-[0.45rem] w-1.5 aspect-square text-white"><img src="../assets/arrow.svg" aria-hidden="true" class="w-full rotate-[180deg]"></div>
      <div ref="handle" class="absolute rounded-full w-14 aspect-square bg-gray-400 bg-opacity-90 backdrop-blur-sm shadow-[0_4px_8px_0_rgba(0,0,0,0.3),inset_0_4px_4px_0_rgba(255,255,255,0.1),inset_0px_-4px_4px_0_rgba(0,0,0,0.1),inset_0_1px_1px_0_rgba(255,255,255,0.3),inset_0px_-1px_1px_0_rgba(0,0,0,0.3)]">
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>