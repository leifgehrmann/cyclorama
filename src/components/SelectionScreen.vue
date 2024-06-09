<script setup lang="ts">
import {getScenes} from "../scenes.ts";
import {ref} from "vue";

const barkerPanoramas = ref(Object.entries(getScenes()).filter(([_, scene]) => scene.selectionScreenGroup === 'barker'));
const hornorPanoramas = ref(Object.entries(getScenes()).filter(([_, scene]) => scene.selectionScreenGroup === 'hornor'));

</script>

<template>
  <div id="screen">
    <h1 class="italic text-3xl font-bold">Cycloramas</h1>
    <p class="mb-10">A collection of panoramas from the 1800s and a virtual recreation of the cyclorama, a building designed to exhibit massive 360-degree paintings, surrounding the viewer. For more information, read <a href="https://leifgehrmann.com/2024/06/09/1800-panoramas/"><em>The Cyclorama: Virtual Reality in the&nbsp;1800s</em></a> by Leif Gehrmann.</p>
    <h2>1. Panoramas by the Barkers</h2>
    <p>Panoramas from Robert Barker, Henry Aston Barker, or any other panoramas exhibited at Leicester Square or the Strand in London.</p>
    <ul>
      <li
          v-for="sceneEntry in barkerPanoramas"
          :style="`background-color: #FFEEC3;background-image: url('${sceneEntry[1].thumbnail}');`"
      >
        <a :href="`./?view=${sceneEntry[0]}`" v-html="sceneEntry[1].selectionScreenHtml">
        </a>
      </li>
    </ul>
    <h2>2. Thomas Hornor's Colosseum</h2>
    <p>Panoramas related to Thomas Hornor's panorama taken from the top of St. Paul Cathedral, including a modern view of London for comparison.</p>
    <ul>
      <li
          v-for="sceneEntry in hornorPanoramas"
          :style="`background-color: #FFEEC3;background-image: url('${sceneEntry[1].thumbnail}');`"
      >
        <a :href="`./?view=${sceneEntry[0]}`" v-html="sceneEntry[1].selectionScreenHtml">
        </a>
      </li>
    </ul>
    <h2>Controls</h2>
    <table class="mb-16 text-left">
      <tr>
        <td><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or Joystick</td>
        <td>Walk around</td>
      </tr>
      <tr>
        <td><kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd> or Drag</td>
        <td>Adjust view</td>
      </tr>
      <tr>
        <td><kbd>+</kbd><kbd>−</kbd></td>
        <td>Adjust zoom</td>
      </tr>
      <tr>
        <td><kbd>SHIFT</kbd></td>
        <td>Move fast</td>
      </tr>
      <tr>
        <td><kbd>ALT</kbd></td>
        <td>Move slow</td>
      </tr>
      <tr>
        <td><kbd>I</kbd><kbd>K</kbd></td>
        <td>Adjust height</td>
      </tr>
      <tr>
        <td><kbd>J</kbd><kbd>L</kbd></td>
        <td>Adjust tilt</td>
      </tr>
      <tr>
        <td><kbd>H</kbd></td>
        <td>Toggle controls</td>
      </tr>
      <tr>
        <td><kbd>B</kbd></td>
        <td>Toggle boundary break</td>
      </tr>
    </table>
    <h2>Credits</h2>
    <p class="mb-16">
      Compilation and recreation of panoramas by <a href="https://leifgehrmann.com">Leif Gehrmann</a>. Source code for this website is available on <a href="https://github.com/leifgehrmann/cyclorama">GitHub</a>. For attribution of the original panoramas, please press the <img src="../assets/show-info-inactive.svg" alt="info" class="inline opacity-60 align-text-bottom" style="height: 1ic"> button on each page.
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

table {
  @apply text-sm text-white/60 max-w-96 mx-auto font-serif border-separate border-spacing-x-4 border-spacing-y-2;
}

kbd {
  font-family: monospace;
  font-size: 90%;
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 0 0.25rem;
  border-radius: 0.25rem;
}

kbd + kbd {
  margin-left: 0.2rem;
}

</style>
