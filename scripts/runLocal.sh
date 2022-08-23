#!/usr/bin/env bash

# Stop immediately on error
set -e

if [[ -z "$1" ]]; then
  $(./scripts/assumeDeveloperRole.sh)
fi

# Only install production modules
export NODE_ENV=production

# Build the project
SAM_TEMPLATE=template.yaml
sam build --template ${SAM_TEMPLATE}

# Start the API locally
export BUILD_COMPLETED_EXPIRE_HOURS=6
export BUILD_UNCOMPLETED_EXPIRE_DAYS=15
export DYNAMODB_BUILD_TABLE_NAME=dbd-build-maker-api-builds-test
export DYNAMODB_CHANNEL_TABLE_NAME=dbd-build-maker-api-channels-test
export DYNAMODB_TOKEN_TABLE_NAME=dbd-build-maker-api-tokens-test
export TOKEN_EXPIRE_HOURS=24
export TOKEN_MIN_LENGTH=3
export TOKEN_MAX_LENGTH=12
export TWITCH_CLIENT_ID=$(aws ssm get-parameter --name twitch-client-id | jq -r .Parameter.Value)
sam local start-api --region=us-east-2 --force-image-build --parameter-overrides "Environment=test TwitchClientID=${TWITCH_CLIENT_ID}" --log-file local.log
