<template>
  <Loading :fetch-state="$fetchState">
    <div id="index-user" slot="content">
      <p>hi</p>
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
      .$get(process.env.apiUrl + `/groups?limit=9999`)
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
