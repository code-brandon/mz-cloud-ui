<template>
    <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners" />
    <svg v-else-if="isSvg" :class="svgClass" aria-hidden="true" v-on="$listeners">
      <use :xlink:href="iconName" />
    </svg>
    <i v-else :class="iconName"></i>
  </template>
  
  <script>
  import '@/assets/icons'
  // doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
  import { isURL } from '@/utils/mz-utils'
  
  export default {
    name: 'MzIcon',
    props: {
      iconClass: {
        type: String,
        // required: true,
        default: ''
      },
      className: {
        type: String,
        default: ''
      },
      allName: {
        type: String,
        default: ''
      }
    },
    computed: {
      isExternal() {
        return isURL(this.iconClass)
      },
      isSvg(){
          return this.iconClass ? true : this.allName.includes('svg-icon-')
      },
      iconName() {
        return  this.allName ?  this.isSvg  ? `#${this.allName}` : this.allName : `#svg-icon-${this.iconClass}`
      },
      svgClass() {
        if (this.className) {
          return 'svg-icon ' + this.allName || this.className
        } else {
          return 'svg-icon'
        }
      },
      styleExternalIcon() {
        return {
          mask: `url(${this.iconClass}) no-repeat 50% 50%`,
          '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  
  .svg-external-icon {
    background-color: currentColor;
    mask-size: cover!important;
    display: inline-block;
  }
  </style>