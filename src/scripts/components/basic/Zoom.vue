<template lang="pug">
  .zoom-on-hover(
    :class="classes"
    @mousemove="move"
    @mouseenter="zoom"
    v-scroll-lock="isZooming"
    @mouseleave="unzoom"
  )
    img.zoom-on-hover__normal(
      ref="normal"
      v-bind="imgNormalAttrs"
    )
    img.zoom-on-hover__zoom(
      ref="zoom"
      @touchmove.stop.prevent="move"
      :style="`transform: translate(${position.x}px, ${position.y}px) scale(${isZooming ? scaleLevel : 1})`"
      v-bind="imgZoomAttrs"
    )
</template>
<script>
  export default {
    name: 'Zoom',
    props: {
      imgNormalAttrs: {
        type: Object,
        required: true,
      },
      imgZoomAttrs: {
        type: Object,
        required: true,
      },
      scale: {
        type: Number,
        default: 1.5,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      zooming: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        isZooming: false,
        position: {
          x: 0,
          y: 0,
        },
      };
    },
    computed: {
      classes() {
        const { isZooming } = this;
        return isZooming ? 'zoom-on-hover--active' : 'zoom-on-hover--inactive';
      },
      touchStyle() {
        const zooming = this.isZooming;

        return {
          touchAction: zooming ? 'none' : 'default',
        };
      },
      scaleLevel() {
        return this.$mq === 'mobile' ? this.scale : this.scale + 0.5;
      },
    },
    watch: {
      zooming(newValue) {
        this.isZooming = newValue;
      },
    },
    methods: {
      pageOffset(el) {
        // -> {x: number, y: number}
        // get the left and top offset of a dom block element
        const rect = el.getBoundingClientRect();

        return {
          y: rect.top,
          x: rect.left,
        };
      },
      zoom(e) {
        if (this.disabled) return;
        this.isZooming = true;
        this.move(e);
        this.$emit('zoom', this.isZooming);
      },
      unzoom() {
        if (this.disabled || !this.isZooming) return;
        this.isZooming = false;
        this.$emit('unzoom', this.isZooming);
      },
      zoomCenter() {
        const { disabled, $refs, position } = this;
        if (disabled) return;

        this.isZooming = true;
        const x = $refs.normal.offsetWidth / 2;
        const y = $refs.normal.offsetHeight / 2;
        position.x = -x;
        position.y = -y;
      },
      move(event) {
        const { disabled, pageOffset, position, scale, $el, $refs } = this;
        if (disabled) return;
        this.isZooming = true;
        let { clientX, clientY } = event;

        if ('TouchEvent' in window && event instanceof window.TouchEvent) {
          clientX = event.changedTouches[0].clientX;
          clientY = event.changedTouches[0].clientY;
        }

        const offset = pageOffset($el);
        const { normal, zoom } = $refs;
        const { innerWidth, innerHeight } = window;
        const relativeX = clientX - offset.x;
        const relativeY = clientY - offset.y;
        const normalFactorX = relativeX / normal.offsetWidth;
        const normalFactorY = relativeY / normal.offsetHeight;
        const x = Math.max(-(scale * 0.25) * innerWidth, Math.min(normalFactorX * (zoom.offsetWidth * scale - normal.offsetWidth), innerWidth * 0.35));
        const y = Math.max(0, Math.min(normalFactorY * (zoom.offsetHeight * scale - normal.offsetHeight), innerHeight * 0.35));

        position.x = -x;
        position.y = -y;
      },
    },
  };
</script>
<style scoped lang="scss">
  .zoom-on-hover {
    position: relative;
    overflow: hidden;
    font-size: 0;
  }

  .zoom-on-hover__normal {
    display: block;
    width: 100%;
    position: relative;
    z-index: index($zoom, 'zoom-default');
  }

  .zoom-on-hover__zoom {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transform-origin: top center;
    z-index: index($zoom, 'zoom-default');
    pointer-events: none;

    @include tablet-up {
      left: 12.72%;
      transform-origin: top center;
      pointer-events: all;
    }
  }

  .zoom-on-hover--active {
    .zoom-on-hover__normal {
      opacity: 0;
      z-index: index($zoom, 'zoom-default');
      min-height: 135vh;
    }
    .zoom-on-hover__zoom {
      opacity: 1;
      z-index: index($zoom, 'zoom-active');
      touch-action: manipulation;

      @include tablet-up {
        max-width: 150vw;
        max-height: 150vh;
      }
    }
  }
</style>
