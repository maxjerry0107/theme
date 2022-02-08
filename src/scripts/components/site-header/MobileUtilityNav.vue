<template>
  <div class="mobile-utility">
    <ul class="mobile-utility__nav">
      <li>
        <mobile-navigation
          :menuItems="menuItems"
          :loggedIn="loggedIn"
        />
      </li>
      <li>
        <header-search
          inlineSearch
          :productImageBackgroundColor="productImageBackgroundColor"
          :suggestedSearches="suggestedSearches"
        />
      </li>
      <li>
        <cart-link />
      </li>
    </ul>
  </div>
</template>

<script>
  import HeaderSearch from 'scripts/components/site-header/HeaderSearch.vue';
  import CartLink from 'scripts/components/site-header/CartLink.vue';
  import MobileNavigation from 'scripts/components/site-header/MobileNavigation.vue';

  export default {
    name: 'MobileUtilityNav',
    components: {
      HeaderSearch,
      CartLink,
      MobileNavigation,
    },
    props: {
      suggestedSearches: {
        type: Array,
        default: () => [],
      },
      productImageBackgroundColor: String,
      menuItems: {
        type: Array,
        default: () => [],
      },
      loggedIn: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {};
    },
    computed: {},
  };
</script>

<style lang="scss" scoped>
  .mobile-utility {
    display: block;
    position: relative;

    @include tablet-up {
      display: none;
    }
  }

  .mobile-utility__nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style: none;
    height: 44px;
    margin: 0;
    padding: rem(8) rem(12);
    background: $color-grey-900;
  }
</style>
