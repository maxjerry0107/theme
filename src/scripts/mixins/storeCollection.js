import { mapState } from 'vuex';

export default {
  props: {
    collectionHandle: String,
  },
  computed: {
    ...mapState({
      allCollections: (state) => state.collections.all,
    }),
    collection() {
      const collection = this.allCollections.find((collection) => collection.handle === this.collectionHandle);
      return collection || this.preloadedCollection;
    },
  },
  mounted() {
    this.$store.dispatch('collections/addCollection', this.collectionHandle).then(this.doneFetching);
  },
};
