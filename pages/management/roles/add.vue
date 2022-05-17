<template>
  <form class="editor" @submit.prevent="add">
    <template v-if="response">
      <div v-if="response.status == 403" class="editor--error">
        <p>У вас недостаточно прав для выполнения данного действия!</p>
      </div>
    </template>
    <h1 class="editor--title">Добавление <span>роли</span></h1>
    <div class="editor--section">
      <p class="section--title">Название</p>
      <input id="name" v-model="data.name" type="text" class="input" required placeholder="Учитель" />
    </div>
    <div class="editor--section">
      <p class="section--title">Права роли</p>
      <VueSelect
        id="role_permissions"
        v-model="data.permissions"
        :no-drop="true"
        taggable
        multiple
        push-tags
        :clearable="true"
        label="permissions"
        required
      >
      </VueSelect>
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
  data() {
    return {
      response: null,
      data: {
        name: null,
        permissions: [],
      },
    }
  },
  meta: {
    permissions: ['roles.manage'],
  },
  methods: {
    async add() {
      this.$data.response = await this.$axios.$post(process.env.apiUrl + `/roles`, this.data).catch((err) => err.response)

      if (this.$data.response.roleId) {
        this.$router.push('/management/roles')
      }
    },
  },
})
</script>
