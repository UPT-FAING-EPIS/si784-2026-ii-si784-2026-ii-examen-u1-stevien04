terraform {
  required_providers {
    local = {
      source = "hashicorp/local"
      version = "~> 2.1"
    }
  }
}

provider "local" {}

resource "local_file" "dummy_infra" {
    content  = "Infraestructura aprovisionada para NannyApp"
    filename = "${path.module}/infra_status.txt"
}
