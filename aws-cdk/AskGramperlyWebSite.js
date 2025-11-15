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
        // Deploy site contents to S3 bucket
        new s3deploy.BucketDeployment(this.construct, "DeployWebSite", {
            sources: [s3deploy.Source.asset("../dist/ask-gramperly")],
            destinationBucket: siteBucket,
            //   distribution,
            //    distributionPaths: ["/*"],
        });
    }
}
exports.AskGramperlyWebSite = AskGramperlyWebSite;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXNrR3JhbXBlcmx5V2ViU2l0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkFza0dyYW1wZXJseVdlYlNpdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBQXlDO0FBQ3pDLDBEQUEwRDtBQUMxRCxtQ0FBbUM7QUFRbkMsTUFBYSxtQkFBbUI7SUFHOUIsWUFBWSxTQUFvQjtRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBRUQsVUFBVTtRQUNSLGlCQUFpQjtRQUNqQixNQUFNLFVBQVUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxrQkFBa0IsRUFBRTtZQUNuRSxVQUFVLEVBQUUsa0JBQWtCO1lBQzlCLG9CQUFvQixFQUFFLFlBQVk7WUFDbEMsb0JBQW9CLEVBQUUsWUFBWSxFQUFFLG1DQUFtQztZQUN2RSxpQkFBaUIsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsVUFBVTtZQUNsRCxhQUFhLEVBQUUsRUFBRSxDQUFDLG1CQUFtQixDQUFDLHlCQUF5QjtZQUUvRCxnR0FBZ0c7WUFDaEcsc0dBQXNHO1lBQ3RHLHFHQUFxRztZQUNyRyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsc0NBQXNDO1lBQ2hGLGlCQUFpQixFQUFFLElBQUksRUFBRSxxREFBcUQ7U0FDL0UsQ0FBQyxDQUFDO1FBRUgsZ0RBQWdEO1FBQ2hELFVBQVUsQ0FBQyxtQkFBbUIsQ0FDNUIsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQztZQUM5QixPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUM7WUFDekIsU0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDN0MsQ0FBQyxDQUNILENBQUM7UUFFRixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFFakYsb0NBQW9DO1FBQ3BDLElBQUksUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZUFBZSxFQUFFO1lBQzdELE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDekQsaUJBQWlCLEVBQUUsVUFBVTtZQUM3QixrQkFBa0I7WUFDbEIsZ0NBQWdDO1NBQ2pDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTFDRCxrREEwQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0ICogYXMgczNkZXBsb3kgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzLWRlcGxveW1lbnQnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0YXRpY1NpdGVQcm9wcyB7XG4gIGRvbWFpbk5hbWU6IHN0cmluZztcbiAgc2l0ZVN1YkRvbWFpbjogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgQXNrR3JhbXBlcmx5V2ViU2l0ZSB7XG4gIHByaXZhdGUgY29uc3RydWN0OiBDb25zdHJ1Y3Q7XG5cbiAgY29uc3RydWN0b3IoY29uc3RydWN0OiBDb25zdHJ1Y3QpIHtcbiAgICB0aGlzLmNvbnN0cnVjdCA9IGNvbnN0cnVjdDtcbiAgfVxuXG4gIGRlcGxveVNpdGUoKSB7XG4gICAgLy8gQ29udGVudCBidWNrZXRcbiAgICBjb25zdCBzaXRlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLmNvbnN0cnVjdCwgXCJhc2tncmFtcGVybHkuY29tXCIsIHtcbiAgICAgIGJ1Y2tldE5hbWU6IFwiYXNrZ3JhbXBlcmx5LmNvbVwiLFxuICAgICAgd2Vic2l0ZUluZGV4RG9jdW1lbnQ6IFwiaW5kZXguaHRtbFwiLFxuICAgICAgd2Vic2l0ZUVycm9yRG9jdW1lbnQ6IFwiaW5kZXguaHRtbFwiLCAvLyBuZWVkZWQgdG8gY292ZXIgdGltZW91dHMgY2xlYW5seVxuICAgICAgYmxvY2tQdWJsaWNBY2Nlc3M6IHMzLkJsb2NrUHVibGljQWNjZXNzLkJMT0NLX0FDTFMsXG4gICAgICBhY2Nlc3NDb250cm9sOiBzMy5CdWNrZXRBY2Nlc3NDb250cm9sLkJVQ0tFVF9PV05FUl9GVUxMX0NPTlRST0wsXG5cbiAgICAgIC8vIFRoZSBkZWZhdWx0IHJlbW92YWwgcG9saWN5IGlzIFJFVEFJTiwgd2hpY2ggbWVhbnMgdGhhdCBjZGsgZGVzdHJveSB3aWxsIG5vdCBhdHRlbXB0IHRvIGRlbGV0ZVxuICAgICAgLy8gdGhlIG5ldyBidWNrZXQsIGFuZCBpdCB3aWxsIHJlbWFpbiBpbiB5b3VyIGFjY291bnQgdW50aWwgbWFudWFsbHkgZGVsZXRlZC4gQnkgc2V0dGluZyB0aGUgcG9saWN5IHRvXG4gICAgICAvLyBERVNUUk9ZLCBjZGsgZGVzdHJveSB3aWxsIGF0dGVtcHQgdG8gZGVsZXRlIHRoZSBidWNrZXQsIGJ1dCB3aWxsIGVycm9yIGlmIHRoZSBidWNrZXQgaXMgbm90IGVtcHR5LlxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSwgLy8gTk9UIHJlY29tbWVuZGVkIGZvciBwcm9kdWN0aW9uIGNvZGVcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLCAvLyBBdXRvbWF0aWNhbGx5IGRlbGV0ZSBvYmplY3RzIHdoZW4gc3RhY2sgaXMgZGVsZXRlZFxuICAgIH0pO1xuXG4gICAgLy8gQWRkIGJ1Y2tldCBwb2xpY3kgdG8gYWxsb3cgcHVibGljIHJlYWQgYWNjZXNzXG4gICAgc2l0ZUJ1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KFxuICAgICAgbmV3IGNkay5hd3NfaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFsnczM6R2V0T2JqZWN0J10sXG4gICAgICAgIHJlc291cmNlczogW3NpdGVCdWNrZXQuYXJuRm9yT2JqZWN0cygnKicpXSxcbiAgICAgICAgcHJpbmNpcGFsczogW25ldyBjZGsuYXdzX2lhbS5BbnlQcmluY2lwYWwoKV0sXG4gICAgICB9KVxuICAgICk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLmNvbnN0cnVjdCwgXCJCdWNrZXRVcmxcIiwgeyB2YWx1ZTogc2l0ZUJ1Y2tldC5idWNrZXROYW1lIH0pO1xuXG4gICAgLy8gRGVwbG95IHNpdGUgY29udGVudHMgdG8gUzMgYnVja2V0XG4gICAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQodGhpcy5jb25zdHJ1Y3QsIFwiRGVwbG95V2ViU2l0ZVwiLCB7XG4gICAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KFwiLi4vZGlzdC9hc2stZ3JhbXBlcmx5XCIpXSxcbiAgICAgIGRlc3RpbmF0aW9uQnVja2V0OiBzaXRlQnVja2V0LFxuICAgICAgLy8gICBkaXN0cmlidXRpb24sXG4gICAgICAvLyAgICBkaXN0cmlidXRpb25QYXRoczogW1wiLypcIl0sXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==