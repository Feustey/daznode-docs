export interface Token4GoodConfig {
  apiKey: string;
  network: 'mainnet' | 'testnet' | 'signet';
  baseUrl: string;
  lightningEnabled: boolean;
  rgbEnabled: boolean;
  mcpEnabled: boolean;
}

export interface EducationalPlatformConfig {
  name: string;
  treasuryAddress: string;
  defaultCurrency: string;
  supportedLanguages: string[];
  certificateSettings: {
    issuerName: string;
    validityPeriod: number; // in days
    certificateTemplate: string;
  };
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config: Token4GoodConfig;
  private platformConfig: EducationalPlatformConfig;

  private constructor() {
    this.config = this.loadToken4GoodConfig();
    this.platformConfig = this.loadPlatformConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadToken4GoodConfig(): Token4GoodConfig {
    return {
      apiKey: process.env.T4G_API_KEY || '',
      network: (process.env.T4G_NETWORK as 'mainnet' | 'testnet' | 'signet') || 'testnet',
      baseUrl: process.env.T4G_BASE_URL || 'https://api.token4good.com/v2',
      lightningEnabled: process.env.T4G_LIGHTNING_ENABLED === 'true',
      rgbEnabled: process.env.T4G_RGB_ENABLED === 'true',
      mcpEnabled: process.env.T4G_MCP_ENABLED === 'true'
    };
  }

  private loadPlatformConfig(): EducationalPlatformConfig {
    return {
      name: process.env.PLATFORM_NAME || 'Daznode Educational Platform',
      treasuryAddress: process.env.TREASURY_ADDRESS || '',
      defaultCurrency: process.env.DEFAULT_CURRENCY || 'T4G',
      supportedLanguages: (process.env.SUPPORTED_LANGUAGES || 'fr,en').split(','),
      certificateSettings: {
        issuerName: process.env.CERTIFICATE_ISSUER || 'Daznode Academy',
        validityPeriod: parseInt(process.env.CERTIFICATE_VALIDITY_DAYS || '3650'),
        certificateTemplate: process.env.CERTIFICATE_TEMPLATE || 'default'
      }
    };
  }

  public getToken4GoodConfig(): Token4GoodConfig {
    return { ...this.config };
  }

  public getPlatformConfig(): EducationalPlatformConfig {
    return { ...this.platformConfig };
  }

  public validateConfig(): void {
    if (!this.config.apiKey) {
      throw new Error('T4G_API_KEY environment variable is required');
    }

    if (!this.platformConfig.treasuryAddress) {
      throw new Error('TREASURY_ADDRESS environment variable is required');
    }

    console.log('✅ Configuration validated successfully');
  }
}