<template>
  <Loading :fetch-state="$fetchState">
    <form v-if="data" slot="content" class="editor" @submit.prevent="del">
      <template v-if="response">
        <div v-if="response.status == 403" class="editor--error">
          <p>У вас недостаточно прав для выполнения данного действия!</p>
        </div>
      </template>
      <h1 class="editor--title">Подтвердите удаление</h1>
      <div class="editor--actions">
        <button type="submit" class="button button__action">Удалить</button>
        <button class="button button__hollow" @click.prevent="$router.back()">Отмена</button>
      </div>
    </form>
  </Loading>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'EditTeacher',
  middleware: ['auth', 'approved', 'permissions'],
  data() {
    return {
      response: null,
      data: null,
    }
  },
  meta: {
    permissions: ['schedules.manage'],
  },
  async fetch() {
    const data = await this.$axios.$get(process.env.apiUrl + `/schedules/${this.$route.params.id}`).catch((err) => {
      throw new Error(err.response.status)
    })

    this.$data.data = data
  },
  methods: {
    async del() {
      this.$data.response = await this.$axios.$delete(process.env.apiUrl + `/schedules/${this.$route.params.id}`).catch((err) => err.response)

      if (this.$data.response.scheduleId) {
        this.$router.push('/management/schedules')
      }
    },
  },
})
</script>
