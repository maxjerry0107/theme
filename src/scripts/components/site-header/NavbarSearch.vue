<template lang="pug">
  form.navbar-search(
    :class="{'navbar-search--hidden': !mounted }"
    :action="formAction"
  )
    .navbar-search__wrapper
      .text-input.text-input--full-width.navbar-search__field
        label.text-input__label.u-sr-only(
          for="search-input"
        ) Search
        button-component.button--icon.navbar-search__submit(
          type="submit"
          title="Search Submit"
          role="button"
        )
          .u-sr-only Search
          icon.button__icon(
            name="search"
            size="18px"
          )
        input.text-input__input(
          aria-label="Search",
          type="text",
          ref="input",
          name="q",
          v-model="searchValue",
          :placeholder="searchPlaceholder",
          @keydown.tab="tab",
          @focus="onFocus",
          @blur="blur"
        )
      p.u-sr-only(
        id="FindifyAutocompleteDescription"
      ) Site search. Use up and down arrow keys to view suggested search results. Press enter for full results page.
</template>

<script>
  import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';
  import TextInput from 'scripts/components/forms/TextInput.vue';
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'NavbarSearch',
    components: {
      ButtonComponent,
      TextInput,
      Icon,
    },
    props: {
      formAction: {
        type: String,
        default: '/search',
      },
      value: String,
      placeholder: {
        type: String,
        default: 'Search products',
      },
    },
    data() {
      return {
        searchValue: this.value,
        tabbingOut: false,
        mounted: false,
      };
    },
    computed: {
      searchPlaceholder() {
        return this.$mq === 'tablet' ? 'Search' : this.placeholder;
      },
    },
    watch: {
      searchValue() {
        this.$emit('input', this.searchValue);
      },
    },
    mounted() {
      this.mounted = true;

      this.$nextTick(() => {
        document.body.style.overflow = '';
      });
    },
    methods: {
      update(newVal) {
        this.searchValue = newVal;
        this.$refs.input.focus();
      },
      tab() {
        this.tabbingOut = true;
      },
      focus() {
        this.$refs.input.focus();
      },
      onFocus() {
        document.body.style.overflow = 'hidden';
        this.$emit('open-results');
      },
      blur() {
        document.body.style.overflow = '';
        this.$nextTick(() => {
          if (this.tabbingOut) {
            this.tabbingOut = false;
          } else {
            this.$emit('close-results');
          }
        });
      },
    },
  };
</script>

<style scoped lang="scss">
  .navbar-search {
    display: flex;
    align-items: center;
    justify-content: center;

    @include desktop-up {
      justify-content: flex-end;
    }

    &.navbar-search--hidden {
      display: none;
    }
  }

  .navbar-search__wrapper {
    position: relative;
    width: 100%;

    @include desktop-up {
      max-width: 340px;
    }
  }

  .text-input__input {
    border-radius: rem(20);

    @include desktop-up {
      min-height: rem(40);
      min-width: rem(340);
    }
  }

  .navbar-search__submit {
    position: absolute;
    top: 50%;
    left: $spacing-unit * 3.5;
    transform: translateY(-50%);
    padding: 0;
  }

  .navbar-search__field {
    padding: 0;
    font-size: rem(16);
  }
</style>
