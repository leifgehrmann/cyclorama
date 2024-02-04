<template>
  <div
      class="
    text-white
    flex
    flex-col
    space-y-2
    "
  >
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
            v-if="!showInfo"
            src="../assets/show-info-inactive.svg"
            aria-hidden="true"
            alt="Info is hidden"
        >
        <img
            v-else
            src="../assets/show-info-active.svg"
            aria-hidden="true"
            alt="Info is displayed"
        >
      </button>
    </div>
    <div
        class="
      bg-neutral-800 bg-opacity-70
      flex
      flex-col
      backdrop-filter backdrop-blur-xl
      rounded-xl
      text-center
      shadow-lg
      "
    >
      <button
          ref="zoomIn"
          type="button"
          tabindex="4"
          class="
        px-3 py-3
        w-12 h-12
        rounded-t-xl
        group
        text-2xl
        font-medium
        text-center
        leading-[0rem]
        "
          aria-label="Zoom in"
          title="Zoom in"
      >
        &plus;
      </button>
      <button
          ref="zoomOut"
          type="button"
          tabindex="4"
          class="
        px-3 py-3
        w-12 h-12
        rounded-b-xl
        group
        text-2xl
        font-medium
        text-center
        leading-[0rem]
        "
          aria-label="Zoom out"
          title="Zoom out"
      >
        &minus;
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, onMounted, ref} from "vue";
defineProps<{
  showInfo: boolean,
}>()
const emit = defineEmits(['toggleInfo', 'zoomUpdate'])
const zoomIn = ref(null as null | HTMLButtonElement)
const zoomOut = ref(null as null | HTMLButtonElement)

onMounted(() => {
  if (zoomIn.value === null || zoomOut.value === null) {
    return;
  }
  zoomIn.value.addEventListener('touchstart', (e: TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    emit('zoomUpdate', [1])
  })
  zoomIn.value.addEventListener('mousedown', (e) => {
    if (e.button !== 0) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    emit('zoomUpdate', [1])
  })

  zoomOut.value.addEventListener('touchstart', (e: TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    emit('zoomUpdate', [-1])
  })
  zoomOut.value.addEventListener('mousedown', (e) => {
    if (e.button !== 0) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    emit('zoomUpdate', [-1])
  })

  zoomIn.value.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    emit('zoomUpdate', [10])
    requestAnimationFrame(() => {
      emit('zoomUpdate', [0])
    })
  })

  zoomOut.value.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    emit('zoomUpdate', [-10])
    requestAnimationFrame(() => {
      emit('zoomUpdate', [0])
    })
  })

  function clearPress() {
    emit('zoomUpdate', [0])
  }

  window.addEventListener('mouseleave', clearPress)
  window.addEventListener('mouseup', clearPress)
  window.addEventListener('touchend', clearPress)
  window.addEventListener('touchcancel', clearPress)
});
</script>

<style scoped>

</style>