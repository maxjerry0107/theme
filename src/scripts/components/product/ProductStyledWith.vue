<template lang="pug">
  a.product-styled-with(
    :href="product.url"
  )
    img.product-styled-with__image(
      v-lazy="image.src"
      :alt="image.alt"
    )
    h3.heading--6.product-styled-with__title {{ product.title }}
    icon(
      name="arrow-styled-with"
      width="27px"
      height="10px"
      class="product-styled-with__arrow"
    )
</template>

<script>
  import { getSizedImageUrl } from 'scripts/helpers/images.js';
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'ProductStyledWith',
    components: {
      Icon,
    },
    props: {
      product: Object,
      productImageSize: {
        type: String,
        default: '74x126',
      },
    },
    computed: {
      image() {
        const firstImage = this.product.images && this.product.images.length > 0 ? this.product.images[0] : null;

        if (!firstImage) return null;

        return {
          src: getSizedImageUrl(firstImage.src, this.productImageSize),
          alt: firstImage.alt,
        };
      },
    },
  };
</script>
