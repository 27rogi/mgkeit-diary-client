<template>
  <Loading :fetch-state="$fetchState">
    <template slot="content">
      <div class="section">
        <template v-if="data">
          <ManagementPanel
            :data="{
              buttonAddLink: '/management/teachers/add',
              hasPrevPage: data.hasPrevPage,
              hasNextPage: data.hasNextPage,
              currentPage: currentPage,
              totalPages: data.totalPages,
            }"
          >
            <h1 slot="header">Управление данными учителей</h1>
          </ManagementPanel>
          <div class="card-grid">
            <nuxt-link
              v-for="teacher in data.items"
              :key="teacher.userId"
              :to="
                teacher.teacherInfo
                  ? `/management/teachers/edit/${teacher.teacherInfo.teacherInfoId}`
                  : `/management/teachers/add?id=${teacher.userId}`
              "
              class="card"
            >
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
                <p v-if="!teacher.teacherInfo" class="text-red-500">Учитель не имеет данных!</p>
                <template v-if="teacher.teacherInfo">
                  <p class="text-primary-500">{{ teacher.teacherInfo.specialty }}</p>
                  <p>Работает с {{ $moment(teacher.teacherInfo.workStartDate).format('DD.MM.YYYY') }}</p>
                </template>
                <div v-if="teacher.owner && teacher.owner.length > 0" id="groups" class="card--section">
                  <p>Руководит группами:</p>
                  <div class="flex flex-row flex-wrap gap-2">
                    <div v-for="group in teacher.owner" :key="group.groupId" class="px-2 bg-bg-600 rounded-xl">
                      <p>{{ group.name }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </nuxt-link>
          </div>
        </template>
        <template v-else>
          <p>Выполняется загрузка данных, ожидайте...</p>
        </template>
      </div>
    </template>
  </Loading>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'TeachersPage',
  data() {
    return {
      data: null,
    }
  },
  async fetch() {
    const page = Number(!this.$route.query.page ? 1 : this.$route.query.page)
    this.data = await this.$axios.$get(process.env.apiUrl + `/users/teachers?page=${page}`).catch((err) => {
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
})
</script>
