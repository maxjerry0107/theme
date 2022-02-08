<template lang="pug">
  transition(name="fade", mode="out-in", @after-enter="enableSearchResults()", @leave="disableSearchResults()")
    ul.navbar__mobile__suggested-search.u-list-simple(v-if="search.length === 0", key="suggestions")
      li.navbar__mobile__suggested-search__item.navbar__mobile__suggested-search__item--title Suggested
      li.navbar__mobile__suggested-search__item(v-for="suggestion in suggestions")
        a(href="#", @click="$emit('set-search', suggestion)") {{ suggestion }}
    .navbar__mobile__search-results(v-else, key="results")
      p.navbar__mobile__search-results__title {{ searchResults.length }} Results for #[strong {{ search }}]
      p.navbar__mobile__search-results__subtitle(v-if="searchResults.length > 0") Press enter to see all results
      transition-group.row.small-up-1(name="slide-fade-left", tag="div")
        .column(
          v-for="(product, index) in searchResults",
          v-if="showSearchResults",
          :key="product.id",
          :style="{ 'transition-delay': 0.1 * index + 's' }"
        )
          product-tile(:product="product", :horizontal="true")
</template>

<script>
  import NavbarSearchResults from 'scripts/components/site-header/NavbarSearchResults.vue';

  export default {
    name: 'NavbarMobileSearchResults',
    extends: NavbarSearchResults,
    data() {
      return {
        showSearchResults: false,
      };
    },
    methods: {
      enableSearchResults() {
        this.showSearchResults = true;
      },
      disableSearchResults() {
        this.showSearchResults = false;
      },
    },
  };
</script>

<style scoped lang="scss">
  .navbar__mobile {
    &__suggested-search {
      padding: 40px;

      &__item {
        font-weight: bold;
        font-size: rem(24);
        line-height: 1.375;

        &:not(:last-child) {
          margin-bottom: 24px;
        }

        &--title {
          margin-bottom: 36px;
          font-size: rem(16);
          line-height: 1;
        }
      }
    }

    &__search-results {
      margin-top: $grid-gutter;

      &__title {
        font-size: rem(24);
        line-height: 1.375;
        margin-bottom: 12px;
      }

      &__subtitle {
        line-height: 1;
        margin-bottom: $grid-gutter;
        font-weight: 600;
      }
    }
  }
</style>
