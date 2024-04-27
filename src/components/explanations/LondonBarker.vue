<script setup lang="ts">

import Attribution from "./Attribution.vue";
const urlParams = new URLSearchParams(window.location.search);
const highQuality = urlParams.get('hq') === 'true';
</script>

<template>
  <Attribution
      identifier="orbis:205530"
      license-url="https://creativecommons.org/publicdomain/zero/1.0/"
      license="CC0 1.0"
      url="https://collections.britishart.yale.edu/catalog/orbis:205530"
      entity="Yale Center for British Art"
  />
  <hr>
  <h1 class="text-center text-xl leading-4 mb-4"><span class="text-6xl font-black">LONDON</span><br>from the Roof of Albion Mills</h1>
  <p class="text-center text-sm">
    <small>Sketches by</small> Henry Aston Barker<br>
    <small>Painted by</small> Robert Barker<br>
    <small>Aquatint by</small> Frederick Birnie
  </p>
  <p class="text-center text-xl">1792-1793</p>
  <hr>
  <p>The original panorama no longer exists, but this aquatint is possibly a recreation. A panorama from Albion Mills was first exhibited at 28 Castle Street in London in June 11th 1791 until early 1794.<a href="#citation1"><sup>[1]</sup></a> It was small and not a complete circle.<a href="#citation2"><sup>[2]</sup></a> It was later repainted to be 360-degress and exhibited at Leicester Square between March 28th, 1795 and February 13th, 1796. Finally it put on tour across Europe, exhibiting in Hamburg, Leipzig, Prague, Vienna, and Paris.<a href="#citation3"><sup>[3]</sup></a> It's unclear how different these panoramas were from the aquatints.</p>
  <p>The dimensions of this simulated cyclorama are not the same as the dimensions of the original cyclorama; the original had a much smaller diameter. At 28 Castle Street the dimensions are unknown. At Leceister Square the diameter of the Upper Circle was 50 feet (15 meters). This simulation uses the dimensions of the Lower Circle at Leicester Square, which has a diameter of 84 feet (25 meters), to demonstrate Robert Barker's desired vision.</p>
  <p>Ralph Hyde noted in his book <em>Panoramania</em> some nice details.<a href="#citation4"><sup>[4]</sup></a> "At the [south] end of Blackfriars Bridge workmen repair the road, a waterman descends the stairs to his vessel, a man raps on a door of Albion Place, and a woman calls out of a window. River craft close by includes a barge of the Royal Exchange Fire Office, an allusion to the fire, fought by insurance fire boats, which gutted the Albion Mills between the completion of Barker's drawings and the publication of the prints."</p>
  <p>A key of the panorama can be found at the <a href="https://www.britishmuseum.org/collection/object/P_1880-1113-5509-1">British Museum</a> (Museum Number: 1880,1113.5509.1)</p>
  <p v-if="!highQuality">For performance reasons, the image quality of this panorama was reduced so the experience on mobile phones is smoother. <a href="./?view=albionMills&hq=true">Click here to view a higher quality version.</a></p>
  <hr>
  <p id="citation1"><sup>[1]</sup> <em>The First Panoramas: Visions of British Imperialism</em> by Denise Oleksijczuk, p. 48</p>
  <p id="citation2"><sup>[2]</sup> <em>Panoramania: The Art and Entertainment of the "all-embracing" View</em> by Ralph Hyde, p. 62</p>
  <p id="citation2"><sup>[3]</sup> <em>'Spectacles within doors': Panoramas of London in the 1790s</em> by Markman Elles</p>
  <p id="citation2"><sup>[4]</sup> <em>Panoramania: The Art and Entertainment of the "all-embracing" View</em> by Ralph Hyde, p. 64</p>
</template>

<style scoped>

</style>