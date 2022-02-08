<template lang="pug">
  .product-review-summary--yotpo
    .product-review-summary--yotpo__rating(v-if="loaded")
      star-rating.product-review-summary--yotpo__stars(:rating="rating")
      a.product-review-summary--yotpo__count(v-if="count > 0" href="#") {{ reviewMessage }}
      a.product-review-summary--yotpo__no-ratings(v-else-if="loaded" href="#") No reviews yet!
</template>

<script>
  import axios from 'axios';
  import StarRating from 'scripts/components/basic/StarRating.vue';

  // add client APPKEY here (public facing)
  const YOTPO_APP_KEY = '[YOTOP_APP_KEY]';

  export default {
    name: 'YotpoReviewSummary',
    components: { StarRating },
    props: {
      productId: Number,
    },
    data() {
      return {
        loaded: false,
        rating: 0,
        count: 0,
      };
    },
    computed: {
      reviewMessage() {
        return `(${this.count})`;
      },
    },
    created() {
      if (!YOTPO_APP_KEY || YOTPO_APP_KEY === '[YOTPO_APP_KEY]'){
        return;
      }
      axios
        .get(`https://api.yotpo.com/products/${YOTPO_APP_KEY}/${this.productId}/bottomline`)
        .then(({ data }) => {
          // endpoint returns => average_score and total_reviews
          const count = data.response.bottomline.total_reviews || 0;

          this.count = count;
          if (count > 0) this.rating = data.response.bottomline.average_score;
        })
        .catch((err) => {
          throw new Error(err.response.data.status.message);
        })
        .finally(() => {
          this.loaded = true;
        });
    },
  };
</script>
