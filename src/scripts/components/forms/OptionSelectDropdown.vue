<template lang="pug">
  .option-select.option-select--dropdown
    a.option-select__size-guide-link(v-if="currentVariant && !!modalRef && label === 'Size'" href="#" title="Open Size Guide" @click="modalRef.open()") Size Guide
    select-input(
      ref="select",
      v-model="currentValue",
      :selected="currentValue",
      :label="label",
      :options="optionSet",
      required
      :class="{'option-select__disabled' : !currentVariant, 'option-select__out-of-stock': !currentVariant || !isVariantInStock(currentVariant)}"
    )
</template>

<script>
  import SelectInput from 'scripts/components/forms/SelectInput.vue';

  export default {
    name: 'OptionSelectDropdown',
    components: { SelectInput },
    props: {
      value: String,
      product: Object,
      currentVariant: Object,
      label: String,
      option: {
        type: String,
        default: 'option1',
        validator(val) {
          return ['option1', 'option2', 'option3'].includes(val);
        },
      },
      optionIndex: Number,
      selectedOptions: Array,
      modalRef: Object,
    },
    data() {
      return {
        currentValue: this.value,
      };
    },
    computed: {
      variantsByValue() {
        const keys = this.variantOptions;
        const reorganizedVariants = {};
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < keys.length; index++) {
          const optionValue = keys[index];
          reorganizedVariants[optionValue] = this.product.variants.reduce((acc, variant) => {
            if (variant[this.option] === optionValue) {
              acc.push(variant);
            }
            return acc;
          }, []);
        }
        return reorganizedVariants;
      },
      variantOptions() {
        return [...new Set(this.product.variants.map((variant) => variant[this.option]))];
      },
      optionSet() {
        return this.variantOptions.map((option) => {
          const foundVariant = this.findVariant(this.optionIndex, option);
          const isInStock = foundVariant ? this.isVariantInStock(foundVariant) : false;
          return {
            label: option,
            value: option,
            isAvailable: Boolean(foundVariant),
            isInStock,
          };
        });
      },
    },
    watch: {
      currentValue() {
        this.$emit('input', this.currentValue);
      },
    },
    mounted() {
      const { value, optionSet } = this;
      const initialValue = value && value !== '' ? value : optionSet[0].value;
      this.$emit('input', initialValue);
    },
    methods: {
      update(newValue) {
        this.$refs.select.update(String(newValue));
      },
      findVariant(optionIndex, value) {
        const { normalizeFalsy, variantsByValue, selectedOptions } = this;
        const requiredVariants = variantsByValue[value];
        return requiredVariants.find((variant) => {
          const variantOptions = [normalizeFalsy(variant.option1), normalizeFalsy(variant.option2), normalizeFalsy(variant.option3)];
          const optionsArray = [...selectedOptions];
          optionsArray[optionIndex] = value;
          return JSON.stringify(variantOptions) === JSON.stringify(optionsArray);
        });
      },
      isVariantInStock(variant) {
        if (variant.inventory_management === '' || variant.inventory_policy === 'continue') {
          return true;
        }
        return variant.remaining_quantity > 0;
      },
      normalizeFalsy(optionValue) {
        return optionValue || '';
      },
    },
  };
</script>
