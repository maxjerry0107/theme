<template lang="pug">
  .text-input(
    :class="classes"
  )
    label.text-input__label(
      :for="inputId"
      :class="{ 'u-sr-only': hideLabel }"
    ) {{ label }}
      .text-input__label-note(
        v-if="required"
      ) (required)
    textarea.text-input__input(
      v-if="isTextArea"
      :type="inputType"
      :id="inputId"
      :name="name"
      :disabled="disabled"
      :required="required"
      :placeholder="placeholder"
      v-model="currentValue"
      :pattern="pattern"
      @focusout="validate"
      :rows="rows"
    )
    input.text-input__input(
      v-else
      :type="inputType"
      :id="inputId"
      :name="name"
      :disabled="disabled"
      :required="required"
      :placeholder="placeholder"
      v-model="currentValue"
      :pattern="pattern"
      @focusout="validate"
    )
    .text-input__icon(
      :is="iconIsSubmitButton ? 'button-component' : 'div'"
      :role="iconIsSubmitButton ? 'button' : null"
      :title="iconIsSubmitButton ? 'Submit' : null"
      :class="iconIsSubmitButton ? 'button--icon-background button--primary' : null"
      :type="iconIsSubmitButton ? 'submit' : null"
      :width="width || size"
      :height="height || size"
      :style="`line-height: ${height || size};`"
    )
      icon(
        v-if="icon"
        :name="icon"
        :width="width || size"
        :height="height || size"
        :class="iconIsSubmitButton ? 'button__icon' : null"
      )
    .text-input__error-notice(
      v-if="valueIsErroneous"
    ) {{ errorText }}
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue';
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';

  export default {
    name: 'TextInput',
    components: {
      Icon,
      ButtonComponent,
    },
    props: {
      value: [String, Number],
      label: {
        type: String,
        required: true,
      },
      placeholder: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: 'text',
      },
      textarea: {
        type: Boolean,
        default: false,
      },
      id: String,
      name: String,
      disabled: Boolean,
      required: Boolean,
      rows: {
        type: Number,
        default: 4,
      },
      error: {
        type: Boolean,
        default: false,
      },
      errorText: {
        type: String,
        default: 'This field must be filled in.',
      },
      icon: String,
      width: String,
      height: String,
      size: String,
      pattern: String,
      hideLabel: Boolean,
      iconIsSubmitButton: Boolean,
    },
    data() {
      return {
        currentValue: this.value,
        valueIsErroneous: this.error,
      };
    },
    computed: {
      isTextArea() {
        return this.type === 'textarea';
      },
      classes() {
        return {
          'text-input--error': this.valueIsErroneous,
          'text-input--disabled': this.disabled,
          'text-input--hidden-label': this.hideLabel,
        };
      },
      inputType() {
        return this.isTextArea ? null : this.type;
      },
      inputId() {
        // eslint-disable-next-line no-underscore-dangle
        return this.id || `input_${this._uid}`;
      },
    },
    watch: {
      currentValue() {
        this.validate();
        this.$emit('input', this.currentValue);
      },
    },
    methods: {
      set(val) {
        this.currentValue = val;
      },
      validate() {
        let isValid = true;

        if (this.required) {
          isValid = !!this.currentValue;
        }

        if (this.currentValue && this.type === 'email') {
          const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

          isValid = this.currentValue.match(emailPattern) !== null;
        }

        if (this.currentValue && this.pattern) {
          let validationPattern = this.pattern;

          if (validationPattern[0] === '/') validationPattern = validationPattern.slice(1);
          if (validationPattern[validationPattern.length - 1] === '/') validationPattern = validationPattern.slice(0, -1);

          validationPattern = new RegExp(validationPattern);

          isValid = this.currentValue.match(validationPattern) !== null;
        }

        this.valueIsErroneous = !isValid;
      },
    },
  };
</script>

<style scoped lang="scss"></style>
