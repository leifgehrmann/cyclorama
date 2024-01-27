<script setup lang="ts">
import Cyclorama from './components/Cyclorama.vue'
import Joystick from './components/Joystick.vue';
import Controls from "./components/Controls.vue";
import {onMounted} from "vue";

type Position = [number, number];

let mouseDown: null | Position = null;

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
})

function joystickUpdate(e) {
}

</script>

<template>
  <div class="touch-none">
    <Cyclorama/>
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
