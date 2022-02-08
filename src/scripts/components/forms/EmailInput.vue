<template lang="pug">
  .input.input--email
    label(v-if="label") {{ label }}
    input(type="email", :placeholder="placeholder", v-model="currentValue")
</template>

<script>
  import TextInput from 'scripts/components/forms/TextInput.vue';

  export default {
    name: 'NumberInput',
    extends: TextInput,
  };
</script>

<style scoped lang="scss"></style>
