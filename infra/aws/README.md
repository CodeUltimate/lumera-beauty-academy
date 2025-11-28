# AWS ECS Infrastructure Setup

This guide walks you through setting up the Lumera Beauty Academy staging environment on AWS ECS.

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Terraform** >= 1.0 installed
4. **GitHub Repository** secrets configured

## Quick Start

### 1. Configure AWS CLI

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: eu-west-1 (or your preferred region)
# Default output format: json
```

### 2. Set Up Terraform Variables

Create a `terraform.tfvars` file (DO NOT commit this file):

```hcl
aws_region  = "eu-west-1"
environment = "staging"
db_password = "your-secure-database-password"
jwt_secret  = "your-256-bit-jwt-secret-key"
```

### 3. Initialize and Apply Terraform

```bash
cd infra/aws

# Initialize Terraform
terraform init

# Review the plan
terraform plan

# Apply the infrastructure
terraform apply
```

### 4. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these repository secrets:

| Secret Name | Description |
|-------------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM user secret key |
| `AWS_ACCOUNT_ID` | Your AWS account ID (12 digits) |
| `AWS_REGION` | AWS region (e.g., `eu-west-1`) |

### 5. Create GitHub Environment

1. Go to Settings → Environments → New environment
2. Name it `staging`
3. (Optional) Add protection rules like required reviewers

### 6. Push Initial Images

Before the first deployment, push initial images to ECR:

```bash
# Login to ECR
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com

# Build and push frontend
cd services/frontend
docker build -t lumera-frontend .
docker tag lumera-frontend:latest YOUR_ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com/lumera-frontend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com/lumera-frontend:latest

# Build and push backend
cd ../backend
docker build -t lumera-backend .
docker tag lumera-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com/lumera-backend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com/lumera-backend:latest
```

## Infrastructure Components

| Component | Service | Staging Spec |
|-----------|---------|--------------|
| Compute | ECS Fargate | 256 CPU / 512MB (frontend), 512 CPU / 1GB (backend) |
| Database | RDS PostgreSQL 16 | db.t3.micro |
| Cache | ElastiCache Redis 7 | cache.t3.micro |
| Load Balancer | Application LB | Shared |
| Container Registry | ECR | 2 repositories |

## Cost Estimate (Staging)

Approximate monthly cost for staging environment:
- ECS Fargate (Spot): ~$15-20
- RDS PostgreSQL: ~$15
- ElastiCache Redis: ~$12
- ALB: ~$20
- NAT Gateway: ~$35
- **Total: ~$100-120/month**

## Domain Setup (Optional)

To use custom domains:

1. Register domain in Route 53 or transfer DNS
2. Request ACM certificate:
   ```bash
   aws acm request-certificate \
     --domain-name staging.lumera.academy \
     --subject-alternative-names api.staging.lumera.academy \
     --validation-method DNS
   ```
3. Validate the certificate via DNS
4. Uncomment the HTTPS listener in `main.tf`
5. Create Route 53 records pointing to ALB

## Monitoring

- **CloudWatch Logs**: `/ecs/lumera-staging-frontend` and `/ecs/lumera-staging-backend`
- **Container Insights**: Enabled on ECS cluster
- **Health Checks**: Configured for both services

## Troubleshooting

### View ECS Service Logs
```bash
aws logs tail /ecs/lumera-staging-backend --follow
aws logs tail /ecs/lumera-staging-frontend --follow
```

### Check ECS Service Status
```bash
aws ecs describe-services \
  --cluster lumera-staging \
  --services lumera-frontend-service lumera-backend-service
```

### Force New Deployment
```bash
aws ecs update-service \
  --cluster lumera-staging \
  --service lumera-backend-service \
  --force-new-deployment
```

## Cleanup

To destroy all resources:

```bash
cd infra/aws
terraform destroy
```

**Warning**: This will delete all data including the database!
