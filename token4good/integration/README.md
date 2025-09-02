# 🔌 Token4Good Integration for Daznode Educational Platform

Complete integration package for Token4Good RGB+Lightning services in educational applications.

## 🎯 Overview

This package provides **3 levels of integration** with Token4Good:

- **🟢 Level 1: REST API** - Simple HTTP integration
- **🔵 Level 2: Native SDK** - Advanced Rust/JavaScript integration  
- **🟣 Level 3: MCP Protocol** - AI agent integration

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Copy configuration template
cp .env.example .env

# Edit configuration with your Token4Good API key
nano .env
```

### Basic Usage

```typescript
import { Token4GoodIntegration } from '@daznode/token4good-integration';

const t4g = new Token4GoodIntegration();
await t4g.initialize();

// Create educational token
const token = await t4g.rest.issueEducationalToken({
  name: 'Bitcoin Basics Course',
  ticker: 'BTC-BASICS',
  amount: 10000,
  precision: 8
});

// Issue certificate NFT
const certificate = await t4g.rest.issueEducationalNFT({
  name: 'Course Completion Certificate',
  description: 'Student completed Bitcoin Basics',
  recipient: 'student_wallet_address'
});
```

## 📚 Integration Levels

### 🟢 Level 1: REST API Integration

Perfect for simple educational platforms that need basic Token4Good functionality.

**Features:**
- Create educational tokens
- Issue certificates as NFTs
- Process RGB and Lightning payments
- Create hybrid payments (RGB + Lightning)
- Manage Lightning channels

**Example:**
```typescript
import { Token4GoodRestClient } from '@daznode/token4good-integration';

const client = new Token4GoodRestClient();

// Create course enrollment invoice
const invoice = await client.createRgbInvoice({
  contract_id: 'rgb:course_token:abc123',
  amount: 1000,
  description: 'Course enrollment payment',
  expiry_minutes: 60
});
```

### 🔵 Level 2: Native SDK Integration

Advanced integration for educational platforms needing full Token4Good capabilities.

**Features:**
- Full RGB+Lightning node integration
- Real-time streaming payments
- Advanced channel management
- Direct blockchain operations
- Optimized performance

**Example:**
```typescript
import { Token4GoodNativeClient } from '@daznode/token4good-integration';

const client = new Token4GoodNativeClient();
await client.initialize();

// Create streaming payment for content access
const stream = await client.createStreamingPayment({
  ratePerSecond: 0.01, // 0.01 sats per second of video
  maxDuration: 3600,   // 1 hour max
  recipient: 'content_server_node',
  autoClose: true
});
```

### 🟣 Level 3: MCP Integration

Enables AI agents to autonomously use Token4Good services for educational applications.

**Features:**
- Model Context Protocol server
- AI-friendly tool definitions
- Autonomous course creation
- Automated certificate issuance
- Dynamic pricing optimization

**Example:**
```typescript
import { Token4GoodMcpServer } from '@daznode/token4good-integration';

const server = new Token4GoodMcpServer();
await server.start();

// AI agents can now call Token4Good tools:
// - create_educational_token
// - issue_certificate_nft
// - create_payment_invoice
// - process_token4good_payment
// - create_streaming_payment
```

## 🛠️ Configuration

### Environment Variables

```bash
# Token4Good API Configuration
T4G_API_KEY=your_api_key_here
T4G_NETWORK=testnet
T4G_BASE_URL=https://api.token4good.com/v2

# Educational Platform Settings
PLATFORM_NAME=Your Educational Platform
TREASURY_ADDRESS=your_treasury_wallet
CERTIFICATE_ISSUER=Your Academy Name

# Lightning Network Settings
LIGHTNING_NODE_ALIAS=YourEduNode
LIGHTNING_DEFAULT_CHANNEL_SIZE=1000000
```

### Configuration Management

```typescript
import { ConfigManager } from '@daznode/token4good-integration';

const config = ConfigManager.getInstance();

// Validate configuration
config.validateConfig();

// Get Token4Good settings
const t4gConfig = config.getToken4GoodConfig();

// Get platform settings
const platformConfig = config.getPlatformConfig();
```

## 📋 Examples

### Educational Use Cases

1. **Course Token Creation**
   ```bash
   npm run example:level1  # REST API examples
   ```

2. **Advanced Platform Integration**
   ```bash
   npm run example:level2  # Native SDK examples
   ```

3. **AI Agent Integration**
   ```bash
   npm run example:level3  # MCP integration examples
   ```

### Real-world Scenarios

- **Course Enrollment**: Students pay with RGB tokens for course access
- **Certificate Issuance**: Automatic NFT certificates upon completion
- **Content Streaming**: Pay-per-second video access with Lightning
- **Instructor Payments**: Automatic distribution via Lightning channels
- **AI Tutoring**: Streaming payments for personalized AI assistance

## 🔧 Development

### Build

```bash
npm run build    # Compile TypeScript
npm run dev      # Watch mode
```

### Testing

```bash
npm test         # Run tests
npm run lint     # Check code style
```

### MCP Server

```bash
npm run mcp-server  # Start MCP server for AI agents
```

## 🌐 Token4Good Services Used

This integration leverages the following Token4Good APIs:

### Asset Management
- `POST /api/assets/issue/fungible` - Create educational tokens
- `POST /api/assets/issue/nft` - Issue certificates and badges
- `GET /api/assets/{contract_id}` - Query asset information
- `POST /api/assets/transfer` - Transfer tokens

### Payment Processing
- `POST /api/invoices/rgb` - RGB payment invoices
- `POST /api/invoices/lightning` - Lightning payment invoices
- `POST /api/invoices/hybrid` - Hybrid payment invoices
- `POST /api/lightning/pay` - Process Lightning payments

### Channel Management
- `POST /api/channels/open` - Open RGB+Lightning channels
- `GET /api/channels/list` - List active channels
- `POST /api/channels/{id}/close` - Close channels

### Streaming Payments
- `POST /api/payments/stream/create` - Create payment streams
- `POST /api/payments/stream/{id}/control` - Control payment streams

## 🎓 Educational Platform Benefits

### For Students
- **Seamless Payments**: Pay for courses with RGB tokens or Lightning
- **Instant Access**: Real-time content access with streaming payments
- **Verified Certificates**: Tamper-proof NFT certificates on Bitcoin
- **Micro-learning**: Pay only for content consumed

### For Instructors  
- **Instant Payments**: Receive payments via Lightning Network
- **Global Reach**: Accept payments from anywhere in the world
- **Automated Distribution**: Smart payment splitting among co-instructors
- **Performance Incentives**: Payments based on student engagement

### For Platforms
- **Reduced Fees**: Lower transaction costs with Bitcoin payments
- **Global Access**: No geographic payment restrictions
- **Automated Operations**: AI agents handle routine tasks
- **Verifiable Credentials**: Blockchain-based certificate verification

## 🔒 Security

- All Token4Good API calls use Bearer token authentication
- Private keys never leave the secure Token4Good infrastructure
- Lightning payments use standard Bitcoin cryptography
- Certificate NFTs include cryptographic verification hashes

## 📞 Support

- **Token4Good Documentation**: https://docs.token4good.com
- **Discord Community**: https://discord.gg/token4good-dev
- **GitHub Issues**: https://github.com/daznode/token4good-integration/issues

## 📄 License

MIT License - see LICENSE file for details.

---

🚀 **Ready to revolutionize education with Token4Good? Start with Level 1 and scale up as your needs grow!**