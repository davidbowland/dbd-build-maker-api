#!/usr/bin/env bash

# Stop immediately on error
set -e

if [[ -z "$1" ]]; then
  $(./scripts/assumeDeveloperRole.sh)
fi

# Build from template

SAM_TEMPLATE=template.yaml
sam build --template ${SAM_TEMPLATE} --use-container -e NODE_ENV=production

# Deploy build lambda

export TWITCH_CLIENT_ID=$(aws ssm get-parameter --name twitch-client-id | jq -r .Parameter.Value)
TESTING_ARTIFACTS_BUCKET=dbd-build-maker-lambda-test
TESTING_CLOUDFORMATION_EXECUTION_ROLE="arn:aws:iam::$AWS_ACCOUNT_ID:role/dbd-build-maker-cloudformation-test"
TESTING_STACK_NAME=dbd-build-maker-api-test
sam deploy --stack-name ${TESTING_STACK_NAME} \
           --capabilities CAPABILITY_IAM \
           --region us-east-2 \
           --s3-bucket ${TESTING_ARTIFACTS_BUCKET} \
           --s3-prefix ${TESTING_STACK_NAME} \
           --no-fail-on-empty-changeset \
           --role-arn ${TESTING_CLOUDFORMATION_EXECUTION_ROLE} \
           --parameter-overrides "Environment=test TwitchClientId=${TWITCH_CLIENT_ID}"
