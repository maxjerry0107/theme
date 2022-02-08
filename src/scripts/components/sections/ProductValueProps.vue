<template lang="pug">
  vue-slick-carousel.carousel.carousel--value-props(
    ref="carousel"
    :dots="dots"
    :infinite="infinite"
    :slidesToShow="slidesToShow"
    :slidesToScroll="slidesToScroll"
    :arrows="arrows",
    :dotsClass="dotsClass"
    :lazyLoad="lazyLoad"
    @afterChange="updateIndex"
  )
    slot
    template(slot="prevArrow")
      button-component.button--icon.button--round.slick-arrow.carousel__arrow.carousel__arrow--previous(
        tabindex="-1"
        data-role="none"
        @click="showPrev"
        ref="prev"
      )
        icon.carousel__arrow-icon(
          name="carousel-left"
          :size="this.$mq == 'mobile' ? '16px' : '25px'"
        )
          span.u-sr-only Previous Slide
    template(slot="nextArrow")
      button-component.button--icon.button--round.slick-arrow.carousel__arrow.carousel__arrow--next(
        tabindex="-1"
        data-role="none"
        @click="showNext"
        ref="next"
      )
        icon.carousel__arrow-icon(
          name="carousel-right"
          :size="this.$mq == 'mobile' ? '16px' : '25px'"
        )
          span.u-sr-only Next Slide
    template(slot="customPaging")
      button.u-clear-button.carousel__dots-button
        span.u-sr-only(v-html="`Show Slide`")

</template>
<script>
  import VueSlickCarousel from 'vue-slick-carousel';
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'ProductValueProps',
    components: {
      VueSlickCarousel,
      ButtonComponent,
      Icon,
    },
    props: {
      dots: Boolean,
      infinite: Boolean,
      slidesToShow: Number,
      slidesToScroll: Number,
      arrows: Boolean,
      dotsClass: String,
      lazyLoad: String,
    },
    data() {
      return {
        currentIndex: 0,
      };
    },
    methods: {
      updateIndex(slideIndex) {
        this.currentIndex = slideIndex;
      },
      enablePrevButton() {
        this.$nextTick(() => {
          this.$refs.prev.$el.classList.remove('slick-disabled');
        });
      },
      disablePrevButton() {
        this.$nextTick(() => {
          if (this.$refs.carousel && this.currentIndex === 0) {
            this.$refs.prev.$el.classList.add('slick-disabled');
          }
        });
      },
      showPrev() {
        if (this.currentIndex > 0) {
          this.$refs.carousel.prev();
        }
        if (!this.infinite) {
          this.disablePrevButton();
        }
      },
      showNext() {
        this.$refs.carousel.next();
        if (!this.infinite) {
          this.enablePrevButton();
        }
      },
    },
  };
</script>
<style lang="scss">
  .slick-list {
    .carousel--value-props & {
      margin: 0 auto;
      max-width: 100%;

      @include tablet-up {
        max-width: $content-max-width;
      }
    }
  }
  .carousel__dots-button:after {
    .slick-active & {
      border-color: $color-black;
      background-color: $color-black;
    }
  }
</style>
