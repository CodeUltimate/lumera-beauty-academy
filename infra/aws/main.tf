# Lumera Beauty Academy - AWS ECS Infrastructure
# This Terraform configuration sets up the staging environment on AWS ECS

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
    key            = "staging/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "lumera-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "lumera-beauty-academy"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "staging"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}

variable "keycloak_admin_password" {
  description = "Keycloak admin password"
  type        = string
  sensitive   = true
  default     = "admin"  # Change in production
}

variable "keycloak_db_password" {
  description = "Keycloak database password"
  type        = string
  sensitive   = true
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# VPC
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "lumera-${var.environment}-vpc"
  cidr = "10.0.0.0/16"

  azs             = slice(data.aws_availability_zones.available.names, 0, 2)
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway     = true
  single_nat_gateway     = true # Cost optimization for staging
  enable_dns_hostnames   = true
  enable_dns_support     = true

  tags = {
    Name = "lumera-${var.environment}-vpc"
  }
}

# ECR Repositories - Created in bootstrap, reference them here
data "aws_ecr_repository" "frontend" {
  name = "lumera-frontend"
}

data "aws_ecr_repository" "backend" {
  name = "lumera-backend"
}

data "aws_ecr_repository" "keycloak" {
  name = "lumera-keycloak"
}

# Security Groups
resource "aws_security_group" "alb" {
  name        = "lumera-${var.environment}-alb-sg"
  description = "Security group for ALB"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ecs_tasks" {
  name        = "lumera-${var.environment}-ecs-tasks-sg"
  description = "Security group for ECS tasks"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  # Keycloak port
  ingress {
    from_port       = 8180
    to_port         = 8180
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "rds" {
  name        = "lumera-${var.environment}-rds-sg"
  description = "Security group for RDS"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }
}

# RDS PostgreSQL
resource "aws_db_subnet_group" "main" {
  name       = "lumera-${var.environment}-db-subnet"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_db_instance" "postgres" {
  identifier        = "lumera-${var.environment}-db"
  engine            = "postgres"
  engine_version    = "16.11"
  instance_class    = "db.t3.micro" # Staging - upgrade for production
  allocated_storage = 20

  db_name  = "lumera_academy"
  username = "lumera_admin"
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  skip_final_snapshot = true # Set to false for production
  multi_az            = false # Set to true for production

  backup_retention_period = 1  # Free tier limit
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"
}

# Keycloak PostgreSQL Database
resource "aws_db_instance" "keycloak" {
  identifier        = "lumera-${var.environment}-keycloak-db"
  engine            = "postgres"
  engine_version    = "16.11"
  instance_class    = "db.t3.micro"
  allocated_storage = 20

  db_name  = "keycloak"
  username = "keycloak_admin"
  password = var.keycloak_db_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  skip_final_snapshot = true
  multi_az            = false

  backup_retention_period = 1
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"
}

# ElastiCache Redis
resource "aws_elasticache_subnet_group" "main" {
  name       = "lumera-${var.environment}-redis-subnet"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_security_group" "redis" {
  name        = "lumera-${var.environment}-redis-sg"
  description = "Security group for Redis"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "lumera-${var.environment}-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro" # Staging - upgrade for production
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "lumera-${var.environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE_SPOT" # Cost optimization for staging
  }
}

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_task_execution" {
  name = "lumera-${var.environment}-ecs-task-execution"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# IAM Role for ECS Tasks
resource "aws_iam_role" "ecs_task" {
  name = "lumera-${var.environment}-ecs-task"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/ecs/lumera-${var.environment}-frontend"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/lumera-${var.environment}-backend"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "keycloak" {
  name              = "/ecs/lumera-${var.environment}-keycloak"
  retention_in_days = 14
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "lumera-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.public_subnets

  enable_deletion_protection = false # Set to true for production
}

resource "aws_lb_target_group" "frontend" {
  name        = "lumera-${var.environment}-frontend-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    path                = "/"
    matcher             = "200"
  }
}

resource "aws_lb_target_group" "backend" {
  name        = "lumera-${var.environment}-backend-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    path                = "/api/actuator/health"
    matcher             = "200"
  }
}

resource "aws_lb_target_group" "keycloak" {
  name        = "lumera-${var.environment}-keycloak-tg"
  port        = 8180
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    path                = "/health/ready"
    matcher             = "200"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  # Default action: forward to frontend
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

# Route /api/* requests to backend
resource "aws_lb_listener_rule" "backend_api" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

# Route /auth/* requests to Keycloak (for realms, admin, etc.)
resource "aws_lb_listener_rule" "keycloak_auth" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 90

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.keycloak.arn
  }

  condition {
    path_pattern {
      values = ["/auth/*", "/realms/*", "/admin/*", "/resources/*", "/health/*"]
    }
  }
}

# Note: For HTTPS, you'll need to add an ACM certificate
# resource "aws_lb_listener" "https" {
#   load_balancer_arn = aws_lb.main.arn
#   port              = 443
#   protocol          = "HTTPS"
#   ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
#   certificate_arn   = aws_acm_certificate.main.arn
#
#   default_action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.frontend.arn
#   }
# }

# ECS Task Definitions
resource "aws_ecs_task_definition" "frontend" {
  family                   = "lumera-frontend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([{
    name  = "frontend"
    image = "${data.aws_ecr_repository.frontend.repository_url}:latest"

    portMappings = [{
      containerPort = 3000
      hostPort      = 3000
      protocol      = "tcp"
    }]

    environment = [
      { name = "NEXT_PUBLIC_API_URL", value = "http://${aws_lb.main.dns_name}/api" }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.frontend.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "frontend"
      }
    }

    healthCheck = {
      command     = ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1"]
      interval    = 30
      timeout     = 10
      retries     = 5
      startPeriod = 120
    }
  }])
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "lumera-backend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([{
    name  = "backend"
    image = "${data.aws_ecr_repository.backend.repository_url}:latest"

    portMappings = [{
      containerPort = 8080
      hostPort      = 8080
      protocol      = "tcp"
    }]

    environment = [
      { name = "SPRING_PROFILES_ACTIVE", value = "prod" },
      { name = "DB_HOST", value = aws_db_instance.postgres.address },
      { name = "DB_PORT", value = "5432" },
      { name = "DB_NAME", value = "lumera_academy" },
      { name = "DB_USERNAME", value = "lumera_admin" },
      { name = "REDIS_HOST", value = aws_elasticache_cluster.redis.cache_nodes[0].address },
      { name = "REDIS_PORT", value = "6379" },
      { name = "CORS_ORIGINS", value = "http://${aws_lb.main.dns_name}" },
      { name = "APP_FRONTEND_URL", value = "http://${aws_lb.main.dns_name}" },
      { name = "APP_AUTH_ENABLED", value = "true" },
      { name = "KEYCLOAK_URL", value = "http://${aws_lb.main.dns_name}" },
      { name = "KEYCLOAK_EXTERNAL_URL", value = "http://${aws_lb.main.dns_name}" },
      { name = "KEYCLOAK_REALM", value = "lumera" },
      { name = "KEYCLOAK_CLIENT_ID", value = "lumera-backend" },
      { name = "KEYCLOAK_CLIENT_SECRET", value = "backend-secret" },
      { name = "KEYCLOAK_FRONTEND_CLIENT_ID", value = "lumera-frontend" },
      { name = "KEYCLOAK_REDIRECT_URI", value = "http://${aws_lb.main.dns_name}/api/v1/auth/callback" },
      { name = "SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI", value = "http://${aws_lb.main.dns_name}/realms/lumera" }
    ]

    secrets = [
      { name = "DB_PASSWORD", valueFrom = "${aws_secretsmanager_secret.db_password.arn}" },
      { name = "JWT_SECRET", valueFrom = "${aws_secretsmanager_secret.jwt_secret.arn}" }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.backend.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "backend"
      }
    }

    healthCheck = {
      command     = ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:8080/api/actuator/health || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 120
    }
  }])
}

resource "aws_ecs_task_definition" "keycloak" {
  family                   = "lumera-keycloak-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([{
    name  = "keycloak"
    image = "${data.aws_ecr_repository.keycloak.repository_url}:latest"

    portMappings = [{
      containerPort = 8180
      hostPort      = 8180
      protocol      = "tcp"
    }]

    environment = [
      { name = "PORT", value = "8180" },
      { name = "KC_DB", value = "postgres" },
      { name = "KC_DB_URL", value = "jdbc:postgresql://${aws_db_instance.keycloak.address}:5432/keycloak" },
      { name = "KC_DB_USERNAME", value = "keycloak_admin" },
      { name = "KC_DB_SCHEMA", value = "public" },
      { name = "KEYCLOAK_ADMIN", value = "admin" },
      { name = "KC_HOSTNAME_STRICT", value = "false" },
      { name = "KC_HTTP_ENABLED", value = "true" },
      { name = "KC_PROXY", value = "edge" },
      { name = "KC_HEALTH_ENABLED", value = "true" },
      { name = "KC_METRICS_ENABLED", value = "true" },
      { name = "FRONTEND_URL", value = "http://${aws_lb.main.dns_name}" }
    ]

    secrets = [
      { name = "KC_DB_PASSWORD", valueFrom = "${aws_secretsmanager_secret.keycloak_db_password.arn}" },
      { name = "KEYCLOAK_ADMIN_PASSWORD", valueFrom = "${aws_secretsmanager_secret.keycloak_admin_password.arn}" }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.keycloak.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "keycloak"
      }
    }

    # ALB handles health checks; container health check disabled as Keycloak image lacks curl/wget
    healthCheck = {
      command     = ["CMD-SHELL", "exit 0"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 120
    }
  }])
}

# Secrets Manager
resource "aws_secretsmanager_secret" "db_password" {
  name = "lumera-${var.environment}-db-password"
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = var.db_password
}

resource "aws_secretsmanager_secret" "jwt_secret" {
  name = "lumera-${var.environment}-jwt-secret"
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id     = aws_secretsmanager_secret.jwt_secret.id
  secret_string = var.jwt_secret
}

resource "aws_secretsmanager_secret" "keycloak_admin_password" {
  name = "lumera-${var.environment}-keycloak-admin-password"
}

resource "aws_secretsmanager_secret_version" "keycloak_admin_password" {
  secret_id     = aws_secretsmanager_secret.keycloak_admin_password.id
  secret_string = var.keycloak_admin_password
}

resource "aws_secretsmanager_secret" "keycloak_db_password" {
  name = "lumera-${var.environment}-keycloak-db-password"
}

resource "aws_secretsmanager_secret_version" "keycloak_db_password" {
  secret_id     = aws_secretsmanager_secret.keycloak_db_password.id
  secret_string = var.keycloak_db_password
}

# IAM policy for secrets access
resource "aws_iam_role_policy" "ecs_task_execution_secrets" {
  name = "lumera-${var.environment}-secrets-access"
  role = aws_iam_role.ecs_task_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "secretsmanager:GetSecretValue"
      ]
      Resource = [
        aws_secretsmanager_secret.db_password.arn,
        aws_secretsmanager_secret.jwt_secret.arn,
        aws_secretsmanager_secret.keycloak_admin_password.arn,
        aws_secretsmanager_secret.keycloak_db_password.arn
      ]
    }]
  })
}

# ECS Services
resource "aws_ecs_service" "frontend" {
  name            = "lumera-frontend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend.arn
    container_name   = "frontend"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.http]
}

resource "aws_ecs_service" "backend" {
  name            = "lumera-backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = 8080
  }

  depends_on = [aws_lb_listener.http, aws_lb_listener_rule.backend_api, aws_db_instance.postgres]
}

resource "aws_ecs_service" "keycloak" {
  name            = "lumera-keycloak-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.keycloak.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.keycloak.arn
    container_name   = "keycloak"
    container_port   = 8180
  }

  depends_on = [aws_lb_listener.http, aws_lb_listener_rule.keycloak_auth, aws_db_instance.postgres]
}

# Outputs
output "ecr_frontend_url" {
  value       = data.aws_ecr_repository.frontend.repository_url
  description = "ECR repository URL for frontend"
}

output "ecr_backend_url" {
  value       = data.aws_ecr_repository.backend.repository_url
  description = "ECR repository URL for backend"
}

output "alb_dns_name" {
  value       = aws_lb.main.dns_name
  description = "ALB DNS name"
}

output "rds_endpoint" {
  value       = aws_db_instance.postgres.endpoint
  description = "RDS endpoint"
}

output "keycloak_rds_endpoint" {
  value       = aws_db_instance.keycloak.endpoint
  description = "Keycloak RDS endpoint"
}

output "redis_endpoint" {
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
  description = "Redis endpoint"
}

output "ecs_cluster_name" {
  value       = aws_ecs_cluster.main.name
  description = "ECS cluster name"
}
