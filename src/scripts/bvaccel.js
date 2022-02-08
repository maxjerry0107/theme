import 'core-js';

import Vue from 'vue';
import Vue2TouchEvents from 'vue2-touch-events';
import VueScript2 from 'scripts/lib/script2';
import VueLazyLoad from 'vue-lazyload';
import VueScrollTo from 'vue-scrollto';
import VScrollLock from 'v-scroll-lock';
import VueMq from 'vue-mq';
import VueObserveVisibility from 'vue-observe-visibility';
import { mapState } from 'vuex';

import images from 'scripts/config/images.js';
import components from './components/index.js';
import store from './store/index.js';
import { ucfirst, upcase, unhandleize } from './filters/string.js';
import { money, moneyWithoutDecimals } from './filters/money.js';

__webpack_public_path__ = window.__webpack_public_path__; // eslint-disable-line no-underscore-dangle, camelcase

const cssVars = require('../styles/settings/settings.scss');

Vue.config.productionTip = false;

Vue.use(Vue2TouchEvents);
Vue.use(VueScript2);
Vue.use(VueScrollTo);
Vue.use(VScrollLock);
Vue.use(VueObserveVisibility);

Vue.use(VueLazyLoad, {
  loading: images.loading,
  preload: 1.3,
  attempt: 1,
});

Vue.use(VueMq, {
  breakpoints: {
    mobile: parseInt(cssVars.breakpointTablet, 10),
    tablet: parseInt(cssVars.breakpointDesktop, 10),
    desktop: parseInt(cssVars.breakpointHd, 10),
    hd: parseInt(cssVars.breakpointMax, 10),
    max: parseInt(cssVars.breakpointFullWidth, 10),
    full: Infinity,
  },
});

Vue.filter('ucfirst', ucfirst);
Vue.filter('upcase', upcase);
Vue.filter('unhandleize', unhandleize);
Vue.filter('money', money);
Vue.filter('moneyWithoutDecimals', moneyWithoutDecimals);

new Vue({
  store,
  comments: true,
  components,
  computed: {
    ...mapState({
      checkout: (state) => state.cart,
    }),
    featuredProductSlidesToShow() {
      if (this.$mq === 'mobile') return 1.5;
      if (this.$mq === 'tablet') return 3.5;
      return 4;
    },
  },
  created() {
    // on creation, initialize app data
    this.$store.dispatch('fixInteroperability/init');
    this.$store.dispatch('cart/init');
    this.$store.dispatch('products/init');
  },
  mounted() {
    // on mount, start listening for load events
    this.$store.dispatch('fixInteroperability/restore');

    // on a section load, re-mount section to reflect admin changes
    document.addEventListener('shopify:section:load', (event) => {
      const sectionContainer = document.getElementById(event.target.id);
      const NewComponent = Vue.extend({
        components,
        template: event.target.innerHTML,
      });
      const component = new NewComponent().$mount();

      sectionContainer.innerHTML = '';
      sectionContainer.appendChild(component.$el);
    });
  },
  updated() {
    this.$nextTick(() => {
      let counter = 10;
      const onTouchStart = () => {
        if (document.body && document.body.style !== '') {
          document.body.style = '';
          counter -= 1;
          if (counter < 1) {
            document.removeEventListener('touchstart', onTouchStart);
          }
        }
      };

      document.addEventListener('touchstart', onTouchStart, {
        passive: true,
      });
    });
  },
}).$mount('#app');
