<template>
    <transition-group name="fade-transform" mode="out-in">
      哈哈哈哈哈哈
      <inner-link
        v-for="(item, index) in iframeViews"
        :key="item.path"
        :iframeId="'iframe' + index"
        v-show="$route.path === item.path"
        :src="item.meta.link"
      ></inner-link>
    </transition-group>
  </template>
  
  <script>
  import InnerLink from "./InnerLink"
  
  export default {
    components: { InnerLink },
    computed: {
      iframeViews() {
        debugger
        return this.$store.state.tagsView.iframeViews
      }
    }
  }
  </script>
  