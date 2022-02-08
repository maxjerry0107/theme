<template lang="pug">
  label.radio-input(
    :class="classes"
  )
    input.radio-input__input(
      type="radio"
      :value="value"
      v-model="currentValue"
      :checked="checked"
      :disabled="disabled"
      :name="name"
      :id="id"
      :required="required"
    )
    span.radio-input__radio-input
    .radio-input__label-text(v-if="label") {{ label }}
    .radio-input__label-text(v-else)
      slot
</template>

<script>
  export default {
    name: 'RadioInput',
    model: {
      prop: 'modelValue',
      event: 'input',
    },
    props: {
      value: String,
      label: String,
      disabled: Boolean,
      name: String,
      id: String,
      checked: Boolean,
      required: Boolean,
    },
    data() {
      return {
        currentValue: this.checked ? this.value : '',
      };
    },
    computed: {
      classes() {
        return {
          'radio-input--selected': this.currentValue === this.value,
          'radio-input--disabled': this.disabled,
        };
      },
    },
    watch: {
      currentValue() {
        this.$emit('input', this.currentValue);
      },
    },
  };
</script>
