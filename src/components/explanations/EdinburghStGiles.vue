<script setup lang="ts">

import Attribution from "./Attribution.vue";
</script>

<template>
  <h1 class="text-center text-2xl leading-4 mb-4"><span class="text-4xl font-bold uppercase">Edinburgh</span><br><em>from the Crown of</em><br><span class="text-3xl font-bold" style="font-variant: small-caps">St Giles</span></h1>
  <p class="text-center text-sm">
    <small>Attributed to </small><span style="font-variant: small-caps">Robert Barker,<a href="#attribution"><sup>[1]</sup></a></span><br>
    <small>and </small><span style="font-variant: small-caps">Henry Aston Barker,</span><br>
    <small>and </small><span style="font-variant: small-caps">W. Wells<a href="#wells"><sup>[2]</sup></a></span><br>
  </p>
  <p class="text-center text-sm">
    Coloured lithograph on paper, 43.8 × 279.2cm<br>
    Purchased (with government grant-in-aid)<a href="#popiel"><sup>[3]</sup></a>
  </p>
  <hr>
  <Attribution
      license="Reproduced, with permission"
      entity="the City Art Centre,<br/>City of Edinburgh Museums & Galleries"
  />
  <img src="/public/BARKER_EDINBURGH_500.jpg">
  <hr>
  <p id="attribution"><sup>[1]</sup> There's some uncertainty whether this piece can be attributed to Robert Barker. Several features depicted in the art piece are from after Robert Barker's death in 1806, like the Nelson Monument on Calton Hill which started construction in 1807.</p>
  <p id="wells"><sup>[2]</sup> The name 'W Wells' was included as a note against this art piece for the City Art Centre. It's unclear who exactly this is. They may be related to John Wells, who printed an aquatint of Robert Barker's earliest panoramas: <em>panorama of Edinburgh from tower of Calton Hill observatory</em>. A record of this piece can be viewed at <a href="http://nms.scran.ac.uk/database/record.php?usi=000-100-104-237-C">National Museums Scotland</a>.</p>
  <p id="popiel"><sup>[3]</sup> Popiel, Alyssa Jean. <em>A Capital View : The Art of Edinburgh : One Hundred Artworks from the City Collection / Alyssa Jean Popiel</em>. Edinburgh: Birlinn, 2014. Print.</p>
</template>

<style scoped>

</style>