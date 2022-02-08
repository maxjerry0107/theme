<template lang="pug">
  .cart-footer
    cart-totals-table
    button-component.button--primary.button--primary-arrow.button--full-width.cart-footer__checkout-cta(
      :full="true"
      href="/checkout"
    )
      span Checkout
      icon.button__icon(name="long-arrow-right" size="18px")
    .cart-footer__promo(
      v-if="promoMessage"
      v-html="promoMessage"
    )
</template>

<script>
  import CartTotalsTable from 'scripts/components/cart/CartTotalsTable.vue';
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'CartFooter',
    components: {
      CartTotalsTable,
      ButtonComponent,
      Icon,
    },
    props: {
      promoMessage: String,
    },
  };
</script>

<style scoped lang="scss">
  .cart-footer {
    padding: $grid-gutter ($spacing-unit * 4);
    padding-top: 8px;
    flex-shrink: 0;
    background-color: $color-white;

    @include tablet-up {
      padding: ($spacing-unit * 10) ($spacing-unit * 12);
    }

    .cart & {
      padding: 0;
    }
  }

  .cart-footer__promo {
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

  .cart-footer__checkout-cta {
    font-weight: $font-weight-bold;

    /deep/ .button__content {
      width: 100%;
      justify-content: space-between;
    }
  }
</style>
