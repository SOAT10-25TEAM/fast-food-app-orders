# Data sources to get existing AWS resources
data "aws_caller_identity" "current" {}

data "aws_availability_zones" "available" {
  state = "available"
}

# Get default VPC
data "aws_vpc" "default" {
  default = true
}

# Get subnets from default VPC
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Get subnet details
data "aws_subnet" "default" {
  for_each = toset(data.aws_subnets.default.ids)
  id       = each.value
}

data "aws_iam_role" "lab_role" {
  name = "LabRole"
}