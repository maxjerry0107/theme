<template lang="pug">
  footer.footer
    .footer__container.container.container--wide
      .footer__logo
        icon(
          name="logo-mini"
          width="55px"
          height="56px"
          class="footer__logo-mini"
        )
      .footer__content.row.collapse
        .footer__content-left.column.small-up-no-gutters.small-12.large-9
          slot(name="footer-content")
        .footer__content-right.column.small--no-gutters.small-12.large-3
          .footer__content-right__headline {{ klaviyoHeadline }}
          p.footer__content-right__message {{ klaviyoDescription }}
          klaviyo-form(
            form-id="email_signup_footer"
            :list-id="klaviyoListId",
            :message="klaviyoSuccessMessage"
          )
          slot(name="footer-social")
      .footer__footer
        slot(name="footer-bottom")
</template>

<script>
  import KlaviyoForm from 'scripts/components/forms/KlaviyoForm.vue';
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'SiteFooter',
    components: {
      KlaviyoForm,
      Icon,
    },
    props: {
      klaviyoHeadline: String,
      klaviyoDescription: String,
      copyright: String,
      klaviyoListId: String,
      klaviyoSuccessMessage: String,
    },
  };
</script>

<style lang="scss"></style>
