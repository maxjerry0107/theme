<template lang="pug">
.banner-wrapper
  slot(
    name="default"
    v-if="!mounted"
  )
  .banner.row.collapse(
    :class="desktopFlexOrder"
    v-if="mounted"
  )
    .column.no-gutters.small-12(
      :class="{ 'medium-8 large-8 hd-7' : twoColumns }"
    )
      .image__wrapper.animation--fade-in(
        :class="`animation--fade-in-${pageTemplate}`"
      )
        img.banner__image(
          v-lazy="bannerImage"
          :alt="bannerImageAlt"
          :srcset="sourceSet"
          :width="bannerImageWidth"
          :height="bannerImageHeight"
        )
        button-component.banner__cta--mobile.button--full-width(
          v-if="ctaTest(['mobile'])"
          :class="ctaClass"
          :href="ctaLink"
        ) {{ ctaLabel }}
    .column.no-gutters.small-12(
      v-if="preHeading || title || bodyText"
      :class="{ 'medium-4 large-4 hd-5' : twoColumns }"
    )
      .banner__text(
        :class="textAlignClass"
      )
        p.heading--7(
          v-if="preHeading"
        ) {{ preHeading }}
        .heading--1(
          v-if="title"
          :is="pageTemplate == 'index' ? 'h2' : 'h1'"
        ) {{ title }}
        p.banner__body-text(
          v-if="bodyText"
          v-html="bodyTextUnescape(bodyText)"
        )
        button-component.banner__cta--desktop(
          v-if="ctaTest(['tablet', 'desktop', 'hd'])"
          :class="ctaClass"
          :href="ctaLink"
        ) {{ ctaLabel }}
</template>

<script>
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';

  export default {
    name: 'Banner',
    components: {
      ButtonComponent,
    },
    props: {
      title: String,
      preHeading: String,
      bodyText: String,
      textAlignment: String,
      ctaLabel: String,
      ctaLink: String,
      ctaType: {
        type: String,
        default: () => 'primary',
      },
      desktopImage: String,
      mobileImage: String,
      desktopImageAlt: String,
      mobileImageAlt: String,
      desktopSizes: {
        type: Array,
        default: () => ['', ''],
      },
      mobileSizes: {
        type: Array,
        default: () => ['', ''],
      },
      srcSet: Array,
      desktopImagePosition: {
        type: String,
        default: () => '1',
      },
      pageTemplate: String,
      twoColumns: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        mounted: false,
      };
    },
    computed: {
      ctaClass() {
        return `button--${this.ctaType}`;
      },
      desktopFlexOrder() {
        return Number(this.desktopImagePosition) === 1 ? 'medium-up--reverse' : 'medium-up--default';
      },
      bannerImage() {
        return this.isMobile() ? this.mobileImage : this.desktopImage;
      },
      bannerImageAlt() {
        return this.isMobile() ? this.mobileImageAlt : this.desktopImageAlt;
      },
      bannerImageWidth() {
        const { isMobile, mobileSizes, desktopSizes } = this;
        return isMobile() ? mobileSizes[0] : desktopSizes[0];
      },
      bannerImageHeight() {
        const { isMobile, mobileSizes, desktopSizes } = this;
        return isMobile() ? mobileSizes[1] : desktopSizes[1];
      },
      textAlignClass() {
        return `text-align--${this.textAlignment}`;
      },
      sourceSet() {
        const { isMobile, srcSet } = this;
        return isMobile() ? srcSet.slice(0, 1).join(', ') : srcSet.join(', ');
      },
    },
    mounted() {
      this.mounted = true;
    },
    methods: {
      bodyTextUnescape(text) {
        return String(text)
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"');
      },
      ctaTest(array) {
        return array.includes(this.$mq) && this.ctaLabel && this.ctaLink;
      },
      isMobile() {
        return ['mobile'].includes(this.$mq);
      },
    },
  };
</script>
<style scoped lang="scss"></style>
