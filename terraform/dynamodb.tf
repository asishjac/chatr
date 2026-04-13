resource "aws_dynamodb_table" "users" {
  name           = "Users"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "email"

  attribute {
    name = "email"
    type = "S"
  }

  tags = {
    Environment = "production"
    Project     = "Chatr"
  }
}

resource "aws_dynamodb_table" "messages" {
  name           = "Messages"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "chat_id"
  range_key      = "timestamp"

  attribute {
    name = "chat_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "N"
  }

  tags = {
    Environment = "production"
    Project     = "Chatr"
  }
}

resource "aws_dynamodb_table" "connections" {
  name           = "Connections"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "connection_id"

  attribute {
    name = "connection_id"
    type = "S"
  }

  tags = {
    Environment = "production"
    Project     = "Chatr"
  }
}
