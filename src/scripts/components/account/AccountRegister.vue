<template lang="pug">
  section.container.container--login
    h1.heading.heading--2.account-login__heading Sign Up
    .login__main
      .row
        .small-12.medium-5.column
          .login__column
            slot
        .small-12.medium-2.column.login__divider
          .login__divider__line
        .small-12.medium-5.column.login__alt-container
          .login__column
            p.login__message {{ message }}
            .login__button.login__button--register
              p Already Have an Account?
              a.button.button--secondary(href="/account/login") Log In
</template>

<script>
  import AccountLogin from 'scripts/components/account/AccountLogin.vue';
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'AccountRegister',
    components: { Icon },
    extends: AccountLogin,
    props: {
      message: String,
    },
  };
</script>
