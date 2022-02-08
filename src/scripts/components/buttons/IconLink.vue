<template lang="pug">
  a.button.button--icon(
    :class="buttonClass",
    :disabled="isDisabled",
    :href="href",
    :title="label",
    :target="target"
  )
    icon(v-if="icon", :name="icon", :size="size")
    span.u-sr-only {{ label }}
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue';
  import IconButton from 'scripts/components/buttons/IconButton.vue';

  export default {
    name: 'IconLink',
    components: { Icon },
    extends: IconButton,
    props: {
      href: {
        type: String,
        default: '#',
      },
      external: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      target() {
        return this.external ? '_blank' : '_self';
      },
    },
  };
</script>

<style scoped lang="scss">
  .button--icon {
    &[disabled] {
      pointer-events: none;
    }
  }
</style>
