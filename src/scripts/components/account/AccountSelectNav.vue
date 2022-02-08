<template lang="pug">
  select-input(name="account-nav" required v-model="currentValue" :selected="selected" :options="options")
</template>

<script>
  import SelectInput from 'scripts/components/forms/SelectInput.vue';

  export default {
    name: 'AccountSelectNav',
    components: { SelectInput },
    props: {
      options: Array,
      selected: String,
    },
    data() {
      return {
        currentValue: String,
      };
    },
    watch: {
      currentValue() {
        if (this.currentValue !== this.selected) {
          window.location = this.currentValue;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .input::v-deep .icon {
    top: 32px;
  }
</style>
