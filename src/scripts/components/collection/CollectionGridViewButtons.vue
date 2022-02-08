<template lang="pug">
  .collection-grid-view-buttons
    button-component.button--icon.collection-grid-view-button(
      :class="{'collection-grid-view-button--active' : button1Active}"
      @click="selectGridView(1)"
    )
      .u-sr-only 1-Column Grid View
      icon(
        :name="$mq === 'mobile' ? 'grid-1' : 'grid-4'"
        class="button__icon"
        size="26px"
      )
    button-component.button--icon.collection-grid-view-button(
      :class="{'collection-grid-view-button--active' : button2Active}"
      @click="selectGridView(2)"
    )
      .u-sr-only 2-Column Grid View
      icon(
        :name="$mq === 'mobile' ? 'grid-2' : 'grid-3'"
        class="button__icon"
        size="26px"
      )
</template>

<script>
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'CollectionGridViewButtons',
    components: {
      ButtonComponent,
      Icon,
    },
    props: {},
    data() {
      return {
        button1Active: true,
        button2Active: false,
      };
    },
    computed: {
      isMobile() {
        return ['mobile', 'tablet'].includes(this.$mq);
      },
    },
    mounted() {
      if (this.isMobile) {
        this.selectGridView(2);
      }
    },
    methods: {
      selectGridView(gridView) {
        this.button1Active = gridView === 1;
        this.button2Active = gridView === 2;
        this.$emit('grid-view-updated', gridView);
      },
    },
  };
</script>

<style scoped lang="scss">
  .collection-grid-view-buttons {
    display: flex;
  }

  .collection-grid-view-button {
    margin-left: $spacing-unit * 3;

    &:first-child {
      margin-left: $spacing-unit * 5;
    }

    /deep/ svg {
      fill: $color-grey-900;
    }
  }

  .collection-grid-view-button--active {
    /deep/ svg {
      fill: $color-black;
    }
  }
</style>
