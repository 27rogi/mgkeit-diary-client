<template>
  <Loading :fetch-state="$fetchState">
    <form v-if="data" slot="content" class="editor" @submit.prevent="save">
      <template v-if="response">
        <div v-if="response.status == 403" class="editor--error">
          <p>У вас недостаточно прав для выполнения данного действия!</p>
        </div>
      </template>
      <h1 class="editor--title">Изменение <span>домашнего задания</span></h1>
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
        <p class="section--title">Учитель</p>
        <VueSelect
          id="teacher_select"
          v-model="data.teacher"
          :clearable="false"
          label="fio"
          :options="results.teachers"
          :reduce="(teacher) => teacher.userId"
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
        <p class="section--title">Группа</p>
        <VueSelect
          id="teacher_select"
          v-model="data.group"
          :clearable="false"
          label="name"
          :options="results.groups"
          :reduce="(group) => group.groupId"
          required
        ></VueSelect>
      </div>
      <div class="editor--section">
        <p class="section--title">Задание</p>
        <textarea id="name" v-model="data.mission" type="text" class="input" required placeholder="Сделать упражнение №102 на странице 23..." />
      </div>
      <div class="editor--section">
        <p class="section--title">Дополнительные материалы</p>
        <textarea id="name" v-model="data.material" type="text" class="input" required placeholder="Учебник Математика Леонид М. Р..." />
      </div>
      <div class="editor--section">
        <p class="section--title">Время сдачи</p>
        <input id="name" v-model="data.deadline" type="date" class="input" required />
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
      results: {
        subjects: null,
        groups: null,
        teachers: null,
      },
    }
  },
  meta: {
    permissions: ['homeworks.manage'],
  },
  async fetch() {
    await Promise.all([
      this.$axios.$get(process.env.apiUrl + `/homeworks/${this.$route.params.id}`),
      this.$axios.$get(process.env.apiUrl + `/subjects?limit=9999`),
      this.$axios.$get(process.env.apiUrl + `/groups?limit=9999`),
      this.$axios.$get(process.env.apiUrl + `/users/teachers?limit=9999`),
    ])
      .catch((err) => {
        throw new Error(err.response.status)
      })
      .then((res) => {
        this.$data.data = res[0]
        this.$data.data.deadline = this.$moment(this.$data.data.deadline).format('YYYY-MM-DD')
        this.$data.results.subjects = res[1].items
        this.$data.results.groups = res[2].items
        this.$data.results.teachers = res[3].items
      })
  },
  methods: {
    async save() {
      const { subject, mission, material, deadline, teacher, group } = this.data
      this.$data.response = await this.$axios
        .$patch(process.env.apiUrl + `/homeworks/${this.$route.params.id}`, { subject, mission, material, deadline, teacher, group })
        .catch((err) => err.response)

      if (this.$data.response.homeworkId) {
        this.$router.push('/management/homeworks')
      }
    },
  },
})
</script>
