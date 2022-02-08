<template lang="pug">
.product-form--wrapper
  form.product-form(@submit.prevent="addToCart", novalidate)
    .product-form__options
      option-select-buttons.product-form__options__option2(
        v-if="hasComplexVariants && isColorOption(1)"
        :label="product.options[1]"
        :product="product"
        option="option2"
        :optionIndex="1"
        :selectedOptions="selectedOptions"
        :currentVariant="currentVariant"
        v-model="selectedOptions[1]"
        useSwatches=true
      )
      .product-form__options__option1(
        v-if="hasVariants"
        :is="disabledSelect1"
        :label="product.options[0]"
        :product="product"
        option="option1"
        :optionIndex="0"
        :selectedOptions="selectedOptions"
        :currentVariant="currentVariant"
        :value="selectedOptions[0]"
        v-model="selectedOptions[0]"
        :modalRef="product.options[0] === 'Size' && modalRef ? modalRef : null"
      )
      .product-form__options__option2(
        v-if="hasComplexVariants && !isColorOption(1)"
        :is="disabledSelect2"
        :label="product.options[1]"
        :product="product"
        option="option2"
        :optionIndex="1"
        :selectedOptions="selectedOptions"
        :currentVariant="currentVariant"
        :value="selectedOptions[1]"
        v-model="selectedOptions[1]"
        :modalRef="product.options[1] === 'Size' && modalRef ? modalRef : null"
      )
      .product-form__options__option3(
        v-if="hasComplexVariants && selectedOptions[2] !== ''"
        :is="disabledSelect3"
        :label="product.options[2]"
        :product="product"
        option="option3"
        :optionIndex="2"
        :selectedOptions="selectedOptions"
        :currentVariant="currentVariant"
        :value="selectedOptions[2]"
        v-model="selectedOptions[2]"
        :modalRef="product.options[2] === 'Size' && modalRef ? modalRef : null"
      )
    .product-form__atc(
      v-if="!showNotifyMe"
    )
      quantity-input.quantity-input--product-form.product-form__quantity(
        label="Quantity"
        v-model="quantity"
        :min="1"
        :max="remainingQuantity"
        icon-size="11px"
      )
      button-component.button--primary.button--primary-arrow.product-form__submit(
        :disabled="isDisabled"
        :loading="adding"
        type="submit"
      )
        span {{ buttonLabel }}
        icon(
          name="long-arrow-right"
          size="18px"
          class="button__icon"
        )
  bis-form(
    v-if="currentVariant && currentVariant.id && showNotifyMe"
    :notifyMeEnabled=enableNotifiyMe
    :showNotifyMe="showNotifyMe"
    :notifiyMeHeading="notifiyMeHeading"
    :notifiyMeText="notifiyMeText"
    :customerEmail="customerEmail"
    :productId="product.id"
    :variantId="currentVariant.id"
  )
  .product-form__atc(
      v-if="!(currentVariant && currentVariant.id) && !showNotifyMe"
    )
      .product-form__final-sale {{ 'We\'re sorry. This size and color combination is not available. Please choose another fabulous style.' }}
  .product-form__atc(
    v-if="isFinalSale"
  )
    .product-form__final-sale(
      v-html="finalSaleText"
    )
</template>

<script>
  /* eslint no-underscore-dangle: ["error", { "allow": ["_learnq"] }] */
  import { getProductUrl } from 'scripts/helpers/product.js';
  import { URLToObject } from 'scripts/helpers/util.js';
  import Icon from 'scripts/components/basic/Icon.vue';
  import RadioInput from 'scripts/components/forms/RadioInput.vue';
  import QuantityInput from 'scripts/components/forms/QuantityInput.vue';
  import SelectInput from 'scripts/components/forms/SelectInput.vue';
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';

  export default {
    name: 'ProductForm',
    components: {
      Icon,
      RadioInput,
      QuantityInput,
      OptionSelectDropdown: () => import('scripts/components/forms/OptionSelectDropdown.vue'),
      OptionSelectButtons: () => import('scripts/components/forms/OptionSelectButtons.vue'),
      SelectInput,
      ButtonComponent,
      BisForm: () => import('scripts/components/forms/BisForm.vue'),
    },
    props: {
      product: Object,
      startingVariant: Object,
      collection: Object,
      finalSaleText: String,
      enableNotifiyMe: {
        type: Boolean,
        default: true,
      },
      notifiyMeHeading: String,
      notifiyMeText: String,
      customerEmail: String,
      modalRef: Object,
    },
    data() {
      return {
        quantity: 1,
        adding: false,
        selectedOptions: this.startingVariant ? [this.startingVariant.option1, this.startingVariant.option2, this.startingVariant.option3] : [this.product.variants[0].option1, this.product.variants[0].option2, this.product.variants[0].option3],
        currentVariant: this.startingVariant || this.product.variants[0],
      };
    },
    computed: {
      isDisabled() {
        return this.adding || !this.currentVariantIsAvailable;
      },
      buttonLabel() {
        // eslint-disable-next-line no-nested-ternary
        return !this.currentVariant ? 'Unavailable' : this.currentVariantIsAvailable ? 'Add to Cart' : 'Sold Out';
      },
      // variant data
      hasVariants() {
        return this.product ? this.product.variants.length > 0 : false;
      },
      hasComplexVariants() {
        return this.product ? this.product.options.length > 1 : false;
      },
      currentVariantIsAvailable() {
        const { remainingQuantity } = this;
        if (this.currentVariant && (this.currentVariant.inventory_management === '' || this.currentVariant.inventory_policy === 'continue')) {
          return true;
        }
        return !Number.isNaN(remainingQuantity) && remainingQuantity > 0;
      },
      showNotifyMe() {
        const { currentVariant, currentVariantIsAvailable } = this;
        return currentVariant && !currentVariantIsAvailable;
      },
      hasDisableDropdown() {
        return this.product.tags.some((tag) => tag.toLowerCase().includes('select-drop-disabled'));
      },
      disabledSelect1() {
        const { option1Size, $mq, hasDisableDropdown } = this;
        if (hasDisableDropdown || $mq !== 'mobile') {
          return 'option-select-buttons';
        }
        if (option1Size > 10 && $mq === 'mobile') {
          return 'option-select-dropdown';
        }
        return 'option-select-buttons';
      },
      disabledSelect2() {
        const { option1Size, $mq, hasDisableDropdown } = this;
        if (hasDisableDropdown || $mq !== 'mobile') {
          return 'option-select-buttons';
        }
        if (option1Size > 10 && $mq === 'mobile') {
          return 'option-select-dropdown';
        }
        return 'option-select-buttons';
      },
      disabledSelect3() {
        const { option1Size, $mq, hasDisableDropdown } = this;
        if (hasDisableDropdown || $mq !== 'mobile') {
          return 'option-select-buttons';
        }
        if (option1Size > 10 && $mq === 'mobile') {
          return 'option-select-dropdown';
        }
        return 'option-select-buttons';
      },
      isFinalSale() {
        return this.product.tags.some((tag) => tag.includes('final_sale')) || this.product.title.startsWith('Sale:');
      },
      remainingQuantity() {
        return this.currentVariant ? this.currentVariant.remaining_quantity : 0;
      },
      currentPrice() {
        return this.currentVariant.price;
      },
      currentCollection() {
        return this.collection ? this.collection : '';
      },
      option1Size() {
        return this.allOptionValues('option1').length;
      },
      option2Size() {
        return this.allOptionValues('option2').length;
      },
      option3Size() {
        return this.allOptionValues('option3').length;
      },
    },
    watch: {
      currentVariant(newValue, oldValue) {
        if ((!!newValue && !oldValue) || (newValue && newValue.id !== oldValue.id)) {
          this.$emit('currentVariantUpdated', newValue);
          window.history.replaceState({ variant: newValue.id }, document.title, getProductUrl(this.currentCollection, this.product, newValue));
        }
      },
      selectedOptions() {
        this.$emit('selectedOptionsUpdated', this.selectedOptions);
        this.currentVariant = this.getCurrentVariant();
      },
    },
    created() {
      const { startingVariant } = this;
      this.selectedOptions = [startingVariant.option1, startingVariant.option2, startingVariant.option3];
    },
    methods: {
      isColorOption(optionIndex) {
        const { product } = this;
        return /color|pattern|design/i.test(product.options[optionIndex]);
      },
      publishToKlaviyo(product) {
        const item = {
          Name: product.title,
          ProductID: product.id,
          Categories: product.collections,
          ImageURL: `https:${product.images[0]}`,
          URL: product.url,
          Brand: product.vendor,
          Price: product.price,
          CompareAtPrice: product.compare_at_price,
        };

        // klaviyo
        if (window._learnq) {
          window._learnq.push(['track', 'Added to Cart', item]);
        }
      },
      handleSubscriptionOptionChange({ purchaseType, frequency }) {
        this.selectedPurchaseType = purchaseType;
        this.selectedFrequency = frequency;
      },
      addToCart() {
        const { currentVariant, product, quantity, $store, publishToKlaviyo } = this;
        if (currentVariant) {
          // eslint-disable-next-line camelcase
          const { id, compare_at_price, price } = currentVariant;
          const addProduct = {
            id,
            quantity,
          };

          // eslint-disable-next-line camelcase
          if (price < compare_at_price) {
            addProduct.properties = {
              __compare_at_price: compare_at_price,
            };
          }

          this.adding = true;

          publishToKlaviyo(product);

          $store
            .dispatch('cart/addItem', addProduct)
            .then(() => $store.dispatch('cart/openSidecart'))
            .catch((error) => $store.dispatch('toast/send', { text: error, type: 'error' }))
            .then(() => {
              this.adding = false;
            });
        }
      },
      allOptionValues(optionName) {
        return [...new Set(this.product.variants.map((variant) => variant[optionName]))];
      },
      getVariantIdFromUrl() {
        const urlObject = URLToObject(window.location.href);
        return urlObject.params.variant;
      },
      getCurrentVariant() {
        const newVariant = this.product.variants.find((variant) => {
          return variant.option1 === this.selectedOptions[0] && variant.option2 === this.selectedOptions[1] && variant.option3 === this.selectedOptions[2];
        });
        return newVariant;
      },
    },
  };
</script>
<style lang="scss">
  .product-form__submit > .button__content {
    display: inline-flex;
    justify-content: space-between;
    width: 100%;
  }
</style>
<style scoped lang="scss">
  .product-form--wrapper {
    padding-top: $spacing-unit * 2;
    padding-bottom: $spacing-unit * 2;

    @include desktop-up {
      padding-top: $spacing-unit * 3;
      padding-bottom: $spacing-unit;
    }
  }
  .product-form__options {
    display: flex;
    flex-wrap: wrap;
    column-gap: ($spacing-unit * 3);
    flex-direction: column;
  }
  .product-form__atc {
    display: flex;
    justify-content: space-between;
    column-gap: ($spacing-unit * 4);

    @include desktop-up {
      padding-top: $spacing-unit * 2;
      column-gap: ($spacing-unit * 6);
    }
  }

  .product-form__final-sale {
    padding-top: $spacing-unit * 5;
    font-size: $font-size-body;
    color: $color-black;

    @include tablet-up {
      padding-top: $spacing-unit * 4;
      font-size: $font-size-body-xs;
    }

    .notify-me-form + & {
      padding-top: 0;
    }
  }

  .product-form__submit {
    width: 100%;
    margin-bottom: 0;
  }

  .product-form__quantity {
    margin: 0;
    width: 99px;

    @include tablet-up {
      width: 112px;
    }
  }

  .product-form__savings {
    margin: $spacing-unit * 2 0;
    font-size: rem(12);
    line-height: 1.4;

    @include mobile-only {
      text-align: center;
    }
  }
</style>
