<template lang="pug">
  .subnav(
    v-if="showTextContent || linkLists.length > 0"
    @mouseleave="$emit('mouseleave')"
    @blur="$emit('blur')"
  )
    .container
      .row.subnav__content-row
        .column.medium-4.subnav__text-content(
          v-if="showTextContent"
        )
          .subnav__text-content-heading(
            v-if="menuItem.text_content_heading"
          ) {{ menuItem.text_content_heading }}
          .subnav__text-content-body(
            v-if="menuItem.text_content_body"
            v-html="menuItem.text_content_body"
          )
          v-button.subnav__text-content-cta(
            v-if="menuItem.text_content_cta_url && menuItem.text_content_cta_text"
            :href="menuItem.text_content_cta_url"
          ) {{ menuItem.text_content_cta_text }}

        ul.subnav__link-list(
          v-for="linkList, index in linkLists"
          :class="menuItem.featured_list_enabled && index == 0 ? 'subnav__link-list--featured' : ''"
          :key="`${linkList.handle}_${index}_${_uid}`"
        )
          li.subnav__node.subnav__node--heading
            component(
              :class="linkList.url && linkList.url !== '#' ? 'subnav__link': ''"
              :is="linkList.url && linkList.url !== '#' ? 'a': 'div'"
              :href="linkList.url"
            ) {{ linkList.title }}
          li.subnav__node(
            v-for="link, index in linkList.children"
            :key="`${link.handle}_${index}_${_uid}`"
            :class="subnavNodeClass(link)"
          )
            component(
              :class="link.url && link.url !== '#' ? 'subnav__link': ''"
              :is="link.url && link.url !== '#' ? 'a': 'div'"
              :href="link.url"
            ) {{ link.title }}
            ul.subnav__link-list(
              v-if="link.children"
            )
              li.subnav__node(
                v-for="thirdLevelLink in link.children"
                :key="`${thirdLevelLink.handle}_${_uid}`"
              )
                component(
                  :class="thirdLevelLink.url && thirdLevelLink.url !== '#' ? 'subnav__link': ''"
                  :is="thirdLevelLink.url && thirdLevelLink.url !== '#' ? 'a': 'div'"
                  :href="thirdLevelLink.url"
                ) {{ thirdLevelLink.title }}
        .subnav__tiles-wrapper(:class="tilesWrapperClass")
          .subnav__tiles-heading(v-if="menuItem.tiles_heading") {{ menuItem.tiles_heading }}
          .subnav__tiles
            .subnav__tile(
              v-for="tile, index in tiles"
              :is="tile.link ? 'a' : 'div'"
              :href="tile.link"
              :key="`${_uid}_tile_${index}`"
            )
              img(
                v-if="tile.image"
                :src="tile.image.src"
                :alt="tile.image.alt"
              )
              .subnav__tile-heading {{ tile.heading }}
              .subnav__tile-text(
                v-html="tile.text"
              )

</template>
<script>
  import VButton from 'scripts/components/buttons/VButton.vue';
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'Subnav',
    components: {
      VButton,
      Icon,
    },
    props: {
      menuItem: {
        type: Object,
        default: () => {},
      },
    },
    computed: {
      showTextContent() {
        return this.menuItem.text_content_toggle && this.hasTextContent;
      },
      hasTextContent() {
        return this.menuItem.text_content_heading || this.menuItem.text_content_body || this.menuItem.text_content_cta_url || this.menuItem.text_content_cta_text;
      },
      tilesWrapperClass() {
        return {
          'subnav__tiles-wrapper--single': this.tiles.length === 1,
        };
      },
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
      numberOfColumns() {
        return this.menuItem.children.length + this.tiles.length;
      },
    },
    methods: {
      subnavNodeClass(link) {
        return {
          'subnav__node--heading subnav__node--third-level-heading': link.children,
          'subnav__node--sale': link.title.toLowerCase() === 'sale',
        };
      },
    },
  };
</script>

<style scoped lang="scss">
  .subnav {
    display: flex;
    position: absolute;
    bottom: -1px;
    left: 0;
    z-index: index($site-header, 'subnav');
    padding: ($spacing-unit * 10) 0 ($spacing-unit * 15);
    width: 100%;
    transform: translateY(100%);
    background-color: $bg--main;
    border-bottom: 1px solid $border-grey;

    .container {
      width: 100%;
      padding: 0 ($spacing-unit * 10.5);
    }
  }

  .subnav__content-row {
    flex-wrap: nowrap;
    margin-right: 0;
  }

  .subnav__text-content {
    width: fit-content;
    margin-right: $spacing-unit * 10;
  }

  .subnav__text-content-heading {
    color: $color-blue-900;
    font-size: rem(18);
    font-weight: $font-weight-bold;
    line-height: rem(18);
  }

  .subnav__text-content-body {
    margin-bottom: $spacing-unit * 7;
    color: $color-blue-900;
    font-size: rem(16);
  }

  .subnav__text-content-cta {}

  .subnav__link-list {
    margin: 0;
    list-style: none;

    & & {
      padding: 0;
    }

    @include desktop-up {
      width: fit-content;
    }
  }

  .subnav__link-list--featured {
    margin-right: 20px;
    background-image: linear-gradient($color-black 33%, $color-white 0%);
    background-position: right;
    background-size: 1px 5px; /* Adjust values to change dot size and spacing */
    background-repeat: repeat-y;
  }

  .subnav__node {
    margin-bottom: $spacing-unit * 6;
    color: $color-blue-900;
    font-family: $font-primary;
    font-size: rem(18);
    line-height: rem(20);

    &:last-child {
      margin-bottom: 0;
    }
  }

  .subnav__node--heading {
    display: flex;
    align-items: center;
    font-size: rem(18);
    line-height: rem(18);
    font-family: $font-body;
    font-weight: $font-weight-bold;
    letter-spacing: rem(0.5);
    color: $color-blue-900;
  }

  .subnav__node--third-level-heading {
    padding-top: ($spacing-unit * 3);
  }

  .subnav__link {
    color: inherit;
    text-decoration: none;

    &:hover {
      color: $color-mauve-900;
    }
  }

  .subnav__tiles-wrapper {
    margin-left: auto;
    max-width: 990px;
  }

  .subnav__tiles-wrapper--single {
    max-width: 535px;
  }

  .subnav__tiles-heading {
    margin-bottom: $spacing-unit * 6;
    font-size: rem(14);
    line-height: rem(11);
    font-weight: 700;
    text-transform: uppercase;
    width: 100%;
  }

  .subnav__tiles {
    display: flex;
  }

  .subnav__tile {
    flex: 1;
    color: $color-grey-900;
    text-decoration: none;
    margin-left: 20px;

    &:first-child {
      margin-left: 0px;
    }
  }

  .subnav__tile-heading {
    display: inline-block;
    margin-bottom: $spacing-unit * 2;
    font-size: rem(18);
    line-height: rem(24);
    font-weight: $font-weight-regular;

    .subnav__tile:hover & {
      text-decoration: underline;
    }
  }

  .subnav__tile-text {
    font-size: rem(16);
  }
</style>
