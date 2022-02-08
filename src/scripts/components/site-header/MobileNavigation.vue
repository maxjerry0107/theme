<template lang="pug">
  .mobile-navigation(
    :class="isMenuOpen ? 'mobile-navigation--is-open' : ''"
  )
    transition(name="fade", @enter="enableLinks()", @leave="disableLinks()")
      .mobile-navigation__nav(v-if="isMenuOpen")
        .mobile-navigation__menu-heading-wrapper(v-if="progressLevel > 1 && showLinks")
          h3.mobile-navigation__menu-heading {{ activeMenuTitle }}
        .mobile-navigation__nav-container(
          v-if="isMenuOpen"
          :class="{'mobile-navigation__nav-container--progressed' : progressLevel > 1 && showLinks}"
        )
          transition-group.mobile-navigation__linklist(tag="ul" :name="menuTransition")
            li.mobile-navigation__node(
              v-for="(menuItem, index) in activeMenuItems"
              v-if="showLinks"
              :class="{'mobile-navigation__node--level-2' : progressLevel === 2}"
              :key="toKebabCase(menuItem.title)"
            )
              a.mobile-navigation__link(v-if="menuItem.url && menuItem.url !== '#' && !menuItem.children.length" :href="menuItem.url") {{ menuItem.title }}
              .mobile-navigation__link-wrapper(
                v-else-if="menuItem.children.length && progressLevel === 1"
              )
                accordion(
                  :heading="menuItem.title"
                  active-icon="minus"
                  inactive-icon="plus"
                  iconSize="32px"
                )
                  mobile-subnav(
                    :key="`${toKebabCase(menuItem.title)}_${_uid}`"
                    :menuItem="menuItem"
                  )
              .mobile-navigation__link(v-else) {{ menuItem.title }}
          transition(:name="footerTransition")
            .mobile-navigation__footer(v-if="progressLevel === 1 && showLinks")
              ul.mobile-navigation__footer-list
                li.mobile-navigation__footer-list-node
                  a.link.link--nav(:href="favoritesLink") Favorites
                li.mobile-navigation__footer-list-node
                  icon.mobile-navigation__decorator-icon(name="account" size="21px")
                  a.link.link--nav(:href="userLink") {{ userLabel }}

    navbar-hamburger(@open="openMenu", @close="closeMenu")
</template>

<script>
  import { mapState } from 'vuex';
  import { toKebabCase } from 'scripts/helpers/util';
  import NavbarHamburger from 'scripts/components/site-header/NavbarHamburger.vue';
  import VButton from 'scripts/components/buttons/VButton.vue';
  import Icon from 'scripts/components/basic/Icon.vue';
  import Accordion from 'scripts/components/basic/Accordion.vue';
  import MobileSubnav from 'scripts/components/site-header/MobileSubnav.vue';

  export default {
    name: 'MobileNavigation',
    components: {
      NavbarHamburger,
      VButton,
      Icon,
      Accordion,
      MobileSubnav,
    },
    props: {
      menuItems: {
        type: Array,
        default: () => [],
      },
      loggedIn: {
        type: Boolean,
        default: false,
      },
      socialMedia: Array,
      accessibilityLink: String,
      favoritesLink: String,
    },
    data() {
      return {
        isMenuOpen: false,
        showLinks: false,
        subnav: null,
        showLogo: true,
        activeMenu: {},
        activeMenuItems: [],
        activeMenuTitles: [],
        previousMenus: [],
        progressLevel: 1,
        menuTransition: 'slide-fade-left',
        footerTransition: 'slide-fade-left',
      };
    },
    computed: {
      ...mapState({
        scrollTop: (state) => state.scroll.scrollTop,
      }),
      userLink() {
        return this.loggedIn ? '/account' : '/account/login';
      },
      userLabel() {
        return this.loggedIn ? 'My Account' : 'Sign In';
      },
      activeMenuTitle() {
        return this.activeMenuTitles[this.activeMenuTitles.length - 1];
      },
    },
    mounted() {
      this.activeMenuItems = this.menuItems;
    },
    methods: {
      hasSubnav(menuItem) {
        return Object.entries(menuItem).some((value) => {
          if (value[0] === 'name' || value[0] === 'link' || value[0] === 'children') return false;

          if (value[0].includes('image')) {
            return value[1].src;
          }

          return value[1];
        });
      },
      openMenu() {
        this.isMenuOpen = true;
      },
      closeMenu() {
        this.isMenuOpen = false;
        this.closeSubnav();
      },
      enableLinks() {
        this.showLinks = true;
      },
      disableLinks() {
        this.showLinks = false;
      },
      openSubnav(subnav) {
        this.subnav = subnav;
      },
      closeSubnav() {
        this.subnav = null;
      },
      toKebabCase(stringToAlter) {
        return toKebabCase(stringToAlter);
      },
      menuProgress(menu) {
        this.menuTransition = 'menu-slide-fade-left';
        this.footerTransition = 'footer-menu-slide-fade';
        this.$root.$emit('mobile-menu-change', 'progress');

        if (menu.children) {
          this.progressLevel += 1;
          this.previousMenus.push(this.activeMenuItems);
          this.activeMenuTitles.push(menu.title);
          this.activeMenuItems = menu.children;

          if (this.progressLevel === 2) {
            this.activeMenu = menu;
          }
        }
      },
      menuRetreat() {
        this.menuTransition = 'menu-slide-fade-right';

        this.$root.$emit('mobile-menu-change', 'retreat');
        this.progressLevel -= this.progressLevel > 1 ? 1 : 0;
        this.activeMenuItems = this.previousMenus[this.previousMenus.length - 1];
        this.previousMenus.pop();
        this.activeMenuTitles.pop();
      },
      onChatClicked() {
        if (window.GorgiasChat) {
          if (window.GorgiasChat.isOpen()) {
            window.GorgiasChat.close();
          } else {
            window.GorgiasChat.open();
          }
        }
      },
    },
  };
</script>

<style lang="scss">
  .mobile-navigation {
    color: $color-blue-900;
    z-index: index($mobile-site-header, 'mobile-navigation');
  }

  .mobile-navigation__nav-container {
    display: flex;
    flex-direction: column;
    position: relative;
    min-height: 600px;
  }

  .mobile-navigation__nav-container--progressed {
    &:before {
      width: calc(100% - 40px);
    }
  }

  .mobile-navigation__right {
    display: flex;
  }

  .mobile-navigation__nav {
    position: absolute;
    top: 0;
    left: 0;
    margin: $mobile-utility-nav-height 0 0;
    width: 100%;
    height: calc(100vh - #{$mobile-utility-nav-height});
    background-color: $bg--main;
    overflow-y: scroll;
    overflow-x: hidden;
    z-index: index($mobile-site-header, 'mobile-navigation-2');
  }

  .mobile-navigation__menu-heading-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    padding: 0 ($spacing-unit * 10);
    height: $mobile-nav-height;
    width: 100%;
  }

  .mobile-navigation__menu-heading {
    font-family: $font-primary;
    font-size: rem(16);
    line-height: rem(18);
    font-weight: 700;
    text-transform: uppercase;
    text-align: center;
    margin: 0;
  }

  .mobile-navigation__back-button-wrapper {
    display: flex;
    align-items: center;
    padding: ($spacing-unit * 4) ($spacing-unit * 4) 0;
  }

  .mobile-navigation__back-button {
    .icon {
      fill: $color-grey-900;
    }
  }

  .mobile-navigation__back-button-text {
    margin-left: ($spacing-unit * 2);
    font-size: rem(12);
    line-height: rem(30);
    font-weight: 500;
    text-transform: uppercase;
    color: $color-grey-900;
  }

  .mobile-navigation__linklist {
    &:last-child {
      padding-bottom: $spacing-unit * 10;
    }
  }

  .mobile-navigation__linklist,
  .mobile-navigation__footer-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    flex-direction: column;
  }

  .mobile-navigation__node,
  .mobile-navigation__footer-list-node {
    display: flex;
    align-items: center;
    padding: 0 ($spacing-unit * 5);
    line-height: 1.375;
  }

  .mobile-navigation__node {
    border-bottom: 1px solid $color-disabled;
    // &:first-child {
    //   border: 0;
    // }
  }

  .mobile-navigation__footer-list-node {
    margin: rem(20) 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .mobile-navigation__decorator-icon {
    margin-right: 12px;
  }

  .mobile-navigation__node--level-2 {
    padding: ($spacing-unit * 6) ($spacing-unit * 8);
    border-top: 0;
  }

  .mobile-navigation__link-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .mobile-navigation__link {
    color: $color-mobile-menu;
    font-size: rem(16);
    line-height: rem(18);
    font-weight: 800;
    text-transform: uppercase;
    text-decoration: none;
    letter-spacing: 0.08em;
    padding: rem(26.5) 0;
  }

  .mobile-navigation__link-icon {
    fill: $color-grey-900;
  }

  .mobile-navigation__footer {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    background: $color-grey-900;
    padding: rem(24) 0 rem(56);
  }

  .icon--plus, .icon--minus {
    fill: $color-mauve-900;
    stroke: $color-mauve-900;
  }
</style>
