<script setup lang="ts">
import CycloramaScreen from "./components/CycloramaScreen.vue";
import SelectionScreen from "./components/SelectionScreen.vue";

const urlParams = new URLSearchParams(window.location.search);
const view = urlParams.get('view');

</script>

<template>
  <SelectionScreen v-if="view === null"/>
  <CycloramaScreen v-else />
</template>

<style scoped>
</style>
