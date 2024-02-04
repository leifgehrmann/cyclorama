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
import {onMounted, ref, defineEmits, defineProps} from "vue";
defineProps<{
  showInfo: boolean,
}>()
const emit = defineEmits(['toggleInfo', 'zoomUpdate'])
//
//  props: {
//    showLabels: {
//      type: Boolean,
//      required: true,
//    },
//    showCompare: {
//      type: Boolean,
//      required: true,
//    },
//  },
//  emits: [
//    'update:showLabels',
//    'update:showCompare',
//  ],
//  data: () => ({
//    mountedShowLabels: false,
//    mountedShowCompare: false,
//  }),
//  watch: {
//    mountedShowLabels(): void {
//      this.$emit('update:showLabels', this.mountedShowLabels);
//    },
//    mountedShowCompare(): void {
//      this.$emit('update:showCompare', this.mountedShowCompare);
//    },
//  },
//  mounted(): void {
//    this.mountedShowLabels = this.showLabels;
//    this.mountedShowCompare = this.showCompare;
//  },
//});
</script>

<style scoped>

</style>