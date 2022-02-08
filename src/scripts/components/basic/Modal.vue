<template lang="pug">
  transition(name="fade")
    .modal(
      v-show="isVisible"
      :class="video ? 'modal--video' : null"
    )
      .modal__overlay(@click="close")
      icon-button.modal__close-video(v-if="video", label="Close Modal", icon="close", size="30px", @click="close")
      .modal__content.modal__content--video(v-if="video")
        .modal__video-container(
          :class="{ 'loading': !videoIsLoaded }"
        )
          iframe(
            :src="videoUrl"
            frameborder="0"
            allowfullscreen
            @load="videoIsLoaded = true;"
          )
      .modal__content(v-else)
        icon-button.modal__close(label="Close Modal", icon="close", size="16", @click="close")
        slot(name="content")
        slot
</template>

<script>
  import IconButton from 'scripts/components/buttons/IconButton.vue';

  export default {
    name: 'Modal',
    components: { IconButton },
    props: {
      video: String,
      wrapperClass: String,
      autoOpen: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        isVisible: false,
        videoIsLoaded: false,
      };
    },
    computed: {
      videoUrl() {
        const videoUrl = `https://player.vimeo.com/video/${this.video}?title=0&autoplay=1&byline=0&portrait=0&speed=0&badge=0&autopause=0&player_id=0&app_id=58479`;

        return this.video && this.isVisible ? videoUrl : '';
      },
    },
    mounted() {
      if (this.autoOpen) {
        this.$nextTick(() => {
          this.open();
        });
      }
    },
    methods: {
      open() {
        this.isVisible = true;
        this.$emit('open');
      },
      close() {
        this.isVisible = false;
        this.$emit('close');
      },
    },
  };
</script>

<style lang="scss">
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: index($layout, modal);
    width: 100%;
    min-height: 100vh;
    overflow-y: auto;
    background-color: $bg--overlay;
  }

  .modal--video {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal__overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: index($modal, 'overlay');
  }

  .modal__close-video {
    position: absolute;
    top: $grid-gutter;
    right: $grid-gutter;
    z-index: index($modal, 'content');
  }

  .modal__content {
    position: absolute;
    left: 50%;
    z-index: index($modal, 'content');
    margin-bottom: 50px;
    padding: 30px;
    max-width: 100%;
    background-color: $bg--main;
    transform: translateX(-50%);

    @include mobile-only {
      width: 100%;
      min-height: 100vh;
    }

    @include tablet-up {
      top: 50px;
      padding: 65px;
      min-width: 500px;
    }

    .collection-grid__actions-modal & {
      padding: 0;
    }
  }

  .modal__content--video {
    position: relative;
    left: auto;
    transform: none;
    margin-bottom: 0;
    padding: $spacing-unit * 2;
    width: $container-max-width;
    max-width: 100%;
    min-height: 0;
    background-color: transparent;

    @include desktop-up {
      max-width: 800px;
    }

    &:after {
      z-index: index($modal, 'loading-indicator');
    }
  }

  .modal__video-container {
    position: relative;
    padding-top: 30px;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;

    iframe,
    object,
    embed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  .modal__title {
    margin-bottom: $content-gutter;
  }

  .modal__close {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 8px;
    width: 44px;
    height: 44px;
    font-size: rem(36);
    line-height: 44px;
    text-align: center;
  }
</style>
