<template lang="pug">
  .sidecart
    transition(name="fade")
      .sidecart__overlay(v-if="sidecartOpen", :style="sidecartStyle" @click="$store.dispatch('cart/closeSidecart')")
    transition(name="off-canvas-right")
      .sidecart__drawer(v-if="sidecartOpen" :style="sidecartStyle")
        .sidecart__container
            .sidecart__contents-wrapper
              .sidecart__contents
                .sidecart__header
                  .sidecart__header-content
                    h2.sidecart__title(
                      ref="sidecartHeading"
                      :tabindex="0"
                    ) {{ heading }}
                      span.sidecart__count ({{ cartData.item_count }})
                    button-component.button--icon.sidecart__close(
                      v-if="$mq !== 'mobile'"
                      @click="$store.dispatch('cart/closeSidecart')"
                    )
                      .u-sr-only Close side cart
                      icon.button__icon(
                        name="close"
                        size="20px"
                      )
                hr.sidecart__content-divider
                cart-shipping-threshold(v-if="!disableFreeShipping" :threshold="freeShippingThreshold")
                transition-group(name="fade")
                  cart-line-item(
                    v-if="cartData.item_count > 0"
                    v-for="(item, index) in cartData.items"
                    :item="item"
                    :line="index + 1"
                    :key="item.id"
                  )
                transition(name="fade")
                  cart-gift-form(v-if="cartData.item_count > 0")
              transition(name="fade")
                cart-footer(:promoMessage="promoMessage" v-if="cartData.item_count > 0")
              transition(name="fade")
                .sidecart__empty(
                  v-if="cartData.item_count < 1"
                  key="empty"
                )
                  p.sidecart__empty-text {{ emptyText }}
                  button-component.button--primary.button--primary-arrow.sidecart__empty-cta(
                    v-if="emptyCartCtaUrl && emptyCartCtaText"
                    :href="emptyCartCtaUrl"
                  ) {{ emptyCartCtaText }}
                    icon.button__icon(name="long-arrow-right" size="18px")
                  button-component.button--primary.button--primary-arrow.sidecart__empty-cta.sidecart__empty-cta--secondary(
                    v-if="emptyCartSecondaryCtaUrl && emptyCartSecondaryCtaText"
                    :href="emptyCartSecondaryCtaUrl"
                  ) {{ emptyCartSecondaryCtaText }}
                    icon.button__icon(name="long-arrow-right" size="18px")
</template>

<script>
  import { mapState } from 'vuex';

  import Icon from 'scripts/components/basic/Icon.vue';
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';
  import CartLineItem from 'scripts/components/cart/CartLineItem.vue';
  import CartTotalsTable from 'scripts/components/cart/CartTotalsTable.vue';
  import CartGiftForm from 'scripts/components/cart/CartGiftForm.vue';
  import CartShippingThreshold from 'scripts/components/cart/CartShippingThreshold.vue';
  import CartFooter from 'scripts/components/cart/CartFooter.vue';

  export default {
    name: 'Sidecart',
    components: {
      ButtonComponent,
      CartShippingThreshold,
      CartGiftForm,
      Icon,
      CartLineItem,
      CartTotalsTable,
      CartFooter,
    },
    props: {
      heading: String,
      emptyText: String,
      emptyCartCtaText: String,
      emptyCartCtaUrl: String,
      emptyCartSecondaryCtaText: String,
      emptyCartSecondaryCtaUrl: String,
      promoMessage: String,
      emptyImage: String,
      emptyImageAlt: String,
      headerBackgroundImage: String,
      customerId: String,
      customerEmail: String,
      permanentDomain: String,
      disableFreeShipping: {
        type: Boolean,
        default: false,
      },
      freeShippingThreshold: String,
    },
    data() {
      return {
        sidecartStyle: '',
        siteHeader: '',
      };
    },
    computed: {
      ...mapState({
        cartData: (state) => state.cart,
        items: (state) => state.cart.items,
        itemsSubtotal: (state) => state.cart.total_price,
        sidecartOpen: (state) => state.cart.sidecartOpen,
      }),
      cartCountText() {
        return this.cartData.item_count === 1 ? '1 item' : `${this.cartData.item_count} items`;
      },
      isMobile() {
        return ['mobile'].includes(this.$mq);
      },
    },
    watch: {
      totalPrice() {
        this.checkGiftWithPurchase();
      },
      sidecartOpen() {
        this.$nextTick(() => {
          if (this.sidecartOpen) {
            this.$refs.sidecartHeading.focus();
          }
        });
      },
    },
    mounted() {
      this.siteHeader = document.querySelector('.site-header-wrapper');
      new ResizeObserver(this.setCartStyle).observe(this.siteHeader);
    },
    methods: {
      setCartStyle() {
        const style = {
          top: `${this.siteHeader.offsetHeight}px`,
          height: `calc(100% - ${this.siteHeader.offsetHeight}px)`,
        };
        this.sidecartStyle = this.isMobile ? style : '';
      },
    },
  };
</script>

<style scoped lang="scss">
  /*
     * 1. Override auto to prevent growing too tall
     *
     */

  .sidecart {
  }

  .sidecart__overlay {
    position: fixed;
    top: 0;
    right: 0;
    z-index: index($layout, 'sidecart-overlay');
    width: 100%;
    height: 100%;
    background-color: $color-transparent-black;
  }

  .sidecart__drawer {
    display: flex;
    position: fixed;
    top: 0;
    right: 0;
    z-index: index($layout, 'sidecart-drawer');
    width: 100%;
    height: 100%;
    flex-direction: column;
    background-color: $color-white;

    @include tablet-up {
      max-width: 480px;
    }
  }

  .sidecart__header {
    position: relative;
    flex-shrink: 0;
  }

  .sidecart__header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
  }

  .sidecart__title {
    width: 100%;
    margin: 0;
    font-size: rem(22);
    line-height: rem(28);
    text-align: center;

    @include tablet-up {
      font-size: rem(26);
      line-height: rem(32);
    }

    &:focus {
      box-shadow: none;
    }
  }

  .sidecart__close {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .sidecart__count {
    font-family: $font-body;
    font-size: rem(14);
    line-height: rem(22);
    margin-left: 5px;

    @include tablet-up {
      font-size: rem(16);
    }
  }

  .sidecart__content-divider {
    margin: ($spacing-unit * 4) 0;
    border: 0;
    border-top: 1px solid $color-teal-700;
  }

  .sidecart__container {
    display: flex;
    flex-grow: 1;
    min-height: 0; /* [1] */
  }

  .sidecart__contents-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
  }

  .sidecart__contents {
    padding: ($spacing-unit * 5) ($spacing-unit * 4);
    overflow-y: auto;
    overflow-x: hidden;

    @include tablet-up {
      padding: ($spacing-unit * 5) ($spacing-unit * 12);
    }
  }

  .sidecart__checkout-cta {
    margin-top: 10px;
  }

  .sidecart__empty-cta {
    font-weight: $font-weight-bold;

    /deep/ .button__content {
      width: 100%;
      justify-content: space-between;
    }
  }

  .sidecart__empty {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    justify-content: center;
    width: 100%;
    background-size: 181px;
    background-repeat: no-repeat;
    background-position: bottom right;

    @include tablet-up {
      background-size: 251px;
    }
  }

  .sidecart__empty-text {
    margin-bottom: $spacing-unit * 10;
    color: $color-black;
    font-family: $font-primary;
    font-size: rem(16);
    line-height: rem(24);
    letter-spacing: 0.11em;
  }

  .sidecart__empty-cta {
    margin-bottom: $spacing-unit * 4;
    padding: ($spacing-unit * 3) ($spacing-unit * 5);
    min-width: 210px;
    white-space: normal;
  }

  .sidecart__empty-cta--secondary {
  }
  .sidecart__footer {
    padding: $grid-gutter ($spacing-unit * 4);
    padding-top: 8px;
    flex-shrink: 0;
    background-color: $color-grey-900;

    @include tablet-up {
      padding: ($spacing-unit * 10) ($spacing-unit * 12);
    }
  }

  .sidecart__promo {
    padding: ($spacing-unit * 4) 0 0;

    /deep/ p {
      margin: 0;
      padding: 0;
      font-size: rem(14);
      line-height: rem(22);
      text-align: center;
      color: $color-grey-900;
    }
  }
</style>
