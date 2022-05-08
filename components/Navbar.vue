<template>
  <nav class="navbar">
    <div class="navbar--items">
      <template v-for="item in navbar.items">
        <nuxt-link
          v-if="!item.dropdownItems && ((item.permissions && hasPermissions(item.permissions)) || !item.permissions)"
          :key="item.title"
          :to="item.path"
          class="navbar--item"
        >
          <component :is="item.icon" v-if="item.icon" />
          {{ item.title }}
        </nuxt-link>
        <Popper
          v-else-if="item.dropdownItems && ((item.permissions && hasPermissions(item.permissions)) || !item.permissions)"
          :key="item.title"
          trigger="clickToToggle"
          :options="{
            placement: 'bottom',
            modifiers: { offset: { offset: '0,4px' } },
          }"
        >
          <div class="navbar--dropdown">
            <nuxt-link v-for="dropdownItem in item.dropdownItems" :key="dropdownItem.title" :to="dropdownItem.path" class="navbar--item">
              <component :is="dropdownItem.icon" v-if="dropdownItem.icon" />
              {{ dropdownItem.title }}
            </nuxt-link>
          </div>
          <p slot="reference" class="navbar--item"><component :is="item.icon" v-if="item.icon" /> {{ item.title }}</p>
        </Popper>
      </template>
    </div>
    <div class="navbar--items navbar--items__userzone">
      <Popper
        trigger="clickToToggle"
        :options="{
          placement: 'bottom',
          modifiers: { offset: { offset: '0,4px' } },
        }"
      >
        <div class="navbar--dropdown">
          <nuxt-link v-for="item in navbar.userzone" :key="item.title" :to="item.path" class="navbar--item">
            <component :is="item.icon" v-if="item.icon" />
            {{ item.title }}
          </nuxt-link>
        </div>
        <p slot="reference" class="navbar--item">
          <Avatar :name="$auth.user.fio" :uniqueCode="$auth.user.userId" :bgColor="$auth.user.userId.substr($auth.user.userId.length - 3)" />
          {{ $auth.user.fio }}
        </p>
      </Popper>
    </div>
  </nav>
</template>

<script lang="ts">
import Popper from 'vue-popperjs'
import { HomeIcon, DoorExitIcon, UserSearchIcon, PlusIcon, ListIcon, EditCircleIcon } from 'vue-tabler-icons'
import Vue from 'vue'

export default Vue.extend({
  name: 'NavbarComponent',
  components: {
    HomeIcon,
    DoorExitIcon,
    UserSearchIcon,
    Popper,
  },
  data() {
    return {
      navbar: {
        items: [
          {
            title: 'Главная страница',
            path: '/',
            icon: HomeIcon,
          },
          {
            title: 'Панель управления',
            icon: EditCircleIcon,
            dropdownItems: [
              {
                title: 'Управление уроками',
                path: '/account/me',
                icon: ListIcon,
              },
              {
                title: 'Управление звонками',
                path: '/account/me',
                icon: ListIcon,
              },
              {
                title: 'Управление группами',
                path: '/account/me',
                icon: ListIcon,
              },
              {
                title: 'Управление заданиями',
                path: '/account/me',
                icon: ListIcon,
              },
              {
                title: 'Управление заменами',
                path: '/account/me',
                icon: ListIcon,
              },
              {
                title: 'Управление предметами',
                path: '/account/me',
                icon: ListIcon,
              },
            ],
          },
          {
            title: 'Администрирование',
            icon: EditCircleIcon,
            dropdownItems: [
              {
                title: 'Управление ролями',
                path: '/account/me',
                icon: ListIcon,
              },
              {
                title: 'Управление данными учителей',
                path: '/management/teachers',
                icon: ListIcon,
              },
              {
                title: 'Управление пользователями',
                path: '/account/me',
                icon: ListIcon,
              },
            ],
          },
        ],
        userzone: [
          {
            title: 'Персональные данные',
            path: '/account/me',
            icon: UserSearchIcon,
          },
          {
            title: 'Выйти из аккаунта',
            path: '/account/logout',
            icon: DoorExitIcon,
          },
        ],
      },
    }
  },
  methods: {
    hasPermissions(permissions) {
      return permissions.every((perm: string) => (<any>this.$auth.user.role).permissions.includes(perm))
    },
  },
})
</script>

<style lang="scss">
.navbar {
  @apply relative z-40 mx-auto flex flex-row w-full bg-transparent p-4 border-bg-200/20 border-b-[1px];
  .navbar--items {
    @apply flex flex-row;
    .navbar--item {
      @apply cursor-pointer flex flex-row items-center gap-2 p-2 rounded-xl hover:bg-bg-50/10 font-semibold;
      img {
        @apply rounded-full;
      }
    }
    &__userzone {
      @apply ml-auto;
    }
    .navbar--dropdown {
      @apply max-w-xs flex flex-col bg-bg-700 p-2 rounded-xl shadow-bg-900/30 shadow-lg;
    }
  }
}
</style>
