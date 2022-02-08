<template lang="pug">
  .cart-gift-form
    checkbox-input.cart-gift-form__checkbox-input(
      name="test-checkbox"
      label="This Order Is A Gift"
      id="gift_checkbox"
      :checked="cartIsGiftComputed"
      v-model="cartIsGiftComputed"
    )
    text-input.text-input--gift-message-input(
      v-if="!isGift ? cartIsGiftComputed : isGift"
      label="gift message"
      type="textarea"
      placeholder="Optional Gift Message"
      v-model="giftMessageComputed"
      hideLabel
    )
    p(v-if="!isGift ? cartIsGiftComputed : isGift") Please use text characters only
</template>

<script>
  import { mapState } from 'vuex';

  import CheckboxInput from 'scripts/components/forms/CheckboxInput.vue';
  import TextInput from 'scripts/components/forms/TextInput.vue';
  import { debounce } from 'scripts/helpers/util';

  export default {
    name: '',
    components: {
      CheckboxInput,
      TextInput,
    },
    props: {},
    data() {
      return {
        isGift: '',
        giftMessage: '',
        key1: 'Is Gift',
        key2: 'Gift Message',
      };
    },
    computed: {
      ...mapState({
        cartIsGift: (state) => state.cart.attributes['Is Gift'],
        cartGiftMessage: (state) => state.cart.attributes['Gift Message'],
      }),
      cartIsGiftComputed: {
        get() {
          return !(this.cartIsGift == 'false' || !this.cartIsGift);
        },
        set(val) {
          this.isGift = val;
        },
      },
      giftMessageComputed: {
        get() {
          return this.cartGiftMessage;
        },
        set(val) {
          this.giftMessage = val;
        },
      },
      attributes() {
        const isGift = this.giftMessage ? true : this.isGift;
        return [
          { key: this.key1, value: isGift },
          { key: this.key2, value: this.giftMessage },
        ];
      },
    },
    watch: {
      isGift(newVal) {
        if (!newVal) {
          this.giftMessage = '';
        }
        this.updateAttributes();
      },
      giftMessage() {
        this.updateAttributes();
      },
    },
    methods: {
      updateAttributes: debounce(function updateItemDebounce() {
        this.$store.dispatch('cart/updateAttributes', this.attributes);
      }, 500),
    },
  };
</script>

<style scoped lang="scss">
  .cart-gift-form {
    padding: ($spacing-unit * 6) 0;
    border-top: 1px solid $color-teal-700;
  }

  .cart-gift-form__checkbox-input {
    font-size: rem(13);
    line-height: rem(24);
  }
</style>
