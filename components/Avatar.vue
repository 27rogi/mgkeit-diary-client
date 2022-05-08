<template>
  <img
    :width="$props.width"
    :src="`https://ui-avatars.com/api/?name=${$props.name}_${$props.uniqueCode}&length=1&size=128&font-size=0.7&bold=true&background=${$props.bgColor}`"
  />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AvatarComponent',
  props: {
    width: {
      type: Number,
      default: 24,
    },
    name: {
      type: String,
      default: null,
    },
    uniqueCode: {
      type: String,
      default: null,
    },
    bgColor: {
      type: String,
      default: null,
    },
  },
})
</script>
