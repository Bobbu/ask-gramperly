import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface StaticSiteProps {
  domainName: string;
  siteSubDomain: string;
}

export class AskGramperlyWebSite {
  private construct: Construct;

  constructor(construct: Construct) {
    this.construct = construct;
  }

  deploySite() {
    // Content bucket
    const siteBucket = new s3.Bucket(this.construct, "askgramperly.com", {
      bucketName: "askgramperly.com",
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html", // needed to cover timeouts cleanly
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,

      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new bucket, and it will remain in your account until manually deleted. By setting the policy to
      // DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
      autoDeleteObjects: true, // Automatically delete objects when stack is deleted
    });

    // Add bucket policy to allow public read access
    siteBucket.addToResourcePolicy(
      new cdk.aws_iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [siteBucket.arnForObjects('*')],
        principals: [new cdk.aws_iam.AnyPrincipal()],
      })
    );

    new cdk.CfnOutput(this.construct, "BucketUrl", { value: siteBucket.bucketName });

    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this.construct, "DeployWebSite", {
      sources: [s3deploy.Source.asset("../dist/ask-gramperly")],
      destinationBucket: siteBucket,
      //   distribution,
      //    distributionPaths: ["/*"],
    });
  }
}
