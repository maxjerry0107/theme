<template lang="pug">
  .cart-link
    v-button.button--icon(
      @click="toggleSideCart"
    )
      .u-sr-only Open Cart
      icon(
        :name="cartIcon"
        class="button__icon"
        size="24px"
      )
    span.cart-link__text Cart
    span.cart-link__quantity(v-if="numCartItems > 0 && !sidecartOpen")
      span.cart-link__count {{ numCartItems }}
</template>

<script>
  import { mapState } from 'vuex';
  import Icon from 'scripts/components/basic/Icon.vue';
  import VButton from 'scripts/components/buttons/VButton.vue';

  export default {
    name: 'CartLink',
    components: {
      Icon,
      VButton,
    },
    computed: {
      ...mapState({
        checkout: (state) => state.cart,
        sidecartOpen: (state) => state.cart.sidecartOpen,
      }),
      numCartItems() {
        if (this.checkout) {
          return this.checkout.item_count || 0;
        }
        return 0;
      },
      cartIcon() {
        return this.sidecartOpen && this.isMobile ? 'close' : 'cart';
      },
      isMobile() {
        return ['mobile'].includes(this.$mq);
      },
    },
    methods: {
      toggleSideCart(){
        if (this.sidecartOpen) this.$store.dispatch('cart/closeSidecart');
        else this.$store.dispatch('cart/openSidecart')
      }
    },
  };
</script>

<style lang="scss" scoped>
  .cart-link {
    display: flex;
    align-items: center;
  }

  .cart-link__text {
    font-size: rem(10);
    line-height: rem(10);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: $color-blue-900;
  }

  .button--icon {
    display: inline-flex;
    width: max-content;
    border: none;
    background: transparent;
    padding: 0;
  }

  .button--icon {
    margin-right: 5px;
  }
</style>
