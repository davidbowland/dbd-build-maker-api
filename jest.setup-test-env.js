// Builds

process.env.BUILD_COMPLETED_EXPIRE_HOURS = '6'
process.env.BUILD_UNCOMPLETED_EXPIRE_DAYS = '15'

// Channels

process.env.CHANNEL_EXPIRE_DAYS = '90'

// DynamoDB

process.env.DYNAMODB_BUILD_TABLE_NAME = 'build-table'
process.env.DYNAMODB_CHANNEL_TABLE_NAME = 'channel-table'
process.env.DYNAMODB_TOKEN_TABLE_NAME = 'token-table'

// Tokens

process.env.TOKEN_EXPIRE_HOURS = '24'
process.env.TOKEN_MIN_LENGTH = '3'
process.env.TOKEN_MAX_LENGTH = '4'

// Twitch

process.env.TWITCH_CLIENT_ID = '6trtyuikjhgft78'
