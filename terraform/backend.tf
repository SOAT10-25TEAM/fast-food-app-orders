# Simple S3 backend for state management
terraform {
  backend "s3" {
    bucket = "fast-food-orders-terraform-state"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}