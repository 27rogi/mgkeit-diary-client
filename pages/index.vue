<template>
  <Loading :fetch-state="$fetchState">
    <div slot="content" class="account">
      <p v-if="awaiting && awaiting.length > 0" class="info info__warning">Подтверждения ожидают {{ awaiting.length }} аккаунт(а)(ов)</p>
    </div>
  </Loading>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'MainPage',
  data() {
    return {
      awaiting: null,
    }
  },
  async fetch() {
    this.awaiting = await this.$axios
      .$get(process.env.apiUrl + `/users/awaiting?limit=9999`)
      .catch((err) => {
        throw new Error(err.response.status)
      })
      .then((res) => res.items)
  },
  head() {
    return {
      title: 'Главная страница',
    }
  },
})
</script>
