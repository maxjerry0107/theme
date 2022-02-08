<template lang="pug">
.fifty-fifty.fifty-fifty--flex-wrap.cv--auto.animation--fade-in
  .fifty-fifty__text-wrapper(
    v-for="(block, index) in sortedBlocks" :key="index"
    :class="`text-align--${block.textAlignment} justify-content--${block.verticalAlignment} fifty-fifty__${blockTypeHandlized(block)}`"
    :style="mounted ? blockStyles(block) : ''"
    v-lazy:background-image="block.backgroundImage.src"
  )
    p.fifty-fifty__inline-image-wrapper(
      v-if="hasInlineImage(block) || isImageBlock(block)"
    )
      img.fifty-fifty__inline-image(
        v-if="block.inlineImage.src"
        v-lazy="block.inlineImage.src"
        :alt="block.inlineImage.alt"
        :width="block.inlineImage.width"
        :height="block.inlineImage.height"
        loading="lazy"
      )
      img.fifty-fifty__background-image(
        v-if="$mq && isImageBlock(block)"
        v-lazy="block.backgroundImage.src"
        :alt="block.backgroundImage.alt"
        :width="block.backgroundImage.width"
        :height="block.backgroundImage.height"
        loading="lazy"
      )
    p.fifty-fifty__pre-heading(
      v-if="block.preHeading"
      :style="customTextColor(block)"
    ) {{ block.preHeading }}
    h3.fifty-fifty__heading(
      v-if="block.heading"
      :style="customTextColor(block)"
    ) {{ block.heading }}
    .fifty-fifty__video(
      v-if="block.type === 'video_block' && block.video"
    )
      media(
        :media="block.video"
        :videoUrl="block.video.src"
      )
      p.fifty-fifty__video-transcript(
        v-if="block.transcriptLink"
      )
        span Link to Video Transcript available
        a.fifty-fifty__video-transcript-link(
          :href="block.transcriptLink"
        ) here
    .fifty-fifty__body(
      v-if="block.body"
      :style="bodyStyles(block)"
      v-html="bodyTextUnescape(block.body)"
    )
    klaviyo-form.klaviyo-form--light-bg(
      v-if="block.type === 'klaviyo_block'"
      :formId="`email_signup_${block.id}`"
      :list-id="block.klaviyoListId"
      :message="block.klaviyoSuccessMessage"
    )
    button-component.fifty-fifty__cta(
      v-if="block.ctaUrl && block.ctaText"
      :class="`button--${block.ctaType} button--${block.ctaType}-arrow`"
      :href="block.ctaUrl"
    )
      span {{ block.ctaText }}
      icon.button__icon(
        v-if="block.ctaType !== 'link'"
        name="long-arrow-right"
        size="18px"
      )
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue';
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';
  import KlaviyoForm from 'scripts/components/forms/KlaviyoForm.vue';
  import Media from 'scripts/components/basic/Media.vue';

  export default {
    name: 'PageBlocks',
    components: {
      Icon,
      ButtonComponent,
      KlaviyoForm,
      Media,
    },
    props: {
      sectionBlocks: {
        type: Array,
        default: () => [
          {
            id: String,
            type: String,
            backgroundColor: String,
            backgroundImage: Object,
            textColor: String,
            textAlignment: String,
            verticalAlignment: String,
            inlineImage: Object,
            preHeading: String,
            heading: String,
            body: String,
            contentWidth: String,
            ctaUrl: String,
            ctaText: String,
            ctaType: {
              type: String,
              default: 'secondary',
            },
            klaviyoListId: String,
            klaviyoSuccessMessage: String,
            video: Object,
            transcriptLink: String,
            mobileOrder: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    },
    data() {
      return {
        mounted: false,
      };
    },
    computed: {
      sortedBlocks() {
        const { sectionBlocks, $mq } = this;
        return $mq === 'mobile' ? sectionBlocks.sort((a, b) => a.mobileOrder - b.mobileOrder) : sectionBlocks;
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.mounted = true;
      });
    },
    methods: {
      blockTypeHandlized(block) {
        return block.type.replace('_', '-');
      },
      blockStyles(block) {
        return `background-color: ${block.backgroundColor}; color: ${block.textColor}; ${this.blockBackgroundImage(block)}`;
      },
      isImageBlock(block) {
        const { blockBackgroundImage, hasInlineImage, hasText } = this;
        return blockBackgroundImage(block) !== '' && !hasInlineImage(block) && !hasText(block);
      },
      hasInlineImage(block) {
        return block.inlineImage && block.inlineImage.src !== '';
      },
      hasText(block) {
        return block.preHeading.length + block.heading.length + block.body.length > 0;
      },
      blockBackgroundImage(block) {
        const { backgroundImage } = block;
        return backgroundImage.src ? `background-size: cover; background-position: center;` : '';
      },
      customTextColor(block) {
        return `color: ${block.textColor};`;
      },
      bodyStyles(block) {
        return `color: ${block.textColor}; max-width: ${block.contentWidth}; width: ${block.contentWidth};`;
      },
      bodyTextUnescape(text) {
        return String(text)
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"');
      },
    },
  };
</script>
