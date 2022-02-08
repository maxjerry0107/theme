<template lang="pug">
  .carousel
    .carousel__carousel(:style="carouselWidthStyles", ref="carousel", v-touch:swipe="touchSlide")
      .carousel__track.carousel__track--clone(v-if="infinite" :style="beforeTrackStyles")
        slot(name="clone-before")
      .carousel__track(:style="trackStyles")
        slot
      .carousel__track.carousel__track--clone(v-if="infinite" :style="afterTrackStyles")
        slot(name="clone-after")

    .carousel__arrows(v-if="arrows")
      button-component.button--arrow.carousel__arrow.carousel__arrow-prev(
        :disabled="!showLeftArrow"
        @click="!autoPlay ? slidePrev() : slidePrevAndAutoplay()"
        tabindex="-1"
      )
        icon.carousel__arrow-icon(
          :name="prevIcon"
          :size="isMobile ? iconSizeMobile : iconSize"
        )
        span.u-sr-only Previous Slide

      button-component.button--arrow.carousel__arrow.carousel__arrow-next(
        :disabled="!showRightArrow"
        @click="!autoPlay ? slideNext() : slideNextAndAutoplay()"
        tabindex="-1"
      )
        icon.carousel__arrow-icon(
          :name="nextIcon"
          :size="isMobile ? iconSizeMobile : iconSize"
        )
        span.u-sr-only Next Slide

    ul.carousel__dots.u-list-simple.u-list-inline(
      v-if="dots"
      :data-dot-count="dotsToShow"
    )
      li(
        v-for="n in dotsToShow" :key="n"
      )
        button.u-clear-button(
          :class="{ 'is-active': dotScroll(n) === currentSlideIndex, 'carousel__dots-button': thumbnailImages.length === 0, 'carousel__dots-thumbnail': thumbnailImages.length > 0 }",
          @click="slideTo(dotScroll(n))"
          :data-slide-to="dotScroll(n)"
        )
          .carousel__dots-thumbnail-image(
            v-if="thumbnailImages.length > 0"
            :class="{ 'carousel__dots-thumbnail-image--video': ['video', 'external_video'].includes(thumbnailImages[n - 1].media_type) }"
            :data-type="thumbnailImages[n - 1].media_type"
          )
            img(
              v-if="thumbnailImages[n - 1].src"
              v-lazy="thumbnailImages[n - 1].src"
            )
            icon.carousel__dots-thumbnail-icon(v-if="['video', 'external_video'].includes(thumbnailImages[n - 1].media_type)" name="play" size="26px")
          .u-sr-only Show Slide {{ n }}

</template>

<script>
  import { debounce } from 'scripts/helpers/util.js';
  import { cloneSlide } from 'scripts/helpers/vue.js';
  import { getInRange, normalizeSlideIndex } from 'scripts/helpers/carousel.js';

  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'Carousel',
    components: {
      Icon,
      ButtonComponent,
    },
    provide() {
      const data = {};

      Object.defineProperty(data, 'slideWidth', {
        enumerable: true,
        get: () => this.slideWidth,
      });

      return {
        data,
      };
    },
    props: {
      slidesToShow: {
        type: Number,
        default: 1,
      },
      slidesToScroll: {
        type: Number,
        default: 1,
      },
      duration: {
        type: Number,
        default: 300,
      },
      centerMode: {
        type: Boolean,
        deault: false,
      },
      infinite: {
        type: Boolean,
        default: false,
      },
      dots: {
        type: Boolean,
        default: false,
      },
      arrows: {
        type: Boolean,
        default: false,
      },
      thumbnailImages: {
        type: Array,
        default: () => [],
      },
      slideMaxWidth: Number,
      autoPlay: {
        type: Boolean,
        default: false,
      },
      autoPlaySpeed: {
        type: Number,
        default: 5,
      },
      prevIcon: {
        type: String,
        default: 'arrow-left',
      },
      nextIcon: {
        type: String,
        default: 'arrow-right',
      },
      iconSize: {
        type: String,
        default: '25px',
      },
      iconSizeMobile: {
        type: String,
        default: '16px',
      },
      slideIds: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        slides: [],
        beforeSlides: [],
        afterSlides: [],
        carouselWidth: 0,
        offsetX: 0,
        enableTransition: false,
        nagivating: false,
        slideTimerId: 0,
      };
    },
    computed: {
      trackWidth() {
        return this.slideWidth * this.slides.length;
      },
      cloneTrackWidth() {
        return this.trackWidth * 2;
      },
      trackTransition() {
        return this.enableTransition ? `${this.duration}ms ease all` : 'none';
      },
      trackStyles() {
        return {
          width: `${this.trackWidth}px`,
          transform: `translateX(${this.offsetX}px)`,
          transition: this.enableTransition ? `${this.duration}ms ease transform` : 'none',
        };
      },
      beforeTrackStyles() {
        return {
          width: `${this.cloneTrackWidth}px`,
          transform: `translateX(${this.offsetX - this.cloneTrackWidth}px)`,
          transition: this.enableTransition ? `${this.duration}ms ease transform` : 'none',
        };
      },
      afterTrackStyles() {
        return {
          width: `${this.cloneTrackWidth}px`,
          transform: `translateX(${this.offsetX + this.trackWidth}px)`,
          transition: this.enableTransition ? `${this.duration}ms ease transform` : 'none',
        };
      },
      slideWidth() {
        let slideWidth = this.carouselWidth / this.slidesToShow;

        if (slideWidth > this.slideMaxWidth) {
          slideWidth = this.slideMaxWidth;
        }

        return slideWidth;
      },
      carouselMaxWidth() {
        if (this.slideMaxWidth) {
          return this.slideMaxWidth * this.slidesToShow;
        }
        return undefined;
      },
      carouselWidthStyles() {
        if (!this.carouselMaxWidth) return undefined;

        return `max-width: ${this.carouselMaxWidth}px`;
      },
      currentSlideIndex() {
        return this.slides.findIndex((slide) => slide.componentInstance.active);
      },
      showLeftArrow() {
        const { infinite, showArrow, currentSlideIndex } = this;
        return infinite || showArrow(currentSlideIndex !== 0);
      },
      showRightArrow() {
        const { infinite, showArrow, currentSlideIndex, slidesToShow, slides } = this;
        return infinite || showArrow(currentSlideIndex + slidesToShow !== slides.length);
      },
      dotsToShow() {
        const { isMobile, slides, slidesToScroll } = this;
        const dotCount = slides.length > 0 ? Math.floor(slides.length / slidesToScroll) : 0;
        return isMobile ? slides.length : dotCount;
      },
      isMobile() {
        return ['mobile', 'tablet'].includes(this.$mq);
      },
    },
    watch: {
      slidesToShow() {
        this.onResize();
      },
      centerMode() {
        this.onResize();
      },
      infinite() {
        this.onResize();
      },
      slideIds() {
        this.$nextTick(() => {
          this.slides = this.getChildSlides();
          this.slideTo(0);
          this.initClones();
          this.updateTrackWidth();
        });
      },
    },
    created() {
      window.addEventListener('resize', this.onResize);
    },
    mounted() {
      this.slides = this.getChildSlides();

      if (this.slides[0]) this.slides[0].componentInstance.active = true;

      if (this.slides[1]) this.slides[1].componentInstance.next = true;
      this.updateTrackWidth();

      this.$nextTick(() => {
        if (this.centerMode) {
          this.offsetX = this.carouselWidth / 2 - this.slideWidth / 2;
        }

        if (this.infinite) this.initClones();
        this.enableTransition = true;
      });

      if (this.autoPlay) {
        this.runAutoPlay(this.autoPlaySpeed);
      }

      /*
       * FIXME: for some reason our slide widths will occassionally
       * get calculated to be too small until the user resizes the screen.
       * This is a temporary fix, but we will need to find a permanent fix in the future.
       */
      setTimeout(() => {
        this.onResize();
      }, 100);
    },
    beforeUpdate() {
      const isForcedUpdate = this.infinite && (!this.$slots.before || !this.$slots.after);

      if (isForcedUpdate) {
        this.initClones();
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.onResize);
    },
    methods: {
      getActiveIndex() {
        return this.slides.findIndex((slide) => slide.componentInstance.active);
      },
      getSlideClones(set) {
        const slides = [];

        for (let i = 0, j = this.slides.length; i < j; i += 1) {
          slides.push(cloneSlide(this.slides[i], Math.abs(i - this.slides.length * set)));
        }

        return slides;
      },
      initClones() {
        this.$slots['clone-before'] = this.getSlideClones(1).concat(this.getSlideClones(2));
        this.$slots['clone-after'] = this.getSlideClones(3).concat(this.getSlideClones(4));
      },
      getChildSlides() {
        if (!this.$slots || !this.$slots.default) {
          return [];
        }
        return this.$slots.default.filter(this.filterSlides);
      },
      filterSlides(el) {
        if (!el.componentOptions || !el.componentOptions.Ctor) {
          return false;
        }
        return el.componentOptions.Ctor.options.name === 'Slide';
      },
      onResize() {
        return debounce(this.onResizeDebounce, 50)();
      },
      onResizeDebounce() {
        this.updateTrackWidth();
        this.slideTo(this.currentSlideIndex);
      },
      updateTrackWidth() {
        if (this.$refs.carousel) {
          this.carouselWidth = this.$refs.carousel.offsetWidth;
        }
      },
      setCurrentSlide(currentIndex) {
        this.slides.forEach((slide, index) => {
          /* eslint-disable no-param-reassign */
          slide.componentInstance.active = currentIndex === index;
          slide.componentInstance.next = currentIndex + 1 === index;
          slide.componentInstance.prev = currentIndex - 1 === index;
          this.slides[index] = slide;
          /* eslint-enable no-param-reassign */
        });

        setTimeout(() => {
          this.navigating = false;
          this.enableTransition = true;
          this.$emit('after-slide', this.getActiveIndex());
        }, 50);
      },
      getNewOffset(index) {
        const offset = -(index * this.slideWidth);

        return this.centerMode ? this.carouselWidth / 2 - this.slideWidth / 2 + offset : offset;
      },
      slideTo(index) {
        if (!this.navigating && index !== this.currentSlideIndex) {
          this.$emit('before-slide', { from: this.getActiveIndex(), to: index });
          this.navigating = true;

          if (!this.infinite) {
            /* eslint-disable no-param-reassign */
            index = this.centerMode ? getInRange(index, 0, this.slides.length - 1) : getInRange(index, 0, this.slides.length - this.slidesToShow);
            /* eslint-enable no-param-reassign */
          }

          this.offsetX = this.getNewOffset(index);

          if (this.infinite) {
            setTimeout(() => {
              /* eslint-disable no-param-reassign */
              index = normalizeSlideIndex(index, this.slides.length);
              /* eslint-enable no-param-reassign */
              this.enableTransition = false;
              this.$nextTick(() => {
                this.offsetX = this.getNewOffset(index);
                this.setCurrentSlide(index);
              });
            }, this.duration + 1);
          } else {
            this.setCurrentSlide(index);
          }
        }
      },
      slideNext() {
        this.slideTo(this.currentSlideIndex + this.slidesToScroll);
      },
      slidePrev() {
        this.slideTo(this.currentSlideIndex - this.slidesToScroll);
      },
      touchSlide(direction) {
        if (direction === 'right') {
          this.slidePrev();
        } else if (direction === 'left') {
          this.slideNext();
        }
      },
      slideNextAndAutoplay() {
        this.slideNext();
        this.runAutoPlay(this.autoPlaySpeed);
      },
      slidePrevAndAutoplay() {
        this.slidePrev();
        this.runAutoPlay(this.autoPlaySpeed);
      },
      runAutoPlay(seconds) {
        clearInterval(this.slideTimerId);
        this.slideTimerId = setInterval(() => {
          this.slideNext();
        }, seconds * 1000);
      },
      showArrow(addtionalCheck = false) {
        if (this.arrows && (this.infinite || addtionalCheck)) {
          return true;
        }
        return false;
      },
      dotScroll(n) {
        return (n - 1) * this.slidesToScroll;
      },
    },
  };
</script>

<style lang="scss">
  $product-carousel-thumbnail-size: 64px;

  .carousel {
    margin: 0 auto;
    overflow: hidden;
  }

  .carousel--value-props {
    margin: 0 auto;
    padding-top: $spacing-unit * 8;
    padding-bottom: $spacing-unit * 8;

    .template-product & {
      max-width: $content-max-width;
    }

    .value-props--full-width & {
      max-width: 100%;
    }
  }

  .carousel--featured-collections {
    overflow: visible;
  }

  .carousel__carousel {
    position: relative;
    margin: 0 auto;
    overflow: hidden;

    .featured-blog-posts &,
    .collection-footer &,
    .article-footer & {
      width: 90%;
      overflow: visible;
    }

    .value-props--full-width & {
      @include desktop-only {
        width: calc(1440px * 0.8);
      }
    }
  }

  .carousel__track {
    display: flex;

    @include tablet-up {
      justify-content: center;
      min-width: 100%;
    }

    @include desktop-up {
      display: flex;
      justify-content: space-between;
    }

    .value-props-section--product & {
      justify-content: center;

      @include desktop-up {
        justify-content: center;
      }
    }
  }

  .carousel__track--clone {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
  }

  .carousel__arrows {
    max-width: 100vw;
    display: flex;

    .featured-collection__slider & {
      position: absolute;
      top: 0;
      right: 0;
    }
  }

  .carousel__arrow {
    .carousel__arrow-icon {
      fill: $color-blue-900;
    }

    &:not(:disabled):focus,
    &:not(:disabled):hover {
      .carousel__arrow-icon {
        fill: $color-white;
      }
    }
  }

  .carousel__arrow-prev {
    .featured-collection__slider & {
      transform: rotate(180deg);
      margin-right: $spacing-unit * 2;
    }
  }

  .carousel__dots {
    display: flex;
    margin: 0;
    padding: 0;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    justify-content: center;
    list-style: none;

    @include mobile-only {
      flex-wrap: wrap;
    }

    .hero__carousel & {
      @include tablet-down {
        top: 70vw;
        bottom: auto;
      }
    }

    .hero__carousel--text-only & {
      bottom: ($spacing-unit * 7);
      top: auto;
    }
  }

  .carousel__dots-button {
    position: relative;
    margin: 0;
    padding: $spacing-unit;
    background-color: transparent;
    border: 0;

    .carousel--value-props & {
      padding: $spacing-unit * 3 $spacing-unit * 2;
    }

    &:focus {
      box-shadow: none;
    }

    &::after {
      display: block;
      content: '';
      width: 8px;
      height: 8px;
      background-color: $color-teal-500;
      border-radius: 50%;
      transition: transform 0.2s;
    }

    &.is-active {
      .product-images-carousel & {
        background-color: transparent;
        border-color: $color-black;
      }

      .carousel--follow-us & {
        background-color: $color-black;
      }
    }

    &.is-active::after {
      background-color: $color-black;
    }
  }

  .carousel__dots-thumbnail {
    display: flex;
    margin: 0;
    padding: 0;
    align-items: center;
    flex-direction: column;

    .product-images-carousel & {
      border: 1px solid transparent;

      &:focus {
        box-shadow: 0 0 4px $color-black;
      }

      &.is-active {
        border-color: $color-black;
      }
    }

    &:after {
      content: '';
      display: block;
      margin-top: 12px;
      width: 5px;
      height: 5px;
      background-color: $bg--dark;
      border-radius: 50%;
      opacity: 0;
      transition: 0.3s ease opacity;

      .product-images-carousel & {
        content: none;
      }
    }

    &.is-active:after {
      opacity: 1;
    }
  }

  .carousel__dots-thumbnail-image {
    position: relative;
    padding: 4px;
    width: 100px;
    height: 100px;

    .product-images-carousel & {
      padding: 0;
      width: 100%;
      height: auto;

      &:focus,
      img:focus {
        box-shadow: none;
      }
    }

    img {
      max-height: 100%;
    }

    .product-images-carousel & img {
      display: block;
      max-height: none;
    }
  }

  .carousel__dots-thumbnail-image--video {
    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: $color-transparent-black;
    }
  }

  .carousel__dots-thumbnail-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    fill: $text--light;
  }
</style>
