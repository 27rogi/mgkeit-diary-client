<template>
  <div class="auth-container">
    <div class="auth">
      <h1>Подтвердите выход из аккаунта</h1>
      <div class="auth--actions">
        <button class="w-full button button__action" @click.prevent="logout">Подтверждаю</button>
        <nuxt-link to="/" class="w-full button" @click="logout">Отменить</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LogoutPage',
  layout: 'unauthorized',
  middleware: ['auth'],
  auth: true,
  head() {
    return {
      title: 'Выход',
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
    },
  },
})
</script>
