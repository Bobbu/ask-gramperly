"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchApi = void 0;
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const secretsmanager = require("aws-cdk-lib/aws-secretsmanager");
const logs = require("aws-cdk-lib/aws-logs");
const aws_lambda_nodejs_1 = require("aws-cdk-lib/aws-lambda-nodejs");
const path = require("node:path");
class SearchApi {
    constructor(construct) {
        this.apiUrl = '';
        this.construct = construct;
    }
    deploy() {
        // Reference the Brave API key secret (must be created manually or via CLI)
        // Store the raw API key as the secret value (not JSON)
        const braveApiKeySecret = secretsmanager.Secret.fromSecretNameV2(this.construct, 'BraveApiKeySecret', 'askgramperly/brave-api-key');
        // Create Lambda function for search
        const searchFunction = new aws_lambda_nodejs_1.NodejsFunction(this.construct, 'SearchFunction', {
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
        searchResource.addMethod('GET', new apigateway.LambdaIntegration(searchFunction, {
            requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
        }));
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
exports.SearchApi = SearchApi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VhcmNoQXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU2VhcmNoQXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUNuQyxpREFBaUQ7QUFDakQseURBQXlEO0FBQ3pELGlFQUFpRTtBQUNqRSw2Q0FBNkM7QUFDN0MscUVBQStEO0FBRS9ELGtDQUFrQztBQUVsQyxNQUFhLFNBQVM7SUFJcEIsWUFBWSxTQUFvQjtRQUZ6QixXQUFNLEdBQVcsRUFBRSxDQUFDO1FBR3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzdCLENBQUM7SUFFRCxNQUFNO1FBQ0osMkVBQTJFO1FBQzNFLHVEQUF1RDtRQUN2RCxNQUFNLGlCQUFpQixHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQzlELElBQUksQ0FBQyxTQUFTLEVBQ2QsbUJBQW1CLEVBQ25CLDRCQUE0QixDQUM3QixDQUFDO1FBRUYsb0NBQW9DO1FBQ3BDLE1BQU0sY0FBYyxHQUFHLElBQUksa0NBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFFO1lBQzFFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLFNBQVM7WUFDbEIsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxXQUFXLENBQUM7WUFDbEQsT0FBTyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNqQyxVQUFVLEVBQUUsR0FBRztZQUNmLFdBQVcsRUFBRTtnQkFDWCx5QkFBeUIsRUFBRSxpQkFBaUIsQ0FBQyxVQUFVO2FBQ3hEO1lBQ0QsUUFBUSxFQUFFLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHdCQUF3QixFQUFFO2dCQUNwRSxTQUFTLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRO2dCQUN0QyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO2FBQ3pDLENBQUM7WUFDRixRQUFRLEVBQUU7Z0JBQ1IsTUFBTSxFQUFFLElBQUk7Z0JBQ1osU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLGVBQWUsRUFBRSxDQUFDLFlBQVksQ0FBQzthQUNoQztTQUNGLENBQUMsQ0FBQztRQUVILDZDQUE2QztRQUM3QyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFNUMscUJBQXFCO1FBQ3JCLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRTtZQUM5RCxXQUFXLEVBQUUseUJBQXlCO1lBQ3RDLFdBQVcsRUFBRSxvQ0FBb0M7WUFDakQsMkJBQTJCLEVBQUU7Z0JBQzNCLFlBQVksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQ3pDLFlBQVksRUFBRSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUM7Z0JBQ2hDLFlBQVksRUFBRSxDQUFDLGNBQWMsQ0FBQzthQUMvQjtZQUNELGFBQWEsRUFBRTtnQkFDYixTQUFTLEVBQUUsTUFBTTtnQkFDakIsbUJBQW1CLEVBQUUsRUFBRTtnQkFDdkIsb0JBQW9CLEVBQUUsRUFBRTthQUN6QjtTQUNGLENBQUMsQ0FBQztRQUVILHVCQUF1QjtRQUN2QixNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0RCxjQUFjLENBQUMsU0FBUyxDQUN0QixLQUFLLEVBQ0wsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFO1lBQy9DLGdCQUFnQixFQUFFLEVBQUUsa0JBQWtCLEVBQUUseUJBQXlCLEVBQUU7U0FDcEUsQ0FBQyxDQUNILENBQUM7UUFFRixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFFdEIscUJBQXFCO1FBQ3JCLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQWMsRUFBRTtZQUNoRCxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUc7WUFDZCxXQUFXLEVBQUUsd0JBQXdCO1lBQ3JDLFVBQVUsRUFBRSwwQkFBMEI7U0FDdkMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2pCLENBQUM7Q0FDRjtBQTdFRCw4QkE2RUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgYXBpZ2F0ZXdheSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5pbXBvcnQgKiBhcyBzZWNyZXRzbWFuYWdlciBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc2VjcmV0c21hbmFnZXInO1xuaW1wb3J0ICogYXMgbG9ncyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbG9ncyc7XG5pbXBvcnQgeyBOb2RlanNGdW5jdGlvbiB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEtbm9kZWpzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdub2RlOnBhdGgnO1xuXG5leHBvcnQgY2xhc3MgU2VhcmNoQXBpIHtcbiAgcHJpdmF0ZSBjb25zdHJ1Y3Q6IENvbnN0cnVjdDtcbiAgcHVibGljIGFwaVVybDogc3RyaW5nID0gJyc7XG5cbiAgY29uc3RydWN0b3IoY29uc3RydWN0OiBDb25zdHJ1Y3QpIHtcbiAgICB0aGlzLmNvbnN0cnVjdCA9IGNvbnN0cnVjdDtcbiAgfVxuXG4gIGRlcGxveSgpOiBzdHJpbmcge1xuICAgIC8vIFJlZmVyZW5jZSB0aGUgQnJhdmUgQVBJIGtleSBzZWNyZXQgKG11c3QgYmUgY3JlYXRlZCBtYW51YWxseSBvciB2aWEgQ0xJKVxuICAgIC8vIFN0b3JlIHRoZSByYXcgQVBJIGtleSBhcyB0aGUgc2VjcmV0IHZhbHVlIChub3QgSlNPTilcbiAgICBjb25zdCBicmF2ZUFwaUtleVNlY3JldCA9IHNlY3JldHNtYW5hZ2VyLlNlY3JldC5mcm9tU2VjcmV0TmFtZVYyKFxuICAgICAgdGhpcy5jb25zdHJ1Y3QsXG4gICAgICAnQnJhdmVBcGlLZXlTZWNyZXQnLFxuICAgICAgJ2Fza2dyYW1wZXJseS9icmF2ZS1hcGkta2V5J1xuICAgICk7XG5cbiAgICAvLyBDcmVhdGUgTGFtYmRhIGZ1bmN0aW9uIGZvciBzZWFyY2hcbiAgICBjb25zdCBzZWFyY2hGdW5jdGlvbiA9IG5ldyBOb2RlanNGdW5jdGlvbih0aGlzLmNvbnN0cnVjdCwgJ1NlYXJjaEZ1bmN0aW9uJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzIwX1gsXG4gICAgICBoYW5kbGVyOiAnaGFuZGxlcicsXG4gICAgICBlbnRyeTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2xhbWJkYScsICdzZWFyY2gudHMnKSxcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDMwKSxcbiAgICAgIG1lbW9yeVNpemU6IDI1NixcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIEJSQVZFX0FQSV9LRVlfU0VDUkVUX05BTUU6IGJyYXZlQXBpS2V5U2VjcmV0LnNlY3JldE5hbWUsXG4gICAgICB9LFxuICAgICAgbG9nR3JvdXA6IG5ldyBsb2dzLkxvZ0dyb3VwKHRoaXMuY29uc3RydWN0LCAnU2VhcmNoRnVuY3Rpb25Mb2dHcm91cCcsIHtcbiAgICAgICAgcmV0ZW50aW9uOiBsb2dzLlJldGVudGlvbkRheXMuT05FX1dFRUssXG4gICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICB9KSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgICAgc291cmNlTWFwOiBmYWxzZSxcbiAgICAgICAgZXh0ZXJuYWxNb2R1bGVzOiBbJ0Bhd3Mtc2RrLyonXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBHcmFudCBMYW1iZGEgcGVybWlzc2lvbiB0byByZWFkIHRoZSBzZWNyZXRcbiAgICBicmF2ZUFwaUtleVNlY3JldC5ncmFudFJlYWQoc2VhcmNoRnVuY3Rpb24pO1xuXG4gICAgLy8gQ3JlYXRlIEFQSSBHYXRld2F5XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaSh0aGlzLmNvbnN0cnVjdCwgJ1NlYXJjaEFwaScsIHtcbiAgICAgIHJlc3RBcGlOYW1lOiAnQXNrR3JhbXBlcmx5IFNlYXJjaCBBUEknLFxuICAgICAgZGVzY3JpcHRpb246ICdBUEkgZm9yIHNlYXJjaGluZyB2aWEgQnJhdmUgU2VhcmNoJyxcbiAgICAgIGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9uczoge1xuICAgICAgICBhbGxvd09yaWdpbnM6IGFwaWdhdGV3YXkuQ29ycy5BTExfT1JJR0lOUyxcbiAgICAgICAgYWxsb3dNZXRob2RzOiBbJ0dFVCcsICdPUFRJT05TJ10sXG4gICAgICAgIGFsbG93SGVhZGVyczogWydDb250ZW50LVR5cGUnXSxcbiAgICAgIH0sXG4gICAgICBkZXBsb3lPcHRpb25zOiB7XG4gICAgICAgIHN0YWdlTmFtZTogJ3Byb2QnLFxuICAgICAgICB0aHJvdHRsaW5nUmF0ZUxpbWl0OiAxMCxcbiAgICAgICAgdGhyb3R0bGluZ0J1cnN0TGltaXQ6IDIwLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIEFkZCAvc2VhcmNoIHJlc291cmNlXG4gICAgY29uc3Qgc2VhcmNoUmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnc2VhcmNoJyk7XG4gICAgc2VhcmNoUmVzb3VyY2UuYWRkTWV0aG9kKFxuICAgICAgJ0dFVCcsXG4gICAgICBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihzZWFyY2hGdW5jdGlvbiwge1xuICAgICAgICByZXF1ZXN0VGVtcGxhdGVzOiB7ICdhcHBsaWNhdGlvbi9qc29uJzogJ3sgXCJzdGF0dXNDb2RlXCI6IFwiMjAwXCIgfScgfSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMuYXBpVXJsID0gYXBpLnVybDtcblxuICAgIC8vIE91dHB1dCB0aGUgQVBJIFVSTFxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMuY29uc3RydWN0LCAnU2VhcmNoQXBpVXJsJywge1xuICAgICAgdmFsdWU6IGFwaS51cmwsXG4gICAgICBkZXNjcmlwdGlvbjogJ1VSTCBmb3IgdGhlIHNlYXJjaCBBUEknLFxuICAgICAgZXhwb3J0TmFtZTogJ0Fza0dyYW1wZXJseVNlYXJjaEFwaVVybCcsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXBpLnVybDtcbiAgfVxufVxuIl19