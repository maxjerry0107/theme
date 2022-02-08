<template lang="pug">
  .toast
    transition-group(name="slide-fade-right")
      .toast__message(
        v-for="message in messages", 
        :key="message.id",
        :class="{ 'error': message.type === 'toast__message--error' }"
      )
        p.toast__message-copy(v-html="message.text")
        v-button.toast__message-cta(
          v-if="message.callback", 
          :small="true", 
          :secondary="true", 
          :label="message.label", 
          @click="message.callback"
        )
</template>

<script>
  import { mapState } from 'vuex';
  import VButton from 'scripts/components/buttons/VButton.vue';

  export default {
    name: 'Toast',
    components: { VButton },
    computed: {
      ...mapState({
        messages: (state) => state.toast.messages,
      }),
    },
  };
</script>

<style lang="scss">
  .toast {
    position: fixed;
    bottom: 10px;
    left: 10px;
    z-index: index($layout, toast);
    max-width: calc(100% - 20px);
    color: $text--light;
    text-align: center;

    @include tablet-up {
      text-align: left;
    }
  }

  .toast__message {
    display: flex;
    margin-top: 10px;
    padding: 10px 20px;
    align-items: center;
    justify-content: space-between;
    background-color: $bg--dark;
    border-radius: 4px;

    &.toast__message--error {
      background-color: $color--error;
    }
  }

  .toast__message-copy {
    line-height: 1.7;
  }

  .toast__message-cta {
    margin-left: 10px;
  }
</style>
