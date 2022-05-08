export default {
  head: {
    title: 'client',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  buildModules: ['nuxt-webpack-optimisations', '@nuxt/typescript-build', '@nuxtjs/tailwindcss', '@nuxtjs/moment'],

  moment: {
    locales: ['ru'],
    timezone: true,
    defaultTimezone: 'Europe/Moscow',
  },

  env: {
    // адрес, по которому будет работать серверное приложение
    apiUrl: process.env.API_URL || 'http://localhost:3000',
  },

  // для одновременной работы серверного и клиентского
  // приложения требуется использовать разный порт
  server: {
    port: 3001,
  },

  modules: [
    '@nuxtjs/axios',
    // необходимо добавить данную строку
    '@nuxtjs/auth-next',
  ],

  auth: {
    redirect: {
      login: '/account/login',
      logout: '/account/login',
      callback: '/account/login',
      home: '/',
    },
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'access_token',
          // срок истечения токена должен быть
          // идентичен на сервере (5 минут)
          maxAge: 60 * 5,
          global: true,
          type: 'Bearer',
        },
        refreshToken: {
          property: 'refresh_token',
          // срок истечения токена должен быть
          // идентичен на сервере (30 дней)
          maxAge: 60 * 60 * 24 * 30,
        },
        user: {
          // сохраняет информацию о пользователе,
          // которую вернул адрес `/auth/user`
          property: false,
        },
        endpoints: {
          login: { url: 'http://localhost:3000/auth/login', method: 'post' },
          refresh: { url: 'http://localhost:3000/auth/refresh', method: 'post' },
          user: { url: 'http://localhost:3000/auth/me', method: 'get' },
          logout: { url: 'http://localhost:3000/auth/logout', method: 'post' },
        },
      },
    },
  },

  css: ['@/assets/global.scss'],
  plugins: [{ src: '@/plugins/vue-select.js', ssr: true }],
  components: true,
  axios: {
    baseURL: '/',
  },

  build: {},
}
