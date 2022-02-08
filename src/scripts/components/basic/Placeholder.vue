<template lang="pug">
  .placeholder
    transition(:name="this.transitionName")
      .placeholder__not-loaded(v-show="!state")
        slot(name="placeholder")
    transition(:name="this.transitionName")
      .placeholder__main(v-show="state === 'loaded'")
        slot(name="main")
    transition(:name="this.transitionName")
      .placeholder__error(v-show="state === 'error'")
        slot(name="error")
</template>

<script>
  /**
   * Show a placeholder image until the main image is loaded.
   *
   * Slots:
   *  - placeholder
   *  - main
   *  - error
   *
   * @module Placeholder
   */

  export default {
    name: 'Placeholder',
    props: {
      /** @prop {('load'|'canplay')} eventName */
      eventName: {
        type: String,
        default: 'load',
      },
      /** @prop {String} transitionName */
      transitionName: {
        type: String,
        default: 'fade',
      },
    },
    data() {
      return {
        /** @prop {(''|'loaded'|'error')} state */
        state: '',
      };
    },
    mounted() {
      let loaded = 0;
      if (!this.$slots.main) return;
      this.$slots.main
        .flatMap((vnode) => {
          let loadableElements = vnode.elm.querySelectorAll('img, iframe');
          if (vnode.elm.matches('img, iframe')) {
            loadableElements = [vnode.elm];
          }

          if (!loadableElements.length) {
            this.state = 'loaded';
            return [];
          }
          return [...loadableElements];
        })
        .forEach((element, __, arr) => {
          if (element.complete) {
            // element might already be loaded
            loaded += 1;
            if (loaded === arr.length) {
              this.state = 'loaded';
            }
          } else {
            element.addEventListener(this.eventName, () => {
              loaded += 1;
              if (loaded === arr.length) {
                this.state = 'loaded';
              }
            });
          }
        });
    },
  };
</script>

<style>
  .fade-leave-active,
  .fade-leave {
    position: absolute;
  }
</style>
