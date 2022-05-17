<template>
  <Loading :fetch-state="$fetchState">
    <template slot="content">
      <div v-if="data" class="section">
        <ManagementPanel
          :sort-options="[
            {
              title: 'По имени',
              field: 'fio',
              sort: 'asc',
            },
            {
              title: 'По имени (убыв.)',
              field: 'fio',
              sort: 'desc',
            },
            {
              title: 'По группе',
              field: 'group.name',
              sort: 'asc',
            },
            {
              title: 'По группе (убыв.)',
              field: 'group.name',
              sort: 'desc',
            },
          ]"
          :data="{
            buttonAddLink: '/management/users/add',
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            currentPage: currentPage,
            totalPages: data.totalPages,
          }"
          @onSelect="onSelect"
        >
          <h1 slot="header">Управление пользователями</h1>
        </ManagementPanel>
        <div class="card-grid">
          <nuxt-link v-for="user in data.items" :key="user.userId" :to="`/management/users/edit/${user.userId}`" class="card">
            <div class="card--del">
              <button class="button button__danger" @click.prevent="$router.push(`/management/users/delete/${user.userId}`)">
                <TrashIcon />
              </button>
            </div>
            <div class="card--icon">
              <Avatar :width="64" :name="user.fio" :unique-code="user.userId" :bg-color="user.userId.substr(user.userId.length - 3)" />
            </div>
            <p class="card--title">{{ user.fio }}</p>
            <div class="card--content">
              <p v-if="user.role.roleId == '6267c57f0f80e9f4646bb5bb'" class="info info__warning info__sm">
                Этот пользователь ожидает подтверждения!
              </p>
              <div class="my-2 card--section">
                <p>
                  Группа:
                  <span
                    :style="`background: #${user.group.groupId.substr(user.group.groupId.length - 3)};`"
                    class="px-2 py-1 !text-white bg-bg-500 rounded-xl"
                    >{{ user.group.name }}</span
                  >
                </p>
              </div>
              <div class="my-2 card--section">
                <p>
                  Роль:
                  <span class="px-2 py-1 !text-white bg-bg-500 rounded-xl">{{ user.role.name }}</span>
                </p>
              </div>
              <p>
                Родился <span>{{ $moment(user.birthday).format('DD.MM.YYYY') }}</span>
              </p>
            </div>
          </nuxt-link>
        </div>
      </div>
    </template>
  </Loading>
</template>

<script lang="ts">
import Vue from 'vue'
import { TrashIcon } from 'vue-tabler-icons'
import { orderBy } from 'lodash'

export default Vue.extend({
  name: 'TeachersPage',
  components: {
    TrashIcon,
  },
  middleware: ['auth', 'approved', 'permissions'],
  meta: {
    permissions: ['users.get'],
  },
  data() {
    return {
      data: null,
    }
  },
  async fetch() {
    const page = Number(!this.$route.query.page ? 1 : this.$route.query.page)
    this.data = await this.$axios.$get(process.env.apiUrl + `/users?page=${page}`).catch((err) => {
      throw new Error(err.response.status)
    })
  },
  computed: {
    currentPage() {
      return Number(!this.$route.query.page ? 1 : this.$route.query.page)
    },
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    onSelect(option) {
      this.$set(this.$data.data, 'items', orderBy(this.$data.data.items, option.field, option.sort))
    },
  },
})
</script>
