<script setup lang="ts">
import { useColourStore } from '@/stores/colours';

const colourStore = useColourStore();
</script>

<template>
  <input
    type="file"
    @change="colourStore.readFile"
  />
</template>
