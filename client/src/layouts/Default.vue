<template lang="pug">
  main
    Navigation
    router-view
</template>

<script>
  import Navigation from '@/components/Navigation'

  export default {
    components: {
      Navigation,
    },
  }
</script>
