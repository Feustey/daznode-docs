---
layout: dashboard
title: Dashboard Personnel - Daznode
description: Votre espace personnalisé pour suivre votre progression, gérer vos récompenses T4G et accéder à vos contenus favoris
requiresAuth: true
---

# 📊 Dashboard Personnel

<div class="dashboard-header">
  <div class="user-greeting">
    <h2>Bonjour <span id="user-name">Utilisateur</span>! 👋</h2>
    <p>Bienvenue dans votre espace Daznode personnalisé</p>
  </div>
  <div class="quick-stats">
    <div class="stat-card">
      <span class="stat-icon">💰</span>
      <span class="stat-value" id="t4g-balance">0</span>
      <span class="stat-label">T4G Tokens</span>
    </div>
    <div class="stat-card">
      <span class="stat-icon">🏆</span>
      <span class="stat-value" id="level-badge">Débutant</span>
      <span class="stat-label">Niveau</span>
    </div>
    <div class="stat-card">
      <span class="stat-icon">📈</span>
      <span class="stat-value" id="progress-percentage">15%</span>
      <span class="stat-label">Progression</span>
    </div>
  </div>
</div>

## Mon Parcours d'Apprentissage

<div class="learning-progress">
  <div class="progress-section">
    <h3>🌱 Niveau 1: Fondamentaux</h3>
    <div class="progress-bar">
      <div class="progress-fill" data-progress="75"></div>
    </div>
    <div class="modules-grid">
      <div class="module-card completed">
        <span class="module-icon">✅</span>
        <h4>Bitcoin expliqué simplement</h4>
        <p>+40 T4G gagnés</p>
      </div>
      <div class="module-card completed">
        <span class="module-icon">✅</span>
        <h4>Votre premier wallet</h4>
        <p>+35 T4G gagnés</p>
      </div>
      <div class="module-card current">
        <span class="module-icon">🔄</span>
        <h4>Sécurité essentielle</h4>
        <p>En cours - +50 T4G disponibles</p>
        <a href="/learn/fundamentals/security-basics/" class="continue-btn">Continuer →</a>
      </div>
    </div>
  </div>
  
  <div class="progress-section locked">
    <h3>⚡ Niveau 2: Lightning Network</h3>
    <div class="unlock-info">
      <p>🔒 Débloqué après complétion du Niveau 1</p>
      <p>Récompenses potentielles: 240 T4G</p>
    </div>
  </div>
</div>

## Mes Récompenses T4G

<div class="rewards-section">
  <div class="balance-card">
    <h3>💎 Balance Actuelle</h3>
    <div class="balance-display">
      <span class="balance-amount">1,245 T4G</span>
      <span class="balance-usd">≈ $12.45 USD</span>
    </div>
    <div class="balance-actions">
      <button class="btn-primary">Échanger</button>
      <button class="btn-secondary">Historique</button>
    </div>
  </div>
  
  <div class="earnings-summary">
    <h3>📈 Gains ce mois</h3>
    <div class="earnings-breakdown">
      <div class="earning-item">
        <span class="earning-source">Guides complétés</span>
        <span class="earning-amount">+320 T4G</span>
      </div>
      <div class="earning-item">
        <span class="earning-source">Peer reviews</span>
        <span class="earning-amount">+85 T4G</span>
      </div>
      <div class="earning-item">
        <span class="earning-source">Mentoring</span>
        <span class="earning-amount">+150 T4G</span>
      </div>
    </div>
  </div>
  
  <div class="next-rewards">
    <h3>🎯 Prochaines Récompenses</h3>
    <div class="reward-opportunities">
      <div class="opportunity-card">
        <span class="opportunity-icon">📝</span>
        <div class="opportunity-info">
          <h4>Créer un guide DazBox</h4>
          <p>Partagez votre expérience setup</p>
        </div>
        <span class="opportunity-reward">+200 T4G</span>
      </div>
      <div class="opportunity-card">
        <span class="opportunity-icon">🏆</span>
        <div class="opportunity-info">
          <h4>Challenge mensuel</h4>
          <p>Optimisation de canaux Lightning</p>
        </div>
        <span class="opportunity-reward">+500 T4G</span>
      </div>
    </div>
  </div>
</div>

## Mes Domaines d'Expertise

<div class="expertise-section">
  <div class="expertise-grid">
    <div class="expertise-card active">
      <span class="expertise-icon">⚡</span>
      <h3>Lightning Network</h3>
      <div class="expertise-level">
        <span class="level-text">Intermédiaire</span>
        <div class="level-progress">
          <div class="level-fill" style="width: 65%"></div>
        </div>
      </div>
      <div class="expertise-stats">
        <span>12 contributions</span>
        <span>340 T4G gagnés</span>
      </div>
    </div>
    
    <div class="expertise-card">
      <span class="expertise-icon">🔧</span>
      <h3>Hardware/DazBox</h3>
      <div class="expertise-level">
        <span class="level-text">Débutant</span>
        <div class="level-progress">
          <div class="level-fill" style="width: 25%"></div>
        </div>
      </div>
      <div class="expertise-stats">
        <span>3 contributions</span>
        <span>80 T4G gagnés</span>
      </div>
    </div>
    
    <div class="expertise-card locked">
      <span class="expertise-icon">🛡️</span>
      <h3>Sécurité</h3>
      <div class="unlock-requirement">
        <p>Complétez 5 guides Lightning pour débloquer</p>
      </div>
    </div>
  </div>
</div>

## Activité Récente

<div class="activity-section">
  <div class="activity-feed">
    <div class="activity-item">
      <span class="activity-icon success">✅</span>
      <div class="activity-content">
        <h4>Guide "Premier canal Lightning" complété</h4>
        <p>Il y a 2 heures • +80 T4G</p>
      </div>
    </div>
    
    <div class="activity-item">
      <span class="activity-icon review">📋</span>
      <div class="activity-content">
        <h4>Review reçue sur "Setup DazBox débutant"</h4>
        <p>Il y a 5 heures • Note: 4.8/5 ⭐</p>
      </div>
    </div>
    
    <div class="activity-item">
      <span class="activity-icon community">🤝</span>
      <div class="activity-content">
        <h4>Session mentoring avec @BitcoinExpert</h4>
        <p>Hier • +50 T4G bonus mentee</p>
      </div>
    </div>
    
    <div class="activity-item">
      <span class="activity-icon achievement">🏆</span>
      <div class="activity-content">
        <h4>Badge "First Contributor" débloqué</h4>
        <p>Il y a 3 jours • +100 T4G bonus</p>
      </div>
    </div>
  </div>
</div>

## Actions Rapides

<div class="quick-actions">
  <div class="action-grid">
    <a href="/community/contribute/" class="action-card primary">
      <span class="action-icon">✍️</span>
      <h3>Créer du Contenu</h3>
      <p>Partagez votre expertise et gagnez des T4G</p>
    </a>
    
    <a href="/community/mentoring/" class="action-card">
      <span class="action-icon">🎓</span>
      <h3>Trouver un Mentor</h3>
      <p>Accélérez votre apprentissage</p>
    </a>
    
    <a href="/technical/tools/" class="action-card">
      <span class="action-icon">🛠️</span>
      <h3>Outils Techniques</h3>
      <p>Calculateurs et utilitaires</p>
    </a>
    
    <a href="/community/challenges/" class="action-card highlight">
      <span class="action-icon">🏆</span>
      <h3>Challenges Actifs</h3>
      <p>3 challenges disponibles</p>
      <span class="action-badge">5000 T4G</span>
    </a>
  </div>
</div>

## Personnalisation

<div class="settings-section">
  <h3>⚙️ Préférences</h3>
  <div class="settings-grid">
    <div class="setting-item">
      <label class="setting-label">
        <input type="checkbox" checked>
        <span class="checkmark"></span>
        Notifications de nouvelles récompenses
      </label>
    </div>
    
    <div class="setting-item">
      <label class="setting-label">
        <input type="checkbox" checked>
        <span class="checkmark"></span>
        Recommandations personnalisées
      </label>
    </div>
    
    <div class="setting-item">
      <label class="setting-label">
        <input type="checkbox">
        <span class="checkmark"></span>
        Rappels de progression hebdomadaires
      </label>
    </div>
    
    <div class="setting-item theme-selector">
      <span class="setting-title">Thème d'affichage</span>
      <div class="theme-options">
        <button class="theme-btn active" data-theme="light">☀️ Clair</button>
        <button class="theme-btn" data-theme="dark">🌙 Sombre</button>
        <button class="theme-btn" data-theme="auto">🔄 Auto</button>
      </div>
    </div>
  </div>
</div>

<script>
// Chargement des données utilisateur
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Simuler le chargement des données utilisateur
    const userData = await loadUserData();
    
    // Mettre à jour l'interface
    updateDashboard(userData);
    
    // Initialiser les interactions
    initializeDashboard();
    
  } catch (error) {
    console.error('Erreur chargement dashboard:', error);
    showErrorMessage('Erreur de chargement des données');
  }
});

async function loadUserData() {
  // En production, ceci serait un appel API
  return {
    name: 'Jean Dupont',
    level: 'Intermédiaire',
    t4gBalance: 1245,
    progress: 42,
    expertise: {
      lightning: { level: 'Intermédiaire', progress: 65, contributions: 12, earned: 340 },
      hardware: { level: 'Débutant', progress: 25, contributions: 3, earned: 80 }
    },
    recentActivity: [
      { type: 'completion', title: 'Guide "Premier canal Lightning" complété', time: '2 heures', reward: 80 },
      { type: 'review', title: 'Review reçue sur "Setup DazBox débutant"', time: '5 heures', rating: 4.8 }
    ]
  };
}

function updateDashboard(userData) {
  // Mettre à jour les éléments avec les données réelles
  document.getElementById('user-name').textContent = userData.name;
  document.getElementById('t4g-balance').textContent = userData.t4gBalance.toLocaleString();
  document.getElementById('level-badge').textContent = userData.level;
  document.getElementById('progress-percentage').textContent = `${userData.progress}%`;
  
  // Mettre à jour les barres de progression
  document.querySelectorAll('[data-progress]').forEach(bar => {
    const progress = bar.dataset.progress;
    bar.style.width = `${progress}%`;
  });
}

function initializeDashboard() {
  // Gérer les changements de thème
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      document.documentElement.setAttribute('data-theme', theme);
      
      // Mettre à jour l'état actif
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Sauvegarder la préférence
      localStorage.setItem('daznode_theme', theme);
    });
  });
  
  // Animation des statistiques
  animateCounters();
  
  // Initialiser les notifications temps réel
  initializeRealTimeUpdates();
}

function animateCounters() {
  const counters = document.querySelectorAll('.stat-value');
  counters.forEach(counter => {
    const target = parseInt(counter.textContent.replace(/,/g, ''));
    const duration = 1000;
    const start = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * target);
      
      counter.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  });
}

function initializeRealTimeUpdates() {
  // Simuler les mises à jour temps réel
  setInterval(async () => {
    try {
      const updates = await checkForUpdates();
      if (updates.newRewards) {
        showRewardNotification(updates.newRewards);
      }
    } catch (error) {
      console.error('Erreur mise à jour temps réel:', error);
    }
  }, 30000); // Vérifier toutes les 30 secondes
}

function showRewardNotification(reward) {
  const notification = document.createElement('div');
  notification.className = 'reward-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">🎉</span>
      <span class="notification-text">+${reward} T4G gagnés!</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animation et suppression après 3 secondes
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

async function checkForUpdates() {
  // Simuler l'API
  return Math.random() > 0.8 ? { newRewards: Math.floor(Math.random() * 100) + 10 } : {};
}

function showErrorMessage(message) {
  const error = document.createElement('div');
  error.className = 'error-message';
  error.textContent = message;
  document.body.appendChild(error);
  
  setTimeout(() => error.remove(), 5000);
}
</script>