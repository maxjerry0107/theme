<template lang="pug">
  button.button.button--icon(
    type="submit", 
    :class="buttonClass", 
    :disabled="isDisabled", 
    @click="$emit('click')"
  )
    icon(v-if="icon", :name="icon", :size="size")
    span.u-sr-only {{ label }}
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue';
  import IconButton from 'scripts/components/buttons/IconButton.vue';

  export default {
    name: 'IconSubmitButton',
    components: { Icon },
    extends: IconButton,
  };
</script>

<style scoped lang="scss"></style>
