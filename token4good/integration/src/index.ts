// Token4Good Integration - Main Entry Point
// Exports all Token4Good integration components

export { Token4GoodRestClient } from './api/rest-client';
export { Token4GoodNativeClient } from './sdk/native-client';
export { Token4GoodMcpServer } from './mcp/token4good-mcp-server';
export { ConfigManager } from './config/environment';

// Export types
export * from './types';

// Export configuration interfaces
export type { 
  Token4GoodConfig, 
  EducationalPlatformConfig 
} from './config/environment';

// Main integration class that provides unified access to all Token4Good services
export class Token4GoodIntegration {
  public rest: Token4GoodRestClient;
  public native: Token4GoodNativeClient;
  private mcpServer?: Token4GoodMcpServer;
  private config;

  constructor() {
    this.config = ConfigManager.getInstance();
    this.rest = new Token4GoodRestClient();
    this.native = new Token4GoodNativeClient();
  }

  /**
   * Initialize all Token4Good services
   */
  async initialize(): Promise<void> {
    console.log('🚀 Initializing Token4Good Integration...');
    
    // Validate configuration
    this.config.validateConfig();
    
    // Initialize native SDK
    await this.native.initialize();
    
    console.log('✅ Token4Good Integration ready');
    console.log('Available services:');
    console.log('• REST API client for HTTP integration');
    console.log('• Native SDK client for advanced features');
    console.log('• MCP server for AI agent integration');
  }

  /**
   * Start MCP server for AI agent integration
   */
  async startMcpServer(): Promise<void> {
    if (!this.config.getToken4GoodConfig().mcpEnabled) {
      console.log('⚠️  MCP server disabled in configuration');
      return;
    }

    this.mcpServer = new Token4GoodMcpServer();
    await this.mcpServer.start();
    console.log('✅ Token4Good MCP server started');
  }

  /**
   * Shutdown all services
   */
  async shutdown(): Promise<void> {
    console.log('🛑 Shutting down Token4Good Integration...');
    
    if (this.mcpServer) {
      await this.mcpServer.shutdown();
    }
    
    await this.native.disconnect();
    
    console.log('✅ Token4Good Integration shutdown complete');
  }

  /**
   * Get integration status
   */
  getStatus() {
    return {
      restClient: 'ready',
      nativeClient: 'ready',
      mcpServer: this.mcpServer ? 'running' : 'stopped',
      configuration: 'valid'
    };
  }
}

// Default export
export default Token4GoodIntegration;