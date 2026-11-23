import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rutftalentico.app',
  appName: 'RUTF Talentico',
  webDir: 'public',
  server: {
    url: 'https://rutf-talentico.vercel.app',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
