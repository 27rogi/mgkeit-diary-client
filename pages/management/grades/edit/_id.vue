<template>
  <Loading :fetch-state="$fetchState">
    <form slot="content" class="editor" @submit.prevent="add">
      <template v-if="response">
        <div v-if="response.status == 403" class="editor--error">
          <p>У вас недостаточно прав для выполнения данного действия!</p>
        </div>
      </template>
      <h1 class="editor--title">Добавление <span>оценки</span></h1>
      <div class="editor--section">
        <p class="section--title">Ученик</p>
        <VueSelect
          id="teacher_select"
          v-model="data.student"
          :clearable="false"
          label="fio"
          :options="students"
          :reduce="(user) => user.userId"
          :selectable="(user) => !user.role.permissions.includes('teacher')"
          required
        >
          <template #option="option">
            <div class="input--user">
              <Avatar :width="32" :name="option.fio" :unique-code="option.userId" :bg-color="option.userId.substr(option.userId.length - 3)" />
              <p>{{ option.fio }}</p>
            </div>
          </template>
          <template #selected-option="option">
            <div class="input--user">
              <Avatar :width="32" :name="option.fio" :unique-code="option.userId" :bg-color="option.userId.substr(option.userId.length - 3)" />
              <p>{{ option.fio }}</p>
            </div>
          </template>
        </VueSelect>
      </div>
      <div class="editor--section">
        <p class="section--title">Преподаватель</p>
        <VueSelect
          id="teacher_select"
          v-model="data.teacher"
          :clearable="false"
          label="fio"
          :options="teachers"
          :reduce="(user) => user.userId"
          required
        >
          <template #option="option">
            <div class="input--user">
              <Avatar :width="32" :name="option.fio" :unique-code="option.userId" :bg-color="option.userId.substr(option.userId.length - 3)" />
              <p>{{ option.fio }}</p>
            </div>
          </template>
          <template #selected-option="option">
            <div class="input--user">
              <Avatar :width="32" :name="option.fio" :unique-code="option.userId" :bg-color="option.userId.substr(option.userId.length - 3)" />
              <p>{{ option.fio }}</p>
            </div>
          </template>
        </VueSelect>
      </div>
      <div class="editor--section">
        <p class="section--title">Предмет</p>
        <VueSelect
          id="teacher_select"
          v-model="data.subject"
          :clearable="false"
          label="name"
          :options="results.subjects"
          :reduce="(subject) => subject.subjectId"
          required
        ></VueSelect>
      </div>
      <div class="editor--section">
        <p class="section--title">Причина</p>
        <textarea v-model="data.reason" name="reason" type="text" class="input" required placeholder="Выполнение работы на уроке" />
      </div>
      <div class="editor--section">
        <p class="section--title">Оценка</p>
        <input
          v-model="data.grade"
          name="reason"
          type="number"
          required
          min="1"
          max="5"
          class="input"
          placeholder="Выполнение работы на уроке"
        />
      </div>
      <div class="editor--section">
        <p class="section--title">Вес оценки</p>
        <input v-model="data.weight" name="reason" type="number" class="input" required placeholder="Выполнение работы на уроке" />
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
      data: {
        student: null,
        teacher: null,
        subject: null,
        reason: null,
        weight: null,
        grade: null,
      },
      results: {
        users: null,
        subjects: null,
      },
    }
  },
  meta: {
    permissions: ['grades.manage'],
  },
  async fetch() {
    await this.$axios
      .$get(process.env.apiUrl + `/grades/${this.$route.params.id}`)
      .catch((err) => err.response)
      .then((res) => {
        this.data.student = res.student.userId
        this.data.teacher = res.teacher.userId
        this.data.subject = res.subject.subjectId
        this.data.reason = res.reason
        this.data.weight = res.weight
        this.data.grade = res.grade
      })

    this.$data.results.users = await this.$axios
      .$get(process.env.apiUrl + `/users?limit=9999`)
      .catch((err) => err.response)
      .then((res) => res.items)

    this.$data.results.subjects = await this.$axios
      .$get(process.env.apiUrl + `/subjects?limit=9999`)
      .catch((err) => err.response)
      .then((res) => res.items)
  },
  computed: {
    teachers() {
      if (!this.$data.results.users) return null
      return this.$data.results.users.filter((user) => user.role.permissions.includes('teacher'))
    },
    students() {
      if (!this.$data.results.users) return null
      return this.$data.results.users.filter((user) => !user.role.permissions.includes('teacher'))
    },
  },
  methods: {
    async add() {
      this.$data.response = await this.$axios
        .$patch(process.env.apiUrl + `/grades/${this.$route.params.id}`, this.data)
        .catch((err) => err.response)

      if (this.$data.response.gradeId) {
        this.$router.push('/management/grades')
      }
    },
  },
})
</script>
