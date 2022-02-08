<template lang="pug">
  form.product-form(@submit.prevent="addToCart", novalidate)
    .product-form__variant-select-wrapper
      select-input.collection-grid__sort(:options="variantOptions", v-model="currentSelectedVariantID", :required="true", label="Variant")
    .product-form__atc
      quantity-input.product-form__quantity(
        label="Quantity", 
        v-model="quantity",
        :min="1", 
        :max="remainingQuantity"
      )
      submit-button(
        :label="buttonLabel", 
        :disabled="isDisabled",
        :loading="adding"
      )
</template>

<script>
  import QuantityInput from 'scripts/components/forms/QuantityInput.vue';
  import SelectInput from 'scripts/components/forms/SelectInput.vue';
  import SubmitButton from 'scripts/components/buttons/SubmitButton.vue';
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'ProductFormStandardVariants',
    components: { QuantityInput, SelectInput, SubmitButton, Icon },
    props: {
      product: Object,
    },
    data() {
      return {
        quantity: 1,
        adding: false,
        currentSelectedVariantID: this.product.variants[0].id,
      };
    },
    computed: {
      remainingQuantity() {
        if (this.product.type === 'Gift Card') {
          return 100;
        }
        return this.product.variants.find((variant) => variant.id === this.currentSelectedVariantID).remaining_quantity;
      },
      isDisabled() {
        return this.adding || this.remainingQuantity === 0;
      },
      buttonLabel() {
        return this.remainingQuantity > 0 ? 'Add to Cart' : 'Sold Out';
      },
      variantOptions() {
        const variantOptions = [];
        this.product.variants.forEach((variant) => {
          variantOptions.push({ label: variant.title, value: variant.id });
        });
        return variantOptions;
      },
    },
    methods: {
      addToCart() {
        this.adding = true;

        this.$store
          .dispatch('cart/addItem', { id: this.currentSelectedVariantID, quantity: this.quantity })
          .then(() => this.$store.dispatch('cart/openSidecart'))
          .catch((error) => this.$store.dispatch('toast/send', { text: error, type: 'error' }))
          .then(() => {
            this.adding = false;
          });
      },
    },
  };
</script>

<style scoped lang="scss"></style>
