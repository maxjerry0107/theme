<template lang="pug">
  component(
    :is="htmlTag"
    :class="buttonClass",
    :disabled="isDisabled",
    @click.stop="$emit('click')"
  )
    icon(v-if="icon", :name="icon", :size="iconSize")
    span.button__content(v-else)
      slot {{ label }}
      icon(v-if="arrow", name="arrow-right-long", :size="iconSize")
      icon(v-else-if="arrowUp", name="arrow-up", :size="iconSize")
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'VButton',
    components: { Icon },
    props: {
      label: String,
      htmlTag: {
        type: String,
        default: 'button',
      },
      icon: String,
      iconSize: {
        type: String,
        default() {
          return this.small ? '12px' : '16px';
        },
      },
      primary: {
        type: Boolean,
        default: false,
      },
      secondary: {
        type: Boolean,
        default: false,
      },
      small: {
        type: Boolean,
        default: false,
      },
      full: {
        type: Boolean,
        default: false,
      },
      arrow: {
        type: Boolean,
        default: false,
      },
      arrowUp: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      buttonClass() {
        return {
          'button button--primary': this.primary === true,
          'button button--secondary': this.secondary === true,
          'button--small': this.small === true,
          'button--full-width': this.full === true,
          'button--arrow': this.arrow === true,
          'button button--arrow-up': this.arrowUp === true,
          'button--loading': this.loading === true,
        };
      },
      isDisabled() {
        return this.disabled || this.loading;
      },
    },
  };
</script>

<style scoped lang="scss"></style>
