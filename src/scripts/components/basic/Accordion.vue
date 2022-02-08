<template lang="pug">
  .accordion(:class="accordionClass")
    button.accordion__header(:class="headerClass", @click.prevent="activate")
      span(
        v-html="heading"
      )
      icon(
        :name="currentIcon"
        :size="iconSize"
        class="accordion__button-icon"
      )
    transition(:name="transition")
      .accordion__content(v-if="active", ref="content", :style="contentStyle")
        slot
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'Accordion',
    components: { Icon },
    props: {
      heading: {
        type: String,
        required: true,
      },
      selected: {
        type: Boolean,
        default: false,
      },
      activeIcon: {
        type: String,
        default: 'minus',
      },
      inactiveIcon: {
        type: String,
        default: 'plus',
      },
      iconSize: {
        type: String,
        default: '24px',
      },
      theme: {
        type: String,
        default: 'default',
        validator(value) {
          return ['default', 'footer', 'pdp'].includes(value);
        },
      },
    },
    data() {
      return {
        active: true,
        contentStyle: {},
        scrollHeight: 0,
        transition: 'none',
      };
    },
    computed: {
      accordionClass() {
        const classes = [];

        if (this.theme !== 'default') {
          classes.push(`accordion--${this.theme}`);
        }

        return classes;
      },
      headerClass() {
        return {
          'is-open': this.active,
        };
      },
      currentIcon() {
        return this.active ? this.activeIcon : this.inactiveIcon;
      },
    },
    mounted() {
      this.setContentHeight();

      // NOTE: this has to be set to false after mount or scrollHeight will be 0
      this.active = this.selected;
      this.transition = 'slide-vertical';

      if (this.$parent.addAccordion) {
        this.$parent.addAccordion(this);
      }
    },
    beforeDestroy() {
      this.active = false;
      if (this.$parent.removeAccordion) {
        this.$parent.removeAccordion(this);
      }
    },
    methods: {
      setContentHeight() {
        const height = this.$refs.content && this.$refs.content.scrollHeight ? this.$refs.content.scrollHeight : 999;
        const containerPadding = 50;

        // Set max height for animation
        this.contentStyle = {
          'max-height': `${height + containerPadding}px`,
        };
      },
      activate() {
        if (this.$parent.activate && !this.active) {
          this.$parent.activate(this);
          this.$emit('active');
        } else {
          this.active = !this.active;
        }

        this.$nextTick(() => this.setContentHeight());
      },
    },
  };
</script>

<style scoped lang="scss">
  .accordion {
    width: 340px;

    &.accordion--full & {
      width: 100%;
    }

    &.accordion--footer {
      background-color: transparent;
      border-top: 1px solid $color-blue-900;
      width: 100%;

      &:last-child {
        border-bottom: 1px solid $color-blue-900;
      }
    }

    .mobile-navigation__link-wrapper & {
      width: 100%;
    }

    .collection-grid__desktop-filter-wrapper,
    .collection-grid__mobile-filter-menu-filters & {
      width: 100%;
      margin: 0;
      padding: 0 rem(35) 0 rem(25);
    }
  }

  .accordion__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ($spacing-unit * 4) 0;
    width: 100%;
    color: $color-blue-900;
    font-size: $font-size-body;
    font-weight: $font-weight-bold;
    text-decoration: none;
    text-transform: uppercase;
    background-color: transparent;
    border: 0;
    letter-spacing: $letter-spacing-global;
    cursor: pointer;

    .accordion--footer & {
      padding: rem(22) rem(17);
      color: $color-blue-900;
      font-size: rem(18);
      font-family: $font-primary;
      font-weight: $font-weight-bold;
      line-height: rem(18);
      letter-spacing: rem(2);
      outline: 0;
      text-transform: uppercase;
    }

    .accordion--pdp & {
      padding: $spacing-unit 0;
      text-transform: uppercase;
      font-size: $font-size-body-small;

      &:focus {
        box-shadow: none;
      }

      .accordion__button-icon {
        transform: scale(0.58);
      }
    }

    .mobile-navigation & {
      color: $color-mobile-menu;
      font-size: rem(16);
      line-height: rem(16);
      font-weight: $font-weight-bold;
      text-decoration: none;
      letter-spacing: rem(2);
    }

    .mobile-navigation__customer-support-accordion & {
      padding: 0;
      font-size: rem(18);
      font-weight: $font-weight-regular;
    }

    .collection-grid__mobile-filter-menu & {
      font-size: $font-size-body-large-desktop;
    }

    .collection-grid__filter-accordion & {
      font-size: 1rem;
      line-height: 1rem;
      font-weight: $font-weight-bold;
      text-transform: uppercase;
      color: $color--primary;
      letter-spacing: rem(2);
      padding: rem(18) 0;

      .accordion__button-icon {
        transform: scale(0.64);
      }
    }
  }

  .accordion__content {
    overflow: hidden;
    padding: 0 0 $spacing-unit * 4;
    max-height: 0;

    /deep/ p {
      color: $color-black;
      font-weight: 400;
      font-size: $font-size-body-desktop;
      line-height: rem(24);
      letter-spacing: $letter-spacing-global;
    }
  }

  .accordion__content--wrapper {
    overflow: hidden;
  }
</style>
