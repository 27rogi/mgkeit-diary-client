<template>
  <Loading :fetch-state="$fetchState">
    <form v-if="data" slot="content" class="editor" @submit.prevent="save">
      <template v-if="response">
        <div v-if="response.status == 403" class="editor--error">
          <p>У вас недостаточно прав для выполнения данного действия!</p>
        </div>
      </template>
      <h1 class="editor--title">
        Редактирование <span>{{ data.teacher.fio }}</span>
      </h1>
      <div class="editor--section">
        <p class="section--title">Специальность</p>
        <input v-model="data.specialty" required class="input" type="text" placeholder="Математик" />
      </div>
      <div class="editor--section">
        <p class="section--title">Дата начала работы</p>
        <input v-model="data.workStartDate" required class="input" type="date" />
      </div>
      <div class="editor--actions">
        <button type="submit" class="button button__action">Сохранить</button>
        <button class="button button__hollow" @click.prevent="$router.back()">Отмена</button>
      </div>
    </form>
  </Loading>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'EditTeacher',
  data() {
    return {
      response: null,
      data: null,
    }
  },
  async fetch() {
    const data = await this.$axios.$get(process.env.apiUrl + `/teacherInfos/${this.$route.params.id}`).catch((err) => {
      throw new Error(err.response.status)
    })

    data.workStartDate = this.$moment(data.workStartDate).format('YYYY-MM-DD')
    this.$data.data = data
  },
  methods: {
    async save() {
      const { specialty, workStartDate } = this.$data.data
      this.$data.response = await this.$axios
        .$patch(process.env.apiUrl + `/teacherInfos/${this.$route.params.id}`, { specialty, workStartDate })
        .catch((err) => err.response)

      if (this.$data.response.teacher) {
        this.$router.push('/management/teachers')
      }
    },
  },
})
</script>
