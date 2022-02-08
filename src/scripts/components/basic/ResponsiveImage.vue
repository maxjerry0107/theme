<template lang="pug">
  .responsive-image
    .responsive-image__container(:style="containerStyles")
      .responsive-image__bkg
        img.responsive-image__img(
          :class="`responsive-image__img--${fit}`"
          v-lazy="src"
          :alt="alt"
          :draggable="draggable"
        )
</template>

<script>
  export default {
    name: 'ResponsiveImage',
    props: {
      src: String,
      alt: String,
      aspectRatio: {
        type: String,
        default: '1:1.6',
      },
      fit: {
        type: String,
        default: 'cover',
        validator(val) {
          return ['cover', 'contain'].includes(val);
        },
      },
      draggable: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        top: 0,
        eventListenersAttatched: false,
        lazyLoaded: false,
        observer: null,
      };
    },
    computed: {
      aspectRatioAsPercent() {
        const [width, height] = this.aspectRatio.split(':');
        return (height / width) * 100;
      },
      containerStyles() {
        return {
          paddingTop: `${this.aspectRatioAsPercent}%`,
        };
      },
    },
  };
</script>

<style lang="scss">
  .responsive-image__container {
    position: relative;
    width: 100%;
    height: 0;
  }

  .responsive-image__bkg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .responsive-image__img {
    width: 100%;
    height: 100%;
  }

  .responsive-image__img--cover {
    object-fit: cover;
  }

  .responsive-image__img--contain {
    object-fit: contain;
  }
</style>
