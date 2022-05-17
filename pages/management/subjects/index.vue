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
            buttonAddLink: '/management/subjects/add',
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            currentPage: currentPage,
            totalPages: data.totalPages,
          }"
          @onSelect="onSelect"
        >
          <h1 slot="header">Управление предметами</h1>
        </ManagementPanel>
        <div class="card-grid">
          <nuxt-link v-for="subject in data.items" :key="subject.roleId" :to="`/management/subjects/edit/${subject.subjectId}`" class="card">
            <div class="card--del">
              <button class="button button__danger" @click.prevent="$router.push(`/management/subjects/delete/${subject.subjectId}`)">
                <TrashIcon />
              </button>
            </div>
            <p class="card--title">{{ subject.name }}</p>
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
    permissions: ['subjects.get'],
  },
  data() {
    return {
      data: null,
    }
  },
  async fetch() {
    const page = Number(!this.$route.query.page ? 1 : this.$route.query.page)
    this.data = await this.$axios.$get(process.env.apiUrl + `/subjects?page=${page}`).catch((err) => {
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
