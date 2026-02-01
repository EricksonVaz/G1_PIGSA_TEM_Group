import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cv.pigsa.smsserver',
  appName: 'PIGSA SMS Server',
  webDir: 'www',
  server:{
    url:'http://10.228.125.220:4755',
    "cleartext": true
  }
};

export default config;
