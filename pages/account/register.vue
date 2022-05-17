<template>
  <Loading :fetch-state="$fetchState">
    <div slot="content" class="auth-container">
      <form class="auth" @submit.prevent="register">
        <h1>Создание аккаунта</h1>
        <div v-if="errors.length > 0" class="auth--problems">
          <template v-for="error in errors">
            <div :key="error" class="problem">
              <p v-if="error == 400">
                Ошибка регистрации, проверьте правильность введенных данных! Возможно, аккаунт с такими данными уже существует.
              </p>
              <p v-else :key="error">{{ error }}</p>
            </div>
          </template>
        </div>
        <div class="auth--section">
          <p class="section--title">Ваше ФИО</p>
          <input id="login" v-model="user.fio" type="text" class="w-full input" required placeholder="Иванов Иван Иванович" />
        </div>
        <div class="auth--section">
          <p class="section--title">Ваше место проживания</p>
          <p class="text-lg text-bg-50/80 section--title">Улица</p>
          <input id="street" v-model="user.address.street" type="text" class="w-full input" required placeholder="Профсоюзная" />
          <div class="flex flex-row items-center gap-2">
            <div class="flex flex-col gap-1">
              <p class="text-lg text-bg-50/80 section--title">Номер дома</p>
              <input id="house" v-model="user.address.house" type="text" class="w-full input" required placeholder="21/2" />
            </div>
            <div class="flex flex-col gap-1">
              <p class="text-lg text-bg-50/80 section--title">Этаж</p>
              <input id="floor" v-model="user.address.floor" type="number" class="w-full input" required placeholder="4" />
            </div>
            <div class="flex flex-col gap-1">
              <p class="text-lg text-bg-50/80 section--title">Номер квартиры</p>
              <input id="apartament" v-model="user.address.apartament" type="number" class="w-full input" required placeholder="182" />
            </div>
          </div>
        </div>
        <div class="auth--section">
          <p class="section--title">Ваш день рождения</p>
          <input id="birthday" v-model="user.birthday" type="date" class="w-full input" required />
        </div>
        <div class="auth--section">
          <p class="section--title">Ваша группа</p>
          <VueSelect
            id="group_selection"
            v-model="user.group"
            autocomplete="off"
            :clearable="false"
            label="name"
            :options="groups"
            :reduce="(group) => group.groupId"
          ></VueSelect>
        </div>
        <div class="auth--section">
          <p class="section--title">Ваш пароль</p>
          <input id="password" v-model="user.password" class="w-full input" required type="password" placeholder="***********" />
        </div>
        <div class="auth--actions">
          <button class="w-full button button__action" type="sumbit">Создать аккаунт</button>
          <nuxt-link to="/account/login" class="w-full button">Войти в аккаунт</nuxt-link>
        </div>
      </form>
    </div>
  </Loading>
</template>

<script lang="ts">
import Vue from 'vue'
import { AxiosError } from 'axios'

export default Vue.extend({
  name: 'RegisterPage',
  layout: 'unauthorized',
  middleware: 'auth',
  auth: 'guest',
  data() {
    return {
      user: {
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
      groups: [],
      errors: [],
    }
  },
  async fetch() {
    this.groups = (await this.$axios.$get(process.env.apiUrl + '/groups')).items
    if (this.groups) this.user.group = this.groups[0].groupId
  },
  head() {
    return {
      title: 'Регистрация',
    }
  },
  methods: {
    register() {
      this.errors = []

      const address = `Улица ${this.user.address.street}, дом ${this.user.address.house}, этаж ${this.user.address.floor}, квартира ${this.user.address.apartament}`

      this.$axios
        .post(process.env.apiUrl + '/auth/register', { ...this.user, address })
        .then(() => {
          const { fio, group, password } = this.user
          this.$auth
            .loginWith('local', { data: { fio, group, password } })
            .then(() => this.$router.push('/'))
            .catch((err: AxiosError) => {
              this.errors.push(err.response.status)
            })
        })
        .catch((err: AxiosError) => {
          this.errors.push(err.response.status)
        })
    },
  },
})
</script>
