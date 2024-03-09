<script setup lang="ts">
import {defineProps} from "vue";

defineProps<{
  url?: string,
  identifier?: string,
  license: string,
  licenseUrl?: string,
  entity: string,
}>()
</script>

<template>
  <p class="text-center text-sm">
    <span v-if="url !== undefined"><a :href="url" class="font-mono">{{identifier}}</a>, </span>
    <span v-else-if="identifier !== undefined"><span class="font-mono">{{identifier}}</span>, </span>
    <a v-if="licenseUrl !== undefined" :href="licenseUrl">{{license}}</a><span v-else>{{license}}</span>,
    <br>from <span style="font-variant-caps: small-caps;" v-html="entity"/>.
  </p>
</template>

<style scoped>

</style>