# =============================================================================
# AWS Bootstrap Configuration - Run This First!
# =============================================================================
# This sets up the security foundation before any infrastructure:
# - GitHub OIDC authentication (no long-lived credentials)
# - Restricted IAM role for CI/CD
# - Budget alerts to prevent surprise bills
# - Billing alarms as safety net
# =============================================================================

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "lumera-terraform-state"
    key            = "bootstrap/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "lumera-terraform-locks"
    encrypt        = true
  }
}

# -----------------------------------------------------------------------------
# Provider Configuration
# -----------------------------------------------------------------------------

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
      Component   = "bootstrap"
    }
  }
}

# Billing alarms must be in us-east-1
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
      Component   = "bootstrap"
    }
  }
}

# -----------------------------------------------------------------------------
# Variables
# -----------------------------------------------------------------------------

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "lumera"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "staging"
}

variable "aws_region" {
  description = "AWS region for main resources"
  type        = string
  default     = "eu-west-1"
}

variable "github_org" {
  description = "GitHub organization or username"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "lumera-beauty-academy"
}

variable "monthly_budget_limit" {
  description = "Monthly budget limit in USD"
  type        = number
  default     = 100
}

variable "alert_email" {
  description = "Email for budget and billing alerts"
  type        = string
}

# -----------------------------------------------------------------------------
# Security Module
# -----------------------------------------------------------------------------

module "security" {
  source = "../modules/security"

  project_name         = var.project_name
  environment          = var.environment
  aws_region           = var.aws_region
  github_org           = var.github_org
  github_repo          = var.github_repo
  monthly_budget_limit = var.monthly_budget_limit
  alert_email = var.alert_email

  # Only main branch can deploy to staging
  allowed_branches = ["main"]

  providers = {
    aws           = aws
    aws.us_east_1 = aws.us_east_1
  }
}

# -----------------------------------------------------------------------------
# ECR Repositories (Created here so they exist before first deploy)
# -----------------------------------------------------------------------------

resource "aws_ecr_repository" "frontend" {
  name                 = "${var.project_name}-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Name = "${var.project_name}-frontend"
  }
}

resource "aws_ecr_repository" "backend" {
  name                 = "${var.project_name}-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Name = "${var.project_name}-backend"
  }
}

# Lifecycle policy to limit stored images (cost control)
resource "aws_ecr_lifecycle_policy" "frontend" {
  repository = aws_ecr_repository.frontend.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep only last 5 images"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 5
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

resource "aws_ecr_lifecycle_policy" "backend" {
  repository = aws_ecr_repository.backend.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep only last 5 images"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 5
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# -----------------------------------------------------------------------------
# Outputs
# -----------------------------------------------------------------------------

output "github_actions_role_arn" {
  description = "ARN of the IAM role for GitHub Actions - add this to GitHub Secrets"
  value       = module.security.github_actions_role_arn
}

output "ecr_frontend_url" {
  description = "ECR repository URL for frontend"
  value       = aws_ecr_repository.frontend.repository_url
}

output "ecr_backend_url" {
  description = "ECR repository URL for backend"
  value       = aws_ecr_repository.backend.repository_url
}

output "next_steps" {
  description = "Instructions after bootstrap"
  value       = <<-EOT

    ============================================================
    BOOTSTRAP COMPLETE - NEXT STEPS
    ============================================================

    1. ADD GITHUB SECRET:
       Repository: https://github.com/${var.github_org}/${var.github_repo}/settings/secrets/actions

       Secret Name: AWS_ROLE_ARN
       Secret Value: ${module.security.github_actions_role_arn}

    2. CONFIRM EMAIL SUBSCRIPTION:
       Check ${var.alert_email} for AWS SNS confirmation email
       Click the link to receive billing alerts

    3. VERIFY BUDGET:
       AWS Console > Billing > Budgets
       You should see: ${var.project_name}-${var.environment}-monthly-budget

    4. NEXT: DEPLOY INFRASTRUCTURE
       cd ../
       terraform init
       terraform apply

    ============================================================
    ECR Repositories Created:
    - Frontend: ${aws_ecr_repository.frontend.repository_url}
    - Backend: ${aws_ecr_repository.backend.repository_url}
    ============================================================
  EOT
}
