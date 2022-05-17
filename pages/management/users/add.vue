<template>
  <Loading :fetch-state="$fetchState">
    <form v-if="groups && roles" slot="content" class="editor" @submit.prevent="add">
      <template v-if="response">
        <div v-if="response.status == 403" class="editor--error">
          <p>У вас недостаточно прав для выполнения данного действия!</p>
        </div>
      </template>
      <h1 class="editor--title">Добавление <span>данных пользователя</span></h1>
      <div class="editor--section">
        <p class="section--title">ФИО</p>
        <input id="login" v-model="data.fio" type="text" class="input" required placeholder="Иванов Иван Иванович" />
      </div>
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
        <p class="text-lg text-bg-50/80 section--title">Улица</p>
        <input id="street" v-model="data.address.street" type="text" class="w-full input" required placeholder="Профсоюзная" />
        <div class="flex flex-row items-center gap-2">
          <div class="flex flex-col gap-1">
            <p class="text-lg text-bg-50/80 section--title">Номер дома</p>
            <input id="house" v-model="data.address.house" type="text" class="w-full input" required placeholder="21/2" />
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-lg text-bg-50/80 section--title">Этаж</p>
            <input id="floor" v-model="data.address.floor" type="number" class="w-full input" required placeholder="4" />
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-lg text-bg-50/80 section--title">Номер квартиры</p>
            <input id="apartament" v-model="data.address.apartament" type="number" class="w-full input" required placeholder="182" />
          </div>
        </div>
      </div>
      <div class="editor--section">
        <p class="section--title">День рождения</p>
        <input v-model="data.birthday" required class="input" type="date" />
      </div>
      <div class="editor--section">
        <p class="section--title">Пароль</p>
        <input id="password" v-model="data.password" type="password" class="input" required placeholder="**************" />
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
        fio: null,
        address: {
          street: null,
          house: null,
          floor: null,
          apartament: null,
        },
        birthday: null,
        group: null,
        password: null,
      },
      groups: null,
      roles: null,
    }
  },
  async fetch() {
    await Promise.all([this.$axios.$get(process.env.apiUrl + `/groups?limit=9999`), this.$axios.$get(process.env.apiUrl + `/roles?limit=9999`)])
      .catch((err) => {
        throw new Error(err.response.status)
      })
      .then((res) => {
        this.$data.groups = res[0].items
        this.$data.roles = res[1]
      })
  },
  meta: {
    permissions: ['users.manage'],
  },
  methods: {
    async add() {
      const address = `Улица ${this.data.address.street}, дом ${this.data.address.house}, этаж ${this.data.address.floor}, квартира ${this.data.address.apartament}`

      this.$data.response = await this.$axios.$post(process.env.apiUrl + `/users`, { ...this.data, address }).catch((err) => err.response)

      if (this.$data.response.userId) {
        this.$router.push('/management/users')
      }
    },
  },
})
</script>
