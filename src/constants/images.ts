/**
 * Centralized local image assets for consistent use across the app.
 * All product images are mapped here to ensure consistency across screens.
 */
export const IMAGES = {
  // Logo & Branding
  logo: require('../../assets/logo (2).png'),
  pacmonkLogo: require('../../assets/Pacmonk.png'),
  
  // Banners
  offerBanner: require('../../assets/offer-banner.jpg.jpeg'),
  bannerDesign: require('../../assets/banner-design.jpg.jpeg'),
  bannerDesign1: require('../../assets/banner-design-1.jpg.jpeg'),
  bannerPrint: require('../../assets/banner-for-custom-print.jpg.jpeg'),
  
  // Basic Pouch Products
  batterPouch: require('../../assets/batter-pouch.jpg.jpeg'),
  centerSealPouch: require('../../assets/center-seal-pouch.jpg.jpeg'),
  plainPouch: require('../../assets/plain pouch.png'),
  plainPouchWindow: require('../../assets/plain pouch with window-pouch.png'),
  kraftPouch: require('../../assets/kraft-pouch.png'),
  kraftWindowPouch: require('../../assets/kraft-window-pouch.png'),
  printedStandupPouch: require('../../assets/printed standup pouch.jpg.jpeg'),
  
  // Gold Standy Pouches
  goldStandyPouch: require('../../assets/GOLD-STANDY-POUCH.jpg.jpeg'),
  goldStandyZipperPouch: require('../../assets/GOLD-STANDY-ZIPPER-POUCH.jpg.jpeg'),
  
  // Silver Standy Pouches
  silverStandyPouch: require('../../assets/SILVER-STANDY-POUCH.jpg.jpeg'),
  silverStandyZipperPouch: require('../../assets/SILVER-STANDY-ZIPPER-POUCH.jpg.jpeg'),
  
  // Milky Standy Pouches
  milkyStandyPouch: require('../../assets/MILKY-STANDY-POUCH.jpg.jpeg'),
  milkyStandyZipperPouch: require('../../assets/MILKY-STANDY-ZIPPER-POUCH.jpg.jpeg'),
  
  // Kraft Standy Pouches
  kraftStandyPouchBrown: require('../../assets/KRAFT-STANDY-POUCH-(BROWN).jpg.jpeg'),
  kraftWindowStandyPouchBrown: require('../../assets/KRAFT-WINDOW-STANDY-POUCH-(BROWN).jpg.jpeg'),
  kraftWindowStandyPouchWhite: require('../../assets/KRAFT-WINDOW-STANDY-POUCH-(WHITE).jpg.jpeg'),
  
  // Packaging Products
  boxes: require('../../assets/boxes.jpg.jpeg'),
  
  // Material Options
  metalised: require('../../assets/with-metalised.jpg.jpeg'),
  withoutMetalised: require('../../assets/without metalised.jpg.jpeg'),
} as const;

/** Pouch type thumbnails for plain / printed / kraft */
export const POUCH_TYPE_IMAGES = {
  plain: IMAGES.plainPouch,
  printed: IMAGES.printedStandupPouch,
  kraft: IMAGES.kraftPouch,
  'kraft-brown': IMAGES.kraftStandyPouchBrown,
  'kraft-window-brown': IMAGES.kraftWindowStandyPouchBrown,
  'kraft-window-white': IMAGES.kraftWindowStandyPouchWhite,
  'clear-standy': IMAGES.silverStandyPouch,
  'silver-standy': IMAGES.silverStandyPouch,
  'silver-zipper': IMAGES.silverStandyZipperPouch,
  'milky-standy': IMAGES.milkyStandyPouch,
  'milky-zipper': IMAGES.milkyStandyZipperPouch,
  'gold-standy': IMAGES.goldStandyPouch,
  'gold-zipper': IMAGES.goldStandyZipperPouch,
  'flat-clear': IMAGES.plainPouch,
  'flat-silver': IMAGES.silverStandyPouch,
  'flat-clear-silver': IMAGES.plainPouchWindow,
  'matt-standy': IMAGES.silverStandyPouch,
  'matt-window-standy': IMAGES.kraftWindowStandyPouchBrown,
  'idly-dosa': IMAGES.batterPouch,
} as const;

/** Category-specific product images */
export const CATEGORY_IMAGES = {
  box: IMAGES.boxes,
  mailer: IMAGES.kraftWindowStandyPouchBrown,
  bag: IMAGES.silverStandyZipperPouch,
  tape: IMAGES.batterPouch,
  pouch: IMAGES.silverStandyPouch,
  'standy-pouch': IMAGES.goldStandyZipperPouch,
} as const;

/** Product-specific images based on product ID or type */
export const PRODUCT_IMAGES: Record<string, any> = {
  // Boxes
  'corrugated-shipping-box': IMAGES.boxes,
  'mailer-box': IMAGES.boxes,
  'rigid-gift-box': IMAGES.boxes,
  
  // Mailers & Pouches
  'kraft-bubble-mailer': IMAGES.kraftWindowStandyPouchWhite,
  'flat-bottom-pouch': IMAGES.kraftStandyPouchBrown,
  'center-seal-pouch': IMAGES.centerSealPouch,
  'batter-pouch': IMAGES.batterPouch,
  
  // Plain & Basic Pouches
  'plain-pouch': IMAGES.milkyStandyPouch,
  'plain-window-pouch': IMAGES.kraftWindowStandyPouchWhite,
  'kraft-pouch': IMAGES.kraftStandyPouchBrown,
  'kraft-window-pouch': IMAGES.kraftWindowStandyPouchBrown,
  
  // Stand-up Pouches
  'stand-up-pouch': IMAGES.goldStandyZipperPouch,
  'printed-standup-pouch': IMAGES.silverStandyZipperPouch,
  'compostable-mailer': IMAGES.kraftStandyPouchBrown,
  'laminated-roll': IMAGES.centerSealPouch,
  
  // Gold Standy Pouches
  'gold-standy-pouch': IMAGES.goldStandyPouch,
  'gold-standy-zipper-pouch': IMAGES.goldStandyZipperPouch,
  
  // Silver Standy Pouches
  'silver-standy-pouch': IMAGES.silverStandyPouch,
  'silver-standy-zipper-pouch': IMAGES.silverStandyZipperPouch,
  
  // Milky Standy Pouches
  'milky-standy-pouch': IMAGES.milkyStandyPouch,
  'milky-standy-zipper-pouch': IMAGES.milkyStandyZipperPouch,
  
  // Kraft Standy Pouches
  'kraft-standy-pouch-brown': IMAGES.kraftStandyPouchBrown,
  'kraft-window-standy-pouch-brown': IMAGES.kraftWindowStandyPouchBrown,
  'kraft-window-standy-pouch-white': IMAGES.kraftWindowStandyPouchWhite,
  
  // Tape
  'reinforced-paper-tape': IMAGES.batterPouch,
  'bopp-tape': IMAGES.centerSealPouch,
  
  // Material Options
  'with-metalised': IMAGES.metalised,
  'without-metalised': IMAGES.withoutMetalised,
} as const;

/**
 * Helper function to get product image by ID or type
 * Falls back to category image if specific product image not found
 */
export const getProductImage = (productId: string, category?: string): any => {
  // First try exact product ID match
  if (PRODUCT_IMAGES[productId]) {
    return PRODUCT_IMAGES[productId];
  }
  
  // Try category fallback
  if (category && CATEGORY_IMAGES[category as keyof typeof CATEGORY_IMAGES]) {
    return CATEGORY_IMAGES[category as keyof typeof CATEGORY_IMAGES];
  }
  
  // Default fallback - use premium client image
  return IMAGES.silverStandyPouch;
};

/**
 * Helper function to get pouch type image
 */
export const getPouchTypeImage = (pouchType: string): any => {
  const type = pouchType.toLowerCase();
  if (POUCH_TYPE_IMAGES[type as keyof typeof POUCH_TYPE_IMAGES]) {
    return POUCH_TYPE_IMAGES[type as keyof typeof POUCH_TYPE_IMAGES];
  }
  return IMAGES.goldStandyPouch;
};
