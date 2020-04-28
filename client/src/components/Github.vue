<template lang="pug">
  a( href="https://github.com/Andr3wRiv3rs/fos" )
    Icon github
</template>

<script>
  import Icon from '@/components/Icon'

  export default {
    components: {
      Icon,
    },
  }
</script>

<style lang="sass" scoped>
  a
    position: absolute
    bottom: 15px
    right: 15px
    display: flex
    align-items: center
    justify-content: center
    fill: var(--white)

    svg
      height: 35px
      width: 35px
</style>
