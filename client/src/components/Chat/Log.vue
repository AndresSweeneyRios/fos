<template lang="pug">
  section.log
    //- .message
    //-   img.avatar( src="https://cdn.discordapp.com/avatars/97466512444493824/42acc98a2e976e1df5450184450768cb.png?size=128" )
    //-   div
    //-     .name Poison Apple
    //-       span.date Today at 2:49 PM
    //-     p.content Hello world!

    .message( v-for="({ avatar, name, date, content }, key) in messages" :key="key" )
      img.avatar( :src="avatar" :alt="`${name}'s avatar`" )
      
      div
        .name {{ name }}
          span.date {{ date }}

        Markdown.content( v-for="({ text }, key) in content" :key="key" ) {{ text }}
</template>

<script>
  import Markdown from './Markdown'

  export default {
    methods: {
      processLocaleString (timestamp) {
        const [date, time] = new Date(timestamp).toLocaleString()
          .split(', ')  
        
        return [date, time.replace(/:..\s/, ' ')]
      },

      processDate (timestamp) {
        const [date, time] = this.processLocaleString(timestamp)

        const [currentDate] = this.processLocaleString(Date.now())

        return currentDate === date ? time : `${date} - ${time}`
      },
    },

    components: {
      Markdown,
    },

    computed: {
      messages () {
        return [
          {
            avatar: 'https://cdn.discordapp.com/avatars/97466512444493824/42acc98a2e976e1df5450184450768cb.png?size=128',
            name: 'Poison Apple',
            timestamp: Date.now() - 5000000000,
            content: [
              {
                text: 'Hello `World!`',
              },
              {
                text: 'Also **hello** *world!*',
              },
              {
                text: 'And more ~~hello~~ world!',
              },
              {
                text: 
                  `\`\`\`js
const abc = 'def';

function helloWorld () {
  alert(\`hello world\`);
}
\`\`\``,
              },
            ],
          },
          {
            avatar: 'https://cdn.discordapp.com/avatars/97466512444493824/42acc98a2e976e1df5450184450768cb.png?size=128',
            name: 'Poison Apple',
            timestamp: Date.now(),
            content: [
              {
                text: 'Hello World!',
              },
            ],
          },
        ].map(
          ({
            timestamp, ...restProps 
          }) => ({
            date: this.processDate(timestamp),
            ...restProps,
          }),
        )
      },
    },
  }
</script>

<style lang="sass" scoped>
  section.log
    flex-grow: 1
    padding: 30px
    display: flex
    flex-direction: column
    justify-content: flex-end

    .message
      display: flex
      width: 100%
      align-items: flex-start

      > *
        width: 100%

      &:not(:first-child)
        margin-top: 15px

      img.avatar
        width: 45px
        height: 45px
        object-fit: cover
        background-color: white
        margin-right: 15px
        clip-path: circle(50% at 50% 50%)

      .name
        font-weight: bold
        margin-top: 3px
        display: flex
        align-items: center

      .date
        margin-left: 5px
        color: rgba(white, 0.65)
        font-weight: 200
        font-size: 10px

      .content
        color: rgba(white, 0.65)
</style>
