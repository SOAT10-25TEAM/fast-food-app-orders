# Data sources to get existing AWS resources
data "aws_caller_identity" "current" {}

# Get default VPC
data "aws_vpc" "default" {
  default = true
}

# Get ALL subnets from default VPC first
data "aws_subnets" "all_default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Get subnet details for all subnets
data "aws_subnet" "all_default" {
  for_each = toset(data.aws_subnets.all_default.ids)
  id       = each.value
}

# Filter to only EKS-supported availability zones
locals {
  eks_supported_azs = ["us-east-1a", "us-east-1b", "us-east-1c", "us-east-1d", "us-east-1f"]
  
  # Get subnets that are in EKS-supported AZs
  eks_supported_subnet_ids = [
    for subnet in data.aws_subnet.all_default : subnet.id
    if contains(local.eks_supported_azs, subnet.availability_zone)
  ]
}

# Get the LabRole
data "aws_iam_role" "lab_role" {
  name = "LabRole"
}