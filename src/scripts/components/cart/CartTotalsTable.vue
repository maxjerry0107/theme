<template lang="pug">
  table.cart-totals-table
    tr
      th.cart-totals-table__heading Subtotal
      td.cart-totals-table__total {{ totalPrice | money }}
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'CartTotalsTable',
    computed: {
      ...mapState({
        itemsSubtotal: (state) => state.cart.items_subtotal_price,
        totalDiscount: (state) => state.cart.total_discount,
        totalPrice: (state) => state.cart.total_price,
      }),
    },
  };
</script>

<style scoped lang="scss">
  .cart-totals-table {
    font-size: rem(16);
    line-height: rem(24);
    width: 100%;
  }

  .cart-totals-table__heading {
    font-weight: $font-weight-regular;
    text-align: left;
  }

  .cart-totals-table__total {
    text-align: right;
  }
</style>
