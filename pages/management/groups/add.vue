<template>
  <Loading :fetch-state="$fetchState">
    <form v-if="teachers" slot="content" class="editor" @submit.prevent="add">
      <template v-if="response">
        <div v-if="response.status == 403" class="editor--error">
          <p>У вас недостаточно прав для выполнения данного действия!</p>
        </div>
      </template>
      <h1 class="editor--title">Добавление <span>группы</span></h1>
      <div class="editor--section">
        <p class="section--title">Название</p>
        <input id="name" v-model="data.name" type="text" class="input" required placeholder="3ИП-11-19" />
      </div>
      <div class="editor--section">
        <p class="section--title">Куратор</p>
        <VueSelect
          id="teacher_select"
          v-model="data.owner"
          :clearable="false"
          label="fio"
          :options="teachers"
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
        <p class="section--title">Дата начала обучения</p>
        <input id="name" v-model="data.creationDate" type="date" class="input" required />
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
        name: null,
        owner: null,
        creationDate: null,
      },
      teachers: null,
    }
  },
  meta: {
    permissions: ['groups.manage'],
  },
  async fetch() {
    this.$data.teachers = await this.$axios
      .$get(process.env.apiUrl + `/users/teachers`)
      .catch((err) => err.response)
      .then((res) => res.items)
  },
  methods: {
    async add() {
      this.$data.response = await this.$axios.$post(process.env.apiUrl + `/groups`, this.data).catch((err) => err.response)

      if (this.$data.response.groupId) {
        this.$router.push('/management/groups')
      }
    },
  },
})
</script>
