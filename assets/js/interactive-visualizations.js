/**
 * Visualisations Interactives Lightning Network
 * Système complet d'animations et visualisations 3D
 */

class InteractiveVisualizationSystem {
  constructor() {
    this.activeVisualizations = new Map();
    this.animationQueue = [];
    this.isInitialized = false;
    this.init();
  }

  init() {
    this.setupCanvas();
    this.loadLibraries();
    this.registerVisualizationTypes();
    this.setupEventListeners();
    this.startAnimationLoop();
    this.isInitialized = true;
  }

  setupCanvas() {
    // Canvas pour les visualisations WebGL
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'visualization-canvas';
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '-1';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  loadLibraries() {
    // Chargement dynamique des librairies de visualisation
    this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js')
      .then(() => this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/d3/7.0.0/d3.min.js'))
      .then(() => this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'))
      .then(() => {
        this.threeJS = window.THREE;
        this.d3 = window.d3;
        this.gsap = window.gsap;
        this.onLibrariesLoaded();
      })
      .catch(error => {
        console.warn('Librairies de visualisation non disponibles, utilisation du fallback CSS');
        this.initializeFallback();
      });
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  onLibrariesLoaded() {
    this.initializeThreeJS();
    this.createLightningNetworkVisualizer();
    this.createBitcoinBlockVisualizer();
    this.createROICalculatorVisualizer();
  }

  initializeFallback() {
    // Fallback CSS pour les animations sans JS
    this.useCSSAnimations = true;
  }

  registerVisualizationTypes() {
    this.visualizationTypes = {
      'lightning-network': this.createLightningNetwork.bind(this),
      'bitcoin-flow': this.createBitcoinFlow.bind(this),
      'node-topology': this.createNodeTopology.bind(this),
      'payment-routing': this.createPaymentRouting.bind(this),
      'channel-balance': this.createChannelBalance.bind(this),
      'roi-chart': this.createROIChart.bind(this),
      'transaction-pool': this.createTransactionPool.bind(this),
      'block-explorer': this.createBlockExplorer.bind(this),
      'difficulty-adjustment': this.createDifficultyVisualizer.bind(this),
      'mempool-visualization': this.createMempoolVisualizer.bind(this)
    };
  }

  // Lightning Network 3D Visualization
  createLightningNetwork(container, config = {}) {
    const visualization = new LightningNetworkVisualization(container, config);
    this.activeVisualizations.set(container, visualization);
    return visualization;
  }

  // Bitcoin Transaction Flow
  createBitcoinFlow(container, config = {}) {
    const visualization = new BitcoinFlowVisualization(container, config);
    this.activeVisualizations.set(container, visualization);
    return visualization;
  }

  // Node Topology Interactive Map
  createNodeTopology(container, config = {}) {
    const visualization = new NodeTopologyVisualization(container, config);
    this.activeVisualizations.set(container, visualization);
    return visualization;
  }

  // Payment Routing Visualization
  createPaymentRouting(container, config = {}) {
    const visualization = new PaymentRoutingVisualization(container, config);
    this.activeVisualizations.set(container, visualization);
    return visualization;
  }

  // Channel Balance Visualizer
  createChannelBalance(container, config = {}) {
    const visualization = new ChannelBalanceVisualization(container, config);
    this.activeVisualizations.set(container, visualization);
    return visualization;
  }

  // ROI Calculator avec Graphs Dynamiques
  createROIChart(container, config = {}) {
    const visualization = new ROIChartVisualization(container, config);
    this.activeVisualizations.set(container, visualization);
    return visualization;
  }

  // Transaction Pool Visualizer
  createTransactionPool(container, config = {}) {
    const visualization = new TransactionPoolVisualization(container, config);
    this.activeVisualizations.set(container, visualization);
    return visualization;
  }

  // Block Explorer 3D
  createBlockExplorer(container, config = {}) {
    const visualization = new BlockExplorerVisualization(container, config);
    this.activeVisualizations.set(container, visualization);
    return visualization;
  }

  // Difficulty Adjustment Visualizer
  createDifficultyVisualizer(container, config = {}) {
    const visualization = new DifficultyVisualization(container, config);
    this.activeVisualizations.set(container, visualization);
    return visualization;
  }

  // Mempool Visualizer
  createMempoolVisualizer(container, config = {}) {
    const visualization = new MempoolVisualization(container, config);
    this.activeVisualizations.set(container, visualization);
    return visualization;
  }

  setupEventListeners() {
    // Auto-détection et création des visualisations
    document.addEventListener('DOMContentLoaded', () => {
      this.autoDetectVisualizations();
    });

    // Intersection Observer pour les animations d'entrée
    this.setupScrollAnimations();

    // Gestion du resize
    window.addEventListener('resize', () => {
      this.activeVisualizations.forEach(viz => {
        if (viz.onResize) viz.onResize();
      });
    });

    // Performance monitoring
    this.setupPerformanceMonitoring();
  }

  autoDetectVisualizations() {
    document.querySelectorAll('[data-visualization]').forEach(element => {
      const type = element.dataset.visualization;
      const config = this.parseConfig(element.dataset.config);
      
      if (this.visualizationTypes[type]) {
        this.visualizationTypes[type](element, config);
      }
    });
  }

  parseConfig(configString) {
    try {
      return configString ? JSON.parse(configString) : {};
    } catch (e) {
      console.warn('Invalid visualization config:', configString);
      return {};
    }
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const viz = this.activeVisualizations.get(entry.target);
          if (viz && viz.onEnterViewport) {
            viz.onEnterViewport();
          }
          this.animateElementEntrance(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    // Observer tous les éléments avec animations
    document.querySelectorAll('.animate-on-scroll, [data-visualization]').forEach(el => {
      observer.observe(el);
    });
  }

  animateElementEntrance(element) {
    if (this.gsap) {
      this.gsap.fromTo(element, 
        { 
          opacity: 0, 
          y: 50,
          scale: 0.9
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out"
        }
      );
    } else {
      element.style.animation = 'fadeInUp 0.8s ease-out forwards';
    }
  }

  setupPerformanceMonitoring() {
    let frameCount = 0;
    let lastTime = Date.now();

    const checkPerformance = () => {
      frameCount++;
      const currentTime = Date.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        if (fps < 30) {
          this.degradePerformance();
        } else if (fps > 50) {
          this.enhancePerformance();
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
    };

    this.performanceMonitor = setInterval(checkPerformance, 100);
  }

  degradePerformance() {
    // Réduit la qualité pour maintenir les performances
    this.activeVisualizations.forEach(viz => {
      if (viz.setQuality) viz.setQuality('low');
    });
  }

  enhancePerformance() {
    // Améliore la qualité si les performances le permettent
    this.activeVisualizations.forEach(viz => {
      if (viz.setQuality) viz.setQuality('high');
    });
  }

  startAnimationLoop() {
    const animate = () => {
      this.update();
      this.render();
      requestAnimationFrame(animate);
    };
    animate();
  }

  update() {
    this.activeVisualizations.forEach(viz => {
      if (viz.update) viz.update();
    });
  }

  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render active visualizations
    this.activeVisualizations.forEach(viz => {
      if (viz.render) viz.render(this.ctx);
    });
  }

  // API publique
  addVisualization(container, type, config) {
    if (this.visualizationTypes[type]) {
      return this.visualizationTypes[type](container, config);
    }
    console.warn(`Unknown visualization type: ${type}`);
    return null;
  }

  removeVisualization(container) {
    const viz = this.activeVisualizations.get(container);
    if (viz && viz.destroy) {
      viz.destroy();
    }
    this.activeVisualizations.delete(container);
  }

  pauseAll() {
    this.activeVisualizations.forEach(viz => {
      if (viz.pause) viz.pause();
    });
  }

  resumeAll() {
    this.activeVisualizations.forEach(viz => {
      if (viz.resume) viz.resume();
    });
  }

  destroy() {
    clearInterval(this.performanceMonitor);
    this.activeVisualizations.forEach(viz => {
      if (viz.destroy) viz.destroy();
    });
    this.activeVisualizations.clear();
    
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Lightning Network 3D Visualization
class LightningNetworkVisualization {
  constructor(container, config) {
    this.container = container;
    this.config = { nodes: 100, connections: 200, ...config };
    this.nodes = [];
    this.connections = [];
    this.isActive = false;
    this.init();
  }

  init() {
    this.createHTML();
    this.generateNetwork();
    this.setupInteractivity();
    this.startAnimation();
  }

  createHTML() {
    this.container.innerHTML = `
      <div class="lightning-network-container">
        <svg class="network-svg" viewBox="0 0 800 600">
          <defs>
            <linearGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style="stop-color:var(--lightning-yellow);stop-opacity:1" />
              <stop offset="100%" style="stop-color:var(--lightning-purple);stop-opacity:0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g class="connections"></g>
          <g class="nodes"></g>
        </svg>
        <div class="network-info">
          <div class="info-item">
            <span class="info-label">Nœuds Actifs:</span>
            <span class="info-value" id="active-nodes">${this.config.nodes}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Canaux Ouverts:</span>
            <span class="info-value" id="active-channels">${this.config.connections}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Capacité Réseau:</span>
            <span class="info-value" id="network-capacity">4,250 BTC</span>
          </div>
        </div>
        <div class="network-controls">
          <button class="btn-control" data-action="simulate-payment">
            ⚡ Simuler Paiement
          </button>
          <button class="btn-control" data-action="add-node">
            ➕ Ajouter Nœud
          </button>
          <button class="btn-control" data-action="toggle-animation">
            ⏯️ Animation
          </button>
        </div>
      </div>
    `;

    this.svg = this.container.querySelector('.network-svg');
    this.nodesGroup = this.svg.querySelector('.nodes');
    this.connectionsGroup = this.svg.querySelector('.connections');
  }

  generateNetwork() {
    // Génération des nœuds avec positions aléatoires
    for (let i = 0; i < this.config.nodes; i++) {
      const node = {
        id: i,
        x: Math.random() * 760 + 20,
        y: Math.random() * 560 + 20,
        radius: Math.random() * 8 + 4,
        capacity: Math.random() * 10 + 1,
        channels: [],
        activity: Math.random()
      };
      this.nodes.push(node);
    }

    // Génération des connexions
    for (let i = 0; i < this.config.connections; i++) {
      const nodeA = this.nodes[Math.floor(Math.random() * this.nodes.length)];
      const nodeB = this.nodes[Math.floor(Math.random() * this.nodes.length)];
      
      if (nodeA !== nodeB && !this.areConnected(nodeA, nodeB)) {
        const connection = {
          id: i,
          nodeA: nodeA,
          nodeB: nodeB,
          capacity: Math.random() * 5 + 0.1,
          activity: 0,
          lastActivity: 0
        };
        
        this.connections.push(connection);
        nodeA.channels.push(connection);
        nodeB.channels.push(connection);
      }
    }

    this.renderNetwork();
  }

  areConnected(nodeA, nodeB) {
    return this.connections.some(conn => 
      (conn.nodeA === nodeA && conn.nodeB === nodeB) ||
      (conn.nodeA === nodeB && conn.nodeB === nodeA)
    );
  }

  renderNetwork() {
    // Render connections
    this.connectionsGroup.innerHTML = this.connections.map(conn => `
      <line 
        x1="${conn.nodeA.x}" y1="${conn.nodeA.y}"
        x2="${conn.nodeB.x}" y2="${conn.nodeB.y}"
        stroke="rgba(107, 70, 193, 0.3)"
        stroke-width="${conn.capacity}"
        class="connection"
        data-id="${conn.id}"
      />
    `).join('');

    // Render nodes
    this.nodesGroup.innerHTML = this.nodes.map(node => `
      <circle 
        cx="${node.x}" cy="${node.y}" 
        r="${node.radius}"
        fill="url(#nodeGradient)"
        filter="url(#glow)"
        class="node"
        data-id="${node.id}"
        data-capacity="${node.capacity.toFixed(2)}"
      />
    `).join('');
  }

  setupInteractivity() {
    // Hover effects sur les nœuds
    this.container.querySelectorAll('.node').forEach(node => {
      node.addEventListener('mouseenter', (e) => {
        const nodeId = parseInt(e.target.dataset.id);
        this.highlightNode(nodeId);
      });
      
      node.addEventListener('mouseleave', () => {
        this.clearHighlights();
      });
      
      node.addEventListener('click', (e) => {
        const nodeId = parseInt(e.target.dataset.id);
        this.showNodeDetails(nodeId);
      });
    });

    // Contrôles interactifs
    this.container.querySelectorAll('.btn-control').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        this.handleControlAction(action);
      });
    });
  }

  highlightNode(nodeId) {
    const node = this.nodes[nodeId];
    
    // Highlight le nœud sélectionné
    const nodeElement = this.container.querySelector(`[data-id="${nodeId}"]`);
    nodeElement.style.fill = 'var(--lightning-yellow)';
    nodeElement.style.transform = 'scale(1.5)';
    
    // Highlight les connexions
    node.channels.forEach(channel => {
      const connElement = this.container.querySelector(`.connection[data-id="${channel.id}"]`);
      connElement.style.stroke = 'var(--lightning-yellow)';
      connElement.style.strokeWidth = (parseFloat(connElement.style.strokeWidth) * 2) + 'px';
    });
  }

  clearHighlights() {
    this.container.querySelectorAll('.node').forEach(node => {
      node.style.fill = 'url(#nodeGradient)';
      node.style.transform = 'scale(1)';
    });
    
    this.container.querySelectorAll('.connection').forEach(conn => {
      conn.style.stroke = 'rgba(107, 70, 193, 0.3)';
      conn.style.strokeWidth = conn.dataset.originalWidth || conn.style.strokeWidth;
    });
  }

  showNodeDetails(nodeId) {
    const node = this.nodes[nodeId];
    
    const modal = document.createElement('div');
    modal.className = 'node-details-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Nœud Lightning #${nodeId}</h3>
        <div class="node-stats">
          <div class="stat">
            <label>Capacité:</label>
            <span>${node.capacity.toFixed(2)} BTC</span>
          </div>
          <div class="stat">
            <label>Canaux:</label>
            <span>${node.channels.length}</span>
          </div>
          <div class="stat">
            <label>Activité:</label>
            <span>${(node.activity * 100).toFixed(1)}%</span>
          </div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()">Fermer</button>
      </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
  }

  handleControlAction(action) {
    switch (action) {
      case 'simulate-payment':
        this.simulatePayment();
        break;
      case 'add-node':
        this.addRandomNode();
        break;
      case 'toggle-animation':
        this.toggleAnimation();
        break;
    }
  }

  simulatePayment() {
    // Sélection aléatoire de deux nœuds
    const startNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
    const endNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
    
    if (startNode === endNode) return;
    
    // Trouve le chemin le plus court
    const path = this.findShortestPath(startNode, endNode);
    
    if (path.length > 0) {
      this.animatePayment(path);
    }
  }

  findShortestPath(start, end) {
    // Algorithme de Dijkstra simplifié
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set(this.nodes);
    
    distances.set(start, 0);
    
    while (unvisited.size > 0) {
      const current = Array.from(unvisited).reduce((min, node) => 
        (distances.get(node) || Infinity) < (distances.get(min) || Infinity) ? node : min
      );
      
      if (current === end) break;
      
      unvisited.delete(current);
      
      current.channels.forEach(channel => {
        const neighbor = channel.nodeA === current ? channel.nodeB : channel.nodeA;
        if (unvisited.has(neighbor)) {
          const alt = (distances.get(current) || Infinity) + channel.capacity;
          if (alt < (distances.get(neighbor) || Infinity)) {
            distances.set(neighbor, alt);
            previous.set(neighbor, current);
          }
        }
      });
    }
    
    // Reconstruit le chemin
    const path = [];
    let current = end;
    while (current && previous.has(current)) {
      path.unshift(current);
      current = previous.get(current);
    }
    if (current === start) path.unshift(start);
    
    return path;
  }

  animatePayment(path) {
    if (path.length < 2) return;
    
    // Crée un élément pour le paiement
    const payment = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    payment.setAttribute('r', '3');
    payment.setAttribute('fill', 'var(--lightning-yellow)');
    payment.setAttribute('filter', 'url(#glow)');
    this.svg.appendChild(payment);
    
    let currentIndex = 0;
    
    const moveToNext = () => {
      if (currentIndex >= path.length - 1) {
        payment.remove();
        return;
      }
      
      const startNode = path[currentIndex];
      const endNode = path[currentIndex + 1];
      
      if (window.gsap) {
        window.gsap.fromTo(payment, 
          { attr: { cx: startNode.x, cy: startNode.y } },
          { 
            attr: { cx: endNode.x, cy: endNode.y },
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: moveToNext
          }
        );
      } else {
        payment.setAttribute('cx', endNode.x);
        payment.setAttribute('cy', endNode.y);
        setTimeout(moveToNext, 500);
      }
      
      currentIndex++;
    };
    
    moveToNext();
  }

  addRandomNode() {
    const newNode = {
      id: this.nodes.length,
      x: Math.random() * 760 + 20,
      y: Math.random() * 560 + 20,
      radius: Math.random() * 8 + 4,
      capacity: Math.random() * 10 + 1,
      channels: [],
      activity: Math.random()
    };
    
    this.nodes.push(newNode);
    
    // Ajoute quelques connexions au nouveau nœud
    const numConnections = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numConnections; i++) {
      const targetNode = this.nodes[Math.floor(Math.random() * (this.nodes.length - 1))];
      if (targetNode !== newNode && !this.areConnected(newNode, targetNode)) {
        const connection = {
          id: this.connections.length,
          nodeA: newNode,
          nodeB: targetNode,
          capacity: Math.random() * 5 + 0.1,
          activity: 0,
          lastActivity: 0
        };
        
        this.connections.push(connection);
        newNode.channels.push(connection);
        targetNode.channels.push(connection);
      }
    }
    
    this.renderNetwork();
    this.setupInteractivity();
    
    // Met à jour les statistiques
    this.container.querySelector('#active-nodes').textContent = this.nodes.length;
    this.container.querySelector('#active-channels').textContent = this.connections.length;
  }

  toggleAnimation() {
    this.isActive = !this.isActive;
    const button = this.container.querySelector('[data-action="toggle-animation"]');
    button.textContent = this.isActive ? '⏸️ Pause' : '▶️ Play';
  }

  startAnimation() {
    this.isActive = true;
    const animate = () => {
      if (this.isActive) {
        this.updateActivity();
      }
      requestAnimationFrame(animate);
    };
    animate();
  }

  updateActivity() {
    // Simulation d'activité aléatoire
    this.connections.forEach((conn, index) => {
      if (Math.random() < 0.01) { // 1% chance d'activité par frame
        conn.activity = 1;
        conn.lastActivity = Date.now();
        
        const element = this.container.querySelector(`.connection[data-id="${conn.id}"]`);
        if (element) {
          element.style.stroke = 'var(--lightning-yellow)';
          element.style.strokeWidth = (conn.capacity * 2) + 'px';
        }
      }
      
      // Fade out l'activité
      if (conn.activity > 0) {
        conn.activity -= 0.02;
        if (conn.activity <= 0) {
          const element = this.container.querySelector(`.connection[data-id="${conn.id}"]`);
          if (element) {
            element.style.stroke = 'rgba(107, 70, 193, 0.3)';
            element.style.strokeWidth = conn.capacity + 'px';
          }
        }
      }
    });
  }

  onEnterViewport() {
    this.isActive = true;
  }

  setQuality(level) {
    if (level === 'low') {
      this.container.style.filter = 'blur(0.5px)';
    } else {
      this.container.style.filter = 'none';
    }
  }

  pause() {
    this.isActive = false;
  }

  resume() {
    this.isActive = true;
  }

  destroy() {
    this.isActive = false;
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// Classes similaires pour les autres visualisations
class BitcoinFlowVisualization {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="bitcoin-flow-container">
        <div class="transaction-stream">
          <!-- Animation de flux de transactions -->
        </div>
        <div class="flow-metrics">
          <div class="metric">
            <span class="value">247</span>
            <span class="label">TX/sec</span>
          </div>
          <div class="metric">
            <span class="value">1.2M</span>
            <span class="label">Mempool</span>
          </div>
        </div>
      </div>
    `;
    
    this.startTransactionFlow();
  }

  startTransactionFlow() {
    setInterval(() => {
      this.addTransaction();
    }, Math.random() * 1000 + 500);
  }

  addTransaction() {
    const stream = this.container.querySelector('.transaction-stream');
    const tx = document.createElement('div');
    tx.className = 'transaction-bubble';
    tx.style.left = '-50px';
    tx.style.top = Math.random() * 200 + 'px';
    
    stream.appendChild(tx);
    
    // Animation
    if (window.gsap) {
      window.gsap.to(tx, {
        x: stream.offsetWidth + 50,
        duration: 3,
        ease: "none",
        onComplete: () => tx.remove()
      });
    }
  }
}

// Styles CSS pour les visualisations
const visualizationStyles = `
<style>
/* Visualizations Container */
.lightning-network-container {
  position: relative;
  background: linear-gradient(135deg, var(--dark-bg) 0%, var(--dark-surface) 100%);
  border-radius: 16px;
  padding: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.network-svg {
  width: 100%;
  height: 400px;
  background: radial-gradient(circle at center, rgba(107, 70, 193, 0.1) 0%, transparent 70%);
}

.node {
  cursor: pointer;
  transition: all 0.3s ease;
}

.node:hover {
  transform: scale(1.2);
}

.connection {
  transition: all 0.3s ease;
  cursor: pointer;
}

.network-info {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0,0,0,0.8);
  padding: 15px;
  border-radius: 8px;
  color: white;
  font-size: 0.875rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 15px;
}

.info-label {
  opacity: 0.8;
}

.info-value {
  color: var(--lightning-yellow);
  font-weight: 700;
}

.network-controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
}

.btn-control {
  padding: 8px 12px;
  background: var(--lightning-purple);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.btn-control:hover {
  background: var(--lightning-blue);
  transform: scale(1.05);
}

/* Modal for Node Details */
.node-details-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.node-details-modal.show {
  opacity: 1;
}

.node-details-modal .modal-content {
  background: var(--dark-surface);
  padding: 30px;
  border-radius: 12px;
  color: white;
  min-width: 300px;
}

.node-stats {
  margin: 20px 0;
}

.node-stats .stat {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

/* Bitcoin Flow Animation */
.bitcoin-flow-container {
  height: 300px;
  position: relative;
  background: linear-gradient(90deg, var(--dark-bg) 0%, var(--dark-surface) 100%);
  border-radius: 12px;
  overflow: hidden;
}

.transaction-stream {
  height: 100%;
  position: relative;
}

.transaction-bubble {
  position: absolute;
  width: 20px;
  height: 20px;
  background: var(--lightning-yellow);
  border-radius: 50%;
  box-shadow: 0 0 15px var(--lightning-yellow);
  animation: pulse 1s infinite;
}

.flow-metrics {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 20px;
}

.metric {
  text-align: center;
  color: white;
}

.metric .value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--lightning-yellow);
}

.metric .label {
  font-size: 0.875rem;
  opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .lightning-network-container {
    padding: 15px;
  }
  
  .network-info {
    position: static;
    margin-top: 15px;
    background: rgba(0,0,0,0.6);
  }
  
  .network-controls {
    position: static;
    margin-top: 15px;
    justify-content: center;
  }
  
  .btn-control {
    font-size: 0.75rem;
    padding: 6px 10px;
  }
}

/* Animation Keyframes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

/* Performance Optimizations */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
`;

// Injection des styles
document.head.insertAdjacentHTML('beforeend', visualizationStyles);

// Initialisation globale
document.addEventListener('DOMContentLoaded', () => {
  window.interactiveViz = new InteractiveVisualizationSystem();
  
  // API globale
  window.LightningVisualizations = {
    create: (container, type, config) => window.interactiveViz.addVisualization(container, type, config),
    destroy: (container) => window.interactiveViz.removeVisualization(container),
    pause: () => window.interactiveViz.pauseAll(),
    resume: () => window.interactiveViz.resumeAll()
  };
});