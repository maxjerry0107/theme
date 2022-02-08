<template lang="pug">
  .product-tile.u-no-link(:class="tileClass", :style="`--tileAspectRatio: ${aspectRatio}%; background-color: ${tileColor}`")
    .product-tile__media(
      v-if="image"
    )
      .product-tile__media-wrapper(
        :class="hasHover"
      )
        img.product-tile__image.product-tile__image--default(
          v-lazy="image.src"
          :alt="image.alt"
        )
        img.product-tile__image.product-tile__image--hover(
          v-if="hoverImage && hasHover !== ''"
          v-lazy="hoverImage.src"
          :alt="hoverImage.alt"
        )
        .product-tile__badges(v-if="productBadges.length")
          .product-tile__badge(v-for="(badge, index) in productBadges")
            .product-tile__badge__text {{ badge | unhandleize }}
      v-button.product-tile__quick-shop-btn(
        icon="quick-shop"
        iconSize="40px"
        @click="toggleQuickShop"
      )
      .product-tile__quick-shop(
        v-if="!isMobile"
        :class="{ 'show': showQuickShop }"
      )
        .product-quick-shop__wrapper
          .product-quick-shop__header
            p.product-quick-shop__title.body-base Select a Size
            v-button.product-quick-shop__close-btn(
              icon="close"
              iconSize="14px"
              @click="toggleQuickShop"
            )
          .product-quick-shop__sizes
            v-button.button.product-quick-shop__size-btn(
              :class="{ 'active': selectedSize && selectedSize.option1 === size.option1 }"
              v-for="size in quickShopSizes"
              :key="size.id"
              :label="size.option1"
              :disabled="size.remaining_quantity < 1"
              @click="selectVariantSize(size)"
            )
          v-button.product-quick-shop__atc-btn(
            primary
            full
            :label="selectedSize ? 'Add To Cart' : 'Select A Size'"
            :disabled="!availableSelectedSize"
            @click="addToCart"
          )

    .product-tile__swatches(v-if="showSwatches")
      button-component.product-tile__swatch(
        v-for="(swatch, index) in swatches"
        :style="swatch.style"
        :key="swatch.color"
        :class="{'product-tile__swatch--selected': swatch.color === selectedSwatch}"
        @click="selectSwatch(swatch.color)"
      )
        span.u-sr-only {{ swatch.color }}

    a.product-tile__details(:href="product.url")
      h3.product-tile__title.heading--7 {{ product.title }}

    a.product-tile__pricing(
      v-if="showPrice && product.price"
      :href="product.url"
    )
      p.product-tile__price(
        v-if="isOnSale"
      )
        span.product-tile__price__original {{ comparePrice | moneyWithoutDecimals }}
        span.product-tile__price__sale {{ product.price | moneyWithoutDecimals }}
      p.product-tile__price(v-else) {{ product.price | moneyWithoutDecimals }}

</template>

<script>
  import { mapState } from 'vuex';
  import { getProductBadges } from 'scripts/helpers/tags.js';
  import { getSizedImageUrl } from 'scripts/helpers/images.js';

  import VButton from 'scripts/components/buttons/VButton.vue';
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';

  export default {
    name: 'ProductTile',
    components: { ButtonComponent, VButton },
    props: {
      product: Object,
      productImageSize: {
        type: String,
        default: '450x',
      },
      disableHover: {
        type: Boolean,
        default: false,
      },
      horizontal: {
        type: Boolean,
        default: false,
      },
      tileColor: String,
      showSwatches: {
        type: Boolean,
        default: false,
      },
      showPrice: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        selectedSwatch: this.product.selected_or_first_available_variant.option2,
        showQuickShop: false,
        selectedSize: null,
      };
    },
    computed: {
      ...mapState({
        cart: (state) => state.cart,
      }),
      aspectRatio() {
        if (this.product.media[0]) {
          return (this.product.media[0].height / this.product.media[0].width) * 100;
        }
        return null;
      },
      tileClass() {
        return {
          'disable-hover': this.disableHover,
          'product-tile--horizontal': this.horizontal,
        };
      },
      image() {
        if (this.selectedSwatch) {
          const mainImage = this.getImageFromVariant();

          if (mainImage) {
            return {
              src: getSizedImageUrl(mainImage.src, this.productImageSize),
              alt: mainImage.alt,
              id: mainImage.id,
            };
          }
        }
        return this.getImageFromIndex(0);
      },
      hoverImage() {
        if (this.selectedSwatch) {
          const hoverImage = this.getHoverImage();

          if (hoverImage) {
            return {
              src: getSizedImageUrl(hoverImage.src, this.productImageSize),
              alt: hoverImage.alt,
            };
          }
        }
        return this.getImageFromIndex(1);
      },
      hasHover() {
        return this.hoverImage && !this.disableHover ? 'product-tile__media--has-hover' : '';
      },
      swatches() {
        let colors = this.product.variants.map((variant) => {
          return variant.option2;
        });

        colors = [...new Set(colors)];

        return colors.map((color) => {
          const variantObj = this.product.variants.find((obj) => {
            return obj.option2 === color;
          });
          const swatchSrc = getSizedImageUrl(variantObj.image.src, '40x');
          return {
            color,
            style: `background-image: url(${swatchSrc});`,
          };
        });
      },
      quickShopSizes() {
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
      productBadges() {
        return getProductBadges(this.product.tags);
      },
      comparePrice() {
        const price = this.product.variants && this.product.variants.length > 0 ? this.product.variants[0].compare_at_price : null;
        return !Number.isNaN(price) ? price : this.product.price;
      },
      isOnSale() {
        return this.comparePrice > this.product.price;
      },
      isMobile() {
        return ['mobile', 'tablet'].includes(this.$mq);
      },
    },
    mounted() {
      this.selectedSwatch = this.swatches[0].color;
    },
    methods: {
      selectSwatch(color) {
        this.selectedSwatch = color;
        this.selectedSize = null;
      },
      selectVariantSize(size) {
        this.selectedSize = size;
      },
      toggleQuickShop() {
        if (this.isMobile) {
          this.$emit('toggleMobileQuickShop', this.product, this.swatches);
        } else if (this.showQuickShop) {
          this.showQuickShop = false;
          this.selectedSize = null;
        } else {
          this.showQuickShop = !this.showQuickShop;
        }
      },
      getImageFromIndex(index = 0) {
        const image = this.product.images && this.product.images.length > index ? this.product.images[index] : null;

        if (!image) return null;

        return {
          src: getSizedImageUrl(image.src, this.productImageSize),
          alt: image.alt,
        };
      },
      getImageFromVariant() {
        const variant = this.product.variants.find((obj) => {
          return obj.option2 === this.selectedSwatch;
        });
        return {
          id: variant.image.id,
          alt: variant.image.alt,
          src: variant.image.src,
        };
      },
      getHoverImage() {
        if (this.image) {
          const hoverImage = this.product.images.find((obj) => {
            return !obj.id === this.image.id;
          });

          return hoverImage;
        }
        return null;
      },
      async addToCart() {
        const $this = this;
        const extraProperties = {};

        await $this.$store.dispatch('cart/addItem', {
          quantity: 1,
          id: this.selectedSize.id,
          properties: extraProperties,
        });

        await $this.toggleQuickShop();
        await $this.$store.dispatch('cart/openSidecart');
      },
    },
  };
</script>
