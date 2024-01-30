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
        group
        "
          aria-label="Toggle labels"
          title="Toggle labels"
      >
        <img
            v-if="false"
            src="../assets/show-labels-active.svg"
            alt="Labels are enabled"
            aria-hidden="true"
        >
        <img
            v-else
            src="../assets/show-labels-inactive.svg"
            alt="labels are disabled"
            aria-hidden="true"
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
        group
        text-2xl
        font-medium
        text-center
        leading-[0rem]
        "
          aria-label="Toggle labels"
          title="Toggle labels"
      >
        &plus;
      </button>
      <button
          type="button"
          tabindex="4"
          class="
        px-3 py-3
        w-12 h-12
        group
        text-2xl
        font-medium
        text-center
        leading-[0rem]
        "
          aria-label="Toggle labels"
          title="Toggle labels"
      >
        &minus;
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
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