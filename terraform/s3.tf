# S3 bucket for storing Terraform state
resource "aws_s3_bucket" "terraform_state" {
  bucket = "fast-food-orders-terraform-state-${random_id.bucket_suffix.hex}"
  
  tags = {
    Name        = "fast-food-orders-terraform-state"
    Environment = "dev"
    Project     = "fast-food-orders"
  }
}

# Make bucket name unique
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# Block public access (security best practice)
resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable versioning
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}