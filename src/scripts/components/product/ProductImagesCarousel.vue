<template lang="pug">
  .product-images-carousel(
    :class="{ 'product-images-carousel--modal-zoom': zoomState }"
  )
    p.product-images-carousel__tag(v-if="ingredientTag") {{ ingredientTag }}
    .product-images-carousel__badge(v-if="productBadge")
      img.product-images-carousel__badge-image(v-lazy="productBadge.src", :alt="productBadge.alt")
    div(v-if="zoomState")
      VueSlickCarousel(
        ref="zoomCarousel"
        :arrows="false"
        :dots="false"
        :vertical="$mq === 'desktop'"
        :initialSlide="currentIndex"
      )
        .product-images-carousel__slide(
          v-for="(media, index) in mediaItems", :key="index"
          :ref="`productSlide__${index}`"
          v-if="!zoomState || (zoomState && media.media_type === 'image')"
        )
          .product-images-carousel__zoom-slide
            pinch-zoom(
              :limitZoom="2"
              backgroundColor="transparent"
              :disableZoomControl="$mq === 'desktop' ? 'never' : 'auto'"
              :limitPan="true"
            )
              media(
                :media="media"
                :className="zoomState ? 'product-images-carousel__zoom-image' : ''"
              )
                responsive-image(
                  v-if="$mq === 'mobile'"
                  :src="media.src"
                  :alt="media.alt"
                  :aspectRatio="media.aspect_ratio"
                  :width="media.width"
                  :height="media.height"
                )
                img(
                  v-else
                  v-lazy="media.src"
                  :alt="media.alt"
                  :width="media.width"
                  :height="media.height"
                )
    .product-images-carousel__list.animation--fade-in(
      v-else
      ref="productImageCarousel"
      :is="$mq === 'mobile' ? 'carousel' : 'div'"
      :class="{ 'product-images-carousel__list--zoom': zoomState }"
      :slides-to-show="1"
      :infinite="multipleSlides ? true : false"
      :dots="multipleSlides && !zoomState ? true : false"
      :numDots="mediaItems.length"
      :slideIds="slideIds"
      :thumbnail-images="thumbnailSlides"
      @before-slide="updateCurrentIndex"
    )
      .product-images-carousel__slide(
        :is="$mq === 'mobile' ? 'slide' : 'div'"
        v-for="(media, index) in mediaItems", :key="index"
        :ref="`productSlide__${index}`"
        v-if="!zoomState || (zoomState && media.media_type === 'image')"
        @click="($event) => { setZoom($event, !zoomState, index); }"
      )
        .product-images-carousel__zoom-slide(
          @click="($event) => { $mq === 'mobile' ? setZoom($event, !zoomState, index) : '' }"
        )
          media(
            :media="media"
            :className="zoomState ? 'product-images-carousel__zoom-image' : ''"
          )
            responsive-image(
              v-if="$mq === 'mobile'"
              :src="media.src"
              :alt="media.alt"
              :aspectRatio="media.aspect_ratio"
              :width="media.width"
              :height="media.height"
            )
            img(
              v-else
              v-lazy="media.src"
              :alt="media.alt"
              :width="media.width"
              :height="media.height"
            )
    ul.product-images-carousel__dots.u-list-simple.u-list-block(v-if="zoomState && $mq !== 'mobile'")
      li(v-for="n in thumbnailSlides.length" :key="n")
        button.u-clear-button(
          :class="{ 'is-active': n === currentIndex + 1, 'carousel__dots-button': thumbnailSlides.length === 0, 'carousel__dots-thumbnail': thumbnailSlides.length > 0 }",
          @click="scrollToSlide(n - 1)"
        )
          .carousel__dots-thumbnail-image(
            v-if="thumbnailSlides.length > 0"
            :class="{ 'carousel__dots-thumbnail-image--video': ['video', 'external_video'].includes(thumbnailSlides[n - 1].media_type) }"
            :data-type="thumbnailSlides[n - 1].media_type"
          )
            img(
              v-if="thumbnailSlides[n - 1].src"
              v-lazy="thumbnailSlides[n - 1].src"
            )
            icon.carousel__dots-thumbnail-icon(v-if="['video', 'external_video'].includes(thumbnailSlides[n - 1].media_type)" name="play" size="26px")
          .u-sr-only Show Slide {{ n }}
    button-component.button--secondary.button--round.zoom-slide__button(
      v-show="currentMediaTypeIsImage"
      :class="{ 'zoom__button--active': zoomState }"
      @click="($event) => { setZoom($event, !zoomState, currentIndex); }",
      aria-hidden="true"
      :data-index="currentIndex"
    )
      icon(
        name="plus"
        size="32"
      )
</template>

<script>
  import PinchZoom from 'vue-pinch-zoom';
  import Icon from 'scripts/components/basic/Icon.vue';
  import Carousel from 'scripts/components/basic/Carousel.vue';
  import Slide from 'scripts/components/basic/Slide.vue';
  import Media from 'scripts/components/basic/Media.vue';
  import ResponsiveImage from 'scripts/components/basic/ResponsiveImage.vue';
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';
  import VueSlickCarousel from 'vue-slick-carousel';

  export default {
    name: 'ProductImagesCarousel',
    components: {
      'pinch-zoom': PinchZoom,
      Icon,
      Carousel,
      Slide,
      Media,
      ResponsiveImage,
      ButtonComponent,
      VueSlickCarousel,
    },
    props: {
      medias: Array,
      product: Object,
      color: String,
    },
    data() {
      return {
        zoomState: false,
        currentIndex: 0,
      };
    },
    computed: {
      productBadge() {
        if (!this.product || !this.product.customFields.badge) return false;

        return this.product.customFields.badge[0];
      },
      ingredientTag() {
        if (!this.product) return false;
        return this.product.customFields.ingredient_tag;
      },
      thumbnailSlides() {
        return this.$mq === 'mobile' ? [] : [...this.mediaItems].filter((media) => media.media_type === 'image');
      },
      multipleSlides() {
        return this.mediaItems.length > 1;
      },
      currentMediaTypeIsImage() {
        return this.mediaItems[this.currentIndex] && this.mediaItems[this.currentIndex].media_type ? this.mediaItems[this.currentIndex].media_type === 'image' : true;
      },
      mediaItems() {
        const { color, medias, altProps } = this;
        return medias.reduce((mediaItemsArray, media) => {
          const propsFromAlt = altProps(media.alt);
          if (!color || propsFromAlt.color.toLowerCase().includes(color.toLowerCase())) {
            mediaItemsArray.push({
              ...media,
              ...propsFromAlt,
            });
          }
          return mediaItemsArray;
        }, []);
      },
      slideIds() {
        return this.mediaItems.map((item) => item.id).join(performance.now());
      },
    },
    mounted() {
      if (this.$mq === 'mobile') {
        this.carouselFix();
      }
    },
    methods: {
      updateCurrentIndex({ to }) {
        this.currentIndex = to;
      },
      setZoom(event, state, index) {
        this.currentIndex = index
        this.zoomState = !!state;
        this.zIndexFix(state);
        this.$nextTick(() => {
          if (this.$mq === 'mobile') {
            this.carouselFix();
          }
        });
      },
      zIndexFix(zoomActive) {
        const mainContent = document.querySelector('#MainContent');
        const headerNav = document.querySelector('.site-header-wrapper');
        const instaShopSection = document.querySelector('#shopify-section-instashop-pdp');
        const valuePropsSection = document.querySelector('.value-props-section--product');
        const htmlElm = document.documentElement;
        if (zoomActive && mainContent) {
          mainContent.style.zIndex = '50';
          if (headerNav) {
            headerNav.style.display = 'none'; // required for iOS which is not respecting z-index, maybe a position sticky bug?
          }
          if (instaShopSection) {
            instaShopSection.style.visibility = 'hidden'; // required for extra large screens such as iMAc
          }
          if (valuePropsSection) {
            valuePropsSection.style.visibility = 'hidden'; // required for extra large screens such as iMAc
          }
          htmlElm.style.overflow = 'hidden';
        } else if (mainContent) {
          mainContent.style.zIndex = '';
          if (headerNav) {
            headerNav.style.display = '';
          }
          if (instaShopSection) {
            instaShopSection.style.visibility = '';
          }
          if (valuePropsSection) {
            valuePropsSection.style.visibility = ''; // required for extra large screens such as iMAc
          }
          htmlElm.style.overflow = '';
        } else {
          htmlElm.style.overflow = '';
        }
      },
      carouselFix() {
        const { $refs, currentIndex } = this;
        const { productImageCarousel } = $refs;
        if (productImageCarousel && productImageCarousel.slideTo) {
          this.$nextTick(() => {
            this.$refs.productImageCarousel.slides = this.$refs.productImageCarousel.getChildSlides();
            this.$refs.productImageCarousel.setCurrentSlide(0);
            setTimeout(() => {
              this.$refs.productImageCarousel.updateTrackWidth();
              this.$refs.productImageCarousel.slideTo(currentIndex);
              this.$refs.productImageCarousel.initClones();
            }, 100);
          });
        }
      },
      scrollToSlide(index) {
        this.$refs.zoomCarousel.goTo(index);
        this.updateCurrentIndex({ to: index });
      },
      altProps(altText) {
        const props = altText.split('::');
        return {
          alt: props[0],
          color: props[1] || '',
          state: props[2] || '',
        };
      },
    },
  };
</script>

<style scoped lang="scss">
  .page-layout {
    z-index: index($layout, 'page-layout-content');
  }

  .product-images-carousel {
    position: relative;
    z-index: index($layout, 'page-layout-content');

    @include mobile-only {
      margin: 0 auto;
      width: 100%;
    }

    @include tablet-up {
      max-width: 648px;
    }
  }

  .product-images-carousel__list {
    @include tablet-up {
      display: grid;
      position: relative;
      bottom: auto;
      left: auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: $spacing-unit * 3;
      max-width: 648px;
      margin: 0 auto;
    }
  }

  .product-images-carousel__list--zoom {
    @include tablet-up {
      display: flex;
      flex-direction: column;
      max-width: 100vw;
      width: 100vw;
    }
  }

  .product-images-carousel__slide {
    &:first-child {
      @include tablet-up {
        grid-row: 1;
        grid-column-start: 1;
        grid-column-end: 3;
      }
    }

    &:hover {
      cursor: pointer;
    }
  }

  .product-images-carousel__image {
    @include tablet-up {
      max-height: 848px;
      object-fit: cover;
      object-position: bottom;
      margin: 0 auto;
    }
  }

  .product-images-carousel__tag {
    display: none;
    position: absolute;
    top: 0;
    z-index: index($product-images-carousel, 'tag');
    color: $color-grey-900;
    font-size: $font-size-body-xs;
    font-weight: $font-weight-regular;
    line-height: rem(15px);
    letter-spacing: 0.86px;
    text-transform: uppercase;

    @include tablet-up {
      display: block;
      top: $spacing-unit * 5;
      left: 25%;
    }

    @include desktop-up {
      left: 20%;
    }
  }

  .product-images-carousel__badge {
    display: inline-block;
    position: absolute;
    top: $spacing-unit;
    right: $spacing-unit;
    z-index: index($product-images-carousel, 'badge');
  }

  .product-images-carousel__badge-image {
    width: $spacing-unit * 29;
    height: auto;
  }


  .carousel__dots-button {
    .product-images-carousel {
      &::after {
        width: 9px;
        height: 9px;
        background-color: $color-grey-900;
        border-color: $color-grey-900;
      }

      &.is-active::after {
        background-color: $color-black;
      }
    }
  }
    
  .product-images-carousel__zoom-slide {
    position: relative;

    @include tablet-up {
      width: 100%;
      max-width: $content-max-width;
      margin: 0 auto;
    }
  }

  .zoom-slide__button {
    position: absolute;
    top: $spacing-unit * 4;
    right: $spacing-unit * 4;
    width: 38px;
    height: 38px;
    padding: 0;
    border-width: 0;
    transform: rotateZ(0deg);
    transition: all 0.3s ease;
    z-index: index($zoom, 'zoom-active');

    .button__content {
      min-width: 32px;
    }

    svg {
      fill: $color-black;
      transform: scale(0.6);
    }

    &.zoom__button--active {
      position: fixed;
      transform: rotateZ(405deg); // gives the spin effect
      background-color: transparent;
      border-width: 0;
      box-shadow: none;

      @include tablet-up {
        background-color: rgba($color-black, 0.5);
      }

      svg {
        @include mobile-only {
          transform: scale(1);
        }
        @include tablet-up {
          stroke: $color-white;
        }
      }
    }
  }

  .product-images-carousel--modal-zoom {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    max-width: 100vw;
    z-index: index($layout, 'zoom');
    background-color: $color-white;

    @include tablet-up {
      overflow-x: hidden;
      overflow-y: scroll;
      scroll-behavior: smooth;
    }

    .product-images-carousel__slide {
      min-width: 100vw;
      max-height: 100vh;
      max-width: $content-max-width;
      overflow: scroll;

      @include tablet-up {
        min-width: 0;
        max-height: none;
        max-width: none;
        overflow: hidden;
        width: 100vw;
      }

      .zoom-on-hover--active {
        min-width: 150vw;
        min-height: 100vh;
        @include mobile-only {
          transform: translateX(-25vw);
        }
      }
    }

    .product-images-carousel__zoom-slide {
      @include mobile-only {
        overflow: scroll;
        overflow-x: hidden;
      }
    }

    .zoom-slide__button {
      @include tablet-up {
        top: $spacing-unit * 5;
        right: $spacing-unit * 15;
      }
      @include desktop-up {
        right: calc(50vw - 460px + 1.5rem);
      }
    }
  }

  .product-images-carousel--modal-zoom::v-deep {
    .zoom-on-hover {
      @include tablet-up {
        overflow: visible;
      }
    }
    .zoom-on-hover__normal {
      @include tablet-up {
        display: block;
        width: auto;
        max-width: 150vw;
        max-height: 150vh;
        margin: 0 auto;
        transform: translateY(26.5%) scale(1.5);
      }
    }
  }

  .product-images-carousel__dots {
    @include tablet-up {
      position: fixed;
      top: 0;
      bottom: auto;
      padding: $spacing-unit * 5;
      max-width: 108px;
      max-height: 100vh;
      grid-template-columns: 1fr;
      overflow-y: scroll;
      background-color: $color-white;
    }
  }

  .product-images-carousel__zoom-image {
    @include tablet-up {
      display: flex;
      justify-content: center;
    }
  }
  /deep/ {
    .placeholder__main {
      .pinch-zoom-wrapper & {
        height: 100vh;
      }
    }

    .pz-zoom-button.pz-zoom-control-position-bottom {
      @include tablet-up {
        top: $spacing-unit * 20;
        bottom: auto;
        right: $spacing-unit * 15;
        left: auto;
      }
      @include desktop-up {
        right: calc(50vw - 460px + 0.82rem);
      }
    }
  }
</style>
