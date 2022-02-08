<template>
  <div class="input input--quantity" :class="{ 'input--quantity-small': small }">
    <VButton
      v-if="!$attrs.readonly"
      class="input__quantity-btn input__quantity-btn--decrement"
      label="Decrement Quantity"
      :hide-label="true"
      @click.prevent="(quantity - step < 0) ? 0: quantity-= step"
    >
      <Icon :name="iconDecrement" size="24px" :fill-class="fillClass" />
    </VButton>
    <label :class="labelClass" :for="`quantity-input__${_uid}`">{{
      label
    }}</label>
    <input
      :id="`quantity-input__${_uid}`"
      name="quantity"
      type="number"
      style="pointer-events: none;"
      :min="min"
      :max="max"
      v-model="quantity"
      :readonly="$attrs.readonly"
    />
    <VButton
      v-if="!$attrs.readonly"
      class="input__quantity-btn input__quantity-btn--increment"
      label="Increment Quantity"
      :hide-label="true"
      @click.prevent="quantity+= step"
      :disabled="disableIncrement"
    >
      <Icon :name="iconIncrement" size="24px" :fill-class="fillClass" />
    </VButton>
  </div>
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue';
  import VButton from 'scripts/components/buttons/VButton.vue';

  export default {
    name: 'QuantityInput',
    components: { Icon, VButton },
    props: {
      min: [Number, String],
      max: [Number, String],
      value: [Number, String],
      step: [Number, String],
      label: String,
      hideLabel: {
        type: Boolean,
        default: true,
      },
      iconDecrement: {
        type: String,
        default: 'minus',
      },
      iconIncrement: {
        type: String,
        default: 'plus',
      },
      fillClass: String,
      disableIncrement: {
        type: Boolean,
        default: false,
      },
      small: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        quantity: (this.value * this.step) || 1,
      };
    },
    computed: {
      labelClass() {
        return {
          'u-sr-only': this.hideLabel,
        };
      },
    },
    watch: {
      value(value) {
        this.quantity = value;
      },
      quantity(value) {
        if (this.min && value < this.min) this.quantity = this.min;
        if (this.max && value > this.max) this.quantity = this.max;
        this.$emit('input', this.quantity);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .input--quantity {
    position: relative;
    flex-shrink: 0;
    min-width: 0;
    width: 96px;
    display: inline-flex;
    margin: 0 1rem 24px 0;

    input {
      text-align: center;
      border: solid 1px $color-blue-900;
      border-radius: 4px;
      width: 100%;
      min-width: 0;
      padding: px-to-rem(16.5px) 0;
      font-size: px-to-rem(24px);
      line-height: px-to-rem(14px);
      font-weight: 400;
      background: $color-grey-900;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        display: none;
      }
    }
  }

  .input--quantity-small {
    input {
      padding: px-to-rem(9px) 0;
    }
  }

  .input__quantity-btn {
    position: absolute;
    width: 32px;
    height: 100%;
    top: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    background-color: transparent;
    cursor: pointer;
  }

  .input__quantity-btn--decrement {
    left: 6px;
  }

  .input__quantity-btn--increment {
    right: 6px;
  }
</style>
