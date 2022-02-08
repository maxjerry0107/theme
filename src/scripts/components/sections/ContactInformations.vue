<template lang="pug">
  .contact-informations.container
    h2 {{ heading }}
    p.contact-informations__paragraph.paragraph.paragraph--large {{ paragraph }}
    .contact-informations__info
      a.contact-informations__email(:href="link")
        span {{ email }}
      span.contact-informations__spacing |
      span.contact-informations__phone {{ phone }}
</template>

<script>
  export default {
    name: 'ContactInformations',
    props: {
      heading: String,
      phone: String,
      paragraph: String,
      email: String,
      link: String,
    },
  };
</script>

<style scoped lang="scss">
  .contact-informations {
    margin: 0 auto;
    text-align: center;
    padding-top: $spacing-unit * 30;
    padding-bottom: $spacing-unit * 30;
    margin-bottom: $spacing-unit * 10;
    background-color: $color-white;
  }

  .contact-informations__info {
    display: inline;
  }

  .contact-informations__spacing {
    margin: 0 $spacing-unit * 2;
  }

  .contact-informations__phone {
    padding-top: 10px;
  }

  .contact-informations__email {
    padding-top: 10px;
  }

</style>
