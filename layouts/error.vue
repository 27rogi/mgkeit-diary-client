<template>
  <div class="error-wrapper">
    <div v-if="error.statusCode === 404" class="error error__permissions">
      <h1>Такой страницы не существует!</h1>
      <p>Похоже вы пытаетесь открыть страницу, которой у нас нет :(</p>
      <nuxt-link to="/" class="button">На главную</nuxt-link>
    </div>
    <div v-else class="error error__permissions">
      <h1>Ошибка!</h1>
      <p>Произошла ошибка, свяжитесь с администратором и покажите ему сообщение ниже.</p>
      <p>{{ error }}</p>
      <nuxt-link to="/" class="button">На главную</nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ErrorPage',
  layout: 'unauthorized',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
})
</script>

<style lang="scss" scoped>
.error-wrapper {
  @apply h-screen flex flex-col justify-center items-center;
  .error {
    @apply flex flex-col gap-2 bg-bg-700 p-4 rounded-xl text-xl;
    h1 {
      @apply font-bold leading-normal text-3xl;
    }
  }
}
</style>
