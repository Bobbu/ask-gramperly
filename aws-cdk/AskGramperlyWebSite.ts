import cloudfront = require("@aws-cdk/aws-cloudfront");
import route53 = require("@aws-cdk/aws-route53");
import s3 = require("@aws-cdk/aws-s3");
import s3deploy = require("@aws-cdk/aws-s3-deployment");
import acm = require("@aws-cdk/aws-certificatemanager");
import cdk = require("@aws-cdk/core");
import targets = require("@aws-cdk/aws-route53-targets/lib");
import { Construct } from "@aws-cdk/core";

export interface StaticSiteProps {
  domainName: string;
  siteSubDomain: string;
}

export class AskGramperlyWebSite {
  private construct: cdk.Construct;

      constructor(construct: cdk.Construct) {
        this.construct = construct;
    }
    deploySite() {

      // Content bucket
      const siteBucket = new s3.Bucket(this.construct, "askgramperly.com", {
        bucketName: "askgramperly.com",
        websiteIndexDocument: "index.html",
        websiteErrorDocument: "index.html", // needed to cover timeouts cleanly
        publicReadAccess: true,

        // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
        // the new bucket, and it will remain in your account until manually deleted. By setting the policy to
        // DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
        removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
      });
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
