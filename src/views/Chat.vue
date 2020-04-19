<template lang="pug">
  section.chat
    Log
    Input
</template>

<style lang="sass" scoped>
  section.chat
    display: flex
    flex-direction: column
    width: 100%
</style>

<script>
import db from 'localforage'

import Log from '@/components/Chat/Log'
import Input from '@/components/Chat/Input'

export default {
  name: 'Home',

  components: {
    Log,
    Input,
  },

  async mounted () {
    await this.$store.dispatch('CryptoSetup')
    window.rsa = this.$store.state.rsa
    window.db = db
  },
}
</script>
