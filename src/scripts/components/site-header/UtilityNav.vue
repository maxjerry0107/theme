<template lang="pug">
  ul.utility-nav

    li.utility-nav__link(
      v-if="$mq == 'mobile'"
    )
      v-button.button--icon(
        html-tag="a"
        :href="userLink"
      )
        icon(
          name="account"
          class="button__icon"
          size="24px"
        )
        span.nav-link__text Sign In
        .u-sr-only {{ userLabel }}

    li.utility-nav__link(
      v-if="$mq == 'mobile'"
    )
      v-button.button--icon(
        html-tag="a"
        :href="userLink"
      )
        icon(
          name="favorites"
          class="button__icon"
          size="24px"
        )
        span.nav-link__text Favorites
        .u-sr-only {{ userLabel }}

    header-search(
      v-if="!isMobile"
      :inline-search="true"
      :productImageBackgroundColor="productImageBackgroundColor"
      :suggestedSearches="suggestedSearches"
    )

</template>
<script>
  import Icon from 'scripts/components/basic/Icon.vue';
  import VButton from 'scripts/components/buttons/VButton.vue';
  import HeaderSearch from 'scripts/components/site-header/HeaderSearch.vue';
  import CartLink from 'scripts/components/site-header/CartLink.vue';

  export default {
    name: 'UtilityNav',
    components: {
      Icon,
      VButton,
      HeaderSearch,
      CartLink,
    },
    props: {
      loggedIn: {
        type: Boolean,
        default: false,
      },
      suggestedSearches: {
        type: Array,
        default: () => [],
      },
      productImageBackgroundColor: String,
    },
    computed: {
      userLink() {
        return this.loggedIn ? '/account' : '/account/login';
      },
      userLabel() {
        return this.loggedIn ? 'My Account' : 'Log In';
      },
      isMobile() {
        return this.$mq === 'mobile' || this.$mq === 'sm';
      },
    },
  };
</script>

<style lang="scss" scoped>
  .button--icon {
    display: inline-flex;
    width: max-content;
    border: none;
    background: transparent;
    text-decoration: none;
  }

  /deep/ .button__content {
    display: flex;
    align-items: center;
  }

  .button__icon {
    margin-right: 5px;
  }

  .nav-link__text {
    font-size: rem(10);
    line-height: rem(10);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: $color-blue-900;
  }
</style>
