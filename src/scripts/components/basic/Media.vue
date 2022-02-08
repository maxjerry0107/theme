<template lang="pug">
  div.media(v-on="$listeners")
    placeholder
      svg(slot="placeholder" viewBox="0 0 300 300" width="100%" height="100%")
        rect(x="0" y="0" width="100%" height="100%")
      template(slot='main')
        slot(:name="media.media_type")
          img.media__image(
            v-if="media.media_type === 'image'"
            :src="media.src"
            :alt="media.alt"
            :class="className"
            :width="media.width"
            :height="media.height"
          )
          video(
            v-else-if="media.media_type === 'video'"
            controls
            :class="className"
          )
            source(
              v-for="source in media.sources"
              :src="source.url"
              :type="source.mime_type"
            )
          .media__iframe-wrapper(
            v-else-if="media.media_type === 'external_video'"
            :class="className"
            :style="imageStyle"
          )
            iframe.media__video-embed(
              :src="videoUrl"
              frameborder="0"
              allowfullscreen
            )
</template>

<script>
  import Placeholder from 'scripts/components/basic/Placeholder.vue';
  /**
   * A image or video element representing the provided Shopify Media object
   *
   * @module Media
   */
  export default {
    name: 'Media',
    components: {
      Placeholder,
    },
    props: {
      /** @type {ShopifyMedia} */
      media: Object,
      className: String,
    },
    computed: {
      videoUrl() {
        if (this.media.host === 'vimeo') {
          return `https://player.vimeo.com/video/${this.media.external_id}?title=0&autoplay=1&byline=0&portrait=0&speed=0&badge=0&autopause=0&player_id=0&app_id=58479`;
        }
        if (this.media.host === 'youtube') {
          return `https://youtube.com/embed/${this.media.external_id}`;
        }

        return null;
      },
      imageStyle() {
        return {
          'padding-bottom': `${(1 / this.media.aspect_ratio) * 100}%`,
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .media,
  .media video {
    max-width: 100%;
  }

  .media svg {
    fill: $color-off-white;
    animation: infiniteFade 1s linear alternate infinite;
  }

  .media__image {
    width: auto;
    height: auto;
  }

  .media__iframe-wrapper {
    position: relative;
    height: 0;
  }

  .media__video-embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .product-images-carousel__zoom-image {
    display: block;
    margin: 0 auto;
  }

  @keyframes infiniteFade {
    from {
      opacity: 0.3;
    }
    to {
      opacity: 1;
    }
  }
</style>
