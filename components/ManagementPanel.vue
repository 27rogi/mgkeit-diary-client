<template>
  <div class="management-panel">
    <slot name="header" />
    <div class="management-panel--controls">
      <nuxt-link class="button button__hollow" :to="$props.data.buttonAddLink"><PlusIcon /> Внести данные</nuxt-link>
      <nuxt-link
        v-if="$props.data.hasPrevPage"
        :to="{ query: { page: $props.data.currentPage - 1 <= 0 ? 1 : $props.data.currentPage - 1 } }"
        class="button"
      >
        <PlayerTrackPrevIcon />
      </nuxt-link>
      <p>Страница {{ $props.data.currentPage }} из {{ $props.data.totalPages }}</p>
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
    data: {
      type: Object,
      required: true,
    } as PropOptions<ManagementPanelData>,
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
  }
}
</style>
