import useBytes from "@ogen-composables/useBytes";

export interface IDevice {
  userAgent: string;
  platform: string;
  language: string;
  cookiesEnabled: boolean;
  onlineStatus: boolean;
  screenWidth: number;
  screenHeight: number;
  windowWidth: number;
  windowHeight: number;
  colorDepth: number;
  deviceMemory: string;
  hardwareConcurrency: number | 'unknown';
  maxTouchPoints: number | 'unknown';
  vendor: string;
  product: string;
  appName: string;
  appVersions: { name: string, version: string }[];
  productSub: string;
  brands: string[];
  mimeTypes: string[];
  plugins: string[];

  getBytes(): typeof useBytes;
  isPhone(): boolean;
}

class Device implements IDevice {
  appName: string;
  uniqId?: string;
  userAgent: string;
  platform: string;
  language: string;
  cookiesEnabled: boolean;
  onlineStatus: boolean;
  screenWidth: number;
  screenHeight: number;
  windowWidth: number;
  windowHeight: number;
  colorDepth: number;
  deviceMemory: string;
  hardwareConcurrency: number | 'unknown';
  maxTouchPoints: number | 'unknown';
  vendor: string;
  product: string;
  appVersions: { name: string, version: string }[];
  productSub: string;
  brands: string[];
  mimeTypes: string[];
  plugins: string[];

  constructor() {
    this.userAgent = navigator.userAgent;
    this.platform = navigator.platform;
    this.language = navigator.language || (navigator as any).userLanguage;
    this.cookiesEnabled = navigator.cookieEnabled;
    this.onlineStatus = navigator.onLine;
    this.screenWidth = window.screen.width;
    this.screenHeight = window.screen.height;
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.colorDepth = window.screen.colorDepth;
    this.deviceMemory = (navigator as any).deviceMemory || 'unknown';
    this.hardwareConcurrency = navigator.hardwareConcurrency || 'unknown';
    this.maxTouchPoints = navigator.maxTouchPoints || 'unknown';
    this.vendor = navigator.vendor;
    this.product = navigator.product;
    this.appName = navigator.appName;
    this.productSub = navigator.productSub;
    this.brands = navigator.userAgentData ? navigator.userAgentData["brands"].map((e) => e.brand + '/v' + e.version) : 'unknown';
    this.mimeTypes = Array.from(navigator.mimeTypes).map(mimeType => mimeType.type);
    this.plugins = Array.from(navigator.plugins).map(plugin => plugin.name);
    this.appVersions = this.extractSoftwareVersions(navigator.appVersion);

  }

  extractSoftwareVersions(appVersion: string): { name: string, version: string }[] {
    const regex = /\b([A-Za-z]+)\/([0-9]+(?:\.[0-9]+)*)/g;
    const matches = [];
    let match;

    while ((match = regex.exec(appVersion)) !== null) {
      matches.push({ name: match[1], version: match[2] });
    }

    return matches;
  }

  getBytes() {
    return useBytes(this);
  }

  async getUniqId() {
    if (!this.uniqId) {
      const dataString = JSON.stringify({
        userAgent: this.userAgent,
        platform: this.platform,
        language: this.language,
        cookiesEnabled: this.cookiesEnabled,
        onlineStatus: this.onlineStatus,
        screenWidth: this.screenWidth,
        screenHeight: this.screenHeight,
        windowWidth: this.windowWidth,
        windowHeight: this.windowHeight,
        colorDepth: this.colorDepth,
        deviceMemory: this.deviceMemory,
        hardwareConcurrency: this.hardwareConcurrency,
        maxTouchPoints: this.maxTouchPoints,
        vendor: this.vendor,
        product: this.product,
        appName: this.appName,
        appVersions: this.appVersions,
        productSub: this.productSub,
        brands: this.brands,
        mimeTypes: this.mimeTypes,
        plugins: this.plugins
      });

      const encoder = new TextEncoder();
      const data = encoder.encode(dataString);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      this.uniqId = hashHex;
      return hashHex;
    } else return this.uniqId;
  }

  isPhone(): boolean {
    // Heuristic rules for phone detection
    const phoneRegex = /(Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini)/i;
    const tabletRegex = /(iPad|Tablet|Nexus 7|Nexus 10)/i;
    const isTouchDevice = parseInt(this.maxTouchPoints as string) > 1;

    // Check User Agent and screen dimensions
    return (
      phoneRegex.test(this.userAgent) &&
      !tabletRegex.test(this.userAgent) &&
      isTouchDevice &&
      Math.min(this.screenWidth, this.screenHeight) < 800
    );
  }
}

let currentDevice: any;
export default () => {
  if (!currentDevice) currentDevice =  new Device();
  return currentDevice;
}