import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'ignite-node-challenge-07-serverless',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-dynamodb-local',
    'serverless-offline'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: {
    createTodo: {
      handler: "src/functions/createTodo.handler",
      events: [
        {
          http: {
            path: "todos/{userId}",
            method: "post",
            cors: true
          }
        }
      ]
    },
    listTodos: {
      handler: "src/functions/listTodos.handler",
      events: [
        {
          http: {
            path: "todos/{userId}",
            method: "get",
            cors: true
          }
        }
      ]
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ['dev', 'local'] ,
      start: {
        port: 8000,
        inMemory: true,
        migrate: true
      }
    }
  },
  resources: {
    Resources: {
      dbTodos: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "todos",
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S"
            },
            {
              AttributeName: "user_id",
              AttributeType: "S"
            },
          ],
          GlobalSecondaryIndexes: [
            {
                IndexName: "User-index",
                Projection: {
                    ProjectionType: "ALL"
                },
                ProvisionedThroughput: {
                    WriteCapacityUnits: 5,
                    ReadCapacityUnits: 5
                },
                KeySchema: [
                    {
                        KeyType: "HASH",
                        AttributeName: "user_id"
                    }
                ],
            }
        ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH"
            },
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
