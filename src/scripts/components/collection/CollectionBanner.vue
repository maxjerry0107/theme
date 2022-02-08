<template lang="pug">
  .collection-banner(:style="backgroundImage")
    .collection-banner__content
      h1.collection-banner__title {{ title }}
      p.collection-banner__description(v-if="description") {{ description }}
</template>

<script>
  export default {
    name: 'CollectionBanner',
    props: {
      title: String,
      description: String,
      image: String,
    },
    computed: {
      backgroundImage() {
        return {
          'background-image': `url(${this.image})`,
        };
      },
    },
  };
</script>

<style scoped lang="scss"></style>
