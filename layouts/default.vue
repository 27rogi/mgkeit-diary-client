<template>
  <div>
    <Navbar />
    <Nuxt />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DefaultLayout',
  middleware: ['auth', 'approved'],
  auth: true,
})
</script>
