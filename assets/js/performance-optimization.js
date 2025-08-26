/**
 * Système d'Optimisation Performance Core Web Vitals
 * Monitoring, optimisation automatique et amélioration continue
 */

class PerformanceOptimizationSystem {
  constructor() {
    this.metrics = {
      lcp: null,
      fid: null,
      cls: null,
      fcp: null,
      ttfb: null,
      tbt: null
    };
    this.optimizations = new Map();
    this.observers = new Map();
    this.resourceLoader = new ResourceLoader();
    this.imageOptimizer = new ImageOptimizer();
    this.codeOptimizer = new CodeOptimizer();
    this.cacheManager = new CacheManager();
    this.init();
  }

  init() {
    this.setupWebVitalsMonitoring();
    this.initializeResourceOptimization();
    this.setupLazyLoading();
    this.optimizeCriticalRenderPath();
    this.setupServiceWorker();
    this.createPerformanceMonitor();
    this.startContinuousOptimization();
    this.setupA11yPerformanceIntegration();
  }

  setupWebVitalsMonitoring() {
    // Largest Contentful Paint (LCP)
    this.observeLCP();
    
    // First Input Delay (FID)
    this.observeFID();
    
    // Cumulative Layout Shift (CLS)
    this.observeCLS();
    
    // First Contentful Paint (FCP)
    this.observeFCP();
    
    // Time to First Byte (TTFB)
    this.observeTTFB();
    
    // Total Blocking Time (TBT)
    this.observeTBT();
  }

  observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        this.evaluateLCP(lastEntry.startTime);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', observer);
    }
  }

  evaluateLCP(value) {
    const threshold = {
      good: 2500,
      needsImprovement: 4000
    };
    
    if (value > threshold.needsImprovement) {
      this.optimizeLCP();
    }
    
    this.reportMetric('LCP', value, threshold);
  }

  optimizeLCP() {
    // Optimisations LCP
    this.preloadCriticalResources();
    this.optimizeImages();
    this.removeUnusedCSS();
    this.minifyResources();
    this.enableTextCompression();
  }

  observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          this.metrics.fid = entry.processingStart - entry.startTime;
          this.evaluateFID(this.metrics.fid);
          break; // FID should only be reported once
        }
      });
      
      observer.observe({ entryTypes: ['first-input'], buffered: true });
      this.observers.set('fid', observer);
    }
  }

  evaluateFID(value) {
    const threshold = {
      good: 100,
      needsImprovement: 300
    };
    
    if (value > threshold.needsImprovement) {
      this.optimizeFID();
    }
    
    this.reportMetric('FID', value, threshold);
  }

  optimizeFID() {
    // Optimisations FID
    this.breakUpLongTasks();
    this.deferNonCriticalJS();
    this.optimizeEventHandlers();
    this.useWebWorkers();
    this.implementCodeSplitting();
  }

  observeCLS() {
    let clsValue = 0;
    let clsEntries = [];
    
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsEntries.push(entry);
            clsValue += entry.value;
          }
        }
        
        this.metrics.cls = clsValue;
        this.evaluateCLS(clsValue);
      });
      
      observer.observe({ entryTypes: ['layout-shift'], buffered: true });
      this.observers.set('cls', observer);
    }
  }

  evaluateCLS(value) {
    const threshold = {
      good: 0.1,
      needsImprovement: 0.25
    };
    
    if (value > threshold.needsImprovement) {
      this.optimizeCLS();
    }
    
    this.reportMetric('CLS', value, threshold);
  }

  optimizeCLS() {
    // Optimisations CLS
    this.setImageDimensions();
    this.reserveSpaceForAds();
    this.preloadFonts();
    this.avoidDynamicContent();
    this.useTransformAnimations();
  }

  observeFCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          this.metrics.fcp = entry.startTime;
          this.evaluateFCP(entry.startTime);
        }
      });
      
      observer.observe({ entryTypes: ['paint'], buffered: true });
      this.observers.set('fcp', observer);
    }
  }

  evaluateFCP(value) {
    const threshold = {
      good: 1800,
      needsImprovement: 3000
    };
    
    if (value > threshold.needsImprovement) {
      this.optimizeFCP();
    }
    
    this.reportMetric('FCP', value, threshold);
  }

  optimizeFCP() {
    // Optimisations FCP
    this.eliminateRenderBlockingResources();
    this.optimizeCriticalCSS();
    this.improveServerResponseTime();
    this.enableHTTP2ServerPush();
  }

  observeTTFB() {
    // TTFB via Navigation Timing API
    if ('performance' in window && 'timing' in performance) {
      window.addEventListener('load', () => {
        const ttfb = performance.timing.responseStart - performance.timing.navigationStart;
        this.metrics.ttfb = ttfb;
        this.evaluateTTFB(ttfb);
      });
    }
  }

  evaluateTTFB(value) {
    const threshold = {
      good: 200,
      needsImprovement: 500
    };
    
    if (value > threshold.needsImprovement) {
      this.optimizeTTFB();
    }
    
    this.reportMetric('TTFB', value, threshold);
  }

  optimizeTTFB() {
    // Optimisations TTFB
    this.enableServerCaching();
    this.optimizeDatabaseQueries();
    this.useCDN();
    this.enableKeepAlive();
  }

  observeTBT() {
    // TBT calculé à partir des long tasks
    let tbtValue = 0;
    
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.duration > 50) {
            tbtValue += entry.duration - 50;
          }
        }
        
        this.metrics.tbt = tbtValue;
        this.evaluateTBT(tbtValue);
      });
      
      observer.observe({ entryTypes: ['longtask'], buffered: true });
      this.observers.set('tbt', observer);
    }
  }

  evaluateTBT(value) {
    const threshold = {
      good: 200,
      needsImprovement: 600
    };
    
    if (value > threshold.needsImprovement) {
      this.optimizeTBT();
    }
    
    this.reportMetric('TBT', value, threshold);
  }

  optimizeTBT() {
    // Optimisations TBT
    this.breakUpLongTasks();
    this.deferNonEssentialWork();
    this.useRequestIdleCallback();
    this.optimizeThirdPartyScripts();
  }

  // Optimisations spécifiques
  preloadCriticalResources() {
    // Preload des ressources critiques
    const criticalResources = [
      '/assets/css/lightning-design-system.css',
      '/assets/js/gamification-system.js',
      '/assets/fonts/inter-var.woff2'
    ];
    
    criticalResources.forEach(resource => {
      if (!document.querySelector(`link[href="${resource}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = this.getResourceType(resource);
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });
  }

  getResourceType(url) {
    if (url.endsWith('.css')) return 'style';
    if (url.endsWith('.js')) return 'script';
    if (url.match(/\.(woff2?|ttf|otf)$/)) return 'font';
    if (url.match(/\.(jpg|jpeg|png|webp|svg)$/)) return 'image';
    return 'fetch';
  }

  optimizeImages() {
    this.imageOptimizer.optimizeAll();
  }

  removeUnusedCSS() {
    // Détecte et supprime le CSS non utilisé
    this.analyzeCSS().then(unusedCSS => {
      unusedCSS.forEach(rule => {
        try {
          rule.parentStyleSheet.deleteRule(Array.from(rule.parentStyleSheet.cssRules).indexOf(rule));
        } catch (e) {
          console.warn('Could not remove unused CSS rule:', rule);
        }
      });
    });
  }

  async analyzeCSS() {
    const unusedRules = [];
    const stylesheets = Array.from(document.styleSheets);
    
    for (const stylesheet of stylesheets) {
      try {
        const rules = Array.from(stylesheet.cssRules);
        
        for (const rule of rules) {
          if (rule.type === CSSRule.STYLE_RULE) {
            if (!document.querySelector(rule.selectorText)) {
              unusedRules.push(rule);
            }
          }
        }
      } catch (e) {
        console.warn('Cannot analyze stylesheet:', stylesheet.href);
      }
    }
    
    return unusedRules;
  }

  minifyResources() {
    // Minification côté client des ressources chargées dynamiquement
    this.codeOptimizer.minifyInlineCSS();
    this.codeOptimizer.minifyInlineJS();
  }

  enableTextCompression() {
    // Vérifie si la compression est activée
    const testImage = new Image();
    testImage.src = 'data:image/webp;base64,UklGRhwAAABXRUJQVlA4TBAAAAAqAgAAVQAAAAAA';
    
    testImage.onload = () => {
      if (testImage.width === 1) {
        document.documentElement.classList.add('webp-support');
      }
    };
  }

  breakUpLongTasks() {
    // Divise les tâches longues
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;
    
    window.setTimeout = (callback, delay, ...args) => {
      return originalSetTimeout(() => {
        this.scheduleWork(() => callback(...args));
      }, delay);
    };
    
    window.setInterval = (callback, interval, ...args) => {
      return originalSetInterval(() => {
        this.scheduleWork(() => callback(...args));
      }, interval);
    };
  }

  scheduleWork(callback) {
    if ('scheduler' in window && 'postTask' in scheduler) {
      scheduler.postTask(callback, { priority: 'user-blocking' });
    } else if ('requestIdleCallback' in window) {
      requestIdleCallback(callback, { timeout: 5000 });
    } else {
      setTimeout(callback, 0);
    }
  }

  deferNonCriticalJS() {
    // Diffère le JavaScript non critique
    const scripts = document.querySelectorAll('script[src]:not([defer]):not([async])');
    
    scripts.forEach(script => {
      if (!this.isCriticalScript(script.src)) {
        script.defer = true;
      }
    });
  }

  isCriticalScript(src) {
    const criticalScripts = [
      'gamification-system.js',
      'adaptive-learning-paths.js',
      'accessibility-wcag-system.js'
    ];
    
    return criticalScripts.some(critical => src.includes(critical));
  }

  optimizeEventHandlers() {
    // Optimise les gestionnaires d'événements
    this.debounceScrollEvents();
    this.throttleResizeEvents();
    this.optimizeClickHandlers();
  }

  debounceScrollEvents() {
    let scrollTimeout;
    const originalScroll = window.onscroll;
    
    window.onscroll = (event) => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (originalScroll) originalScroll.call(this, event);
      }, 16); // 60fps
    };
  }

  throttleResizeEvents() {
    let resizeTimeout;
    const originalResize = window.onresize;
    
    window.onresize = (event) => {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
          if (originalResize) originalResize.call(this, event);
          resizeTimeout = null;
        }, 100);
      }
    };
  }

  optimizeClickHandlers() {
    // Utilise la délégation d'événements
    document.addEventListener('click', this.globalClickHandler.bind(this), { passive: true });
  }

  globalClickHandler(event) {
    // Gestionnaire global optimisé pour les clics
    const target = event.target.closest('[data-action], button, a');
    if (!target) return;
    
    // Traite l'action selon le type
    this.handleOptimizedClick(target, event);
  }

  handleOptimizedClick(element, event) {
    // Traitement optimisé des clics
    const action = element.dataset.action;
    
    if (action) {
      this.scheduleWork(() => {
        this.executeAction(action, element, event);
      });
    }
  }

  executeAction(action, element, event) {
    // Exécute l'action de manière optimisée
    switch (action) {
      case 'navigate':
        this.optimizedNavigation(element.href);
        break;
      case 'toggle':
        this.optimizedToggle(element);
        break;
      default:
        console.log('Action:', action);
    }
  }

  useWebWorkers() {
    // Utilise des Web Workers pour les tâches lourdes
    if ('Worker' in window) {
      this.createWorkerPool();
    }
  }

  createWorkerPool() {
    const workerScript = `
      self.onmessage = function(e) {
        const { type, data } = e.data;
        
        switch (type) {
          case 'heavy-computation':
            const result = performHeavyComputation(data);
            self.postMessage({ type: 'result', result });
            break;
          case 'data-processing':
            const processed = processLargeDataset(data);
            self.postMessage({ type: 'processed', data: processed });
            break;
        }
      };
      
      function performHeavyComputation(data) {
        // Simulation de calcul lourd
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
          result += Math.random();
        }
        return result;
      }
      
      function processLargeDataset(data) {
        return data.map(item => ({
          ...item,
          processed: true,
          timestamp: Date.now()
        }));
      }
    `;
    
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    this.workerPool = {
      computation: new Worker(URL.createObjectURL(blob)),
      dataProcessing: new Worker(URL.createObjectURL(blob))
    };
    
    // Setup worker communication
    Object.values(this.workerPool).forEach(worker => {
      worker.onmessage = this.handleWorkerMessage.bind(this);
      worker.onerror = this.handleWorkerError.bind(this);
    });
  }

  handleWorkerMessage(event) {
    const { type, result, data } = event.data;
    
    switch (type) {
      case 'result':
        this.handleComputationResult(result);
        break;
      case 'processed':
        this.handleProcessedData(data);
        break;
    }
  }

  handleWorkerError(error) {
    console.error('Worker error:', error);
  }

  implementCodeSplitting() {
    // Code splitting dynamique
    this.loadModuleOnDemand = async (moduleName) => {
      try {
        const module = await import(`/assets/js/${moduleName}.js`);
        return module.default || module;
      } catch (error) {
        console.error(`Failed to load module ${moduleName}:`, error);
        return null;
      }
    };
  }

  setImageDimensions() {
    // Définit les dimensions des images pour éviter le CLS
    const images = document.querySelectorAll('img:not([width]):not([height])');
    
    images.forEach(img => {
      if (img.complete && img.naturalWidth) {
        this.setImageDimensionsFromNatural(img);
      } else {
        img.onload = () => this.setImageDimensionsFromNatural(img);
      }
    });
  }

  setImageDimensionsFromNatural(img) {
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    const maxWidth = img.parentElement.clientWidth || 300;
    
    img.width = Math.min(img.naturalWidth, maxWidth);
    img.height = img.width / aspectRatio;
  }

  reserveSpaceForAds() {
    // Réserve l'espace pour les publicités
    const adSlots = document.querySelectorAll('.ad-slot');
    
    adSlots.forEach(slot => {
      const width = slot.dataset.width || 300;
      const height = slot.dataset.height || 250;
      
      slot.style.minWidth = width + 'px';
      slot.style.minHeight = height + 'px';
      slot.style.backgroundColor = '#f0f0f0';
    });
  }

  preloadFonts() {
    // Preload des polices critiques
    const criticalFonts = [
      '/assets/fonts/inter-var.woff2',
      '/assets/fonts/jetbrains-mono.woff2'
    ];
    
    criticalFonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  avoidDynamicContent() {
    // Évite l'insertion de contenu dynamique qui cause du CLS
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.stabilizeNewElement(node);
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  stabilizeNewElement(element) {
    // Stabilise un nouvel élément pour éviter le CLS
    if (element.classList.contains('dynamic-content')) {
      element.style.transition = 'none';
      element.style.opacity = '0';
      
      requestAnimationFrame(() => {
        element.style.transition = 'opacity 0.3s ease';
        element.style.opacity = '1';
      });
    }
  }

  useTransformAnimations() {
    // Remplace les animations de layout par des transforms
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    animatedElements.forEach(element => {
      const animationType = element.dataset.animate;
      
      switch (animationType) {
        case 'slide-in':
          this.replaceWithTransform(element, 'translateX(-100%)', 'translateX(0)');
          break;
        case 'fade-in':
          this.replaceWithTransform(element, 'scale(0.8)', 'scale(1)');
          break;
      }
    });
  }

  replaceWithTransform(element, from, to) {
    element.style.transform = from;
    element.style.transition = 'transform 0.3s ease';
    
    requestAnimationFrame(() => {
      element.style.transform = to;
    });
  }

  eliminateRenderBlockingResources() {
    // Élimine les ressources bloquant le rendu
    const blockingCSS = document.querySelectorAll('link[rel="stylesheet"]:not([media])');
    
    blockingCSS.forEach(link => {
      if (!this.isCriticalCSS(link.href)) {
        link.media = 'print';
        link.onload = () => {
          link.media = 'all';
        };
      }
    });
  }

  isCriticalCSS(href) {
    const criticalCSS = [
      'lightning-design-system.css',
      'critical.css'
    ];
    
    return criticalCSS.some(critical => href.includes(critical));
  }

  optimizeCriticalCSS() {
    // Optimise le CSS critique
    this.inlineCriticalCSS();
    this.loadNonCriticalCSSAsync();
  }

  inlineCriticalCSS() {
    // Inline le CSS critique
    const criticalCSS = this.getCriticalCSS();
    
    if (criticalCSS) {
      const style = document.createElement('style');
      style.textContent = criticalCSS;
      document.head.appendChild(style);
    }
  }

  getCriticalCSS() {
    // Extrait le CSS critique (Above-the-fold)
    return `
      body { margin: 0; font-family: Inter, sans-serif; }
      .lightning-header { background: var(--lightning-purple); }
      .hero-section { min-height: 100vh; }
    `;
  }

  loadNonCriticalCSSAsync() {
    // Charge le CSS non critique de manière asynchrone
    const loadCSS = (href) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      link.onload = () => {
        link.rel = 'stylesheet';
      };
      document.head.appendChild(link);
    };
    
    // Charge les CSS non critiques après le load
    window.addEventListener('load', () => {
      setTimeout(() => {
        loadCSS('/assets/css/secondary.css');
        loadCSS('/assets/css/animations.css');
      }, 1000);
    });
  }

  improveServerResponseTime() {
    // Optimisations côté serveur (instructions pour l'équipe backend)
    console.log('Server optimizations needed:', {
      caching: 'Enable server-side caching',
      compression: 'Enable gzip/brotli compression',
      cdn: 'Implement CDN for static assets',
      database: 'Optimize database queries'
    });
  }

  initializeResourceOptimization() {
    this.resourceLoader.init();
    this.setupIntersectionObserver();
  }

  setupLazyLoading() {
    // Lazy loading avancé
    const lazyImages = document.querySelectorAll('img[data-src]');
    const lazyVideos = document.querySelectorAll('video[data-src]');
    const lazyIframes = document.querySelectorAll('iframe[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadLazyResource(entry.target);
            imageObserver.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });
      
      [...lazyImages, ...lazyVideos, ...lazyIframes].forEach(element => {
        imageObserver.observe(element);
      });
    } else {
      // Fallback pour les navigateurs sans IntersectionObserver
      this.loadAllLazyResources();
    }
  }

  loadLazyResource(element) {
    const src = element.dataset.src;
    
    if (element.tagName === 'IMG') {
      this.loadLazyImage(element, src);
    } else if (element.tagName === 'VIDEO') {
      this.loadLazyVideo(element, src);
    } else if (element.tagName === 'IFRAME') {
      this.loadLazyIframe(element, src);
    }
  }

  loadLazyImage(img, src) {
    img.src = src;
    img.classList.add('lazy-loading');
    
    img.onload = () => {
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-loaded');
    };
    
    img.onerror = () => {
      img.classList.add('lazy-error');
    };
  }

  loadLazyVideo(video, src) {
    video.src = src;
    video.load();
  }

  loadLazyIframe(iframe, src) {
    iframe.src = src;
  }

  setupIntersectionObserver() {
    // Observer pour les sections de contenu
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.optimizeSectionContent(entry.target);
        }
      });
    }, {
      rootMargin: '200px 0px',
      threshold: 0.1
    });
    
    document.querySelectorAll('section[data-optimize]').forEach(section => {
      sectionObserver.observe(section);
    });
  }

  optimizeSectionContent(section) {
    const optimizationType = section.dataset.optimize;
    
    switch (optimizationType) {
      case 'visualizations':
        this.loadVisualizationsOnDemand(section);
        break;
      case 'community':
        this.loadCommunityDataOnDemand(section);
        break;
      case 'certifications':
        this.loadCertificationsOnDemand(section);
        break;
    }
  }

  loadVisualizationsOnDemand(section) {
    if (!section.dataset.loaded) {
      import('/assets/js/interactive-visualizations.js')
        .then(module => {
          module.initialize(section);
          section.dataset.loaded = 'true';
        });
    }
  }

  optimizeCriticalRenderPath() {
    // Optimise le chemin critique de rendu
    this.preconnectToOrigins();
    this.optimizeWebFonts();
    this.setupResourceHints();
  }

  preconnectToOrigins() {
    const origins = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://api.dazno.de'
    ];
    
    origins.forEach(origin => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  optimizeWebFonts() {
    // Optimise le chargement des polices web
    const fontDisplay = 'font-display: swap;';
    
    // Ajoute font-display: swap aux polices
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        src: url('/assets/fonts/inter-var.woff2') format('woff2');
        ${fontDisplay}
        font-weight: 100 900;
      }
      
      @font-face {
        font-family: 'JetBrains Mono';
        src: url('/assets/fonts/jetbrains-mono.woff2') format('woff2');
        ${fontDisplay}
        font-weight: 400;
      }
    `;
    document.head.appendChild(style);
  }

  setupResourceHints() {
    // DNS prefetch pour les domaines externes
    const domains = [
      '//cdn.jsdelivr.net',
      '//unpkg.com',
      '//api.github.com'
    ];
    
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }

  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then(registration => {
          console.log('Service Worker registered:', registration.scope);
          this.setupSWUpdateNotification(registration);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }

  setupSWUpdateNotification(registration) {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          this.showUpdateNotification();
        }
      });
    });
  }

  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'sw-update-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span>🔄 Une nouvelle version est disponible!</span>
        <button class="btn-update">Mettre à jour</button>
        <button class="btn-dismiss">Plus tard</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    notification.querySelector('.btn-update').addEventListener('click', () => {
      window.location.reload();
    });
    
    notification.querySelector('.btn-dismiss').addEventListener('click', () => {
      notification.remove();
    });
  }

  createPerformanceMonitor() {
    const monitor = document.createElement('div');
    monitor.id = 'performance-monitor';
    monitor.className = 'performance-monitor hidden';
    
    monitor.innerHTML = `
      <div class="monitor-header">
        <h3>⚡ Performance Monitor</h3>
        <button class="btn-toggle-monitor" onclick="this.parentElement.parentElement.classList.toggle('hidden')">
          📊
        </button>
      </div>
      
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">LCP</div>
          <div class="metric-value" id="lcp-value">-</div>
          <div class="metric-status" id="lcp-status">⏳</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-label">FID</div>
          <div class="metric-value" id="fid-value">-</div>
          <div class="metric-status" id="fid-status">⏳</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-label">CLS</div>
          <div class="metric-value" id="cls-value">-</div>
          <div class="metric-status" id="cls-status">⏳</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-label">FCP</div>
          <div class="metric-value" id="fcp-value">-</div>
          <div class="metric-status" id="fcp-status">⏳</div>
        </div>
      </div>
      
      <div class="optimizations-list" id="optimizations-list">
        <h4>Optimisations Actives:</h4>
        <div class="optimization-items"></div>
      </div>
    `;
    
    // Ajouter le moniteur seulement en mode développement
    if (this.isDevelopment()) {
      document.body.appendChild(monitor);
    }
  }

  isDevelopment() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.search.includes('debug=true');
  }

  reportMetric(name, value, threshold) {
    const status = value <= threshold.good ? 'good' : 
                  value <= threshold.needsImprovement ? 'needs-improvement' : 'poor';
    
    // Update monitor display
    this.updateMonitorMetric(name.toLowerCase(), value, status);
    
    // Send to analytics
    this.sendToAnalytics(name, value, status);
    
    // Log for debugging
    console.log(`${name}: ${value}ms (${status})`);
  }

  updateMonitorMetric(metric, value, status) {
    const valueElement = document.getElementById(`${metric}-value`);
    const statusElement = document.getElementById(`${metric}-status`);
    
    if (valueElement && statusElement) {
      valueElement.textContent = `${Math.round(value)}ms`;
      statusElement.textContent = status === 'good' ? '✅' : status === 'needs-improvement' ? '⚠️' : '❌';
      statusElement.className = `metric-status ${status}`;
    }
  }

  sendToAnalytics(metric, value, status) {
    // Envoie les métriques vers Google Analytics, Plausible, etc.
    if ('gtag' in window) {
      gtag('event', 'web_vital', {
        name: metric,
        value: Math.round(value),
        rating: status
      });
    }
    
    // Ou vers un service d'analytics personnalisé
    if ('plausible' in window) {
      plausible('Web Vital', {
        props: {
          metric: metric,
          value: Math.round(value),
          rating: status
        }
      });
    }
  }

  startContinuousOptimization() {
    // Optimisation continue toutes les 30 secondes
    setInterval(() => {
      this.performMaintenanceOptimizations();
    }, 30000);
    
    // Optimisation au idle
    if ('requestIdleCallback' in window) {
      const optimizeOnIdle = () => {
        requestIdleCallback(() => {
          this.performIdleOptimizations();
          optimizeOnIdle();
        }, { timeout: 5000 });
      };
      optimizeOnIdle();
    }
  }

  performMaintenanceOptimizations() {
    // Nettoyage de la mémoire
    this.cleanupUnusedResources();
    
    // Optimisation du DOM
    this.optimizeDOMStructure();
    
    // Mise à jour du cache
    this.updateCache();
  }

  cleanupUnusedResources() {
    // Supprime les event listeners inutiles
    this.removeStaleEventListeners();
    
    // Nettoie les timers et intervals
    this.cleanupTimers();
    
    // Libère la mémoire des objets non utilisés
    this.garbageCollectObjects();
  }

  removeStaleEventListeners() {
    // Logique pour identifier et supprimer les listeners obsolètes
    if (this.staleListeners) {
      this.staleListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
      this.staleListeners = [];
    }
  }

  optimizeDOMStructure() {
    // Optimise la structure du DOM
    const emptyElements = document.querySelectorAll(':empty:not(img):not(input):not(br):not(hr)');
    emptyElements.forEach(element => {
      if (element.children.length === 0 && !element.textContent.trim()) {
        element.remove();
      }
    });
  }

  performIdleOptimizations() {
    // Optimisations pendant les périodes d'inactivité
    this.preloadUpcomingContent();
    this.optimizeImages();
    this.updateMetricsCache();
  }

  preloadUpcomingContent() {
    // Preload du contenu susceptible d'être visité
    const currentPath = window.location.pathname;
    const relatedPaths = this.getRelatedPaths(currentPath);
    
    relatedPaths.forEach(path => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = path;
      document.head.appendChild(link);
    });
  }

  getRelatedPaths(currentPath) {
    // Retourne les chemins liés au chemin actuel
    const pathMap = {
      '/': ['/lightning-network', '/bitcoin', '/getting-started'],
      '/lightning-network': ['/lightning-network/channels', '/lightning-network/optimization'],
      '/bitcoin': ['/bitcoin/introduction', '/bitcoin/wallets'],
      '/certifications': ['/learn', '/community']
    };
    
    return pathMap[currentPath] || [];
  }

  setupA11yPerformanceIntegration() {
    // Intègre l'accessibilité avec les performances
    if (window.accessibilitySystem) {
      // Optimise les performances selon les préférences d'accessibilité
      this.adaptPerformanceToA11y();
    }
  }

  adaptPerformanceToA11y() {
    const a11yPrefs = window.accessibilitySystem.getPreferences();
    
    if (a11yPrefs.reducedMotion) {
      // Désactive les animations coûteuses
      this.disableCostlyAnimations();
    }
    
    if (a11yPrefs.highContrast) {
      // Optimise pour le mode haut contraste
      this.optimizeForHighContrast();
    }
    
    if (a11yPrefs.screenReader) {
      // Optimise pour les lecteurs d'écran
      this.optimizeForScreenReaders();
    }
  }

  disableCostlyAnimations() {
    document.documentElement.classList.add('disable-costly-animations');
  }

  optimizeForHighContrast() {
    // Réduit les effets visuels coûteux en mode haut contraste
    const style = document.createElement('style');
    style.textContent = `
      .high-contrast * {
        box-shadow: none !important;
        text-shadow: none !important;
        background-image: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  optimizeForScreenReaders() {
    // Optimise pour une meilleure performance avec les lecteurs d'écran
    this.reduceVisualUpdates();
    this.optimizeARIAUpdates();
  }

  // API publique pour les autres systèmes
  getMetrics() {
    return { ...this.metrics };
  }

  forceOptimization() {
    this.performMaintenanceOptimizations();
  }

  addOptimization(name, optimization) {
    this.optimizations.set(name, optimization);
  }

  removeOptimization(name) {
    return this.optimizations.delete(name);
  }

  getOptimizationStatus() {
    return Array.from(this.optimizations.keys());
  }
}

// Classes auxiliaires
class ResourceLoader {
  constructor() {
    this.loadedResources = new Set();
    this.loadingPromises = new Map();
  }

  init() {
    this.setupResourcePriorities();
  }

  setupResourcePriorities() {
    // Configure les priorités de chargement des ressources
    const highPriorityResources = [
      '/assets/css/lightning-design-system.css',
      '/assets/js/gamification-system.js'
    ];

    highPriorityResources.forEach(resource => {
      this.preloadResource(resource, 'high');
    });
  }

  async preloadResource(url, priority = 'low') {
    if (this.loadedResources.has(url)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = this.getResourceType(url);
    link.fetchpriority = priority;
    
    document.head.appendChild(link);
    this.loadedResources.add(url);
  }

  getResourceType(url) {
    if (url.endsWith('.css')) return 'style';
    if (url.endsWith('.js')) return 'script';
    if (url.match(/\.(jpg|jpeg|png|webp|svg)$/)) return 'image';
    if (url.match(/\.(woff2?|ttf|otf)$/)) return 'font';
    return 'fetch';
  }
}

class ImageOptimizer {
  constructor() {
    this.optimizedImages = new Set();
  }

  optimizeAll() {
    const images = document.querySelectorAll('img');
    images.forEach(img => this.optimizeImage(img));
  }

  optimizeImage(img) {
    if (this.optimizedImages.has(img)) return;

    // Optimisations d'image
    this.addWebPSupport(img);
    this.implementResponsiveImages(img);
    this.addLoadingAttribute(img);
    
    this.optimizedImages.add(img);
  }

  addWebPSupport(img) {
    if ('picture' in document.createElement('picture')) {
      const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/, '.webp');
      
      // Crée un élément picture avec fallback
      const picture = document.createElement('picture');
      const webpSource = document.createElement('source');
      webpSource.srcset = webpSrc;
      webpSource.type = 'image/webp';
      
      picture.appendChild(webpSource);
      picture.appendChild(img.cloneNode(true));
      
      img.parentNode.replaceChild(picture, img);
    }
  }

  implementResponsiveImages(img) {
    if (!img.srcset && img.src) {
      // Génère un srcset automatique
      const baseSrc = img.src.replace(/\.(jpg|jpeg|png|webp)$/, '');
      const extension = img.src.match(/\.(jpg|jpeg|png|webp)$/)[0];
      
      img.srcset = [
        `${baseSrc}_400w${extension} 400w`,
        `${baseSrc}_800w${extension} 800w`,
        `${baseSrc}_1200w${extension} 1200w`
      ].join(', ');
      
      img.sizes = '(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px';
    }
  }

  addLoadingAttribute(img) {
    if (!img.loading) {
      // Détermine si l'image est above-the-fold
      const rect = img.getBoundingClientRect();
      const isAboveTheFold = rect.top < window.innerHeight;
      
      img.loading = isAboveTheFold ? 'eager' : 'lazy';
    }
  }
}

class CodeOptimizer {
  minifyInlineCSS() {
    const styles = document.querySelectorAll('style');
    
    styles.forEach(style => {
      if (style.textContent) {
        style.textContent = this.minifyCSS(style.textContent);
      }
    });
  }

  minifyCSS(css) {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/;\s*}/g, '}') // Remove last semicolon
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*;\s*/g, ';')
      .trim();
  }

  minifyInlineJS() {
    const scripts = document.querySelectorAll('script:not([src])');
    
    scripts.forEach(script => {
      if (script.textContent) {
        script.textContent = this.minifyJS(script.textContent);
      }
    });
  }

  minifyJS(js) {
    return js
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/.*$/gm, '') // Remove line comments
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\s*([{}();,:])\s*/g, '$1') // Remove whitespace around operators
      .trim();
  }
}

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.maxAge = 5 * 60 * 1000; // 5 minutes
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  clear() {
    this.cache.clear();
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  window.performanceOptimizer = new PerformanceOptimizationSystem();
  
  // API globale
  window.Performance = {
    getMetrics: () => window.performanceOptimizer.getMetrics(),
    optimize: () => window.performanceOptimizer.forceOptimization(),
    monitor: () => document.getElementById('performance-monitor')?.classList.remove('hidden')
  };
  
  // Raccourci développeur
  if (window.location.search.includes('perf=true')) {
    window.Performance.monitor();
  }
});

// Service Worker pour le caching avancé
if ('serviceWorker' in navigator) {
  const swCode = `
    const CACHE_NAME = 'lightning-docs-v1';
    const STATIC_ASSETS = [
      '/',
      '/assets/css/lightning-design-system.css',
      '/assets/js/gamification-system.js',
      '/assets/js/adaptive-learning-paths.js',
      '/assets/fonts/inter-var.woff2'
    ];

    self.addEventListener('install', (event) => {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then((cache) => cache.addAll(STATIC_ASSETS))
      );
    });

    self.addEventListener('fetch', (event) => {
      event.respondWith(
        caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            return fetch(event.request);
          })
      );
    });
  `;

  // Crée et enregistre le service worker
  const blob = new Blob([swCode], { type: 'application/javascript' });
  const swUrl = URL.createObjectURL(blob);
  
  navigator.serviceWorker.register(swUrl)
    .then(registration => console.log('SW registered:', registration.scope))
    .catch(error => console.error('SW registration failed:', error));
}