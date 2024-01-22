<script setup lang="ts">
import Cyclorama from './components/Cyclorama.vue'
import Joystick from './components/Joystick.vue';
import Controls from "./components/Controls.vue";
</script>

<template>
  <div class="touch-none">
    <Cyclorama />
    <Joystick />
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
