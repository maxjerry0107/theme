<template lang="pug">
  section.grid-collections.container.container--wide.cv--auto.animation--fade-in
    .row.collapse(
      v-if="heading"
    )
      .column.no-gutters.small-12
        h2.heading--2.text-align--center.grid-collections__heading(
          v-if="heading"
        ) {{ heading }}
        p.heading--7.text-align--center.grid-collections__sub-heading(
          v-if="subHeading"
        ) {{ subHeading }}
    .row.collapse(
      v-if="collections.length > 0"
    )
      .column.small-no-gutters.grid-collection__item(
        v-for="(collection, index) in collections"
        :key="index"
        :class="columnSize"
      )
        grid-tile(:collection="collection")
</template>

<script>
  import GridTile from 'scripts/components/sections/GridTile.vue';

  export default {
    name: 'GridCollection',
    components: {
      GridTile,
    },
    props: {
      heading: String,
      subHeading: String,
      collections: {
        type: Array,
        default: () => [],
      },
    },
    computed: {
      columnSize() {
        const gridSize = 12;
        const colmunSize = gridSize / this.collections.length;
        return `small-${gridSize} medium-${colmunSize}`;
      },
    },
  };
</script>
