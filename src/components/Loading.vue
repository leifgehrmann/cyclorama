<script setup lang="ts">
import {defineProps} from "vue";

defineProps<{
  progress: number,
}>()

const transformToWidth = (progress: number): number => {
  const bound = Math.max(0, Math.min(1, progress));
  return (Math.sin((bound * Math.PI) - (Math.PI / 2)) + 1) / 2 * 200 + 0.01;
}
</script>

<template>
  <svg width="200" height="200">
    <defs>
      <linearGradient id="shimmer" x1="0" x2="1" y1="1" y2="1">
        <stop offset="-0.5" stop-color="#FFFFFF10">
          <animate attributeName="offset" from="-0.5" to="2" dur="2500ms" repeatCount="indefinite" />
        </stop>
        <stop offset="-0.35" stop-color="#FFFFFF1C">
          <animate attributeName="offset" from="-0.35" to="2.15" dur="2500ms" repeatCount="indefinite" />
        </stop>
        <stop offset="-0.25" stop-color="#FFFFFF24">
          <animate attributeName="offset" from="-0.25" to="2.25" dur="2500ms" repeatCount="indefinite" />
        </stop>
        <stop offset="-0.15" stop-color="#FFFFFF1C">
          <animate attributeName="offset" from="-0.15" to="2.25" dur="2500ms" repeatCount="indefinite" />
        </stop>
        <stop offset="0" stop-color="#FFFFFF10">
          <animate attributeName="offset" from="0" to="2.5" dur="2500ms" repeatCount="indefinite" />
        </stop>
      </linearGradient>
    </defs>
    <mask id="panorama">
      <path
          d="
            M-20,0
            A 100 30 0 1 0 220,0
            L220,150
            A 100 30 0 1 0 -20,150
            Z"
          fill="white" />
    </mask>
    <rect ref="rect" x="0" y="0" :width="transformToWidth(progress)" height="200" fill="#FFFFFF80" mask="url(#panorama)" />
    <rect ref="rect" x="0" y="0" width="200" height="200" fill="url(#shimmer)" mask="url(#panorama)" />
  </svg>
</template>

<style scoped>
p {
  font-family: serif;
  color: white;
}
</style>