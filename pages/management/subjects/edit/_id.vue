<template>
  <Loading :fetch-state="$fetchState">
    <form v-if="data" slot="content" class="editor" @submit.prevent="save">
      <template v-if="response">
        <div v-if="response.status == 403" class="editor--error">
          <p>У вас недостаточно прав для выполнения данного действия!</p>
        </div>
      </template>
      <h1 class="editor--title">Изменение <span>предмета</span></h1>
      <div class="editor--section">
        <p class="section--title">Название</p>
        <input id="name" v-model="data.name" type="text" class="input" required placeholder="Математика" />
      </div>
      <div class="editor--actions">
        <button type="submit" class="button button__action">Добавить</button>
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
  async fetch() {
    const data = await this.$axios.$get(process.env.apiUrl + `/subjects/${this.$route.params.id}`).catch((err) => {
      throw new Error(err.response.status)
    })

    this.$data.data = data
  },
  meta: {
    permissions: ['subjects.manage'],
  },
  methods: {
    async save() {
      const { name } = this.data
      this.$data.response = await this.$axios
        .$patch(process.env.apiUrl + `/subjects/${this.$route.params.id}`, { name })
        .catch((err) => err.response)

      if (this.$data.response.subjectId) {
        this.$router.push('/management/subjects')
      }
    },
  },
})
</script>
