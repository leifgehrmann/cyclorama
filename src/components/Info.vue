<script setup lang="ts">
import {DefineComponent, defineEmits, defineProps, onMounted, ref} from "vue";

const props = defineProps<{
  infoComponent: DefineComponent,
}>()
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
    <div class="lg:hidden absolute top-0 right-0 p-4">
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
    <div class="p-4 pt-24 lg:pt-10 select-text grid gap-4 max-w-[25rem] m-auto"
    >
      <component :is="props.infoComponent"></component>
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

#info li, #info h1, #info h2, #info p, #info details {
  @apply font-serif;
}

#info p {
  @apply rounded;
}

#info a, #info a > * {
  @apply text-indigo-400;
}

#info p:target {
  @apply bg-indigo-500/30 ring-8 ring-indigo-500/30;
}

#info ol {
  @apply list-decimal pl-8;
}

#info ul {
  @apply list-disc pl-8;
}

#info li {
  @apply leading-tight;
}

#info li + li {
  @apply pt-1;
}

#info hr {
  @apply h-0.5 my-4 border-0 bg-white/80 rounded-full;
}

#info img {
  @apply rounded-sm opacity-85;
}

#info details {
  @apply overflow-x-scroll;
}

#info summary {
  @apply px-4 py-3 bg-white/10 rounded-xl mb-2 cursor-pointer;
}

#info pre {
  @apply text-xs;
}

</style>