<script setup lang="ts">

import {onMounted, ref} from "vue";

const joystick = ref(null as null | HTMLDivElement)
const handle = ref(null as null | HTMLDivElement)

let mouseDown: boolean = false;
let handlePositionX = 0;
let handlePositionY = 0;
let angle = 0;
let magnitude = 0;

onMounted(() => {
  if (joystick.value === null || handle.value === null) {
    return;
  }
  joystick.value.addEventListener('mousedown', (e) => {
    mouseDown = true;
    e.preventDefault();
    e.stopPropagation();

    // Todo: If the cursor is within the handle, don't move the handle's center
    // to where the cursor is, instead use the difference.

    if (joystick.value === null || handle.value === null) {
      return
    }
    const rect = joystick.value.getBoundingClientRect();
    handle.value.style.left = `${(e.clientX - rect.left - rect.width / 2)}px`;
    handle.value.style.top = `${(e.clientY - rect.top - rect.height / 2)}px`;
    magnitude = Math.hypot(
        e.clientX - rect.left - rect.width / 2,
        e.clientY - rect.top - rect.height / 2
    );
    angle = Math.atan2(
        e.clientY - rect.top - rect.height / 2,
        e.clientX - rect.left - rect.width / 2,
    );
  })

  window.addEventListener('mousemove', (e) => {
    if (joystick.value === null || handle.value === null || !mouseDown) {
      return
    }
    const rect = joystick.value.getBoundingClientRect();
    handle.value.style.left = `${(e.clientX - rect.left - rect.width / 2)}px`;
    handle.value.style.top = `${(e.clientY - rect.top - rect.height / 2)}px`;
    magnitude = Math.hypot(
        e.clientX - rect.left - rect.width / 2,
        e.clientY - rect.top - rect.height / 2
    );
    angle = Math.atan2(
        e.clientY - rect.top - rect.height / 2,
        e.clientX - rect.left - rect.width / 2,
    );
  })

  function clearMouse(e: Event) {
    mouseDown = false;
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
      magnitude *= 0.5;
    }
    requestAnimationFrame(animate);
    handlePositionX = Math.cos(angle) * Math.min((joyRect.width/2 - handleRect.width/2), magnitude) + (joyRect.width / 2 - handleRect.width / 2);
    handlePositionY = Math.sin(angle) * Math.min((joyRect.width/2 - handleRect.width/2), magnitude) + (joyRect.width / 2 - handleRect.width / 2);
    handle.value.style.left = `${handlePositionX}px`
    handle.value.style.top = `${handlePositionY}px`
  }
  animate();
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