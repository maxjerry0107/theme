<template lang="pug">
  .button(
    :class="modifierClasses"
    :style="buttonStyles"
    :is="elementType"
    :href="buttonHref"
    :disabled="isDisabled"
    @click.stop="clickAction"
  )
    icon.button__icon(
      v-if="iconName"
      :name="iconName"
      :size="iconSize"
      :width="iconWidth"
      :height="iconHeight"
    )
    .button__content
      slot
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'ButtonComponent',
    components: { Icon },
    props: {
      href: String,
      disabled: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      backgroundColor: String,
      textColor: String,
      icon: String,
      iconSize: String,
      iconWidth: String,
      iconHeight: String,
    },
    computed: {
      modifierClasses() {
        return {
          'button--disabled': this.isDisabled,
          'button--icon-left': this.isTourVideoButton,
        };
      },
      buttonStyles() {
        return {
          backgroundColor: this.backgroundColor,
          color: this.textColor,
        };
      },
      elementType() {
        const element = this.href ? 'a' : 'button';

        return element;
      },
      isDisabled() {
        return this.disabled || this.loading;
      },
      isBookingButton() {
        return this.href === '#blvd';
      },
      isTourVideoButton() {
        return this.href === '#video-tour';
      },
      buttonHref() {
        if (this.isBookingButton || this.isTourVideoButton) return null;

        return this.href && this.disabled ? null : this.href;
      },
      iconName() {
        return this.isTourVideoButton ? 'video' : this.icon;
      },
    },
    methods: {
      openBookingApp() {
        window.blvd.openBookingWidget({ newWindow: 'mobile' });
      },
      openTourVideo() {
        this.$root.$refs.tourVideoModal.open();
      },
      clickAction() {
        this.$emit('click');

        if (this.isBookingButton && window.blvd) {
          this.openBookingApp();
        }

        if (this.isTourVideoButton) {
          this.openTourVideo();
        }
      },
    },
  };
</script>
