<template lang="pug">
  .header-logo
    h1.header-logo__heading(v-if="h1")
      a.header-logo__image(href="/")
        img(:src="image", :srcset="imageSource", :alt="alt", :width="imageWidth" :height="imageHeight")
        span.u-hidden {{ alt }}
    div(v-else)
      a.header-logo__image(href="/")
        img(:src="image", :srcset="imageSource", :alt="alt", :width="imageWidth" :height="imageHeight")
</template>

<script>
  export default {
    name: 'HeaderLogo',
    props: {
      image: String,
      largeImage: String,
      alt: String,
      h1: Boolean,
    },
    computed: {
      imageSource() {
        return `${this.image} 1x, ${this.largeImage} 2x`;
      },
      imageWidth() {
        return this.$mq === 'mobile' ? 165 : 190;
      },
      imageHeight() {
        return this.$mq === 'mobile' ? 25 : 32;
      },
    },
  };
</script>
