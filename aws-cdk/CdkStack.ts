import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AskGramperlyWebSite } from "./AskGramperlyWebSite";
import { SearchApi } from "./SearchApi";

export class AskGramperlyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Deploy the Search API (Lambda + API Gateway)
    const searchApi = new SearchApi(this);
    searchApi.deploy();

    // Deploy the static website
    const askGramperlyPublic = new AskGramperlyWebSite(this);
    askGramperlyPublic.deploySite();
  }
}

const app = new cdk.App();
new AskGramperlyStack(app, 'AskGramperlyStack');
app.synth();
