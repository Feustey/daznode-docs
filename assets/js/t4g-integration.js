/**
 * Token4Good (T4G) Integration System
 * API Bridge entre docs.dazno.de et t4g.dazno.de
 * Implémente le système Learn-to-Earn de la stratégie Token4Good
 */

class T4GIntegration {
  constructor() {
    this.apiBaseURL = 'https://api.t4g.dazno.de';
    this.lightningAuth = null;
    this.rewardRates = this.loadRewardRates();
    this.init();
  }

  init() {
    this.setupLightningAuth();
    this.startRealtimeSync();
  }

  loadRewardRates() {
    // Configuration des récompenses T4G selon les spécifications
    return {
      // Apprentissage Personnel (Earn by Learning)
      learning: {
        quizCompletion: 10,        // 10 T4G par quiz
        moduleCompletion: 25,      // 25 T4G par module
        pathCompletion: 100,       // 100 T4G par parcours
        certification: 500         // 500 T4G par certification
      },
      
      // Contribution Communautaire (Earn by Teaching)
      community: {
        questionAnswer: 15,        // 15 T4G par réponse utile
        bestAnswer: 22.5,         // x1.5 multiplier pour meilleure réponse
        tutorialCreated: 200,      // 200 T4G par tutoriel
        tutorialPopular: 400,      // x2 si >100 vues/semaine
        mentoringSession: 50,      // 50 T4G par session
        mentoringExcellent: 60,    // x1.2 si NPS >8
        bugReport: 75,            // 75 T4G par bug report
        translation: 100,         // 100 T4G par traduction
        translationRare: 150      // x1.5 si langue rare
      },
      
      // Innovation Lightning (Earn by Building)
      innovation: {
        useCaseShared: 150,       // 150 T4G cas d'usage
        useCaseImplemented: 200,   // +50 T4G si implémenté
        codeOpenSource: 300,      // 300 T4G code open source
        codeAdopted: 400,         // +100 T4G si adopté
        workshopHosted: 250,      // 250 T4G workshop animé
        workshopRediffused: 450,   // +200 T4G si rediffusé
        researchOriginal: 500,    // 500 T4G recherche originale
        researchPublished: 1500   // +1000 T4G si publiée
      },
      
      // Bonus & Multiplicateurs
      multipliers: {
        streakDaily: 1.1,         // +10% pour streak quotidien
        streakWeekly: 1.25,       // +25% pour streak hebdomadaire
        earlyAdopter: 3.0,        // x3 pour early adopters (genesis mining)
        premium: 1.5,             // x1.5 pour abonnés premium
        complexity: {
          beginner: 1.0,
          intermediate: 1.3,
          advanced: 1.7,
          expert: 2.2
        }
      }
    };
  }

  async setupLightningAuth() {
    // Authentification unifiée via Lightning Wallet
    try {
      if (window.webln) {
        await window.webln.enable();
        this.lightningAuth = {
          enabled: true,
          pubkey: await this.getLightningPubkey(),
          wallet: 'webln'
        };
      } else if (window.nostr) {
        // Fallback NOSTR auth si WebLN non disponible
        this.lightningAuth = {
          enabled: true,
          pubkey: await this.getNostrPubkey(),
          wallet: 'nostr'
        };
      }
      
      if (this.lightningAuth) {
        await this.syncUserProfile();
      }
    } catch (error) {
      console.warn('Lightning auth failed, using local storage:', error);
      this.lightningAuth = { enabled: false };
    }
  }

  async getLightningPubkey() {
    // Récupération de la clé publique Lightning
    const info = await window.webln.getInfo();
    return info.node.alias || info.node.pubkey;
  }

  async getNostrPubkey() {
    // Récupération de la clé publique NOSTR
    const pubkey = await window.nostr.getPublicKey();
    return pubkey;
  }

  async syncUserProfile() {
    // Synchronisation du profil utilisateur avec t4g.dazno.de
    try {
      const response = await this.apiRequest('/user/sync', 'POST', {
        pubkey: this.lightningAuth.pubkey,
        platform: 'docs.dazno.de',
        timestamp: Date.now()
      });
      
      return response.user;
    } catch (error) {
      console.error('User sync failed:', error);
      return null;
    }
  }

  async awardT4G(action, amount, metadata = {}) {
    // Attribution de tokens T4G pour une action
    try {
      // Calcul des multiplicateurs
      const finalAmount = this.calculateFinalReward(action, amount, metadata);
      
      // Enregistrement local immédiat
      this.updateLocalBalance(finalAmount, action);
      
      // Synchronisation avec le serveur
      const result = await this.apiRequest('/rewards/award', 'POST', {
        userPubkey: this.lightningAuth?.pubkey,
        action: action,
        baseAmount: amount,
        finalAmount: finalAmount,
        metadata: metadata,
        timestamp: Date.now(),
        source: 'docs.dazno.de'
      });
      
      if (result.success) {
        // Token burning automatique (5% selon les specs)
        await this.burnTokens(finalAmount * 0.05);
        
        // Notification utilisateur
        this.showT4GRewardNotification(finalAmount, action, metadata);
        
        // Event pour autres systèmes
        this.dispatchT4GEvent('reward-awarded', {
          amount: finalAmount,
          action: action,
          newBalance: result.newBalance
        });
        
        return result;
      }
      
    } catch (error) {
      console.error('T4G award failed:', error);
      // Garder la récompense locale même si sync échoue
      return { success: false, error: error.message };
    }
  }

  calculateFinalReward(action, baseAmount, metadata) {
    let finalAmount = baseAmount;
    const multipliers = this.rewardRates.multipliers;
    
    // Multiplicateur complexité
    if (metadata.difficulty) {
      finalAmount *= multipliers.complexity[metadata.difficulty] || 1.0;
    }
    
    // Multiplicateur streak
    if (metadata.streakDays >= 7) {
      finalAmount *= multipliers.streakWeekly;
    } else if (metadata.streakDays >= 1) {
      finalAmount *= multipliers.streakDaily;
    }
    
    // Multiplicateur early adopter (genesis mining)
    if (metadata.isEarlyAdopter) {
      finalAmount *= multipliers.earlyAdopter;
    }
    
    // Multiplicateur premium
    if (metadata.isPremium) {
      finalAmount *= multipliers.premium;
    }
    
    return Math.floor(finalAmount);
  }

  updateLocalBalance(amount, action) {
    // Mise à jour du solde local
    const userData = JSON.parse(localStorage.getItem('lightningUserData') || '{}');
    userData.t4gBalance = (userData.t4gBalance || 0) + amount;
    userData.t4gTotal = (userData.t4gTotal || 0) + amount;
    
    // Historique des transactions
    if (!userData.t4gHistory) userData.t4gHistory = [];
    userData.t4gHistory.unshift({
      amount: amount,
      action: action,
      timestamp: Date.now(),
      type: 'earned'
    });
    
    // Garder seulement les 100 dernières transactions
    userData.t4gHistory = userData.t4gHistory.slice(0, 100);
    
    localStorage.setItem('lightningUserData', JSON.stringify(userData));
    
    // Mettre à jour l'UI
    this.updateT4GBalanceUI(userData.t4gBalance);
  }

  async burnTokens(amount) {
    // Mécanisme de token burning (5% selon les specs)
    try {
      await this.apiRequest('/tokens/burn', 'POST', {
        amount: amount,
        reason: 'automatic_deflation',
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Token burning failed:', error);
    }
  }

  showT4GRewardNotification(amount, action, metadata) {
    // Notification de récompense T4G
    const notification = document.createElement('div');
    notification.className = 't4g-reward-notification';
    
    const actionNames = {
      'quiz-completion': 'Quiz complété',
      'module-completion': 'Module terminé',
      'path-completion': 'Parcours achevé',
      'question-answered': 'Question répondue',
      'tutorial-created': 'Tutoriel créé',
      'mentoring-session': 'Session de mentorat',
      'bug-report': 'Bug reporté',
      'code-contribution': 'Code contribué'
    };
    
    notification.innerHTML = `
      <div class="t4g-reward-content">
        <div class="t4g-icon">💎</div>
        <div class="reward-details">
          <div class="reward-amount">+${amount.toLocaleString()} T4G</div>
          <div class="reward-action">${actionNames[action] || action}</div>
          ${metadata.multiplier ? `<div class="reward-multiplier">×${metadata.multiplier}</div>` : ''}
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animation
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 500);
    }, 4000);
    
    // Effet sonore
    this.playT4GSound('reward');
  }

  updateT4GBalanceUI(newBalance) {
    // Mise à jour de l'affichage du solde T4G
    const balanceElements = document.querySelectorAll('.t4g-balance-amount');
    balanceElements.forEach(el => {
      el.textContent = newBalance.toLocaleString();
    });
    
    // Animation de changement
    const mainBalance = document.getElementById('main-t4g-balance');
    if (mainBalance) {
      mainBalance.classList.add('balance-updated');
      setTimeout(() => mainBalance.classList.remove('balance-updated'), 1000);
    }
  }

  async getT4GBalance() {
    // Récupération du solde T4G actuel
    try {
      const response = await this.apiRequest('/user/balance', 'GET');
      return response.balance;
    } catch (error) {
      // Fallback sur le stockage local
      const userData = JSON.parse(localStorage.getItem('lightningUserData') || '{}');
      return userData.t4gBalance || 0;
    }
  }

  async stakingRewards(amount, duration) {
    // Système de staking T4G selon les specs
    const stakingRates = {
      30: { apy: 0.05, bonus: 'priority_access' },
      90: { apy: 0.08, bonus: 'dev_feedback' },
      365: { apy: 0.15, bonus: 'roadmap_codesign' }
    };
    
    const plan = stakingRates[duration];
    if (!plan) throw new Error('Invalid staking duration');
    
    try {
      const result = await this.apiRequest('/staking/stake', 'POST', {
        amount: amount,
        duration: duration,
        expectedAPY: plan.apy,
        bonus: plan.bonus,
        timestamp: Date.now()
      });
      
      if (result.success) {
        // Mise à jour locale
        const userData = JSON.parse(localStorage.getItem('lightningUserData') || '{}');
        userData.t4gBalance -= amount;
        userData.stakingBalance = (userData.stakingBalance || 0) + amount;
        localStorage.setItem('lightningUserData', JSON.stringify(userData));
        
        this.updateT4GBalanceUI(userData.t4gBalance);
      }
      
      return result;
    } catch (error) {
      console.error('Staking failed:', error);
      return { success: false, error: error.message };
    }
  }

  async mintNFTBadge(achievementId, metadata) {
    // Minting de badges NFT pour achievements exceptionnels
    try {
      const nftData = {
        achievementId: achievementId,
        userPubkey: this.lightningAuth?.pubkey,
        metadata: {
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          attributes: metadata.attributes,
          mintedAt: Date.now(),
          platform: 'docs.dazno.de'
        }
      };
      
      const result = await this.apiRequest('/nft/mint', 'POST', nftData);
      
      if (result.success) {
        // Ajouter le NFT à la collection locale
        const userData = JSON.parse(localStorage.getItem('lightningUserData') || '{}');
        if (!userData.nftBadges) userData.nftBadges = [];
        userData.nftBadges.push({
          tokenId: result.tokenId,
          achievementId: achievementId,
          metadata: nftData.metadata
        });
        localStorage.setItem('lightningUserData', JSON.stringify(userData));
        
        // Notification spéciale NFT
        this.showNFTMintNotification(result.tokenId, metadata);
      }
      
      return result;
    } catch (error) {
      console.error('NFT minting failed:', error);
      return { success: false, error: error.message };
    }
  }

  showNFTMintNotification(tokenId, metadata) {
    // Notification spéciale pour NFT badge
    const notification = document.createElement('div');
    notification.className = 'nft-mint-notification';
    notification.innerHTML = `
      <div class="nft-content">
        <div class="nft-icon">🏆</div>
        <h3>NFT Badge Obtenu!</h3>
        <h4>${metadata.name}</h4>
        <p>Token ID: #${tokenId}</p>
        <div class="nft-tradeable">✨ Échangeable sur marketplace</div>
      </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 500);
    }, 6000);
    
    this.playT4GSound('nft-mint');
  }

  startRealtimeSync() {
    // Synchronisation temps réel avec WebSocket
    try {
      const wsURL = this.apiBaseURL.replace('https://', 'wss://') + '/ws';
      this.websocket = new WebSocket(wsURL);
      
      this.websocket.onopen = () => {
        console.log('T4G WebSocket connected');
        // S'authentifier
        this.websocket.send(JSON.stringify({
          type: 'auth',
          pubkey: this.lightningAuth?.pubkey
        }));
      };
      
      this.websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleRealtimeMessage(data);
      };
      
      this.websocket.onerror = (error) => {
        console.error('T4G WebSocket error:', error);
      };
      
      this.websocket.onclose = () => {
        console.log('T4G WebSocket closed, attempting reconnection...');
        setTimeout(() => this.startRealtimeSync(), 5000);
      };
      
    } catch (error) {
      console.warn('WebSocket connection failed:', error);
    }
  }

  handleRealtimeMessage(data) {
    switch (data.type) {
      case 'balance-update':
        this.updateT4GBalanceUI(data.newBalance);
        break;
      case 'reward-received':
        this.showT4GRewardNotification(data.amount, data.action, data.metadata);
        break;
      case 'community-notification':
        this.showCommunityNotification(data);
        break;
      case 'leaderboard-update':
        this.updateLeaderboard(data.leaderboard);
        break;
    }
  }

  showCommunityNotification(data) {
    // Notifications de la communauté t4g.dazno.de
    if (data.relevantToUser) {
      const notification = document.createElement('div');
      notification.className = 'community-notification';
      notification.innerHTML = `
        <div class="community-content">
          <div class="community-icon">${data.icon}</div>
          <div class="community-message">
            <strong>${data.title}</strong>
            <p>${data.message}</p>
            ${data.reward ? `<div class="potential-reward">💎 ${data.reward} T4G disponibles</div>` : ''}
          </div>
        </div>
      `;
      
      document.body.appendChild(notification);
      setTimeout(() => notification.classList.add('show'), 100);
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
      }, 8000);
    }
  }

  updateLeaderboard(leaderboardData) {
    // Mise à jour du leaderboard unifié
    const leaderboard = document.getElementById('t4g-leaderboard');
    if (leaderboard) {
      leaderboard.innerHTML = leaderboardData.map((user, index) => `
        <div class="leaderboard-entry ${user.isCurrentUser ? 'current-user' : ''}">
          <div class="rank">${this.getRankEmoji(index + 1)} ${index + 1}</div>
          <div class="user-info">
            <span class="username">${user.username}</span>
            <span class="speciality">${user.speciality}</span>
          </div>
          <div class="score">
            <span class="t4g-amount">${user.t4gTotal.toLocaleString()} T4G</span>
            <span class="impact-score">${user.impactScore}/10</span>
          </div>
        </div>
      `).join('');
    }
  }

  getRankEmoji(rank) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  }

  playT4GSound(type) {
    const sounds = {
      'reward': '/assets/sounds/t4g-reward.mp3',
      'nft-mint': '/assets/sounds/nft-mint.mp3',
      'staking': '/assets/sounds/staking.mp3',
      'level-up': '/assets/sounds/level-up.mp3'
    };
    
    if (sounds[type]) {
      const audio = new Audio(sounds[type]);
      audio.volume = 0.2;
      audio.play().catch(e => console.log('T4G audio play failed:', e));
    }
  }

  dispatchT4GEvent(eventName, data) {
    // Dispatch d'events pour communication inter-systèmes
    const event = new CustomEvent(`t4g:${eventName}`, {
      detail: data
    });
    document.dispatchEvent(event);
  }

  async apiRequest(endpoint, method = 'GET', data = null) {
    // Requêtes API vers t4g.dazno.de
    const url = `${this.apiBaseURL}${endpoint}`;
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return await response.json();
  }

  getAuthToken() {
    // Génération du token d'authentification Lightning
    if (this.lightningAuth?.pubkey) {
      return btoa(`${this.lightningAuth.pubkey}:${Date.now()}`);
    }
    return 'anonymous';
  }

  // API publique pour intégration
  static getInstance() {
    if (!T4GIntegration.instance) {
      T4GIntegration.instance = new T4GIntegration();
    }
    return T4GIntegration.instance;
  }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
  window.t4gAPI = T4GIntegration.getInstance();
});

// Export pour modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = T4GIntegration;
}