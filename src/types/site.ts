export type PageRoute =
  | 'home'
  | 'about'
  | 'livestock'
  | 'poultry'
  | 'fish-farming'
  | 'gallery'
  | 'contact'
  | 'checkout'
  | 'payment-success'
  | 'payment-failed'
  | 'payment-pending'
  | 'paystack-test-checkout'
  | 'payment-records';

export type DivisionKey = 'livestock' | 'poultry' | 'fish-farming';

export type GalleryCategory =
  | 'Livestock Farming'
  | 'Poultry Farming'
  | 'Fish Farming'
  | 'Farm Grounds';

export interface BusinessInfo {
  name: string;
  shortName: string;
  slogan: string;
  location: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappNumber: string;
  whatsappUrl: string;
  email: string;
  emblemUrl: string;
}

export interface HeroContent {
  eyebrow: string;
  headline: string;
  welcomeMessage: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  heroImage: string;
  heroImageAlt: string;
}

export interface HomeIntroContent {
  heading: string;
  subheading: string;
  bodyPrimary: string;
  bodySecondary: string;
}

export interface CommitmentPillar {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface HomeCommitmentContent {
  heading: string;
  subheading: string;
  pillars: CommitmentPillar[];
}

export interface HomeCtaBannerContent {
  heading: string;
  description: string;
  whatsappButtonLabel: string;
  contactButtonLabel: string;
}

export interface AboutContent {
  heroTitle: string;
  heroSubtitle: string;
  overviewHeading: string;
  overviewParagraphOne: string;
  overviewParagraphTwo: string;
  overviewParagraphThree: string;
  missionHeading: string;
  missionStatement: string;
  pillarsHeading: string;
  pillars: CommitmentPillar[];
  imageUrl: string;
  imageAlt: string;
}

export interface DivisionContent {
  key: DivisionKey;
  title: string;
  subtitle: string;
  overview: string;
  details: string;
  imageUrl: string;
  imageAlt: string;
  highlights: string[];
}

export interface FarmProduct {
  id: string;
  division: DivisionKey;
  name: string;
  description: string;
  availability: string;
  imageUrl: string;
  priceNgn?: number;
  unitLabel?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: GalleryCategory;
  imageUrl: string;
}

export interface ContactPageContent {
  heroTitle: string;
  heroSubtitle: string;
  directHeading: string;
  directDescription: string;
  formHeading: string;
  formDescription: string;
  whatsappBannerHeading: string;
  whatsappBannerText: string;
}

export interface SiteContent {
  business: BusinessInfo;
  homeHero: HeroContent;
  homeIntro: HomeIntroContent;
  homeCommitment: HomeCommitmentContent;
  homeCtaBanner: HomeCtaBannerContent;
  about: AboutContent;
  divisions: Record<DivisionKey, DivisionContent>;
  products: FarmProduct[];
  galleryIntro: {
    heading: string;
    subtitle: string;
  };
  gallery: GalleryItem[];
  contact: ContactPageContent;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface ServerProductDTO {
  id: string;
  division: DivisionKey;
  name: string;
  unit_label: string;
  price_ngn: number;
  description: string;
  availability: string;
  image_url: string;
  active: number;
}

export interface PaymentRecordDTO {
  id: number;
  transaction_id: string | null;
  payment_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_id: string;
  amount_kobo: number;
  amount_ngn: number;
  currency: string;
  payment_method: string;
  payment_status: 'pending' | 'success' | 'failed';
  gateway_response: string | null;
  webhook_processed: number;
  transaction_date: string;
}

export interface OrderItemSnapshotDTO {
  productId: string;
  name: string;
  unitLabel: string;
  quantity: number;
  unitPriceNgn: number;
  unitPriceKobo: number;
  lineTotalKobo: number;
}

export interface PaymentVerificationDTO {
  verified: boolean;
  status: 'success' | 'pending' | 'failed';
  message: string;
  mode: 'live' | 'test' | 'simulation';
  order?: {
    id: string;
    payment_reference: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    total_kobo: number;
    currency: string;
    status: string;
    created_at: string;
  };
  payment?: PaymentRecordDTO;
  items?: OrderItemSnapshotDTO[];
}
