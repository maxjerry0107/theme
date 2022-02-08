<template lang="pug">
  button.button.button--icon(
    type="button", 
    :class="buttonClass", 
    :disabled="isDisabled", 
    @click="$emit('click')"
  )
    icon(v-if="icon", :name="icon", :size="size")
    span.u-sr-only {{ label }}
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue';
  import VButton from 'scripts/components/buttons/VButton.vue';

  export default {
    name: 'IconButton',
    components: { Icon },
    extends: VButton,
    props: {
      size: String,
    },
  };
</script>

<style scoped lang="scss"></style>
