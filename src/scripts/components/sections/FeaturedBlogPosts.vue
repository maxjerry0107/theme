<template lang="pug">
  .featured-blog-posts.cv--auto
    .featured-blog-posts__container.container--wide
      h2.featured-blog-posts__heading(v-if="settings.heading") {{ settings.heading }}
      h3.featured-blog-posts__sub-heading(v-if="settings.subHeading") {{ settings.subHeading }}
      .featured-blog-posts__content.row(
        :is="$mq === 'mobile' ? 'carousel' : 'div'"
        dots
      )
        .featured-blog-post.column.small-12.medium-4(
          :is="$mq === 'mobile' ? 'slide' : 'div'"
          v-for="(post, index) in settings.posts"
          :key="`featured-blog-posts_${_uid}_post${index}`"
        )
          picture
            source(media="(max-width:649px)" :srcset="post.mobileImage")
            img.featured-blog-post__image(:src="post.desktopImage" :alt="post.imageAltText")
          h4.featured-blog-post__title {{ post.title }}
          p.featured-blog-post__text(v-if="post.text") {{ post.text }}
          button-component.button--link.featured-blog-post__link(:href="post.url") {{ post.ctaText }}
</template>

<script>
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';
  import Carousel from 'scripts/components/basic/Carousel.vue';
  import Slide from 'scripts/components/basic/Slide.vue';

  export default {
    name: 'FeaturedBlogPosts',
    components: {
      ButtonComponent,
      Carousel,
      Slide
    },
    props: {
      settings: Object
    }
  }
</script>
