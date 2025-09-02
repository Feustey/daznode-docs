// Token4Good MCP Server (Level 3)
// Expose Token4Good functions to AI agents via Model Context Protocol

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

import { Token4GoodRestClient } from '../api/rest-client';
import { Token4GoodNativeClient } from '../sdk/native-client';
import { ConfigManager } from '../config/environment';

class Token4GoodMcpServer {
  private server: Server;
  private restClient: Token4GoodRestClient;
  private nativeClient: Token4GoodNativeClient;
  private config;

  constructor() {
    this.config = ConfigManager.getInstance();
    this.restClient = new Token4GoodRestClient();
    this.nativeClient = new Token4GoodNativeClient();

    this.server = new Server(
      {
        name: 'token4good-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupTools();
  }

  private setupTools(): void {
    // Define tools that expose Token4Good functionality to AI agents
    const TOOLS: Tool[] = [
      {
        name: 'create_educational_token',
        description: 'Create an educational token using Token4Good RGB protocol',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Token name' },
            ticker: { type: 'string', description: 'Token ticker symbol' },
            amount: { type: 'number', description: 'Total token supply' },
            precision: { type: 'number', description: 'Token decimal precision', default: 8 }
          },
          required: ['name', 'ticker', 'amount']
        }
      },
      {
        name: 'issue_certificate_nft',
        description: 'Issue an educational certificate as NFT using Token4Good',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Certificate name' },
            description: { type: 'string', description: 'Certificate description' },
            recipient: { type: 'string', description: 'Student wallet address or ID' },
            metadata_uri: { type: 'string', description: 'URI to certificate metadata' }
          },
          required: ['name', 'description', 'recipient']
        }
      },
      {
        name: 'create_payment_invoice',
        description: 'Create payment invoice using Token4Good (RGB, Lightning, or Hybrid)',
        inputSchema: {
          type: 'object',
          properties: {
            payment_type: { 
              type: 'string', 
              enum: ['rgb', 'lightning', 'hybrid'],
              description: 'Type of payment to create'
            },
            amount: { type: 'number', description: 'Payment amount' },
            description: { type: 'string', description: 'Payment description' },
            contract_id: { 
              type: 'string', 
              description: 'RGB contract ID (required for RGB and hybrid payments)' 
            },
            expiry_minutes: { 
              type: 'number', 
              description: 'Invoice expiry in minutes',
              default: 60 
            }
          },
          required: ['payment_type', 'amount', 'description']
        }
      },
      {
        name: 'process_token4good_payment',
        description: 'Process a payment using Token4Good infrastructure',
        inputSchema: {
          type: 'object',
          properties: {
            payment_type: { 
              type: 'string', 
              enum: ['rgb', 'lightning', 'hybrid'] 
            },
            amount: { type: 'number', description: 'Payment amount' },
            recipient: { type: 'string', description: 'Payment recipient address' },
            description: { type: 'string', description: 'Payment description' },
            contract_id: { 
              type: 'string', 
              description: 'RGB contract ID (for RGB payments)' 
            }
          },
          required: ['payment_type', 'amount', 'recipient', 'description']
        }
      },
      {
        name: 'open_lightning_channel',
        description: 'Open Lightning Network channel with RGB support via Token4Good',
        inputSchema: {
          type: 'object',
          properties: {
            peer_node_id: { type: 'string', description: 'Peer Lightning node ID' },
            capacity_sats: { type: 'number', description: 'Channel capacity in satoshis' },
            rgb_contracts: { 
              type: 'array',
              items: { type: 'string' },
              description: 'RGB contract IDs to associate with channel'
            }
          },
          required: ['peer_node_id', 'capacity_sats']
        }
      },
      {
        name: 'create_streaming_payment',
        description: 'Create streaming micropayment using Token4Good for real-time content access',
        inputSchema: {
          type: 'object',
          properties: {
            rate_per_second: { type: 'number', description: 'Payment rate per second in sats' },
            max_duration: { type: 'number', description: 'Maximum duration in seconds' },
            recipient: { type: 'string', description: 'Payment recipient' },
            auto_close: { type: 'boolean', description: 'Auto-close when max duration reached', default: true }
          },
          required: ['rate_per_second', 'max_duration', 'recipient']
        }
      },
      {
        name: 'get_token4good_asset_info',
        description: 'Retrieve information about a Token4Good RGB asset',
        inputSchema: {
          type: 'object',
          properties: {
            contract_id: { type: 'string', description: 'RGB contract ID to query' }
          },
          required: ['contract_id']
        }
      },
      {
        name: 'list_token4good_assets',
        description: 'List Token4Good assets with optional filtering',
        inputSchema: {
          type: 'object',
          properties: {
            asset_type: { 
              type: 'string', 
              enum: ['fungible', 'nft', 'certificate'],
              description: 'Filter by asset type'
            },
            owner: { type: 'string', description: 'Filter by owner address' },
            limit: { type: 'number', description: 'Maximum number of results', default: 20 }
          }
        }
      }
    ];

    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: TOOLS,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_educational_token':
            return await this.handleCreateEducationalToken(args);
          
          case 'issue_certificate_nft':
            return await this.handleIssueCertificateNft(args);
          
          case 'create_payment_invoice':
            return await this.handleCreatePaymentInvoice(args);
          
          case 'process_token4good_payment':
            return await this.handleProcessPayment(args);
          
          case 'open_lightning_channel':
            return await this.handleOpenLightningChannel(args);
          
          case 'create_streaming_payment':
            return await this.handleCreateStreamingPayment(args);
          
          case 'get_token4good_asset_info':
            return await this.handleGetAssetInfo(args);
          
          case 'list_token4good_assets':
            return await this.handleListAssets(args);
          
          default:
            throw new Error(`Unknown Token4Good tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing Token4Good ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  // Tool implementation methods - only Token4Good API calls
  
  private async handleCreateEducationalToken(args: any) {
    const result = await this.restClient.issueEducationalToken({
      name: args.name,
      ticker: args.ticker,
      amount: args.amount,
      precision: args.precision || 8
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to create educational token');
    }

    return {
      content: [
        {
          type: 'text',
          text: `✅ Educational token created successfully!
Token Name: ${args.name}
Ticker: ${args.ticker}
Contract ID: ${result.data?.contractId}
Total Supply: ${args.amount}
Status: Token ready for educational use`,
        },
      ],
    };
  }

  private async handleIssueCertificateNft(args: any) {
    const result = await this.restClient.issueEducationalNFT({
      name: args.name,
      description: args.description,
      metadata_uri: args.metadata_uri || `https://certificates.daznode.com/${args.recipient}_${Date.now()}.json`,
      recipient: args.recipient
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to issue certificate NFT');
    }

    return {
      content: [
        {
          type: 'text',
          text: `🎓 Certificate NFT issued successfully!
Certificate: ${args.name}
Recipient: ${args.recipient}
Contract ID: ${result.data?.contractId}
NFT ID: ${result.data?.id}
Status: Certificate ready for verification`,
        },
      ],
    };
  }

  private async handleCreatePaymentInvoice(args: any) {
    let result;

    switch (args.payment_type) {
      case 'rgb':
        if (!args.contract_id) {
          throw new Error('contract_id required for RGB payments');
        }
        result = await this.restClient.createRgbInvoice({
          contract_id: args.contract_id,
          amount: args.amount,
          description: args.description,
          expiry_minutes: args.expiry_minutes
        });
        break;

      case 'lightning':
        result = await this.restClient.createLightningInvoice({
          amount_msats: args.amount * 1000,
          description: args.description,
          expiry_seconds: (args.expiry_minutes || 60) * 60
        });
        break;

      case 'hybrid':
        if (!args.contract_id) {
          throw new Error('contract_id required for hybrid payments');
        }
        result = await this.restClient.createHybridInvoice({
          contract_id: args.contract_id,
          rgb_amount: args.amount,
          ln_amount_msats: Math.floor(args.amount * 0.1) * 1000,
          description: args.description,
          expiry_minutes: args.expiry_minutes
        });
        break;

      default:
        throw new Error(`Unsupported payment type: ${args.payment_type}`);
    }

    if (!result.success) {
      throw new Error(result.error || 'Failed to create payment invoice');
    }

    return {
      content: [
        {
          type: 'text',
          text: `💰 Payment invoice created successfully!
Type: ${args.payment_type.toUpperCase()}
Amount: ${args.amount}
Description: ${args.description}
Invoice ID: ${result.data?.invoice_id || result.data?.id}
Expires: ${result.data?.expires_at}
Status: Ready for payment`,
        },
      ],
    };
  }

  private async handleProcessPayment(args: any) {
    const result = await this.nativeClient.processPayment({
      paymentType: args.payment_type,
      amount: args.amount,
      recipient: args.recipient,
      description: args.description,
      contractId: args.contract_id
    });

    if (!result.success) {
      throw new Error(result.error || 'Payment processing failed');
    }

    return {
      content: [
        {
          type: 'text',
          text: `⚡ Payment processed successfully!
Type: ${args.payment_type.toUpperCase()}
Amount: ${args.amount}
Recipient: ${args.recipient}
Payment ID: ${result.data?.paymentId}
Status: ${result.data?.status}`,
        },
      ],
    };
  }

  private async handleOpenLightningChannel(args: any) {
    const result = await this.restClient.openRgbLightningChannel({
      peer_node_id: args.peer_node_id,
      capacity_sats: args.capacity_sats,
      rgb_contracts: args.rgb_contracts || []
    });

    if (!result.success) {
      throw new Error(result.error || 'Channel opening failed');
    }

    return {
      content: [
        {
          type: 'text',
          text: `🌐 Lightning channel opened successfully!
Channel ID: ${result.data?.channel_id}
Peer Node: ${args.peer_node_id}
Capacity: ${args.capacity_sats} sats
RGB Contracts: ${args.rgb_contracts?.length || 0}
Status: ${result.data?.status}`,
        },
      ],
    };
  }

  private async handleCreateStreamingPayment(args: any) {
    const result = await this.nativeClient.createStreamingPayment({
      ratePerSecond: args.rate_per_second,
      maxDuration: args.max_duration,
      recipient: args.recipient,
      autoClose: args.auto_close
    });

    if (!result.success) {
      throw new Error(result.error || 'Streaming payment creation failed');
    }

    return {
      content: [
        {
          type: 'text',
          text: `🔄 Streaming payment created successfully!
Stream ID: ${result.data?.streamId}
Rate: ${args.rate_per_second} sats/second
Max Duration: ${args.max_duration} seconds
Recipient: ${args.recipient}
Auto-close: ${args.auto_close ? 'Yes' : 'No'}
Status: ${result.data?.status}`,
        },
      ],
    };
  }

  private async handleGetAssetInfo(args: any) {
    const result = await this.restClient.getAssetInfo(args.contract_id);

    if (!result.success) {
      throw new Error(result.error || 'Failed to retrieve asset information');
    }

    return {
      content: [
        {
          type: 'text',
          text: `📋 Token4Good Asset Information:
Contract ID: ${result.data?.contractId}
Name: ${result.data?.name}
Ticker: ${result.data?.ticker}
Type: ${result.data?.assetType}
Total Supply: ${result.data?.totalSupply}
Decimals: ${result.data?.decimals}
Created: ${result.data?.createdAt}`,
        },
      ],
    };
  }

  private async handleListAssets(args: any) {
    const result = await this.restClient.listAssets({
      type: args.asset_type,
      owner: args.owner,
      limit: args.limit || 20
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to list assets');
    }

    const assets = result.data || [];
    const assetList = assets.map((asset, index) => 
      `${index + 1}. ${asset.name} (${asset.ticker}) - ${asset.contractId}`
    ).join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `📊 Token4Good Assets (${assets.length} found):
${assetList || 'No assets found'}

Filter Applied:
- Type: ${args.asset_type || 'All'}
- Owner: ${args.owner || 'All'}
- Limit: ${args.limit || 20}`,
        },
      ],
    };
  }

  async start(): Promise<void> {
    try {
      // Initialize Token4Good clients
      await this.nativeClient.initialize();
      
      console.log('🚀 Token4Good MCP server starting...');
      
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      
      console.log('✅ Token4Good MCP server running on stdio');
      console.log('Available tools:', [
        'create_educational_token',
        'issue_certificate_nft', 
        'create_payment_invoice',
        'process_token4good_payment',
        'open_lightning_channel',
        'create_streaming_payment',
        'get_token4good_asset_info',
        'list_token4good_assets'
      ]);
    } catch (error) {
      console.error('❌ Token4Good MCP server startup error:', error);
      process.exit(1);
    }
  }

  async shutdown(): Promise<void> {
    try {
      await this.nativeClient.disconnect();
      console.log('✅ Token4Good MCP server shutdown complete');
    } catch (error) {
      console.error('Error during shutdown:', error);
    }
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  const server = new Token4GoodMcpServer();
  
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down Token4Good MCP server...');
    await server.shutdown();
    process.exit(0);
  });

  server.start().catch((error) => {
    console.error('Failed to start Token4Good MCP server:', error);
    process.exit(1);
  });
}

export { Token4GoodMcpServer };