<template lang="pug">
  .search-results.container(
    ref="container"
  )
    .search-results__inner-wrapper
      h1.search-results__header Search for products on our site
      text-input.search-results__text-input(v-model="searchTerm", label="Search all products", :hide-label="true", placeholder="Search all products")
      transition(name="fade")
        div(v-if="hasSearch")
          .search-results__grid-header
            p.search-results__product-count {{ searchResults.length }} results for "{{ searchTerm }}"
          transition(name="fade")
            .search-results.search-results(v-if="searchResults.length > 0")
              .row.small-up-1.medium-up-4
                .column(v-for="item in searchResults")
                  product-tile(:product="item", :tile-color="tileColor")
</template>

<script>
  import Fuse from 'fuse.js';
  import { mapState } from 'vuex';
  import { allProductsHandle } from 'scripts/config/collections';

  import ProductTile from 'scripts/components/product/ProductTile.vue';
  import TextInput from 'scripts/components/forms/TextInput.vue';

  export default {
    name: 'SearchResults',
    components: { ProductTile, TextInput },
    props: {
      search: String,
      tileColor: String,
    },
    data() {
      return {
        searchTerm: this.search,
        ranFallbackCheck: false,
      };
    },
    computed: {
      ...mapState({
        allCollections: (state) => state.collections.all,
      }),
      collection() {
        return this.allCollections.find((collection) => collection.handle === allProductsHandle);
      },
      searchResults() {
        const query = this.searchTerm.toLowerCase();

        const fuse = new Fuse(this.collection.products, {
          tokenize: true,
          keys: ['title', 'keywords'],
        });

        return fuse.search(query);
      },
      hasSearch() {
        return this.searchTerm !== '' && Boolean(this.collection);
      },
    },
    mounted() {
      this.ranFallbackCheck = true;
      if (!window.findify) return;
      const smartCollectionsWidgets = window.findify.widgets.findByType('search');
      const widgetNode = smartCollectionsWidgets.length > 0 ? smartCollectionsWidgets[0].node : null;
      if (widgetNode !== null && widgetNode !== this.$refs.container) {
        this.$refs.container.replaceWith(widgetNode);
      }

      this.$nextTick(() => {
        if (!this.collection) this.$store.dispatch('collections/addCollection', allProductsHandle);
        this.showFallback();
      });
    },
    updated() {
      this.$nextTick(() => {
        this.showFallback();
      });
    },
    methods: {
      showFallback() {
        const spinner = document.querySelector('#findify-component-spinner');
        const fallbackView = document.querySelector('.findify-fallback');
        if (spinner && spinner.style.display !== 'none') {
          spinner.style.display = 'none';
          fallbackView.style.display = 'block';
          fallbackView.style.visibility = 'visible';
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  .search-results__inner-wrapper {
    margin: 0 auto;
    padding: $spacing-unit * 4 $spacing-unit * 4 0;
    max-width: $container-max-width;

    @include desktop-up {
      padding: $spacing-unit * 10;
    }
  }

  .search-results__header {
    margin-bottom: $spacing-unit * 6;
    text-align: center;

    @include desktop-up {
      margin-bottom: 0;
      padding-bottom: $spacing-unit * 8.75;
      font-size: rem(34);
      border-bottom: 1px solid $color-grey-900;
    }
  }

  .search-results__grid-header {
    display: flex;
    justify-content: space-between;
    padding: $spacing-unit * 5 0 $spacing-unit * 4 0;
    border-top: 1px solid $color-grey-900;

    @include desktop-up {
      padding: $spacing-unit * 5 0 $spacing-unit * 7 0;
    }
  }

  .search-results__product-count {
    margin: 0;
    padding: 0;
    color: $color-grey-900;
    font-weight: $font-weight-regular;

    @include desktop-up {
      font-size: rem(18);
    }
  }
</style>
