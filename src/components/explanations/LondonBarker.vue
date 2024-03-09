<script setup lang="ts">

import Attribution from "./Attribution.vue";
</script>

<template>
  <h1 class="text-center text-xl leading-4 mb-4"><span class="text-6xl font-black">LONDON</span><br>from the Roof of Albion Mills</h1>
  <p class="text-center text-sm">
    <small>Sketches by</small> Henry Aston Barker<br>
    <small>Painted by</small> Robert Barker<br>
    <small>Aquatint by</small> Frederick Birnie
  </p>
  <p class="text-center text-xl">1792-1793</p>
  <hr>
  <p>A key of the panorama can be found at the <a href="https://www.britishmuseum.org/collection/object/P_1880-1113-5509-1">British Museum</a> (Museum Number: 1880,1113.5509.1)</p>
  <hr>
  <p>This work is a digital composition of the original aquatints.</p>
  <p>Original images were downloaded from the Yale Center for British Art.</p>
  <Attribution
      identifier="orbis:205530"
      license-url="https://creativecommons.org/publicdomain/zero/1.0/"
      license="CC0 1.0"
      url="https://collections.britishart.yale.edu/catalog/orbis:205530"
      entity="Yale Center for British Art"
  />
  <img src="/public/blondon.jpg">
  <p>The images were then trimmed and edited by Leif&nbsp;Gehrmann. The edited version is licensed to the public domain to match the original document from the Yale Center for British Art.</p>
  <!-- Todo: Show composition instructions. -->
  <details>
    <summary>Commands</summary>
    <pre>

// Todo:
montage yale-orbis-205530-[1-6].jpg -tile 6x1 -geometry +0+0 stitch.jpg
    </pre>
  </details>
</template>

<style scoped>

</style>