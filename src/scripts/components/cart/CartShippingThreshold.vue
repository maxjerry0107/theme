<template lang="pug">
  .cart-shipping-threshold
    .cart-shipping-threshold__message(v-html="thresholdMessage")
    .cart-shipping-threshold__bar(v-if="itemsSubtotal > 0 && itemsSubtotal < thresholdComputed")
      .cart-shipping-threshold__inner-bar(:style="thresholdBarStyle")
</template>

<script>
  import { mapState } from 'vuex';
  import { money } from 'scripts/filters/money.js';

  export default {
    name: '',
    props: {
      threshold: String,
    },
    computed: {
      ...mapState({
        itemsSubtotal: (state) => state.cart.total_price,
      }),
      thresholdComputed() {
        return parseInt(this.threshold * 100, 10);
      },
      thresholdPercentage() {
        return this.itemsSubtotal < this.thresholdComputed ? (this.itemsSubtotal / this.thresholdComputed) * 100 : 100;
      },
      thresholdBarStyle() {
        return { width: `${this.thresholdPercentage}%` };
      },
      thresholdMessage() {
        const threshold = this.thresholdComputed - this.itemsSubtotal;
        let message = `You're <span>${money(threshold)}</span> from free shipping`;
        if (threshold < 0) {
          message = `You qualify for free shipping!`;
        }
        return message;
      },
    },
  };
</script>

<style scoped lang="scss">
  .cart-shipping-threshold {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 0 ($spacing-unit * 10);
  }

  .cart-shipping-threshold__message {
    font-size: rem(14);
    line-height: rem(22);
    color: $color-blue-900;
    text-align: center;
    margin-bottom: ($spacing-unit * 4);
  }

  .cart-shipping-threshold__bar {
    position: relative;
    width: 100%;
    height: 3px;
    background-color: $color-teal-700;

    @include tablet-up {
      max-width: 260px;
    }

    .cart & {
      max-width: none;
    }
  }

  .cart-shipping-threshold__inner-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: $color-black;
    transition: width 0.3s ease;
  }
</style>
