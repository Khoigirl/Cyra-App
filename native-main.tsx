
import React, { useState, useRef, useMemo } from 'react';
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  ActivityIndicator, 
  Text, 
  TouchableOpacity,
  StatusBar,
  Platform 
} from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';

declare var require: any;
declare var __DEV__: boolean;

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);

  const webAppUri = useMemo(() => {
    const debuggerHost = Constants.expoConfig?.hostUri;
    if (__DEV__ && debuggerHost) {
      const ip = debuggerHost.split(':')[0];
      return `http://${ip}:8081`;
    }
    return null;
  }, []);

  const handleWebViewMessage = async (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      
      // Haptic Bridge
      if (message.type === 'HAPTIC') {
        switch (message.style) {
          case 'light':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          case 'medium':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          case 'heavy':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
          case 'success':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          case 'warning':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            break;
          case 'error':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
        }
      }

      if (message.type === 'RESTORE_PURCHASES') {
        alert("Checking App Store for previous subscriptions...");
      }
    } catch (e) {
      console.error('Bridge error:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="dark" />
      <StatusBar barStyle="dark-content" />
      
      {error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>Connection Required</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => { setError(null); webViewRef.current?.reload(); }}>
            <Text style={styles.retryButtonText}>RETRY</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <WebView
            ref={webViewRef}
            source={
              webAppUri 
                ? { uri: webAppUri } 
                : Platform.OS === 'ios' 
                  ? require('./web-build/index.html') 
                  : { uri: 'file:///android_asset/web-build/index.html' }
            }
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
            onMessage={handleWebViewMessage}
            style={styles.webview}
          />
          {isLoading && (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#8FAF9D" />
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F4F1' },
  webview: { flex: 1, backgroundColor: 'transparent' },
  centerContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F4F1' },
  errorTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 20 },
  retryButton: { backgroundColor: '#8FAF9D', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  retryButtonText: { color: 'white', fontWeight: '800' }
});

export default App;
