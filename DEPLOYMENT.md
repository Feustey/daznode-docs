# 🚀 Daznode GitBook Community Platform - Deployment Guide

## Vue d'ensemble

Ce guide couvre le déploiement complet de la plateforme communautaire Daznode GitBook, incluant l'infrastructure, les services, et la configuration de production.

## 📋 Prérequis

### Outils Requis
- **Docker** 20.10+
- **Docker Compose** 2.0+
- **kubectl** 1.25+
- **Helm** 3.8+
- **Node.js** 18+
- **Git**

### Comptes et Services Externes
- **GitBook API Token** (pour l'intégration)
- **Ethereum Provider** (Infura/Alchemy)
- **Container Registry** (GitHub Container Registry)
- **Monitoring** (optionnel : Datadog, New Relic)

## 🔧 Configuration Initiale

### 1. Cloner et Configurer

```bash
git clone https://github.com/daznode/daznode-docs.git
cd daznode-docs
cp .env.example .env
```

### 2. Configurer les Variables d'Environnement

Éditez le fichier `.env` avec vos valeurs :

```bash
# Configuration minimale requise
DATABASE_URL=postgresql://daznode:secure_password@localhost:5432/daznode_community
GITBOOK_API_TOKEN=your_gitbook_token
T4G_CONTRACT_ADDRESS=0x...
ETHEREUM_PROVIDER_URL=https://mainnet.infura.io/v3/your_project_id
JWT_SECRET=your_super_secure_jwt_secret_32_chars_min
ENCRYPTION_KEY=your_encryption_key_exactly_32_chars
```

## 🌍 Déploiements par Environnement

### Développement Local

```bash
# Déploiement rapide avec Docker Compose
./deploy.sh latest development

# Ou manuellement
cd src/infrastructure/docker
docker-compose up -d
```

**Services disponibles :**
- API Backend: http://localhost:3001
- Grafana: http://localhost:3000
- Prometheus: http://localhost:9090
- Kibana: http://localhost:5601
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Staging

```bash
./deploy.sh v1.0.0 staging
```

### Production

```bash
# Déploiement Kubernetes en production
./deploy.sh v1.0.0 production
```

## 🏗️ Architecture de Déploiement

### Docker Compose (Dev/Staging)

```yaml
Services Déployés:
├── daznode-backend (API principale)
├── postgres (Base de données)
├── redis (Cache)
├── kafka + zookeeper (Event streaming)
├── nginx (Load balancer)
├── prometheus (Métriques)
├── grafana (Dashboards)
├── elasticsearch (Logs)
├── kibana (Log viewer)
└── logstash (Log processing)
```

### Kubernetes (Production)

```yaml
Composants K8s:
├── Namespace: daznode-community
├── Deployments:
│   ├── daznode-backend (3 replicas)
│   ├── postgres-cluster
│   └── redis-cluster
├── Services & Load Balancers
├── ConfigMaps & Secrets
├── HorizontalPodAutoscaler
├── PodDisruptionBudget
└── NetworkPolicies
```

## 🔍 Vérification Post-Déploiement

### Health Checks Automatiques

Le script de déploiement effectue automatiquement :

```bash
# Tests de santé des services
curl http://localhost:3001/health
curl http://localhost:3001/metrics
curl http://localhost:3001/api/v1/gitbook/test
```

### Tests Manuels

```bash
# Tester l'API
curl -X GET http://localhost:3001/api/v1/contributions

# Vérifier les métriques Prometheus
curl http://localhost:9090/api/v1/query?query=daznode_http_requests_total

# Tester l'intégration GitBook
curl -X POST http://localhost:3001/api/v1/webhooks/gitbook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## 📊 Monitoring & Observabilité

### Dashboards Grafana

**URL:** http://localhost:3000 (admin/admin123)

Dashboards disponibles :
- **Application Overview** - Vue d'ensemble système
- **T4G Blockchain Metrics** - Métriques blockchain
- **GitBook Integration** - Monitoring GitBook
- **User Activity** - Analytics communautaire
- **Infrastructure Health** - Santé infrastructure

### Métriques Clés

```
# Métriques Application
daznode_http_requests_total
daznode_t4g_rewards_distributed_total
daznode_contribution_processing_seconds
daznode_active_connections

# Métriques Business
daznode_contributions_total
daznode_users_active
daznode_content_quality_score

# Métriques Infrastructure
daznode_database_connections
daznode_cache_hit_ratio
daznode_error_rate
```

### Logs & Tracing

- **Logs centralisés** : Kibana (http://localhost:5601)
- **Distributed tracing** : Jaeger (http://localhost:16686)
- **Application logs** : `/app/logs` dans les conteneurs

## 🛡️ Sécurité

### Configuration SSL/TLS

Pour la production, configurez HTTPS :

```bash
# Générer certificats Let's Encrypt
certbot certonly --webroot -w /var/www/html -d api.dazno.de

# Ou utiliser des certificats existants
cp your-cert.pem src/infrastructure/docker/nginx/ssl/
cp your-key.pem src/infrastructure/docker/nginx/ssl/
```

### Secrets Management

```bash
# Kubernetes Secrets
kubectl create secret generic daznode-secrets \
  --from-literal=database-url="$DATABASE_URL" \
  --from-literal=jwt-secret="$JWT_SECRET" \
  --namespace=daznode-community

# Ou utiliser un gestionnaire externe (HashiCorp Vault, AWS Secrets Manager)
```

## 🔄 Mise à Jour & Rollback

### Mise à Jour

```bash
# Build nouvelle version
./deploy.sh v1.1.0 production

# Vérification automatique et rollback en cas d'échec
```

### Rollback Manuel

```bash
# Kubernetes
kubectl rollout undo deployment/daznode-backend -n daznode-community

# Docker Compose
docker-compose down
docker-compose up -d --scale daznode-backend=0
# Restaurer version précédente
docker-compose up -d
```

## 📈 Scaling

### Auto-scaling Kubernetes

```yaml
# HPA configuré pour :
- CPU : 70% utilization target
- Memory : 80% utilization target  
- Custom metrics : 1k requests/second
- Min replicas : 3
- Max replicas : 20
```

### Scaling Manuel

```bash
# Kubernetes
kubectl scale deployment daznode-backend --replicas=5 -n daznode-community

# Docker Compose
docker-compose up -d --scale daznode-backend=3
```

## 🚨 Troubleshooting

### Problèmes Courants

**Service ne démarre pas :**
```bash
# Vérifier les logs
docker-compose logs daznode-backend
kubectl logs deployment/daznode-backend -n daznode-community

# Vérifier la configuration
docker-compose config
kubectl describe deployment daznode-backend -n daznode-community
```

**Base de données inaccessible :**
```bash
# Tester la connexion
docker exec -it daznode-postgres psql -U daznode -d daznode_community

# Vérifier les migrations
docker exec daznode-backend npm run migrate:status
```

**Intégration GitBook échoue :**
```bash
# Tester l'API GitBook
curl -H "Authorization: Bearer $GITBOOK_API_TOKEN" \
  https://api.gitbook.com/v1/user

# Vérifier les webhooks
curl http://localhost:3001/api/v1/webhooks/gitbook/test
```

### Monitoring des Erreurs

```bash
# Alertes automatiques configurées pour :
- Error rate > 5%
- Response time > 2s
- Memory usage > 90%
- Disk space < 10%
- T4G transaction failures
```

## 💾 Backup & Recovery

### Base de Données

```bash
# Backup automatique quotidien
docker exec daznode-postgres pg_dump -U daznode daznode_community > backup.sql

# Restauration
docker exec -i daznode-postgres psql -U daznode daznode_community < backup.sql
```

### Configuration

```bash
# Backup des configurations
kubectl get all -n daznode-community -o yaml > k8s-backup.yaml

# Backup des secrets (chiffrés)
kubectl get secrets -n daznode-community -o yaml > secrets-backup.yaml
```

## 🎯 Performance Tuning

### Optimisations PostgreSQL

```sql
-- Configuration recommandée (postgresql.conf)
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
```

### Optimisations Redis

```
# Configuration redis.conf
maxmemory 512mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

## 📞 Support & Maintenance

### Contacts

- **Infrastructure** : devops@daznode.com
- **Application** : dev@daznode.com  
- **Sécurité** : security@daznode.com

### Maintenance Programmée

- **Database backups** : Quotidien à 02:00 UTC
- **Log rotation** : Hebdomadaire
- **Certificate renewal** : Automatique
- **Dependency updates** : Mensuel

### SLA & Availability

- **Uptime target** : 99.99%
- **Response time** : < 200ms p95
- **Error rate** : < 0.1%
- **Recovery time** : < 5 minutes

---

**🎉 Déploiement réussi ! La plateforme Daznode GitBook Community est maintenant prête à transformer la documentation en hub collaboratif avec distribution automatisée des tokens T4G.**