import { mapState } from 'vuex';

export default {
  props: {
    productHandle: String,
  },
  computed: {
    ...mapState({
      allProducts: (state) => state.products.all,
    }),
    product() {
      return this.allProducts.find((product) => product.handle === this.productHandle);
    },
  },
  mounted() {
    if (!this.product) {
      this.$store.dispatch('products/addProduct', this.productHandle);
    }
  },
};
