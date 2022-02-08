<template lang="pug">
  section.container.container--login
    h1.login__header {{ loginText }}
    .login__main
      .row
        .small-12.medium-5.column
          .login__column
            slot
        .small-12.medium-2.column.login__divider
          .login__divider__line
        .small-12.medium-5.column.login__alt-container
          .login__column
            .login__button.login__button--register
              p {{ needAccountText }}
              a.u-link(href="/account/register") {{ registerText }}
</template>

<script>
  import KlaviyoForm from 'scripts/components/forms/KlaviyoForm.vue';
  import Icon from 'scripts/components/basic/Icon.vue';
  import { htmlDecode } from 'scripts/helpers/util';

  // Note: AccountRegister extends this component
  export default {
    name: 'AccountLogin',
    KlaviyoForm,
    components: { Icon },
    props: {
      klaviyoListId: String,
      klaviyoSuccessMessage: String,
    },
    data() {
      return {
        loginText: window.bvaccel && window.bvaccel.locale_text ? htmlDecode(window.bvaccel.locale_text.customer.login.title) : 'Log In',
        needAccountText: window.bvaccel && window.bvaccel.locale_text ? htmlDecode(window.bvaccel.locale_text.customer.login.need_an_account) : 'Need an Account?',
        registerText: window.bvaccel && window.bvaccel.locale_text ? htmlDecode(window.bvaccel.locale_text.customer.register.sign_up) : 'Sign Up',
      };
    },
  };
</script>

<style lang="scss">
  $max-width-main-container: 1000px;
  $columns-extra-spacing-desktop: 25px;
  $form-input-margin: 12px;
  $button-padding: 14px;
  $divider-spacing-mobile: 46px;
  $divider-text-position-tablet: 30%; // From bottom

  .container--login {
    margin-bottom: $grid-gutter * 2;
    margin-top: $grid-gutter * 2;

    @include tablet-up {
      margin-bottom: 90px;
      margin-top: 56px;
    }
  }

  // Wraps row to avoid conflicting margins
  .login__main {
    max-width: $max-width-main-container;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;

    @include tablet-up {
      margin-top: 70px;
    }
  }

  .login__header {
    font-size: rem(23);
    line-height: rem(28);
    margin: 0;

    @include tablet-up {
      font-size: rem(35);
      line-height: rem(44);
    }
  }

  .login__column {
    // Extra spacing between columns for desktop
    @include desktop-up {
      &:first-child {
        margin-right: $columns-extra-spacing-desktop;
      }

      &:last-child {
        margin-left: $columns-extra-spacing-desktop;
      }
    }
  }

  .login__divider {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    // Divider text ("OR")
    &::after {
      // Horizontal position
      content: 'OR';
      position: absolute;
      font-size: 14px;
      line-height: 1;
      font-weight: 900;
      letter-spacing: 3px;
      padding: 18px;
      background-color: $color-white;
      left: 50%;
      transform: translateX(-50%);

      // Vertical position
      @include tablet-up {
        bottom: $divider-text-position-tablet;
        left: unset;
        transform: none;
      }
    }
  }

  .login__divider__line {
    // Horizontal line
    background-color: $border--light;
    width: 100%;
    height: 1px;
    margin-top: $divider-spacing-mobile;
    margin-bottom: $divider-spacing-mobile;

    // Vertical line
    @include tablet-up {
      width: 1px;
      height: 100%;
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  .login__alt-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  // Form spacing (slotted in)
  .login--input {
    margin-bottom: $form-input-margin;
  }

  .login--input-link {
    display: inline-block;
    margin-top: $form-input-margin * 2;
  }

  .login--input-submit {
    display: block;
    margin-top: $form-input-margin * 2.75;
  }

  .login__button {
    width: 100%;
    border: 1px solid $border--light;
    padding: $button-padding;

    &:not(:last-child) {
      margin-bottom: 24px;
    }
  }

  .login__button--social {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.3s ease;

    > .icon {
      position: absolute;
      left: $button-padding;
    }

    &:hover,
    &:active,
    &:focus {
      border-color: $color--primary;
    }
  }

  .login__button--register {
    text-align: center;
    padding: $button-padding + 6;

    p {
      margin-top: 0;
      margin-bottom: 4px;
    }
  }
</style>
