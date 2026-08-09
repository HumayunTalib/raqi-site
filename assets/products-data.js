/* Shop-grid source of truth for the 4 real RAQI codes.
   product-*.html pages are hand-authored separately for SEO/OG/link-preview
   correctness (WhatsApp/social scrapers don't run JS) — update BOTH when a
   price, color, or spec changes. Never add a product/color/spec here that
   isn't confirmed real. */
var RAQI_PRODUCTS = [
  {
    code: 'Safa',
    id: 'RQ-S1',
    slug: 'safa',
    season: 'Spring / Summer',
    seasonTag: 'summer',
    character: 'Standing',
    characterTag: 'standing',
    tagline: 'The dry-hand opener',
    desc: 'Micro-crepe weave with a dry, springy hand that stands slightly away from the body. The first fabric to put in a client’s hand.',
    gsm: 150,
    sett: '108 × 76',
    price: 400,
    source: 'ENZO Bluebird — Summer (BB-04, 20% Viscose / 80% Polyester)',
    image: 'https://enzolhr.com/assets/products/bb-04-summer.webp',
    colors: [
      { name: 'Sky Blue', hex: '#6EB0D8' },
      { name: 'Mint', hex: '#A8D8C8' },
      { name: 'Pearl White', hex: '#F5F0E8' },
      { name: 'Sand', hex: '#C4A882' },
      { name: 'Powder Blue', hex: '#B8D8EE' },
      { name: 'Sage', hex: '#9AAF88' },
      { name: 'Light Grey', hex: '#C0C0C0' },
      { name: 'Ivory', hex: '#FFFFF0' }
    ]
  },
  {
    code: 'Noor',
    id: 'RQ-S2',
    slug: 'noor',
    season: 'Summer / Mid-Season',
    seasonTag: 'summer',
    character: 'Fluid',
    characterTag: 'fluid',
    tagline: 'The evening code',
    desc: 'Fluid, weighted fall engineered for hall lighting — scatters light rather than flashing under LED or tungsten.',
    gsm: 166,
    sett: '128 × 84',
    price: 500,
    source: 'ENZO Nova Silk (NS-01, Boski, 70% Viscose / 30% Polyester)',
    image: 'https://enzolhr.com/assets/products/ns-01.webp',
    colors: [
      { name: 'Midnight', hex: '#1A1F2E' }
    ]
  },
  {
    code: 'Waqar',
    id: 'RQ-W3',
    slug: 'waqar',
    season: 'Autumn / Winter',
    seasonTag: 'winter',
    character: 'Structural',
    characterTag: 'structural',
    tagline: 'The structural code',
    desc: 'Poly-wool worsted that holds a pressed pleat and a sculptural fold. The range’s quiet authority piece.',
    gsm: 247,
    sett: '96 × 72',
    price: 400,
    source: 'ENZO Wostar Wool (WW-07, Wool Blend, Winter Weight)',
    image: 'https://enzolhr.com/assets/products/ww-07.webp',
    colors: [
      { name: 'Charcoal', hex: '#3A3A3A' },
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Slate', hex: '#6B7C8A' },
      { name: 'Deep Brown', hex: '#4A2C1A' },
      { name: 'Forest', hex: '#2D4A2D' },
      { name: 'Midnight Blue', hex: '#1A2B45' },
      { name: 'Burgundy', hex: '#800020' },
      { name: 'Stone', hex: '#8A8070' }
    ]
  },
  {
    code: 'Daim',
    id: 'RQ-A4',
    slug: 'daim',
    season: 'All-Season',
    seasonTag: 'all-season',
    character: 'Neutral',
    characterTag: 'neutral',
    tagline: 'The daily driver',
    desc: 'Balanced, wash-and-wear construction with no knee or seat memory at hour twelve. The permanent core.',
    gsm: 192,
    sett: '124 × 88',
    price: 400,
    source: 'ENZO Bluebird — Winter (BB-04, 20% Viscose / 80% Polyester)',
    image: 'https://enzolhr.com/assets/products/bb-04-winter.webp',
    colors: [
      { name: 'Deep Navy', hex: '#1A2B45' },
      { name: 'Graphite', hex: '#4A4A4A' },
      { name: 'Rust', hex: '#8B3A2A' },
      { name: 'Olive', hex: '#4A5A2A' },
      { name: 'Plum', hex: '#6B2B5A' },
      { name: 'Teal', hex: '#1A5A5A' },
      { name: 'Dark Khaki', hex: '#6B6040' },
      { name: 'Ink', hex: '#1A1A2E' }
    ]
  }
];
