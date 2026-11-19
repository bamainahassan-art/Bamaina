import { SiteContent } from '../types/site';

export const FARM_IMAGE_ASSETS = {
  emblem: '/assets/aistudio/Baffa_Njangirde_Agro_Farm_Emblem_297c11fa.png',
  hero: '/src/assets/images/hero_integrated_farm_1795091831726.jpg',
  livestock: '/src/assets/images/livestock_pasture_cattle_1795091831949.jpg',
  poultry: '/src/assets/images/poultry_broiler_house_1795091831037.jpg',
  fish: '/src/assets/images/aquaculture_fish_ponds_1795091831987.jpg',
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  business: {
    name: 'BAFFA NJANGIRDE AGRO-ALLIED FARM',
    shortName: 'Baffa Njangirde',
    slogan: 'Growing Agriculture, Building Prosperity.',
    location: 'Bamaina town, Jigawa State, Nigeria',
    phoneDisplay: '08065494739',
    phoneHref: 'tel:08065494739',
    whatsappNumber: '+2348065494739',
    whatsappUrl: 'https://wa.me/2348065494739',
    emblemUrl: FARM_IMAGE_ASSETS.emblem,
  },
  homeHero: {
    eyebrow: 'Bamaina town, Jigawa State, Nigeria',
    headline: 'Baffa Njangirde Agro-Allied Farm',
    welcomeMessage:
      'Welcome to Baffa Njangirde Agro-Allied Farm — a Nigerian agricultural enterprise dedicated to responsible livestock farming, poultry production, and fish farming for households, traders, and communities.',
    primaryCtaLabel: 'Chat on WhatsApp',
    secondaryCtaLabel: 'Call 08065494739',
    heroImage: FARM_IMAGE_ASSETS.hero,
    heroImageAlt:
      'Integrated agricultural operations at Baffa Njangirde Agro-Allied Farm featuring grazing cattle, poultry housing, and aquaculture ponds',
  },
  homeIntro: {
    heading: 'Rooted in Practical Farming Across Three Essential Pillars',
    subheading: 'Agricultural Enterprise in Jigawa State',
    bodyPrimary:
      'Located in Bamaina town, Jigawa State, Nigeria, Baffa Njangirde Agro-Allied Farm brings together livestock husbandry, modern poultry management, and structured fish farming under attentive daily care.',
    bodySecondary:
      'We focus on steady food production, clean farm management, and dependable direct communication with buyers and partners across the region.',
  },
  homeCommitment: {
    heading: 'Our Guiding Standards',
    subheading: 'Built around everyday discipline and customer trust',
    pillars: [
      {
        id: 'quality-farming',
        number: '01',
        title: 'Quality Farming',
        description:
          'Attentive animal care, clean housing and pond environments, and balanced feeding practices across every division of the farm.',
      },
      {
        id: 'food-production',
        number: '02',
        title: 'Dependable Food Production',
        description:
          'Consistent agricultural output in meat, poultry, and fresh fish to support local families, markets, and food distributors.',
      },
      {
        id: 'agricultural-development',
        number: '03',
        title: 'Agricultural Development',
        description:
          'Contributing practical agricultural productivity and steady supply chains within Bamaina town and Jigawa State.',
      },
      {
        id: 'customer-satisfaction',
        number: '04',
        title: 'Customer Satisfaction',
        description:
          'Honest communication, straightforward enquiries by phone or WhatsApp, and reliable service for every customer.',
      },
    ],
  },
  homeCtaBanner: {
    heading: 'Ready to Discuss Livestock, Poultry, or Fish Supply?',
    description:
      'Reach our team directly from Bamaina town, Jigawa State by telephone or WhatsApp to ask about current farm availability and enquiries.',
    whatsappButtonLabel: 'Message Us on WhatsApp',
    contactButtonLabel: 'Open Enquiry Form',
  },
  about: {
    heroTitle: 'About Baffa Njangirde Agro-Allied Farm',
    heroSubtitle:
      'A Nigerian agricultural enterprise committed to quality farming, food production, agricultural development, and customer satisfaction.',
    overviewHeading: 'Who We Are',
    overviewParagraphOne:
      'Baffa Njangirde Agro-Allied Farm operates from Bamaina town, Jigawa State, Nigeria, bringing together three vital areas of agricultural production: Livestock Farming, Poultry Farming, and Fish Farming.',
    overviewParagraphTwo:
      'Our work is grounded in hands-on stewardship—maintaining healthy animals, clean farm facilities, and disciplined feeding routines so our customers receive wholesome agricultural produce they can rely on.',
    overviewParagraphThree:
      'Whether serving household buyers, market traders, or hospitality and food vendors, we remain focused on responsive service and direct communication.',
    missionHeading: 'Our Purpose',
    missionStatement:
      'Growing Agriculture, Building Prosperity — through disciplined livestock, poultry, and aquaculture operations that strengthen local food availability and deliver lasting value to our customers.',
    pillarsHeading: 'What Guides Our Farm Operations',
    pillars: [
      {
        id: 'about-quality',
        number: '01',
        title: 'Quality Farming Practices',
        description:
          'Careful daily supervision, hygienic enclosures, and nutritious feed management across our cattle, poultry, and fish divisions.',
      },
      {
        id: 'about-food',
        number: '02',
        title: 'Consistent Food Production',
        description:
          'Supporting regional protein and food supply through integrated multi-branch farming tailored to local needs.',
      },
      {
        id: 'about-dev',
        number: '03',
        title: 'Agricultural Development',
        description:
          'Practising structured, sustainable agro-allied operations in Bamaina town and across Jigawa State.',
      },
      {
        id: 'about-customer',
        number: '04',
        title: 'Customer Satisfaction',
        description:
          'Direct, transparent engagement with every buyer via telephone and WhatsApp for timely responses and clear arrangements.',
      },
    ],
    imageUrl: FARM_IMAGE_ASSETS.hero,
    imageAlt: 'Overview of Baffa Njangirde Agro-Allied Farm grounds and agricultural operations',
  },
  divisions: {
    livestock: {
      key: 'livestock',
      title: 'Livestock Farming',
      subtitle: 'Healthy cattle, sheep, and goats raised with attentive pastoral care.',
      overview:
        'Our Livestock Farming division focuses on the structured rearing and care of cattle and small ruminants suited to the Jigawa State environment. Animals are managed with balanced nutrition, clean shelter, and consistent daily observation.',
      details:
        'We serve customers seeking healthy livestock for household, community, and commercial needs, offering direct communication and transparent arrangement from our farm in Bamaina town.',
      imageUrl: FARM_IMAGE_ASSETS.livestock,
      imageAlt: 'Healthy cattle and goats grazing on green pasture at Baffa Njangirde Agro-Allied Farm',
      highlights: [
        'Attentive daily herd supervision and clean resting areas',
        'Balanced forage and supplementary feeding routines',
        'Cattle, rams, sheep, and goats raised with proper care',
        'Direct buyer enquiries via phone and WhatsApp',
      ],
    },
    poultry: {
      key: 'poultry',
      title: 'Poultry Farming',
      subtitle: 'Well-managed broiler and layer production in ventilated farm housing.',
      overview:
        'Our Poultry Farming division is structured around clean, well-ventilated poultry houses designed to keep birds healthy and comfortable. We maintain disciplined biosecurity, clean water access, and quality poultry feed.',
      details:
        'From meat-producing broilers to laying flocks and fresh farm eggs, our poultry operation supports households, caterers, and market buyers looking for dependable poultry supply.',
      imageUrl: FARM_IMAGE_ASSETS.poultry,
      imageAlt: 'Clean ventilated poultry house with healthy broilers and laying hens',
      highlights: [
        'Clean, airy poultry housing with proper litter management',
        'Nutritious feed and fresh water supplied daily',
        'Broiler birds, laying hens, and farm-fresh table eggs',
        'Wholesale and retail buyer enquiries welcomed',
      ],
    },
    'fish-farming': {
      key: 'fish-farming',
      title: 'Fish Farming',
      subtitle: 'Structured aquaculture ponds producing fresh, healthy African catfish.',
      overview:
        'Our Fish Farming division focuses on responsible aquaculture management, maintaining clean pond water, proper stocking care, and balanced fish nutrition for steady, healthy growth.',
      details:
        'We supply fresh table-size catfish and aquaculture stock to local markets, food vendors, and households across Bamaina town and neighbouring communities in Jigawa State.',
      imageUrl: FARM_IMAGE_ASSETS.fish,
      imageAlt: 'Clean aquaculture ponds with healthy African catfish surfacing at feeding time',
      highlights: [
        'Managed aquaculture ponds with attentive water quality care',
        'Nutritious floating feed schedules for healthy fish growth',
        'Fresh table-size catfish available for direct enquiry',
        'Careful sorting and handling for buyers and traders',
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
    },
    {
      id: 'prod-small-ruminants',
      division: 'livestock',
      name: 'Rams, Sheep & Goats',
      description:
        'Healthy small ruminants suited to regional climate conditions, cared for with balanced forage and clean water.',
      availability: 'Available on Enquiry',
      imageUrl: FARM_IMAGE_ASSETS.livestock,
    },
    {
      id: 'prod-broilers',
      division: 'poultry',
      name: 'Broiler Chickens',
      description:
        'Healthy, well-fed broiler birds raised in clean ventilated houses for households, restaurants, and market vendors.',
      availability: 'Wholesale & Retail Enquiry',
      imageUrl: FARM_IMAGE_ASSETS.poultry,
    },
    {
      id: 'prod-eggs',
      division: 'poultry',
      name: 'Fresh Farm Eggs & Layers',
      description:
        'Clean, farm-fresh table eggs and well-cared-for laying hens produced under disciplined daily poultry management.',
      availability: 'Available on Enquiry',
      imageUrl: FARM_IMAGE_ASSETS.poultry,
    },
    {
      id: 'prod-catfish',
      division: 'fish-farming',
      name: 'Fresh Table-Size Catfish',
      description:
        'Healthy African catfish raised in clean aquaculture ponds with attentive water management and balanced nutrition.',
      availability: 'Available on Enquiry',
      imageUrl: FARM_IMAGE_ASSETS.fish,
    },
    {
      id: 'prod-juveniles',
      division: 'fish-farming',
      name: 'Catfish Grow-Out Stock',
      description:
        'Active, healthy pond stock nurtured under clean aquaculture practices. Contact us directly to confirm current batch readiness.',
      availability: 'Seasonal Availability',
      imageUrl: FARM_IMAGE_ASSETS.fish,
    },
  ],
  galleryIntro: {
    heading: 'Our Farm Gallery',
    subtitle:
      'Visual moments from our livestock pastures, poultry houses, aquaculture ponds, and daily agricultural operations in Bamaina town, Jigawa State.',
  },
  gallery: [
    {
      id: 'gal-1',
      title: 'Integrated Agro-Allied Farm Grounds',
      caption: 'Morning view across our livestock pastures, poultry houses, and fish ponds in Jigawa State.',
      category: 'Farm Grounds',
      imageUrl: FARM_IMAGE_ASSETS.hero,
    },
    {
      id: 'gal-2',
      title: 'Pastoral Cattle & Goat Herd',
      caption: 'Healthy cattle and goats grazing peacefully in open green pasture.',
      category: 'Livestock Farming',
      imageUrl: FARM_IMAGE_ASSETS.livestock,
    },
    {
      id: 'gal-3',
      title: 'Ventilated Poultry House',
      caption: 'Clean poultry litter, bright natural daylight, and well-fed broiler and layer flocks.',
      category: 'Poultry Farming',
      imageUrl: FARM_IMAGE_ASSETS.poultry,
    },
    {
      id: 'gal-4',
      title: 'Aquaculture Catfish Ponds',
      caption: 'Clean fish ponds during feeding time with healthy African catfish.',
      category: 'Fish Farming',
      imageUrl: FARM_IMAGE_ASSETS.fish,
    },
    {
      id: 'gal-5',
      title: 'Official Farm Emblem',
      caption: 'Baffa Njangirde Agro-Allied Farm — Growing Agriculture, Building Prosperity.',
      category: 'Farm Grounds',
      imageUrl: FARM_IMAGE_ASSETS.emblem,
    },
  ],
  contact: {
    heroTitle: 'Contact Baffa Njangirde Agro-Allied Farm',
    heroSubtitle:
      'We welcome enquiries regarding livestock farming, poultry production, and fish farming in Bamaina town, Jigawa State, Nigeria.',
    directHeading: 'Direct Farm Contact Details',
    directDescription:
      'Reach us directly by phone or WhatsApp for timely information on livestock, poultry, and fish availability.',
    formHeading: 'Send an Enquiry',
    formDescription:
      'Complete the form below with your enquiry details. You can submit your message here or forward it directly to our WhatsApp desk.',
    whatsappBannerHeading: 'Prefer Instant Messaging?',
    whatsappBannerText:
      'Connect directly with Baffa Njangirde Agro-Allied Farm on WhatsApp (+2348065494739) for quick responses.',
  },
};
