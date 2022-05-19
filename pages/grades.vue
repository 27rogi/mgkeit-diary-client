<template>
  <Loading :fetch-state="$fetchState">
    <div slot="content" class="subjects">
      <div v-if="Object.keys(subjects).length > 0" class="subjects--items">
        <div v-for="subject in subjects" :key="subject.subjectId" class="subject">
          <p class="subject--name">{{ subject.name }}</p>
          <div class="subject--grades">
            <p v-for="(grade, index) in subject.grades" :key="index" class="grade">{{ grade.grade }}<span class="grade--weight">{{grade.weight}}</span></p>
          </div>
        </div>
      </div>
      <p v-else class="info info__warning">У вас еще нет оценок по предметам!</p>
    </div>
  </Loading>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'MainPage',
  data() {
    return {
      subjects: {},
    }
  },
  async fetch() {
    await this.$axios
      .$get(process.env.apiUrl + `/grades/user/${this.$auth.user.userId}?limit=9999`)
      .catch((err) => {
        throw new Error(err.response.status)
      })
      .then((res) => {
        for (const item of res.items) {
          if (!item) break;
          if (!this.subjects[(<any>item).subject.subjectId]) this.$set(this.subjects, (<any>item).subject.subjectId, { ...(<any>item).subject, grades: [] })
          this.subjects[(<any>item).subject.subjectId].grades.push(item)
        }
      })
  },
  head() {
    return {
      title: 'Оценки',
    }
  },
})
</script>

<style lang="scss" scoped>
.subjects {
  @apply flex flex-col p-6;
  .subjects--items {
    @apply grid grid-cols-1 gap-2;
    .subject {
      @apply grid grid-cols-6 gap-2 p-4 bg-bg-700 rounded-xl font-semibold;
      .subject--name {
        @apply flex flex-col justify-center items-center text-center col-span-1 bg-bg-600 rounded-xl text-xl font-bold;
      }
      .subject--grades {
        @apply flex flex-row gap-1 col-span-5;
        .grade {
          @apply text-xl flex flex-col justify-center items-center text-center w-12 h-12 relative p-1 bg-bg-500/50 rounded-xl font-semibold text-primary-400;
          .grade--weight {
            @apply absolute flex flex-col justify-center items-center text-center top-0 right-0 text-bg-100/50 text-sm font-bold p-2 w-6 h-6;
          }
        }
      }
    }
  }
}
</style>
