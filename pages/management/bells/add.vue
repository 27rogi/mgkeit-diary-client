<template>
  <form class="editor" @submit.prevent="add">
    <template v-if="response">
      <div v-if="response.status == 403" class="editor--error">
        <p>У вас недостаточно прав для выполнения данного действия!</p>
      </div>
    </template>
    <h1 class="editor--title">Добавление <span>звонка</span></h1>
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
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'EditTeacher',
  middleware: ['auth', 'approved', 'permissions'],
  meta: {
    permissions: ['bells.manage'],
  },
  data() {
    return {
      response: null,
      data: {
        startTime: null,
        endTime: null,
      },
    }
  },
  methods: {
    async add() {
      this.$data.response = await this.$axios.$post(process.env.apiUrl + `/bells`, this.data).catch((err) => err.response)

      if (this.$data.response.bellId) {
        this.$router.push('/management/bells')
      }
    },
  },
})
</script>
