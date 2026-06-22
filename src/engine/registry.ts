/**
 * Registry des briques disponibles : map "id catalog" → composant Astro à utiliser.
 *
 * Pour ajouter une nouvelle brique :
 *  1. Crée le composant dans `src/bricks/primitives/` ou `src/bricks/composites/`
 *  2. Importe-le ici et ajoute-le au map BRICK_REGISTRY
 *  3. Vérifie que les inputs de ton composant matchent le schema du catalog
 */

// ─── Primitives ───
import Heading from '../bricks/primitives/Heading.astro';
import TextBrick from '../bricks/primitives/Text.astro';
import Button from '../bricks/primitives/Button.astro';
import Container from '../bricks/primitives/Container.astro';
import Stack from '../bricks/primitives/Stack.astro';
import ImageBrick from '../bricks/primitives/Image.astro';
import Link from '../bricks/primitives/Link.astro';
import Badge from '../bricks/primitives/Badge.astro';
import Divider from '../bricks/primitives/Divider.astro';
import Spacer from '../bricks/primitives/Spacer.astro';
import Rating from '../bricks/primitives/Rating.astro';
import Blockquote from '../bricks/primitives/Blockquote.astro';

// ─── Composites ───
import Card from '../bricks/composites/Card.astro';
import Hero from '../bricks/composites/Hero.astro';
import Accordion from '../bricks/composites/Accordion.astro';
import Alert from '../bricks/composites/Alert.astro';
import Breadcrumb from '../bricks/composites/Breadcrumb.astro';
import ShareButtons from '../bricks/composites/ShareButtons.astro';
import Separator from '../bricks/composites/Separator.astro';
import SectionHeader from '../bricks/composites/SectionHeader.astro';
import Stats from '../bricks/composites/Stats.astro';
import Testimonial from '../bricks/composites/Testimonial.astro';
import ComparisonTable from '../bricks/composites/ComparisonTable.astro';
import TableOfContents from '../bricks/composites/TableOfContents.astro';

// ─── Business ───
import BackToTop from '../bricks/business/BackToTop.astro';
import Disclosure from '../bricks/business/Disclosure.astro';
import Faq from '../bricks/business/Faq.astro';
import AffiliateLink from '../bricks/business/AffiliateLink.astro';
import ProduitCard from '../bricks/business/ProduitCard.astro';
import ProduitCardLink from '../bricks/business/ProduitCardLink.astro';
import ArticleCard from '../bricks/business/ArticleCard.astro';
import FigureImage from '../bricks/business/FigureImage.astro';
import ReviewVerdict from '../bricks/business/ReviewVerdict.astro';
import ProseSections from '../bricks/business/ProseSections.astro';
import ProsConsGrid from '../bricks/business/ProsConsGrid.astro';
import SpecsTable from '../bricks/business/SpecsTable.astro';
import ReviewCtaBanner from '../bricks/business/ReviewCtaBanner.astro';
import LinkList from '../bricks/business/LinkList.astro';
import ArticleHeader from '../bricks/business/ArticleHeader.astro';
import ReviewDisclosure from '../bricks/business/ReviewDisclosure.astro';
import PersonaCard from '../bricks/business/PersonaCard.astro';
import ProductHeroSplit from '../bricks/business/ProductHeroSplit.astro';

// ─── Nav ───
import HeaderNav from '../bricks/nav/Header.astro';
import FooterNav from '../bricks/nav/Footer.astro';
import BreadcrumbNav from '../bricks/nav/Breadcrumb.astro';

// ─── SEO (injectent du JSON-LD, pas de rendu visuel) ───
import SeoHead from '../bricks/seo/SeoHead.astro';
import JsonLdArticle from '../bricks/seo/JsonLdArticle.astro';
import JsonLdProduct from '../bricks/seo/JsonLdProduct.astro';
import JsonLdBrand from '../bricks/seo/JsonLdBrand.astro';
import JsonLdItemList from '../bricks/seo/JsonLdItemList.astro';
import JsonLdBreadcrumb from '../bricks/seo/JsonLdBreadcrumb.astro';
import JsonLdFaq from '../bricks/seo/JsonLdFaq.astro';
import JsonLdOrganization from '../bricks/seo/JsonLdOrganization.astro';


// ─── Catalogue complet V3 (briques restaurées) ───
import Audio from '../bricks/primitives/Audio.astro';
import Avatar from '../bricks/primitives/Avatar.astro';
import Center from '../bricks/primitives/Center.astro';
import Checkbox from '../bricks/primitives/Checkbox.astro';
import ColorPicker from '../bricks/primitives/ColorPicker.astro';
import Fonts from '../bricks/primitives/Fonts.astro';
import FooterBar from '../bricks/primitives/FooterBar.astro';
import Grid from '../bricks/primitives/Grid.astro';
import Icon from '../bricks/primitives/Icon.astro';
import Input from '../bricks/primitives/Input.astro';
import Main from '../bricks/primitives/Main.astro';
import NavList from '../bricks/primitives/NavList.astro';
import Password from '../bricks/primitives/Password.astro';
import ProgressBar from '../bricks/primitives/ProgressBar.astro';
import Radio from '../bricks/primitives/Radio.astro';
import Range from '../bricks/primitives/Range.astro';
import ReadingTime from '../bricks/primitives/ReadingTime.astro';
import RichText from '../bricks/primitives/RichText.astro';
import Select from '../bricks/primitives/Select.astro';
import Seo from '../bricks/primitives/Seo.astro';
import Skeleton from '../bricks/primitives/Skeleton.astro';
import SocialLogin from '../bricks/primitives/SocialLogin.astro';
import Spinner from '../bricks/primitives/Spinner.astro';
import Switch from '../bricks/primitives/Switch.astro';
import Textarea from '../bricks/primitives/Textarea.astro';
import Toast from '../bricks/primitives/Toast.astro';
import Tooltip from '../bricks/primitives/Tooltip.astro';
import Variable from '../bricks/primitives/Variable.astro';
import AnnouncementBar from '../bricks/composites/AnnouncementBar.astro';
import ArticleBlock from '../bricks/composites/ArticleBlock.astro';
import AuthorCard from '../bricks/composites/AuthorCard.astro';
import Carousel from '../bricks/composites/Carousel.astro';
import CodeEditor from '../bricks/composites/CodeEditor.astro';
import CookieBanner from '../bricks/composites/CookieBanner.astro';
import Countdown from '../bricks/composites/Countdown.astro';
import DatePicker from '../bricks/composites/DatePicker.astro';
import Drawer from '../bricks/composites/Drawer.astro';
import Dropdown from '../bricks/composites/Dropdown.astro';
import EmptyState from '../bricks/composites/EmptyState.astro';
import EventCard from '../bricks/composites/EventCard.astro';
import FileUpload from '../bricks/composites/FileUpload.astro';
import Filter from '../bricks/composites/Filter.astro';
import Form from '../bricks/composites/Form.astro';
import FormField from '../bricks/composites/FormField.astro';
import Gallery from '../bricks/composites/Gallery.astro';
import HeaderBar from '../bricks/composites/HeaderBar.astro';
import List from '../bricks/composites/List.astro';
import LoginForm from '../bricks/composites/LoginForm.astro';
import MapEmbed from '../bricks/composites/MapEmbed.astro';
import Marquee from '../bricks/composites/Marquee.astro';
import MenuCard from '../bricks/composites/MenuCard.astro';
import Modal from '../bricks/composites/Modal.astro';
import Navbar from '../bricks/composites/Navbar.astro';
import PageLayout from '../bricks/composites/PageLayout.astro';
import Pagination from '../bricks/composites/Pagination.astro';
import PasswordConfirm from '../bricks/composites/PasswordConfirm.astro';
import Popover from '../bricks/composites/Popover.astro';
import PreviewPanel from '../bricks/composites/PreviewPanel.astro';
import PricingCard from '../bricks/composites/PricingCard.astro';
import RegisterForm from '../bricks/composites/RegisterForm.astro';
import SearchInput from '../bricks/composites/SearchInput.astro';
import Sidebar from '../bricks/composites/Sidebar.astro';
import Spotlight from '../bricks/composites/Spotlight.astro';
import Stepper from '../bricks/composites/Stepper.astro';
import Table from '../bricks/composites/Table.astro';
import Tabs from '../bricks/composites/Tabs.astro';
import Timeline from '../bricks/composites/Timeline.astro';
import Video from '../bricks/composites/Video.astro';
import AiGenerate from '../bricks/business/AiGenerate.astro';
/**
 * Map id catalog → composant Astro.
 * Les briques non présentes ici tomberont sur le Fallback.
 */
export const BRICK_REGISTRY: Record<string, unknown> = {
  // Primitives
  heading: Heading,
  text: TextBrick,
  button: Button,
  container: Container,
  stack: Stack,
  image: ImageBrick,
  link: Link,
  badge: Badge,
  divider: Divider,
  spacer: Spacer,
  rating: Rating,
  blockquote: Blockquote,

  // Composites
  card: Card,
  hero: Hero,
  accordion: Accordion,
  alert: Alert,
  breadcrumb: Breadcrumb,
  'share-buttons': ShareButtons,
  separator: Separator,
  'section-header': SectionHeader,
  stats: Stats,
  testimonial: Testimonial,
  'comparison-table': ComparisonTable,
  'table-of-contents': TableOfContents,

  // Business
  'back-to-top': BackToTop,
  disclosure: Disclosure,
  faq: Faq,
  'affiliate-link': AffiliateLink,
  'produit-card': ProduitCard,
  'produit-card-link': ProduitCardLink,
  'article-card': ArticleCard,
  'figure-image': FigureImage,
  'review-verdict': ReviewVerdict,
  'prose-sections': ProseSections,
  'pros-cons-grid': ProsConsGrid,
  'specs-table': SpecsTable,
  'review-cta-banner': ReviewCtaBanner,
  'link-list': LinkList,
  'article-header': ArticleHeader,
  'review-disclosure': ReviewDisclosure,
  'persona-card': PersonaCard,
  'product-hero-split': ProductHeroSplit,

  // Nav (business-aware, à utiliser dans BaseLayout)
  'header-nav': HeaderNav,
  'footer-nav': FooterNav,
  'breadcrumb-nav': BreadcrumbNav,

  // SEO
  'seo-head': SeoHead,
  'json-ld-article': JsonLdArticle,
  'json-ld-product': JsonLdProduct,
  'json-ld-brand': JsonLdBrand,
  'json-ld-item-list': JsonLdItemList,
  'json-ld-breadcrumb': JsonLdBreadcrumb,
  'json-ld-faq': JsonLdFaq,
  'json-ld-organization': JsonLdOrganization,

  // ─── Catalogue complet V3 (briques restaurées) ───
  audio: Audio,
  avatar: Avatar,
  center: Center,
  checkbox: Checkbox,
  'color-picker': ColorPicker,
  fonts: Fonts,
  footer: FooterBar,
  grid: Grid,
  icon: Icon,
  input: Input,
  main: Main,
  'nav-list': NavList,
  password: Password,
  'progress-bar': ProgressBar,
  radio: Radio,
  range: Range,
  'reading-time': ReadingTime,
  'rich-text': RichText,
  select: Select,
  seo: Seo,
  skeleton: Skeleton,
  'social-login': SocialLogin,
  spinner: Spinner,
  switch: Switch,
  textarea: Textarea,
  toast: Toast,
  tooltip: Tooltip,
  variable: Variable,
  'announcement-bar': AnnouncementBar,
  article: ArticleBlock,
  'author-card': AuthorCard,
  carousel: Carousel,
  'code-editor': CodeEditor,
  'cookie-banner': CookieBanner,
  countdown: Countdown,
  'date-picker': DatePicker,
  drawer: Drawer,
  dropdown: Dropdown,
  'empty-state': EmptyState,
  'event-card': EventCard,
  'file-upload': FileUpload,
  filter: Filter,
  form: Form,
  'form-field': FormField,
  gallery: Gallery,
  header: HeaderBar,
  list: List,
  'login-form': LoginForm,
  map: MapEmbed,
  marquee: Marquee,
  'menu-card': MenuCard,
  modal: Modal,
  navbar: Navbar,
  'page-layout': PageLayout,
  pagination: Pagination,
  'password-confirm': PasswordConfirm,
  popover: Popover,
  'preview-panel': PreviewPanel,
  'pricing-card': PricingCard,
  'register-form': RegisterForm,
  'search-input': SearchInput,
  sidebar: Sidebar,
  spotlight: Spotlight,
  stepper: Stepper,
  table: Table,
  tabs: Tabs,
  timeline: Timeline,
  video: Video,
  'ai-generate': AiGenerate,
};
