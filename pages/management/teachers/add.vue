<template>
  <Loading :fetch-state="$fetchState">
    <form v-if="teacher || teachers" slot="content" class="editor" @submit.prevent="add">
      <template v-if="response">
        <div v-if="response.status == 403" class="editor--error">
          <p>У вас недостаточно прав для выполнения данного действия!</p>
        </div>
      </template>
      <h1 class="editor--title">Добавление <span>данных учителя</span></h1>
      <div class="editor--section">
        <p class="section--title">Учитель</p>
        <VueSelect
          id="teacher_select"
          v-model="data.teacher"
          :clearable="false"
          label="fio"
          :options="teachers"
          :reduce="(teacher) => teacher.userId"
          :selectable="(teacher) => teacher.teacherInfo === null"
          required
        ></VueSelect>
      </div>
      <div class="editor--section">
        <p class="section--title">Специальность</p>
        <input v-model="data.specialty" required class="input" type="text" placeholder="Математик" />
      </div>
      <div class="editor--section">
        <p class="section--title">Дата начала работы</p>
        <input v-model="data.workStartDate" required class="input" type="date" />
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
  data() {
    return {
      response: null,
      teachers: null,
      teacher: null,
      data: {
        teacher: null,
        specialty: null,
        workStartDate: null,
      },
    }
  },
  async fetch() {
    this.$data.teachers = await this.$axios
      .$get(process.env.apiUrl + `/users/teachers`)
      .catch((err) => {
        throw new Error(err.response.status)
      })
      .then((res) => res.items)

    if (this.$route.query.id) {
      const teacher = await this.$axios.$get(process.env.apiUrl + `/users/${this.$route.query.id}`).catch((err) => {
        throw new Error(err.response.status)
      })

      teacher.workStartDate = this.$moment(teacher.workStartDate).format('YYYY-MM-DD')
      this.$data.teacher = teacher
      this.$data.data.teacher = teacher.userId
    }
  },
  methods: {
    async add() {
      const { teacher, specialty, workStartDate } = this.$data.data
      this.$data.response = await this.$axios
        .$post(process.env.apiUrl + `/teacherInfos`, { teacher, specialty, workStartDate })
        .catch((err) => err.response)

      if (this.$data.response.teacher) {
        this.$router.push('/management/teachers')
      }
    },
  },
})
</script>
