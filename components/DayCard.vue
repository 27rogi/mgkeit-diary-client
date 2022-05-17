<template>
  <div
    class="day"
    :class="{ day__inactive: !lessons || lessons.length < 0, day__active: date.startOf('day').isSame($moment(Date.now()).startOf('day')) }"
  >
    <p class="day--date">{{ $props.date.format('dddd, DD MMMM') }}</p>
    <div class="day--lessons">
      <template v-if="lessons && lessons.length > 0">
        <div v-for="(lesson, index) in lessons" :key="index" class="lesson">
          <div class="lesson--header">
            <p class="lesson--subject">
              {{ lesson.replacement ? lesson.replacement.subject.name : lesson.subject.name }}
              <span v-if="lesson.replacement" class="replaced">Замена</span>
            </p>
            <p class="lesson--time">{{ lesson.bell.startTime }}<span>-</span>{{ lesson.bell.endTime }}</p>
          </div>
          <p><span>Учитель:</span> {{ lesson.replacement ? lesson.replacement.teacher.fio : lesson.teacher.fio }}</p>
          <p><span>Место проведения:</span> {{ lesson.replacement ? lesson.replacement.location : lesson.location }}</p>
        </div>
      </template>
      <div v-else class="day--none">
        <p>Занятия на данный день отсутствуют.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'DayCardComponent',
  props: {
    date: {
      type: Object,
      default: null,
    },
    lessons: {
      type: Array,
      default: null,
    },
  },
})
</script>

<style scoped lang="scss">
.day {
  @apply flex flex-col gap-1 bg-bg-800 rounded-xl p-4 w-[30%];
  &::last-child {
    @apply col-end-auto;
  }

  .day--date {
    @apply text-2xl text-white font-bold mb-2;
  }

  .day--lessons {
    @apply grid grid-cols-1 gap-2;
    .lesson {
      @apply flex flex-col bg-bg-200/10 p-2 -mx-2 rounded-xl font-semibold;
      .lesson--header {
        @apply flex flex-row w-full mb-2;
        .lesson--subject {
          @apply text-primary-400;
        }
        .lesson--time {
          @apply ml-auto;
        }
      }
      .replaced {
        @apply ml-1 text-xs text-white bg-red-500/50 px-2 py-0.5 rounded-xl;
      }

      span {
        @apply text-bg-200/90;
      }
    }
  }

  &__active {
    @apply bg-bg-600/50;
    .day--lessons {
      .lesson {
        @apply bg-bg-400/30;
      }
    }
  }
  &__inactive {
    @apply opacity-60;
  }
}
</style>
