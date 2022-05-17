<template>
  <div>
    <template v-if="$props.fetchState.pending">
      <transition name="slide-fade" mode="out-in">
        <div class="loading">
          <div class="loading--image">
            <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="a" x1="8.042%" y1="0%" x2="65.682%" y2="23.865%">
                  <stop stop-color="#fff" stop-opacity="0" offset="0%" />
                  <stop stop-color="#fff" stop-opacity=".631" offset="63.146%" />
                  <stop stop-color="#fff" offset="100%" />
                </linearGradient>
              </defs>
              <g fill="none" fill-rule="evenodd">
                <g transform="translate(1 1)">
                  <path id="Oval-2" d="M36 18c0-9.94-8.06-18-18-18" stroke="url(#a)" stroke-width="2">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 18 18"
                      to="360 18 18"
                      dur="0.9s"
                      repeatCount="indefinite"
                    />
                  </path>
                  <circle fill="#fff" cx="36" cy="18" r="1">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 18 18"
                      to="360 18 18"
                      dur="0.9s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </transition>
    </template>
    <div v-else-if="$props.fetchState.error" class="loading loading__error">
      <div class="error-container">
        <h1>Упс, ошибка при загрузке!</h1>
        <div v-if="$props.fetchState.error.message == 403" class="error-container--message">
          <p><b>Ошибка 403</b>. У вас отсутствуют необходимые права для доступа к странице.</p>
        </div>
        <div v-if="$props.fetchState.error.message == 400" class="error-container--message">
          <p>
            <b>Ошибка 400</b>. Возникла проблема при проверке введенной информации на сервере, возможно, некоторые данные введены неверно или у
            вас нет прав доступа.
          </p>
        </div>
        <div v-if="$props.fetchState.error.message == 404" class="error-container--message">
          <p><b>Ошибка 404</b>. Невозможно найти требуемые данные или страницу.</p>
        </div>
        <div v-if="$props.fetchState.error.message == 500" class="error-container--message">
          <p><b>Ошибка 500</b>. Возникла проблема на стороне сервера, возможно, будет необходимо подождать определенное количество времени.</p>
        </div>
        <slot name="error" />
        <div class="flex flex-row gap-2 mt-4">
          <button type="button" class="button" @click.prevent="$router.app.refresh()">Попробовать еще раз</button>
          <button type="button" class="button button__hollow" @click.prevent="$router.push(-1)">Назад</button>
        </div>
      </div>
    </div>
    <div v-else-if="isReady">
      <slot name="content" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LoadingComponent',
  props: {
    fetchState: {
      type: Object,
      required: true,
    },
    isReady: {
      type: Boolean,
      default: true,
    },
  },
})
</script>

<style lang="scss">
.loading {
  @apply overflow-hidden w-full h-full flex flex-col items-center justify-center z-30 absolute inset-0 text-bg-50;
  .loading--image {
    @apply p-6 rounded-xl bg-bg-700 shadow-xl shadow-bg-900/30;
  }
  .error-container {
    @apply w-full max-w-2xl flex flex-col gap-2 p-6 rounded-xl bg-bg-700 shadow-xl shadow-bg-900/30;
    h1 {
      @apply text-white text-3xl font-semibold;
    }
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
}
</style>
