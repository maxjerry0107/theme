<template lang="pug">
  transition(name="slide-fade-left")
    li.cart-line-item(
      :class="updating ? 'cart-line-item--updating' : null"
    )
      img.cart-line-item__image(v-lazy="item.image", :alt="item.product_title")
      .cart-line-item__details
        a.cart-line-item__product-title(:href="itemUrl") {{ itemName }}
        .cart-line-item__product-sub-heading(
          v-if="subheading"
        ) {{ subheading }}
        .cart-line-item__subscription-message(
          v-if="subscriptionMessage"
        )
          icon(
            name="subscription"
            width="14px"
            height="11px"
          )
          span {{ subscriptionMessage }}
        .cart-line-item__variant-title {{ itemVariantTitle }}
        .cart-line-item__product-price.cart-line-item__product-price--compare-at(v-if="isDiscounted") {{ comparePrice | moneyWithoutDecimals }}
        .cart-line-item__product-price(
          :class="{ 'cart-line-item__product-price--discount': isDiscounted }"
        ) {{ item.line_price | moneyWithoutDecimals }}
        .cart-line-item__actions
          .cart-line-item__quantity
            quantity-input(
              label="Quantity"
              v-model="quantity"
            )
      button-component.button--icon.cart-line-item__remove(
        icon="close"
        iconSize="12px"
        @click="removeItem"
      )
        span.u-sr-only Remove

</template>

<script>
  import { mapState } from 'vuex';
  import { debounce } from 'scripts/helpers/util';

  import QuantityInput from 'scripts/components/forms/QuantityInput.vue';
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'CartLineItem',
    components: { QuantityInput, ButtonComponent, Icon },
    props: {
      item: Object,
      line: Number,
    },
    data() {
      return {
        quantity: this.item.quantity,
        updating: false,
      };
    },
    computed: {
      ...mapState({
        allProducts: (state) => state.products.all,
      }),
      product() {
        return this.allProducts.find((product) => {
          return Boolean(product.variants.find((variant) => this.item.id === variant.id));
        });
      },
      variant() {
        return this.product ? this.product.variants.find((variant) => variant.id === this.item.id) : null;
      },
      isSubscription() {
        return this.item.properties && this.item.properties.subscription_id;
      },
      itemName() {
        if (this.isSubscription && this.item.properties.base_product_title) {
          return this.item.properties.base_product_title;
        }

        return this.item.product_title;
      },
      itemVariantTitle() {
        return this.item.variant_title.replace('/', '|');
      },
      itemUrl() {
        if (this.isSubscription && this.item.properties.base_product_url) {
          return this.item.properties.base_product_url;
        }

        return this.item.url;
      },
      subscriptionMessage() {
        if (this.isSubscription && this.item.properties.shipping_interval_frequency) {
          const freq = this.item.properties.shipping_interval_frequency;
          const unit = this.item.properties.shipping_interval_unit_type;

          return `Ships Every ${freq} ${unit}`;
        }

        return null;
      },
      comparePrice() {
        // eslint-disable-next-line no-underscore-dangle
        const compareAtPrice = this.item.properties && this.item.properties.__compare_at_price ? this.item.properties.__compare_at_price : this.item.price;
        return this.variant ? parseInt(this.variant.compare_at_price, 10) * this.item.quantity : compareAtPrice * this.item.quantity;
      },
      isDiscounted() {
        return this.item.line_price !== this.comparePrice && !Number.isNaN(this.comparePrice);
      },
      subheading() {
        if (this.isSubscription && this.item.properties.base_product_subheading) {
          return this.item.properties.base_product_subheading;
        }

        if (this.product && this.product.customFields) {
          return this.product.customFields.subheading;
        }

        return null;
      },
    },
    watch: {
      quantity(newVal, oldVal) {
        if (newVal !== oldVal) {
          // fix eslint error !=
          this.updateItem();
        }
      },
    },
    methods: {
      updateItem: debounce(function updateItemDebounce() {
        if (this.quantity > 0) {
          this.$store.dispatch('cart/updateItem', { key: this.item.key, quantity: this.quantity });
        } else {
          this.removeItem();
        }
      }, 500),
      removeItem() {
        this.updating = true;

        this.$store
          .dispatch('cart/removeItem', this.item.key)
          .catch((error) => this.$store.dispatch('toast/send', { text: error, type: 'error' }))
          // eslint-disable-next-line no-return-assign
          .then(() => (this.updating = false));
      },
    },
  };
</script>

<style scoped lang="scss">
  .cart-line-item {
    display: flex;
    align-items: flex-start;
    position: relative;
    padding: 0 0 ($spacing-unit * 4) 0;
    border-bottom: 1px solid $color-white;
  }

  .cart-line-item--updating {
    opacity: 0.5;
    pointer-events: none;

    &.slide-fade-left-leave-active {
      opacity: 0;
    }
  }

  .cart-line-item__image {
    max-width: 96px;

    @include tablet-up {
      max-width: 128px;
    }
  }

  .cart-line-item__product-title {
    font-size: rem(16);
    line-height: rem(24);
    text-decoration: none;
    color: $color-black;
  }

  .cart-line-item__product-sub-heading {
    color: $color-grey-900;
    font-size: rem(9);
    line-height: rem(11);
    letter-spacing: rem(0.64);
    text-transform: uppercase;
  }

  .cart-line-item__subscription-message {
    padding: ($spacing-unit * 2) 0;
    color: $color--primary;
    font-size: rem(11);
    line-height: rem(14);

    .icon {
      margin-right: $spacing-unit;
      fill: $color--primary;
      vertical-align: middle;
    }
  }

  .cart-line-item__variant-title {
    margin-top: ($spacing-unit * 1.5);
    font-size: rem(16);
    line-height: rem(25);
    color: $color-blue-900;
  }

  .cart-line-item__details {
    flex-grow: 1;
    padding: 0 ($spacing-unit * 4);
  }

  .cart-line-item__actions {
    display: flex;
    align-items: center;
    margin-top: $spacing-unit * 3;

    .loading {
      width: 20px;
      height: 20px;
    }
  }

  .cart-line-item__quantity {
    display: inline-block;
    margin-right: $spacing-unit * 4;
  }

  .cart-line-item__remove {
    position: absolute;
    top: ($spacing-unit * 2);
    right: 0;
    font-size: rem(9);
    text-transform: uppercase;
  }

  .cart-line-item__product-price {
    display: inline-block;
    font-size: rem(16);
    line-height: rem(25);
    color: $color-blue-900;
  }

  .cart-line-item__product-price--discount {
    margin: 0 ($spacing-unit * 2);
    color: $color-mauve-900;
    text-decoration: none;
  }

  .cart-line-item__product-price--compare-at {
    text-decoration: line-through;
  }
</style>
