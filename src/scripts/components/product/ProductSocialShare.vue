<template lang="pug">
.social-sharing--wrapper
  h4.heading--7 Share
  ul.social-sharing
    li.social-sharing__item(v-if="shareFacebook")
      button-component.button--icon-background.button--icon-bordered.button--round.button--secondary.button--share.share-facebook(
        target="_blank"
        :href="`//www.facebook.com/sharer.php?u=${sharePermalink}`"
      )
        icon(
          name="facebook"
          size="14"
        )
        span.share-title.u-hidden(aria-hidden="true") Share on Facebook
        span.u-sr-only Share on Facebook
    li.social-sharing__item(v-if="shareTwitter")
      button-component.button--icon-background.button--icon-bordered.button--round.button--secondary.button--share.share-twitter(
        target="_blank"
        :href="`//twitter.com/share?text={{ shareTitle }}&url=${sharePermalink}`"
      )
        icon(
          name="twitter"
          size="14"
        )
        span.share-title.u-hidden.sr--hidden(aria-hidden="true") Share on Twitter
        span.u-sr-only Share on Twitter
    li.social-sharing__item(v-if="sharePinterest")
      button-component.button--icon-background.button--icon-bordered.button--round.button--secondary.button--share.share-pinterest(
        target="_blank"
        :href="`//pinterest.com/pin/create/button/?url=${sharePermalink}&media=${ shareImage }&description=${ shareTitle }`"
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
      product: Object,
    },
    computed: {
      baseUrl() {
        return encodeURIComponent(this.shopUrl);
      },
      sharePermalink() {
        const { handle } = this.product;
        return `${this.baseUrl}${encodeURIComponent(handle)}`;
      },
      shareTitle() {
        const { title } = this.product;
        return encodeURIComponent(title);
      },
      shareImage() {
        const { images } = this.product;
        const sizedImage = getSizedImageUrl(images[0].src, 'medium');
        return encodeURIComponent(sizedImage);
      },
    },
    methods: {},
  };
</script>
