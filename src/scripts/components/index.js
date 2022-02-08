import Icon from 'scripts/components/basic/Icon.vue';
import Modal from 'scripts/components/basic/Modal.vue';
import Tab from 'scripts/components/basic/Tab.vue';
import Tabs from 'scripts/components/basic/Tabs.vue';
import TruncateText from 'scripts/components/basic/TruncateText.vue';
import Accordion from 'scripts/components/basic/Accordion.vue';
import AccordionGroup from 'scripts/components/basic/AccordionGroup.vue';
import Banner from 'scripts/components/basic/Banner.vue';
import ResponsiveImage from 'scripts/components/basic/ResponsiveImage.vue';
import Carousel from 'scripts/components/basic/Carousel.vue';
import Slide from 'scripts/components/basic/Slide.vue';
import Hero from 'scripts/components/basic/Hero.vue';

import IconButton from 'scripts/components/buttons/IconButton.vue';
import IconLink from 'scripts/components/buttons/IconLink.vue';
import VButton from 'scripts/components/buttons/VButton.vue';
import SubmitButton from 'scripts/components/buttons/SubmitButton.vue';
import LinkButton from 'scripts/components/buttons/LinkButton.vue';
import ButtonComponent from 'scripts/components/buttons/ButtonComponent.vue';

import TextInput from 'scripts/components/forms/TextInput.vue';
import CheckboxInput from 'scripts/components/forms/CheckboxInput.vue';
import RadioInput from 'scripts/components/forms/RadioInput.vue';
import SelectInput from 'scripts/components/forms/SelectInput.vue';
import QuantityInput from 'scripts/components/forms/QuantityInput.vue';
import KlaviyoForm from 'scripts/components/forms/KlaviyoForm.vue';

import Cart from 'scripts/components/cart/Cart.vue';
import Sidecart from 'scripts/components/cart/Sidecart.vue';
import HeaderLogo from 'scripts/components/site-header/HeaderLogo.vue';
import HeaderPromoBar from 'scripts/components/site-header/HeaderPromoBar.vue';
import SearchResults from 'scripts/components/product/SearchResults.vue';
import ProductDisplay from 'scripts/components/product/ProductDisplay.vue';
import ProductTile from 'scripts/components/product/ProductTile.vue';
import CollectionGrid from 'scripts/components/collection/CollectionGrid.vue';
import CollectionHeader from 'scripts/components/collection/CollectionHeader.vue';
import CollectionFooter from 'scripts/components/collection/CollectionFooter.vue';

import AccountLogin from 'scripts/components/account/AccountLogin.vue';
import AccountForgotPassword from 'scripts/components/account/AccountForgotPassword.vue';
import AccountRegister from 'scripts/components/account/AccountRegister.vue';
import AccountNav from 'scripts/components/account/AccountNav.vue';
import AccountSavedAddress from 'scripts/components/account/AccountSavedAddress.vue';
import AccountNewAddress from 'scripts/components/account/AccountNewAddress.vue';
import AccountSelectNav from 'scripts/components/account/AccountSelectNav.vue';

import FollowUs from 'scripts/components/sections/FollowUs.vue';
import GridCollections from 'scripts/components/sections/GridCollections.vue';
import PageBlocks from 'scripts/components/sections/PageBlocks.vue';
import ProductValueProps from 'scripts/components/sections/ProductValueProps.vue';

import SiteHeader from 'scripts/components/site-header/SiteHeader.vue';
import UtilityNav from 'scripts/components/site-header/UtilityNav.vue';
import PrimaryNavigation from 'scripts/components/site-header/PrimaryNavigation.vue';
import MobileNavigation from 'scripts/components/site-header/MobileNavigation.vue';
import MobileUtilityNav from 'scripts/components/site-header/MobileUtilityNav.vue';

import SiteFooter from 'scripts/components/site-footer/SiteFooter.vue';

/**
 * Deferred components
 *
 * These components will only load if they are rendered by markup. Use
 * for components that don't load on every page.
 *
 * i.e. below the fold components, landing page components, etc.
 * const AsyncComponent = () => import('scripts/components/category/AsyncComponent.vue')
 */
// const Carousel = () => import('scripts/components/basic/Carousel.vue');
// const Slide = () => import('scripts/components/basic/Slide.vue');
// const Hero = () => import('scripts/components/basic/Hero.vue');
const Toast = () => import('scripts/components/basic/Toast.vue');
const DesktopUtilityNav = () => import('scripts/components/site-header/DesktopUtilityNav.vue');
const QuickShop = () => import('scripts/components/sections/QuickShopDrawer.vue');

// const ProductDisplay = () => import('scripts/components/product/ProductDisplay.vue');
// const ProductTile = () => import('scripts/components/product/ProductTile.vue');
// const SearchResults = () => import('scripts/components/product/SearchResults.vue');

// const CollectionHeader = () => import('scripts/components/collection/CollectionHeader.vue');
// const CollectionGrid = () => import('scripts/components/collection/CollectionGrid.vue');
// const CollectionFooter = () => import('scripts/components/collection/CollectionFooter.vue');

const ArticleSocialShare = () => import('scripts/components/blog/ArticleSocialShare.vue');
const ArticleFooter = () => import('scripts/components/blog/ArticleFooter.vue');

const FeaturedCollections = () => import('scripts/components/sections/FeaturedCollections.vue');
// const GridCollections = () => import('scripts/components/sections/GridCollections.vue');
const ContactInformations = () => import('scripts/components/sections/ContactInformations.vue');
// const FollowUs = () => import('scripts/components/sections/FollowUs.vue');
const FeaturedBlogPosts = () => import('scripts/components/sections/FeaturedBlogPosts.vue');
// const PageBlocks = () => import('scripts/components/sections/PageBlocks.vue');

export default {
  Icon,
  Modal,
  Tab,
  Tabs,
  TruncateText,
  Accordion,
  AccordionGroup,
  Banner,
  ResponsiveImage,
  IconButton,
  IconLink,
  VButton,
  SubmitButton,
  LinkButton,
  Cart,
  Sidecart,
  HeaderLogo,
  HeaderPromoBar,
  AccountLogin,
  AccountForgotPassword,
  AccountRegister,
  AccountNav,
  AccountNewAddress,
  AccountSavedAddress,
  AccountSelectNav,
  ButtonComponent,
  TextInput,
  CheckboxInput,
  RadioInput,
  QuantityInput,
  SiteFooter,
  SiteHeader,
  UtilityNav,
  MobileUtilityNav,
  DesktopUtilityNav,
  PrimaryNavigation,
  MobileNavigation,
  SelectInput,
  KlaviyoForm,
  ArticleFooter,
  ArticleSocialShare,
  Carousel,
  CollectionFooter,
  CollectionGrid,
  CollectionHeader,
  ContactInformations,
  FeaturedBlogPosts,
  FeaturedCollections,
  FollowUs,
  GridCollections,
  Hero,
  PageBlocks,
  ProductTile,
  ProductDisplay,
  ProductValueProps,
  QuickShop,
  SearchResults,
  Slide,
  Toast,
};
