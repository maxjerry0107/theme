<template lang="pug">
  .slide(:style="slideStyles")
    slot
</template>

<script>
  export default {
    name: 'Slide',
    inject: ['data'],
    props: {
      index: Number,
      isClone: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        active: false,
      };
    },
    computed: {
      slideStyles() {
        return {
          width: `${this.data.slideWidth}px`,
        };
      },
    },
  };
</script>

<style scoped lang="scss">
  .slide {
    display: flex;
    flex-direction: column;
    padding: 0 10px;

    .product-images-carousel & {
      padding: 0;
    }

    .featured-blog-posts & {
      padding: 0 ($spacing-unit * 2);
    }
  }

  .slide--follow-us {
    padding: 0 $spacing-unit * 3;
  }

  .slide--value-props {
    display: block;
    padding: 0 $spacing-unit * 3;

    @include desktop-up {
      margin: 0;
      min-width: 220px;
    }

    .value-props--fabric &,
    .template-product & {
      margin: 0;
      min-width: 160px;
      padding: 0 $spacing-unit * 7;
    }

    > img {
      width: auto;
    }
  }

  .slide--featured-collections {
    padding: 0 $spacing-unit * 4 0 0;
  }

  .slide--product-ingredients,
  .slide--meet-our-healers {
    padding: 0 $spacing-unit 0 0;
  }
</style>
