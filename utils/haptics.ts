
/**
 * Triggers haptic feedback via the React Native WebView bridge.
 * Fails gracefully in a standard browser environment.
 */
export type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export const triggerHaptic = (style: HapticStyle = 'light') => {
  if ((window as any).ReactNativeWebView) {
    (window as any).ReactNativeWebView.postMessage(
      JSON.stringify({ type: 'HAPTIC', style })
    );
  } else {
    // Optional: console.log('Haptic simulated:', style);
  }
};
