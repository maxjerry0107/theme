<template lang="pug">
  .mobile-subnav
    ul.mobile-subnav__link-list(
      v-for="linkList, index in linkLists"
      :key="`${linkList.handle}_${index}`"
    )
      li.mobile-subnav__node.mobile-subnav__node--heading(
        :class="mobileSubnavNodeClass(linkList)"
      )
        component(
          :class="linkList.url && linkList.url !== '#' ? 'mobile-subnav__link': ''"
          :is="linkList.url && linkList.url !== '#' ? 'a': 'div'"
          :href="linkList.url"
        ) {{ linkList.title }}

      li.mobile-subnav__node(
        v-for="link, index in linkList.children"
        :key="`${link.handle}_${index}`"
      )
        component(
          :class="link.url && link.url !== '#' ? 'mobile-subnav__link': ''"
          :is="link.url && link.url !== '#' ? 'a': 'div'"
          :href="link.url"
        ) {{ link.title }}
        ul.mobile-subnav__link-list(
          v-if="link.children"
        )
          li.mobile-subnav__node(
            v-for="thirdLevelLink, index in link.children"
            :key="`${thirdLevelLink.handle}_${index}`"
          )
            component(
              :class="thirdLevelLink.url && thirdLevelLink.url !== '#' ? 'mobile-subnav__link': ''"
              :is="thirdLevelLink.url && thirdLevelLink.url !== '#' ? 'a': 'div'"
              :href="thirdLevelLink.url"
            ) {{ thirdLevelLink.title }}

</template>
<script>
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';

  export default {
    name: 'MobileSubnav',
    components: {
      ButtonComponent,
    },
    props: {
      menuItem: {
        type: Object,
        default: () => {},
      },
    },
    computed: {
      tiles() {
        const tiles = [];

        [1, 2, 3].forEach((index) => {
          let tileHasContent = false;

          const tile = {
            link: this.menuItem[`tile_${index}_link`],
            heading: this.menuItem[`tile_${index}_heading`],
            text: this.menuItem[`tile_${index}_text`],
          };

          if (Object.entries(tile).some((value) => value[1])) {
            tileHasContent = true;
          }

          tile.image = this.menuItem[`tile_${index}_image`];

          if (tile.image.src) {
            tileHasContent = true;
          }

          if (tileHasContent) {
            tiles.push(tile);
          }
        });

        return tiles;
      },
      linkLists() {
        return this.menuItem.children;
      },
    },
    methods: {
      mobileSubnavNodeClass(link){
        return {
          'mobile-subnav__node--heading mobile-subnav__node--third-level-heading' : link.children,
          'mobile-subnav__node--sale' : link.title.toLowerCase() === 'sale'
        }
      }
    },
  };
</script>

<style scoped lang="scss">
  .mobile-subnav {
    padding: ($spacing-unit * 2) 0 0;
  }

  .mobile-subnav__link-list {
    margin: 0 0 ($spacing-unit * 6);
    padding: 0;
    list-style: none;

    & & {
      padding: 0;
    }

    &:last-child {
      margin-bottom: 0
    }
  }

  .mobile-subnav__node {
    margin-bottom: $spacing-unit * 2;
    color: $color-grey-900;
    font-size: rem(18);
  }

  .mobile-subnav__node--heading > .mobile-subnav__link {
    font-family: $font-secondary;
    font-size: rem(18);
    line-height: rem(24);
    font-weight: $font-weight-bold;
    letter-spacing: $letter-spacing-global;
  }

  .mobile-subnav__node--third-level-heading {
    padding-top: ($spacing-unit * 3);
  }

  .mobile-subnav__link {
    font-family: $font-primary;
    font-weight: $font-weight-regular;
    font-size: rem(20);
    line-height: rem(20);
    color: $color-mobile-menu;
    text-decoration: none;
  }

  .mobile-subnav__tiles {
    white-space: nowrap;
    overflow-x: scroll;
  }

  .mobile-subnav__tile {
    display: inline-block;
    margin-right: $spacing-unit * 2;
    width: 196px;
    color: $color-grey-900;
    text-decoration: none;
  }

  .mobile-subnav__tile-heading {
    margin-bottom: $spacing-unit * 2;
    font-size: rem(14);
    font-weight: $font-weight-regular;
  }
</style>
