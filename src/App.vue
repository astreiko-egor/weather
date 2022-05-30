<template>
  <section-weather />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
const SectionWeather = defineAsyncComponent(
  () => import('@/components/SectionWeather/SectionWeather.vue')
);
</script>

<style lang="scss"></style>
