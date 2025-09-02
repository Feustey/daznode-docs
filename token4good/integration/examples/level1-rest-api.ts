// Level 1: Token4Good REST API Integration Examples
// Simple HTTP integration with Token4Good APIs

import { Token4GoodRestClient } from '../src/api/rest-client';

async function demonstrateRestApiIntegration() {
  console.log('🚀 Token4Good REST API Integration Examples');
  console.log('==========================================\n');

  const client = new Token4GoodRestClient();

  try {
    // Example 1: Create educational course token
    console.log('📚 1. Creating Educational Course Token');
    const courseToken = await client.issueEducationalToken({
      name: 'Advanced Bitcoin Development Course',
      ticker: 'BTCDEV-2024',
      amount: 50000, // 50k tokens for course access
      precision: 8
    });

    if (courseToken.success) {
      console.log('✅ Course token created:');
      console.log(`   - Name: ${courseToken.data?.name}`);
      console.log(`   - Contract ID: ${courseToken.data?.contractId}`);
      console.log(`   - Total Supply: ${courseToken.data?.totalSupply}`);
    } else {
      console.log('❌ Failed to create course token:', courseToken.error);
    }

    // Example 2: Issue completion certificate as NFT
    console.log('\n🎓 2. Issuing Course Completion Certificate');
    const certificate = await client.issueEducationalNFT({
      name: 'Bitcoin Development Mastery Certificate',
      description: 'Official completion certificate for Advanced Bitcoin Development Course',
      metadata_uri: 'https://certificates.daznode.com/btcdev_student123.json',
      recipient: 'student_wallet_address'
    });

    if (certificate.success) {
      console.log('✅ Certificate NFT issued:');
      console.log(`   - Certificate: ${certificate.data?.name}`);
      console.log(`   - Contract ID: ${certificate.data?.contractId}`);
      console.log(`   - Type: ${certificate.data?.assetType}`);
    } else {
      console.log('❌ Failed to issue certificate:', certificate.error);
    }

    // Example 3: Create course enrollment invoice (RGB payment)
    console.log('\n💰 3. Creating Course Enrollment Invoice (RGB)');
    if (courseToken.success && courseToken.data?.contractId) {
      const enrollmentInvoice = await client.createRgbInvoice({
        contract_id: courseToken.data.contractId,
        amount: 1000, // 1000 tokens for course access
        description: 'Bitcoin Development Course Enrollment',
        expiry_minutes: 60
      });

      if (enrollmentInvoice.success) {
        console.log('✅ RGB enrollment invoice created:');
        console.log(`   - Invoice ID: ${enrollmentInvoice.data?.invoice_id}`);
        console.log(`   - RGB Invoice: ${enrollmentInvoice.data?.rgb_invoice}`);
        console.log(`   - Expires: ${enrollmentInvoice.data?.expires_at}`);
      } else {
        console.log('❌ Failed to create RGB invoice:', enrollmentInvoice.error);
      }
    }

    // Example 4: Create Lightning invoice for instant payments
    console.log('\n⚡ 4. Creating Lightning Invoice for Instant Payment');
    const lightningInvoice = await client.createLightningInvoice({
      amount_msats: 50000, // 50 sats for quick content access
      description: 'Video chapter access - RGB Protocol Basics',
      expiry_seconds: 300 // 5 minutes
    });

    if (lightningInvoice.success) {
      console.log('✅ Lightning invoice created:');
      console.log(`   - Invoice: ${lightningInvoice.data?.invoice}`);
      console.log(`   - Amount: 50 sats`);
      console.log(`   - Description: Video chapter access`);
    } else {
      console.log('❌ Failed to create Lightning invoice:', lightningInvoice.error);
    }

    // Example 5: Create hybrid payment (RGB + Lightning)
    console.log('\n🔄 5. Creating Hybrid Payment (RGB + Lightning)');
    if (courseToken.success && courseToken.data?.contractId) {
      const hybridInvoice = await client.createHybridInvoice({
        contract_id: courseToken.data.contractId,
        rgb_amount: 1000, // Main course payment in tokens
        ln_amount_msats: 10000, // 10 sats Lightning fee
        description: 'Complete Course Access + Network Fees',
        expiry_minutes: 60
      });

      if (hybridInvoice.success) {
        console.log('✅ Hybrid payment invoice created:');
        console.log(`   - RGB Amount: 1000 tokens`);
        console.log(`   - Lightning Amount: 10 sats`);
        console.log(`   - Total Invoice: ${hybridInvoice.data?.id}`);
        console.log(`   - Description: Complete course access with fees`);
      } else {
        console.log('❌ Failed to create hybrid invoice:', hybridInvoice.error);
      }
    }

    // Example 6: Open Lightning channel with RGB support
    console.log('\n🌐 6. Opening RGB-enabled Lightning Channel');
    const channel = await client.openRgbLightningChannel({
      peer_node_id: '03f1a3b4c2d8e7f9a1b2c3d4e5f6789abc123def456789abc123def456789abc12',
      capacity_sats: 1000000, // 1M sats channel capacity
      rgb_contracts: courseToken.success ? [courseToken.data!.contractId] : []
    });

    if (channel.success) {
      console.log('✅ RGB Lightning channel opened:');
      console.log(`   - Channel ID: ${channel.data?.channel_id}`);
      console.log(`   - Capacity: ${channel.data?.capacity} sats`);
      console.log(`   - Status: ${channel.data?.status}`);
    } else {
      console.log('❌ Failed to open channel:', channel.error);
    }

    // Example 7: Create streaming payment for real-time content
    console.log('\n🔄 7. Creating Streaming Payment');
    const stream = await client.createPaymentStream({
      payer: 'student_node_id',
      ratePerSecond: 0.001, // 0.001 sats per second
      maxDuration: 3600, // 1 hour max
      autoClose: true
    });

    if (stream.success) {
      console.log('✅ Streaming payment created:');
      console.log(`   - Stream ID: ${stream.data?.streamId}`);
      console.log(`   - Rate: ${stream.data?.ratePerSecond} sats/second`);
      console.log(`   - Status: ${stream.data?.status}`);
    } else {
      console.log('❌ Failed to create stream:', stream.error);
    }

    // Example 8: Query asset information
    console.log('\n📊 8. Querying Token4Good Asset Information');
    if (courseToken.success && courseToken.data?.contractId) {
      const assetInfo = await client.getAssetInfo(courseToken.data.contractId);
      
      if (assetInfo.success) {
        console.log('✅ Asset information retrieved:');
        console.log(`   - Contract ID: ${assetInfo.data?.contractId}`);
        console.log(`   - Name: ${assetInfo.data?.name}`);
        console.log(`   - Supply: ${assetInfo.data?.totalSupply}`);
        console.log(`   - Type: ${assetInfo.data?.assetType}`);
      } else {
        console.log('❌ Failed to get asset info:', assetInfo.error);
      }
    }

    // Example 9: List educational assets
    console.log('\n📋 9. Listing Educational Assets');
    const assetsList = await client.listAssets({
      type: 'fungible',
      limit: 5
    });

    if (assetsList.success) {
      console.log('✅ Educational assets found:');
      assetsList.data?.forEach((asset, index) => {
        console.log(`   ${index + 1}. ${asset.name} (${asset.ticker})`);
        console.log(`      Contract: ${asset.contractId}`);
      });
    } else {
      console.log('❌ Failed to list assets:', assetsList.error);
    }

    console.log('\n🎉 Token4Good REST API integration examples completed!');
    console.log('You can now use these patterns to integrate Token4Good into your educational platform.');

  } catch (error) {
    console.error('❌ Integration example failed:', error);
  }
}

// Educational platform integration example
async function educationalPlatformExample() {
  console.log('\n📚 Educational Platform Integration Example');
  console.log('=========================================\n');

  const client = new Token4GoodRestClient();

  try {
    // Step 1: Setup course infrastructure
    console.log('1. Setting up course infrastructure...');
    
    const courseToken = await client.issueEducationalToken({
      name: 'Lightning Network Mastery Course',
      ticker: 'LN-MASTER',
      amount: 100000,
      precision: 8
    });

    if (!courseToken.success) {
      throw new Error('Failed to create course token');
    }

    console.log(`✅ Course token created: ${courseToken.data?.contractId}`);

    // Step 2: Student enrollment process
    console.log('2. Processing student enrollment...');
    
    const enrollmentInvoice = await client.createRgbInvoice({
      contract_id: courseToken.data!.contractId,
      amount: 5000, // 5000 tokens for course
      description: 'Lightning Network Mastery Course - Full Access',
      expiry_minutes: 120 // 2 hours to pay
    });

    if (enrollmentInvoice.success) {
      console.log(`✅ Enrollment invoice: ${enrollmentInvoice.data?.invoice_id}`);
      console.log(`   Student can pay with: ${enrollmentInvoice.data?.rgb_invoice}`);
    }

    // Step 3: Issue completion certificate
    console.log('3. Issuing course completion certificate...');
    
    const completionCert = await client.issueEducationalNFT({
      name: 'Lightning Network Mastery Certificate',
      description: 'Successfully completed advanced Lightning Network course with 95% score',
      metadata_uri: 'https://certificates.daznode.com/ln_master_student456.json'
    });

    if (completionCert.success) {
      console.log(`✅ Certificate issued: ${completionCert.data?.contractId}`);
    }

    // Step 4: Setup real-time content access
    console.log('4. Setting up real-time content streaming...');
    
    const contentStream = await client.createPaymentStream({
      payer: 'student_node',
      ratePerSecond: 0.01, // 0.01 sats per second of video
      maxDuration: 7200, // 2 hours max
      autoClose: true
    });

    if (contentStream.success) {
      console.log(`✅ Content streaming setup: ${contentStream.data?.streamId}`);
    }

    console.log('\n🎓 Educational platform integration complete!');
    console.log('Your platform can now:');
    console.log('• Accept course payments via RGB tokens');
    console.log('• Issue verifiable certificates as NFTs');  
    console.log('• Stream content with real-time micropayments');
    console.log('• Support Lightning Network for instant payments');

  } catch (error) {
    console.error('❌ Educational platform example failed:', error);
  }
}

// Run examples
async function main() {
  await demonstrateRestApiIntegration();
  await educationalPlatformExample();
}

if (require.main === module) {
  main().catch(console.error);
}

export { demonstrateRestApiIntegration, educationalPlatformExample };