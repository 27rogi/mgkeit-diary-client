<template>
  <Loading :fetch-state="$fetchState">
    <template slot="content">
      <div v-if="data" class="section">
        <ManagementPanel
          :sort-options="[
            {
              title: 'По времени начала',
              field: 'startTime',
              sort: 'asc',
            },
            {
              title: 'По времени окончания',
              field: 'endTime',
              sort: 'asc',
            },
          ]"
          :data="{
            buttonAddLink: '/management/bells/add',
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            currentPage: currentPage,
            totalPages: data.totalPages,
          }"
          @onSelect="onSelect"
        >
          <h1 slot="header">Управление звонками</h1>
        </ManagementPanel>
        <div class="card-grid">
          <nuxt-link v-for="bell in data.items" :key="bell.bellId" :to="`/management/bells/edit/${bell.bellId}`" class="card">
            <div class="card--del">
              <button class="button button__danger" @click.prevent="$router.push(`/management/bells/delete/${bell.bellId}`)">
                <TrashIcon />
              </button>
            </div>
            <p class="card--title">Звонок</p>
            <p>
              Начало в <span>{{ $moment(bell.startTime, 'HH:mm', true).format('HH:mm') }}</span>
            </p>
            <p>
              Окончание в <span>{{ $moment(bell.endTime, 'HH:mm', true).format('HH:mm') }}</span>
            </p>
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
    permissions: ['bells.get'],
  },
  data() {
    return {
      data: null,
    }
  },
  async fetch() {
    const page = Number(!this.$route.query.page ? 1 : this.$route.query.page)
    this.data = await this.$axios.$get(process.env.apiUrl + `/bells?page=${page}`).catch((err) => {
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
