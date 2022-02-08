<template lang="pug">
  .collection-tile(
    :is="collection.link ? 'a' : 'div'"
    :href="collection.link"
  )
    .collection-tile__image-wrapper
      img.collection-tile__image(
        v-lazy="collection.imageSrc"
        :alt="collection.imageAlt"
        :draggable="false"
      )
    .collection-tile__content
      h4.heading--h4.collection-tile__title {{ collection.title }}
      p.collection-tile__body {{ collection.description }}
</template>

<script>
  export default {
    props: {
      collection: {
        type: Object,
        default: () => ({
          title: String,
          description: String,
          link: String,
          imageSrc: String,
          imageAlt: String,
        }),
      },
    },
    computed: {
      collectionTileStyles() {
        const { imageSrc, desktopImageSrc } = this.collection;

        return {
          backgroundImage: `url("${['mobile', 'tablet'].includes(this.$mq) || !desktopImageSrc ? imageSrc : desktopImageSrc}")`,
        };
      },
      isMobile() {
        return ['mobile'].includes(this.$mq);
      },
    },
  };
</script>
