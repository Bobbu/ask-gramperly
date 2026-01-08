import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as logs from 'aws-cdk-lib/aws-logs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'node:path';

export class SearchApi {
  private construct: Construct;
  public apiUrl: string = '';

  constructor(construct: Construct) {
    this.construct = construct;
  }

  deploy(): string {
    // Reference the Brave API key secret (must be created manually or via CLI)
    // Store the raw API key as the secret value (not JSON)
    const braveApiKeySecret = secretsmanager.Secret.fromSecretNameV2(
      this.construct,
      'BraveApiKeySecret',
      'askgramperly/brave-api-key'
    );

    // Create Lambda function for search
    const searchFunction = new NodejsFunction(this.construct, 'SearchFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: path.join(__dirname, 'lambda', 'search.ts'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        BRAVE_API_KEY_SECRET_NAME: braveApiKeySecret.secretName,
      },
      logGroup: new logs.LogGroup(this.construct, 'SearchFunctionLogGroup', {
        retention: logs.RetentionDays.ONE_WEEK,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }),
      bundling: {
        minify: true,
        sourceMap: false,
        externalModules: ['@aws-sdk/*'],
      },
    });

    // Grant Lambda permission to read the secret
    braveApiKeySecret.grantRead(searchFunction);

    // Create API Gateway
    const api = new apigateway.RestApi(this.construct, 'SearchApi', {
      restApiName: 'AskGramperly Search API',
      description: 'API for searching via Brave Search',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ['GET', 'OPTIONS'],
        allowHeaders: ['Content-Type'],
      },
      deployOptions: {
        stageName: 'prod',
        throttlingRateLimit: 10,
        throttlingBurstLimit: 20,
      },
    });

    // Add /search resource
    const searchResource = api.root.addResource('search');
    searchResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(searchFunction, {
        requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
      })
    );

    this.apiUrl = api.url;

    // Output the API URL
    new cdk.CfnOutput(this.construct, 'SearchApiUrl', {
      value: api.url,
      description: 'URL for the search API',
      exportName: 'AskGramperlySearchApiUrl',
    });

    return api.url;
  }
}
