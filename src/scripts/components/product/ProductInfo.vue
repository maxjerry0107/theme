<template lang="pug">
  .product-info
    .product-info__top
      h1.product-info__title(
        itemprop="name"
      ) {{ product.title }}
      product-price(
        :product="product"
        :variant="variant"
      )

    .product-info__afterpay-wrapper
      product-after-pay(
        :product="product"
      )
      slot(name="info-afterpay")

    bazaarvoice-review-summary(
      v-if="ratingSystem === 'bazaarvoice'"
      :product-id="product.id"
    )
    yotpo-review-summary(
      v-if="ratingSystem === 'yotpo'"
      :product-id="product.id"
    )

    .product-info__description(
      v-if="shortDescription"
      v-html="shortDescription"
    )
</template>

<script>
  import ProductPrice from 'scripts/components/product/ProductPrice.vue';

  export default {
    name: 'ProductInfo',
    components: {
      ProductPrice,
      ProductAfterPay: () => import('scripts/components/product/ProductAfterPay.vue'),
      BazaarvoiceReviewSummary: () => import('scripts/components/product/BazaarvoiceReviewSummary.vue'),
      YotpoReviewSummary: () => import('scripts/components/product/YotpoReviewSummary.vue'),
    },
    props: {
      product: Object,
      variant: Object,
      ratingSystem: {
        type: String,
        default: 'bazaarvoice',
      },
    },
    computed: {
      shortDescription() {
        const { description } = this.product;
        const regex = /<p>(.*?)<\/p>/;
        const corresp = regex.exec(description);
        const shortDescription = corresp ? corresp[0] : '';
        return shortDescription;
      },
    },
  };
</script>
