# =============================================================================
# AWS Security Foundation for Lumera Beauty Academy
# =============================================================================
# This module sets up:
# 1. GitHub OIDC Provider (no long-lived credentials)
# 2. Restricted IAM Role for CI/CD
# 3. Budget alerts to prevent surprise bills
# 4. CloudWatch billing alarms
# =============================================================================

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = "~> 5.0"
      configuration_aliases = [aws.us_east_1]
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

variable "github_org" {
  description = "GitHub organization or username"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}

variable "allowed_branches" {
  description = "List of branches allowed to assume the role"
  type = list(string)
  default = ["main"]
}

variable "monthly_budget_limit" {
  description = "Monthly budget limit in USD"
  type        = number
  default     = 100
}

variable "alert_email" {
  description = "Email address for budget and billing alerts"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-1"
}

# -----------------------------------------------------------------------------
# Data Sources
# -----------------------------------------------------------------------------

data "aws_caller_identity" "current" {}

data "aws_partition" "current" {}

# -----------------------------------------------------------------------------
# GitHub OIDC Provider
# -----------------------------------------------------------------------------
# This allows GitHub Actions to authenticate with AWS without storing
# long-lived credentials. GitHub provides a signed JWT token that AWS trusts.

resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = ["sts.amazonaws.com"]

  # GitHub's OIDC thumbprint - this is GitHub's certificate thumbprint
  # It rarely changes, but AWS now validates this automatically
  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd"
  ]

  tags = {
    Name        = "${var.project_name}-github-oidc"
    Project     = var.project_name
    Environment = var.environment
  }
}

# -----------------------------------------------------------------------------
# IAM Role for GitHub Actions
# -----------------------------------------------------------------------------
# This role can only be assumed by GitHub Actions from the specified repo/branches

resource "aws_iam_role" "github_actions" {
  name = "${var.project_name}-github-actions-${var.environment}"
  description = "Role for GitHub Actions CI/CD - ${var.project_name} ${var.environment}"

  # Trust policy - only allow GitHub Actions from specific repo/branches
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            # Only allow specific repo and branches
            "token.actions.githubusercontent.com:sub" = [
              for branch in var.allowed_branches :
              "repo:${var.github_org}/${var.github_repo}:ref:refs/heads/${branch}"
            ]
          }
        }
      }
    ]
  })

  # Limit session duration to 1 hour (minimum needed for deployments)
  max_session_duration = 3600

  tags = {
    Name        = "${var.project_name}-github-actions-${var.environment}"
    Project     = var.project_name
    Environment = var.environment
    Purpose     = "CI/CD"
  }
}

# -----------------------------------------------------------------------------
# Minimal IAM Policy for CI/CD
# -----------------------------------------------------------------------------
# Only allows exactly what's needed - nothing more

resource "aws_iam_policy" "github_actions_cicd" {
  name        = "${var.project_name}-github-actions-cicd-${var.environment}"
  description = "Minimal permissions for CI/CD deployments"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # ECR - Push/pull images only
      {
        Sid    = "ECRAuth"
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      },
      {
        Sid    = "ECRPushPull"
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:BatchGetImage",
          "ecr:CompleteLayerUpload",
          "ecr:DescribeImages",
          "ecr:DescribeRepositories",
          "ecr:GetDownloadUrlForLayer",
          "ecr:InitiateLayerUpload",
          "ecr:ListImages",
          "ecr:PutImage",
          "ecr:UploadLayerPart"
        ]
        Resource = [
          "arn:${data.aws_partition.current.partition}:ecr:${var.aws_region}:${data.aws_caller_identity.current.account_id}:repository/${var.project_name}-*"
        ]
      },
      # ECS - Deploy services only (no cluster modification)
      {
        Sid    = "ECSDeployServices"
        Effect = "Allow"
        Action = [
          "ecs:DescribeServices",
          "ecs:DescribeTaskDefinition",
          "ecs:DescribeTasks",
          "ecs:ListTasks",
          "ecs:RegisterTaskDefinition",
          "ecs:UpdateService"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "ecs:cluster" = "arn:${data.aws_partition.current.partition}:ecs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:cluster/${var.project_name}-${var.environment}"
          }
        }
      },
      {
        Sid    = "ECSDescribeClusters"
        Effect = "Allow"
        Action = [
          "ecs:DescribeClusters"
        ]
        Resource = [
          "arn:${data.aws_partition.current.partition}:ecs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:cluster/${var.project_name}-${var.environment}"
        ]
      },
      {
        Sid    = "ECSTaskDefinitions"
        Effect = "Allow"
        Action = [
          "ecs:DescribeTaskDefinition",
          "ecs:RegisterTaskDefinition"
        ]
        Resource = "*"
      },
      # IAM - Pass role to ECS only (required for task execution)
      {
        Sid    = "IAMPassRole"
        Effect = "Allow"
        Action = [
          "iam:PassRole"
        ]
        Resource = [
          "arn:${data.aws_partition.current.partition}:iam::${data.aws_caller_identity.current.account_id}:role/${var.project_name}-*"
        ]
        Condition = {
          StringEquals = {
            "iam:PassedToService" = "ecs-tasks.amazonaws.com"
          }
        }
      },
      # CloudWatch Logs - View logs only (for deployment verification)
      {
        Sid    = "CloudWatchLogs"
        Effect = "Allow"
        Action = [
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams",
          "logs:GetLogEvents"
        ]
        Resource = [
          "arn:${data.aws_partition.current.partition}:logs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:log-group:/ecs/${var.project_name}-*"
        ]
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-github-actions-cicd-${var.environment}"
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "github_actions_cicd" {
  role       = aws_iam_role.github_actions.name
  policy_arn = aws_iam_policy.github_actions_cicd.arn
}

# -----------------------------------------------------------------------------
# AWS Budget - Monthly Spending Limit
# -----------------------------------------------------------------------------

resource "aws_budgets_budget" "monthly" {
  name         = "${var.project_name}-${var.environment}-monthly-budget"
  budget_type  = "COST"
  limit_amount = var.monthly_budget_limit
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  # Alert at 50%, 80%, and 100% of budget
  notification {
    comparison_operator = "GREATER_THAN"
    threshold           = 50
    threshold_type      = "PERCENTAGE"
    notification_type   = "ACTUAL"
    subscriber_email_addresses = [var.alert_email]
  }

  notification {
    comparison_operator = "GREATER_THAN"
    threshold           = 80
    threshold_type      = "PERCENTAGE"
    notification_type   = "ACTUAL"
    subscriber_email_addresses = [var.alert_email]
  }

  notification {
    comparison_operator = "GREATER_THAN"
    threshold           = 100
    threshold_type      = "PERCENTAGE"
    notification_type   = "ACTUAL"
    subscriber_email_addresses = [var.alert_email]
  }

  # Also alert on forecasted overspend
  notification {
    comparison_operator = "GREATER_THAN"
    threshold           = 100
    threshold_type      = "PERCENTAGE"
    notification_type   = "FORECASTED"
    subscriber_email_addresses = [var.alert_email]
  }

  # Filter to only track this project's costs
  cost_filter {
    name = "TagKeyValue"
    values = ["user:Project$${var.project_name}"]
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-monthly-budget"
    Project     = var.project_name
    Environment = var.environment
  }
}

# -----------------------------------------------------------------------------
# CloudWatch Billing Alarm (Additional Safety Net)
# -----------------------------------------------------------------------------
# Note: Billing metrics are only available in us-east-1

resource "aws_cloudwatch_metric_alarm" "billing_alarm" {
  provider = aws.us_east_1

  alarm_name          = "${var.project_name}-billing-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "EstimatedCharges"
  namespace           = "AWS/Billing"
  period = 21600 # 6 hours
  statistic           = "Maximum"
  threshold = var.monthly_budget_limit * 0.8 # Alert at 80%
  alarm_description   = "Billing alarm when charges exceed 80% of ${var.monthly_budget_limit} USD"

  dimensions = {
    Currency = "USD"
  }

  alarm_actions = [aws_sns_topic.billing_alerts.arn]
  ok_actions = [aws_sns_topic.billing_alerts.arn]

  tags = {
    Name        = "${var.project_name}-billing-alarm"
    Project     = var.project_name
    Environment = var.environment
  }
}

# SNS Topic for billing alerts (must be in us-east-1)
resource "aws_sns_topic" "billing_alerts" {
  provider = aws.us_east_1

  name = "${var.project_name}-billing-alerts"

  tags = {
    Name        = "${var.project_name}-billing-alerts"
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_sns_topic_subscription" "billing_alerts_email" {
  provider = aws.us_east_1

  topic_arn = aws_sns_topic.billing_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# -----------------------------------------------------------------------------
# Outputs
# -----------------------------------------------------------------------------

output "github_actions_role_arn" {
  description = "ARN of the IAM role for GitHub Actions"
  value       = aws_iam_role.github_actions.arn
}

output "github_oidc_provider_arn" {
  description = "ARN of the GitHub OIDC provider"
  value       = aws_iam_openid_connect_provider.github.arn
}

output "monthly_budget_id" {
  description = "ID of the monthly budget"
  value       = aws_budgets_budget.monthly.id
}

output "setup_instructions" {
  description = "Next steps after applying this module"
  value       = <<-EOT

    ============================================================
    SECURITY FOUNDATION SETUP COMPLETE
    ============================================================

    GitHub Actions Role ARN: ${aws_iam_role.github_actions.arn}

    NEXT STEPS:

    1. Add this secret to your GitHub repository:
       - Go to: https://github.com/${var.github_org}/${var.github_repo}/settings/secrets/actions
       - Add secret: AWS_ROLE_ARN = ${aws_iam_role.github_actions.arn}

    2. Confirm the SNS subscription:
       - Check your email (${var.alert_email}) for AWS SNS confirmation
       - Click the confirmation link to receive billing alerts

    3. Enable MFA on your AWS root account if not already done

    4. Budget alerts are set at: $${var.monthly_budget_limit * 0.5}, $${var.monthly_budget_limit * 0.8}, $${var.monthly_budget_limit}

    ============================================================
  EOT
}
