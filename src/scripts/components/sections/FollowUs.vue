<template lang="pug">
  .follow-us.container.cv--auto(
    :id="isProductPage ? 'foursixtyHideableContainer' : ''"
    :class="followUsClasses"
    :style="wrapperStyle"
    ref="container"
    v-if="mounted"
  )
    h2.heading--display.follow-us__headline {{ headline }}
    p.text-align--center(
      v-if="isProductPage"
    )
      button-component.button--link(
        :href="socialLinkUrl"
      )
        span {{ socialLinkText }}

    .follow-us__instafeed(
      v-if="useInstafeedApp"
      id="insta-feed"
    )
      slot(
        name="insta-feed"
      )
    .follow-us__instafeed(
      v-else
    )
      .follow-us__manual-images(
        :is="$mq === 'mobile' && isProductPage ? 'VueSlickCarousel' : 'div'"
        ref="instaCarousel"
        v-bind="options"
      )
        .follow-us__manual-image(
          v-for="(image, index) in socialImages"
          :is="isProductPage ? 'a' : 'div'"
          :href="instagramLink(image.instagramHandle)"
          :key="index"
        )
          responsive-image(
            v-if="isMobile"
            :src="image.mobileImage"
            :alt="image.mobileImageAlt"
            :draggable="false"
          )
          responsive-image(
            v-else-if="image.desktopImageRatio !== ''"
            :src="image.desktopImage"
            :alt="image.desktopImageAlt"
            :aspectRatio="image.desktopImageRatio"
            :draggable="false"
          )
          img(
            v-else
            v-lazy="image.desktopImage"
            :alt="image.desktopImageAlt"
            :draggable="false"
          )
          .follow-us__overlay(v-if="isProductPage")
            .follow-us__overlay-icon
              icon(
                name="instagram"
                width="18px"
                height="18px"
              )
            button-component.button--link.button--link-light.follow-us__hover-link(
              :href="socialLinkUrl"
            ) Shop Now
          button-component.button--link.button--no-underline.follow-us__userhandle(
            :href="instagramLink(image.instagramHandle)"
            v-if="!isProductPage"
            target="_blank"
            rel="noopener"
          ) {{ addAtSymbol(image.instagramHandle) }}
        template(slot="prevArrow")
          button-component.button--icon.follow-us__navigation.follow-us__navigation-left
            icon(
              name="caret-left",
              size="12px"
            )
        template(slot="nextArrow")
          button-component.button--icon.follow-us__navigation.follow-us__navigation-right
            icon(
              name="caret-right",
              size="12px"
            )
    p.text-align--center
      button-component.button--primary.button--primary-arrow(
        :href="socialLinkUrl"
        v-if="!isProductPage"
      )
        span {{ socialLinkText }}
        icon(
          name="long-arrow-right"
          size="18px"
          class="button__icon"
        )
  </template>

<script>
  import ResponsiveImage from 'scripts/components/basic/ResponsiveImage.vue';
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';
  import Icon from 'scripts/components/basic/Icon.vue';
  import VueSlickCarousel from 'vue-slick-carousel';

  export default {
    name: 'FollowUs',
    components: {
      ResponsiveImage,
      ButtonComponent,
      Icon,
      VueSlickCarousel,
    },
    props: {
      headline: String,
      extraTopPadding: Boolean,
      socialLinkText: {
        type: String,
        default: () => 'Shop our Instagram feed',
      },
      socialLinkUrl: String,
      useInstafeedApp: Boolean,
      isProductPage: {
        type: Boolean,
        default: false,
      },
      socialImages: {
        type: Array,
        default: () => [
          {
            desktopImage: String,
            desktopImageAlt: String,
            desktopImageRatio: String,
            mobileImage: String,
            mobileImagealt: String,
            instagramHandle: String,
          },
        ],
      },
    },
    data() {
      return {
        mounted: false,
        options: {
          arrows: true,
          autoplay: false,
          dots: false,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      };
    },
    computed: {
      isMobile() {
        return ['mobile', 'tablet'].includes(this.$mq);
      },
      followUsClasses() {
        return {
          'follow-us--extra-top-padding': this.extraTopPadding,
          'container--wide': !this.isProductPage,
        };
      },
      wrapperStyle() {
        return this.isProductPage ? { display: 'none' } : '';
      },
    },
    mounted() {
      this.mounted = true;
    },
    beforeDestroy() {
      this.observer.disconnect();
    },
    methods: {
      addAtSymbol(handle = '') {
        return handle.charAt(0) !== '@' ? '@'.concat(handle) : handle;
      },
      instagramLink(handle = '') {
        return handle.charAt(0) !== '@' ? `https://www.instagram.com/${handle}/` : `https://www.instagram.com/${handle.substring(1)}/`;
      },
    },
  };
</script>
