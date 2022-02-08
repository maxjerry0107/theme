<template lang="pug">
  form.notify-me-form(
    v-if="notifyMeEnabled && showNotifyMe"
    v-on:submit.prevent="sendBisRequest"
  ) 
    .notify-me-form__not-submitted(
      v-if="!notifymeSubmitted"
    )
      .notify-me-form__heading(
        v-html="notifiyMeHeading"
      )
      .notify-me-form__input-wrapper
        text-input.notify-me-form__input(
        type="email",
        name="email",
        id="notify_email",
        value="",
        label="Email Address",
        placeholder="Email Address",
        autocorrect="off",
        autocapitalize="off",
        autocomplete="email",
        v-model="emailInput"
        required
        aria-label="Email"
        icon="long-arrow-right"
        icon-is-submit-button
        width="30px"
        height="12px"
        hide-label
      )

    .notify-me-form__submitted(
      v-else
    )
      .notify-me-form__message(
        v-if="notifiyMeError !== ''"
      )
        p
          strong {{ notifiyMeError }}
      .notify-me-form__message(
        v-else
        v-html="notifiyMeSuccess"
      )
</template>

<script>
  import TextInput from 'scripts/components/forms/TextInput.vue';

  export default {
    name: 'BisForm',
    components: {
      TextInput,
    },
    props: {
      notifyMeEnabled: {
        type: Boolean,
        default: true,
      },
      showNotifyMe: {
        type: Boolean,
        default: true,
      },
      notifiyMeHeading: String,
      notifiyMeText: String,
      productId: Number,
      variantId: Number,
      customerEmail: String,
    },
    data() {
      return {
        notifymeSubmitted: false,
        notifiyMeError: '',
        notifiyMeSuccess: '',
        emailInput: this.customerEmail,
      };
    },
    methods: {
      async sendBisRequest() {
        const { emailInput, variantId, productId } = this;
        let response = null;
        if (window.BIS && window.BIS.create) {
          response = await window.BIS.create(emailInput, variantId, productId);
        } else if (window.BISPopover && window.BISPopover.create) {
          response = await window.BISPopover.create(emailInput, variantId, productId);
        }
        const { errors, message } = response;
        this.notifiyMeError = errors && errors.base && errors.base.length ? errors.base[0] : '';
        // eslint-disable-next-line no-nested-ternary
        this.notifiyMeSuccess = !errors && this.notifiyMeText !== '' ? this.notifiyMeText : message ? `<p><strong>${message}</strong></p>` : '';
        this.notifymeSubmitted = true;
      },
    },
  };
</script>
