<template lang="pug">
  ul.primary-navigation(
    v-if="menuItems && menuItems.length"
  )
    li.primary-navigation__node(
      v-for="menuItem in menuItems"
      :key="menuItem.name"
    )
      .primary-navigation__link.link.link--nav(
        :class="toKebabCase(menuItem.name) === openSubnav ? 'primary-navigation__link--open-subnav' : ''"
        :is="menuItem.link ? 'a' : 'div'"
        :tabindex="menuItem.link ? null : 0"
        :href="menuItem.link"
        @mouseenter="showSubnav(toKebabCase(menuItem.name), menuItem.children.length)"
        @focus="showSubnav(toKebabCase(menuItem.name), menuItem.children.length)"
        v-if="hasSubnav(menuItem)"
      ) {{ menuItem.name }}
      a.primary-navigation__link(
        :href="menuItem.link"
        @mouseenter="hideSubnav"
        @focus="hideSubnav"
        v-else
      ) {{ menuItem.name }}
      transition(
        name="fade"
        v-if="hasSubnav(menuItem)"
      )
        subnav(
          :key="`${toKebabCase(menuItem.name)}_${_uid}`"
          v-if="openSubnav && openSubnav === toKebabCase(menuItem.name)"
          @mouseleave="hideSubnav"
          @blur="hideSubnav"
          :menuItem="menuItem"
        )
    transition(name="fade")
      .primary-navigation__overlay(v-if="!!openOverlay")
</template>
<script>
  import Subnav from 'scripts/components/site-header/Subnav.vue';
  import Icon from 'scripts/components/basic/Icon.vue';

  import { toKebabCase } from 'scripts/helpers/util';

  export default {
    name: 'PrimaryNavigation',
    components: { Subnav, Icon },
    props: {
      menuItems: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        openSubnav: null,
        openOverlay: false,
      };
    },
    methods: {
      showSubnav(subnav, numChildren) {
        this.openSubnav = subnav;
        this.openOverlay = numChildren > 0;
      },
      hideSubnav() {
        this.openSubnav = null;
        this.openOverlay = false;
      },
      hasSubnav(menuItem) {
        return Object.entries(menuItem).some((value) => {
          if (value[0] === 'name' || value[0] === 'link' || value[0] === 'children') return false;

          if (value[0].includes('image')) {
            return value[1].src;
          }

          return value[1];
        });
      },
      toKebabCase(stringToAlter) {
        return toKebabCase(stringToAlter);
      },
    },
  };
</script>

<style lang="scss">
  .primary-navigation {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;
    height: 100%;
  }

  .primary-navigation__node {
    padding-right: $spacing-unit * 6;
  }

  .primary-navigation__link {
    transition: all 0.3s ease-in-out;

    &:hover {
      font-weight: $font-weight-bold;
    }
  }

  .primary-navigation__overlay {
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 100vh;
    transform: translateY(100%);
    z-index: index($site-header, 'overlay');

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: $color-white;
      opacity: 0.25;
    }
  }
</style>
