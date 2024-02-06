<script setup lang="ts">
import {defineEmits, onMounted, ref} from "vue";
import Treport from "./explanations/Treport.vue";
import Elba from "./explanations/Elba.vue";
import LondonBarker from "./explanations/LondonBarker.vue";
import CaltonHill from "./explanations/CaltonHill.vue";

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
    <div class="p-4 pt-24 md:pt-10 select-text grid gap-4 max-w-[25rem] m-auto"
    >
<!--      <Treport/>-->
<!--      <Elba/>-->
<!--      <LondonBarker/>-->
      <CaltonHill/>
    </div>
  </div>
</template>

<style>
#info * {
  -webkit-touch-callout: default;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
  color: rgba(255,255,255,0.75);
}

#info li, #info h1, #info h2, #info p {
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

#info hr {
  @apply h-0.5 border-0 bg-white/80 rounded-full;
}

#info img {
  @apply rounded-sm opacity-85;
}

</style>