// Level 2: Token4Good Native SDK Integration Examples  
// Advanced integration using Token4Good native SDK

import { Token4GoodNativeClient } from '../src/sdk/native-client';

async function demonstrateNativeSdkIntegration() {
  console.log('🚀 Token4Good Native SDK Integration Examples');
  console.log('===============================================\n');

  const client = new Token4GoodNativeClient();

  try {
    // Initialize the Token4Good SDK
    console.log('🔧 Initializing Token4Good Native SDK...');
    await client.initialize();
    console.log('✅ SDK initialized successfully\n');

    // Example 1: Create educational token with native SDK
    console.log('📚 1. Creating Educational Token (Native SDK)');
    const courseToken = await client.issueAsset({
      type: 'fungible',
      name: 'Advanced RGB Protocol Course',
      ticker: 'RGB-ADV',
      totalSupply: 75000,
      decimals: 8,
      description: 'Advanced RGB Protocol development course token'
    });

    if (courseToken.success) {
      console.log('✅ Educational token created:');
      console.log(`   - Contract ID: ${courseToken.data?.contractId}`);
      console.log(`   - Name: ${courseToken.data?.name}`);
      console.log(`   - Supply: ${courseToken.data?.totalSupply}`);
    } else {
      console.log('❌ Token creation failed:', courseToken.error);
    }

    // Example 2: Issue certificate NFT
    console.log('\n🎓 2. Issuing Certificate NFT (Native SDK)');
    const certificate = await client.issueAsset({
      type: 'nft',
      name: 'RGB Protocol Expert Certificate',
      description: 'Certification of expertise in RGB Protocol development',
      metadata: {
        student: 'alice_developer',
        course: 'RGB Advanced',
        grade: 'A+',
        skills: ['RGB contracts', 'Bitcoin development', 'Lightning integration'],
        issueDate: new Date().toISOString()
      }
    });

    if (certificate.success) {
      console.log('✅ Certificate NFT created:');
      console.log(`   - Certificate ID: ${certificate.data?.id}`);
      console.log(`   - Contract: ${certificate.data?.contractId}`);
      console.log(`   - Type: ${certificate.data?.assetType}`);
    } else {
      console.log('❌ Certificate creation failed:', certificate.error);
    }

    // Example 3: Process RGB payment
    console.log('\n💰 3. Processing RGB Payment (Native SDK)');
    if (courseToken.success) {
      const payment = await client.processPayment({
        paymentType: 'rgb',
        amount: 2500,
        currency: 'RGB-ADV',
        recipient: 'instructor_wallet',
        description: 'Course instructor payment',
        contractId: courseToken.data!.contractId
      });

      if (payment.success) {
        console.log('✅ RGB payment processed:');
        console.log(`   - Payment ID: ${payment.data?.paymentId}`);
        console.log(`   - Status: ${payment.data?.status}`);
        console.log(`   - Transaction: ${payment.data?.txId}`);
      } else {
        console.log('❌ RGB payment failed:', payment.error);
      }
    }

    // Example 4: Process Lightning payment
    console.log('\n⚡ 4. Processing Lightning Payment (Native SDK)');
    const lightningPayment = await client.processPayment({
      paymentType: 'lightning',
      amount: 1000, // 1000 sats
      recipient: 'student_node_id',
      description: 'Milestone completion reward'
    });

    if (lightningPayment.success) {
      console.log('✅ Lightning payment processed:');
      console.log(`   - Payment ID: ${lightningPayment.data?.paymentId}`);
      console.log(`   - Status: ${lightningPayment.data?.status}`);
      console.log(`   - Preimage: ${lightningPayment.data?.preimage}`);
    } else {
      console.log('❌ Lightning payment failed:', lightningPayment.error);
    }

    // Example 5: Process hybrid payment (RGB + Lightning)
    console.log('\n🔄 5. Processing Hybrid Payment (Native SDK)');
    if (courseToken.success) {
      const hybridPayment = await client.processPayment({
        paymentType: 'hybrid',
        amount: 3000, // RGB amount
        lightningAmountSats: 50, // Lightning fees
        recipient: 'platform_treasury',
        description: 'Course enrollment with network fees',
        contractId: courseToken.data!.contractId
      });

      if (hybridPayment.success) {
        console.log('✅ Hybrid payment processed:');
        console.log(`   - Payment ID: ${hybridPayment.data?.paymentId}`);
        console.log(`   - RGB Tx: ${hybridPayment.data?.rgbTxId}`);
        console.log(`   - Lightning Preimage: ${hybridPayment.data?.lightningPreimage}`);
      } else {
        console.log('❌ Hybrid payment failed:', hybridPayment.error);
      }
    }

    // Example 6: Open Lightning channel with RGB support
    console.log('\n🌐 6. Opening RGB-enabled Lightning Channel (Native SDK)');
    const channel = await client.openChannel({
      peerNodeId: '03abc123def456789abc123def456789abc123def456789abc123def456789abc123',
      capacitySats: 2000000, // 2M sats
      rgbContracts: courseToken.success ? [courseToken.data!.contractId] : [],
      pushAmountSats: 100000 // Push 100k sats to peer
    });

    if (channel.success) {
      console.log('✅ RGB Lightning channel opened:');
      console.log(`   - Channel ID: ${channel.data?.channelId}`);
      console.log(`   - Capacity: ${channel.data?.capacity} sats`);
      console.log(`   - Status: ${channel.data?.status}`);
    } else {
      console.log('❌ Channel opening failed:', channel.error);
    }

    // Example 7: Create streaming payment
    console.log('\n🔄 7. Creating Streaming Payment (Native SDK)');
    const stream = await client.createStreamingPayment({
      ratePerSecond: 0.1, // 0.1 sats per second
      maxDuration: 1800, // 30 minutes
      recipient: 'content_creator_node',
      autoClose: true
    });

    if (stream.success) {
      console.log('✅ Streaming payment created:');
      console.log(`   - Stream ID: ${stream.data?.streamId}`);
      console.log(`   - Rate: ${stream.data?.ratePerSecond} sats/sec`);
      console.log(`   - Status: ${stream.data?.status}`);

      // Control the stream
      console.log('\n   🎛️  Controlling stream...');
      const streamControl = await client.controlStream(stream.data!.streamId, 'pause');
      if (streamControl.success) {
        console.log(`   ✅ Stream paused. Total paid: ${streamControl.data?.totalPaid} sats`);
      }
    } else {
      console.log('❌ Streaming payment failed:', stream.error);
    }

    // Example 8: Check asset balances
    console.log('\n📊 8. Checking Asset Balances (Native SDK)');
    if (courseToken.success) {
      const balance = await client.getAssetBalance(courseToken.data!.contractId);
      if (balance.success) {
        console.log('✅ Asset balance retrieved:');
        console.log(`   - Contract: ${balance.data?.contractId}`);
        console.log(`   - Balance: ${balance.data?.balance}`);
      } else {
        console.log('❌ Balance query failed:', balance.error);
      }
    }

    // Example 9: List all channels
    console.log('\n🌐 9. Listing Lightning Channels (Native SDK)');
    const channels = await client.listChannels();
    if (channels.success) {
      console.log('✅ Lightning channels:');
      channels.data?.forEach((ch, index) => {
        console.log(`   ${index + 1}. Channel ${ch.channelId.substring(0, 8)}...`);
        console.log(`      - Peer: ${ch.peerNodeId.substring(0, 16)}...`);
        console.log(`      - Capacity: ${ch.capacity} sats`);
        console.log(`      - Local Balance: ${ch.balanceLocal} sats`);
        console.log(`      - RGB Contracts: ${ch.rgbContracts.length}`);
      });
    } else {
      console.log('❌ Channel listing failed:', channels.error);
    }

    // Example 10: Get node information
    console.log('\n🔍 10. Getting Node Information (Native SDK)');
    const nodeInfo = await client.getNodeInfo();
    if (nodeInfo.success) {
      console.log('✅ Node information:');
      console.log(`   - Node ID: ${nodeInfo.data?.nodeId}`);
      console.log(`   - Alias: ${nodeInfo.data?.alias}`);
      console.log(`   - Network: ${nodeInfo.data?.network}`);
      console.log(`   - Channels: ${nodeInfo.data?.channelCount}`);
      console.log(`   - Balance: ${nodeInfo.data?.balanceSats} sats`);
    } else {
      console.log('❌ Node info query failed:', nodeInfo.error);
    }

    console.log('\n🎉 Token4Good Native SDK integration examples completed!');

  } catch (error) {
    console.error('❌ Native SDK integration failed:', error);
  } finally {
    // Cleanup
    console.log('\n🧹 Cleaning up SDK connection...');
    await client.disconnect();
    console.log('✅ SDK disconnected');
  }
}

// Advanced educational platform with native SDK
async function advancedEducationalPlatform() {
  console.log('\n📚 Advanced Educational Platform (Native SDK)');
  console.log('==============================================\n');

  const client = new Token4GoodNativeClient();

  try {
    await client.initialize();

    // Step 1: Create comprehensive course ecosystem
    console.log('1. Creating comprehensive course ecosystem...');
    
    // Main course token
    const courseToken = await client.issueAsset({
      type: 'fungible',
      name: 'Bitcoin Lightning Development Bootcamp',
      ticker: 'BTC-LN-BOOT',
      totalSupply: 200000,
      decimals: 8
    });

    // Achievement badges (NFTs)
    const badges = await Promise.all([
      client.issueAsset({
        type: 'nft',
        name: 'Lightning Basics Badge',
        description: 'Completed Lightning Network fundamentals',
        metadata: { level: 'beginner', points: 100 }
      }),
      client.issueAsset({
        type: 'nft', 
        name: 'Channel Management Badge',
        description: 'Mastered Lightning channel operations',
        metadata: { level: 'intermediate', points: 200 }
      }),
      client.issueAsset({
        type: 'nft',
        name: 'RGB Integration Badge', 
        description: 'Expert in RGB + Lightning integration',
        metadata: { level: 'advanced', points: 300 }
      })
    ]);

    console.log('✅ Course ecosystem created:');
    console.log(`   - Main Token: ${courseToken.data?.contractId}`);
    badges.forEach((badge, i) => {
      if (badge.success) {
        console.log(`   - Badge ${i+1}: ${badge.data?.contractId}`);
      }
    });

    // Step 2: Setup Lightning infrastructure
    console.log('\n2. Setting up Lightning infrastructure...');
    
    const instructorChannel = await client.openChannel({
      peerNodeId: '03instructor123456789abcdef123456789abcdef123456789abcdef123456789ab',
      capacitySats: 5000000, // 5M sats
      rgbContracts: courseToken.success ? [courseToken.data!.contractId] : []
    });

    if (instructorChannel.success) {
      console.log(`✅ Instructor channel: ${instructorChannel.data?.channelId}`);
    }

    // Step 3: Process student enrollment with hybrid payment
    console.log('\n3. Processing student enrollment...');
    
    if (courseToken.success) {
      const enrollment = await client.processPayment({
        paymentType: 'hybrid',
        amount: 15000, // 15k tokens for full course
        lightningAmountSats: 1000, // 1000 sats network fees  
        recipient: 'instructor_treasury',
        description: 'Bitcoin Lightning Development Bootcamp - Complete Access',
        contractId: courseToken.data!.contractId
      });

      if (enrollment.success) {
        console.log('✅ Student enrolled successfully');
        console.log(`   - Payment ID: ${enrollment.data?.paymentId}`);
      }
    }

    // Step 4: Setup real-time content streaming
    console.log('\n4. Setting up content streaming system...');
    
    const videoStream = await client.createStreamingPayment({
      ratePerSecond: 0.05, // 0.05 sats per second of video
      maxDuration: 14400, // 4 hours max session
      recipient: 'content_delivery_node',
      autoClose: false // Manual control for educational content
    });

    if (videoStream.success) {
      console.log(`✅ Video streaming: ${videoStream.data?.streamId}`);
    }

    // Step 5: Issue progressive certificates
    console.log('\n5. Issuing progressive certificates...');
    
    const finalCertificate = await client.issueAsset({
      type: 'nft',
      name: 'Bitcoin Lightning Development Expert',
      description: 'Master certification in Bitcoin Lightning Network development',
      metadata: {
        student: 'alice_developer',
        course: 'BTC-LN-BOOT',
        completionDate: new Date().toISOString(),
        finalGrade: 'A+',
        skillsAcquired: [
          'Lightning Network Protocol',
          'Channel Management', 
          'Payment Routing',
          'RGB Asset Integration',
          'Lightning App Development'
        ],
        instructorSignature: 'digital_signature_hash',
        verificationHash: 'blockchain_verification_hash'
      }
    });

    if (finalCertificate.success) {
      console.log(`✅ Master certificate issued: ${finalCertificate.data?.contractId}`);
    }

    // Step 6: Analytics and reporting
    console.log('\n6. Platform analytics...');
    const nodeInfo = await client.getNodeInfo();
    const channels = await client.listChannels();
    
    if (nodeInfo.success && channels.success) {
      console.log('✅ Platform status:');
      console.log(`   - Total channels: ${channels.data?.length}`);
      console.log(`   - Node balance: ${nodeInfo.data?.balanceSats} sats`);
      console.log(`   - Network: ${nodeInfo.data?.network}`);
    }

    console.log('\n🎓 Advanced educational platform fully operational!');
    console.log('\nPlatform capabilities:');
    console.log('• Multi-tier token economy with course tokens and achievement badges');
    console.log('• Hybrid payments (RGB tokens + Lightning fees)');
    console.log('• Real-time content streaming with micropayments');
    console.log('• Progressive certification system with NFTs');
    console.log('• Instructor payment channels with automatic distribution');
    console.log('• Full Lightning Network integration for instant payments');

  } catch (error) {
    console.error('❌ Advanced platform setup failed:', error);
  } finally {
    await client.disconnect();
  }
}

// Run examples
async function main() {
  await demonstrateNativeSdkIntegration();
  await advancedEducationalPlatform();
}

if (require.main === module) {
  main().catch(console.error);
}

export { demonstrateNativeSdkIntegration, advancedEducationalPlatform };