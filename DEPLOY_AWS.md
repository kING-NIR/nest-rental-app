# Deployment Guide - AWS

Deploy the Nest Rental app to AWS using EC2, RDS, and S3.

## Prerequisites

- AWS account (free tier eligible)
- AWS CLI installed: `https://aws.amazon.com/cli/`
- Terraform installed (optional, for IaC)

## Architecture

```
┌─────────────────────────────────────────┐
│         Route 53 (Domain)               │
└────────────────┬────────────────────────┘
                 │
         ┌───────▼────────┐
         │   CloudFront   │
         │   (Frontend)   │
         └───────┬────────┘
                 │
         ┌───────▼─────────────┐
         │  S3 (Static Files)  │
         └─────────────────────┘
         
         ┌───────────────────────┐
         │   ALB (Load Balancer) │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │  EC2 (Backend API)    │
         └───────────┬───────────┘
                     │
         ┌───────────▼──────────────┐
         │  RDS MongoDB Atlas       │
         │  (Managed Database)      │
         └──────────────────────────┘
```

## Step 1: Create EC2 Instance

```bash
# Create security group
aws ec2 create-security-group \
  --group-name nest-rental-api-sg \
  --description "Nest Rental API security group"

# Add inbound rules
aws ec2 authorize-security-group-ingress \
  --group-name nest-rental-api-sg \
  --protocol tcp --port 80 --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-name nest-rental-api-sg \
  --protocol tcp --port 443 --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-name nest-rental-api-sg \
  --protocol tcp --port 5000 --cidr 0.0.0.0/0

# Launch EC2 instance (t3.micro free tier eligible)
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --instance-type t3.micro \
  --security-groups nest-rental-api-sg \
  --key-name nest-rental-key \
  --user-data file://install-backend.sh
```

## Step 2: Setup Backend on EC2

Create `install-backend.sh`:

```bash
#!/bin/bash
sudo yum update -y
sudo yum install -y nodejs npm git

cd /home/ec2-user
git clone https://github.com/<your-username>/nest-rental-app.git
cd nest-rental-app/backend

npm install
npm run build

# Create .env file
cat > .env <<EOF
PORT=5000
NODE_ENV=production
MONGODB_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<your-secret-key>
CORS_ORIGIN=https://yourdomain.com
EOF

# Start application with PM2
npm install -g pm2
pm2 start dist/server.js --name "nest-rental-api"
pm2 startup
pm2 save
```

## Step 3: Create S3 Bucket for Frontend

```bash
# Create S3 bucket
aws s3 mb s3://nest-rental-web-${AWS_ACCOUNT_ID}

# Enable public access for static website
aws s3api put-bucket-policy \
  --bucket nest-rental-web-${AWS_ACCOUNT_ID} \
  --policy file://bucket-policy.json

# Upload frontend build
aws s3 sync frontend/build/ s3://nest-rental-web-${AWS_ACCOUNT_ID}/
```

Create `bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::nest-rental-web-*/*"
  }]
}
```

## Step 4: Setup CloudFront Distribution

```bash
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

## Step 5: Setup Application Load Balancer

```bash
aws elbv2 create-load-balancer \
  --name nest-rental-alb \
  --subnets subnet-12345678 subnet-87654321 \
  --security-groups nest-rental-api-sg
```

## Step 6: Configure Route 53

```bash
aws route53 create-hosted-zone \
  --name yourdomain.com \
  --caller-reference $(date +%s)

# Create A record for API
aws route53 change-resource-record-sets \
  --hosted-zone-id ZONE_ID \
  --change-batch file://dns-records.json
```

## Step 7: Enable SSL/TLS with ACM

```bash
aws acm request-certificate \
  --domain-name yourdomain.com \
  --subject-alternative-names api.yourdomain.com \
  --validation-method DNS
```

## Step 8: Setup RDS (Alternative to MongoDB Atlas)

```bash
aws rds create-db-instance \
  --db-instance-identifier nest-rental-db \
  --db-instance-class db.t3.micro \
  --engine docdb \
  --master-username admin \
  --master-user-password <secure-password> \
  --allocated-storage 20
```

## Step 9: Configure Backups and Auto-Scaling

```bash
# Setup RDS automated backups
aws rds modify-db-instance \
  --db-instance-identifier nest-rental-db \
  --backup-retention-period 30 \
  --preferred-backup-window "03:00-04:00"

# Enable multi-AZ for high availability
aws rds modify-db-instance \
  --db-instance-identifier nest-rental-db \
  --multi-az
```

## Step 10: Setup CloudWatch Monitoring

```bash
# Create SNS topic for alerts
aws sns create-topic --name nest-rental-alerts

# Create CloudWatch alarm
aws cloudwatch put-metric-alarm \
  --alarm-name nest-rental-api-cpu \
  --alarm-description "Alert when API CPU exceeds 80%" \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

## Cost Estimation

- EC2 t3.micro: Free tier (1 year)
- RDS db.t3.micro: Free tier (1 year)  
- S3 storage: ~$0.50-1/month
- Data transfer: Varies
- Route 53: $0.50 + queries
- CloudFront: ~$0.12 per GB
- Total after free tier: ~$50-100/month

## Deployment with Terraform

```hcl
# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
}

# EC2 Instance
resource "aws_instance" "backend" {
  ami           = "ami-0c02fb55956c7d316"
  instance_type = "t3.micro"
  key_name      = "nest-rental-key"

  vpc_security_group_ids = [aws_security_group.api.id]

  user_data = file("install-backend.sh")

  tags = {
    Name = "nest-rental-backend"
  }
}

# S3 Bucket
resource "aws_s3_bucket" "frontend" {
  bucket = "nest-rental-web-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name = "nest-rental-frontend"
  }
}

# Security Group
resource "aws_security_group" "api" {
  name        = "nest-rental-api-sg"
  description = "Security group for Nest Rental API"
  vpc_id      = aws_vpc.main.id

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

  ingress {
    from_port   = 5000
    to_port     = 5000
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

data "aws_caller_identity" "current" {}
```

## Deployment Script

```bash
#!/bin/bash

# Deploy backend
cd backend
npm run build
scp -r dist/* ec2-user@api.yourdomain.com:/home/ec2-user/app/

# Deploy frontend
cd ../frontend
npm run build
aws s3 sync build/ s3://nest-rental-web/

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

## Next Steps

1. Configure custom domain with SSL
2. Set up CI/CD with GitHub Actions or AWS CodePipeline
3. Configure monitoring and log aggregation
4. Set up automated backups
5. Test disaster recovery procedures
