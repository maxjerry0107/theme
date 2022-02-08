<template lang="pug">
  section.featured-collections.cv--auto
    .container.container--wide.featured-collections__container
      h3.heading--3.featured-collections__title {{ title }}
      .featured-collections__carousel-container
        .carousel--featured-collections(
          :is="isMobile ? 'carousel': 'div'"
          :slides-to-show="1.7"
          dots
          draggable
        )
          .slide--featured-collections(
            :is="isMobile ? 'slide': 'div'"
            v-for="(collection) in collections"
            :key="`${collection.title}`"
          )
            collection-tile(:collection="collection")
</template>

<script>
  import Carousel from 'scripts/components/basic/Carousel.vue';
  import Slide from 'scripts/components/basic/Slide.vue';
  import CollectionTile from 'scripts/components/sections/CollectionTile.vue';

  export default {
    components: {
      Carousel,
      Slide,
      CollectionTile,
    },
    props: {
      title: String,
      collections: {
        type: Array,
        default: () => [],
      },
    },
    computed: {
      isMobile() {
        return ['mobile'].includes(this.$mq);
      },
    },
  };
</script>
