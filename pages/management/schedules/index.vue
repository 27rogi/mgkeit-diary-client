<template>
  <Loading :fetch-state="$fetchState">
    <template slot="content">
      <div v-if="data" class="section">
        <ManagementPanel
          :sort-options="[
            {
              title: 'По названию',
              field: 'data.name',
              sort: 'asc',
            },
            {
              title: 'По названию (убыв.)',
              field: 'data.name',
              sort: 'desc',
            },
          ]"
          :data="{
            buttonAddLink: '/management/schedules/add',
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            currentPage: currentPage,
            totalPages: data.totalPages,
          }"
          @onSelect="onSelect"
        >
          <h1 slot="header">Управление расписанием</h1>
          <VueSelect
            v-if="groups"
            id="group_select"
            slot="controls"
            :clearable="true"
            label="name"
            :options="groups"
            :reduce="(group) => group.groupId"
            :value="$route.query.group"
            required
            placeholder="Группа"
            @input="selectGroup"
          ></VueSelect>
        </ManagementPanel>
        <div class="card-grid">
          <nuxt-link
            v-for="schedule in data.items"
            :key="schedule.scheduleId"
            :to="`/management/schedules/edit/${schedule.scheduleId}`"
            class="card"
          >
            <div class="card--del">
              <button class="button button__danger" @click.prevent="$router.push(`/management/schedules/delete/${schedule.scheduleId}`)">
                <TrashIcon />
              </button>
            </div>
            <p class="card--title max-w-[256px]">
              Расписание на <span>{{ $moment(schedule.weekDate).format('DD.MM.YYYY') }}</span>
            </p>
            <p>
              Группа <span>{{ schedule.group.name }}</span>
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
  data() {
    return {
      data: null,
      groups: null,
    }
  },
  meta: {
    permissions: ['schedules.get'],
  },
  async fetch() {
    const page = Number(!this.$route.query.page ? 1 : this.$route.query.page)

    let searchQuery = `/schedules?page=${page}`
    if (this.$route.query.group) searchQuery = `/schedules/group/${this.$route.query.group}?page=${page}`

    this.data = await this.$axios.$get(process.env.apiUrl + searchQuery).catch((err) => {
      throw new Error(err.response.status)
    })
    this.groups = await this.$axios
      .$get(process.env.apiUrl + `/groups?limit=9999`)
      .catch((err) => {
        throw new Error(err.response.status)
      })
      .then((res) => res.items)
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
    selectGroup(group) {
      this.$router.push({ query: { group } })
    },
  },
})
</script>
