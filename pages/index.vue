<template>
  <IndexStaff
    v-if="$auth.user.role.permisions && ($auth.user.role.permisions.includes('teacher') || $auth.user.role.permisions.includes('panel.admin'))"
  />
  <IndexUser v-else />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'MainPage',
  middleware: ['auth', 'approved'],
  head() {
    return {
      title: 'Главная страница',
    }
  },
})
</script>
