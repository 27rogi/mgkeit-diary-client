<template>
    <div class="schedule">
        <div class="schedule--controls">
            <nuxt-link class="button" :to="{ query: { date: prevWeek } }">Прошлая неделя</nuxt-link>
            <div class="schedule--week">
                <div v-if="hasPermissions(['teacher'])" class="schedule--panel">
                    <VueSelect
                        id="teacher_select"
                        v-model="group"
                        :clearable="false"
                        label="name"
                        :options="$auth.user.owner"
                        :reduce="(group) => group.groupId"
                        required
                    ></VueSelect>
                </div>
                <p v-if="schedule">
                    Расписание группы <span>{{ schedule.group.name }}</span> на {{ $moment(date).format('DD MMMM YYYY') }}
                </p>
                <h1 v-if="isEven"><span>Четная</span> неделя</h1>
                <h1 v-else><span>Нечетная</span> неделя</h1>
            </div>
            <nuxt-link class="button" :to="{ query: { date: nextWeek } }">Следующая неделя</nuxt-link>
        </div>
        <Loading :fetch-state="$fetchState">
            <div v-if="schedule" slot="content" class="schedule--days">
                <DayCard v-for="day in 7" :key="day" :date="$moment(date).add(day - 1, 'days')" :lessons="getLessonsByDay(day)" />
            </div>
        </Loading>
    </div>
</template>

<script lang="ts">
import { find } from 'lodash'
import Vue from 'vue'

export default Vue.extend({
    name: 'MainPage',
    data() {
        return {
            group: null,
            date: null,
            schedule: null,
        }
    },
    async fetch() {
        if (this.$route.query.date && this.$moment(this.$route.query.date, 'DD-MM-YYYY', true).isValid()) {
            this.$data.date = this.$moment(this.$route.query.date, 'DD-MM-YYYY', true).startOf('isoWeek')
        }

        if (this.hasPermissions(['teacher'])) {
            if (this.$auth.user.owner && this.$auth.user.owner.length > 0) this.group = this.$auth.user.owner[0].groupId
        } else {
            this.group = this.$auth.user.group.groupId;
        }

        this.schedule = await this.$axios
            .$get(process.env.apiUrl + `/schedules/group/${this.group}/${this.$data.date.format('YYYY-MM-DD')}`)
            .catch((err) => {
                throw new Error(err.response.status)
            })
            .then((res) => {
                res.days.sort((dayA, dayB) => {
                    return dayA.day - dayB.day
                })
                return res
            })
    },
    head() {
        return {
            title: 'Расписание',
        }
    },
    computed: {
        isEven() {
            return Math.abs(this.$moment(this.$data.date).week() - this.$moment('01 09', 'DD MM').week()) % 2 === 1
        },
        nextWeek() {
            return this.$moment(this.$data.date).add(1, 'weeks').startOf('isoWeek').isoWeekday(1).format('DD-MM-YYYY')
        },
        prevWeek() {
            return this.$moment(this.$data.date).subtract(1, 'weeks').startOf('isoWeek').isoWeekday(1).format('DD-MM-YYYY')
        },
    },
    watch: {
        $route() {
            this.$fetch()
        },
    },
    created() {
        this.$data.date = this.$moment(Date.now()).startOf('isoWeek')
    },
    activated() {
        if (this.$fetchState.timestamp <= Date.now() - 30000) {
            this.$fetch()
        }
    },
    methods: {
        getLessonsByDay(number) {
            // @ts-ignore
            const day = find(this.schedule.days, { day: number })
            return day ? day.lessons : null
        },
        hasPermissions(permissions) {
            return permissions.every((perm: string) => (<any>this.$auth.user.role).permissions.includes(perm))
        },
    },
})
</script>

<style scoped lang="scss">
.schedule {
    @apply w-full flex flex-col p-6 gap-12;
    .schedule--controls {
        @apply w-full z-[45] flex flex-row gap-2 items-center justify-center;
        * {
            @apply w-full;
        }
        span {
            @apply text-primary-400;
        }
        .schedule--week {
            @apply flex flex-col text-lg font-semibold text-center;
        }
    }
    .schedule--days {
        @apply flex flex-row flex-wrap gap-4 items-start justify-center content-center;
    }
}
</style>
