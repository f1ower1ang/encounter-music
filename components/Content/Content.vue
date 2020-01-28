<template>
  <div class="content-container">
    <tab />
    <div class="container">
      <slot />
    </div>
  </div>
</template>

<script>
import Tab from '../../components/Tab/Tab'
export default {
  components: { Tab }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/variable.styl"
  .content-container
    height 100%
    .container
      position absolute
      top 32px
      bottom 0
      overflow auto
      left 0
      right 0
      scrollbar-width: none; /* firefox */
      -ms-overflow-style: none; /* IE 10+ */
      &::-webkit-scrollbar
        display: none; /* Chrome Safari */
</style>
