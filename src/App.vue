<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavHeader from './components/NavHeader.vue'
</script>

<template>
  <div>
    <NavHeader />
    <div class="container">
      <RouterView />
    </div>
  </div>
</template>
