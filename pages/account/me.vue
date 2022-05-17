<template>
  <Loading :fetch-state="$fetchState">
    <div v-if="account" slot="content" class="account">
      <div class="account--fio">
        <h1>{{ account.fio }}</h1>
        <Avatar :width="64" :name="account.fio" :unique-code="account.userId" :bg-color="account.userId.substr(account.userId.length - 3)" />
      </div>
      <div class="account--item">
        <p class="item--name"><CakeIcon size="48px" /> Дата рождения:</p>
        <p class="item--value">{{ account.birthday }}</p>
      </div>
      <div class="account--item">
        <p class="item--name"><AddressBookIcon size="48px" /> Адрес проживания:</p>
        <p class="item--value">{{ account.address }}</p>
      </div>
      <div class="account--item">
        <p class="item--name"><LockSquareIcon size="48px" /> Ваша роль:</p>
        <p :style="`background: #${account.role.roleId.substr(account.role.roleId.length - 3)};`" class="text-white item--value">
          {{ account.role.name }}
        </p>
      </div>
      <div class="account--item">
        <p class="item--name"><UsersIcon size="48px" /> Ваша группа:</p>
        <p :style="`background: #${account.group.groupId.substr(account.group.groupId.length - 3)};`" class="text-white item--value">
          {{ account.group.name }}
        </p>
      </div>
      <div v-if="account.owner && account.owner.length > 0" class="account--item">
        <p class="item--name"><FileCertificateIcon size="48px" /> Вы руководите группами:</p>
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
  </Loading>
</template>

<script lang="ts">
import { CakeIcon, FileCertificateIcon, AddressBookIcon, UsersIcon, LockSquareIcon } from 'vue-tabler-icons'
import Vue from 'vue'

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
    this.account = await this.$axios.$get(process.env.apiUrl + '/auth/me')
  },
  head() {
    return {
      title: 'Персональные данные',
    }
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
