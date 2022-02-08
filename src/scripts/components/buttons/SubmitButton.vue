<template lang="pug">
  button.button(
    type="submit",
    :class="buttonClass",
    :disabled="isDisabled",
    @click="$emit('click')"
  )
    icon(v-if="icon", :name="icon", :size="iconSize")
    span {{ label }}
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue';
  import VButton from 'scripts/components/buttons/VButton.vue';

  export default {
    name: 'SubmitButton',
    components: { Icon },
    extends: VButton,
  };
</script>

<style scoped lang="scss"></style>
