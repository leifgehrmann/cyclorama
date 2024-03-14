<script setup lang="ts">
</script>

<template>
  <div id="screen">
    <h1 class="italic text-3xl font-bold">Cycloramas</h1>
    <p class="mb-10">A collection of panoramas from the 1800s and a virtual recreation of the cyclorama, a building designed to exhibit massive 360-degree paintings, surrounding the viewer. For more information, read <a href="https://leifgehrmann.com"><em>Virtual Reality in the&nbsp;1800s</em></a> by Leif Gehrmann.</p>
    <h2>1. Panoramas by the Barkers</h2>
    <p>Panoramas from Robert Barker, Henry Aston Barker, or any other panoramas exhibited at Leicester Square or the Strand in London.</p>
    <ul>
      <li style="background-image: url('/public/barker.jpg');"><a href="./?view=edinburgh">
        View of Edinburgh from Calton Hill<br>
        <span class="text-xs">1789- (Watercolour from 1792)</span>
      </a></li>
      <li style="background-image: url('/public/blondon.jpg')"><a href="./?view=edinburgh">
        London from the Roof of Albion Mills<br>
        <span class="text-xs">17??-17?? (Aquatint from 1792-1793)</span>
      </a></li>
      <li style="background-image: url('/public/1982,U.3982-panorama.jpg')"><a href="./?view=edinburgh">
        View of Treport, the surrounding Country, and Chateau d'Eu<br>
        <span class="text-xs">19??</span>
      </a></li>
    </ul>
    <h2>2. Thomas Hornor's Colosseum</h2>
    <p>Panoramas related to Thomas Hornor's panorama taken from the top of St. Paul Cathedral, including a modern view of London for comparison.</p>
    <ul>
      <li style="background-image: url('/public/1880,1113.1213.jpg');"><a href="./?view=edinburgh">
        View of Edinburgh from Calton Hill<br>
        <span class="text-xs">1789- (Watercolour from 1792)</span>
      </a></li>
      <li style="background-image: url('/public/1880,1113.1214.jpg')"><a href="./?view=edinburgh">
        London from the Roof of Albion Mills<br>
        <span class="text-xs">17??-17?? (Aquatint from 1792-1793)</span>
      </a></li>
      <li style="background-image: url('/public/london.jpg')"><a href="./?view=edinburgh">
        Panoramic view of London taken from the Golden Gallery of St Paulʼs Cathedral<br>
        <span class="text-xs">2007, Photo by David Iliff</span>
      </a></li>
    </ul>
    <h2>Credits</h2>
    <p class="mb-16">
      Compilation and recreation of panoramas by <a href="https://leifgehrmann.com">Leif Gehrmann</a>. Source code for this website is available on <a href="https://github.com/leifgehrmann/cyclorama">GitHub</a>. For attribution of the original panoramas, please press the <img src="../assets/show-info-inactive.svg" alt="info" class="inline opacity-60" style="height: 1ic"> button on each page.
    </p>
  </div>
</template>

<style scoped>
#screen * {
  -webkit-touch-callout: default;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

ul {
  @apply mx-auto my-10 max-w-96 justify-center items-center;
}

li {
  @apply bg-cover;
}

li + li {
  @apply mt-4;
}

li a {
  @apply block py-10 px-10 w-full cursor-pointer bg-black/70 transition-colors ease-in;
}

li a:hover {
  @apply bg-black/85;
}

h1, h2, p, a {
  @apply text-center text-white/75 font-serif;
}

h1 {
  @apply my-10;
}

h2 {
  @apply text-xl;
}

p {
  @apply text-sm text-white/60 max-w-64 mx-auto;
}

p a {
  @apply text-indigo-400;
}

</style>
