<template>
  <div class="management-panel">
    <slot name="header" />
    <div class="management-panel--controls">
      <slot name="controls" />
      <VueSelect
        v-if="$props.sortOptions"
        id="teacher_select"
        :clearable="false"
        label="title"
        :options="$props.sortOptions"
        :reduce="(sort) => sort.field"
        required
        placeholder="Сортировка"
        @option:selected="onSelect"
      ></VueSelect>
      <nuxt-link class="button" :to="$props.data.buttonAddLink"><PlusIcon /> Внести данные</nuxt-link>
      <nuxt-link
        v-if="$props.data.hasPrevPage"
        :to="{ query: { page: $props.data.currentPage - 1 <= 0 ? 1 : $props.data.currentPage - 1 } }"
        class="button"
      >
        <PlayerTrackPrevIcon />
      </nuxt-link>
      <p v-if="$props.data.hasNextPage || $props.data.hasPrevPage">Страница {{ $props.data.currentPage }} из {{ $props.data.totalPages }}</p>
      <nuxt-link v-if="$props.data.hasNextPage" :to="{ query: { page: $props.data.currentPage + 1 } }" class="button button__action">
        <PlayerTrackNextIcon />
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { PlusIcon, PlayerTrackNextIcon, PlayerTrackPrevIcon } from 'vue-tabler-icons'

interface ManagementPanelData {
  hasPrevPage: boolean
  hasNextPage: boolean
  currentPage: number
  totalPages: number

  buttonAddLink: string
}

export default Vue.extend({
  name: 'LoadingComponent',
  components: {
    PlusIcon,
    PlayerTrackNextIcon,
    PlayerTrackPrevIcon,
  },
  props: {
    sortOptions: {
      type: Array,
      required: false,
      default: null,
    },
    data: {
      type: Object,
      required: true,
    } as PropOptions<ManagementPanelData>,
  },
  methods: {
    onSelect(option) {
      this.$emit('onSelect', option)
    },
  },
})
</script>

<style lang="scss">
.management-panel {
  @apply flex flex-row items-center gap-2 p-4 rounded-xl bg-bg-700;
  h1 {
    @apply text-primary-400 font-bold text-3xl;
  }
  .management-panel--controls {
    @apply ml-auto flex flex-row items-center gap-2 text-lg font-semibold;
    .vs__search {
      @apply py-1;
    }
    .v-select {
      @apply min-w-[236px];
    }
  }
}
</style>
