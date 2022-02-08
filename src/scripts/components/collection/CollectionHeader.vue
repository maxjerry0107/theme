<template lang="pug">
  .collection-header
    .collection-header__container
      .collection-header__banner(
        v-if="currentImage"
      )
        img.collection-header__collection-image(
          :src="currentImage"
          :alt="settings.imageAlt"
        )
      .collection-header__content(v-if="settings.heading")
        h1.collection-header__heading.heading--6.text-align--center {{ settings.heading }}
        .collection-header__description.paragraph--x-small.text-align--center(
          v-if="settings.description"
          v-html="bodyText"
        )
</template>

<script>

  export default {
    name: 'CollectionHeader',
    components: {},
    props: {
      settings: {
        type: Object,
        default: () => ({
          heading: String,
          description: String,
          breadcrumbs: Array,
          url: String,
          mobileImage: String,
          desktopImage: String,
          imageRatio: String,
          mobileRatio: {
            type: String,
            default: '5:2',
          },
          imageAlt: String,
        }),
      },
    },
    computed: {
      currentImage() {
        const { mobileImage, desktopImage } = this.settings;
        return ['mobile'].includes(this.$mq) ? mobileImage : desktopImage;
      },
      bodyText() {
        const { description } = this.settings;
        return String(description)
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"');
      },
    },
  };
</script>

<style scoped lang="scss">
  .collection-header {
    @include mobile-only {
      margin-bottom: $spacing-unit * 2.5;
    }

    @include tablet-up {
      margin-bottom: rem(30);
    }

    @include desktop-up {
      margin-bottom: rem(48);
    }
  }

  .collection-header__container {
    display: flex;
    flex-direction: column;
    height: auto;
    width: 100%;

    @include desktop-up {
      flex-direction: row-reverse;
      justify-content: space-between;
      align-items: center;
      height: 260px;
    }
  }

  .collection-header__heading {
    margin-bottom: $spacing-unit;
  }

  .collection-header__banner {
    display: inline;
    height: 140px;
    width: 100%;

    @include tablet-up {
      height: 200px;
    }

    @include desktop-up {
      width: 50%;
      height: 260px;
      max-width: 710px;
    }
  }

  .collection-header__collection-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .collection-header__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: rem(12) rem(20);
    background: $color-teal-800;

    @include desktop-up {
      height: 100%;
      width: auto;
      flex: 1;
      padding-left: rem(80);
    }
  }

  .collection-header__heading,
  .collection-header__description {
    max-width: rem(315);
    margin: 0;
    color: $color-white;

    @include tablet-up {
      max-width: rem(417);
    }
  }

  .collection-header__description {
    padding: 0 ($spacing-unit * 5);
    font-size: $font-size-body-small;
    letter-spacing: rem(1);
  }
</style>
