<template lang="pug">
  .pagination
    ul.pagination-inner.u-list-inline
      li.pagination__item.pagination__item--first(v-if="totalPages > 1")
        icon-button(
          label="Previous Page"
          icon="arrow-long-right"
          size="10px"
          :disabled="currentPage === 1"
          @click="firstPage"
        )
      li.pagination__item.pagination__item--prev(v-if="totalPages > 1")
        icon-button(
          label="Previous Page"
          icon="arrow-left"
          size="10px"
          :disabled="currentPage === 1"
          @click="previousPage"
        )
      span.pagination__info Page {{ currentPage }} out of {{ totalPages }}
      li.pagination__item.pagination__item--next(v-if="totalPages > 1")
        icon-button(
          label="Next Page"
          icon="arrow-right"
          size="10px"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        )
      li.pagination__item.pagination__item--last(v-if="totalPages > 1")
        icon-button(
          label="Next Page"
          icon="arrow-long-right"
          size="10px"
          :disabled="currentPage === totalPages"
          @click="lastPage"
        )
</template>

<script>
  import IconButton from 'scripts/components/buttons/IconButton.vue';

  export default {
    name: 'Pagination',
    components: { IconButton },
    props: {
      totalPages: Number,
      startingPage: {
        type: Number,
        default: 1,
      },
    },
    data() {
      return {
        currentPage: this.startingPage,
      };
    },
    watch: {
      currentPage() {
        this.$emit('change-page', this.currentPage);
      },
    },
    methods: {
      scrollToTop() {
        window.scrollTo(0, 0);
      },
      firstPage() {
        if (this.currentPage > 0) {
          this.scrollToTop();
          this.currentPage = 1;
        }
      },
      previousPage() {
        if (this.currentPage > 0) {
          this.scrollToTop();
          this.currentPage -= 1;
        }
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.scrollToTop();
          this.currentPage += 1;
        }
      },
      lastPage() {
        if (this.currentPage < this.totalPages) {
          this.scrollToTop();
          this.currentPage = this.totalPages;
        }
      },
      setPage(page) {
        this.currentPage = page;
      },
    },
  };
</script>

<style scoped lang="scss">
  .pagination {
    display: flex;
    justify-content: center;
    align-self: center;
  }

  .pagination__item--prev {
    margin-left: $spacing-unit * 12;

    @include tablet-up {
      margin-left: $spacing-unit * 18;
    }
  }

  .pagination__item--next {
    margin-right: $spacing-unit * 12;

    @include tablet-up {
      margin-right: $spacing-unit * 18;
    }
  }

  .pagination__info {
    margin: 0 ($spacing-unit * 4);

    @include tablet-up {
      margin: 0 ($spacing-unit * 22);
    }
  }
</style>
