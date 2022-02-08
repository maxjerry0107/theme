<template lang="pug">
  .grid-tile
    img.grid-tile__image(
      v-if="tileImageSrc"
      v-lazy="tileImageSrc"
      :alt="tileImageAlt"
      :draggable="false"
      :width="tileImageWidth"
      :height="tileImageHeight"
    )
    .grid-tile__content
      h3.heading--6.grid-tile__title {{ collection.title }}
      p.grid-tile__description(
        v-if="!isMobile"
      ) {{ collection.description }}
      button-component.button--primary.button--primary-arrow(
        v-if="collection.link && collection.buttonText"
        :href="collection.link"
      )
        span {{ collection.buttonText }}
        icon(
          name="long-arrow-right"
          size="18px"
          class="button__icon"
        )
</template>

<script>
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'GridTile',
    components: {
      ButtonComponent,
      Icon,
    },
    props: {
      collection: {
        type: Object,
        default: () => ({
          title: String,
          description: String,
          link: String,
          buttonText: String,
          imageSrc: String,
          imageAlt: String,
          imageWidth: String,
          imageHeight: String,
          desktopImageSrc: String,
          desktopImageAlt: String,
          desktopImageHeight: String,
        }),
      },
    },
    computed: {
      tileImageSrc() {
        const { imageSrc, desktopImageSrc } = this.collection;
        return !desktopImageSrc || this.isMobile ? imageSrc : desktopImageSrc;
      },
      tileImageAlt() {
        const { imageAlt, desktopImageAlt } = this.collection;
        return !desktopImageAlt || this.isMobile ? imageAlt : desktopImageAlt;
      },
      tileImageWidth() {
        const { imageWidth, desktopImageWidth } = this.collection;
        return !desktopImageWidth || this.isMobile ? imageWidth : desktopImageWidth;
      },
      tileImageHeight() {
        const { imageHeight, desktopImageHeight } = this.collection;
        return !desktopImageHeight || this.isMobile ? imageHeight : desktopImageHeight;
      },
      isMobile() {
        return ['mobile'].includes(this.$mq);
      },
    },
  };
</script>
