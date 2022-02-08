<template lang="pug">
  .address-add
    button.address-add__button.button.button--secondary(@click="show", v-show="!active") + Add New Address
    .address-form(v-show="active")
      slot
</template>

<script>
  export default {
    name: 'AccountNewAddress',
    data() {
      return {
        active: false,
        provinceSelector: null,
      };
    },
    mounted() {
      this.provinceSelector = new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', { hideElement: 'AddressProvinceWrapperNew' });
    },
    methods: {
      show() {
        this.active = true;
      },
      hide() {
        this.active = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  // see account-addresses.scss for styling
</style>
