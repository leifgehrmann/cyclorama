<script setup lang="ts">
import {defineProps} from "vue";

defineProps<{
  url: string,
  identifier: string,
  license: string,
  entity: string,
}>()
</script>

<template>
  <p class="text-center text-sm"><a :href="url" class="font-mono">{{identifier}}</a>, {{license}},<br>from <span style="font-variant-caps: small-caps">{{entity}}</span>.</p>
</template>

<style scoped>

</style>