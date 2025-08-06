#!/bin/bash

# Daznode GitBook Community Platform - Deployment Script
# Production deployment avec monitoring et rollback automatique

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCKER_REGISTRY="ghcr.io/daznode"
IMAGE_TAG=${1:-"latest"}
ENVIRONMENT=${2:-"production"}
NAMESPACE="daznode-community"

echo -e "${BLUE}🚀 Starting Daznode GitBook Community Platform Deployment${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}Image Tag: ${IMAGE_TAG}${NC}"

# Function to log with timestamp
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed and running
    if ! docker --version >/dev/null 2>&1; then
        error "Docker is not installed or not running"
    fi
    
    # Check if kubectl is installed
    if ! kubectl version --client >/dev/null 2>&1; then
        error "kubectl is not installed"
    fi
    
    # Check if helm is installed
    if ! helm version >/dev/null 2>&1; then
        error "Helm is not installed"
    fi
    
    log "✅ All prerequisites satisfied"
}

# Build and push Docker images
build_and_push_images() {
    log "Building and pushing Docker images..."
    
    # Backend API
    log "Building backend API image..."
    cd src/backend
    docker build -t ${DOCKER_REGISTRY}/daznode-backend:${IMAGE_TAG} -f ../infrastructure/docker/Dockerfile.backend .
    docker push ${DOCKER_REGISTRY}/daznode-backend:${IMAGE_TAG}
    cd ../..
    
    # Frontend Components (for GitBook integration)
    log "Building frontend components..."
    cd src/frontend
    npm run build
    docker build -t ${DOCKER_REGISTRY}/daznode-frontend:${IMAGE_TAG} .
    docker push ${DOCKER_REGISTRY}/daznode-frontend:${IMAGE_TAG}
    cd ../..
    
    log "✅ Images built and pushed successfully"
}

# Setup Kubernetes namespace and secrets
setup_kubernetes() {
    log "Setting up Kubernetes resources..."
    
    # Create namespace if it doesn't exist
    kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
    
    # Apply secrets (assuming they exist in environment variables or external secret manager)
    log "Setting up secrets..."
    kubectl create secret generic daznode-secrets \
        --from-literal=database-url="${DATABASE_URL}" \
        --from-literal=redis-url="${REDIS_URL}" \
        --from-literal=gitbook-api-token="${GITBOOK_API_TOKEN}" \
        --from-literal=t4g-contract-address="${T4G_CONTRACT_ADDRESS}" \
        --from-literal=ethereum-provider-url="${ETHEREUM_PROVIDER_URL}" \
        --from-literal=t4g-private-key="${T4G_PRIVATE_KEY}" \
        --from-literal=jwt-secret="${JWT_SECRET}" \
        --from-literal=encryption-key="${ENCRYPTION_KEY}" \
        --namespace=${NAMESPACE} \
        --dry-run=client -o yaml | kubectl apply -f -
    
    log "✅ Kubernetes setup completed"
}

# Deploy infrastructure components
deploy_infrastructure() {
    log "Deploying infrastructure components..."
    
    # Deploy with Docker Compose for development/staging
    if [[ "${ENVIRONMENT}" == "development" || "${ENVIRONMENT}" == "staging" ]]; then
        log "Deploying with Docker Compose..."
        cd src/infrastructure/docker
        
        # Create .env file
        cat > .env << EOF
DB_PASSWORD=${DB_PASSWORD:-daznode123}
REDIS_PASSWORD=${REDIS_PASSWORD:-redis123}
GRAFANA_PASSWORD=${GRAFANA_PASSWORD:-admin123}
GITBOOK_API_TOKEN=${GITBOOK_API_TOKEN}
T4G_CONTRACT_ADDRESS=${T4G_CONTRACT_ADDRESS}
ETHEREUM_PROVIDER_URL=${ETHEREUM_PROVIDER_URL}
T4G_PRIVATE_KEY=${T4G_PRIVATE_KEY}
JWT_SECRET=${JWT_SECRET}
ENCRYPTION_KEY=${ENCRYPTION_KEY}
EOF
        
        # Start services
        docker-compose down --remove-orphans
        docker-compose up -d
        
        # Wait for services to be ready
        log "Waiting for services to be ready..."
        sleep 30
        
        # Health checks
        check_service_health "http://localhost:3001/health" "Backend API"
        check_service_health "http://localhost:5432" "PostgreSQL" "nc -z localhost 5432"
        check_service_health "http://localhost:6379" "Redis" "nc -z localhost 6379"
        
        cd ../../..
        
    # Deploy with Kubernetes for production
    elif [[ "${ENVIRONMENT}" == "production" ]]; then
        log "Deploying with Kubernetes..."
        
        # Apply Kubernetes manifests
        kubectl apply -f src/infrastructure/k8s/ -n ${NAMESPACE}
        
        # Wait for rollout to complete
        kubectl rollout status deployment/daznode-backend -n ${NAMESPACE} --timeout=600s
        
        # Verify deployment
        kubectl get pods -n ${NAMESPACE}
        
    fi
    
    log "✅ Infrastructure deployment completed"
}

# Health check function
check_service_health() {
    local url=$1
    local service_name=$2
    local custom_check=$3
    
    log "Checking health of ${service_name}..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if [[ -n "$custom_check" ]]; then
            if eval "$custom_check" >/dev/null 2>&1; then
                log "✅ ${service_name} is healthy"
                return 0
            fi
        else
            if curl -f "$url" >/dev/null 2>&1; then
                log "✅ ${service_name} is healthy"
                return 0
            fi
        fi
        
        log "Attempt $attempt/$max_attempts - ${service_name} not ready, waiting..."
        sleep 10
        attempt=$((attempt + 1))
    done
    
    error "${service_name} failed health check after $max_attempts attempts"
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    if [[ "${ENVIRONMENT}" == "production" ]]; then
        # Run migrations in Kubernetes
        kubectl run migration-job \
            --image=${DOCKER_REGISTRY}/daznode-backend:${IMAGE_TAG} \
            --rm -i --restart=Never \
            --namespace=${NAMESPACE} \
            --command -- npm run migrate
    else
        # Run migrations locally
        docker exec daznode-backend npm run migrate
    fi
    
    log "✅ Database migrations completed"
}

# Setup monitoring
setup_monitoring() {
    log "Setting up monitoring and observability..."
    
    if [[ "${ENVIRONMENT}" == "production" ]]; then
        # Deploy monitoring stack with Helm
        helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
        helm repo add grafana https://grafana.github.io/helm-charts
        helm repo update
        
        # Install Prometheus
        helm upgrade --install prometheus prometheus-community/kube-prometheus-stack \
            --namespace monitoring \
            --create-namespace \
            --values src/infrastructure/monitoring/prometheus-values.yaml
        
        # Install Grafana dashboards
        kubectl apply -f src/infrastructure/monitoring/grafana/dashboards/ -n monitoring
        
    fi
    
    log "✅ Monitoring setup completed"
}

# Smoke tests
run_smoke_tests() {
    log "Running smoke tests..."
    
    local base_url
    if [[ "${ENVIRONMENT}" == "production" ]]; then
        base_url="https://api.dazno.de"
    else
        base_url="http://localhost:3001"
    fi
    
    # Test API health
    test_endpoint "${base_url}/health" "API Health Check"
    
    # Test GitBook integration
    test_endpoint "${base_url}/api/v1/gitbook/test" "GitBook Integration"
    
    # Test T4G service
    test_endpoint "${base_url}/api/v1/t4g/health" "T4G Service"
    
    # Test metrics endpoint
    test_endpoint "${base_url}/metrics" "Metrics Endpoint"
    
    log "✅ All smoke tests passed"
}

test_endpoint() {
    local url=$1
    local test_name=$2
    
    log "Testing: ${test_name}"
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    
    if [[ "$response" =~ ^[2-3][0-9][0-9]$ ]]; then
        log "✅ ${test_name} - HTTP $response"
    else
        error "❌ ${test_name} failed - HTTP $response"
    fi
}

# Rollback function
rollback_deployment() {
    warning "Rolling back deployment..."
    
    if [[ "${ENVIRONMENT}" == "production" ]]; then
        kubectl rollout undo deployment/daznode-backend -n ${NAMESPACE}
        kubectl rollout status deployment/daznode-backend -n ${NAMESPACE}
    else
        docker-compose down
        # Restore previous version logic here
    fi
    
    error "Deployment rolled back due to failure"
}

# Cleanup function
cleanup() {
    log "Performing cleanup..."
    
    # Remove temporary files
    rm -f .env
    
    # Clean up old Docker images (keep last 5 versions)
    docker images ${DOCKER_REGISTRY}/daznode-backend --format "table {{.Tag}}" | \
        tail -n +6 | xargs -r docker rmi ${DOCKER_REGISTRY}/daznode-backend: || true
    
    log "✅ Cleanup completed"
}

# Post-deployment tasks
post_deployment() {
    log "Running post-deployment tasks..."
    
    # Send deployment notification
    if [[ -n "${SLACK_WEBHOOK_URL}" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚀 Daznode GitBook Community Platform deployed successfully to ${ENVIRONMENT}\"}" \
            ${SLACK_WEBHOOK_URL}
    fi
    
    # Update external services
    log "Updating external service configurations..."
    
    # GitBook webhook configuration
    if [[ -n "${GITBOOK_API_TOKEN}" ]]; then
        log "Configuring GitBook webhooks..."
        # Configure GitBook webhooks to point to new deployment
    fi
    
    log "✅ Post-deployment tasks completed"
}

# Main deployment flow
main() {
    log "🚀 Starting deployment process..."
    
    # Trap errors and rollback
    trap rollback_deployment ERR
    
    check_prerequisites
    build_and_push_images
    setup_kubernetes
    deploy_infrastructure
    
    # Wait for infrastructure to be ready
    sleep 60
    
    run_migrations
    setup_monitoring
    run_smoke_tests
    post_deployment
    cleanup
    
    log "🎉 Deployment completed successfully!"
    log "📊 Monitoring: http://localhost:3000 (Grafana)"
    log "📈 Metrics: http://localhost:9090 (Prometheus)"
    log "🔍 Logs: http://localhost:5601 (Kibana)"
    
    if [[ "${ENVIRONMENT}" == "production" ]]; then
        log "🌐 Production API: https://api.dazno.de"
        log "📖 Documentation: https://docs.dazno.de"
    else
        log "🔧 Development API: http://localhost:3001"
    fi
}

# Script entry point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi