import cdk = require("@aws-cdk/core");
export interface StaticSiteProps {
    domainName: string;
    siteSubDomain: string;
}
export declare class AskGramperlyWebSite {
    private construct;
    constructor(construct: cdk.Construct);
    deploySite(): void;
}
