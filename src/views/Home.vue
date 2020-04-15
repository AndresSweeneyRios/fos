<template lang="pug">
    section
</template>

<script>
    import db from 'localforage'

    export default {
        name: 'Home',

        async mounted () {
            await this.$store.dispatch('CryptoSetup')
            window.rsa = this.$store.state.rsa
            window.db = db
        },
    }
</script>
