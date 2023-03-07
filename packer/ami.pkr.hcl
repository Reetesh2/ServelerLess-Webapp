packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "DATABASE_HOST" {
  type      = string
  default   = ""
}
variable "PORT" {
  type      = string
  default   = ""
}
variable "DATABASE_USER" {
  type      = string
  default   = ""
}
variable "DATABASE_PASSWORD" {
  type      = string
  default   = ""
}
variable "DATABASE_NAME" {
  type      = string
  default   = ""
}


locals {
  timestamp = regex_replace(timestamp(), "[- TZ:]", "")
}

source "amazon-ebs" "my-ami" {
  ami_name = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss" , timestamp())}"
    ami_description = "AMI for CSYE 6225"

//  
  source_ami = "ami-0dfcb1ef8550277af"
  ami_users = [
    "793231301303","204539555313"
  ]
  ami_regions = [
    "us-east-1",
  ]



  instance_type = "t2.micro"
  region = "us-east-1"
  ssh_username = "ec2-user"
}

build {
  sources = [
    "source.amazon-ebs.my-ami"
  ]

  provisioner "file" {
    source = "../app_artifact/webapp.zip"
    destination = "/home/ec2-user/webapp.zip"
  }

  provisioner "file" {
    source = "./webapp.service"
    destination = "/tmp/webapp.service"
  }

  
  provisioner "shell" {
       environment_vars = [
    "DATABASE_HOST=${var.DATABASE_HOST}",
    "PORT=${var.PORT}",
    "DATABASE_USER=${var.DATABASE_USER}",
    "DATABASE_PASSWORD=${var.DATABASE_PASSWORD}",
    "DATABASE_NAME=${var.DATABASE_NAME}"
  ]

  script = "./app.sh"
  
}
}  
