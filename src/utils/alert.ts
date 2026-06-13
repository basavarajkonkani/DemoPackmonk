import { Platform, Alert } from 'react-native';

type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

/**
 * Cross-platform alert utility.
 * On web, falls back to window.alert / window.confirm since
 * React Native's Alert.alert is mobile-only.
 */
export const showAlert = (
  title: string,
  message?: string,
  buttons?: AlertButton[]
): void => {
  if (Platform.OS === 'web') {
    const fullMessage = message ? `${title}\n\n${message}` : title;
    if (buttons && buttons.length > 1) {
      // Find cancel and confirm buttons
      const confirmBtn = buttons.find((b) => b.style !== 'cancel');
      const ok = window.confirm(fullMessage);
      if (ok && confirmBtn?.onPress) {
        confirmBtn.onPress();
      } else {
        const cancelBtn = buttons.find((b) => b.style === 'cancel');
        if (!ok && cancelBtn?.onPress) {
          cancelBtn.onPress();
        }
      }
    } else {
      window.alert(fullMessage);
      if (buttons?.[0]?.onPress) {
        buttons[0].onPress();
      }
    }
  } else {
    Alert.alert(title, message, buttons);
  }
};
