# GitHub Actions Workflows

This repository contains three simple GitHub Actions workflows for deploying the Fast Food Orders application to AWS EKS.

## 📋 Workflows Overview

### 🔄 **ci.yml** - Continuous Integration
- **Trigger**: Every push to any branch
- **Manual**: Available via workflow_dispatch
- **Purpose**: Basic CI checks (build, dependencies, Docker)
- **Duration**: ~2-3 minutes

### 🏗️ **1-terraform.yml** - Infrastructure Deployment
- **Triggers**: 
  - Pull requests to `main` (when terraform files change)
  - Push to `configure_aws_deployment` (when terraform files change)
- **Manual**: Available via workflow_dispatch
- **Purpose**: Deploy AWS EKS infrastructure using Terraform
- **Duration**: ~10-15 minutes

### 🚀 **2-k8s.yml** - Application Deployment
- **Triggers**: 
  - Pull requests to `main` (when k8s files change)
  - Push to `configure_aws_deployment` (when k8s files change)
- **Manual**: Available via workflow_dispatch
- **Purpose**: Deploy application to Kubernetes cluster
- **Duration**: ~5-8 minutes

## 🔧 Setup Required

### GitHub Repository Secrets
Add these secrets to your GitHub repository:

```
AWS_ACCESS_KEY_ID=ASIA...
AWS_SECRET_ACCESS_KEY=xxx...
AWS_SESSION_TOKEN=IQoJb3...
```

**Note**: For AWS Academy, these credentials expire and need to be updated for each lab session.

## 🚀 Usage

### Option 1: Automatic (Recommended)
1. Make changes to terraform files → `1-terraform.yml` runs automatically
2. Make changes to k8s files → `2-k8s.yml` runs automatically
3. Every push → `ci.yml` runs automatically

### Option 2: Manual
1. Go to "Actions" tab in GitHub
2. Select the workflow you want to run
3. Click "Run workflow"
4. Choose the branch and click "Run workflow"

## 📝 Deployment Flow

For a complete deployment:

1. **First**: Run `1-terraform.yml` to create infrastructure
2. **Then**: Run `2-k8s.yml` to deploy the application
3. **Monitor**: Check the workflow logs for any issues

## 🎯 MVP Focus

These workflows are designed for simplicity:
- ✅ Minimal configuration
- ✅ Clear error messages
- ✅ Continue on non-critical errors
- ✅ Manual triggers available
- ✅ Basic health checks
- ❌ No complex security scanning
- ❌ No environment segregation
- ❌ No rollback strategies

Perfect for learning and demonstrations! 🎓
