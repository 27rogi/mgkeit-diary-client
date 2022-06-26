<template>
  <Loading :fetch-state="$fetchState">
    <form v-if="data" slot="content" class="editor" @submit.prevent="save">
      <template v-if="response">
        <div v-if="response.status == 403" class="editor--error">
          <p>У вас недостаточно прав для выполнения данного действия!</p>
        </div>
      </template>
      <h1 class="editor--title">
        Редактирование <span>{{ data.fio }}</span>
      </h1>
      <div class="editor--section">
        <p class="section--title">Группа</p>
        <VueSelect
          id="group_select"
          v-model="data.group"
          :clearable="false"
          label="name"
          :options="groups"
          :reduce="(group) => group.groupId"
          required
        >
        </VueSelect>
      </div>
      <div class="editor--section">
        <p class="section--title">Роль</p>
        <p v-if="data.role == '6267c57f0f80e9f4646bb5bb'" class="info info__warning info__sm">Этот пользователь ожидает подтверждения!</p>
        <VueSelect
          id="role_select"
          v-model="data.role"
          :clearable="false"
          label="name"
          :options="roles"
          :reduce="(role) => role.roleId"
          required
        >
        </VueSelect>
      </div>
      <div class="editor--section">
        <p class="section--title">Место проживания</p>
        <input id="location" v-model="data.address" type="text" class="input" required />
      </div>
      <div class="editor--section">
        <p class="section--title">День рождения</p>
        <input v-model="data.birthday" required class="input" type="date" />
      </div>
      <div class="editor--section">
        <p class="section--title">Новый пароль</p>
        <input id="password" v-model="password" type="password" class="input" placeholder="Укажите новый пароль, если необходимо!" />
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
  middleware: ['auth', 'approved', 'permissions'],
  data() {
    return {
      response: null,
      data: null,
      password: null,
      groups: null,
      roles: null,
    }
  },
  meta: {
    permissions: ['users.manage'],
  },
  async fetch() {
    await Promise.all([
      this.$axios.$get(process.env.apiUrl + `/users/${this.$route.params.id}`),
      this.$axios.$get(process.env.apiUrl + `/groups?limit=9999`),
      this.$axios.$get(process.env.apiUrl + `/roles?limit=9999`),
    ])
      .catch((err) => {
        throw new Error(err.response.status)
      })
      .then((res) => {
        res[0].birthday = this.$moment(res[0].birthday).format('YYYY-MM-DD')
        this.$data.data = res[0]
        this.$data.groups = res[1].items
        this.$data.roles = res[2].items
      })
  },
  methods: {
    async save() {
      const { address, fio, role, group } = this.$data.data

      let newData = { address, fio, role, group: group.groupId }
      if (this.$data.password) {
        newData = await Object.defineProperty(newData, 'password', {
          value: this.$data.password,
          writable: true,
          configurable: true,
          enumerable: true,
        })
      }

      this.$data.response = await this.$axios
        .$patch(process.env.apiUrl + `/users/${this.$route.params.id}`, newData)
        .catch((err) => err.response)

      if (this.$data.response.userId) {
        this.$router.push('/management/users')
      }
    },
  },
})
</script>
