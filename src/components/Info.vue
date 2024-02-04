<script setup lang="ts">
import {defineEmits, onMounted, ref} from "vue";

const emit = defineEmits(['toggleInfo'])
const info = ref(null as null | HTMLDivElement)

onMounted(() => {
  if (info.value === null) {
    return;
  }
  info.value.addEventListener('touchstart', (e: TouchEvent) => {
    e.stopPropagation();
  })
  info.value.addEventListener('mousedown', (e: MouseEvent) => {
    e.stopPropagation();
  })
});
</script>

<template>
  <div id="info" ref="info" class="pointer-events-auto shadow-lg">
    <div class="md:hidden absolute top-0 right-0 p-4">
      <div
          class="
      bg-neutral-800 bg-opacity-70
      backdrop-filter backdrop-blur-xl
      rounded-xl
      text-center
      shadow-lg
      "
      >
        <button
            type="button"
            tabindex="4"
            class="
        px-3 py-3
        w-12 h-12
        rounded-xl
        group
        cursor-pointer
        "
            aria-label="Show info"
            title="Show info"
            @click="emit('toggleInfo')"
        >
          <img
              src="../assets/close.svg"
              aria-hidden="true"
              alt="Info is hidden"
          >
        </button>
      </div>
    </div>
    <div class="p-4 pt-24 md:pt-10 pb-32 select-text grid gap-4 max-w-[40rem] m-auto"
    >
      <h1 class="text-center text-xl">EXPLANATION of a View of TREPORT, the surrounding Country, and CHATEAU D'EU, now exhibiting at the PANORAMA, LEICESTER SQUARE.</h1>
      <ol>
        <li>Drawbridge</li>
        <li>Royal Barge House</li>
        <li>Palace and Cathedral at Eu</li>
        <li>House for Refreshments and Sale of Ostend Oysters</li>
        <li>Fishing Boats</li>
        <li>The River Bresle</li>
        <li>Coal Brig, “The Earl of Errol”</li>
        <li>Custom House</li>
        <li>Church of St. Jacques</li>
        <li>Hotel Ville de Calais</li>
        <li>Crane</li>
        <li>The Pavilion</li>
        <li>Western Cliff</li>
        <li>State Boat</li>
        <li>The King's Barge</li>
        <li>The Royal Pleasure Yacht, “La Reine des Belges”</li>
        <li>Officers of State, and Privileged Persons</li>
        <li>The Royal Group (See Vignette page 10)*</li>
        <li>Carabiniers à Cheval</li>
        <li>Royal Tent</li>
        <li>Royal Carriage</li>
        <li>Small Battery</li>
        <li>The West Pier</li>
        <li>State Carriage</li>
        <li>Landing Place</li>
        <li>Lord Adolphus Fitzclarence and Lord Aberdeen</li>
        <li>Queen's Barge</li>
        <li>Officers' Landing</li>
        <li>Cyclops</li>
        <li>Lighthouse</li>
        <li>Tartarus</li>
        <li>Victoria and Albert</li>
        <li>Pluton</li>
        <li>Ariel</li>
        <li>St. Vincent, 120 Guns</li>
        <li>Belgic Brig</li>
        <li>Archimede</li>
        <li>Mail</li>
        <li>Prometheus</li>
        <li>Napoleon</li>
        <li>Cayeux</li>
        <li>Ault</li>
        <li>East Cliff</li>
        <li>Mers</li>
        <li>South Pier</li>
        <li>King's Dock yard</li>
      </ol>
      <p>* The "Vignette" pages are not available from the British Museum online archive.</p>
      <img src="/public/1886,0111.23.2.jpg">
      <small>1886,0111.23.2</small>
    </div>
  </div>
</template>

<style scoped>
#info * {
  -webkit-touch-callout: revert;
  -webkit-user-select: text;
  -moz-user-select: revert;
  -ms-user-select: revert;
  user-select: text;
  color: rgba(255,255,255,0.75);
}

#info li, #info h1, #info p {
  @apply font-serif;
}

#info a {
  @apply underline;
}

#info ol {
  @apply list-decimal pl-8;
}

#info li {
  @apply leading-tight;
}

#info li + li {
  @apply pt-1;
}

</style>