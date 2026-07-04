/**
 * Animation Utilities
 * Provides consistent animation configs and helpers across the app
 */

export const AnimationConfig = {
  // Button press animations
  button: {
    press: {
      scale: 0.97,
      duration: 100,
    },
    release: {
      scale: 1,
      duration: 150,
    },
  },
  
  // Card animations
  card: {
    press: {
      scale: 0.98,
      duration: 100,
    },
    release: {
      scale: 1,
      duration: 150,
    },
  },

  // Selection animations
  selection: {
    duration: 200,
    scale: 1.02,
  },

  // Fade animations
  fade: {
    in: { duration: 300, from: 0, to: 1 },
    out: { duration: 200, from: 1, to: 0 },
  },

  // Slide animations
  slide: {
    duration: 300,
    distance: 20,
  },
};

// Haptic feedback helper (for native apps)
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  // This would use expo-haptics in a real implementation
  // For now, it's a placeholder that can be extended
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
    };
    navigator.vibrate(patterns[type]);
  }
};

// Spring animation config for React Native Reanimated
export const springConfig = {
  damping: 15,
  stiffness: 150,
  mass: 0.5,
};

export const easeInOutConfig = {
  duration: 300,
  easing: 'ease-in-out' as const,
};
