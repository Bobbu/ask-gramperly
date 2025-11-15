"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskGramperlyWebSite = void 0;
const s3 = require("aws-cdk-lib/aws-s3");
const s3deploy = require("aws-cdk-lib/aws-s3-deployment");
const cdk = require("aws-cdk-lib");
class AskGramperlyWebSite {
    constructor(construct) {
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
        siteBucket.addToResourcePolicy(new cdk.aws_iam.PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [siteBucket.arnForObjects('*')],
            principals: [new cdk.aws_iam.AnyPrincipal()],
        }));
        new cdk.CfnOutput(this.construct, "BucketUrl", { value: siteBucket.bucketName });
        // Import existing CloudFront distribution for cache invalidation
        const distribution = cdk.aws_cloudfront.Distribution.fromDistributionAttributes(this.construct, "CloudFrontDistribution", {
            distributionId: "EVBARN2K870NX",
            domainName: "d4qfcuqanutci.cloudfront.net"
        });
        // Deploy site contents to S3 bucket and invalidate CloudFront cache
        new s3deploy.BucketDeployment(this.construct, "DeployWebSite", {
            sources: [s3deploy.Source.asset("../dist/ask-gramperly")],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ["/*"],
        });
    }
}
exports.AskGramperlyWebSite = AskGramperlyWebSite;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXNrR3JhbXBlcmx5V2ViU2l0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkFza0dyYW1wZXJseVdlYlNpdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBQXlDO0FBQ3pDLDBEQUEwRDtBQUMxRCxtQ0FBbUM7QUFRbkMsTUFBYSxtQkFBbUI7SUFHOUIsWUFBWSxTQUFvQjtRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBRUQsVUFBVTtRQUNSLGlCQUFpQjtRQUNqQixNQUFNLFVBQVUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxrQkFBa0IsRUFBRTtZQUNuRSxVQUFVLEVBQUUsa0JBQWtCO1lBQzlCLG9CQUFvQixFQUFFLFlBQVk7WUFDbEMsb0JBQW9CLEVBQUUsWUFBWSxFQUFFLG1DQUFtQztZQUN2RSxpQkFBaUIsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsVUFBVTtZQUNsRCxhQUFhLEVBQUUsRUFBRSxDQUFDLG1CQUFtQixDQUFDLHlCQUF5QjtZQUUvRCxnR0FBZ0c7WUFDaEcsc0dBQXNHO1lBQ3RHLHFHQUFxRztZQUNyRyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsc0NBQXNDO1lBQ2hGLGlCQUFpQixFQUFFLElBQUksRUFBRSxxREFBcUQ7U0FDL0UsQ0FBQyxDQUFDO1FBRUgsZ0RBQWdEO1FBQ2hELFVBQVUsQ0FBQyxtQkFBbUIsQ0FDNUIsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQztZQUM5QixPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUM7WUFDekIsU0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDN0MsQ0FBQyxDQUNILENBQUM7UUFFRixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFFakYsaUVBQWlFO1FBQ2pFLE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUM3RSxJQUFJLENBQUMsU0FBUyxFQUNkLHdCQUF3QixFQUN4QjtZQUNFLGNBQWMsRUFBRSxlQUFlO1lBQy9CLFVBQVUsRUFBRSw4QkFBOEI7U0FDM0MsQ0FDRixDQUFDO1FBRUYsb0VBQW9FO1FBQ3BFLElBQUksUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZUFBZSxFQUFFO1lBQzdELE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDekQsaUJBQWlCLEVBQUUsVUFBVTtZQUM3QixZQUFZO1lBQ1osaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLENBQUM7U0FDMUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBcERELGtEQW9EQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBzM2RlcGxveSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMtZGVwbG95bWVudCc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RhdGljU2l0ZVByb3BzIHtcbiAgZG9tYWluTmFtZTogc3RyaW5nO1xuICBzaXRlU3ViRG9tYWluOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBBc2tHcmFtcGVybHlXZWJTaXRlIHtcbiAgcHJpdmF0ZSBjb25zdHJ1Y3Q6IENvbnN0cnVjdDtcblxuICBjb25zdHJ1Y3Rvcihjb25zdHJ1Y3Q6IENvbnN0cnVjdCkge1xuICAgIHRoaXMuY29uc3RydWN0ID0gY29uc3RydWN0O1xuICB9XG5cbiAgZGVwbG95U2l0ZSgpIHtcbiAgICAvLyBDb250ZW50IGJ1Y2tldFxuICAgIGNvbnN0IHNpdGVCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMuY29uc3RydWN0LCBcImFza2dyYW1wZXJseS5jb21cIiwge1xuICAgICAgYnVja2V0TmFtZTogXCJhc2tncmFtcGVybHkuY29tXCIsXG4gICAgICB3ZWJzaXRlSW5kZXhEb2N1bWVudDogXCJpbmRleC5odG1sXCIsXG4gICAgICB3ZWJzaXRlRXJyb3JEb2N1bWVudDogXCJpbmRleC5odG1sXCIsIC8vIG5lZWRlZCB0byBjb3ZlciB0aW1lb3V0cyBjbGVhbmx5XG4gICAgICBibG9ja1B1YmxpY0FjY2VzczogczMuQmxvY2tQdWJsaWNBY2Nlc3MuQkxPQ0tfQUNMUyxcbiAgICAgIGFjY2Vzc0NvbnRyb2w6IHMzLkJ1Y2tldEFjY2Vzc0NvbnRyb2wuQlVDS0VUX09XTkVSX0ZVTExfQ09OVFJPTCxcblxuICAgICAgLy8gVGhlIGRlZmF1bHQgcmVtb3ZhbCBwb2xpY3kgaXMgUkVUQUlOLCB3aGljaCBtZWFucyB0aGF0IGNkayBkZXN0cm95IHdpbGwgbm90IGF0dGVtcHQgdG8gZGVsZXRlXG4gICAgICAvLyB0aGUgbmV3IGJ1Y2tldCwgYW5kIGl0IHdpbGwgcmVtYWluIGluIHlvdXIgYWNjb3VudCB1bnRpbCBtYW51YWxseSBkZWxldGVkLiBCeSBzZXR0aW5nIHRoZSBwb2xpY3kgdG9cbiAgICAgIC8vIERFU1RST1ksIGNkayBkZXN0cm95IHdpbGwgYXR0ZW1wdCB0byBkZWxldGUgdGhlIGJ1Y2tldCwgYnV0IHdpbGwgZXJyb3IgaWYgdGhlIGJ1Y2tldCBpcyBub3QgZW1wdHkuXG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLCAvLyBOT1QgcmVjb21tZW5kZWQgZm9yIHByb2R1Y3Rpb24gY29kZVxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsIC8vIEF1dG9tYXRpY2FsbHkgZGVsZXRlIG9iamVjdHMgd2hlbiBzdGFjayBpcyBkZWxldGVkXG4gICAgfSk7XG5cbiAgICAvLyBBZGQgYnVja2V0IHBvbGljeSB0byBhbGxvdyBwdWJsaWMgcmVhZCBhY2Nlc3NcbiAgICBzaXRlQnVja2V0LmFkZFRvUmVzb3VyY2VQb2xpY3koXG4gICAgICBuZXcgY2RrLmF3c19pYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogWydzMzpHZXRPYmplY3QnXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbc2l0ZUJ1Y2tldC5hcm5Gb3JPYmplY3RzKCcqJyldLFxuICAgICAgICBwcmluY2lwYWxzOiBbbmV3IGNkay5hd3NfaWFtLkFueVByaW5jaXBhbCgpXSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMuY29uc3RydWN0LCBcIkJ1Y2tldFVybFwiLCB7IHZhbHVlOiBzaXRlQnVja2V0LmJ1Y2tldE5hbWUgfSk7XG5cbiAgICAvLyBJbXBvcnQgZXhpc3RpbmcgQ2xvdWRGcm9udCBkaXN0cmlidXRpb24gZm9yIGNhY2hlIGludmFsaWRhdGlvblxuICAgIGNvbnN0IGRpc3RyaWJ1dGlvbiA9IGNkay5hd3NfY2xvdWRmcm9udC5EaXN0cmlidXRpb24uZnJvbURpc3RyaWJ1dGlvbkF0dHJpYnV0ZXMoXG4gICAgICB0aGlzLmNvbnN0cnVjdCxcbiAgICAgIFwiQ2xvdWRGcm9udERpc3RyaWJ1dGlvblwiLFxuICAgICAge1xuICAgICAgICBkaXN0cmlidXRpb25JZDogXCJFVkJBUk4ySzg3ME5YXCIsXG4gICAgICAgIGRvbWFpbk5hbWU6IFwiZDRxZmN1cWFudXRjaS5jbG91ZGZyb250Lm5ldFwiXG4gICAgICB9XG4gICAgKTtcblxuICAgIC8vIERlcGxveSBzaXRlIGNvbnRlbnRzIHRvIFMzIGJ1Y2tldCBhbmQgaW52YWxpZGF0ZSBDbG91ZEZyb250IGNhY2hlXG4gICAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQodGhpcy5jb25zdHJ1Y3QsIFwiRGVwbG95V2ViU2l0ZVwiLCB7XG4gICAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KFwiLi4vZGlzdC9hc2stZ3JhbXBlcmx5XCIpXSxcbiAgICAgIGRlc3RpbmF0aW9uQnVja2V0OiBzaXRlQnVja2V0LFxuICAgICAgZGlzdHJpYnV0aW9uLFxuICAgICAgZGlzdHJpYnV0aW9uUGF0aHM6IFtcIi8qXCJdLFxuICAgIH0pO1xuICB9XG59XG4iXX0=