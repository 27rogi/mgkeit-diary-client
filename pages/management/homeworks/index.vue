<template>
  <Loading :fetch-state="$fetchState">
    <template slot="content">
      <div v-if="data" class="section">
        <ManagementPanel
          :sort-options="[
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
            {
              title: 'По предмету',
              field: 'subject.name',
              sort: 'asc',
            },
            {
              title: 'По предмету (убыв.)',
              field: 'subject.name',
              sort: 'desc',
            },
          ]"
          :data="{
            buttonAddLink: '/management/homeworks/add',
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            currentPage: currentPage,
            totalPages: data.totalPages,
          }"
          @onSelect="onSelect"
        >
          <h1 slot="header">Управление домашним заданием</h1>
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
            v-for="homework in data.items"
            :key="homework.homeworkId"
            :to="`/management/homeworks/edit/${homework.homeworkId}`"
            class="card"
          >
            <div class="card--del">
              <button class="button button__danger" @click.prevent="$router.push(`/management/homeworks/delete/${homework.homeworkId}`)">
                <TrashIcon />
              </button>
            </div>
            <p class="card--title max-w-[256px]">
              Домашнее задание до <span>{{ $moment(homework.deadline).format('DD.MM.YYYY') }}</span>
            </p>
            <p>
              Предмет <span>{{ homework.subject.name }}</span>
            </p>
            <p>
              Учитель <span>{{ homework.teacher.fio }}</span>
            </p>
            <p>
              Группа <span>{{ homework.group.name }}</span>
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
  async fetch() {
    const page = Number(!this.$route.query.page ? 1 : this.$route.query.page)

    let searchQuery = `/homeworks?page=${page}`
    if (this.$route.query.group) searchQuery = `/homeworks/group/${this.$route.query.group}?page=${page}`

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
  meta: {
    permissions: ['homeworks.get'],
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
