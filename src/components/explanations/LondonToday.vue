<script setup lang="ts">

import Attribution from "./Attribution.vue";
</script>

<template>
  <h1 class="text-center text-xl leading-4 mb-10"><em>Panoramic view of </em><br><span class="text-6xl font-black uppercase">London</span><br><em> taken from the Golden Gallery of</em> <br><span class="text-2xl font-bold" style="font-variant: small-caps">St Paulʼs Cathedral</span></h1>
  <p class="text-center text-sm">
    <small>Photo by</small> David Iliff<br>
    <small>Taken</small> 18th of September, 2007<br>
  </p>
  <hr>
  <p class="text-center text-sm">
    Photo by DAVID ILIFF. License: <a href="https://creativecommons.org/licenses/by/3.0/deed.en">CC BY-SA 3.0</a>.<br>
    Original from the <a href="https://commons.wikimedia.org/w/index.php?title=File:London_360_from_St_Paul%27s_Cathedral_-_Sept_2007.jpg&oldid=844975805">Wikimedia Commons</a>.
  </p>
  <!-- Todo: Replace URL with asset URL -->
  <img src="/public/london.jpg" alt="A thumbnail image of the panorama.">
</template>

<style scoped>

</style>