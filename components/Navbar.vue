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
            <template v-for="dropdownItem in item.dropdownItems">
              <nuxt-link v-if="(dropdownItem.permissions && hasPermissions(dropdownItem.permissions)) || !dropdownItem.permissions" :key="dropdownItem.title" :to="dropdownItem.path" class="navbar--item">
                <component :is="dropdownItem.icon" v-if="dropdownItem.icon" />
                {{ dropdownItem.title }}
              </nuxt-link>
            </template>
          </div>
          <p slot="reference" class="navbar--item"><component :is="item.icon" v-if="item.icon" /> {{ item.title }}</p>
        </Popper>
      </template>
    </div>
    <div class="navbar--items navbar--items__userzone">
      <Popper
        trigger="clickToToggle"
        :options="{
          placement: 'bottom-start',
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
import { HomeIcon, DoorExitIcon, UserSearchIcon, ListIcon, EditCircleIcon, ClockIcon, WritingIcon, ListNumbersIcon, } from 'vue-tabler-icons'
import Logo from '@/components/Logo.vue'
import Vue from 'vue'

export default Vue.extend({
  name: 'NavbarComponent',
  components: {
    HomeIcon,
    DoorExitIcon,
    UserSearchIcon,
    Popper,
    ClockIcon,
    WritingIcon,
    ListNumbersIcon,
  },
  data() {
    return {
      navbar: {
        items: [
          {
            title: 'Главная страница',
            path: '/',
            icon: Logo,
          },
          {
            title: 'Расписание',
            path: '/schedules',
            icon: ClockIcon,
            permissions: ['schedules.menu'],
          },
          {
            title: 'Домашние задания',
            path: '/homeworks',
            icon: WritingIcon,
            permissions: ['homeworks.menu'],
          },
          {
            title: 'Оценки',
            path: '/grades',
            icon: ListNumbersIcon,
            permissions: ['grades.menu'],
          },
          {
            title: 'Панель управления',
            icon: EditCircleIcon,
            permissions: ['panel.access'],
            dropdownItems: [
              {
                title: 'Управление уроками',
                path: '/management/schedules',
                icon: ListIcon,
                permissions: ['panel.access'],
              },
              {
                title: 'Управление звонками',
                path: '/management/bells',
                icon: ListIcon,
                permissions: ['panel.access'],
              },
              {
                title: 'Управление заданиями',
                path: '/management/homeworks',
                icon: ListIcon,
                permissions: ['panel.access'],
              },
              {
                title: 'Управление предметами',
                path: '/management/subjects',
                icon: ListIcon,
                permissions: ['subjects.manage', 'panel.access'],
              },
              {
                title: 'Управление оценками',
                path: '/management/grades',
                icon: ListIcon,
                permissions: ['panel.access'],
              },
            ],
          },
          {
            title: 'Администрирование',
            icon: EditCircleIcon,
            permissions: ['panel.admin'],
            dropdownItems: [
              {
                title: 'Управление группами',
                path: '/management/groups',
                icon: ListIcon,
                permissions: ['panel.admin'],
              },
              {
                title: 'Управление ролями',
                path: '/management/roles',
                icon: ListIcon,
                permissions: ['panel.admin'],
              },
              {
                title: 'Управление данными учителей',
                path: '/management/teachers',
                icon: ListIcon,
                permissions: ['panel.admin'],
              },
              {
                title: 'Управление пользователями',
                path: '/management/users',
                icon: ListIcon,
                permissions: ['panel.admin'],
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
    @apply relative flex flex-row;
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
      @apply w-[20rem] flex flex-col bg-bg-700 p-2 rounded-xl shadow-bg-900/30 shadow-lg;
    }
  }
}
</style>
