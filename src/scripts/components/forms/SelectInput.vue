<template lang="pug">
  .input.input--select(:class="{ 'input--disabled': disabled }")
    label(v-if="label", :for="'select' + _uid", :class="labelClass") {{ label }}
    v-select(
      ref="vSelect"
      v-if="!showNativeSelect"
      :options="optionSet"
      :disabled="disabled"
      :clearable="false"
      :value="selectedValue",
      :placeholder="this.disableDefault ? undefined : defaultOption",
      :searchable="false",
      :select-on-tab="true",
      @input="update"
      @blur="tabFocused = false"
    )
    select(v-else, v-model="currentValue", :disabled="$attrs.disabled", :id="'select' + _uid")
      option(v-for="option in options", :value="option.value", :key="option.value") {{ option.label }}
    icon.select-input-icon(:name="iconName", :size="iconSize")
</template>

<script>
  import vSelect from 'vue-select'

  import TextInput from 'scripts/components/forms/TextInput.vue'
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'SelectInput',
    extends: TextInput,
    components: { vSelect, Icon },
    props: {
      options: {
        type: Array,
        default: () => [],
      },
      label: {
        type: String,
      },
      selected: {
        type: [String, Number],
        default: '',
      },
      hideLabel: {
        type: Boolean,
        default: false,
      },
      // only shows when not required
      placeholder: {
        type: String,
        default: 'Select an Option',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      disableDefault: {
        type: Boolean,
      },
      iconSize: {
        type: String,
        default: '24px',
      },
      icon: String,
      value: [String, Number, Object],
    },
    computed: {
      defaultOption () {
        return (this.placeholder !== '') ? this.placeholder : '';
      },
      optionSet () {
        if (this.disableDefault === true) {
          return this.options
        } else {
          return this.$attrs.required
          ? this.options
          : [{ label: this.defaultOption, value: 'default' }, ...this.options]
        };
      },
      selectedValue () {
        return this.options.find(option => option.value === this.currentValue);
      },
      showNativeSelect () {
        return this.$mq === 'mobile';
      },
      labelClass () {
        return {
          'u-sr-only': this.hideLabel,
        };
      },
      iconName() {
        if (this.icon) {
          return this.icon;
        }
        return 'arrow-down';
      }
    },
    created () {
      if (this.$attrs.required && this.currentValue === '' && this.options.length > 0) {
        this.currentValue = this.value ? this.value : this.options[0].value
        this.$emit('input', this.currentValue)
      }

      if ( this.selected !== '' ) {
        let selected = { value: this.selected }
        this.update(selected)
      }
    },
    watch: {
      value() {
        this.currentValue = this.value;
      },
      currentValue () {
        this.$emit('input', this.currentValue)
      }
    },
    methods: {
      update(val) {
        this.currentValue = val.value
      },
      selectVueSelect (event) {
        this.$refs.vSelect.toggleDropdown(event);
      }
    }
  }
</script>

<style scoped lang="scss"></style>