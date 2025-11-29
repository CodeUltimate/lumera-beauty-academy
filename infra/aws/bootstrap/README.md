# AWS Bootstrap - Security Foundation

This directory contains the Terraform configuration to set up the AWS security foundation. **Run this first** before
deploying any infrastructure.

## What This Creates

| Resource                 | Purpose                                                              |
|--------------------------|----------------------------------------------------------------------|
| GitHub OIDC Provider     | Allows GitHub Actions to authenticate without long-lived credentials |
| IAM Role                 | Restricted role for CI/CD with minimal permissions                   |
| IAM Policy               | Only allows ECR push, ECS deploy, and CloudWatch logs                |
| AWS Budget               | Alerts at 50%, 80%, 100% of monthly limit                            |
| CloudWatch Billing Alarm | Secondary alert at 80% of budget                                     |
| SNS Topic                | Email notifications for billing                                      |
| ECR Repositories         | Container registries for frontend/backend                            |

## Security Features

- **No long-lived credentials**: Uses OIDC tokens (short-lived, auto-rotating)
- **Minimal permissions**: CI/CD can only push images and deploy services
- **Branch restrictions**: Only `main` branch can trigger deployments
- **Cost protection**: Multiple alerts before hitting budget limit
- **Resource tagging**: All resources tagged for cost tracking

## Prerequisites

1. AWS CLI installed and configured with admin credentials
2. Terraform >= 1.0 installed
3. Your email address for billing alerts

## Quick Start

```bash
# 1. Navigate to this directory
cd infra/aws/bootstrap

# 2. Create your configuration
cp terraform.tfvars.example terraform.tfvars

# 3. Edit terraform.tfvars with your values
#    - github_org: Your GitHub username (CodeUltimate)
#    - alert_email: Your email for billing alerts
#    - monthly_budget_limit: Max monthly spend (default: $100)

# 4. Initialize Terraform
terraform init

# 5. Review the plan
terraform plan

# 6. Apply (type 'yes' when prompted)
terraform apply
```

## After Applying

1. **Copy the Role ARN** from the output
2. **Add GitHub Secret**:
    - Go to: https://github.com/CodeUltimate/lumera-beauty-academy/settings/secrets/actions
    - Click "New repository secret"
    - Name: `AWS_ROLE_ARN`
    - Value: (paste the Role ARN)

3. **Confirm Email Subscription**:
    - Check your email for AWS SNS confirmation
    - Click the confirmation link

4. **Deploy Infrastructure**:
   ```bash
   cd ../  # Back to infra/aws
   terraform init
   terraform apply
   ```

## Cost Estimates

This bootstrap creates minimal resources with negligible cost:

- OIDC Provider: Free
- IAM Role/Policy: Free
- Budget: Free
- SNS Topic: ~$0.50/month
- ECR Repositories: ~$0.10/GB/month (first 500MB free)

## Cleanup

To destroy the bootstrap resources:

```bash
terraform destroy
```

**Warning**: This will remove the GitHub OIDC trust, breaking CI/CD authentication.

## Troubleshooting

### "Error: creating IAM OIDC Provider: already exists"

The OIDC provider already exists. Import it:

```bash
terraform import aws_iam_openid_connect_provider.github arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com
```

### GitHub Actions fails with "Could not assume role"

1. Verify the Role ARN is correct in GitHub Secrets
2. Check that you're pushing to the `main` branch
3. Verify the trust policy includes your repo

### Budget alerts not arriving

1. Confirm the SNS subscription (check spam folder)
2. Billing metrics can take up to 24 hours to appear
3. Ensure billing alerts are enabled in AWS Billing preferences
