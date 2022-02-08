<template>
  <div class="quick-shop__drawer" v-if="product">
    <div class="quick-shop__drawer-wrapper">
      <div class="quick-shop__drawer-media">
        <div class="quick-shop__drawer-media-wrapper">
          <VueSlickCarousel
            v-bind="slickOptions"
            ref="slider"
            class="quick-shop__drawer-carousel"
            v-if="showCarousel">
            <div
              class="quick-shop__drawer-carousel-slide"
              v-for="image in product.images"
              :key="image.id">
                <img class="quick-shop__drawer-image"
                  v-lazy="image.src"
                  :alt="image.alt"
                />
            </div>
          </VueSlickCarousel>
          <img class="quick-shop__drawer-image" v-else-if="image"
            v-lazy="image.src"
            :alt="image.alt"
          />
          <div class="quick-shop__drawer-arrows">
            <v-button
              icon="arrow-long-left-btn"
              class="quick-shop__arrow-left"
              @click="prevSlide"
            />
            <v-button
              icon="arrow-long-right-btn"
              class="quick-shop__arrow-left"
              @click="nextSlide"
            />
          </div>
        </div>
      </div>
      <div class="quick-shop__drawer-swatches" v-if="swatches">
        <v-button
          class="quick-shop__swatch"
          v-for="(swatch, index) in swatches"
          :style="swatch.style"
          :key="swatch.color"
          :class="{'quick-shop__swatch--selected': swatch.color === selectedSwatch}"
          @click="selectSwatch(swatch.color)"
        />
      </div>
      <div class="quick-shop__drawer-size-wrapper">
        <span class="quick-shop__drawer-header">Select a Size</span>
        <div class="quick-shop__drawer-sizes" v-if="variantSizes">
          <v-button
            v-for="variant in variantSizes"
            :key="variant.id"
            class="button quick-shop__size-select-btn"
            :class="{ 'active': selectedSize && selectedSize === variant.option1 }"
            :label="variant.option1"
            :disabled="variant.remaining_quantity < 1"
            @click="selectVariantSize(variant)"
          />
        </div>
        <v-button
        class="quick-shop__drawer-atc"
        primary
        full
        :label="selectedSize ? 'Add To Cart' : 'Select A Size'"
        :disabled="!availableSelectedSize"
        @click="addToCart"
      />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { getSizedImageUrl } from 'scripts/helpers/images.js';
  import VButton from 'scripts/components/buttons/VButton.vue';
  import VueSlickCarousel from 'vue-slick-carousel';

  export default {
    name: 'QuickShop',
    components: { VButton, VueSlickCarousel },
    props: {
      product: Object,
      swatches: Array,
    },
    data() {
      return {
        selectedSwatch: this.initialSwatch,
        selectedSize: '',
        selectedVariant: null,
        slickOptions: {
          arrows: false,
          dots: false,
        },
      };
    },
    computed: {
      ...mapState({
        cart: (state) => state.cart,
      }),
      showCarousel() {
        if (!this.product.images && this.product.images.length < 2) return false;
        return true;
      },
      image() {
        if (this.product) {
          const images = this.product.images && this.product.images.length > 0;

          if (!images) return null;

          return {
            src: getSizedImageUrl(this.product.images[0].src, '350x'),
            alt: this.product.images[0].alt,
          };
        }
        return null;
      },
      initialSwatch() {
        if (this.swatches && this.swatches.length > 1) {
          return this.swatches[0].color;
        }
        return null;
      },
      variantSizes() {
        if (this.selectedSwatch) {
          return this.product.variants.filter((variant) => {
            return variant.option2 === this.selectedSwatch;
          });
        }
        return null;
      },
      availableSelectedSize() {
        if (!this.selectedSize) return false;
        if (this.selectedSize.remaining_quantity < 1) return false;
        return true;
      },
    },
    mounted() {},
    methods: {
      selectSwatch(color) {
        this.selectedSwatch = color;
        this.selectedSize = null;
        this.selectedVariant = null;
      },
      selectVariantSize(variant) {
        this.selectedSize = variant.option1;
        this.selectedVariant = variant.id;
      },
      nextSlide() {
        this.$refs.slider.next();
      },
      prevSlide() {
        this.$refs.slider.prev();
      },
      async addToCart() {
        const $this = this;
        const extraProperties = {};

        await $this.$store.dispatch('cart/addItem', {
          quantity: 1,
          id: this.selectedVariant,
          properties: extraProperties,
        });

        await $this.$emit('closeQuickShop');
        await $this.$store.dispatch('cart/openSidecart');
      },
    },
  };
</script>
