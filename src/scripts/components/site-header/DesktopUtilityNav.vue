<template>
  <div class="desktop-utility">
    <ul class="desktop-utility__nav">
      <li class="desktop-utility__nav-link">
        <v-button
          html-tag="a"
          :href="favoritesLink"
          icon="favorites"
          iconSize="24px">
        </v-button>
        <span class="nav-link__text">Favorites</span>
      </li>
      <li class="desktop-utility__nav-link">
        <v-button
          html-tag="a"
          :href="userLink"
          icon="account"
          iconSize="24px">
        </v-button>
        <span class="nav-link__text">{{ userLabel }}</span>
      </li>
      <li class="desktop-utility__nav-link">
        <cart-link />
      </li>
    </ul>
  </div>
</template>

<script>
  import VButton from 'scripts/components/buttons/VButton.vue';
  import CartLink from 'scripts/components/site-header/CartLink.vue';

  export default {
    name: 'DesktopUtilityNav',
    components: {
      CartLink,
      VButton,
    },
    props: {
      loggedIn: {
        type: Boolean,
        default: false,
      },
      favoritesLink: String,
    },
    data() {
      return {};
    },
    computed: {
      userLink() {
        return this.loggedIn ? '/account' : '/account/login';
      },
      userLabel() {
        return this.loggedIn ? 'My Account' : 'Log In';
      },
    },
  };
</script>

<style lang="scss" scoped>
  .desktop-utility {
    display: block;
    width: 100%;
    background: $color-grey-900;
  }

  .desktop-utility__nav {
    list-style: none;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 0;
    padding: rem(15) rem(32);

    @include hd-up {
      padding: rem(15) rem(52);
    }
  }

  .desktop-utility__nav-link {
    cursor: pointer;

    &:not(:last-of-type) {
      display: flex;
      align-items: center;
      margin-right: rem(34);
    }

    a {
      line-height: 1;
      margin-right: rem(6);
    }
  }

  .nav-link__text, /deep/ .cart-link__text {
    font-size: rem(14);
    font-weight: $font-weight-regular;
    line-height: rem(14);
    letter-spacing: rem(2);
    color: $color-blue-900;
    text-transform: uppercase;
  }

  /deep/ .cart-link {
    cursor: pointer;
  }
</style>
