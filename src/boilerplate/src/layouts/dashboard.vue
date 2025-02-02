<script setup lang="ts">

import Header from '@activities/App/Header.vue'
import NavigationLeft from '@activities/App/NavigationLeft.vue'

</script>

<template>
  <div class="layout-dashboard">
    <Header />
    <NavigationLeft />

    <div class="app-body">
      <slot />
    </div>

  </div>
</template>

<style>
@import "@activities/App/styles.scss";
</style>
<style lang="scss">

.layout-dashboard {
  flex: 1;

  .app-body {
    flex: 1;
  }
}

</style>
