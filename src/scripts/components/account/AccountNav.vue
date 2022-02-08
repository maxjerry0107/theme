<template lang="pug">
  section.account-nav
    h1.account-nav__name Hello, {{ customerName }}
    p.account-nav__email {{ customerEmail }}
    a.account-nav__logout(
      v-if="['mobile', 'tablet'].includes($mq)"
      href="/account/logout"
    ) Logout
    select-input.account-nav__select(
      v-if="['mobile', 'tablet'].includes($mq) && !hideNav"
      v-model="selected"
      :selected="selected"
      :options="options"
      :required="true"
    )
    ul.account-nav__list.u-list-simple(v-else-if="!hideNav")
      li.account-nav__list-item(v-for="option in options", :class="{ 'item-active': isActive(option.value) }")
        a.account-nav__list-item-link(:href="option.value") {{ option.label }}
</template>

<script>
  import SelectInput from 'scripts/components/forms/SelectInput.vue';
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'AccountNav',
    components: {
      SelectInput,
      Icon,
    },
    props: {
      options: Array,
      customerName: String,
      customerEmail: String,
    },
    data() {
      return {
        selected: window.location.pathname,
      };
    },
    computed: {
      hideNav() {
        // hide entire nav on mobile if on order details page
        return ['mobile', 'tablet'].includes(this.$mq) && this.selected.includes('orders');
      },
    },
    watch: {
      selected() {
        if (this.selected !== '' && this.selected !== undefined) {
          window.location.href = this.selected;
        }
      },
    },
    methods: {
      isActive(val) {
        // make sure 'Order History' is highlighted if user is on order details page (desktop)
        return val === this.selected || (this.selected.includes('orders') && val === '/account');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .account-nav {
    position: relative;
    margin-bottom: $spacing-unit * 4;

    @include desktop-up {
      margin-right: $spacing-unit * 33;
      margin-bottom: 0;
      min-height: $spacing-unit * 112;
    }
  }

  .account-nav__name {
    margin-top: 0;
    margin-bottom: $spacing-unit;
    font-size: rem(22);
    font-family: $font-headings;
    font-weight: 400;
    line-height: rem(38);

    @include desktop-up {
      margin-bottom: $spacing-unit;
      font-size: rem(26);
      line-height: rem(32);
    }
  }

  .account-nav__email {
    margin: 0 0 $spacing-unit * 4 0;
    color: $color-grey-900;
    font-size: rem(14);
    line-height: rem(22);
    letter-spacing: 0.03em;

    @include desktop-up {
      margin-bottom: $spacing-unit;
      font-size: rem(16);
      line-height: rem(24);
      letter-spacing: 0.02em;
    }
  }

  .account-nav__logout {
    position: absolute;
    top: ($spacing-unit * -9);
    right: 0;
    color: $color-black;

    @include desktop-up {
      top: unset;
      right: unset;
      bottom: 0;
      left: 0;
    }
  }

  .account-nav__select {
    margin-top: $spacing-unit * 4;
    margin-bottom: $spacing-unit * 5;
    max-width: unset;
  }

  .account-nav__list {
    margin-top: $spacing-unit * 10;
  }

  .account-nav__list-item {
    margin-bottom: $spacing-unit * 5;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .account-nav__list-item-link {
    padding: 0 0 $spacing-unit;
    color: $color-black;
    font-size: rem(16);
    line-height: rem(24);
    letter-spacing: 0.11em;
    text-decoration: none;
    text-transform: uppercase;

    .item-active & {
      border-bottom: 2px solid $color--primary;
    }
  }

  .account-nav__list-item-link::after {
    display: none;

    .item-active & {
      display: block;
      border-color: $color--primary;
    }
  }

  .account-nav__list-item-link:hover::after {
    display: block;
  }
</style>
