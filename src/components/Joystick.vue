<script setup lang="ts">

import {onMounted, ref, defineEmits} from "vue";

const emit = defineEmits(['controlUpdate'])

const joystick = ref(null as null | HTMLDivElement)
const handle = ref(null as null | HTMLDivElement)

let mouseDown: boolean = false;
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
  joystick.value.addEventListener('mousedown', (e) => {
    if (e.button !== 0) {
      return;
    }
    mouseDown = true;
    e.preventDefault();
    e.stopPropagation();
    if (joystick.value === null || handle.value === null) {
      return
    }
    const rect = joystick.value.getBoundingClientRect();
    const handleRect = handle.value.getBoundingClientRect();
    originX = rect.left + rect.width / 2
    originY = rect.top + rect.height / 2
    if (Math.hypot(originX - e.clientX, originY - e.clientY) < handleRect.width / 2) {
      originX = e.clientX
      originY = e.clientY
    }
    handle.value.style.left = `${(e.clientX - originX)}px`;
    handle.value.style.top = `${(e.clientY - originY)}px`;
    magnitude = Math.hypot(
        e.clientX - originX,
        e.clientY - originY
    );
    angle = Math.atan2(
        e.clientY - originY,
        e.clientX - originX,
    );
    animate();
  })

  window.addEventListener('mousemove', (e) => {
    if (joystick.value === null || handle.value === null || !mouseDown) {
      return
    }
    handle.value.style.left = `${(e.clientX - originX)}px`;
    handle.value.style.top = `${(e.clientY - originY)}px`;
    magnitude = Math.hypot(
        e.clientX - originX,
        e.clientY - originY
    );
    angle = Math.atan2(
        e.clientY - originY,
        e.clientX - originX,
    );
    animate();
  })

  function clearMouse() {
    mouseDown = false;
    animate();
  }

  window.addEventListener('mouseleave', clearMouse)
  window.addEventListener('mouseup', clearMouse)

  function animate() {
    if (joystick.value === null || handle.value === null) {
      return;
    }
    const joyRect = joystick.value.getBoundingClientRect();
    const handleRect = handle.value.getBoundingClientRect();
    if (!mouseDown) {
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
    if (!mouseDown && magnitude > 0.0001) {
      requestAnimationFrame(animate);
    }
  }
})

</script>

<template>
  <div class="absolute bottom-10 left-10">
    <div ref="joystick" class="rounded-full w-48 aspect-square bg-gray-800 bg-opacity-40 backdrop-filter backdrop-blur-xl flex justify-center items-center relative overflow-hidden shadow-lg">
      <div class="absolute left-4 w-2 aspect-square text-white bg-white rounded-full"></div>
      <div class="absolute right-4 w-2 aspect-square text-white bg-white rounded-full"></div>
      <div class="absolute top-4 w-2 aspect-square text-white bg-white rounded-full"></div>
      <div class="absolute bottom-4 w-2 aspect-square text-white bg-white rounded-full"></div>
      <div ref="handle" class="absolute rounded-full w-28 aspect-square bg-gray-400 bg-opacity-90 backdrop-blur-sm shadow-[0_4px_8px_0_rgba(0,0,0,0.3),inset_0_4px_4px_0_rgba(255,255,255,0.1),inset_0px_-4px_4px_0_rgba(0,0,0,0.1),inset_0_1px_1px_0_rgba(255,255,255,0.3),inset_0px_-1px_1px_0_rgba(0,0,0,0.3)]">
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>