<template lang="pug">
  label.checkbox-input
    input.checkbox-input__input(
      type="checkbox",
      :value="label",
      v-model="isChecked"
      :disabled="disabled",
      :name="name",
      :id="inputId"
    )
    span.checkbox-input__checkbox
      icon.checkbox-input__check(
        name="check"
        size="12px"
      )
    .checkbox-input__label-text(v-if="label") {{ label }}
    .checkbox-input__label-text(v-else)
      slot
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'CheckboxInput',
    components: {
      Icon,
    },
    props: {
      label: String,
      disabled: {
        type: Boolean,
        default: false,
      },
      name: String,
      id: String,
      checked: Boolean,
    },
    data() {
      return {
        isChecked: this.checked,
      };
    },
    computed: {
      inputId() {
        return this.id || `checkbox_${this._uid}`;
      },
    },
    watch: {
      isChecked() {
        this.$emit('input', this.isChecked);
      },
    },
  };
</script>
