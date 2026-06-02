/**
 * Registry des briques disponibles : map "id catalog" → composant Astro à utiliser.
 *
 * Pour ajouter une nouvelle brique :
 *  1. Crée le composant dans `src/bricks/primitives/` ou `src/bricks/composites/`
 *  2. Importe-le ici et ajoute-le au map BRICK_REGISTRY
 *  3. Vérifie que les inputs de ton composant matchent le schema du catalog
 */

// ─── Primitives ───
import Heading from '~/bricks/primitives/Heading.astro';
import TextBrick from '~/bricks/primitives/Text.astro';
import Button from '~/bricks/primitives/Button.astro';
import Container from '~/bricks/primitives/Container.astro';
import Stack from '~/bricks/primitives/Stack.astro';
import ImageBrick from '~/bricks/primitives/Image.astro';
import Link from '~/bricks/primitives/Link.astro';
import Badge from '~/bricks/primitives/Badge.astro';
import Divider from '~/bricks/primitives/Divider.astro';
import Spacer from '~/bricks/primitives/Spacer.astro';

// ─── Composites ───
import Card from '~/bricks/composites/Card.astro';
import Hero from '~/bricks/composites/Hero.astro';
import Accordion from '~/bricks/composites/Accordion.astro';
import Alert from '~/bricks/composites/Alert.astro';
import Breadcrumb from '~/bricks/composites/Breadcrumb.astro';
import ShareButtons from '~/bricks/composites/ShareButtons.astro';
import Separator from '~/bricks/composites/Separator.astro';
import SectionHeader from '~/bricks/composites/SectionHeader.astro';

// ─── Business ───
import BackToTop from '~/bricks/business/BackToTop.astro';
import Disclosure from '~/bricks/business/Disclosure.astro';
import Faq from '~/bricks/business/Faq.astro';
import AffiliateLink from '~/bricks/business/AffiliateLink.astro';
import ProduitCard from '~/bricks/business/ProduitCard.astro';
import ArticleCard from '~/bricks/business/ArticleCard.astro';

// ─── Nav ───
import HeaderNav from '~/bricks/nav/Header.astro';
import FooterNav from '~/bricks/nav/Footer.astro';
import BreadcrumbNav from '~/bricks/nav/Breadcrumb.astro';

// ─── SEO (injectent du JSON-LD, pas de rendu visuel) ───
import SeoHead from '~/bricks/seo/SeoHead.astro';
import JsonLdArticle from '~/bricks/seo/JsonLdArticle.astro';
import JsonLdProduct from '~/bricks/seo/JsonLdProduct.astro';
import JsonLdBrand from '~/bricks/seo/JsonLdBrand.astro';
import JsonLdItemList from '~/bricks/seo/JsonLdItemList.astro';
import JsonLdBreadcrumb from '~/bricks/seo/JsonLdBreadcrumb.astro';
import JsonLdFaq from '~/bricks/seo/JsonLdFaq.astro';
import JsonLdOrganization from '~/bricks/seo/JsonLdOrganization.astro';

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

  // Composites
  card: Card,
  hero: Hero,
  accordion: Accordion,
  alert: Alert,
  breadcrumb: Breadcrumb,
  'share-buttons': ShareButtons,
  separator: Separator,
  'section-header': SectionHeader,

  // Business
  'back-to-top': BackToTop,
  disclosure: Disclosure,
  faq: Faq,
  'affiliate-link': AffiliateLink,
  'produit-card': ProduitCard,
  'article-card': ArticleCard,

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
};
