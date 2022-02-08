<template lang="pug">
  .collection-grid(
    v-if="collection"
    ref="container"
  )
    .collection-grid__inner-wrapper
      .collection-grid__header
        .collection-grid__actions
          button-component.button--icon.collection-grid__filter-button(
            @click="activeModalAction = 'filters'; $refs.actionsModal.open()"
          ) Filter + Sort
            icon(
              name="filters"
              class="button__icon"
              size="18px"
            )

          p.collection-grid__product-count(:class="{'collection-grid__product-count--hide': fetching}") {{ productCountLabel }}
      .collection-grid__desktop-filters
        .collection-grid__desktop-filter-wrapper
          span.collection-grid__filter-header
            p.collection-grid__filter-title Filter by:
            button.collection-grid__clear-filters-button(
              v-if="allSelectedFilters.length > 0"
              @click="clearAllFilters"
            ) Clear All
          .collection-grid__filters-list
            .collection-grid__selected-filter(
              v-for="filter in allSelectedFilters"
              :key="filter"
            )
              span.collection-grid__selected-filter-text {{ filter }}
              icon-button.collection-grid__selected-filter-remove(
                :label="`Remove ${filter} filter`"
                icon="close"
                size="12px"
                @click="removeFilter(filter)"
              )
          accordion.collection-grid__filter-accordion(
            v-for="(filter) in Object.keys(filters)"
            v-if="filters[filter].options.length > 0"
            :key="filter"
            :heading="filterHeading(filter)"
            activeIcon="minus"
            inactiveIcon="plus"
            iconSize="32px"
          )
            label.collection-grid__option.checkbox-input(
              v-for="(option) in filters[filter].options"
            )
              input.checkbox-input__input(type="checkbox" :value="option" v-model="filters[filter].selected" @click="clearPromo()")
              span.checkbox-input__checkbox
                icon.checkbox-input__check(
                  name="check-white"
                  size="8px"
                )
              span.collection-grid__option-text.checkbox-input__label-text {{ option }}
      .collection-grid__grid(
          v-if="productsWithTile"
          ref="grid"
          v-scroll-lock="lockScroll"
        )
        .collection-grid__grid-header(v-if="!isMobile")
          p.collection-grid__product-count(:class="{'collection-grid__product-count--hide': fetching}") {{ productCountLabel }}
          label.collection-grid__sort-select
            span.collection-grid__sort-select-text Sort By:
            select.collection-grid__sort-select-input(
              v-model="currentSortMethod"
            )
              option(
                v-for="(option) in sortingOptions"
                :key="option.value"
                :value="option.value"
              ) {{ option.label }}
        .collection-grid__filters-list
          button.collection-grid__clear-filters-button(
            v-if="allSelectedFilters.length > 0"
            @click="clearAllFilters"
          ) Clear All
          .collection-grid__selected-filter(
            v-for="filter in allSelectedFilters"
            :key="filter"
          )
            span.collection-grid__selected-filter-text {{ filter }}
            icon-button.collection-grid__selected-filter-remove(
              :label="`Remove ${filter} filter`"
              icon="close"
              size="12px"
              @click="removeFilter(filter)"
            )
        transition-group(
          v-if="collection"
          name="grid-sort-animation"
          tag="div"
          :class="`row collapse small-up-${mobileGrid} medium-up-${desktopGrid}`"
        )
          .column.collection-grid__column(
            v-for="item in productsWithTile.slice(0, this.currentProductsPerPage)",
            :key="(item.tileType === 'product') ? item.id : 'cta'",
            :class="{ 'column-2x': item.tileType === 'cta' }"
          )
            product-tile(
              v-if="item.tileType === 'product'"
              :product="item"
              :tile-color="tileColor"
              show-price
              show-swatches
              @toggleMobileQuickShop="openMobileQuickShop"
            )
            cta-tile(v-else-if="item.tileType === 'cta' && item.backgroundImage"
              :title="item.title"
              :description="item.description"
              :btn-text="item.btnText"
              :btn-link="item.btnUrl"
              :background-image="item.backgroundImage"
              :overlay-opacity="item.overlayOpacity"
            )
        .collection-grid__load-more(
          v-if="currentPageProducts.length"
          v-observe-visibility="handleScrollBottom"
        )
      modal.collection-grid__actions-modal(
        ref="actionsModal"
      )
        template(slot="content")
          .collection-grid__mobile-filter-menu
            h3.collection-grid__mobile-filter-menu-title Filter / Sort By
            .collection-grid__mobile-active-filters(v-if="allSelectedFilters.length")
              .collection-grid__selected-filter(
                v-for="filter in allSelectedFilters"
                :key="filter"
              )
                span.collection-grid__selected-filter-text {{ filter }}
                icon-button.collection-grid__selected-filter-remove(
                  :label="`Remove ${filter} filter`"
                  icon="close"
                  size="12px"
                  @click="removeFilter(filter)"
                )
            .collection-grid__mobile-filter-menu-filters
              accordion.collection-grid__filter-accordion(
                heading="Sort By"
                iconSize="32px"
              )
                button.collection-grid__mobile-sort-menu-item(
                  v-for="(option, index) in sortingOptions"
                  :key="`${option.label}__${index}`"
                  @click="currentSortMethod = option.value; $refs.actionsModal.close();"
                ) {{ option.label }}
              accordion.collection-grid__filter-accordion(
                v-for="(filter) in Object.keys(filters)"
                v-if="filters[filter].options.length > 0"
                :key="filter"
                :heading="filterHeading(filter)"
                iconSize="32px"
              )
                label.collection-grid__option.checkbox-input(
                  v-for="(option) in filters[filter].options"
                )
                  input.checkbox-input__input(type="checkbox" :value="option" v-model="filters[filter].selected")
                  span.checkbox-input__checkbox
                    icon.checkbox-input__check(
                      name="check-white"
                      size="8px"
                    )
                  span.collection-grid__option-text.checkbox-input__label-text {{ option }}
            .collection-grid__mobile-filters-menu-actions
              v-button.collection-grid__mobile-filters-menu-clear(
                secondary
                label="Clear Filters"
                @click="clearAllFilters"
              )
              v-button.collection-grid__mobile-filters-menu-apply(
                primary
                label="Apply"
                @click="$refs.actionsModal.close(); clearPromo()"
              )
      modal.collection-quick__shop-modal(
        ref="quickShopModal"
        v-if="isMobile"
        @close="closeQuickShop"
      )
        template(slot="content")
          .collection-grid__mobile-quick-shop
            quick-shop(
              :product="quickShopProduct"
              :swatches="quickShopSwatches"
              @closeQuickShop="closeQuickShop"
              v-scroll-lock="mobileQuickShop"
            )
</template>

<script>
  import { sortProductsBy } from 'scripts/helpers/sort.js';
  import { getFilter } from 'scripts/helpers/tags.js';
  import storeCollection from 'scripts/mixins/storeCollection.js';

  import Pagination from 'scripts/components/basic/Pagination.vue';
  import CtaTile from 'scripts/components/collection/CtaTile.vue';
  import ProductTile from 'scripts/components/product/ProductTile.vue';
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';
  import Modal from 'scripts/components/basic/Modal.vue';
  import Accordion from 'scripts/components/basic/Accordion.vue';
  import Icon from 'scripts/components/basic/Icon.vue';
  import IconButton from 'scripts/components/buttons/IconButton.vue';
  import VButton from 'scripts/components/buttons/VButton.vue';
  import QuickShop from 'scripts/components/sections/QuickShopDrawer.vue';

  export default {
    name: 'CollectionGrid',
    components: {
      Pagination,
      CtaTile,
      ProductTile,
      ButtonComponent,
      Modal,
      Accordion,
      Icon,
      IconButton,
      VButton,
      QuickShop,
    },
    mixins: [storeCollection],
    props: {
      cta: Object,
      preloadedCollection: Object,
      tileColor: String,
      productsPerPage: {
        type: Number,
        default: 24,
      },
      promoTile: String,
    },
    data() {
      return {
        lockScroll: false,
        currentPage: 1,
        currentProductsPerPage: this.productsPerPage || 24,
        fetching: true,
        activeModalAction: 'filters',
        currentSortMethod: 'featured',
        sortingOptions: [
          { label: 'Featured', value: 'featured' },
          { label: 'Price: Low to High', value: 'priceAsc' },
          { label: 'Price: High to Low', value: 'priceDesc' },
          { label: 'Alphabetical: A-Z', value: 'alphabetically' },
          { label: 'Alphabetical: Z-A', value: 'alphabeticallyReverse' },
        ],
        filters: {
          'Product Type': {
            title: 'Product Type',
            options: [],
            selected: [],
          },
          Seasonal: {
            title: 'Seasonal',
            options: ['Christmas', 'Thanksgiving', 'New Years Eve'],
            selected: [],
          },
          Size: {
            options: [],
            selected: [],
          },
          Color: {
            title: 'Color',
            options: [],
            selected: [],
          },
          Price: {
            title: 'Price',
            options: ['$0 - $24', '$25 - $49'],
            selected: [],
          },
        },
        gridView: 1,
        mobileQuickShop: false,
        quickShopProduct: null,
        quickShopSwatches: null,
        sortActive: false,
      };
    },
    computed: {
      sortedProducts() {
        return [...this.collection.products].sort(sortProductsBy(this.currentSortMethod)).map((product) => {
          return { ...product, tileType: 'product' };
        });
      },
      filteredProducts() {
        let filteredArr = [...this.sortedProducts];

        Object.keys(this.filters).forEach((filterType) => {
          const selectedFilters = this.filters[filterType].selected;

          if (selectedFilters.length > 0) {
            filteredArr = filteredArr.filter((product) => {
              const optionsTag = getFilter(product.tags, filterType);
              const options = optionsTag.length > 0 ? optionsTag : [];

              if (filterType === 'Product Type') {
                return selectedFilters.includes(product.type);
              }

              if (filterType === 'Seasonal') {
                const filterFound = product.tags.filter((tag) => {
                  const tagLower = tag.toLowerCase();
                  selectedFilters.includes(tagLower);
                });
                return filterFound.length > 0;
              }

              if (filterType === 'Color') {
                const whichOption = product.options.indexOf('Color');
                const filterFound = product.variants.filter((variant) => selectedFilters.includes(variant[`option${whichOption + 1}`]));
                return filterFound.length > 0;
              }

              if (filterType === 'Size') {
                const whichOption = product.options.indexOf('Size');
                const filterFound = product.variants.filter((variant) => selectedFilters.includes(variant[`option${whichOption + 1}`]));
                return filterFound.length > 0;
              }

              return selectedFilters.some((filter) => options.includes(filter));
            });
          }
        });

        return filteredArr;
      },
      productsWithTile() {
        const filteredArr = [...this.filteredProducts];

        if (this.cta) {
          if (filteredArr.length < this.cta.position) {
            filteredArr.push(this.cta);
          } else {
            filteredArr.splice(this.cta.position - 1, 0, this.cta);
          }
        }

        return filteredArr;
      },
      productsByPage() {
        const productsByPage = [];
        let page = 0;
        let startingProductIndexForPage = 0;

        for (page; page <= this.numPages; page += 1) {
          productsByPage[page] = this.productsWithTile.slice(startingProductIndexForPage, startingProductIndexForPage + this.productsPerPage);

          startingProductIndexForPage += this.productsPerPage;
        }

        return productsByPage;
      },
      currentPageProducts() {
        return this.productsByPage[this.currentPage - 1];
      },
      productCountLabel() {
        return `${this.filteredProducts.length} items`;
      },
      allSelectedFilters() {
        let allSelectedFilters = [];

        Object.keys(this.filters).forEach((filterType) => {
          allSelectedFilters = allSelectedFilters.concat(this.filters[filterType].selected);
        });

        return allSelectedFilters;
      },
      sortButtonLabel() {
        const currentSortOption = this.sortingOptions.find((option) => option.value === this.currentSortMethod);
        return `Sort: ${currentSortOption.label}`;
      },
      numPages() {
        return Math.ceil(this.sortedProducts.length / this.productsPerPage);
      },
      maxProductIndex() {
        return this.currentPage * this.productsPerPage;
      },
      minProductIndex() {
        return this.maxProductIndex - this.productsPerPage + 1;
      },
      mobileGrid() {
        return this.gridView === 1 ? 2 : 2;
      },
      desktopGrid() {
        return this.gridView === 1 ? 3 : 3;
      },
      isMobile() {
        return ['mobile', 'tablet'].includes(this.$mq);
      },
      promoTilePosition() {
        if (this.$mq === 'tablet') {
          return 4;
        }
        if (this.isMobile) {
          return 2;
        }
        return 4;
      },
      promoTileContent() {
        return JSON.parse(this.promoTile);
      },
    },
    watch: {
      collection() {
        const filterTypes = Object.keys(this.filters);

        this.collection.products.forEach((product) => {
          if (product.type && !this.filters['Product Type'].options.includes(product.type)) {
            this.filters['Product Type'].options.push(product.type);
          }

          if (product.options.includes('Color')) {
            const whichOption = product.options.indexOf('Color');
            product.variants.forEach((variant) => {
              const color = variant[`option${whichOption + 1}`];
              if (color && !this.filters.Color.options.includes(color)) {
                this.filters.Color.options.push(color);
              }
            });
          }

          if (product.options.includes('Size')) {
            const whichOption = product.options.indexOf('Size');
            product.variants.forEach((variant) => {
              const size = variant[`option${whichOption + 1}`];
              if (size && !this.filters.Size.options.includes(size)) {
                this.filters.Size.options.push(size);
              }
            });
          }

          filterTypes.forEach((filterType) => {
            const options = getFilter(product.tags, filterType);
            if (options.length > 0 && filterType !== 'Size') {
              this.filters[filterType].options = [...new Set([...this.filters[filterType].options, ...options])];
            }
          });
        });
      },
      currentSortMethod() {
        this.clearPromo();
      },
      filters() {
        this.clearPromo();
      },
    },
    mounted() {
      window.addEventListener('load', () => {
        if (this.promoTileContent && this.promoTileContent.image !== null && this.promoTileContent.image !== '') {
          this.populatePromo();
        }
      });
    },
    methods: {
      handleScrollBottom(isVisible) {
        if (!isVisible) {
          return;
        }

        this.lockScroll = true;

        if (this.currentPage < this.productsByPage.length - 1) {
          const nextPageSize = this.productsByPage[this.currentPage].length;
          this.currentProductsPerPage += nextPageSize;
        }

        setTimeout(() => {
          this.lockScroll = false;
          this.currentPage++;
        }, 1500);
      },
      setGridView(gridView) {
        this.gridView = gridView;
      },
      removeFilter(filterName) {
        const filterTypes = Object.keys(this.filters);

        filterTypes.forEach((filterType) => {
          const filterIndex = this.filters[filterType].selected.indexOf(filterName);

          if (filterIndex !== -1) {
            this.filters[filterType].selected.splice(filterIndex, 1);
          }
        });
      },
      clearAllFilters() {
        const filterTypes = Object.keys(this.filters);

        filterTypes.forEach((filterType) => {
          this.filters[filterType].selected = [];
        });

        this.clearPromo();
      },
      filterHeading(filter) {
        const filterHasValues = this.filters[filter].selected.length > 0;
        const filterTitle = this.filters[filter].title || filter;

        return `${filterTitle}${filterHasValues ? ` (${this.filters[filter].selected.length})` : ''}`;
      },
      doneFetching() {
        this.fetching = false;
      },
      openMobileQuickShop(product, swatches) {
        this.mobileQuickShop = true;
        this.quickShopProduct = product;
        this.quickShopSwatches = swatches;
        this.$refs.quickShopModal.open();
      },
      closeQuickShop() {
        this.$refs.quickShopModal.close();
        this.mobileQuickShop = false;
        this.quickShopProduct = null;
        this.quickShopSwatches = null;
      },
      populatePromo() {
        if (!this.sortActive) {
          setTimeout(() => {
            document.querySelector(`div.collection-grid__inner-wrapper > div.collection-grid__grid > div.row.collapse.small-up-2.medium-up-3 > div:nth-child(${this.promoTilePosition})`).insertAdjacentHTML("afterend", `
              <div class="column collection-grid__column promo">
                <div class="collection-grid__promo-tile">
                  <div class="collection-grid__promo-media">
                    <img class="collection-grid__promo-block-image"
                      src="${this.promoTileContent.promo_tile_image}"
                      alt="${this.promoTileContent.promo_tile_title}"
                    />
                    <span class="collection-grid__promo-badge">
                      ${this.promoTileContent.promo_tile_badge_text}
                    </span>
                  </div>
                  <div class="collection-grid__promo-wrapper">
                    <h6 class="collection-grid__promo-block-title color-white">
                      ${this.promoTileContent.promo_tile_title || ''}
                    </h6>
                    <div class="collection-grid__promo-content body--small color-white">
                      ${this.promoTileContent.promo_tile_desc || ''}
                    </div>
                    <a class="link link--primary collection-grid__promo-link"
                    href="${this.promoTileContent.promo_tile_cta_url || ''}">
                      ${this.promoTileContent.promo_tile_cta_text || ''}
                    </a>
                    <a class="button button--primary collection-grid__promo-btn">
                      ${this.promoTileContent.promo_tile_cta_text || ''}
                    </a>
                  </div>
                </div>
              </div>
            `,
            );
          }, 1000);
        }
      },
      clearPromo() {
        document.querySelectorAll('.collection-grid__column.promo').forEach(e => e.remove());

        setTimeout(() => {
          this.populatePromo();
        }, 700);
      },
    },
  };
</script>
