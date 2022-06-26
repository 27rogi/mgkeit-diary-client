<template>
  <Loading :fetch-state="$fetchState">
    <div v-if="account && hasAccess" slot="content" class="account">
      <div v-if="account.userId" class="account--fio">
        <h1>{{ account.fio }}</h1>
        <Avatar :width="64" :name="account.fio" :unique-code="account.userId" :bg-color="account.userId.substr(account.userId.length - 3)" />
      </div>
      <div v-if="account.birthday" class="account--item">
        <p class="item--name"><CakeIcon size="48px" /> Дата рождения:</p>
        <p class="item--value">{{ account.birthday }}</p>
      </div>
      <div v-if="account.address" class="account--item">
        <p class="item--name"><AddressBookIcon size="48px" /> Адрес проживания:</p>
        <p class="item--value">{{ account.address }}</p>
      </div>
      <div v-if="account.role && account.role.roleId" class="account--item">
        <p class="item--name"><LockSquareIcon size="48px" /> Роль:</p>
        <p :style="`background: #${account.role.roleId.substr(account.role.roleId.length - 3)};`" class="text-white item--value">
          {{ account.role.name }}
        </p>
      </div>
      <div v-if="account.group && account.group.groupId" class="account--item">
        <p class="item--name"><UsersIcon size="48px" /> Группа:</p>
        <p :style="`background: #${account.group.groupId.substr(account.group.groupId.length - 3)};`" class="text-white item--value">
          {{ account.group.name }}
        </p>
      </div>
      <div v-if="account.owner && account.owner.length > 0 && account.group.groupId" class="account--item">
        <p class="item--name"><FileCertificateIcon size="48px" /> Руководитель групп:</p>
        <p
          v-for="group in account.owner"
          :key="group.groupId"
          :style="`background: #${account.group.groupId.substr(account.group.groupId.length - 3)};`"
          class="text-white item--value"
        >
          {{ group.name }}
        </p>
      </div>
    </div>
    <div v-else-if="!hasAccess" slot="content" class="error">
      <p>У вас нет прав на просмотр этой страницы!</p>
    </div>
  </Loading>
</template>

<script lang="ts">
import { CakeIcon, FileCertificateIcon, AddressBookIcon, UsersIcon, LockSquareIcon } from 'vue-tabler-icons'
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    hasPermissions: (role: any, permissions: any) => boolean
  }
}

export default Vue.extend({
  name: 'UserPage',
  components: {
    CakeIcon,
    FileCertificateIcon,
    AddressBookIcon,
    UsersIcon,
    LockSquareIcon,
  },
  middleware: ['auth'],
  auth: true,
  data() {
    return {
      account: null,
    }
  },
  async fetch() {
    this.$data.account = await this.$axios.$get(process.env.apiUrl + `/users/${this.$route.params.id}`).catch((err) => {
      throw new Error(err.response.status)
    })
  },
  head() {
    return {
      title: 'Страница профиля',
    }
  },
  computed: {
    hasAccess() {
      if (!this.$data.account) return false
      if (this.$data.account.userId === this.$auth.user.userId) return true
      if (this.$data.account.role.permissions.includes('teacher')) return true
      return this.hasPermissions(this.$auth.user.role, ['panel.admin'])
    },
  },
  methods: {
    hasPermissions(role, permissions): boolean {
      return permissions.every((perm: string) => role.permissions.includes(perm))
    },
  },
})
</script>

<style lang="scss" scoped>
.account {
  @apply w-full items-center flex flex-col gap-4 text-4xl font-semibold p-6;
  .account--fio {
    @apply flex flex-row gap-4 items-center;
    h1 {
      @apply text-5xl font-bold;
    }
    img {
      @apply rounded-full;
    }
  }
  .account--item {
    @apply flex flex-row gap-2 items-center;
    .item--name {
      @apply flex flex-row gap-2 items-center;
    }
    .item--value {
      @apply bg-bg-600 rounded-xl px-2 py-1;
    }
  }
}
</style>
