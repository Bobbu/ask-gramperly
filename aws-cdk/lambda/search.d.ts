export declare const handler: (event: {
    queryStringParameters?: {
        q?: string;
    };
    headers?: Record<string, string>;
}) => Promise<{
    statusCode: number;
    headers: Record<string, string>;
    body: string;
}>;
