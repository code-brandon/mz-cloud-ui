<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
  import { isURL } from 'utils/mz-utils.js'

  export default {
    // 组件名称
    name: 'Link',
    props: {
      to: {
        type: [String, Object],
        required: true
      }
    },
    computed: {
      isExternal() {
        return isURL(this.to)
      },
      type() {
        if (this.isExternal) {
          return 'a'
        }
        return 'router-link'
      }
    },
    methods: {
      linkProps(to) {
        if (this.isExternal) {
          return {
            href: to,
            target: '_blank',
            rel: 'noopener'
          }
        }
        return {
          to: to
        }
      }
    }
  }
</script>
