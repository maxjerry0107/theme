<template lang="pug">
  .header-search(:class="{'header-search--inline' : inlineSearch}")
    button.button.button--icon.header-search__button(
      v-if="!inlineSearch"
      @click="hideHeaderSearch"
    )
      icon.button__icon(
        name="search"
        class="button__icon"
        size="20px"
      )
      span.u-sr-only Open Search
    transition(name="fade")
      .header-search__content(
        v-show="showSearchForm || inlineSearch"
        ref="searchContent"
      )
        navbar-search(
          ref="searchBox",
          form-action="/pages/search-results"
          v-model="searchParam",
          placeholder="Search"
          @open-results="showSubnav('search')",
          @close-results="hideSearch"
        )
        transition(name="fade")
          .header-search__results(
            v-if="subnav && subnav === 'search'",
            @mouseenter="overSearchResults = true",
            @mouseleave="overSearchResults = false"
          )
            .header-search__findify(
              ref="searchResults"
            )
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue';
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';
  import NavbarSearch from 'scripts/components/site-header/NavbarSearch.vue';

  export default {
    name: 'HeaderSearch',
    components: {
      Icon,
      ButtonComponent,
      NavbarSearch,
    },
    props: {
      inlineSearch: {
        type: Boolean,
        default: false,
      },
      suggestedSearches: {
        type: Array,
        default: () => [],
      },
      productImageBackgroundColor: String,
    },
    data() {
      return {
        showSearchForm: false,
        searchParam: '',
        subnav: null,
        overSearchResults: false,
        findifyEnabled: true,
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.loadFindifyAutocomplete();
      });
    },
    methods: {
      showSubnav(subnav) {
        this.subnav = subnav;
      },
      hideHeaderSearch() {
        this.showSearchForm = !this.showSearchForm;
        const autoCompleteElements = document.querySelectorAll('.findify-autocomplete');
        const style = !this.showSearchForm ? 'none' : 'block';

        autoCompleteElements.forEach((element) => {
          // eslint-disable-next-line no-param-reassign
          element.style.display = style;
        });
      },
      hideSearch() {
        if (!this.overSearchResults) this.hideSubnav();
      },
      hideSubnav() {
        this.subnav = null;
      },
      suggestionSelected(suggestion) {
        this.$refs.searchBox.update(suggestion);
      },
      loadFindifyAutocomplete() {
        if (!window.findify) return;
        const autocompleteWidgets = window.findify.widgets.findByType('autocomplete');
        const widgetNode = autocompleteWidgets.length > 0 ? autocompleteWidgets[0].node : null;
        if (widgetNode !== null && widgetNode !== this.$refs.searchContent) {
          this.$refs.searchContent.replaceWith(widgetNode);
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  .header-search--inline {
    width: 100%;
  }

  .header-search__content {
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    padding: $spacing-unit * 4;

    .mobile-utility & {
      padding: 0 !important;
      min-width: 230px;
    }
  }

  .header-search__content {
    .header-search--inline & {
      position: static;
      right: unset;
      padding: 0 0 0 $spacing-unit * 4;
    }
  }

  .header-search__results {
    .header-search--inline & {
      position: absolute;
      top: 100%;
      right: 0;
      left: 0;
      background-color: $color-white;
    }
  }
</style>
