<script setup lang="ts">

import Attribution from "./Attribution.vue";
const urlParams = new URLSearchParams(window.location.search);
const highQuality = urlParams.get('hq') === 'true';
</script>

<template>
  <Attribution
      license="Public Domain"
      entity="Library of Congress & King George Ⅲ's Personal Coloured Views Collection"
  />
  <hr>
  <h1 class="text-center leading-3 text-xl mb-10"><span class="font-bold" style="font-variant: small-caps"><span class="text-4xl">Panorama</span> of <br><span class="inline-block mb-3 text-4xl">Constantin&shy;ople.</span></span><br> and Environs.</h1>
  <p class="text-center text-sm">
    <small>Drawn on the spot by</small><br> Henry Aston Barker<br>
    <small>Etched by</small> Charles Tomkins<br>
    <small>Aquatinted by</small> Frederick Christian Lewis <br><small>and </small>George Robert Lewis<br>
  </p>
  <p class="text-center text-sm">
    <small>Published</small> January 1<sup>st</sup> 1813,<br><small> by</small> Thomas Palser, Surry side Westminster Bridge<br> <small>and</small> Henry Aston Barker, West Square.
  </p>
  <hr>
  <p>The original panorama no longer exists, but this aquatint is possibly a recreation of it. The panorama <em>"View of Constantinople from the Tower of Galata"</em> was first exhibited at Leicester Square in the Lower Circle, between April 27th, 1801 – May 15th, 1802.<a href="#citation1"><sup>[1]</sup></a> It's unclear how different the panorama was from this aquatint.</p>
  <p v-if="!highQuality">For performance reasons, the image quality of this panorama was reduced so the experience on mobile phones is smoother. <a href="./?view=constantinople&hq=true">Click here to view a higher quality version.</a></p>
  <p id="citation1"><sup>[1]</sup> <em>The First Panoramas: Visions of British Imperialism</em> by Denise Oleksijczuk, p. 173</p>
  <hr>
  <p>This work is a digital composition of two reproductions of aquatints.</p>
  <p>High-resolution (but colourless) scans come from the Library of Congress.</p>
  <details>
    <summary>Reproduction Numbers</summary>
    <ul>
    <li><a href="http://hdl.loc.gov/loc.pnp/pga.04189">LC-DIG-pga-04189</a></li>
    <li><a href="http://hdl.loc.gov/loc.pnp/pga.04190">LC-DIG-pga-04190</a></li>
    <li><a href="http://hdl.loc.gov/loc.pnp/pga.04191">LC-DIG-pga-04191</a></li>
    <li><a href="http://hdl.loc.gov/loc.pnp/pga.04192">LC-DIG-pga-04192</a></li>
    <li><a href="http://hdl.loc.gov/loc.pnp/pga.04193">LC-DIG-pga-04193</a></li>
    <li><a href="http://hdl.loc.gov/loc.pnp/pga.04194">LC-DIG-pga-04194</a></li>
    <li><a href="http://hdl.loc.gov/loc.pnp/pga.04195">LC-DIG-pga-04195</a></li>
    <li><a href="http://hdl.loc.gov/loc.pnp/pga.04196">LC-DIG-pga-04196</a></li>
    </ul>
  </details>
  <p>Coloured (but low-resolution) scans come from King George Ⅲ's Personal Coloured Views Collection.</p>
  <details>
    <summary>Shelfmarks</summary>
    <ul>
      <li><a href="http://george3.splrarebooks.com/collection/view/panorama-of-constantinople-and-environs-plate-1.-drawn-on-the-spot-by-henry">Maps K.Top.113.75.f.3.</a></li>
      <li><a href="http://george3.splrarebooks.com/collection/view/panorama-of-constantinople-and-environs-plate-2.-drawn-on-the-spot-by-henry">Maps K.Top.113.75.f.4.</a></li>
      <li><a href="http://george3.splrarebooks.com/collection/view/panorama-of-constantinople-and-environs-plate-3.-drawn-on-the-spot-by-henry">Maps K.Top.113.75.f.5.</a></li>
      <li><a href="http://george3.splrarebooks.com/collection/view/panorama-of-constantinople-and-environs-plate-4.-drawn-on-the-spot-by-henry">Maps K.Top.113.75.f.6.</a></li>
      <li><a href="http://george3.splrarebooks.com/collection/view/panorama-of-constantinople-and-environs-plate-5.-drawn-on-the-spot-by-henry">Maps K.Top.113.75.f.7.</a></li>
      <li><a href="http://george3.splrarebooks.com/collection/view/panorama-of-constantinople-and-environs-plate-6.-drawn-on-the-spot-by-henry">Maps K.Top.113.75.f.8.</a></li>
      <li><a href="http://george3.splrarebooks.com/collection/view/panorama-of-constantinople-and-environs-plate-7.-drawn-on-the-spot-by-henry">Maps K.Top.113.75.f.9.</a></li>
      <li><a href="http://george3.splrarebooks.com/collection/view/panorama-of-constantinople-and-environs-plate-8.-drawn-on-the-spot-by-henry">Maps K.Top.113.75.f.10.</a></li>
    </ul>
  </details>
</template>

<style scoped>

</style>