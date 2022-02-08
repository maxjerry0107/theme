<template lang="pug">
  .collection-footer
    .collection-footer__container.container--wide
      h2.collection-footer__heading(v-if="settings.heading") {{ settings.heading }}
      h3.collection-footer__sub-heading(v-if="settings.subHeading") {{ settings.subHeading }}
      .collection-footer__content.row(
        :is="$mq === 'mobile' ? 'carousel' : 'div'"
        dots
      )
        .collection-footer__collection.column.small-12.medium-4(
          v-for="(collection, index) in settings.collections"
          :is="$mq === 'mobile' ? 'slide' : 'div'"
          :key="`collection-footer_${_uid}_collection${index}`"
        )
          a.collection-footer__collection-link(:href="collection.url")
            picture
              source(media="(max-width:649px)" :srcset="imageFilter(collection.image, '300x')")
              img.collection-footer__collection-image(:src="imageFilter(collection.image, '500x')" :alt="collection.imageAltText")
            h4.collection-footer__collection-title {{ collection.title }}
</template>

<script>
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';
  import Carousel from 'scripts/components/basic/Carousel.vue';
  import Slide from 'scripts/components/basic/Slide.vue';
  import { getSizedImageUrl } from 'scripts/helpers/images.js';


  export default {
    name: 'CollectionFooter',
    components: {
      ButtonComponent,
      Carousel,
      Slide
    },
    props: {
      settings: Object
    },
    methods: {
      imageFilter(image, size){
        return getSizedImageUrl(image, size)
      }
    },
  }
</script>

<style scoped lang="scss">
  .collection-footer{}
</style>
