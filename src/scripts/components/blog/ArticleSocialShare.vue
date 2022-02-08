<template lang="pug">
.social-sharing--wrapper.social-sharing--article
  h4.heading--7 Share
  ul.social-sharing
    li.social-sharing__item(v-if="shareFacebook")
      button-component.button--icon-background.button--icon-bordered.button--round.button--primary.button--share.share-facebook(
        target="_blank"
        :href="`//www.facebook.com/sharer.php?u=${sharePermalink}`"
        :class="`button--icon-${buttonSize}`"
      )
        icon(
          name="facebook"
          size="14"
        )
        span.share-title.u-hidden(aria-hidden="true") Share on Facebook
        span.u-sr-only Share on Facebook
    li.social-sharing__item(v-if="shareTwitter")
      button-component.button--icon-background.button--icon-bordered.button--round.button--primary.button--share.share-twitter(
        target="_blank"
        :href="`//twitter.com/share?text={{ shareTitle }}&url=${sharePermalink}`"
        :class="`button--icon-${buttonSize}`"
      )
        icon(
          name="twitter"
          size="14"
        )
        span.share-title.u-hidden.sr--hidden(aria-hidden="true") Share on Twitter
        span.u-sr-only Share on Twitter
    li.social-sharing__item(v-if="sharePinterest")
      button-component.button--icon-background.button--icon-bordered.button--round.button--primary.button--share.share-pinterest(
        target="_blank"
        :href="`//pinterest.com/pin/create/button/?url=${sharePermalink}&media=${ shareImage }&description=${ shareTitle }`"
        :class="`button--icon-${buttonSize}`"
      )
        icon(
          name="pinterest"
          size="14"
        )
        span.share-title.u-hidden(aria-hidden="true") Share on Pinterest
        span.u-sr-only Share on Pinterest
</template>
<script>
  import Icon from 'scripts/components/basic/Icon.vue';
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';
  import { getSizedImageUrl } from 'scripts/helpers/images.js';

  export default {
    name: 'ProductSocialShare',
    components: {
      Icon,
      ButtonComponent,
    },
    props: {
      shareFacebook: {
        type: Boolean,
        default: true,
      },
      shareTwitter: {
        type: Boolean,
        default: true,
      },
      sharePinterest: {
        type: Boolean,
        default: true,
      },
      shopUrl: {
        type: String,
        default: 'https://www.wearcommando.com/',
      },
      article: Object,
      buttonSize: {
        type: String,
        default: 'small',
      },
    },
    computed: {
      baseUrl() {
        return encodeURIComponent(this.shopUrl);
      },
      sharePermalink() {
        const { handle } = this.article;
        return `${this.baseUrl}${encodeURIComponent(handle)}`;
      },
      shareTitle() {
        const { title } = this.article;
        return encodeURIComponent(title);
      },
      shareImage() {
        const { image } = this.article;
        const sizedImage = getSizedImageUrl(image.src, 'medium');
        return encodeURIComponent(sizedImage);
      },
    },
    methods: {},
  };
</script>
<style scoped lang="scss">
  .social-sharing--article {
    margin: 0;
    display: block;
  }
  .heading--7 {
    padding: 0 0 $spacing-unit * 4 0;
    margin-bottom: 0;
    font-size: $font-size-body-small;
    text-transform: uppercase;
    color: $text--main;
  }
  .social-sharing {
    display: flex;
    margin: 0 0 $spacing-unit * 10 0;
    padding: 0;
    list-style: none;
    justify-content: center;

    @include tablet-up {
      justify-content: flex-start;
    }
  }
  .social-sharing__item {
    padding: 0 $spacing-unit * 4 0 0;
    margin-bottom: 0;
  }
  .button--share {
    margin-bottom: 0;

    svg {
      stroke: none;
      fill: $color-white;
    }
  }
  .button--icon-large {
    padding: $spacing-unit * 3;
  }
</style>
