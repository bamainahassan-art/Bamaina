import heroImage from '../assets/images/hero_integrated_farm_1795091831726.jpg';
import livestockImage from '../assets/images/livestock_pasture_cattle_1795091831949.jpg';
import poultryImage from '../assets/images/poultry_broiler_house_1795091831037.jpg';
import fishImage from '../assets/images/aquaculture_fish_ponds_1795091831987.jpg';
import { SiteContent } from '../types/site';

export const FARM_IMAGE_ASSETS = {
  hero: heroImage,
  livestock: livestockImage,
  poultry: poultryImage,
  fish: fishImage,
  emblem: '/assets/aistudio/Baffa_Njangirde_Agro_Farm_Emblem_297c11fa.png',
} as const;

const COMMITMENT_PILLARS = [
  {
    id: 'pillar-quality',
    number: '01',
    title: 'Quality Produce',
    description:
      'Healthy animals, fresh eggs, and table-size fish raised with care, clean housing, and balanced nutrition.',
  },
  {
    id: 'pillar-sustainability',
    number: '02',
    title: 'Sustainable Practices',
    description:
      'Integrated farming methods that respect the land, conserve water, and keep our operations productive for years to come.',
  },
  {
    id: 'pillar-community',
    number: '03',
    title: 'Community Prosperity',
    description:
      'Supporting local food security, creating jobs, and partnering with households, traders, and businesses across Jigawa State.',
  },
];

export const DEFAULT_SITE_CONTENT: SiteContent = {
  business: {
    name: 'Baffa Njangirde Agro-Allied Farm',
    shortName: 'Baffa Njangirde',
    slogan: 'Growing Agriculture, Building Prosperity.',
    location: 'Bamaina town, Jigawa State, Nigeria',
    phoneDisplay: '0806 549 4739',
    phoneHref: 'tel:+2348065494739',
    whatsappNumber: '+2348065494739',
    whatsappUrl: 'https://wa.me/2348065494739',
    email: 'bamainahassan@gmail.com',
    emblemUrl: FARM_IMAGE_ASSETS.emblem,
  },
  homeHero: {
    eyebrow: 'Bamaina town, Jigawa State, Nigeria',
    headline: 'Growing Agriculture, Building Prosperity.',
    welcomeMessage:
      'Welcome to Baffa Njangirde Agro-Allied Farm — an integrated agricultural enterprise committed to livestock farming, poultry production, and fish farming.',
    primaryCtaLabel: 'Explore Our Farm',
    secondaryCtaLabel: 'Chat on WhatsApp',
    heroImage: FARM_IMAGE_ASSETS.hero,
    heroImageAlt: 'Aerial view of the integrated Baffa Njangirde Agro-Allied Farm',
  },
  homeIntro: {
    heading: 'Who We Are',
    subheading: 'A Nigerian agricultural enterprise rooted in Bamaina town',
    bodyPrimary:
      'Baffa Njangirde Agro-Allied Farm brings together livestock, poultry, and aquaculture under one well-managed operation, delivering healthy, reliable farm produce to households, restaurants, and traders.',
    bodySecondary:
      'Our team combines practical farming experience with disciplined daily management, clean facilities, and a commitment to animal welfare and quality.',
  },
  homeCommitment: {
    heading: 'Our Commitment',
    subheading: 'What guides every part of our farm',
    pillars: COMMITMENT_PILLARS,
  },
  homeCtaBanner: {
    heading: 'Ready to order fresh farm produce?',
    description:
      'Reach out for cattle, small ruminants, broilers, eggs, catfish, and pond stock. We respond quickly on WhatsApp and phone.',
    whatsappButtonLabel: 'Order on WhatsApp',
    contactButtonLabel: 'Contact Us',
  },
  about: {
    heroTitle: 'About Us',
    heroSubtitle: 'The story and mission behind Baffa Njangirde Agro-Allied Farm',
    overviewHeading: 'Our Story',
    overviewParagraphOne:
      'Baffa Njangirde Agro-Allied Farm is an integrated agricultural enterprise located in Bamaina town, Jigawa State, Nigeria.',
    overviewParagraphTwo:
      'We operate three core divisions — livestock farming, poultry farming, and fish farming — each managed with care, hygiene, and attention to detail.',
    overviewParagraphThree:
      'Our goal is to supply quality, affordable farm produce while contributing to food security and economic growth in our community.',
    missionHeading: 'Our Mission',
    missionStatement:
      'To grow agriculture and build prosperity by producing healthy livestock, poultry, and fish through sustainable, well-managed farming practices.',
    pillarsHeading: 'Our Core Values',
    pillars: COMMITMENT_PILLARS,
    imageUrl: FARM_IMAGE_ASSETS.hero,
    imageAlt: 'Baffa Njangirde Agro-Allied Farm grounds',
  },
  divisions: {
    livestock: {
      key: 'livestock',
      title: 'Livestock Farming',
      subtitle: 'Healthy cattle, rams, sheep, and goats',
      overview:
        'Our livestock division raises well-nourished cattle and small ruminants under attentive pastoral care, with clean housing, balanced forage, and fresh water.',
      details:
        'We supply households, event organisers, and meat traders with healthy animals suited to regional climate conditions. Enquire for current availability and pricing.',
      imageUrl: FARM_IMAGE_ASSETS.livestock,
      imageAlt: 'Cattle grazing on the farm pasture',
      highlights: [
        'Healthy beef cattle',
        'Rams, sheep, and goats',
        'Balanced forage and clean water',
        'Regular health monitoring',
      ],
    },
    poultry: {
      key: 'poultry',
      title: 'Poultry Farming',
      subtitle: 'Broiler chickens and fresh farm eggs',
      overview:
        'Our poultry division raises healthy broiler birds and produces clean table eggs in well-ventilated houses under disciplined daily management.',
      details:
        'We serve households, restaurants, and market vendors with both wholesale and retail supply. Contact us to place an order.',
      imageUrl: FARM_IMAGE_ASSETS.poultry,
      imageAlt: 'Broiler chickens inside a clean poultry house',
      highlights: [
        'Well-fed broiler chickens',
        'Fresh eggs by the crate',
        'Clean, ventilated housing',
        'Wholesale and retail supply',
      ],
    },
    'fish-farming': {
      key: 'fish-farming',
      title: 'Fish Farming',
      subtitle: 'Table-size catfish and grow-out stock',
      overview:
        'Our aquaculture division raises healthy African catfish in clean ponds with attentive water management and balanced nutrition.',
      details:
        'We supply fresh table-size catfish as well as juveniles for other fish farmers. Availability of pond stock is seasonal — enquire for details.',
      imageUrl: FARM_IMAGE_ASSETS.fish,
      imageAlt: 'Aquaculture fish ponds on the farm',
      highlights: [
        'Fresh table-size catfish',
        'Healthy grow-out juveniles',
        'Careful water quality management',
        'Balanced fish nutrition',
      ],
    },
  },
  products: [
    {
      id: 'prod-cattle',
      division: 'livestock',
      name: 'Healthy Beef Cattle',
      description:
        'Well-nourished cattle raised under attentive pastoral care and clean housing for households, events, and meat traders.',
      availability: 'Available on Enquiry',
      imageUrl: FARM_IMAGE_ASSETS.livestock,
      priceNgn: 450000,
      unitLabel: 'Per Head',
    },
    {
      id: 'prod-small-ruminants',
      division: 'livestock',
      name: 'Rams, Sheep & Goats',
      description:
        'Healthy small ruminants suited to regional climate conditions, cared for with balanced forage and clean water.',
      availability: 'Available on Enquiry',
      imageUrl: FARM_IMAGE_ASSETS.livestock,
      priceNgn: 95000,
      unitLabel: 'Per Head',
    },
    {
      id: 'prod-broilers',
      division: 'poultry',
      name: 'Broiler Chickens',
      description:
        'Healthy, well-fed broiler birds raised in clean ventilated houses for households, restaurants, and market vendors.',
      availability: 'Wholesale & Retail',
      imageUrl: FARM_IMAGE_ASSETS.poultry,
      priceNgn: 8500,
      unitLabel: 'Per Bird',
    },
    {
      id: 'prod-eggs',
      division: 'poultry',
      name: 'Fresh Farm Eggs (Crate of 30)',
      description:
        'Clean, farm-fresh table eggs produced under disciplined daily poultry management.',
      availability: 'Available on Enquiry',
      imageUrl: FARM_IMAGE_ASSETS.poultry,
      priceNgn: 5500,
      unitLabel: 'Per Crate',
    },
    {
      id: 'prod-catfish',
      division: 'fish-farming',
      name: 'Fresh Table-Size Catfish (1kg)',
      description:
        'Healthy African catfish raised in clean aquaculture ponds with attentive water management and balanced nutrition.',
      availability: 'Available on Enquiry',
      imageUrl: FARM_IMAGE_ASSETS.fish,
      priceNgn: 3800,
      unitLabel: 'Per Kg',
    },
    {
      id: 'prod-juveniles',
      division: 'fish-farming',
      name: 'Catfish Grow-Out Stock (Pack of 100)',
      description: 'Active, healthy pond stock nurtured under clean aquaculture practices.',
      availability: 'Seasonal Availability',
      imageUrl: FARM_IMAGE_ASSETS.fish,
      priceNgn: 15000,
      unitLabel: 'Per 100 Juveniles',
    },
  ],
  galleryIntro: {
    heading: 'Our Gallery',
    subtitle: 'A look at daily life across our livestock, poultry, and fish farming operations.',
  },
  gallery: [
    {
      id: 'gal-farm-grounds',
      title: 'Integrated Farm Grounds',
      caption: 'An overview of the Baffa Njangirde Agro-Allied Farm in Bamaina town.',
      category: 'Farm Grounds',
      imageUrl: FARM_IMAGE_ASSETS.hero,
    },
    {
      id: 'gal-livestock',
      title: 'Livestock Pasture',
      caption: 'Cattle grazing under attentive pastoral care.',
      category: 'Livestock Farming',
      imageUrl: FARM_IMAGE_ASSETS.livestock,
    },
    {
      id: 'gal-poultry',
      title: 'Broiler House',
      caption: 'Healthy broiler birds in a clean, ventilated poultry house.',
      category: 'Poultry Farming',
      imageUrl: FARM_IMAGE_ASSETS.poultry,
    },
    {
      id: 'gal-fish',
      title: 'Aquaculture Ponds',
      caption: 'Well-managed fish ponds raising healthy African catfish.',
      category: 'Fish Farming',
      imageUrl: FARM_IMAGE_ASSETS.fish,
    },
  ],
  contact: {
    heroTitle: 'Contact Us',
    heroSubtitle: 'We would love to hear from you — enquiries, orders, and partnerships are welcome.',
    directHeading: 'Reach Us Directly',
    directDescription:
      'Call, WhatsApp, or email our team for product availability, pricing, and delivery arrangements.',
    formHeading: 'Send an Enquiry',
    formDescription:
      'Fill in the form below and our team will get back to you as soon as possible.',
    whatsappBannerHeading: 'Prefer WhatsApp?',
    whatsappBannerText: 'Chat with us instantly for quick responses on orders and enquiries.',
  },
};
