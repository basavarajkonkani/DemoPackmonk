/**
 * Centralized local image assets for consistent use across the app.
 */
export const IMAGES = {
  logo: require('../../assets/logo (1).png'),
  pacmonkLogo: require('../../assets/Pacmonk.png'),
  offerBanner: require('../../assets/offer-banner.jpg.jpeg'),
  bannerDesign: require('../../assets/banner-design.jpg.jpeg'),
  batterPouch: require('../../assets/batter-pouch.jpg.jpeg'),
  centerSealPouch: require('../../assets/center-seal-pouch.jpg.jpeg'),
  bannerPrint: require('../../assets/banner-for-custom-print.jpg.jpeg'),
  plainPouch: require('../../assets/plain pouch.png'),
  plainPouchWindow: require('../../assets/plain pouch with window-pouch.png'),
  kraftPouch: require('../../assets/kraft-pouch.png'),
  kraftWindowPouch: require('../../assets/kraft-window-pouch.png'),
  standupPouch: require('../../assets/printed standup pouch.jpg.jpeg'),
  boxes: require('../../assets/boxes.jpg.jpeg'),
  metalised: require('../../assets/with-metalised.jpg.jpeg'),
  withoutMetalised: require('../../assets/without metalised.jpg.jpeg'),
} as const;

/** Pouch type thumbnails for plain / printed / kraft */
export const POUCH_TYPE_IMAGES = {
  plain: IMAGES.plainPouch,
  printed: IMAGES.standupPouch,
  kraft: IMAGES.kraftPouch,
} as const;
