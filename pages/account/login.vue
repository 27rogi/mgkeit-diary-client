<template>
  <Loading :fetch-state="$fetchState">
    <div slot="content" class="auth-container">
      <form class="auth" @submit.prevent="login">
        <h1>Войдите в аккаунт</h1>
        <div v-if="errors.length > 0" class="auth--problems">
          <template v-for="error in errors">
            <div :key="error" class="problem">
              <p v-if="error == 400">Ошибка авторизации, проверьте правильность ФИО, группы и пароля.</p>
              <p v-else :key="error">{{ error }}</p>
            </div>
          </template>
        </div>
        <div class="auth--section">
          <p class="section--title">Ваше ФИО</p>
          <input id="login" v-model="user.fio" type="text" class="w-full input" required placeholder="Иванов Иван Иванович" />
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
          <button class="w-full button button__action" type="sumbit">Войти</button>
          <nuxt-link to="/account/register" class="w-full button">Создать аккаунт</nuxt-link>
        </div>
      </form>
    </div>
  </Loading>
</template>

<script lang="ts">
import Vue from 'vue'
import { AxiosError } from 'axios'

export default Vue.extend({
  name: 'LoginPage',
  layout: 'unauthorized',
  middleware: 'auth',
  auth: 'guest',
  data() {
    return {
      user: {
        fio: null,
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
      title: 'Авторизация',
    }
  },
  methods: {
    login() {
      this.errors = []

      this.$auth
        .loginWith('local', { data: this.user })
        .then(() => this.$router.push('/'))
        .catch((err: AxiosError) => {
          this.errors.push(err.response.status)
        })
    },
  },
})
</script>
