<template>
  <Loading :fetch-state="$fetchState">
    <div v-if="homeworks" slot="content" class="homeworks">
      <div v-if="homeworks && homeworks.length > 0" class="homeworks--items">
        <div v-for="homework in homeworks" :key="homework.homeworkId" class="homework">
          <h1>Домашнее задание на {{ $moment(homework.deadline).format('DD MMMM YYYY') }}</h1>
          <p>
            Предмет: <span>{{ homework.subject.name }}</span>
          </p>
          <p class="flex flex-col gap-1">
            Преподаватель:
            <span
              ><div class="flex flex-row items-center gap-2">
                <Avatar
                  class="rounded-xl"
                  :width="24"
                  :name="homework.teacher.fio"
                  :unique-code="homework.teacher.userId"
                  :bg-color="homework.teacher.userId.substr(homework.teacher.userId.length - 3)"
                />
                <p>{{ homework.teacher.fio }}</p>
              </div></span
            >
          </p>
          <div class="homework--mission">
            <h1>Задание</h1>
            <p>{{ homework.mission }}</p>
            <div class="homework--material">
              <h1>Дополнительные материалы</h1>
              <p>{{ homework.material }}</p>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="info info__warning">У вашей группы еще нет домашнего задания!</p>
    </div>
  </Loading>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'MainPage',
  data() {
    return {
      homeworks: null,
    }
  },
  async fetch() {
    this.homeworks = await this.$axios
      .$get(process.env.apiUrl + `/homeworks/group/${this.$auth.user.group.groupId}?limit=9999`)
      .catch((err) => {
        throw new Error(err.response.status)
      })
      .then((res) => res.items)
  },
  head() {
    return {
      title: 'Домашнее задание',
    }
  },
})
</script>

<style lang="scss" scoped>
.homeworks {
  @apply flex flex-col p-6;
  .homeworks--items {
    @apply grid grid-cols-3 gap-2;
    .homework {
      @apply flex flex-col gap-2 p-4 bg-bg-600 rounded-xl font-semibold;

      h1 {
        @apply text-xl font-bold;
      }

      span {
        @apply text-primary-400;
      }

      .homework--mission {
        @apply p-4 -m-4 mt-2 bg-bg-400/50 rounded-xl;
        .homework--material {
          @apply p-2 -m-2 mt-2 bg-bg-600 rounded-xl;
        }
      }
    }
  }
}
</style>
