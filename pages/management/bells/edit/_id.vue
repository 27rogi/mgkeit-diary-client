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
        <p class="section--title">Время начала звонка</p>
        <input id="bell" v-model="data.startTime" type="time" class="input" required />
      </div>
      <div class="editor--section">
        <p class="section--title">Время окончания звонка</p>
        <input id="bell" v-model="data.endTime" type="time" class="input" required />
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
  meta: {
    permissions: ['bells.manage'],
  },
  async fetch() {
    const data = await this.$axios.$get(process.env.apiUrl + `/bells/${this.$route.params.id}`).catch((err) => {
      throw new Error(err.response.status)
    })

    this.$data.data = data
  },
  methods: {
    async save() {
      const { startTime, endTime } = this.data
      this.$data.response = await this.$axios
        .$patch(process.env.apiUrl + `/bells/${this.$route.params.id}`, { startTime, endTime })
        .catch((err) => err.response)

      if (this.$data.response.bellId) {
        this.$router.push('/management/bells')
      }
    },
  },
})
</script>
