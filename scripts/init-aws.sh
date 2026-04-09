#!/bin/bash
echo "Initializing LocalStack resources..."

# 1. Create DynamoDB Tables

# Users Table (PK: userId, SK: none, GSI: EmailIndex)
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

# Messages Table (PK: chat_id, SK: timestamp)
awslocal dynamodb create-table \
    --table-name Messages \
    --attribute-definitions \
        AttributeName=chat_id,AttributeType=S \
        AttributeName=timestamp,AttributeType=N \
    --key-schema \
        AttributeName=chat_id,KeyType=HASH \
        AttributeName=timestamp,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# Connections Table (for WebSockets)
awslocal dynamodb create-table \
    --table-name Connections \
    --attribute-definitions \
        AttributeName=connection_id,AttributeType=S \
    --key-schema \
        AttributeName=connection_id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# 2. Create S3 Buckets
awslocal s3 mb s3://chatr-uploads

# 3. Verify SES Email
awslocal ses verify-email-identity --email-address onboarding@resend.dev

echo "AWS Initialization complete."
