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
            {
              title: 'По куратору',
              field: 'owner.fio',
              sort: 'asc',
            },
            {
              title: 'По куратору (убыв.)',
              field: 'owner.fio',
              sort: 'desc',
            },
          ]"
          :data="{
            buttonAddLink: '/management/groups/add',
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            currentPage: currentPage,
            totalPages: data.totalPages,
          }"
          @onSelect="onSelect"
        >
          <h1 slot="header">Управление группами</h1>
        </ManagementPanel>
        <div class="card-grid">
          <nuxt-link v-for="group in data.items" :key="group.roleId" :to="`/management/groups/edit/${group.groupId}`" class="card">
            <div class="card--del">
              <button class="button button__danger" @click.prevent="$router.push(`/management/groups/delete/${group.groupId}`)">
                <TrashIcon />
              </button>
            </div>
            <div class="p-6 rounded-xl w-fit" :style="`background: #${group.groupId.substr(group.groupId.length - 3)};`" />
            <p class="card--title">{{ group.name }}</p>
            <p v-if="group.owner">
              Куратор: <span>{{ group.owner.fio }}</span>
            </p>
            <p v-else class="info info__warning info__sm">У группы отсутствует куратор!</p>
            <p v-if="group.creationDate">Начало обучения: {{ $moment(group.creationDate).format('DD.MM.YYYY') }}</p>
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
    permissions: ['groups.get'],
  },
  async fetch() {
    const page = Number(!this.$route.query.page ? 1 : this.$route.query.page)
    this.data = await this.$axios.$get(process.env.apiUrl + `/groups?page=${page}`).catch((err) => {
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
