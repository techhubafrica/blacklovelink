import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.blacklovelink.app',
  appName: 'BlackLoveLink',
  webDir: 'dist',
  // When running on a real device during development, point to your local/Vercel URL
  // Comment this out for production builds
  // server: {
  //   url: 'https://blacklovelink.vercel.app',
  //   cleartext: true,
  // },
  android: {
    allowMixedContent: false,
    backgroundColor: '#141720',
    // Enables edge-to-edge rendering
    captureInput: false,
  },
  plugins: {
    // Splash screen config (uses native splash in Capacitor)
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: '#141720',
      androidSplashResourceName: 'splash',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    // Status bar — transparent overlay on Android
    StatusBar: {
      style: 'dark',
      backgroundColor: '#00000000',
    },
  },
};

export default config;
