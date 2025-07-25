# EKS Cluster
resource "aws_eks_cluster" "main" {
  name     = "fast-food-orders-dev"
  # Use provided ARN or auto-detected LabRole
  role_arn = var.lab_role_arn != "" ? var.lab_role_arn : data.aws_iam_role.lab_role.arn
  version  = "1.28"

  vpc_config {
    subnet_ids              = data.aws_subnets.default.ids
    endpoint_private_access = true
    endpoint_public_access  = true
    security_group_ids      = [aws_security_group.eks_cluster.id]
  }

  depends_on = [
    aws_security_group.eks_cluster
  ]

  tags = {
    Name        = "fast-food-orders-dev"
    Environment = "dev"
    Project     = "fast-food-orders"
  }
}

# EKS Node Group
resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "fast-food-orders-dev-nodes"
  # Use provided ARN or auto-detected LabRole
  node_role_arn   = var.lab_role_arn != "" ? var.lab_role_arn : data.aws_iam_role.lab_role.arn
  subnet_ids      = data.aws_subnets.default.ids
  instance_types  = [var.instance_type]

  scaling_config {
    desired_size = var.desired_capacity
    max_size     = var.max_capacity
    min_size     = var.min_capacity
  }

  disk_size = 20

  # Ensure that IAM Role permissions are created before and deleted after EKS Node Group handling.
  depends_on = [
    aws_eks_cluster.main
  ]

  tags = {
    Name        = "fast-food-orders-dev-nodes"
    Environment = "dev"
    Project     = "fast-food-orders"
  }
}