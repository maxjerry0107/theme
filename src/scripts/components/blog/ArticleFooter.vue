<template lang="pug">
  .article-footer
    .article-footer__container.container--wide
      h2.article-footer__heading(v-if="heading") {{ heading }}
      h3.article-footer__sub-heading(v-if="adminWarningOrSubHeading") {{ adminWarningOrSubHeading }}
      .article-footer__content.row(
        :is="$mq === 'mobile' ? 'carousel' : 'div'"
        dots
      )
        .article-footer__article.column.small-4.medium-4(
          v-for="(article, index) in filteredRelatedArticles"
          :is="$mq === 'mobile' ? 'slide' : 'div'"
          :key="`article-footer_${article.id}_article${index}`"
          :index="index"
        )
          a.article-footer__article-link(:href="article.url")
            div.article-footer__article-image__wrap
              picture
                source(media="(min-width:650px)" :srcset="imageFilter(article.image.src, '500x')")
                img.article-footer__article-image(
                  :src="imageFilter(article.image.src, '300x')"
                  :alt="article.image.alt"
                )
            h4.article-footer__article-title {{ article.title }}
            .article__header-date {{ article.created_at }} 
            button-component.button--link(
              :href="article.url"
            ) {{ buttonText }}
</template>

<script>
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';
  import Carousel from 'scripts/components/basic/Carousel.vue';
  import Slide from 'scripts/components/basic/Slide.vue';
  import { getSizedImageUrl } from 'scripts/helpers/images.js';

  export default {
    name: 'ArticleFooter',
    components: {
      ButtonComponent,
      Carousel,
      Slide,
    },
    props: {
      heading: {
        type: String,
        default: '',
      },
      subHeading: {
        type: String,
        default: '',
      },
      relatedArticles: {
        type: Array,
        default() {
          return [];
        },
      },
      buttonText: {
        type: String,
        default: 'Read More',
      },
    },
    computed: {
      filteredRelatedArticles() {
        return this.relatedArticles.filter((article) => article.id !== 0);
      },
      relatedAndFilteredSameSize() {
        return this.relatedArticles.length === this.filteredRelatedArticles.length;
      },
      adminWarningOrSubHeading() {
        // eslint-disable-next-line no-nested-ternary
        return this.relatedAndFilteredSameSize ? this.subHeading : window.Shopify.designMode ? 'Some articles article handles are not correct.' : '';
      },
    },
    methods: {
      imageFilter(image, size) {
        return getSizedImageUrl(image, size);
      },
    },
  };
</script>
