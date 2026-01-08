import { Construct } from 'constructs';
export declare class SearchApi {
    private construct;
    apiUrl: string;
    constructor(construct: Construct);
    deploy(): string;
}
