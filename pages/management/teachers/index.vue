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
              title: 'По данным',
              field: 'teacherInfo',
              sort: 'asc',
            },
            {
              title: 'По данным (убыв.)',
              field: 'teacherInfo',
              sort: 'desc',
            },
          ]"
          :data="{
            buttonAddLink: '/management/teachers/add',
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            currentPage: currentPage,
            totalPages: data.totalPages,
          }"
          @onSelect="onSelect"
        >
          <h1 slot="header">Управление данными учителей</h1>
        </ManagementPanel>
        <div class="card-grid">
          <nuxt-link v-for="teacher in data.items" :key="teacher.userId" :to="getUrl(teacher)" class="card">
            <div v-if="teacher.teacherInfo" class="card--del">
              <button
                class="button button__danger"
                @click.prevent="$router.push(`/management/teachers/delete/${teacher.teacherInfo.teacherInfoId}`)"
              >
                <TrashIcon />
              </button>
            </div>
            <div class="card--icon">
              <Avatar
                :width="64"
                :name="teacher.fio"
                :unique-code="teacher.userId"
                :bg-color="teacher.userId.substr(teacher.userId.length - 3)"
              />
            </div>
            <p class="card--title">{{ teacher.fio }}</p>
            <div class="card--content">
              <p v-if="!teacher.teacherInfo" class="info info__warning info__sm">Учитель не имеет данных!</p>
              <template v-if="teacher.teacherInfo">
                <p class="text-primary-500">{{ teacher.teacherInfo.specialty }}</p>
                <p>
                  Работает с <span>{{ $moment(teacher.teacherInfo.workStartDate).format('DD.MM.YYYY') }}</span>
                </p>
              </template>
              <div v-if="teacher.owner && teacher.owner.length > 0" id="groups" class="card--section">
                <p>Руководит группами:</p>
                <div class="flex flex-row flex-wrap gap-2">
                  <div
                    v-for="group in teacher.owner"
                    :key="group.groupId"
                    :style="`background: #${group.groupId.substr(group.groupId.length - 3)};`"
                    class="px-2 text-white bg-bg-500 rounded-xl"
                  >
                    <p>{{ group.name }}</p>
                  </div>
                </div>
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
    permissions: ['teachers.get'],
  },
  async fetch() {
    const page = Number(!this.$route.query.page ? 1 : this.$route.query.page)
    this.data = await this.$axios.$get(process.env.apiUrl + `/users/teachers?page=${page}`).catch((err) => {
      throw new Error(err.response.status)
    })
  },
  head() {
    return {
      title: 'Управление данными учителей',
    }
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
    getUrl(teacher) {
      return teacher.teacherInfo
        ? `/management/teachers/edit/${teacher.teacherInfo.teacherInfoId}`
        : `/management/teachers/add?id=${teacher.userId}`
    },
  },
})
</script>
