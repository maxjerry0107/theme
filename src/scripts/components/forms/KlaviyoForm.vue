<template lang="pug">
  form.klaviyo-form.footer__news-letter__form(
    :id="formId"
    :class="embedClass",
    data-ajax-submit="//manage.kmail-lists.com/ajax/subscriptions/subscribe",
    action='//manage.kmail-lists.com/subscriptions/subscribe',
    method='GET',
    target="_blank",
    accept-charset='UTF-8',
    _lpchecked='1',
    @submit='showMessaging'
    novalidate='novalidate'
  )
    input(type='hidden', name='form_type', value='customer')
    input(type='hidden', name='g', :value='listId')

    transition(name="slideOut")
      text-input.klaviyo-form__input.text-input__email-capture(
        v-if="notSubmitted"
        type="email",
        name="email",
        id="k_id_email",
        value="",
        label="Email Address",
        placeholder="Email Address",
        autocorrect="off",
        autocapitalize="off",
        autocomplete="email",
        v-model="emailInput"
        required
        aria-label="Email"
        icon="arrow-long-right"
        icon-is-submit-button
        width="30px"
        height="12px"
        hide-label
      )
    transition(name="slideIn")
      p.contact-form__success(v-if="isSuccess && message") {{ message }}
</template>

<script>
  import TextInput from 'scripts/components/forms/TextInput.vue';
  import RadioInput from 'scripts/components/forms/RadioInput.vue';
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'KlaviyoForm',
    components: {
      TextInput,
      RadioInput,
      Icon,
    },
    props: {
      formId: {
        type: String,
        default: 'email_signup',
      },
      message: String,
      listId: String,
    },
    data() {
      return {
        isSuccess: false,
        notSubmitted: true,
        emailInput: '',
        shoppingfor: 'womens',
      };
    },
    computed: {
      embedClass() {
        return `klaviyo_embed_${this.listId}`;
      },
      idSelector() {
        return `#${this.formId}`;
      },
    },
    mounted() {
      this.$nextTick(() => {
        const klaviyoInterval = setInterval(() => {
          // eslint-disable-next-line no-undef
          if (KlaviyoSubscribe) {
            clearInterval(klaviyoInterval);
            this.attachKlaviyo();
          }
        }, 500);
      });
    },
    methods: {
      attachKlaviyo() {
        // eslint-disable-next-line no-undef
        if (KlaviyoSubscribe) {
          // eslint-disable-next-line no-undef
          KlaviyoSubscribe.attachToForms(this.idSelector, {
            hide_form_on_success: true,
            custom_success_message: true,
          });
        }
      },
      unBindForm() {
        jQuery(this.idSelector).ajaxFormUnbind();
      },
      showMessaging() {
        this.notSubmitted = false;
        setTimeout(() => {
          this.isSuccess = true;
        }, 500);
      },
    },
  };
</script>
