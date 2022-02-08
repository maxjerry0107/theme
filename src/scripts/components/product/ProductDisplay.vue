<template lang="pug">
  .product-display(v-if="product")
    .product-display__wrapper
      .container.container--small-no-gutters.container--wide
        .row.collapse
          .small-12.medium-6.large-7.column.small-no-gutters
            product-images-carousel(
              :product="product"
              :medias="product.media"
              :color="currentColor"
            )
          .small-12.medium-6.large-5.column.product-display__item-column
            .product-display__itemscope(
              :class="sticky ? 'product-display__itemscope--sticky' : ''"
              itemscope
              itemtype="http://schema.org/Product"
              :itemid="`https:\/\/www.wearcommando.com\/products\/${product.handle}`"
            )
              link(
                itemprop="availability"
                :href="availability"
              )
              product-info.product-display__section-border(
                :product="product"
                :variant="currentVariant"
                :ratingSystem="ratingSystem"
              )
                template(slot="info-afterpay")
                  slot(name="display-afterpay")
              product-form-gift-card.product-display__section-border(v-if="product.type === 'Gift Card'" :product="product")
              product-form.product-display__section-border(
                v-else
                :product="product"
                :startingVariant="startingVariant"
                :finalSaleText="finalSaleText"
                :enableNotifiyMe="enableNotifiyMe"
                :notifiyMeHeading="notifiyMeHeading"
                :notifiyMeText="notifiyMeText"
                :customerEmail="customerEmail"
                :modalRef="hasSizeChart ? $refs.sizeChartModal : null"
                @currentVariantUpdated="getNewCurrentVariant"
                @selectedOptionsUpdated="getNewSelectedOptions"
              )
              modal.product-form__size-chart(
                ref="sizeChartModal"
                v-if="hasSizeChart"
              )
                slot(name="size-chart")
              accordion-group
                accordion.product-display__section-border(
                  v-if="longDescription"
                  theme="pdp"
                  heading="Product Details"
                  active-icon="close"
                  inactive-icon="plus"
                )
                  .product-display__details(
                    v-if="longDescription"
                    v-html="longDescription"
                  )
                accordion.product-display__section-border(
                  theme="pdp"
                  heading="Care + Returns"
                  active-icon="close"
                  inactive-icon="plus"
                )
                  slot(name="care-and-returns")
                accordion.product-display__section-border(
                  v-if="styledWith && styledWith.id"
                  theme="pdp"
                  heading="Styled With"
                  active-icon="close"
                  inactive-icon="plus"
                )
                  product-styled-with(
                    :product="styledWith"
                  )
              product-social-share(
                :product="product"
              )

</template>

<script>
  import ProductForm from 'scripts/components/product/ProductForm.vue';
  import ProductImagesCarousel from 'scripts/components/product/ProductImagesCarousel.vue';
  import Modal from 'scripts/components/basic/Modal.vue';
  import Icon from 'scripts/components/basic/Icon.vue';
  import AccordionGroup from 'scripts/components/basic/AccordionGroup.vue';
  import Accordion from 'scripts/components/basic/Accordion.vue';

  export default {
    name: 'ProductDisplay',
    components: {
      Accordion,
      AccordionGroup,
      Icon,
      Modal,
      ProductForm,
      ProductImagesCarousel,
      ProductInfo: () => import('scripts/components/product/ProductInfo.vue'),
      ProductFormGiftCard: () => import('scripts/components/product/ProductFormGiftCard.vue'),
      ProductSocialShare: () => import('scripts/components/product/ProductSocialShare.vue'),
      ProductStyledWith: () => import('scripts/components/product/ProductStyledWith.vue'),
    },
    props: {
      product: Object,
      styledWith: Object,
      ratingSystem: {
        type: String,
        default: 'bazaarvoice',
      },
      finalSaleText: String,
      enableNotifiyMe: {
        type: Boolean,
        default: true,
      },
      notifiyMeHeading: String,
      notifiyMeText: String,
      customerEmail: String,
      sticky: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        currentVariant: this.startingVariant || this.product.variants[0],
        currentColor: this.startingVariant ? this.startingVariant[this.colorOption] : this.product.variants[0][this.colorOption],
      };
    },
    computed: {
      availability() {
        const availabilityText = this.product.available ? 'InStock' : 'OutofStock';
        return `http://schema.org/${availabilityText}`;
      },
      longDescription() {
        const { description } = this.product;
        const descriptionArray = description.split('</p>');
        descriptionArray.shift();
        if (descriptionArray.length > 0) {
          descriptionArray[0] = descriptionArray[0].replace('<strong>Product Details&nbsp;</strong>', '');
        }
        return descriptionArray.length > 0 ? descriptionArray.join('') : '';
      },
      startingVariant() {
        // eslint-disable-next-line camelcase
        const { selected_or_first_available_variant, variants } = this.product;
        // eslint-disable-next-line camelcase
        return selected_or_first_available_variant || variants[0];
      },
      colorOptionIndex() {
        return this.product.options.findIndex((option) => /color|pattern|design/i.test(option.toLowerCase()));
      },
      colorOption() {
        const { colorOptionIndex } = this;
        return colorOptionIndex > -1 ? `option${colorOptionIndex + 1}` : null;
      },
      hasSizeChart() {
        return this.$slots['size-chart'].length && this.$slots['size-chart'][0];
      },
    },
    mounted() {
      // wait for the display to render, then initialize yotpo
      if (window.yotpo) {
        const interval = setInterval(() => {
          if (window.yotpo.initialized && this.$refs.productDisplay) {
            const api = new window.Yotpo.API(window.yotpo);
            api.refreshWidgets();
            clearInterval(interval);
          }
        }, 1000);
      }
    },
    methods: {
      getNewCurrentVariant(newValue) {
        this.currentVariant = newValue;
      },
      getNewSelectedOptions(newOptions) {
        this.currentColor = newOptions[this.colorOptionIndex];
      },
    },
  };
</script>
<style scoped lang="scss">
  .product-display {
    position: relative;
    z-index: index($layout, 'product-display');
    padding: 0 0 ($spacing-unit * 10);
    overflow: hidden;

    @include tablet-up {
      padding-bottom: $spacing-unit * 15;
      overflow: initial;
    }
  }

  .product-display__wrapper {
    position: relative;
    z-index: index($product-display, 'content');
  }

  .product-display__item-column {
    padding: 0 ($spacing-unit * 5);
    @include tablet-up {
      max-width: 552px; // 512 + padding
    }
  }

  .product-display__itemscope--sticky {
    @include tablet-up {
      position: sticky;
      top: 96px;
      z-index: index($layout, 'modal');
    }
  }

  .product-display__section-border {
    margin: 0 0 ($spacing-unit * 4);
    padding-bottom: $spacing-unit * 4;
    border-bottom: 1px solid $color-teal-700;

    &.product-form--wrapper {
      padding-bottom: $spacing-unit * 6;

      @include tablet-up {
        padding-bottom: $spacing-unit * 5;
      }
    }
  }

  .product-display__product-accordion {
    scroll-margin-top: $mobile-scroll-margin;

    @include desktop-up {
      scroll-margin-top: $desktop-scroll-margin;
    }
  }
  .product-form__size-chart {
    top: 106px;

    @include desktop-up {
      top: 96px;
    }
  }
</style>
