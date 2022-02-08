<template lang="pug">
  .cart
    transition(name="fade", mode="out-in")
      .cart__wrapper
        .cart__contents
          .cart__header
            h1.cart__heading {{ heading }}
              span.cart__count ({{ totalItems }})
          cart-shipping-threshold(v-if="$mq == 'mobile' && !disableFreeShipping" :threshold="freeShippingThreshold")
          transition-group.cart__items(
            name="slide-fade-left"
            tag="ul"
            v-if="totalItems > 0"
            key="contents"
          )
            cart-line-item(
              v-for="(item, index) in items",
              :item="item",
              :line="index + 1",
              :key="item.id",
              @gwp-cancelled="cancelThresholdProduct"
            )

          .cart__empty(v-else, key="empty")
            p.cart__empty-text {{ emptyText }}
            button-component.button--primary.button--primary-arrow.cart__empty-cta(
              v-if="emptyCartCtaUrl && emptyCartCtaText"
              :href="emptyCartCtaUrl"
            ) {{ emptyCartCtaText }}
              icon.button__icon(name="long-arrow-right" size="18px")
            button-component.cart__empty-cta.cart__empty-cta--secondary.button--green(
              v-if="emptyCartSecondaryCtaUrl && emptyCartSecondaryCtaText"
              :href="emptyCartSecondaryCtaUrl"
            ) {{ emptyCartSecondaryCtaText }}

        .cart__checkout-column
          cart-shipping-threshold(v-if="$mq !== 'mobile' && !disableFreeShipping" :threshold="freeShippingThreshold")
          template(v-if="totalItems > 0")
            cart-gift-form
            cart-footer(:promoMessage="promoMessage")

</template>

<script>
  import { mapState } from 'vuex';
  import { gwpTypes, gwpStorageCancelledKeys } from 'scripts/config/gwp';

  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';
  import CartLineItem from 'scripts/components/cart/CartLineItem.vue';
  import CartTotalsTable from 'scripts/components/cart/CartTotalsTable.vue';
  import CartShippingThreshold from 'scripts/components/cart/CartShippingThreshold.vue';
  import CartGiftForm from 'scripts/components/cart/CartGiftForm.vue';
  import CartFooter from 'scripts/components/cart/CartFooter.vue';
  import Icon from 'scripts/components/basic/Icon.vue';

  const GWP_TYPE_THRESHOLD = gwpTypes.threshold;
  const GWP_THRESHOLD_CANCELLED_KEY = gwpStorageCancelledKeys.threshold;

  export default {
    name: 'Cart',
    components: {
      ButtonComponent,
      CartLineItem,
      CartTotalsTable,
      CartShippingThreshold,
      CartGiftForm,
      CartFooter,
      Icon,
    },
    props: {
      heading: String,
      promoMessage: String,
      emptyText: String,
      emptyCartCtaText: String,
      emptyCartCtaUrl: String,
      emptyCartSecondaryCtaText: String,
      emptyCartSecondaryCtaUrl: String,
      productColumnLabel: String,
      priceColumnLabel: String,
      quantityColumnLabel: String,
      totalColumnLabel: String,
      emptyImage: String,
      emptyImageAlt: String,
      thresholdProductHandle: String,
      customerId: String,
      customerEmail: String,
      permanentDomain: String,
      freeShippingThreshold: String,
      disableFreeShipping: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      ...mapState({
        allProducts: (state) => state.products.all,
        items: (state) => state.cart.items,
        itemsSubtotal: (state) => state.cart.items_subtotal_price,
        totalDiscount: (state) => state.cart.total_discount,
        totalPrice: (state) => state.cart.total_price,
        totalItems: (state) => state.cart.item_count,
      }),
      cartCountText() {
        return this.items.length === 1 ? '1 item' : `${this.items.length} items`;
      },
      thresholdProduct() {
        return this.thresholdProductHandle ? this.allProducts.find((p) => p.handle === this.thresholdProductHandle) : false;
      },
      hasThresholdProduct() {
        const thresholdProductItem = this.items
          ? this.items.find((p) => {
              return this.thresholdProduct && p.id === this.thresholdProduct.variants[0].id && p.properties && p.properties._gwp === GWP_TYPE_THRESHOLD;
            })
          : false;

        return this.thresholdProduct ? Boolean(thresholdProductItem) : false;
      },
    },
    methods: {
      cancelThresholdProduct() {
        window.sessionStorage.setItem(GWP_THRESHOLD_CANCELLED_KEY, 'true');
      },
    },
  };
</script>

<style lang="scss">
  .cart {
    position: relative;
    padding: ($spacing-unit * 6) ($spacing-unit * 4) ($spacing-unit * 20);
  }

  .cart__wrapper {
    @include tablet-up {
      display: flex;
      justify-content: space-between;
      margin: 0 auto;
      max-width: 1080px;
    }
  }

  .cart__contents {
    margin-bottom: $spacing-unit * 5;

    @include tablet-up {
      margin-bottom: 0;
      padding-right: $spacing-unit * 25;
      flex: 1;
    }
  }

  .cart__header {
    position: relative;
    margin-bottom: $spacing-unit * 6;
    padding-bottom: $spacing-unit * 6;
    line-height: $spacing-unit * 10;
    border-bottom: 1px solid $color-teal-700;
    text-align: center;

    @include tablet-up {
      margin-bottom: $spacing-unit * 14;
      padding-bottom: $spacing-unit * 8;
      text-align: left;
    }
  }

  .cart__heading {
    width: 100%;
    margin: 0;
    font-family: $font-headings;
    font-size: rem(22);
    font-weight: $font-weight-regular;
    line-height: rem(28);

    @include tablet-up {
      font-size: rem(26);
      line-height: rem(32);
    }

    &:focus {
      box-shadow: none;
    }
  }

  .cart__count {
    font-family: $font-body;
    font-size: rem(14);
    line-height: rem(22);
    margin-left: 5px;

    @include tablet-up {
      font-size: rem(16);
    }
  }

  .cart__items {
    margin: 0;
    padding: 0;
  }

  .cart__checkout-column {
    @include tablet-up {
      margin-top: $spacing-unit * 18;
      padding-left: $spacing-unit * 4;
      width: 320px;
    }
  }

  .cart__totals {
    margin-bottom: $spacing-unit * 4;
    padding: ($spacing-unit * 5) ($spacing-unit * 4);
    font-size: rem(18);
    line-height: rem(22);
    background: $color-white;

    @include tablet-up {
      margin-bottom: $spacing-unit * 4;
      font-size: rem(20);
    }

    table {
      padding-bottom: $spacing-unit * 4;
      width: 100%;
      border-bottom: 1px solid $color--primary;
    }

    th {
      font-weight: $font-weight-regular;
      text-align: left;
    }

    td {
      text-align: right;
    }
  }

  .cart__promo-message {
    margin-top: $spacing-unit * 4;
    font-size: rem(14);
    line-height: rem(20);
    text-align: center;
  }

  .cart__empty {
    display: flex;
    padding: ($spacing-unit * 10) 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .cart__empty-text {
    margin-bottom: $spacing-unit * 10;
    color: $color-black;
    font-family: $font-primary;
    font-size: rem(16);
    line-height: rem(24);
    letter-spacing: 0.11em;
  }

  .cart__empty-cta {
    margin-bottom: $spacing-unit * 4;
    padding: ($spacing-unit * 3) ($spacing-unit * 5);
    width: 250px;
    white-space: normal;
  }

  .cart__empty-cta--secondary {
  }

  .cart__form {
    margin-bottom: $spacing-unit * 5;
  }

  .cart__continue-shopping {
    color: $color-grey-900;
  }
</style>
