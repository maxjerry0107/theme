<template lang="pug">
  .site-header__wrapper
    .site-header__desktop-utility(v-if="isDesktopUp")
      slot(name='desktop-utility')
    .site-header
      .site-header__logo
        slot(name='logo')
      .site-header__navigation(v-if="$mq !== 'mobile' && $mq !== 'tablet'")
        slot(name='primary-navigation')
      .site-header__utility-nav
        slot(name='utility-nav')
    .site-header__mobile-utility(v-if="$mq === 'mobile' || $mq === 'tablet'")
      slot(name='mobile-utility')
</template>

<script>
  export default {
    name: 'SiteHeader',
    data() {
      return {
        mobileNavClass: '',
      };
    },
    computed: {
      isDesktopUp() {
        return ['desktop', 'hd', 'max'].includes(this.$mq);
      },
    },
    created() {
      this.$root.$on('mobile-menu-change', this.toggleMobileNavClass);
    },
    methods: {
      toggleMobileNavClass(mobileMenuState) {
        this.mobileNavClass = mobileMenuState === 'progress' ? 'site-header__mobile-nav--progressed' : '';
      },
    },
  };
</script>

<style lang="scss">
  .site-header-wrapper {
    @include desktop-up {
      box-shadow: 0px 4px 10px rgba(224, 224, 224, 0.4);
    }
  }
  .site-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin: 0 auto;
    padding: 0 ($spacing-unit * 4);
    height: $mobile-nav-height;
    max-width: $container-max-width;
    background-color: $color-white;

    @include desktop-up {
      display: grid;
      grid-template-columns: 2fr 5fr 5fr;
      padding: 0 ($spacing-unit * 12.5) 0 ($spacing-unit * 7);
      height: $desktop-nav-height;
    }
  }

  .site-header__mobile-nav {
    display: flex;
    align-items: center;
    flex-basis: 30%;
    z-index: index($mobile-site-header, 'mobile-navigation');
  }

  .site-header__mobile-nav--progressed {
    z-index: index($mobile-site-header, 'mobile-navigation-2');
  }

  .site-header__logo {
    z-index: index($mobile-site-header, 'logo');

    @include desktop-up {
      position: relative;
      flex-shrink: 0;
    }
  }

  .site-header__navigation {
    flex-grow: 0.6;
    flex-shrink: 1;
  }

  .site-header__utility-nav {
    display: flex;
    align-items: center;
    flex-basis: 30%;
    text-align: right;

    @include desktop-up {
      flex: 1 0 auto;
    }
  }
</style>
