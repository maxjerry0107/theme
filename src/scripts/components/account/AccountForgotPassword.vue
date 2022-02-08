<template lang="pug">
  transition(name="fade")
    .modal(v-if="isVisible")
      .modal__overlay(@click="close")
      .modal__content
        icon-button.modal__close(label="Close Modal", icon="close", @click="close")
        slot
</template>

<script>
  import Modal from 'scripts/components/basic/Modal.vue';
  import IconButton from 'scripts/components/buttons/IconButton.vue';

  export default {
    name: 'AccountForgotPassword',
    components: { IconButton },
    extends: Modal,
  };
</script>

<style lang="scss">
  .login--forgotpw-header {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: rem(28);
    line-height: rem(35);
  }

  .login--forgotpw-text {
    margin-top: 16px;
    margin-bottom: 16px;
  }

  .login--forgotpw-submit {
    margin-top: 26px;
    display: block;
  }
</style>

<style lang="scss" scoped>
  .modal__content {
    @include tablet-up {
      max-width: 550px;
    }
  }
</style>
