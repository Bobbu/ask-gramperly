import { Construct } from 'constructs';
export interface StaticSiteProps {
    domainName: string;
    siteSubDomain: string;
}
export declare class AskGramperlyWebSite {
    private construct;
    constructor(construct: Construct);
    deploySite(): void;
}
