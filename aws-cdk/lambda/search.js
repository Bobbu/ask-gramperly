"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const secretsClient = new client_secrets_manager_1.SecretsManagerClient({});
let cachedApiKey = null;
async function getBraveApiKey() {
    if (cachedApiKey) {
        return cachedApiKey;
    }
    const secretName = process.env.BRAVE_API_KEY_SECRET_NAME;
    if (!secretName) {
        throw new Error('BRAVE_API_KEY_SECRET_NAME environment variable not set');
    }
    const command = new client_secrets_manager_1.GetSecretValueCommand({ SecretId: secretName });
    const response = await secretsClient.send(command);
    if (!response.SecretString) {
        throw new Error('Secret value is empty');
    }
    cachedApiKey = response.SecretString;
    return cachedApiKey;
}
const handler = async (event) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json',
    };
    // Handle CORS preflight
    if (((_a = event.headers) === null || _a === void 0 ? void 0 : _a['httpMethod']) === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: '',
        };
    }
    const query = (_b = event.queryStringParameters) === null || _b === void 0 ? void 0 : _b.q;
    if (!query) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Missing query parameter "q"' }),
        };
    }
    try {
        const apiKey = await getBraveApiKey();
        const searchUrl = new URL('https://api.search.brave.com/res/v1/web/search');
        searchUrl.searchParams.set('q', query);
        searchUrl.searchParams.set('count', '10');
        const braveResponse = await fetch(searchUrl.toString(), {
            headers: {
                Accept: 'application/json',
                'X-Subscription-Token': apiKey,
            },
        });
        if (!braveResponse.ok) {
            const errorText = await braveResponse.text();
            console.error('Brave API error:', braveResponse.status, errorText);
            return {
                statusCode: braveResponse.status,
                headers: corsHeaders,
                body: JSON.stringify({
                    error: 'Search API error',
                    details: errorText,
                }),
            };
        }
        const braveData = await braveResponse.json();
        const results = (_e = (_d = (_c = braveData.web) === null || _c === void 0 ? void 0 : _c.results) === null || _d === void 0 ? void 0 : _d.map((result) => ({
            title: result.title,
            url: result.url,
            description: result.description,
        }))) !== null && _e !== void 0 ? _e : [];
        const response = {
            query: (_g = (_f = braveData.query) === null || _f === void 0 ? void 0 : _f.original) !== null && _g !== void 0 ? _g : query,
            results,
            totalResults: results.length,
        };
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(response),
        };
    }
    catch (error) {
        console.error('Search error:', error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VhcmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRFQUd5QztBQTZCekMsTUFBTSxhQUFhLEdBQUcsSUFBSSw2Q0FBb0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUVuRCxJQUFJLFlBQVksR0FBa0IsSUFBSSxDQUFDO0FBRXZDLEtBQUssVUFBVSxjQUFjO0lBQzNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDakIsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUM7SUFDekQsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0RBQXdELENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQsTUFBTSxPQUFPLEdBQUcsSUFBSSw4Q0FBcUIsQ0FBQyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ3BFLE1BQU0sUUFBUSxHQUFHLE1BQU0sYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVuRCxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7SUFDckMsT0FBTyxZQUFZLENBQUM7QUFDdEIsQ0FBQztBQUVNLE1BQU0sT0FBTyxHQUFHLEtBQUssRUFBRSxLQUc3QixFQUlFLEVBQUU7O0lBQ0gsTUFBTSxXQUFXLEdBQUc7UUFDbEIsNkJBQTZCLEVBQUUsR0FBRztRQUNsQyw4QkFBOEIsRUFBRSxjQUFjO1FBQzlDLDhCQUE4QixFQUFFLGNBQWM7UUFDOUMsY0FBYyxFQUFFLGtCQUFrQjtLQUNuQyxDQUFDO0lBRUYsd0JBQXdCO0lBQ3hCLElBQUks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Q25CLEtBQUssRUFBRSx1QkFBdUI7Z0JBQzlCLE9BQU8sRUFBRSxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxlQUFlO2FBQ2xFLENBQUM7U0FDSCxDQUFDO0lBQ0osQ0FBQztBQUNILENBQUMsQ0FBQztBQTVGVyxRQUFBLE9BQU8sV0E0RmxCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgU2VjcmV0c01hbmFnZXJDbGllbnQsXG4gIEdldFNlY3JldFZhbHVlQ29tbWFuZCxcbn0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LXNlY3JldHMtbWFuYWdlcic7XG5cbmludGVyZmFjZSBCcmF2ZVNlYXJjaFJlc3VsdCB7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgQnJhdmVXZWJSZXN1bHQge1xuICB0aXRsZTogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbiAgZGVzY3JpcHRpb246IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIEJyYXZlU2VhcmNoUmVzcG9uc2Uge1xuICB3ZWI/OiB7XG4gICAgcmVzdWx0cz86IEJyYXZlV2ViUmVzdWx0W107XG4gIH07XG4gIHF1ZXJ5Pzoge1xuICAgIG9yaWdpbmFsOiBzdHJpbmc7XG4gIH07XG59XG5cbmludGVyZmFjZSBTZWFyY2hSZXNwb25zZSB7XG4gIHF1ZXJ5OiBzdHJpbmc7XG4gIHJlc3VsdHM6IEJyYXZlU2VhcmNoUmVzdWx0W107XG4gIHRvdGFsUmVzdWx0czogbnVtYmVyO1xufVxuXG5jb25zdCBzZWNyZXRzQ2xpZW50ID0gbmV3IFNlY3JldHNNYW5hZ2VyQ2xpZW50KHt9KTtcblxubGV0IGNhY2hlZEFwaUtleTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEJyYXZlQXBpS2V5KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGlmIChjYWNoZWRBcGlLZXkpIHtcbiAgICByZXR1cm4gY2FjaGVkQXBpS2V5O1xuICB9XG5cbiAgY29uc3Qgc2VjcmV0TmFtZSA9IHByb2Nlc3MuZW52LkJSQVZFX0FQSV9LRVlfU0VDUkVUX05BTUU7XG4gIGlmICghc2VjcmV0TmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQlJBVkVfQVBJX0tFWV9TRUNSRVRfTkFNRSBlbnZpcm9ubWVudCB2YXJpYWJsZSBub3Qgc2V0Jyk7XG4gIH1cblxuICBjb25zdCBjb21tYW5kID0gbmV3IEdldFNlY3JldFZhbHVlQ29tbWFuZCh7IFNlY3JldElkOiBzZWNyZXROYW1lIH0pO1xuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlY3JldHNDbGllbnQuc2VuZChjb21tYW5kKTtcblxuICBpZiAoIXJlc3BvbnNlLlNlY3JldFN0cmluZykge1xuICAgIHRocm93IG5ldyBFcnJvcignU2VjcmV0IHZhbHVlIGlzIGVtcHR5Jyk7XG4gIH1cblxuICBjYWNoZWRBcGlLZXkgPSByZXNwb25zZS5TZWNyZXRTdHJpbmc7XG4gIHJldHVybiBjYWNoZWRBcGlLZXk7XG59XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVyID0gYXN5bmMgKGV2ZW50OiB7XG4gIHF1ZXJ5U3RyaW5nUGFyYW1ldGVycz86IHsgcT86IHN0cmluZyB9O1xuICBoZWFkZXJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbn0pOiBQcm9taXNlPHtcbiAgc3RhdHVzQ29kZTogbnVtYmVyO1xuICBoZWFkZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBib2R5OiBzdHJpbmc7XG59PiA9PiB7XG4gIGNvbnN0IGNvcnNIZWFkZXJzID0ge1xuICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXG4gICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnQ29udGVudC1UeXBlJyxcbiAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6ICdHRVQsIE9QVElPTlMnLFxuICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gIH07XG5cbiAgLy8gSGFuZGxlIENPUlMgcHJlZmxpZ2h0XG4gIGlmIChldmVudC5oZWFkZXJzPy5bJ2h0dHBNZXRob2QnXSA9PT0gJ09QVElPTlMnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICAgIGhlYWRlcnM6IGNvcnNIZWFkZXJzLFxuICAgICAgYm9keTogJycsXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IHF1ZXJ5ID0gZXZlbnQucXVlcnlTdHJpbmdQYXJhbWV0ZXJzPy5xO1xuXG4gIGlmICghcXVlcnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhdHVzQ29kZTogNDAwLFxuICAgICAgaGVhZGVyczogY29yc0hlYWRlcnMsXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGVycm9yOiAnTWlzc2luZyBxdWVyeSBwYXJhbWV0ZXIgXCJxXCInIH0pLFxuICAgIH07XG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IGFwaUtleSA9IGF3YWl0IGdldEJyYXZlQXBpS2V5KCk7XG5cbiAgICBjb25zdCBzZWFyY2hVcmwgPSBuZXcgVVJMKCdodHRwczovL2FwaS5zZWFyY2guYnJhdmUuY29tL3Jlcy92MS93ZWIvc2VhcmNoJyk7XG4gICAgc2VhcmNoVXJsLnNlYXJjaFBhcmFtcy5zZXQoJ3EnLCBxdWVyeSk7XG4gICAgc2VhcmNoVXJsLnNlYXJjaFBhcmFtcy5zZXQoJ2NvdW50JywgJzEwJyk7XG5cbiAgICBjb25zdCBicmF2ZVJlc3BvbnNlID0gYXdhaXQgZmV0Y2goc2VhcmNoVXJsLnRvU3RyaW5nKCksIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICdYLVN1YnNjcmlwdGlvbi1Ub2tlbic6IGFwaUtleSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBpZiAoIWJyYXZlUmVzcG9uc2Uub2spIHtcbiAgICAgIGNvbnN0IGVycm9yVGV4dCA9IGF3YWl0IGJyYXZlUmVzcG9uc2UudGV4dCgpO1xuICAgICAgY29uc29sZS5lcnJvcignQnJhdmUgQVBJIGVycm9yOicsIGJyYXZlUmVzcG9uc2Uuc3RhdHVzLCBlcnJvclRleHQpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhdHVzQ29kZTogYnJhdmVSZXNwb25zZS5zdGF0dXMsXG4gICAgICAgIGhlYWRlcnM6IGNvcnNIZWFkZXJzLFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgZXJyb3I6ICdTZWFyY2ggQVBJIGVycm9yJyxcbiAgICAgICAgICBkZXRhaWxzOiBlcnJvclRleHQsXG4gICAgICAgIH0pLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBicmF2ZURhdGE6IEJyYXZlU2VhcmNoUmVzcG9uc2UgPSBhd2FpdCBicmF2ZVJlc3BvbnNlLmpzb24oKTtcblxuICAgIGNvbnN0IHJlc3VsdHM6IEJyYXZlU2VhcmNoUmVzdWx0W10gPVxuICAgICAgYnJhdmVEYXRhLndlYj8ucmVzdWx0cz8ubWFwKChyZXN1bHQpID0+ICh7XG4gICAgICAgIHRpdGxlOiByZXN1bHQudGl0bGUsXG4gICAgICAgIHVybDogcmVzdWx0LnVybCxcbiAgICAgICAgZGVzY3JpcHRpb246IHJlc3VsdC5kZXNjcmlwdGlvbixcbiAgICAgIH0pKSA/PyBbXTtcblxuICAgIGNvbnN0IHJlc3BvbnNlOiBTZWFyY2hSZXNwb25zZSA9IHtcbiAgICAgIHF1ZXJ5OiBicmF2ZURhdGEucXVlcnk/Lm9yaWdpbmFsID8/IHF1ZXJ5LFxuICAgICAgcmVzdWx0cyxcbiAgICAgIHRvdGFsUmVzdWx0czogcmVzdWx0cy5sZW5ndGgsXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgICBoZWFkZXJzOiBjb3JzSGVhZGVycyxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSxcbiAgICB9O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1NlYXJjaCBlcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1c0NvZGU6IDUwMCxcbiAgICAgIGhlYWRlcnM6IGNvcnNIZWFkZXJzLFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBlcnJvcjogJ0ludGVybmFsIHNlcnZlciBlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ1Vua25vd24gZXJyb3InLFxuICAgICAgfSksXG4gICAgfTtcbiAgfVxufTtcbiJdfQ==