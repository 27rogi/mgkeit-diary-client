<template>
    <div class="info-panel">
        <div class="info-panel--day">
            <h1>Информация о дне недели</h1>
            <p>
                Сейчас <span>{{ $moment(datetime).format('dddd, DD MMMM YYYY') }} года</span>.
            </p>
            <p>
                Текущая неделя является
                <span>{{ Math.abs($moment(datetime).week() - this.$moment('01 09', 'DD MM').week()) % 2 === 1 ? 'четной' : 'нечетной' }}</span
                >.
            </p>
        </div>
        <div v-if="!hasPermissions(['panel.admin'])" class="info-panel--lessons">
            <h1>Расписание уроков</h1>
            <template v-if="!error && schedule">
                <div v-for="(lesson, index) in lessonsToday" :key="index" class="lesson">
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
            <p v-else-if="error && error.status === 404">Расписание на текущий день отсутствует.</p>
            <p v-else>Произошла ошибка при получении расписания.</p>
        </div>
        <div v-else class="info-panel--admin">
            <div v-if="admin.users" class="admin--users">
                <h1>Пользователи в системе</h1>
                <h1 class="admin--value">{{ admin.users.length }}</h1>
            </div>
            <div v-if="admin.awaiting" class="admin--awaiting">
                <h1>Ожидают одобрения</h1>
                <h1 class="admin--value">{{ admin.awaiting.length }}</h1>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { filter } from 'lodash';
import Vue from 'vue'

export default Vue.extend({
    name: 'IndexPage',
    data() {
        return {
            error: null,
            group: null,
            datetime: null,
            weekday: null,
            schedule: null,
            admin: {
                awaiting: null,
                users: null,
            }
        }
    },
    async fetch() {
        this.$data.datetime = Date.now();

        this.$data.weekday = 1 + (Number(this.$moment(this.datetime).format('D')) - Number(this.$moment(this.datetime).startOf('isoWeek').format('D')));

        if (this.hasPermissions(['panel.admin'])) {
            await Promise.all([
                this.$axios.$get(process.env.apiUrl + `/users/awaiting?limit=9999`),
                this.$axios.$get(process.env.apiUrl + `/users?limit=9999`),
            ])
                .catch((err) => {
                    throw new Error(err.response.status)
                })
                .then((res) => {
                    this.$data.admin.awaiting = res[0].items
                    this.$data.admin.users = res[1].items
                })
            return;
        }

        if (this.hasPermissions(['teacher'])) {
            if (this.$auth.user.owner && this.$auth.user.owner.length > 0) this.group = this.$auth.user.owner[0].groupId
        } else {
            this.group = this.$auth.user.group.groupId;
        }

        this.schedule = await this.$axios
            .$get(process.env.apiUrl + `/schedules/group/${this.group}/${this.$moment(this.$data.datetime).startOf('isoWeek').format('YYYY-MM-DD')}`)
            .catch((err) => {
                this.error = err;
            }).then((res) => {
                if (!this.error) {
                    res.days.sort((dayA, dayB) => {
                        return dayA.day - dayB.day
                    })

                    return res;
                }
                return null;
            })
    },
    computed: {
        lessonsToday() {
            const lessons = filter(this.$data.schedule.days, { day: this.$data.weekday });
            if (lessons.length <= 0) return null;
            return lessons[0].lessons;
        }
    },
    methods: {
        hasPermissions(permissions) {
            return permissions.every((perm: string) => (<any>this.$auth.user.role).permissions.includes(perm))
        },
    },
    head() {
        return {
            title: 'Главная страница',
        }
    },
})
</script>

<style lang="scss" scoped>
.info-panel {
    @apply grid grid-cols-6 gap-6 p-6 items-start text-lg font-medium;

    h1 {
        @apply text-2xl font-bold text-white mb-2;
    }

    .info-panel--day {
        @apply col-span-2 flex flex-col p-6 bg-bg-700 rounded-xl;
        span {
            @apply text-primary-400;
        }
    }
    .info-panel--lessons {
        @apply col-span-4 flex flex-col p-6 bg-bg-700 rounded-xl gap-2;
        .lesson {
            @apply flex flex-col bg-bg-200/20 p-4 -mx-2 rounded-xl font-semibold;
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
    .info-panel--admin {
        @apply col-span-4 grid grid-cols-4 gap-6 items-start;
        .admin--awaiting {
            @apply flex flex-col p-6 bg-bg-700 rounded-xl gap-2 col-span-2;
        }
        .admin--users {
            @apply flex flex-col p-6 bg-bg-700 rounded-xl gap-2 col-span-2;
        }

        .admin--value {
            @apply text-4xl font-bold text-primary-400;
        }
    }
}
</style>
