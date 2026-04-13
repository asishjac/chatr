resource "aws_apigatewayv2_api" "chat_ws" {
  name                       = "chatr-websocket-api"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"

  tags = {
    Project = "Chatr"
  }
}

resource "aws_apigatewayv2_route" "connect" {
  api_id    = aws_apigatewayv2_api.chat_ws.id
  route_key = "$connect"
  target    = "integrations/${aws_apigatewayv2_integration.connect.id}"
}

resource "aws_apigatewayv2_route" "disconnect" {
  api_id    = aws_apigatewayv2_api.chat_ws.id
  route_key = "$disconnect"
  target    = "integrations/${aws_apigatewayv2_integration.disconnect.id}"
}

# In a real Serverless setup, these targets would be Lambda functions.
# For this project, we point them to our Express backend endpoints if deploying to VPC,
# or simply document that they hit the /ws/connect and /ws/disconnect routes.

resource "aws_apigatewayv2_integration" "connect" {
  api_id           = aws_apigatewayv2_api.chat_ws.id
  integration_type = "HTTP_PROXY"
  integration_uri  = "http://your-backend-url/ws/connect" # Placeholder for production URL
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "disconnect" {
  api_id           = aws_apigatewayv2_api.chat_ws.id
  integration_type = "HTTP_PROXY"
  integration_uri  = "http://your-backend-url/ws/disconnect" # Placeholder for production URL
  integration_method = "POST"
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id = aws_apigatewayv2_api.chat_ws.id
  name   = "prod"
  auto_deploy = true
}

output "websocket_url" {
  value = aws_apigatewayv2_stage.prod.invoke_url
}
