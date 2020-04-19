<template lang="pug">
  main#app
    Navigation
    router-view
</template>

<style lang="sass">
  @import '@/sass/global'
</style>

<style lang="sass" scoped>
  main#app
    display: flex
    width: 100vw
    height: 100vh
    background-color: var(--background)
</style>

<script>
  import Navigation from '@/components/Navigation'

  export default {
    components: {
      Navigation,
    },
  }
</script>
