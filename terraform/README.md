# Terraform Deployment Instructions

## Prerequisites

1. AWS CLI installed and configured
2. Terraform installed (version >= 1.0)
3. kubectl installed
4. Access to AWS Lab environment with LabRole

## Quick Start

### 1. Configure Variables

Copy the example variables file and update with your values:

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` and update:
- `lab_role_arn`: Your AWS Lab Role ARN (find this in your AWS Lab environment)
- Other values as needed

### 2. Initialize and Deploy

```bash
# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the configuration
terraform apply
```

### 3. Configure kubectl

After successful deployment, configure kubectl to connect to your cluster:

```bash
# Get the command from terraform output
terraform output kubectl_config_command

# Run the command (example)
aws eks update-kubeconfig --region us-east-1 --name fast-food-orders-dev
```

### 4. Deploy Your Application

Apply your Kubernetes manifests:

```bash
# From the project root
kubectl apply -f mysql-secrets.yaml
kubectl apply -f mysql-deployment.yaml
kubectl apply -f mysql-service.yaml
kubectl apply -f node-configmap.yaml
kubectl apply -f node-deployment.yaml
kubectl apply -f node-service.yaml
kubectl apply -f node-hpa.yaml
```

### 5. Get Application URL

```bash
# Check services
kubectl get services

# Get LoadBalancer URL (if using LoadBalancer service type)
kubectl get service fast-food-orders-service
```

## Important Notes

- This configuration uses the default VPC for simplicity
- Security groups allow HTTP/HTTPS from anywhere (0.0.0.0/0) - suitable for demo/learning
- Node group uses t3.medium instances for cost optimization
- Minimum viable configuration for educational purposes

## Cleanup

To destroy all resources:

```bash
terraform destroy
```

## Troubleshooting

1. **Permission Issues**: Ensure your LabRole has necessary EKS permissions
2. **VPC Issues**: This uses default VPC - ensure it exists
3. **Region Issues**: Ensure you're using the correct AWS region

## Environment Variables

You can also set variables via environment variables:

```bash
export TF_VAR_lab_role_arn="arn:aws:iam::YOUR_ACCOUNT_ID:role/LabRole"
export TF_VAR_aws_region="us-east-1"
```
