<template>
  <Loading :fetch-state="$fetchState">
    <template slot="content">
      <div v-if="data" class="section">
        <ManagementPanel
          :sort-options="[
            {
              title: 'По названию',
              field: 'name',
              sort: 'asc',
            },
            {
              title: 'По названию (убыв.)',
              field: 'name',
              sort: 'desc',
            },
          ]"
          :data="{
            buttonAddLink: '/management/roles/add',
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            currentPage: currentPage,
            totalPages: data.totalPages,
          }"
          @onSelect="onSelect"
        >
          <h1 slot="header">Управление ролями пользователей</h1>
        </ManagementPanel>
        <div class="card-grid">
          <nuxt-link v-for="role in data.items" :key="role.roleId" :to="`/management/roles/edit/${role.roleId}`" class="card">
            <div class="card--del">
              <button class="button button__danger" @click.prevent="$router.push(`/management/roles/delete/${role.roleId}`)">
                <TrashIcon />
              </button>
            </div>
            <div class="p-6 rounded-xl w-fit" :style="`background: #${role.roleId.substr(role.roleId.length - 3)};`" />
            <p class="card--title">{{ role.name }}</p>
            <div class="card--section">
              <p>Права роли:</p>
              <div class="flex flex-row flex-wrap gap-2 overflow-hidden max-h-24">
                <p v-for="permission in role.permissions" :key="permission" class="px-2 py-1 text-white rounded-xl bg-green-500/40">
                  {{ permission }}
                </p>
              </div>
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
  data() {
    return {
      data: null,
    }
  },
  meta: {
    permissions: ['roles.get'],
  },
  async fetch() {
    const page = Number(!this.$route.query.page ? 1 : this.$route.query.page)
    this.data = await this.$axios.$get(process.env.apiUrl + `/roles?page=${page}`).catch((err) => {
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
