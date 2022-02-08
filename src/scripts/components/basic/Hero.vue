<template lang="pug">
  .hero(:style="heroStyles")
   .hero__container
    .hero__content
      h1.hero__heading(
        v-if="title"
        :style="{'color': titleColor}"
        v-html="title"
        class="heading--1"
      )
      p.hero__body-text(
        v-if="bodyText"
        class="body--large"
        :style="{'color': bodyTextColor}"
        v-html="bodyTextConvert(bodyText)"
      )
      button-component.hero__cta(
        v-if="ctaLabel && ctaLink"
        :href="ctaLink"
        :class="`button--${ctaType} button--small`"
      )
        span {{ ctaLabel }}

    .hero__image-wrapper
      img.hero__image(
        :src="image"
        :alt="imageAlt"
      )
</template>

<script>
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';

  export default {
    name: 'Hero',
    components: {
      ButtonComponent,
    },
    props: {
      backgroundColor: {
        type: String,
        default: 'transparent',
      },
      marginTop: {
        type: Object,
        default: () => {
          return {
            desktop: {
              type: String,
              default: '0',
            },
            mobile: {
              type: String,
              default: '0',
            },
          };
        },
      },
      marginBottom: {
        type: Object,
        default: () => {
          return {
            desktop: {
              type: String,
              default: '1.75rem',
            },
            mobile: {
              type: String,
              default: '1.75rem',
            },
          };
        },
      },
      image: String,
      imageAlt: String,
      bodyText: String,
      bodyTextColor: String,
      ctaLabel: String,
      ctaLink: String,
      ctaType: String,
      title: String,
      titleColor: String,
    },
    computed: {
      isMobile() {
        return ['mobile', 'tablet'].includes(this.$mq);
      },
      heroStyles() {
        const { backgroundColor, $mq } = this;
        const marginTop = $mq === 'tablet' ? 'desktop' : this.marginTop[$mq];
        const marginBottom = $mq === 'tablet' ? 'desktop' : this.marginBottom[$mq];
        return { backgroundColor, marginTop, marginBottom };
      },
    },
    methods: {
      bodyTextConvert(text) {
        return String(text)
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"');
      },
    },
  };
</script>
<style scoped lang="scss">
  .hero {
    position: relative;
    z-index: index($layout, 'page-layout-content');
    margin-bottom: px-to-rem(18px);

    @include tablet-up {
      margin-bottom: px-to-rem(54px);
    }
  }

  .hero__heading {
    margin-bottom: px-to-rem(40px);

    @include mobile-only {
      font-size: $font-size-heading-5;
      font-weight: $font-weight-bold;
      line-height: px-to-rem(25px);
      letter-spacing: initial;
      margin-bottom: px-to-rem(16px);
    }
  }

  .hero__container {
    display: flex;
    justify-content: space-between;
    padding: 0 px-to-rem(17px);

    @include desktop-up {
      padding: 0 px-to-rem(100px);
    }
  }

  .hero__content {
    padding: px-to-rem(16px) 0;

    @include tablet-up {
      max-width: 400px;
      padding: px-to-rem(80px) 0;
    }

    @include desktop-up {
      max-width: 600px;
      padding: px-to-rem(174px) 0;
    }
  }

  .hero__body-text {
    margin-bottom: px-to-rem(16px);

    @include mobile-only {
      font-size: $font-size-body-small;
      line-height: px-to-rem(14px);
    }

    @include tablet-up {
      margin-bottom: px-to-rem(48px);
    }
  }

  .hero__image-wrapper {
    position: relative;
    top: px-to-rem(18px);
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    max-width: 120px;

    @include tablet-up {
      max-width: 530px;
      top: px-to-rem(54px);
    }
  }

  .hero__image {
    max-height: 100%;
  }

  .hero__cta {
    margin-bottom: 0;
  }
</style>
