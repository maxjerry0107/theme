<template lang="pug">
  svg(:class="iconClass", :style="iconStyle")
    use(xmlns:xlink="http://www.w3.org/1999/xlink", :xlink:href="iconName")
</template>

<script>
  export default {
    name: 'Icon',
    props: {
      name: String,
      size: {
        type: String,
        default: '24px',
      },
      width: String,
      height: String,
    },
    computed: {
      iconClass() {
        const iconClass = { icon: true };

        iconClass[`icon--${this.name}`] = true;

        return iconClass;
      },
      iconStyle() {
        return {
          height: this.height || this.size,
          width: this.width || this.size,
        };
      },
      iconName() {
        return `#${this.name}`;
      },
    },
  };
</script>
