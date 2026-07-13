/**
 * Centralized utility for calculating consistent layout heights across the app.
 * This ensures all screens properly reserve space for fixed bottom components.
 */

import { Platform, useSafeAreaInsets } from 'react-native';

/**
 * Bottom Tab Navigator heights - MUST match RootNavigator.tsx tabBarStyle
 */
export const TAB_BAR_HEIGHTS = {
  ios: 85,      // iOS: 24px safe area + 61px content
  android: 65,  // Android: no safe area
  web: 70,      // Web: fixed height
};

/**
 * Add to Cart / Sticky Footer heights
 */
export const STICKY_FOOTER_HEIGHTS = {
  ios: 82,      // Base height for content + padding
  android: 82,  // Fixed height
  web: 82,      // Fixed height
};

/**
 * Get the actual tab bar height for the current platform
 */
export const getTabBarHeight = (): number => {
  return Platform.select({
    ios: TAB_BAR_HEIGHTS.ios,
    android: TAB_BAR_HEIGHTS.android,
    web: TAB_BAR_HEIGHTS.web,
    default: TAB_BAR_HEIGHTS.web,
  });
};

/**
 * Get the actual sticky footer height for the current platform
 */
export const getStickyFooterHeight = (): number => {
  return Platform.select({
    ios: STICKY_FOOTER_HEIGHTS.ios,
    android: STICKY_FOOTER_HEIGHTS.android,
    web: STICKY_FOOTER_HEIGHTS.web,
    default: STICKY_FOOTER_HEIGHTS.web,
  });
};

/**
 * Calculate total bottom padding needed for ScrollView when only tab bar is present
 * Used by: HomeScreen, ProductsScreen, OrdersScreen, etc.
 */
export const getScrollViewBottomPaddingWithTabBar = (): number => {
  const tabBarHeight = getTabBarHeight();
  return tabBarHeight + 20; // Add 20px buffer for comfortable spacing
};

/**
 * Calculate total bottom padding needed for ScrollView when BOTH tab bar AND sticky footer are present
 * Used by: ProductDetailScreen, ReadyStockProductDetailScreen, etc.
 */
export const getScrollViewBottomPaddingWithTabBarAndFooter = (): number => {
  const tabBarHeight = getTabBarHeight();
  const stickyFooterHeight = getStickyFooterHeight();
  return tabBarHeight + stickyFooterHeight + 20; // Add 20px buffer for comfortable spacing
};

/**
 * Calculate bottom action bar position above tab bar
 * Returns the bottom position value for positioned elements
 */
export const getActionBarBottomPosition = (): number => {
  return getTabBarHeight();
};

/**
 * Hook to get safe area insets and calculate total bottom padding
 * For use in screens with sticky footers
 */
export const useBottomLayoutCalculations = () => {
  const insets = useSafeAreaInsets();
  
  return {
    tabBarHeight: getTabBarHeight(),
    stickyFooterHeight: getStickyFooterHeight(),
    safeAreaBottom: insets.bottom,
    scrollViewPaddingWithTabBar: getScrollViewBottomPaddingWithTabBar(),
    scrollViewPaddingWithTabBarAndFooter: getScrollViewBottomPaddingWithTabBarAndFooter(),
    actionBarBottomPosition: getActionBarBottomPosition(),
  };
};
