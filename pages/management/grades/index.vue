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
            buttonAddLink: '/management/grades/add',
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            currentPage: currentPage,
            totalPages: data.totalPages,
          }"
          @onSelect="onSelect"
        >
          <h1 slot="header">Управление оценками</h1>
        </ManagementPanel>
        <div v-if="data.items" class="card-grid">
          <nuxt-link v-for="grade in data.items" :key="grade.gradeId" :to="`/management/grades/edit/${grade.gradeId}`" class="card">
            <div class="card--del">
              <button class="button button__danger" @click.prevent="$router.push(`/management/grades/delete/${grade.gradeId}`)">
                <TrashIcon />
              </button>
            </div>
            <p class="card--title">Оценка</p>
            <p>
              Оценка <span>{{ grade.weight }}</span> с весом <span>{{ grade.grade }}</span>
            </p>
            <p>
              Кому: <span>{{ grade.student.fio }}</span>
            </p>
            <p>
              Поставил: <span>{{ grade.teacher.fio }}</span>
            </p>
            <p>
              Причина: <span>{{ grade.reason }}</span>
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
    permissions: ['grades.get'],
  },
  data() {
    return {
      data: null,
    }
  },
  async fetch() {
    const page = Number(!this.$route.query.page ? 1 : this.$route.query.page)
    this.data = await this.$axios.$get(process.env.apiUrl + `/grades?page=${page}`).catch((err) => {
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
