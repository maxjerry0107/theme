<template lang="pug">
  .input.input--number
    label(v-if="label") {{ label }}
    input(type="number", :min="min", :max="max" :placeholder="placeholder", v-model="currentValue")
</template>

<script>
  import TextInput from 'scripts/components/forms/TextInput.vue';

  export default {
    name: 'NumberInput',
    extends: TextInput,
    props: {
      min: Number,
      max: Number,
    },
  };
</script>

<style scoped lang="scss"></style>
