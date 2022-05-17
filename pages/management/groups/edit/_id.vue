<template>
  <Loading :fetch-state="$fetchState">
    <form v-if="teachers" slot="content" class="editor" @submit.prevent="save">
      <template v-if="response">
        <div v-if="response.status == 403" class="editor--error">
          <p>У вас недостаточно прав для выполнения данного действия!</p>
        </div>
      </template>
      <h1 class="editor--title">Изменение <span>группы</span></h1>
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
              <p>{{ option.fio }} <span v-if="option.teacherInfo">(учитель)</span></p>
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
      data: null,
      teachers: null,
    }
  },
  async fetch() {
    await Promise.all([
      this.$axios.$get(process.env.apiUrl + `/groups/${this.$route.params.id}`),
      this.$axios.$get(process.env.apiUrl + `/users?limit=9999`),
    ])
      .catch((err) => {
        throw new Error(err.response.status)
      })
      .then((res) => {
        this.$data.data = res[0]
        this.$data.data.creationDate = this.$moment(res[0].creationDate).format('YYYY-MM-DD')
        this.$data.teachers = res[1].items
      })
  },
  meta: {
    permissions: ['groups.manage'],
  },
  methods: {
    async save() {
      const { name, owner, creationDate } = this.data
      this.$data.response = await this.$axios
        .$patch(process.env.apiUrl + `/groups/${this.$route.params.id}`, { name, owner, creationDate })
        .catch((err) => err.response)

      if (this.$data.response.groupId) {
        this.$router.push('/management/groups')
      }
    },
  },
})
</script>
