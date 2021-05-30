import * as cdk from '@aws-cdk/core';
//import cdk = require('@aws-cdk/core');
import {AskGramperlyWebSite} from "./AskGramperlyWebSite";
export class AskGramperlyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const askGramperlyPublic = new AskGramperlyWebSite(this);
    askGramperlyPublic.deploySite();

  }
}

const app = new cdk.App();
new AskGramperlyStack(app, 'AskGramperlyStack');
app.synth();
