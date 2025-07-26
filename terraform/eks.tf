# EKS Cluster
resource "aws_eks_cluster" "main" {
  name     = "fast-food-orders"
  # Use provided ARN or auto-detected LabRole
  role_arn = var.lab_role_arn != "" ? var.lab_role_arn : data.aws_iam_role.lab_role.arn
  version  = "1.28"

  vpc_config {
    # Use only EKS-supported subnets
    subnet_ids              = local.eks_supported_subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = true
    security_group_ids      = [aws_security_group.eks_cluster.id]
  }

  depends_on = [
    aws_security_group.eks_cluster
  ]

  tags = {
    Name        = "fast-food-orders"
    Environment = "dev"
    Project     = "fast-food-orders"
  }
}

# EKS Node Group
resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "fast-food-orders-nodes"
  node_role_arn   = var.lab_role_arn != "" ? var.lab_role_arn : data.aws_iam_role.lab_role.arn
  # Use only EKS-supported subnets
  subnet_ids      = local.eks_supported_subnet_ids
  instance_types  = [var.instance_type]

  scaling_config {
    desired_size = var.desired_capacity
    max_size     = var.max_capacity
    min_size     = var.min_capacity
  }

  disk_size = 20

  depends_on = [
    aws_eks_cluster.main
  ]

  tags = {
    Name        = "fast-food-orders-nodes"
    Environment = "dev"
    Project     = "fast-food-orders"
  }
}