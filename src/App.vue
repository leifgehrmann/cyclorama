<script setup lang="ts">
import CycloramaScreen from "./components/CycloramaScreen.vue";
import SelectionScreen from "./components/SelectionScreen.vue";
import {getScene, Scene} from "./scenes.ts";

const urlParams = new URLSearchParams(window.location.search);
const sceneKey = urlParams.get('view');
let scene: Scene|null = null;
if (sceneKey !== null) {
  scene = getScene(sceneKey);
}

</script>

<template>
  <SelectionScreen v-if="scene === null"/>
  <CycloramaScreen v-else :scene="scene"/>
</template>

<style scoped>
</style>
