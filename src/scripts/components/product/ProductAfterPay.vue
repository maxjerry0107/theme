<template lang="pug">
  .product-afterpay
    .product-afterpay__price(
      id="ProductAfterpay"
      :content="productPrice"
    )
    slot(name="afterpay")
</template>

<script>
  export default {
    name: 'ProductAfterpay',
    props: {
      product: Object,
    },
    data() {
      return {
        afterpayData: {},
        theme: {},
        currency: {},
      };
    },
    computed: {
      productPrice() {
        return +(Math.round(parseFloat(this.product.price / 100) + 'e+2') + 'e-2'); // eslint-disable-line
      },
    },
    created() {
      this.theme = window.Shopify ? window.Shopify.theme : {};
      this.currency = window.Shopify ? window.Shopify.currency : {};
      this.afterpayData = this.getAfterpayData();
      this.afterpayGoogleAnalytics();
      this.afterPaySetup();
    },
    mounted() {
      this.afterPayInit();
    },
    methods: {
      getAfterpayData() {
        const afterpayDataElm = document.querySelector('#afterpayData');
        return afterpayDataElm && afterpayDataElm.innerHTML ? JSON.parse(afterpayDataElm.innerHTML) : {};
      },
      afterpayGoogleAnalytics() {
        /* eslint-disable */
        (function(i,s,o,g,r,a,m){
          i['GoogleAnalyticsObject']=r;
          i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments);
          },i[r].l=1*new Date();
          a=s.createElement(o),m=s.getElementsByTagName(o)[0];
          a.async=1;
          a.src=g;
          m.parentNode.insertBefore(a,m);
        })(window,document,'script','https://www.google-analytics.com/analytics.js','afterpay_ga');
        afterpay_ga('create', 'UA-108913162-2', {'sampleRate': 1});
        afterpay_ga('send', 'event', 'Liquid Snippet', 'Report Version', '2.5.3');
        afterpay_ga('send', 'event', 'Theme', 'Report Name', this.theme.name);
        afterpay_ga('send', 'event', 'Shop', 'Report Currency', this.currency.active);
        /* eslint-enable */
      },
      afterPaySetup() {
        /* eslint-disable camelcase, func-names */
        const { currency, product, afterpayData } = this;
        if (typeof window.Afterpay === 'undefined') {
          const Afterpay = { products: [] };
          Afterpay.loadScript = function(url, callback) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            if (script.readyState) {
              // I.E.
              script.onreadystatechange = function() {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                  script.onreadystatechange = null;
                  callback();
                }
              };
            } else {
              // Others
              script.onload = function() {
                callback();
              };
            }
            script.src = url;
            document.getElementsByTagName('head')[0].appendChild(script);
          };
          Afterpay.number_format = function(number, decimals, decPoint, thousandsSep) {
            // http://locutus.io/php/number_format/

            const numberFixed = String(number).replace(/[^0-9+\-Ee.]/g, '');
            const n = !Number.isFinite(+numberFixed) ? 0 : +numberFixed;
            const prec = !Number.isFinite(+decimals) ? 0 : Math.abs(decimals);
            const sep = typeof thousandsSep === 'undefined' ? ',' : thousandsSep;
            const dec = typeof decPoint === 'undefined' ? '.' : decPoint;
            let s = '';

            const toFixedFix = function(n2, prec2) {
              // eslint-disable-next-line no-restricted-properties
              const k = Math.pow(10, prec2);
              return (Math.round(n2 * k) / k).toFixed(prec2);
            };

            s = prec ? toFixedFix(n, prec) : String(Math.round(n)).split('.');
            if (s[0].length > 3) {
              s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
            }
            if ((s[1] || '').length < prec) {
              s[1] = s[1] || '';
              s[1] += new Array(prec - s[1].length + 1).join('0');
            }

            return s.join(dec);
          };
          Afterpay.launchPopup = function($, event) {
            event.preventDefault();

            let $popup_wrapper;
            let $popup_outer;
            let $popup_inner;
            let $a;
            let $img;
            // eslint-disable-next-line no-unused-vars
            let $close_button;

            $popup_wrapper = $('#afterpay-popup-wrapper');

            if ($popup_wrapper.length > 0) {
              $popup_wrapper.show();
            } else {
              $popup_wrapper = $(document.createElement('div'))
                .attr('id', 'afterpay-popup-wrapper')
                .css({
                  position: 'fixed',
                  'z-index': 999999999,
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  overflow: 'auto',
                })
                .appendTo('body')
                .on('click', function(evnt) {
                  Afterpay.closePopup($, evnt);
                });

              $popup_outer = $(document.createElement('div'))
                .attr('id', 'afterpay-popup-outer')
                .css({
                  display: 'flex',
                  '-webkit-justify-content': 'center',
                  '-ms-flex-pack': 'center',
                  'justify-content': 'center',
                  '-webkit-align-content': 'center',
                  '-ms-flex-line-pack': 'center',
                  'align-content': 'center',
                  '-webkit-align-items': 'center',
                  '-ms-flex-align': 'center',
                  'align-items': 'center',
                  width: '100%',
                  'min-height': '100%',
                  'background-color': 'rgba(0, 0, 0, 0.80)',
                })
                .appendTo($popup_wrapper);

              $popup_inner = $(document.createElement('div'))
                .attr('id', 'afterpay-popup-inner')
                .css({
                  position: 'relative',
                  'background-color': '#fff',
                })
                .appendTo($popup_outer);

              $a = $(document.createElement('a'));

              if (currency.active === 'USD') {
                $a.attr('href', 'https://www.afterpay.com/installment-agreement');
              } else {
                $a.attr('href', 'https://www.afterpay.com/terms');
              }

              $a.attr('target', '_blank')
                .css({
                  display: 'block',
                })
                .appendTo($popup_inner);

              $img = $(document.createElement('img'));

              if (currency.active === 'USD') {
                if ($(window).width() > 640) {
                  $img.attr('src', 'https://static.afterpay.com/us-popup-medium.png');
                } else {
                  $img.attr('src', 'https://static.afterpay.com/us-popup-small.png');
                }
              } else if (currency.active !== 'USD') {
                if ($(window).width() > 640) {
                  $img.attr('src', 'https://static.afterpay.com/lightbox-desktop.png');
                } else {
                  $img.attr('src', 'https://static.afterpay.com/lightbox-mobile.png');
                }
              }

              $img
                .css({
                  display: 'block',
                  width: '100%',
                })
                .appendTo($a)
                .on('click', function(e) {
                  e.stopPropagation();
                });

              // eslint-disable-next-line no-unused-vars
              $close_button = $(document.createElement('a'))
                .attr('href', '#')
                .css({
                  position: 'absolute',
                  right: '8px',
                  top: '8px',
                })
                .html(
                  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1" width="32px" height="32px"><g id="surface1"><path style=" " d="M 16 3 C 8.832031 3 3 8.832031 3 16 C 3 23.167969 8.832031 29 16 29 C 23.167969 29 29 23.167969 29 16 C 29 8.832031 23.167969 3 16 3 Z M 16 5 C 22.085938 5 27 9.914063 27 16 C 27 22.085938 22.085938 27 16 27 C 9.914063 27 5 22.085938 5 16 C 5 9.914063 9.914063 5 16 5 Z M 12.21875 10.78125 L 10.78125 12.21875 L 14.5625 16 L 10.78125 19.78125 L 12.21875 21.21875 L 16 17.4375 L 19.78125 21.21875 L 21.21875 19.78125 L 17.4375 16 L 21.21875 12.21875 L 19.78125 10.78125 L 16 14.5625 Z "/></g></svg>',
                )
                .appendTo($popup_inner)
                .on('click', function(evnt) {
                  Afterpay.closePopup($, evnt);
                });
            }
          };
          Afterpay.closePopup = function($, event) {
            event.preventDefault();
            $('#afterpay-popup-wrapper').hide();
          };
          Afterpay.init = function($) {
            $('.afterpay-paragraph a').on('click', function(event) {
              Afterpay.launchPopup($, event);
            });
            $('body').on('change', $('form[action^="/cart/add"]'), function(event) {
              const $form = $(event.target).closest('form');
              let $afterpay_paragraph = null;
              let should_show_instalments = false;
              const selected_variant_id = parseInt($('input[name=id]:checked, select[name=id], input[name=id], hidden[name=id]', $form).val(), 10);
              if (Number.isNaN(selected_variant_id)) {
                const $variant_options = $form.find('input[name=id][value], select[name=id] option[value], hidden[name=id][value]').filter(function(index, element) {
                  return $(element)
                    .attr('value')
                    .match(/^[1-9][0-9]*$/);
                });
                $variant_options.each(function(index, element) {
                  $.each(Afterpay.products, function(product_index, _product) {
                    $.each(_product.variants, function(variant_index, variant) {
                      if (Number(variant.id) === Number($(element).val())) {
                        $afterpay_paragraph = $(`.afterpay-paragraph[data-product-id=${_product.id}]`);
                        return false;
                      }
                      return true;
                    });
                    if ($afterpay_paragraph !== null) {
                      return false;
                    }
                    return true;
                  });
                  if ($afterpay_paragraph !== null) {
                    return false;
                  }
                  return true;
                });
              } else if (selected_variant_id > 0) {
                $.each(Afterpay.products, function(product_index, _product) {
                  $.each(_product.variants, function(variant_index, variant) {
                    if (variant.id === selected_variant_id) {
                      $afterpay_paragraph = $(`.afterpay-paragraph[data-product-id=${_product.id}]`);
                      if (variant.available && variant.price >= afterpayData.afterpay_minimum_value_in_cents && variant.price <= afterpayData.afterpay_maximum_value_in_cents) {
                        should_show_instalments = true;
                        $afterpay_paragraph.find('.afterpay-instalments').html(`${afterpayData.currency_symbol}${(Math.round(variant.price / 4) / 100).toFixed(2)} &nbsp;${currency.active}`);
                      }
                    }
                  });
                });
              }
              if ($afterpay_paragraph !== null) {
                if (should_show_instalments) {
                  if (currency.active === 'USD') {
                    $afterpay_paragraph.find('.afterpay-text1').html('or 4 installments of ');
                    $afterpay_paragraph.find('.afterpay-logo').insertAfter($afterpay_paragraph.find('.afterpay-instalments'));
                    $afterpay_paragraph
                      .find('.afterpay-text2')
                      .html(' by ')
                      .insertBefore($afterpay_paragraph.find('.afterpay-logo'));
                    $afterpay_paragraph.find('.afterpay-link-inner').html('<span class="afterpay-link-inner">&#9432;</span><u class="u-sr-only">More info</u>');
                  } else {
                    $afterpay_paragraph.show();
                  }
                } else if (!should_show_instalments) {
                  if (currency.active === 'USD') {
                    $afterpay_paragraph.show();

                    $afterpay_paragraph.find('.afterpay-text1').html('Installments by ');
                    $afterpay_paragraph.find('.afterpay-logo').insertAfter($afterpay_paragraph.find('.afterpay-text1'));
                    $afterpay_paragraph.find('.afterpay-text2').html(' available between ');
                    $afterpay_paragraph
                      .find('.afterpay-instalments')
                      .html(
                        `${afterpayData.currency_symbol}${Afterpay.number_format(afterpayData.afterpay_minimum_value_in_cents / 100, 2)} &nbsp;${currency.active} - ${afterpayData.currency_symbol}${Afterpay.number_format(
                          afterpayData.afterpay_maximum_value_in_cents / 100,
                          2,
                        )} &nbsp;${currency.active}`,
                      )
                      .insertAfter($afterpay_paragraph.find('.afterpay-text2'));
                    $afterpay_paragraph.find('.afterpay-link-inner').html('Learn more');
                  } else {
                    $afterpay_paragraph.hide();
                  }
                }
              }
            });
            if (product.selected_or_first_available_variant.available && currency.active === 'USD') {
              if (product.selected_or_first_available_variant.price < afterpayData.afterpay_minimum_value_in_cents || product.selected_or_first_available_variant.price > afterpayData.afterpay_maximum_value_in_cents) {
                $('form[action^="/cart/add"]').trigger('change');
              }
            }
          };
          if (typeof window.jQuery === 'undefined' || parseFloat(window.jQuery.fn.jquery) < 1.7) {
            Afterpay.loadScript('https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js', function() {
              const jQuery_1_12_4 = window.jQuery.noConflict(true);
              Afterpay.init(jQuery_1_12_4);
            });
          } else {
            Afterpay.init(window.jQuery);
          }
          window.Afterpay = Afterpay;
        }
        window.Afterpay.products.push(this.product);
      },
      afterPayInit() {
        const { product, currency } = this;
        const priceBox = '#ProductAfterpay';
        const apConfig = {
          priceSelector: priceBox,
          amount: `${product.price}`,
          locale: 'en_US',
          currency: currency.active,
          minMaxThreshold: {
            min: 3500,
            max: 100000,
          },
        };

        if(window.presentAfterpay){ // eslint-disable-line
          new window.presentAfterpay(apConfig).init(); // eslint-disable-line
        }
        if (product.type.includes('Gift Card')) {
          apConfig.priceSelector = '';
        }
      },
    },
  };
</script>
