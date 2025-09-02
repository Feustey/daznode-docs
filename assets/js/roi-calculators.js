/**
 * Interactive ROI Calculators for Lightning Network and Bitcoin
 * DazNode Documentation - 2025
 */

// Lightning Business ROI Calculator
class LightningBusinessROICalculator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.initializeCalculator();
    }
    
    initializeCalculator() {
        this.container.innerHTML = `
            <div class="roi-calculator">
                <h3>🧮 Lightning Business ROI Calculator</h3>
                
                <div class="calculator-inputs">
                    <div class="input-group">
                        <label for="monthlyVolume">Volume mensuel transactions (€)</label>
                        <input type="number" id="monthlyVolume" placeholder="100000" min="1000" max="10000000">
                    </div>
                    
                    <div class="input-group">
                        <label for="currentFees">Frais paiement actuels (%)</label>
                        <input type="number" id="currentFees" placeholder="2.5" min="0.1" max="10" step="0.1">
                    </div>
                    
                    <div class="input-group">
                        <label for="settlementDays">Délai règlement actuel (jours)</label>
                        <input type="number" id="settlementDays" placeholder="2" min="0" max="30">
                    </div>
                    
                    <div class="input-group">
                        <label for="intlPercent">% transactions internationales</label>
                        <input type="number" id="intlPercent" placeholder="20" min="0" max="100">
                    </div>
                    
                    <div class="input-group">
                        <label for="lightningCapital">Capital Lightning disponible (€)</label>
                        <input type="number" id="lightningCapital" placeholder="50000" min="5000" max="1000000">
                    </div>
                    
                    <button onclick="lightningROI.calculate()" class="calculate-btn">
                        Calculer ROI Lightning
                    </button>
                </div>
                
                <div id="roiResults" class="results-section" style="display: none;">
                    <h4>📊 Résultats ROI Lightning</h4>
                    <div class="results-grid">
                        <div class="result-item">
                            <span class="result-label">Économies annuelles frais</span>
                            <span class="result-value" id="annualSavings">-</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Valeur amélioration cash flow</span>
                            <span class="result-value" id="cashFlowValue">-</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">ROI total</span>
                            <span class="result-value roi-highlight" id="totalROI">-</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Période de retour</span>
                            <span class="result-value" id="paybackPeriod">-</span>
                        </div>
                    </div>
                    
                    <div class="roi-chart-container">
                        <canvas id="roiChart" width="400" height="200"></canvas>
                    </div>
                    
                    <div class="action-buttons">
                        <a href="https://dazno.de/business-assessment" class="cta-button">
                            📋 Évaluation Business Gratuite
                        </a>
                        <button onclick="lightningROI.exportResults()" class="export-btn">
                            📤 Exporter Résultats
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Real-time calculation on input change
        const inputs = this.container.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateAndCalculate();
            });
        });
    }
    
    validateAndCalculate() {
        const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value);
        const currentFees = parseFloat(document.getElementById('currentFees').value);
        const settlementDays = parseFloat(document.getElementById('settlementDays').value);
        const intlPercent = parseFloat(document.getElementById('intlPercent').value);
        const lightningCapital = parseFloat(document.getElementById('lightningCapital').value);
        
        // Validation
        if (monthlyVolume && currentFees && settlementDays !== undefined && 
            intlPercent !== undefined && lightningCapital) {
            this.calculate();
        }
    }
    
    calculate() {
        // Get input values
        const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
        const currentFees = parseFloat(document.getElementById('currentFees').value) / 100 || 0;
        const settlementDays = parseFloat(document.getElementById('settlementDays').value) || 0;
        const intlPercent = parseFloat(document.getElementById('intlPercent').value) / 100 || 0;
        const lightningCapital = parseFloat(document.getElementById('lightningCapital').value) || 0;
        
        // Lightning fees estimation (0.1-0.5% average)
        const lightningFees = 0.003; // 0.3% average
        
        // Calculate savings
        const annualVolume = monthlyVolume * 12;
        const annualSavings = annualVolume * (currentFees - lightningFees);
        
        // International transaction savings (higher fees internationally)
        const intlVolume = annualVolume * intlPercent;
        const intlExtraSavings = intlVolume * 0.03; // 3% additional savings international
        
        // Cash flow value (cost of capital 5% annually)
        const cashFlowValue = (monthlyVolume * settlementDays * 12) * 0.05;
        
        // Total benefits
        const totalBenefits = annualSavings + intlExtraSavings + cashFlowValue;
        
        // ROI calculation
        const roi = (totalBenefits / lightningCapital) * 100;
        const paybackMonths = lightningCapital / (totalBenefits / 12);
        
        // Display results
        this.displayResults({
            annualSavings: Math.round(annualSavings + intlExtraSavings),
            cashFlowValue: Math.round(cashFlowValue),
            totalBenefits: Math.round(totalBenefits),
            roi: Math.round(roi * 10) / 10,
            paybackMonths: Math.round(paybackMonths * 10) / 10
        });
        
        // Generate chart
        this.generateROIChart({
            investment: lightningCapital,
            monthlyBenefit: totalBenefits / 12,
            paybackMonths: paybackMonths
        });
    }
    
    displayResults(results) {
        document.getElementById('annualSavings').textContent = 
            `${results.annualSavings.toLocaleString('fr-FR')}€`;
        document.getElementById('cashFlowValue').textContent = 
            `${results.cashFlowValue.toLocaleString('fr-FR')}€`;
        document.getElementById('totalROI').textContent = 
            `${results.roi}%`;
        document.getElementById('paybackPeriod').textContent = 
            `${results.paybackMonths} mois`;
            
        document.getElementById('roiResults').style.display = 'block';
        
        // Color coding ROI
        const roiElement = document.getElementById('totalROI');
        if (results.roi > 50) {
            roiElement.className = 'result-value roi-highlight roi-excellent';
        } else if (results.roi > 25) {
            roiElement.className = 'result-value roi-highlight roi-good';
        } else if (results.roi > 10) {
            roiElement.className = 'result-value roi-highlight roi-moderate';
        } else {
            roiElement.className = 'result-value roi-highlight roi-poor';
        }
    }
    
    generateROIChart(data) {
        const ctx = document.getElementById('roiChart').getContext('2d');
        
        // Generate monthly cumulative returns
        const months = [];
        const cumulativeReturns = [];
        
        for (let month = 1; month <= 36; month++) {
            months.push(`Mois ${month}`);
            const cumulativeReturn = (data.monthlyBenefit * month) - data.investment;
            cumulativeReturns.push(cumulativeReturn);
        }
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Retour sur Investissement Cumulé (€)',
                    data: cumulativeReturns,
                    borderColor: '#f7931a',
                    backgroundColor: 'rgba(247, 147, 26, 0.1)',
                    fill: true,
                    tension: 0.2
                }, {
                    label: 'Break-even',
                    data: Array(36).fill(0),
                    borderColor: '#6c757d',
                    borderDash: [5, 5],
                    fill: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Projection ROI Lightning 3 Ans'
                    },
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('fr-FR') + '€';
                            }
                        }
                    }
                }
            }
        });
    }
    
    exportResults() {
        const results = {
            timestamp: new Date().toISOString(),
            inputs: {
                monthlyVolume: document.getElementById('monthlyVolume').value,
                currentFees: document.getElementById('currentFees').value,
                settlementDays: document.getElementById('settlementDays').value,
                intlPercent: document.getElementById('intlPercent').value,
                lightningCapital: document.getElementById('lightningCapital').value
            },
            outputs: {
                annualSavings: document.getElementById('annualSavings').textContent,
                cashFlowValue: document.getElementById('cashFlowValue').textContent,
                totalROI: document.getElementById('totalROI').textContent,
                paybackPeriod: document.getElementById('paybackPeriod').textContent
            }
        };
        
        // Create downloadable file
        const blob = new Blob([JSON.stringify(results, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `lightning-roi-analysis-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Lightning Node Profitability Calculator
class LightningNodeROICalculator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.initializeCalculator();
    }
    
    initializeCalculator() {
        this.container.innerHTML = `
            <div class="node-roi-calculator">
                <h3>⚡ Lightning Node Profitability Calculator</h3>
                
                <div class="calculator-tabs">
                    <button class="tab-btn active" onclick="nodeROI.showTab('routing')">Routing ROI</button>
                    <button class="tab-btn" onclick="nodeROI.showTab('liquidity')">Liquidity Providing</button>
                    <button class="tab-btn" onclick="nodeROI.showTab('advanced')">Advanced Strategies</button>
                </div>
                
                <div id="routing-tab" class="tab-content active">
                    <div class="input-group">
                        <label for="nodeCapital">Capital node Lightning (€)</label>
                        <input type="number" id="nodeCapital" placeholder="10000" min="1000" max="1000000">
                    </div>
                    
                    <div class="input-group">
                        <label for="averageFeeRate">Fee rate moyen (ppm)</label>
                        <input type="number" id="averageFeeRate" placeholder="1000" min="100" max="5000">
                        <small>1000 ppm = 0.1% fee</small>
                    </div>
                    
                    <div class="input-group">
                        <label for="dailyVolume">Volume routé quotidien (€)</label>
                        <input type="number" id="dailyVolume" placeholder="5000" min="100" max="100000">
                    </div>
                    
                    <div class="input-group">
                        <label for="channelUtilization">Utilisation channels (%)</label>
                        <input type="number" id="channelUtilization" placeholder="40" min="10" max="80">
                    </div>
                </div>
                
                <div id="liquidity-tab" class="tab-content">
                    <div class="input-group">
                        <label for="poolCapital">Capital Lightning Pool (€)</label>
                        <input type="number" id="poolCapital" placeholder="25000" min="5000" max="500000">
                    </div>
                    
                    <div class="input-group">
                        <label for="poolAPR">APR Lightning Pool (%)</label>
                        <input type="number" id="poolAPR" placeholder="12" min="5" max="25" step="0.5">
                    </div>
                    
                    <div class="input-group">
                        <label for="magmaCapital">Capital Amboss Magma (€)</label>
                        <input type="number" id="magmaCapital" placeholder="15000" min="2000" max="200000">
                    </div>
                    
                    <div class="input-group">
                        <label for="magmaAPR">APR Amboss Magma (%)</label>
                        <input type="number" id="magmaAPR" placeholder="15" min="8" max="30" step="0.5">
                    </div>
                </div>
                
                <div id="advanced-tab" class="tab-content">
                    <div class="input-group">
                        <label for="yieldFarming">Yield Farming allocation (€)</label>
                        <input type="number" id="yieldFarming" placeholder="20000" min="10000" max="200000">
                    </div>
                    
                    <div class="input-group">
                        <label for="yieldAPR">Yield Farming APR (%)</label>
                        <input type="number" id="yieldAPR" placeholder="25" min="15" max="50" step="1">
                    </div>
                    
                    <div class="input-group">
                        <label for="arbitrageCapital">Arbitrage capital (€)</label>
                        <input type="number" id="arbitrageCapital" placeholder="30000" min="5000" max="500000">
                    </div>
                    
                    <div class="input-group">
                        <label for="arbitrageROI">Arbitrage ROI annuel (%)</label>
                        <input type="number" id="arbitrageROI" placeholder="35" min="10" max="80" step="1">
                    </div>
                </div>
                
                <button onclick="nodeROI.calculateNodeROI()" class="calculate-btn">
                    Calculer Profitabilité Node
                </button>
                
                <div id="nodeResults" class="results-section" style="display: none;">
                    <h4>📈 Profitabilité Lightning Node</h4>
                    <div class="results-comprehensive">
                        <div class="result-category">
                            <h5>Revenus Routing</h5>
                            <div id="routingRevenue" class="revenue-item">-</div>
                        </div>
                        <div class="result-category">
                            <h5>Revenus Liquidity Providing</h5>
                            <div id="liquidityRevenue" class="revenue-item">-</div>
                        </div>
                        <div class="result-category">
                            <h5>Revenus Advanced Strategies</h5>
                            <div id="advancedRevenue" class="revenue-item">-</div>
                        </div>
                        <div class="result-total">
                            <h5>ROI Total Combiné</h5>
                            <div id="combinedROI" class="roi-total">-</div>
                        </div>
                    </div>
                    
                    <div class="strategy-recommendations" id="strategyRecommendations">
                        <!-- Recommendations will be populated here -->
                    </div>
                </div>
            </div>
        `;
    }
    
    showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        document.getElementById(`${tabName}-tab`).classList.add('active');
        event.target.classList.add('active');
    }
    
    calculateNodeROI() {
        // Routing ROI calculation
        const nodeCapital = parseFloat(document.getElementById('nodeCapital').value) || 0;
        const feeRate = parseFloat(document.getElementById('averageFeeRate').value) / 1000000 || 0;
        const dailyVolume = parseFloat(document.getElementById('dailyVolume').value) || 0;
        const utilization = parseFloat(document.getElementById('channelUtilization').value) / 100 || 0;
        
        const dailyRoutingRevenue = dailyVolume * feeRate;
        const annualRoutingRevenue = dailyRoutingRevenue * 365;
        const routingROI = (annualRoutingRevenue / nodeCapital) * 100;
        
        // Liquidity providing ROI
        const poolCapital = parseFloat(document.getElementById('poolCapital').value) || 0;
        const poolAPR = parseFloat(document.getElementById('poolAPR').value) / 100 || 0;
        const magmaCapital = parseFloat(document.getElementById('magmaCapital').value) || 0;
        const magmaAPR = parseFloat(document.getElementById('magmaAPR').value) / 100 || 0;
        
        const poolRevenue = poolCapital * poolAPR;
        const magmaRevenue = magmaCapital * magmaAPR;
        const liquidityRevenue = poolRevenue + magmaRevenue;
        
        // Advanced strategies ROI
        const yieldCapital = parseFloat(document.getElementById('yieldFarming').value) || 0;
        const yieldAPR = parseFloat(document.getElementById('yieldAPR').value) / 100 || 0;
        const arbitrageCapital = parseFloat(document.getElementById('arbitrageCapital').value) || 0;
        const arbitrageROI = parseFloat(document.getElementById('arbitrageROI').value) / 100 || 0;
        
        const yieldRevenue = yieldCapital * yieldAPR;
        const arbitrageRevenue = arbitrageCapital * arbitrageROI;
        const advancedRevenue = yieldRevenue + arbitrageRevenue;
        
        // Total calculations
        const totalCapital = nodeCapital + poolCapital + magmaCapital + yieldCapital + arbitrageCapital;
        const totalRevenue = annualRoutingRevenue + liquidityRevenue + advancedRevenue;
        const combinedROI = totalCapital > 0 ? (totalRevenue / totalCapital) * 100 : 0;
        
        // Display results
        this.displayNodeResults({
            routingRevenue: annualRoutingRevenue,
            routingROI: routingROI,
            liquidityRevenue: liquidityRevenue,
            advancedRevenue: advancedRevenue,
            totalRevenue: totalRevenue,
            combinedROI: combinedROI,
            totalCapital: totalCapital
        });
        
        // Generate recommendations
        this.generateRecommendations({
            combinedROI: combinedROI,
            totalCapital: totalCapital,
            routingROI: routingROI
        });
    }
    
    displayNodeResults(results) {
        document.getElementById('routingRevenue').innerHTML = `
            <div class="revenue-details">
                <span class="revenue-amount">${Math.round(results.routingRevenue).toLocaleString('fr-FR')}€/an</span>
                <span class="revenue-roi">(${Math.round(results.routingROI * 10) / 10}% ROI)</span>
            </div>
        `;
        
        document.getElementById('liquidityRevenue').innerHTML = `
            <div class="revenue-details">
                <span class="revenue-amount">${Math.round(results.liquidityRevenue).toLocaleString('fr-FR')}€/an</span>
            </div>
        `;
        
        document.getElementById('advancedRevenue').innerHTML = `
            <div class="revenue-details">
                <span class="revenue-amount">${Math.round(results.advancedRevenue).toLocaleString('fr-FR')}€/an</span>
            </div>
        `;
        
        document.getElementById('combinedROI').textContent = `${Math.round(results.combinedROI * 10) / 10}%`;
        
        document.getElementById('nodeResults').style.display = 'block';
    }
    
    generateRecommendations(results) {
        const recommendationsContainer = document.getElementById('strategyRecommendations');
        let recommendations = '<h5>💡 Recommandations Stratégiques</h5>';
        
        if (results.combinedROI > 30) {
            recommendations += `
                <div class="recommendation excellent">
                    <strong>🚀 ROI Excellent (${Math.round(results.combinedROI)}%)</strong><br>
                    Votre stratégie est très rentable. Considérez scaling votre opération.
                </div>
            `;
        } else if (results.combinedROI > 15) {
            recommendations += `
                <div class="recommendation good">
                    <strong>✅ ROI Solide (${Math.round(results.combinedROI)}%)</strong><br>
                    Performance good. Optimisez liquidity management pour améliorer.
                </div>
            `;
        } else if (results.combinedROI > 5) {
            recommendations += `
                <div class="recommendation moderate">
                    <strong>⚠️ ROI Modéré (${Math.round(results.combinedROI)}%)</strong><br>
                    Revisez votre stratégie. Focus sur advanced yield strategies.
                </div>
            `;
        } else {
            recommendations += `
                <div class="recommendation poor">
                    <strong>❌ ROI Insuffisant (${Math.round(results.combinedROI)}%)</strong><br>
                    Recommandé : consultation expert pour optimization complète.
                </div>
            `;
        }
        
        // Additional recommendations based on capital
        if (results.totalCapital < 10000) {
            recommendations += `
                <div class="recommendation capital">
                    <strong>📊 Capital Optimization</strong><br>
                    Avec ${results.totalCapital.toLocaleString('fr-FR')}€, focus sur routing efficiency plutôt que diversification.
                </div>
            `;
        } else if (results.totalCapital > 100000) {
            recommendations += `
                <div class="recommendation scaling">
                    <strong>🎯 Scaling Opportunity</strong><br>
                    Capital ${results.totalCapital.toLocaleString('fr-FR')}€ permet strategies advanced: yield farming + arbitrage.
                </div>
            `;
        }
        
        recommendationsContainer.innerHTML = recommendations;
    }
}

// Bitcoin Mining ROI Calculator
class BitcoinMiningROICalculator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.initializeCalculator();
    }
    
    initializeCalculator() {
        this.container.innerHTML = `
            <div class="mining-roi-calculator">
                <h3>⛏️ Bitcoin Mining ROI Calculator</h3>
                
                <div class="mining-inputs">
                    <div class="input-group">
                        <label for="hashRate">Hash Rate (TH/s)</label>
                        <input type="number" id="hashRate" placeholder="200" min="1" max="1000">
                        <small>Antminer S21: 200 TH/s</small>
                    </div>
                    
                    <div class="input-group">
                        <label for="powerConsumption">Consommation (Watts)</label>
                        <input type="number" id="powerConsumption" placeholder="3500" min="500" max="10000">
                    </div>
                    
                    <div class="input-group">
                        <label for="electricityCost">Coût électricité (€/kWh)</label>
                        <input type="number" id="electricityCost" placeholder="0.06" min="0.01" max="0.30" step="0.01">
                    </div>
                    
                    <div class="input-group">
                        <label for="asicCost">Coût ASIC (€)</label>
                        <input type="number" id="asicCost" placeholder="3500" min="500" max="20000">
                    </div>
                    
                    <div class="input-group">
                        <label for="poolFee">Pool fee (%)</label>
                        <input type="number" id="poolFee" placeholder="2.5" min="0" max="5" step="0.1">
                    </div>
                    
                    <button onclick="miningROI.calculateMining()" class="calculate-btn">
                        Calculer ROI Mining
                    </button>
                </div>
                
                <div id="miningResults" class="results-section" style="display: none;">
                    <h4>📊 Résultats Mining ROI</h4>
                    
                    <div class="mining-metrics">
                        <div class="metric-card">
                            <h5>Revenus Quotidiens</h5>
                            <div class="metric-value" id="dailyRevenue">-</div>
                        </div>
                        <div class="metric-card">
                            <h5>Coûts Quotidiens</h5>
                            <div class="metric-value" id="dailyCosts">-</div>
                        </div>
                        <div class="metric-card">
                            <h5>Profit Quotidien</h5>
                            <div class="metric-value" id="dailyProfit">-</div>
                        </div>
                        <div class="metric-card">
                            <h5>ROI Annuel</h5>
                            <div class="metric-value roi-highlight" id="miningROI">-</div>
                        </div>
                    </div>
                    
                    <div class="mining-projections">
                        <h5>Projections 12 Mois</h5>
                        <canvas id="miningChart" width="400" height="200"></canvas>
                    </div>
                    
                    <div class="difficulty-impact">
                        <h5>🎯 Impact Difficulty</h5>
                        <div id="difficultyAnalysis">-</div>
                    </div>
                </div>
            </div>
        `;
        
        this.setupMiningEventListeners();
    }
    
    setupMiningEventListeners() {
        const inputs = this.container.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateAndCalculateMining();
            });
        });
    }
    
    validateAndCalculateMining() {
        const hashRate = parseFloat(document.getElementById('hashRate').value);
        const power = parseFloat(document.getElementById('powerConsumption').value);
        const electricityCost = parseFloat(document.getElementById('electricityCost').value);
        
        if (hashRate && power && electricityCost) {
            this.calculateMining();
        }
    }
    
    calculateMining() {
        // Input values
        const hashRate = parseFloat(document.getElementById('hashRate').value) || 0;
        const powerConsumption = parseFloat(document.getElementById('powerConsumption').value) || 0;
        const electricityCost = parseFloat(document.getElementById('electricityCost').value) || 0;
        const asicCost = parseFloat(document.getElementById('asicCost').value) || 0;
        const poolFee = parseFloat(document.getElementById('poolFee').value) / 100 || 0;
        
        // Network constants (estimates for 2025)
        const networkDifficulty = 67000000000000; // Current difficulty estimate
        const blockReward = 3.125; // Post-2024 halving
        const bitcoinPrice = 45000; // EUR per BTC
        const blocksPerDay = 144; // Average blocks per day
        
        // Daily calculations
        const dailyBTC = (hashRate * 1e12 * 86400 * blockReward) / (networkDifficulty * Math.pow(2, 32));
        const grossDailyRevenue = dailyBTC * bitcoinPrice;
        const poolFeeAmount = grossDailyRevenue * poolFee;
        const netDailyRevenue = grossDailyRevenue - poolFeeAmount;
        
        const dailyElectricityCost = (powerConsumption * 24 * electricityCost) / 1000;
        const dailyProfit = netDailyRevenue - dailyElectricityCost;
        
        // Annual calculations
        const annualProfit = dailyProfit * 365;
        const roi = asicCost > 0 ? (annualProfit / asicCost) * 100 : 0;
        const paybackDays = dailyProfit > 0 ? asicCost / dailyProfit : Infinity;
        
        // Display results
        this.displayMiningResults({
            dailyRevenue: netDailyRevenue,
            dailyCosts: dailyElectricityCost,
            dailyProfit: dailyProfit,
            annualProfit: annualProfit,
            roi: roi,
            paybackDays: paybackDays
        });
        
        // Generate projections chart
        this.generateMiningProjections({
            dailyProfit: dailyProfit,
            initialInvestment: asicCost,
            difficultyGrowth: 0.20 // 20% annual difficulty growth
        });
        
        // Difficulty impact analysis
        this.analyzeDifficultyImpact({
            currentROI: roi,
            hashRate: hashRate,
            powerConsumption: powerConsumption
        });
    }
    
    displayMiningResults(results) {
        document.getElementById('dailyRevenue').textContent = 
            `${results.dailyRevenue.toFixed(2)}€`;
        document.getElementById('dailyCosts').textContent = 
            `${results.dailyCosts.toFixed(2)}€`;
        document.getElementById('dailyProfit').textContent = 
            `${results.dailyProfit.toFixed(2)}€`;
        document.getElementById('miningROI').textContent = 
            `${results.roi.toFixed(1)}%`;
            
        // Color coding ROI
        const roiElement = document.getElementById('miningROI');
        if (results.roi > 50) {
            roiElement.className = 'metric-value roi-highlight roi-excellent';
        } else if (results.roi > 25) {
            roiElement.className = 'metric-value roi-highlight roi-good';
        } else if (results.roi > 10) {
            roiElement.className = 'metric-value roi-highlight roi-moderate';
        } else {
            roiElement.className = 'metric-value roi-highlight roi-poor';
        }
        
        document.getElementById('miningResults').style.display = 'block';
    }
    
    generateMiningProjections(data) {
        const ctx = document.getElementById('miningChart').getContext('2d');
        
        const months = [];
        const profits = [];
        const cumulativeProfit = [];
        let cumulative = -data.initialInvestment;
        
        for (let month = 1; month <= 12; month++) {
            months.push(`M${month}`);
            
            // Difficulty adjustment impact (monthly)
            const difficultyFactor = Math.pow(1 + data.difficultyGrowth / 12, month);
            const monthlyProfit = (data.dailyProfit * 30) / difficultyFactor;
            
            profits.push(monthlyProfit);
            cumulative += monthlyProfit;
            cumulativeProfit.push(cumulative);
        }
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Profit Mensuel (€)',
                    data: profits,
                    backgroundColor: 'rgba(247, 147, 26, 0.6)',
                    borderColor: '#f7931a',
                    borderWidth: 1,
                    yAxisID: 'y'
                }, {
                    label: 'Profit Cumulé (€)',
                    data: cumulativeProfit,
                    type: 'line',
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    fill: false,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Projections Mining ROI 12 Mois'
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Profit Mensuel (€)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Profit Cumulé (€)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }
    
    analyzeDifficultyImpact(data) {
        const scenarios = {
            conservative: { growth: 0.15, label: "Croissance difficulty 15%" },
            realistic: { growth: 0.25, label: "Croissance difficulty 25%" },
            aggressive: { growth: 0.35, label: "Croissance difficulty 35%" }
        };
        
        let analysisHTML = '<div class="difficulty-scenarios">';
        
        Object.entries(scenarios).forEach(([key, scenario]) => {
            const adjustedROI = data.currentROI / (1 + scenario.growth);
            const profitabilityPeriod = adjustedROI > 5 ? "Rentable 12+ mois" : "Rentabilité douteuse";
            
            analysisHTML += `
                <div class="scenario ${key}">
                    <strong>${scenario.label}</strong><br>
                    ROI ajusté: ${adjustedROI.toFixed(1)}%<br>
                    Outlook: ${profitabilityPeriod}
                </div>
            `;
        });
        
        analysisHTML += '</div>';
        document.getElementById('difficultyAnalysis').innerHTML = analysisHTML;
    }
}

// Portfolio Allocation Calculator  
class BitcoinPortfolioCalculator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.initializeCalculator();
    }
    
    initializeCalculator() {
        this.container.innerHTML = `
            <div class="portfolio-calculator">
                <h3>📊 Bitcoin Portfolio Allocation Calculator</h3>
                
                <div class="portfolio-inputs">
                    <div class="input-group">
                        <label for="totalPortfolio">Portfolio total (€)</label>
                        <input type="number" id="totalPortfolio" placeholder="100000" min="1000" max="10000000">
                    </div>
                    
                    <div class="input-group">
                        <label for="riskTolerance">Tolérance au risque</label>
                        <select id="riskTolerance">
                            <option value="conservative">Conservateur (2-5% Bitcoin)</option>
                            <option value="moderate">Modéré (5-15% Bitcoin)</option>
                            <option value="aggressive">Agressif (15-25% Bitcoin)</option>
                            <option value="maximum">Maximum Conviction (25-50% Bitcoin)</option>
                        </select>
                    </div>
                    
                    <div class="input-group">
                        <label for="timeHorizon">Horizon d'investissement</label>
                        <select id="timeHorizon">
                            <option value="short">Court terme (1-2 ans)</option>
                            <option value="medium">Moyen terme (3-5 ans)</option>
                            <option value="long">Long terme (5+ ans)</option>
                        </select>
                    </div>
                    
                    <div class="input-group">
                        <label for="dcaMonthly">DCA mensuel souhaité (€)</label>
                        <input type="number" id="dcaMonthly" placeholder="500" min="50" max="10000">
                    </div>
                    
                    <button onclick="portfolioCalc.calculateAllocation()" class="calculate-btn">
                        Calculer Allocation Optimale
                    </button>
                </div>
                
                <div id="portfolioResults" class="results-section" style="display: none;">
                    <h4>🎯 Allocation Portfolio Recommandée</h4>
                    
                    <div class="allocation-chart-container">
                        <canvas id="allocationChart" width="300" height="300"></canvas>
                    </div>
                    
                    <div class="allocation-details">
                        <div class="allocation-item">
                            <span class="allocation-label">Bitcoin allocation</span>
                            <span class="allocation-value" id="bitcoinAllocation">-</span>
                        </div>
                        <div class="allocation-item">
                            <span class="allocation-label">Montant Bitcoin</span>
                            <span class="allocation-value" id="bitcoinAmount">-</span>
                        </div>
                        <div class="allocation-item">
                            <span class="allocation-label">DCA strategy</span>
                            <span class="allocation-value" id="dcaStrategy">-</span>
                        </div>
                        <div class="allocation-item">
                            <span class="allocation-label">Période accumulation</span>
                            <span class="allocation-value" id="accumulationPeriod">-</span>
                        </div>
                    </div>
                    
                    <div class="risk-analysis">
                        <h5>⚖️ Analyse Risque</h5>
                        <div id="riskAnalysis">-</div>
                    </div>
                </div>
            </div>
        `;
        
        this.setupPortfolioEventListeners();
    }
    
    setupPortfolioEventListeners() {
        const inputs = this.container.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                this.calculateAllocation();
            });
        });
    }
    
    calculateAllocation() {
        const totalPortfolio = parseFloat(document.getElementById('totalPortfolio').value) || 0;
        const riskTolerance = document.getElementById('riskTolerance').value;
        const timeHorizon = document.getElementById('timeHorizon').value;
        const dcaMonthly = parseFloat(document.getElementById('dcaMonthly').value) || 0;
        
        // Calculate allocation based on risk profile
        const allocationRanges = {
            conservative: { min: 0.02, max: 0.05 },
            moderate: { min: 0.05, max: 0.15 },
            aggressive: { min: 0.15, max: 0.25 },
            maximum: { min: 0.25, max: 0.50 }
        };
        
        // Time horizon adjustment
        const timeMultipliers = {
            short: 0.7,
            medium: 1.0,
            long: 1.3
        };
        
        const baseRange = allocationRanges[riskTolerance];
        const timeMultiplier = timeMultipliers[timeHorizon];
        const recommendedAllocation = Math.min(
            baseRange.max * timeMultiplier,
            0.50 // Maximum 50% ever
        );
        
        const bitcoinAmount = totalPortfolio * recommendedAllocation;
        const dcaMonths = dcaMonthly > 0 ? bitcoinAmount / dcaMonthly : 0;
        
        // Display results
        this.displayAllocationResults({
            allocation: recommendedAllocation * 100,
            bitcoinAmount: bitcoinAmount,
            dcaMonthly: dcaMonthly,
            dcaMonths: dcaMonths,
            riskProfile: riskTolerance,
            timeHorizon: timeHorizon
        });
        
        // Generate allocation chart
        this.generateAllocationChart({
            bitcoinPercent: recommendedAllocation * 100,
            traditionalPercent: (1 - recommendedAllocation) * 100
        });
        
        // Risk analysis
        this.generateRiskAnalysis({
            allocation: recommendedAllocation,
            riskProfile: riskTolerance
        });
    }
    
    displayAllocationResults(results) {
        document.getElementById('bitcoinAllocation').textContent = 
            `${results.allocation.toFixed(1)}%`;
        document.getElementById('bitcoinAmount').textContent = 
            `${Math.round(results.bitcoinAmount).toLocaleString('fr-FR')}€`;
        document.getElementById('dcaStrategy').textContent = 
            `${results.dcaMonthly}€/mois`;
        document.getElementById('accumulationPeriod').textContent = 
            `${Math.round(results.dcaMonths)} mois`;
            
        document.getElementById('portfolioResults').style.display = 'block';
    }
    
    generateAllocationChart(data) {
        const ctx = document.getElementById('allocationChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Bitcoin', 'Actifs Traditionnels'],
                datasets: [{
                    data: [data.bitcoinPercent, data.traditionalPercent],
                    backgroundColor: ['#f7931a', '#6c757d'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Allocation Portfolio Recommandée'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    generateRiskAnalysis(data) {
        const riskProfiles = {
            conservative: {
                volatility: "Faible (portfolio stable)",
                drawdown: "Maximum 10-15%",
                outlook: "Protection capital avec upside Bitcoin limité"
            },
            moderate: {
                volatility: "Modérée (fluctuations sensibles)",
                drawdown: "Maximum 20-30%", 
                outlook: "Balance protection/croissance optimal"
            },
            aggressive: {
                volatility: "Élevée (fluctuations importantes)",
                drawdown: "Maximum 35-50%",
                outlook: "Maximisation gains long terme"
            },
            maximum: {
                volatility: "Très élevée (volatilité extrême)",
                drawdown: "Maximum 50-70%",
                outlook: "Conviction maximale Bitcoin adoption"
            }
        };
        
        const profile = riskProfiles[data.riskProfile] || riskProfiles.moderate;
        
        document.getElementById('riskAnalysis').innerHTML = `
            <div class="risk-breakdown">
                <div class="risk-item">
                    <strong>Volatilité attendue:</strong> ${profile.volatility}
                </div>
                <div class="risk-item">
                    <strong>Drawdown maximum:</strong> ${profile.drawdown}
                </div>
                <div class="risk-item">
                    <strong>Outlook:</strong> ${profile.outlook}
                </div>
            </div>
        `;
    }
}

// Initialize calculators when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize calculators if containers exist
    if (document.getElementById('lightning-business-roi-calculator')) {
        window.lightningROI = new LightningBusinessROICalculator('lightning-business-roi-calculator');
    }
    
    if (document.getElementById('lightning-node-roi-calculator')) {
        window.nodeROI = new LightningNodeROICalculator('lightning-node-roi-calculator');
    }
    
    if (document.getElementById('bitcoin-mining-roi-calculator')) {
        window.miningROI = new BitcoinMiningROICalculator('bitcoin-mining-roi-calculator');
    }
    
    if (document.getElementById('bitcoin-portfolio-calculator')) {
        window.portfolioCalc = new BitcoinPortfolioCalculator('bitcoin-portfolio-calculator');
    }
});

// Utility functions
function formatEuro(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function formatPercent(value) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(value / 100);
}