<template lang="pug">
  .container(v-if="breadcrumbs")
    ul.breadcrumbs
      li.breadcrumbs-item(v-for="(breadcrumb, index) in breadcrumbs" :key="index")
        span.breadcrumbs-item__divider(
          v-if="index > 0"
        ) /
        a.breadcrumbs-item__link(:href="breadcrumb.handle") {{ breadcrumb.title }}
</template>

<script>
  export default {
    name: 'Breadcrumbs',
    props: {
      breadcrumbs: {
        type: Array,
        default: () => [
          {
            handle: {
              type: String,
              required: true,
            },
            title: {
              type: String,
              required: true,
            },
          },
        ],
      },
    },
  };
</script>

<style lang="scss" scoped>
  .breadcrumbs {
    display: flex;
    padding: 0;
    list-style: none;

    @include mobile-only {
      display: none;
    }
    @include tablet-up {
      margin-bottom: $spacing-unit * 10;
    }
  }
  .breadcrumbs-item__divider {
    display: inline-block;
    margin: 0 ($spacing-unit * 2);
    font-size: rem(12);
    line-height: rem(24);
    letter-spacing: rem(1);
    user-select: none;
  }
  .breadcrumbs-item__link {
    display: inline-block;
    color: $color-blue-900;
    font-size: rem(12);
    line-height: rem(24);
    letter-spacing: rem(1);
    text-decoration: none;

    &:first-child {
      color: $color-grey-900;
    }

    &:hover,
    &:focus {
      color: $color--primary;
      box-shadow: none;
    }
  }
</style>
