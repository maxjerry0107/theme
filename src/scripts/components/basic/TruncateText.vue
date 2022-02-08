<template lang="pug">
  .truncate-text(:style="wrapperStyle")
    .truncate-text__copy(v-if="content.length > 0" ref="text" :style="textStyle" v-html="content")
    .truncate-text__copy(v-else ref="text" :style="textStyle")
      slot
    a.truncate-text__toggle(href="#" @click.prevent="toggleVisibility")
      | {{ toggleLabel }}
      icon(:name="open ? 'chevron-up' : 'chevron-down'" size="11px")
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'TruncateText',
    components: {
      Icon,
    },
    props: {
      lines: {
        type: Number,
        default: 3,
      },
      lineHeight: {
        type: Number,
        default: 24,
      },
      content: String,
    },
    data() {
      return {
        open: false,
        wrapperStyle: {
          'margin-bottom': '9px',
        },
        textStyle: {
          'max-height': this.getMaxHeight(),
        },
      };
    },
    computed: {
      toggleLabel() {
        return this.open ? 'Read Less' : 'Read More';
      },
    },
    watch: {
      open() {
        this.setWrapperHeight();
      },
    },
    mounted() {
      this.setWrapperHeight();
    },
    methods: {
      toggleVisibility() {
        this.open = !this.open;
      },
      getMaxHeight() {
        return this.open ? `${this.$refs.text.scrollHeight}px` : `${this.lineHeight * this.lines}px`;
      },
      setWrapperHeight() {
        this.textStyle['max-height'] = this.getMaxHeight();
      },
    },
  };
</script>

<style scoped lang="scss">
  .truncate-text {
    position: relative;
  }

  .truncate-text__copy {
    margin-bottom: 8px;
    transition: 0.3s ease-in-out max-height;
    overflow: hidden;

    & > *:first-child {
      margin-top: 0;
    }

    & > *:last-child {
      margin-bottom: 0;
    }
  }

  .truncate-text__toggle {
    font-size: rem(12);
    line-height: 1;
    letter-spacing: 0.4px;
    text-transform: uppercase;

    &,
    &:hover {
      text-decoration: none;
    }

    &::v-deep .icon {
      margin-left: 6px;
    }
  }
</style>
