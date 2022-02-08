<template lang="pug">
  a.button(:href="href", :class="buttonClass", :disabled="isDisabled")
    icon(v-if="icon", :name="icon", :size="iconSize")
    span {{ label }}
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue';
  import VButton from 'scripts/components/buttons/VButton.vue';

  export default {
    name: 'LinkButton',
    components: { Icon },
    extends: VButton,
    props: {
      href: {
        type: String,
        default: '#',
      },
    },
  };
</script>

<style scoped lang="scss"></style>
