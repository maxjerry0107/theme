<template lang="pug">
.header-promo-wrapper
  slot(
    name="default"
    v-if="!mounted"
  )
  .header-promo-bar(
    v-if="mounted && promoBarMessages && promoBarMessages.length > 0"
    :style="barStyles"
    :class="{'header-promo-bar--active':activePromoBar}"
  )
    .container.header-promo-bar__container
      .row
        .header-promo-bar__promo-content.column.small-8.medium-6(
          ref="promoCarousel"
          :is="promoBarMessages.length > 1 ? 'VueSlickCarousel' : 'div'"
          :class="promoBarMessages.length > 1 ? 'carousel--promo-bar' : ''"
          v-bind="options"
        )
          .header-promo-bar__promo(
            v-for="(promoBarMessage, index) in promoBarMessages"
            v-html="promoBarMessage.message"
            :key="`header-promo-bar_${_uid}_message${index}`"
          )
          template(slot="prevArrow")
            button-component.button--icon.header-promo-bar__navigation.header-promo-bar__navigation-left(
              title="Previous"
              role="button"
            )
              icon(
                name="caret-left",
                size="12px"
              )
          template(slot="nextArrow")
            button-component.button--icon.header-promo-bar__navigation.header-promo-bar__navigation-right(
              title="Next"
              role="button"
            )
              icon(
                name="caret-right",
                size="12px"
              )
    button-component.button--icon.header-promo-bar__close-button(
      title="Close"
      role="button"
      icon="close"
      iconSize="12px"
      @click="closePromoBar"
    )
</template>

<script>
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';
  import Icon from 'scripts/components/basic/Icon.vue';
  import VueSlickCarousel from 'vue-slick-carousel';

  export default {
    components: {
      ButtonComponent,
      VueSlickCarousel,
      Icon,
    },
    props: {
      promoBarBackgroundColor: String,
      promoBarTextColor: String,
      promoBarLinkHoverColor: String,
      promoBarMessages: Array,
      promoBarSpeed: Number,
    },
    data() {
      return {
        mounted: false,
        activePromoBar: true,
        options: {
          arrows: true,
          autoplay: true,
          dots: false,
          fade: true,
          autoplaySpeed: 1000,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      };
    },
    computed: {
      barStyles() {
        let styles = '';
        styles += this.promoBarLinkHoverColor ? `--link-hover-color: ${this.promoBarLinkHoverColor}; ` : '';
        styles += this.promoBarBackgroundColor ? `background-color: ${this.promoBarBackgroundColor}; ` : '';
        styles += this.promoBarTextColor ? `color: ${this.promoBarTextColor};` : '';

        return styles;
      },
    },
    created() {
      this.options.autoplaySpeed = this.promoBarSpeed * 1000;
    },
    mounted() {
      this.mounted = true;
    },
    methods: {
      closePromoBar() {
        this.activePromoBar = false;
      },
    },
  };
</script>

<style lang="scss">
  .header-promo-bar {
    display: none;
    align-items: center;
    position: relative;
    padding: $spacing-unit 0;
    min-height: $mobile-header-promo-bar-height;

    @include tablet-up {
      min-height: $desktop-header-promo-bar-height;
    }

    .slick-track {
      display: flex;
      align-items: center;
    }

    .icon {
      fill: $color-white;
    }
  }

  .header-promo-bar--active {
    display: flex;
  }

  .header-promo-bar__container {
    position: relative;
    width: 100%;
  }

  .header-promo-bar__promo-content {
    .row & {
      margin: 0 auto;
      font-size: px-to-rem(14px);
      text-align: center;
      padding: 0 $spacing-unit * 5;

      p {
        margin: 0;
        font-size: inherit;
      }

      a {
        color: inherit;

        &:hover {
          color: var(--link-hover-color);
        }
      }
    }
  }

  .header-promo-bar__promo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: rem(12);
    line-height: rem(17);
    text-transform: uppercase;
    letter-spacing: 0.085em;
  }

  .header-promo-bar__navigation {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .header-promo-bar__navigation-left {
    left: 0;
  }

  .header-promo-bar__navigation-right {
    right: 0;
  }

  .header-promo-bar__close-button {
    position: absolute;
    top: 50%;
    right: $spacing-unit * 5;
    transform: translateY(-50%);

    svg {
      fill: $color-white;
    }
  }
</style>
