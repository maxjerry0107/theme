<template lang="pug">
  .cta-tile__content(:style="{ 'background-image': `linear-gradient(rgba(0,0,0,${overlayOpacity}), rgba(0,0,0,${overlayOpacity})), url(${backgroundImage})` }")
    h4.cta-tile__title {{ title }}
    p.cta-tile__description {{ description }}
    link-button.cta-tile__button(:href="btnLink" :label="btnText" :inverse="true")
</template>

<script>
  import LinkButton from 'scripts/components/buttons/LinkButton.vue';

  export default {
    name: 'CtaTile',
    components: { LinkButton },
    props: {
      title: String,
      description: String,
      btnText: String,
      btnLink: String,
      backgroundImage: String,
      overlayOpacity: String,
    },
  };
</script>

<style scoped lang="scss">
  .cta-tile {
    &__content {
      width: 100%;
      min-height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #fff;
      background-color: $bg--alt;
      background-size: cover;
      background-position: center;
      padding: 36px 20px;
      margin: 2px;

      @include tablet-up {
        min-height: unset;
        padding: 60px 40px;
      }
    }

    &__title {
      margin-top: 0;
      margin-bottom: 18px;
      font-family: $font-headings;
      font-size: rem(24);
      font-weight: bold;
      line-height: 33px;

      @include tablet-up {
        font-size: rem(36);
        line-height: 60px;
      }
    }

    &__description {
      margin-bottom: 16px;
      font-family: $font-body;
      font-size: rem(15);
      line-height: 2em;

      @include tablet-up {
        margin-bottom: 34px;
        font-size: rem(18);
      }
    }
  }
</style>
