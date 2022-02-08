<template lang="pug">
  .product-review-summary
    .star-rating
      div(
        data-bv-show="rating_summary"
        :data-bv-product-id="productId"
      )
</template>

<script>
  export default {
    name: 'BazaarvoiceReviewSummary',
    props: {
      productId: Number,
    },
  };
</script>
