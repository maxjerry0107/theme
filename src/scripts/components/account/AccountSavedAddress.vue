<template lang="pug">
  .address-saved
    .address-info(v-if="!active")
      slot(name="info")
    .address-form(v-else)
      slot(name="form")
</template>

<script>
  export default {
    name: 'AccountSavedAddress',
    props: { 
      id: String 
    },
    data() {
      return {
        active: false
      }
    },
    watch: {
      active() {
        if(this.active) {
          // wait for component to completely render
          this.$nextTick(() => {
            let provinceSelector = new Shopify.CountryProvinceSelector(`AddressCountry_${this.id}`, `AddressProvince_${this.id}`, { hideElement: `AddressProvinceWrapper_${this.id}` });
          });
        }
      }
    },
    methods: {
      showForm() {
        this.active = true;
      },
      hideForm() {
        this.active = false;
      },
      destroyAddress() {
        Shopify.CustomerAddress.destroy(this.id, 'Are you sure you wish to delete this address?'); 
      }
    }
  }
</script>

<style lang="scss" scoped>
  // see account-addresses.scss for styling
</style>