#!/bin/bash
echo "Initializing LocalStack resources..."

# 1. Create DynamoDB Tables
awslocal dynamodb create-table \
    --table-name Users \
    --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=email,AttributeType=S \
    --key-schema \
    AttributeName=userId,KeyType=HASH \
    --global-secondary-indexes \
    "[{\"IndexName\": \"EmailIndex\", \"KeySchema\": [{\"AttributeName\":\"email\",\"KeyType\":\"HASH\"}], \"Projection\": {\"ProjectionType\":\"ALL\"}, \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}}]" \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

awslocal dynamodb create-table \
    --table-name Messages \
    --attribute-definitions \
    AttributeName=chat_id,AttributeType=S \
    AttributeName=timestamp,AttributeType=N \
    --key-schema \
    AttributeName=chat_id,KeyType=HASH \
    AttributeName=timestamp,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

awslocal dynamodb create-table \
    --table-name Connections \
    --attribute-definitions \
    AttributeName=connection_id,AttributeType=S \
    --key-schema \
    AttributeName=connection_id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# 2. Create S3 Bucket
awslocal s3 mb s3://chatr-uploads

# 3. Verify SES Email
awslocal ses verify-email-identity --email-address onboarding@resend.dev

# 4. Export API ID for Frontend (Dummy for local compat)
mkdir -p /tmp/shared
echo "local-ws" > /tmp/shared/ws_api_id.txt

echo "AWS Initialization complete (Community Mode)."
