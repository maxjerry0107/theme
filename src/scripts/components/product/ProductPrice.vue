<template lang="pug">
  .product-price(
    :class="`product-${product.id}`"
  )
    span.product-price__price(
      itemprop="price"
    ) {{ variant.price | money }}
    s.product-price__price.product-price__price--compare-at(v-if="isOnSale") {{ comparePrice | money }}
</template>

<script>
  export default {
    name: 'ProductPrice',
    props: {
      product: Object,
      variant: Object,
    },
    computed: {
      comparePrice() {
        const price = this.variant.compare_at_price;
        return !Number.isNaN(price) ? price : this.variant.price;
      },
      isOnSale() {
        return this.comparePrice > this.variant.price;
      },
    },
    methods: {},
  };
</script>
