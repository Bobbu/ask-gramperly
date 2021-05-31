"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskGramperlyWebSite = void 0;
const s3 = require("@aws-cdk/aws-s3");
const s3deploy = require("@aws-cdk/aws-s3-deployment");
const cdk = require("@aws-cdk/core");
class AskGramperlyWebSite {
    constructor(construct) {
        this.construct = construct;
    }
    deploySite() {
        // Content bucket
        const siteBucket = new s3.Bucket(this.construct, "askgramperly.com", {
            bucketName: "askgramperly.com",
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "index.html",
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
exports.AskGramperlyWebSite = AskGramperlyWebSite;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXNrR3JhbXBlcmx5V2ViU2l0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkFza0dyYW1wZXJseVdlYlNpdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsc0NBQXVDO0FBQ3ZDLHVEQUF3RDtBQUV4RCxxQ0FBc0M7QUFTdEMsTUFBYSxtQkFBbUI7SUFHMUIsWUFBWSxTQUF3QjtRQUNsQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBQ0QsVUFBVTtRQUVSLGlCQUFpQjtRQUNqQixNQUFNLFVBQVUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxrQkFBa0IsRUFBRTtZQUNuRSxVQUFVLEVBQUUsa0JBQWtCO1lBQzlCLG9CQUFvQixFQUFFLFlBQVk7WUFDbEMsb0JBQW9CLEVBQUUsWUFBWTtZQUNsQyxnQkFBZ0IsRUFBRSxJQUFJO1lBRXRCLGdHQUFnRztZQUNoRyxzR0FBc0c7WUFDdEcscUdBQXFHO1lBQ3JHLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxzQ0FBc0M7U0FDakYsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBRWpGLG9DQUFvQztRQUNwQyxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGVBQWUsRUFBRTtZQUM3RCxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBQ3pELGlCQUFpQixFQUFFLFVBQVU7WUFDaEMsa0JBQWtCO1lBQ25CLGdDQUFnQztTQUM3QixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUE5Qkgsa0RBOEJHIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsb3VkZnJvbnQgPSByZXF1aXJlKFwiQGF3cy1jZGsvYXdzLWNsb3VkZnJvbnRcIik7XG5pbXBvcnQgcm91dGU1MyA9IHJlcXVpcmUoXCJAYXdzLWNkay9hd3Mtcm91dGU1M1wiKTtcbmltcG9ydCBzMyA9IHJlcXVpcmUoXCJAYXdzLWNkay9hd3MtczNcIik7XG5pbXBvcnQgczNkZXBsb3kgPSByZXF1aXJlKFwiQGF3cy1jZGsvYXdzLXMzLWRlcGxveW1lbnRcIik7XG5pbXBvcnQgYWNtID0gcmVxdWlyZShcIkBhd3MtY2RrL2F3cy1jZXJ0aWZpY2F0ZW1hbmFnZXJcIik7XG5pbXBvcnQgY2RrID0gcmVxdWlyZShcIkBhd3MtY2RrL2NvcmVcIik7XG5pbXBvcnQgdGFyZ2V0cyA9IHJlcXVpcmUoXCJAYXdzLWNkay9hd3Mtcm91dGU1My10YXJnZXRzL2xpYlwiKTtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RhdGljU2l0ZVByb3BzIHtcbiAgZG9tYWluTmFtZTogc3RyaW5nO1xuICBzaXRlU3ViRG9tYWluOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBBc2tHcmFtcGVybHlXZWJTaXRlIHtcbiAgcHJpdmF0ZSBjb25zdHJ1Y3Q6IGNkay5Db25zdHJ1Y3Q7XG5cbiAgICAgIGNvbnN0cnVjdG9yKGNvbnN0cnVjdDogY2RrLkNvbnN0cnVjdCkge1xuICAgICAgICB0aGlzLmNvbnN0cnVjdCA9IGNvbnN0cnVjdDtcbiAgICB9XG4gICAgZGVwbG95U2l0ZSgpIHtcblxuICAgICAgLy8gQ29udGVudCBidWNrZXRcbiAgICAgIGNvbnN0IHNpdGVCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMuY29uc3RydWN0LCBcImFza2dyYW1wZXJseS5jb21cIiwge1xuICAgICAgICBidWNrZXROYW1lOiBcImFza2dyYW1wZXJseS5jb21cIixcbiAgICAgICAgd2Vic2l0ZUluZGV4RG9jdW1lbnQ6IFwiaW5kZXguaHRtbFwiLFxuICAgICAgICB3ZWJzaXRlRXJyb3JEb2N1bWVudDogXCJpbmRleC5odG1sXCIsIC8vIG5lZWRlZCB0byBjb3ZlciB0aW1lb3V0cyBjbGVhbmx5XG4gICAgICAgIHB1YmxpY1JlYWRBY2Nlc3M6IHRydWUsXG5cbiAgICAgICAgLy8gVGhlIGRlZmF1bHQgcmVtb3ZhbCBwb2xpY3kgaXMgUkVUQUlOLCB3aGljaCBtZWFucyB0aGF0IGNkayBkZXN0cm95IHdpbGwgbm90IGF0dGVtcHQgdG8gZGVsZXRlXG4gICAgICAgIC8vIHRoZSBuZXcgYnVja2V0LCBhbmQgaXQgd2lsbCByZW1haW4gaW4geW91ciBhY2NvdW50IHVudGlsIG1hbnVhbGx5IGRlbGV0ZWQuIEJ5IHNldHRpbmcgdGhlIHBvbGljeSB0b1xuICAgICAgICAvLyBERVNUUk9ZLCBjZGsgZGVzdHJveSB3aWxsIGF0dGVtcHQgdG8gZGVsZXRlIHRoZSBidWNrZXQsIGJ1dCB3aWxsIGVycm9yIGlmIHRoZSBidWNrZXQgaXMgbm90IGVtcHR5LlxuICAgICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLCAvLyBOT1QgcmVjb21tZW5kZWQgZm9yIHByb2R1Y3Rpb24gY29kZVxuICAgICAgfSk7XG4gICAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLmNvbnN0cnVjdCwgXCJCdWNrZXRVcmxcIiwgeyB2YWx1ZTogc2l0ZUJ1Y2tldC5idWNrZXROYW1lIH0pO1xuXG4gICAgICAvLyBEZXBsb3kgc2l0ZSBjb250ZW50cyB0byBTMyBidWNrZXRcbiAgICAgIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHRoaXMuY29uc3RydWN0LCBcIkRlcGxveVdlYlNpdGVcIiwge1xuICAgICAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KFwiLi4vZGlzdC9hc2stZ3JhbXBlcmx5XCIpXSxcbiAgICAgICAgZGVzdGluYXRpb25CdWNrZXQ6IHNpdGVCdWNrZXQsXG4gICAgIC8vICAgZGlzdHJpYnV0aW9uLFxuICAgIC8vICAgIGRpc3RyaWJ1dGlvblBhdGhzOiBbXCIvKlwiXSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuIl19