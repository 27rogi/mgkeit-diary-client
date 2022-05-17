<template>
  <Loading :fetch-state="$fetchState">
    <form v-if="results.subjects" slot="content" class="editor" @submit.prevent="add">
      <template v-if="response">
        <div v-if="response.status == 403" class="editor--error">
          <p>У вас недостаточно прав для выполнения данного действия!</p>
        </div>
        <div v-if="response.status == 400" class="editor--error">
          <p>Ошибка в заполнении данных, проверьте правильность введенной информации!</p>
        </div>
      </template>
      <h1 class="editor--title">Изменение <span>расписания</span></h1>
      <div class="editor--section">
        <p class="section--title">Дата начала недели</p>
        <input id="date" v-model="schedule.weekDate" class="input" type="date" />
      </div>
      <div class="editor--section">
        <p class="section--title">Группа</p>
        <VueSelect
          id="teacher_select"
          v-model="schedule.group"
          :clearable="false"
          label="name"
          :options="results.groups"
          :reduce="(group) => group.groupId"
          required
        ></VueSelect>
      </div>
      <div class="editor--section">
        <p class="section--title">Расписание</p>
        <div class="editor--schedule">
          <div class="editor--days">
            <button
              v-for="day in days.variants"
              :key="day.day"
              :class="{ button__action: getDay(day.day), button__danger: day.day === days.selectedDay }"
              class="button"
              @click.prevent="selectDay(day.day)"
            >
              {{ day.name }} <PlusIcon v-if="!getDay(day.day)" /><MinusIcon v-if="getDay(day.day)" />
            </button>
          </div>
          <div v-if="days.selectedDay" class="editor--actions">
            <button class="button" @click.prevent="addLesson(days.selectedDay)">Добавить занятие</button>
          </div>
          <div v-if="days.selectedDay" class="editor--lessons">
            <template v-if="$data.schedule.days[getDayIndex(days.selectedDay)]">
              <div v-for="(lesson, index) in schedule.days[getDayIndex(days.selectedDay)].lessons" :key="index" class="lesson">
                <button class="button button__danger" @click.prevent="deleteLesson(days.selectedDay, index)">-</button>
                <div class="lesson--section">
                  <p>Предмет</p>
                  <VueSelect
                    id="teacher_select"
                    v-model="lesson.subject"
                    :clearable="false"
                    label="name"
                    :options="results.subjects"
                    :reduce="(subject) => subject.subjectId"
                    required
                  ></VueSelect>
                </div>
                <div class="lesson--section">
                  <p>Звонок</p>
                  <VueSelect
                    id="teacher_select"
                    v-model="lesson.bell"
                    label="startTime"
                    :clearable="false"
                    :options="results.bells"
                    :reduce="(bell) => bell.bellId"
                    :selectable="isBellSelected"
                    required
                    @option:selected="sortBells(getDay(days.selectedDay))"
                  >
                    <template #option="option">
                      <div class="input--time">
                        <p>Начало в {{ option.startTime }}</p>
                        <p>Окончание в {{ option.endTime }}</p>
                      </div>
                    </template>
                    <template #selected-option="option">
                      <div class="input--time">
                        <p>Начало в {{ option.startTime }}</p>
                        <p>Окончание в {{ option.endTime }}</p>
                      </div>
                    </template></VueSelect
                  >
                </div>
                <div class="lesson--section">
                  <p>Учитель</p>
                  <VueSelect
                    id="teacher_select"
                    v-model="lesson.teacher"
                    label="fio"
                    :clearable="false"
                    :options="results.teachers"
                    :reduce="(teacher) => teacher.userId"
                    required
                  >
                    <template #option="option">
                      <div class="input--user">
                        <Avatar
                          :width="32"
                          :name="option.fio"
                          :unique-code="option.userId"
                          :bg-color="option.userId.substr(option.userId.length - 3)"
                        />
                        <p>{{ option.fio }}</p>
                      </div>
                    </template>
                    <template #selected-option="option">
                      <div class="input--user">
                        <Avatar
                          :width="32"
                          :name="option.fio"
                          :unique-code="option.userId"
                          :bg-color="option.userId.substr(option.userId.length - 3)"
                        />
                        <p>{{ option.fio }}</p>
                      </div>
                    </template>
                  </VueSelect>
                </div>
                <div class="lesson--section">
                  <p>Место проведения</p>
                  <input id="location" v-model="lesson.location" type="text" class="w-full input" required />
                </div>
                <div class="lesson--section lesson--section__replacement">
                  <div v-if="lesson.replacement" class="lesson--section">
                    <button class="button button__danger" @click.prevent="deleteReplacement(lesson)">Удалить замену</button>
                    <div class="lesson--section">
                      <p>Предмет</p>
                      <VueSelect
                        id="teacher_select"
                        v-model="lesson.replacement.subject"
                        :clearable="false"
                        label="name"
                        :options="results.subjects"
                        :reduce="(subject) => subject.subjectId"
                        required
                      ></VueSelect>
                    </div>
                    <div class="lesson--section">
                      <p>Учитель</p>
                      <VueSelect
                        id="teacher_select"
                        v-model="lesson.replacement.teacher"
                        label="fio"
                        :clearable="false"
                        :options="results.teachers"
                        :reduce="(teacher) => teacher.userId"
                        required
                      >
                        <template #option="option">
                          <div class="input--user">
                            <Avatar
                              :width="32"
                              :name="option.fio"
                              :unique-code="option.userId"
                              :bg-color="option.userId.substr(option.userId.length - 3)"
                            />
                            <p>{{ option.fio }}</p>
                          </div>
                        </template>
                        <template #selected-option="option">
                          <div class="input--user">
                            <Avatar
                              :width="32"
                              :name="option.fio"
                              :unique-code="option.userId"
                              :bg-color="option.userId.substr(option.userId.length - 3)"
                            />
                            <p>{{ option.fio }}</p>
                          </div>
                        </template>
                      </VueSelect>
                    </div>
                    <div class="lesson--section">
                      <p>Место проведения</p>
                      <input id="location" v-model="lesson.replacement.location" type="text" class="input" required />
                    </div>
                  </div>
                  <button v-else class="button" @click.prevent="addReplacement(lesson)">Создать замену</button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="editor--actions">
        <button type="submit" class="button button__action">Сохранить</button>
        <button class="button button__hollow" @click.prevent="$router.back()">Отмена</button>
      </div>
    </form>
  </Loading>
</template>

<script lang="ts">
import Vue from 'vue'
import { find, remove } from 'lodash'
import { PlusIcon, MinusIcon } from 'vue-tabler-icons'

export default Vue.extend({
  name: 'EditTeacher',
  components: {
    PlusIcon,
    MinusIcon,
  },
  middleware: ['auth', 'approved', 'permissions'],
  data() {
    return {
      days: {
        selectedDay: null,
        variants: [
          {
            day: 1,
            name: 'Понедельник',
          },
          {
            day: 2,
            name: 'Вторник',
          },
          {
            day: 3,
            name: 'Среда',
          },
          {
            day: 4,
            name: 'Четверг',
          },
          {
            day: 5,
            name: 'Пятница',
          },
          {
            day: 6,
            name: 'Суббота',
          },
          {
            day: 7,
            name: 'Воскресенье',
          },
        ],
      },
      response: null,
      schedule: {
        weekDate: null,
        group: null,
        days: [],
      },
      results: {
        subjects: null,
        groups: null,
        bells: null,
        teachers: null,
      },
    }
  },
  async fetch() {
    await Promise.all([
      this.$axios.$get(process.env.apiUrl + `/subjects?limit=9999`),
      this.$axios.$get(process.env.apiUrl + `/groups?limit=9999`),
      this.$axios.$get(process.env.apiUrl + `/bells?limit=9999`),
      this.$axios.$get(process.env.apiUrl + `/users/teachers?limit=9999`),
    ])
      .catch((err) => {
        throw new Error(err.response.status)
      })
      .then((res) => {
        this.$data.results.subjects = res[0].items
        this.$data.results.groups = res[1].items
        this.$data.results.bells = res[2].items
        this.$data.results.teachers = res[3].items
      })
  },
  beforeMount() {
    if (this.$data.schedule.weekDate) this.$data.schedule.weekDate = this.$moment(Date.now()).startOf('isoWeek').format('YYYY-MM-DD')
  },
  meta: {
    permissions: ['schedules.manage'],
  },
  methods: {
    sortBells(day) {
      day.lessons.sort((a, b) => {
        const firstBell = find(this.$data.results.bells, (bell) => bell.bellId === a.bell)
        const secondBell = find(this.$data.results.bells, (bell) => bell.bellId === b.bell)
        if (!firstBell || !secondBell) return 0

        const currentTime = this.$moment(firstBell.startTime, 'HH:mm')
        const nextTime = this.$moment(secondBell.startTime, 'HH:mm')
        if (!currentTime.isAfter(nextTime)) return -1
        else if (currentTime.isAfter(nextTime)) return 1
        else return 0
      })
    },
    getDay(day) {
      return find(this.$data.schedule.days, { day })
    },
    getDayIndex(day) {
      return this.$data.schedule.days.indexOf(this.getDay(day))
    },
    selectDay(val) {
      if (this.$data.days.selectedDay === val) {
        this.$set(
          this.$data.schedule,
          'days',
          remove(this.$data.schedule.days, (item) => item.day !== val)
        )
        this.$data.days.selectedDay = null

        return
      }

      this.$data.days.selectedDay = val

      if (!this.getDay(val)) {
        this.$data.schedule.days.push({
          day: val,
          lessons: [],
        })
      }
    },
    isBellSelected(bell) {
      return this.getDay(this.$data.days.selectedDay).lessons.every((lesson) => lesson.bell !== bell.bellId)
    },
    addLesson(day) {
      const index = this.getDayIndex(day)
      if (!this.$data.schedule.days[index].lessons) return
      this.$data.schedule.days[index].lessons.push({
        subject: null,
        bell: null,
        teacher: null,
        location: null,
      })
    },
    addReplacement(lesson) {
      this.$set(lesson, 'replacement', {
        subject: null,
        teacher: null,
        location: null,
      })
    },
    deleteReplacement(lesson) {
      this.$delete(lesson, 'replacement')
    },
    deleteLesson(day, index) {
      const dayIndex = this.getDayIndex(day)
      if (!this.$data.schedule.days[dayIndex].lessons) return
      if (!this.$data.schedule.days[dayIndex].lessons[index]) return
      const lessons = this.$data.schedule.days[dayIndex].lessons
      lessons.splice(index, 1)
      this.$set(this.$data.schedule.days[dayIndex], 'lessons', lessons)
    },
    async add() {
      this.$data.response = await this.$axios.$post(process.env.apiUrl + `/schedules/`, this.schedule).catch((err) => err.response)

      if (this.$data.response.scheduleId) {
        this.$router.push('/management/schedules')
      }
    },
  },
})
</script>
