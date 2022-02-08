<template lang="pug">
  fieldset.option-select.option-select--buttons(
    :class="labelClass"
  )
    legend.option-select__legend(v-if="label")
      span.option-select__legend--title(
        :title="label"
      ) {{ value }}
      a.option-select__legend--size-guide-link(v-if="currentVariant && !!modalRef && label === 'Size'" href="#" title="Open Size Guide" @click="modalRef.open()") Size Guide
    
    label.option-select__label(
      v-for="buttonOption in buttonOptions"
      tabindex="0"
      :class="{'option-select--is-selected': buttonOption.value === value, 'product-option__swatch-wrapper button--round' : useSwatches, 'option-select__disabled' : !buttonOption.isAvailable, 'option-select__out-of-stock': !buttonOption.isInStock}"
    )
      span.button--round.product-option__swatch(
        v-if="useSwatches"
        :style="buttonOption.style"
        :key="buttonOption.color"
        :class="{'product-option__swatch--selected': buttonOption.color === currentValue, 'product-option__swatch--disabled' : !buttonOption.isAvailable, 'product-option__swatch--out-of-stock': !buttonOption.isInStock}"
        aria-hidden="true"
      )
      span(
        :class="{'u-sr-only': useSwatches}"
        :aria-label="buttonOption.label"
      ) {{ buttonOption.label }}
      input.u-sr-only(
        type="radio"
        tabindex="-1"
        v-model="currentValue"
        :id="buttonOption.label"
        :value="buttonOption.value"
        :name="option"
        @change.prevent="onChange(buttonOption.value)"
      )
</template>

<script>
  import { getSwatchSrc } from 'scripts/helpers/images.js';
  import { handleize } from 'scripts/filters/string.js';

  export default {
    name: 'OptionSelectButtons',
    props: {
      product: Object,
      currentVariant: Object,
      label: String,
      value: String,
      option: {
        type: String,
        default: 'option1',
        validator(val) {
          return ['option1', 'option2', 'option3'].includes(val);
        },
      },
      optionIndex: Number,
      selectedOptions: Array,
      useSwatches: {
        type: Boolean,
        default: false,
      },
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
      swatches() {
        return this.variantOptions.map((color) => {
          const swatchSrc = getSwatchSrc(handleize(color), '24x');
          const foundVariant = this.findVariant(this.optionIndex, color);
          const isInStock = foundVariant ? this.isVariantInStock(foundVariant) : false;
          return {
            label: color,
            value: color,
            isAvailable: Boolean(foundVariant),
            isInStock,
            color,
            style: `background-image: url(${swatchSrc});`,
          };
        });
      },
      buttonOptions() {
        const { useSwatches, swatches, optionSet } = this;
        return useSwatches ? swatches : optionSet;
      },
      labelClass() {
        return this.label ? `option-select--${this.label.toLowerCase()}` : '';
      },
    },
    mounted() {
      const initialValue = this.value && this.value !== '' ? this.value : this.optionSet[0].value;
      this.$emit('input', initialValue);
    },
    methods: {
      onChange(value) {
        this.$emit('input', value);
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
