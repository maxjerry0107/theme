<template lang="pug">
  .navbar-search-results
    transition(name="fade", mode="out-in")
      ul.navbar-search-results__suggestions(v-if="search.length === 0 && suggestions.length > 0", key="suggestions")
        li.navbar-search-results__suggestions-title Suggested Searches:
        li.navbar-search-results__suggestions-item(v-for="suggestion in suggestions", :key="suggestion")
          a(href="#", @keydown.tab="tabOut(suggestion)", @click.prevent="$emit('selected', suggestion)") {{ suggestion }}

      .navbar-search-results__results(v-if="search.length > 0", key="results")
        .navbar-search-results__results-info
          h2.heading.heading--4.navbar-search-results__results-info-title {{ searchResults.length }} Results for #[strong {{ search }}]
          p.heading.heading--5.navbar-search-results__results-info-subtitle(v-if="searchResults.length > 0") Press enter to see all results
        .navbar-search-results__results-products
          product-tile(
            v-for="product in searchResults", :key="product.id"
            :product="product"
            :tileColor="productImageBackgroundColor"
            :horizontal="['mobile'].includes($mq)"
          )
</template>

<script>
  import Fuse from 'fuse.js';
  import storeCollection from 'scripts/mixins/storeCollection';
  import ProductTile from 'scripts/components/product/ProductTile.vue';

  export default {
    name: 'NavbarSearchResults',
    components: {
      ProductTile,
    },
    mixins: [storeCollection],
    props: {
      search: String,
      suggestions: {
        type: Array,
        default: () => [],
      },
      productImageBackgroundColor: String,
    },
    computed: {
      searchResults() {
        const query = this.search.toLowerCase();

        if (!this.collection) return [];

        const fuse = new Fuse(this.collection.products, {
          tokenize: true,
          keys: ['title', 'keywords'],
        });

        return fuse.search(query).slice(0, 3);
      },
    },
    methods: {
      tabOut(suggestion) {
        const lastSuggestion = this.suggestions[this.suggestions.length - 1];

        if (suggestion === lastSuggestion) {
          this.$emit('close-results');
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  .navbar-search-results {
    margin-top: $spacing-unit * 5;
  }

  .navbar-search-results__suggestions {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    padding: 0;
  }

  .navbar-search-results__suggestions-item {
    margin-left: $spacing-unit * 3;
  }

  .navbar-search-results__results-info {
    margin-bottom: 10px;
    width: 100%;
    text-align: center;
  }

  .navbar-search-results__results-products {
    @include tablet-up {
      display: flex;
      justify-content: space-evenly;
    }
  }
</style>
