/**
 * Dashboard Communautaire Daznode + T4G
 * Métriques temps réel, leaderboards, challenges et analytics
 */

class CommunityDashboard {
  constructor() {
    this.apiBaseUrl = '/api/community';
    this.wsConnection = null;
    this.chartInstances = {};
    this.refreshInterval = 30000; // 30 secondes
    this.init();
  }
  
  async init() {
    await this.initializeWebSocket();
    await this.loadDashboardData();
    this.setupRefreshInterval();
    this.setupEventListeners();
  }
  
  /**
   * Initialize WebSocket connection pour les updates temps réel
   */
  async initializeWebSocket() {
    try {
      const wsUrl = `wss://${window.location.host}/ws/community`;
      this.wsConnection = new WebSocket(wsUrl);
      
      this.wsConnection.onopen = () => {
        console.log('WebSocket community dashboard connected');
      };
      
      this.wsConnection.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleRealTimeUpdate(data);
      };
      
      this.wsConnection.onclose = () => {
        console.log('WebSocket disconnected, attempting reconnection...');
        setTimeout(() => this.initializeWebSocket(), 5000);
      };
      
    } catch (error) {
      console.error('WebSocket initialization failed:', error);
    }
  }
  
  /**
   * Load initial dashboard data
   */
  async loadDashboardData() {
    try {
      const [networkStats, contributionStats, challengeStats, leaderboard] = await Promise.all([
        this.fetchNetworkStats(),
        this.fetchContributionStats(),
        this.fetchChallengeStats(),
        this.fetchLeaderboard()
      ]);
      
      this.renderNetworkMetrics(networkStats);
      this.renderContributionMetrics(contributionStats);
      this.renderChallengeProgress(challengeStats);
      this.renderLeaderboard(leaderboard);
      this.renderRecentActivity();
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.showError('Failed to load dashboard data');
    }
  }
  
  /**
   * Fetch network statistics
   */
  async fetchNetworkStats() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/network-stats`);
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error fetching network stats:', error);
      return null;
    }
  }
  
  /**
   * Fetch contribution statistics
   */
  async fetchContributionStats() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/contribution-stats`);
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error fetching contribution stats:', error);
      return null;
    }
  }
  
  /**
   * Fetch challenge statistics
   */
  async fetchChallengeStats() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/challenge-stats`);
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error fetching challenge stats:', error);
      return null;
    }
  }
  
  /**
   * Fetch leaderboard data
   */
  async fetchLeaderboard() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/leaderboard`);
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return null;
    }
  }
  
  /**
   * Render network metrics
   */
  renderNetworkMetrics(stats) {
    if (!stats) return;
    
    const container = document.getElementById('network-metrics');
    if (!container) return;
    
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="metric-card lightning-nodes">
          <div class="metric-icon">⚡</div>
          <div class="metric-content">
            <h3 class="metric-title">Nœuds Lightning Actifs</h3>
            <div class="metric-value">${stats.activeNodes?.toLocaleString() || 0}</div>
            <div class="metric-trend ${stats.nodeGrowth >= 0 ? 'positive' : 'negative'}">
              ${stats.nodeGrowth >= 0 ? '↗' : '↘'} ${Math.abs(stats.nodeGrowth || 0)}%
            </div>
          </div>
        </div>
        
        <div class="metric-card network-capacity">
          <div class="metric-icon">💰</div>
          <div class="metric-content">
            <h3 class="metric-title">Capacité Réseau</h3>
            <div class="metric-value">${this.formatSats(stats.totalCapacity || 0)} BTC</div>
            <div class="metric-trend ${stats.capacityGrowth >= 0 ? 'positive' : 'negative'}">
              ${stats.capacityGrowth >= 0 ? '↗' : '↘'} ${Math.abs(stats.capacityGrowth || 0)}%
            </div>
          </div>
        </div>
        
        <div class="metric-card roi-metric">
          <div class="metric-icon">📈</div>
          <div class="metric-content">
            <h3 class="metric-title">ROI Moyen Communauté</h3>
            <div class="metric-value">${(stats.avgROI || 0).toFixed(2)}%</div>
            <div class="metric-trend ${stats.roiTrend >= 0 ? 'positive' : 'negative'}">
              ${stats.roiTrend >= 0 ? '↗' : '↘'} ${Math.abs(stats.roiTrend || 0).toFixed(1)}%
            </div>
          </div>
        </div>
        
        <div class="metric-card uptime-metric">
          <div class="metric-icon">🟢</div>
          <div class="metric-content">
            <h3 class="metric-title">Uptime Moyen</h3>
            <div class="metric-value">${(stats.avgUptime || 0).toFixed(1)}%</div>
            <div class="metric-trend ${stats.uptimeTrend >= 0 ? 'positive' : 'negative'}">
              ${stats.uptimeTrend >= 0 ? '↗' : '↘'} ${Math.abs(stats.uptimeTrend || 0).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Render contribution metrics
   */
  renderContributionMetrics(stats) {
    if (!stats) return;
    
    const container = document.getElementById('contribution-metrics');
    if (!container) return;
    
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="metric-card contributions-monthly">
          <div class="metric-icon">📚</div>
          <div class="metric-content">
            <h3 class="metric-title">Contributions ce mois</h3>
            <div class="metric-value">${stats.monthlyContributions || 0}</div>
            <div class="metric-trend ${stats.contributionGrowth >= 0 ? 'positive' : 'negative'}">
              ${stats.contributionGrowth >= 0 ? '↗' : '↘'} ${Math.abs(stats.contributionGrowth || 0)}%
            </div>
          </div>
        </div>
        
        <div class="metric-card rewards-distributed">
          <div class="metric-icon">🎁</div>
          <div class="metric-content">
            <h3 class="metric-title">T4G Distribués</h3>
            <div class="metric-value">${(stats.totalRewardsDistributed || 0).toLocaleString()}</div>
            <div class="metric-subtitle">Ce mois: ${(stats.monthlyRewards || 0).toLocaleString()}</div>
          </div>
        </div>
        
        <div class="metric-card active-contributors">
          <div class="metric-icon">👥</div>
          <div class="metric-content">
            <h3 class="metric-title">Contributeurs Actifs</h3>
            <div class="metric-value">${stats.activeContributors || 0}</div>
            <div class="metric-subtitle">Nouveaux: +${stats.newContributors || 0}</div>
          </div>
        </div>
      </div>
      
      <div class="contributions-by-domain mt-8">
        <h3 class="section-title">Contributions par Domaine</h3>
        <div id="domain-chart" class="chart-container"></div>
      </div>
    `;
    
    this.renderDomainChart(stats.contributionsByDomain);
  }
  
  /**
   * Render challenge progress
   */
  renderChallengeProgress(stats) {
    if (!stats) return;
    
    const container = document.getElementById('challenge-progress');
    if (!container) return;
    
    const activeChallenges = stats.activeChallenges || [];
    
    container.innerHTML = `
      <div class="challenges-header">
        <h3 class="section-title">Challenges en Cours</h3>
        <a href="/community/challenges/" class="view-all-btn">Voir tous</a>
      </div>
      
      <div class="challenges-grid">
        ${activeChallenges.map(challenge => `
          <div class="challenge-card" data-challenge-id="${challenge._id}">
            <div class="challenge-header">
              <div class="challenge-type ${challenge.type}">${this.getChallengeTypeIcon(challenge.type)}</div>
              <div class="challenge-reward">🎁 ${challenge.rewards.totalPool} T4G</div>
            </div>
            
            <h4 class="challenge-title">${challenge.title}</h4>
            <p class="challenge-description">${challenge.description}</p>
            
            <div class="challenge-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${(challenge.participantCount / challenge.maxParticipants * 100) || 0}%"></div>
              </div>
              <div class="progress-text">
                ${challenge.participantCount || 0} / ${challenge.maxParticipants || '∞'} participants
              </div>
            </div>
            
            <div class="challenge-footer">
              <div class="challenge-difficulty difficulty-${challenge.difficulty}">
                ${challenge.difficulty}
              </div>
              <div class="challenge-deadline">
                ${this.formatTimeRemaining(challenge.endDate)}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  /**
   * Render leaderboard
   */
  renderLeaderboard(data) {
    if (!data) return;
    
    const container = document.getElementById('leaderboard');
    if (!container) return;
    
    const expertiseLeaderboards = data.byExpertise || {};
    const globalLeaderboard = data.global || [];
    
    container.innerHTML = `
      <div class="leaderboard-tabs">
        <button class="tab-btn active" data-tab="global">🏆 Global</button>
        <button class="tab-btn" data-tab="lightning">⚡ Lightning</button>
        <button class="tab-btn" data-tab="hardware">🔧 Hardware</button>
        <button class="tab-btn" data-tab="security">🛡️ Security</button>
        <button class="tab-btn" data-tab="economics">💰 Economics</button>
      </div>
      
      <div class="leaderboard-content">
        <div class="tab-panel active" id="tab-global">
          ${this.renderLeaderboardList(globalLeaderboard, 'global')}
        </div>
        
        ${Object.entries(expertiseLeaderboards).map(([domain, leaders]) => `
          <div class="tab-panel" id="tab-${domain}">
            ${this.renderLeaderboardList(leaders, domain)}
          </div>
        `).join('')}
      </div>
    `;
    
    this.setupLeaderboardTabs();
  }
  
  /**
   * Render leaderboard list
   */
  renderLeaderboardList(leaders, domain) {
    return `
      <div class="leaderboard-list">
        ${leaders.map((leader, index) => `
          <div class="leaderboard-item ${index < 3 ? 'top-three' : ''}">
            <div class="rank">
              ${index + 1 <= 3 ? this.getRankMedal(index + 1) : `#${index + 1}`}
            </div>
            
            <div class="user-info">
              <img src="${leader.profile?.avatar || '/assets/images/default-avatar.png'}" 
                   alt="${leader.username}" class="user-avatar">
              <div class="user-details">
                <div class="username">${leader.username}</div>
                ${leader.profile?.firstName && leader.profile?.lastName ? 
                  `<div class="real-name">${leader.profile.firstName} ${leader.profile.lastName}</div>` : 
                  ''
                }
              </div>
            </div>
            
            <div class="user-stats">
              <div class="reputation-score">
                ${domain === 'global' ? 
                  leader.reputation?.totalScore || 0 : 
                  leader.expertises?.find(exp => exp.domain === domain)?.reputationScore || 0
                }
              </div>
              <div class="contributions-count">
                ${leader.reputation?.contributionsCount || 0} contributions
              </div>
            </div>
            
            <div class="user-badges">
              ${this.renderUserBadges(leader.expertises, domain)}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  /**
   * Render recent activity feed
   */
  async renderRecentActivity() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/recent-activity`);
      const data = await response.json();
      
      if (!data.success) return;
      
      const container = document.getElementById('recent-activity');
      if (!container) return;
      
      const activities = data.data || [];
      
      container.innerHTML = `
        <div class="activity-header">
          <h3 class="section-title">Activité Récente</h3>
          <div class="activity-filters">
            <button class="filter-btn active" data-filter="all">Tout</button>
            <button class="filter-btn" data-filter="contributions">Contributions</button>
            <button class="filter-btn" data-filter="reviews">Reviews</button>
            <button class="filter-btn" data-filter="tests">Tests</button>
          </div>
        </div>
        
        <div class="activity-feed">
          ${activities.map(activity => `
            <div class="activity-item" data-type="${activity.type}">
              <div class="activity-icon">${this.getActivityIcon(activity.type)}</div>
              <div class="activity-content">
                <div class="activity-text">${this.formatActivityText(activity)}</div>
                <div class="activity-time">${this.formatRelativeTime(activity.createdAt)}</div>
              </div>
              ${activity.reward ? `<div class="activity-reward">+${activity.reward} T4G</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
      
      this.setupActivityFilters();
      
    } catch (error) {
      console.error('Error rendering recent activity:', error);
    }
  }
  
  /**
   * Render domain contributions chart
   */
  renderDomainChart(domainData) {
    const chartContainer = document.getElementById('domain-chart');
    if (!chartContainer || !domainData) return;
    
    const data = domainData.map(item => ({
      domain: this.getDomainLabel(item._id),
      count: item.count,
      color: this.getDomainColor(item._id)
    }));
    
    // Simple bar chart implementation
    const maxCount = Math.max(...data.map(d => d.count));
    
    chartContainer.innerHTML = `
      <div class="domain-bars">
        ${data.map(item => `
          <div class="domain-bar">
            <div class="bar-label">${item.domain}</div>
            <div class="bar-container">
              <div class="bar-fill" 
                   style="width: ${(item.count / maxCount) * 100}%; background-color: ${item.color}">
              </div>
              <div class="bar-value">${item.count}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  /**
   * Handle real-time updates from WebSocket
   */
  handleRealTimeUpdate(data) {
    switch (data.type) {
      case 'new_contribution':
        this.updateContributionMetrics(data.data);
        this.addActivityItem(data.data);
        break;
        
      case 'reward_distributed':
        this.updateRewardMetrics(data.data);
        break;
        
      case 'challenge_update':
        this.updateChallengeProgress(data.data);
        break;
        
      case 'network_metrics':
        this.updateNetworkMetrics(data.data);
        break;
    }
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Refresh button
    const refreshBtn = document.getElementById('refresh-dashboard');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.loadDashboardData());
    }
    
    // Challenge cards click
    document.addEventListener('click', (e) => {
      const challengeCard = e.target.closest('.challenge-card');
      if (challengeCard) {
        const challengeId = challengeCard.dataset.challengeId;
        window.location.href = `/community/challenges/${challengeId}`;
      }
    });
  }
  
  /**
   * Setup leaderboard tabs
   */
  setupLeaderboardTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        // Update active states
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`tab-${tabId}`)?.classList.add('active');
      });
    });
  }
  
  /**
   * Setup activity filters
   */
  setupActivityFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const activityItems = document.querySelectorAll('.activity-item');
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        // Update active states
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter items
        activityItems.forEach(item => {
          if (filter === 'all' || item.dataset.type === filter) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
  
  /**
   * Setup refresh interval
   */
  setupRefreshInterval() {
    setInterval(() => {
      this.loadDashboardData();
    }, this.refreshInterval);
  }
  
  // Utility functions
  formatSats(sats) {
    return (sats / 100000000).toFixed(8);
  }
  
  formatTimeRemaining(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Terminé';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}j ${hours}h`;
    return `${hours}h`;
  }
  
  formatRelativeTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `Il y a ${days}j`;
    if (hours > 0) return `Il y a ${hours}h`;
    return `Il y a ${minutes}min`;
  }
  
  getChallengeTypeIcon(type) {
    const icons = {
      'monthly_challenge': '🏆',
      'hackathon': '⚡',
      'bug_bounty': '🐛',
      'peer_review_contest': '👥',
      'optimization_contest': '📈'
    };
    return icons[type] || '🎯';
  }
  
  getRankMedal(rank) {
    const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
    return medals[rank] || `#${rank}`;
  }
  
  getDomainLabel(domain) {
    const labels = {
      'lightning': '⚡ Lightning',
      'hardware': '🔧 Hardware',
      'security': '🛡️ Security',
      'economics': '💰 Economics',
      'education': '🎓 Education',
      'decentralization': '🌐 Décentralisation',
      't4g_innovation': '🚀 Innovation T4G'
    };
    return labels[domain] || domain;
  }
  
  getDomainColor(domain) {
    const colors = {
      'lightning': '#f7931a',
      'hardware': '#6b7280',
      'security': '#ef4444',
      'economics': '#10b981',
      'education': '#3b82f6',
      'decentralization': '#8b5cf6',
      't4g_innovation': '#f59e0b'
    };
    return colors[domain] || '#6b7280';
  }
  
  getActivityIcon(type) {
    const icons = {
      'contribution': '📝',
      'review': '👀',
      'test': '🧪',
      'reward': '🎁',
      'challenge': '🏆'
    };
    return icons[type] || '📄';
  }
  
  formatActivityText(activity) {
    switch (activity.type) {
      case 'contribution':
        return `<strong>${activity.user.username}</strong> a publié <em>${activity.contribution.title}</em>`;
      case 'review':
        return `<strong>${activity.user.username}</strong> a reviewé <em>${activity.contribution.title}</em>`;
      case 'test':
        return `<strong>${activity.user.username}</strong> a testé <em>${activity.contribution.title}</em>`;
      default:
        return activity.text;
    }
  }
  
  renderUserBadges(expertises, domain) {
    if (!expertises) return '';
    
    if (domain === 'global') {
      return expertises
        .filter(exp => exp.level in ['expert', 'master'])
        .slice(0, 3)
        .map(exp => `<span class="badge badge-${exp.domain}">${this.getDomainLabel(exp.domain).split(' ')[0]}</span>`)
        .join('');
    } else {
      const expertise = expertises.find(exp => exp.domain === domain);
      return expertise ? `<span class="badge badge-${expertise.level}">${expertise.level}</span>` : '';
    }
  }
  
  showError(message) {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="error-message">
          <span class="error-icon">⚠️</span>
          <span class="error-text">${message}</span>
        </div>
      `;
      setTimeout(() => {
        errorContainer.innerHTML = '';
      }, 5000);
    }
  }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CommunityDashboard();
});