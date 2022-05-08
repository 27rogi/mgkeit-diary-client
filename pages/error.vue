<template>
  <div class="error-wrapper">
    <div v-if="$route.query.type === 'permissions'" class="error error__permissions">
      <h1>Недостаточно прав для просмотра данной страницы!</h1>
      <p>Отсутствующие права: {{ $route.query.required }}</p>
      <nuxt-link to="/" class="button">На главную страницу</nuxt-link>
    </div>
    <div v-else-if="$route.query.type === 'not_approved'" class="error error__approval">
      <h1>Аккаунт ожидает одобрения.</h1>
      <p>Ваш аккаунт должен быть подтвержден администратором в течении нескольких дней.</p>
      <nuxt-link to="/account/logout" class="button">Выйти из аккаунта</nuxt-link>
    </div>
    <div v-else-if="$route.query.type === 'no_id'" class="error error__approval">
      <h1>Не указан правильный номер.</h1>
      <p>Вы пытались получить доступ к объекту, но его номер не был указан или указан неправильно.</p>
      <nuxt-link :to="$route.query.link" class="button">Вернуться обратно</nuxt-link>
    </div>
    <div v-else class="error error__unknown">
      <h1>Неопознанная ошибка.</h1>
      <p>Возможно вы оказались здесь по случайности, <nuxt-link to="/">вернитесь на главную страницу</nuxt-link>.</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ErrorPage',
  layout: 'unauthorized',
})
</script>

<style lang="scss">
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
