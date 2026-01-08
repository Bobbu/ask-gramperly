import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
}

interface BraveWebResult {
  title: string;
  url: string;
  description: string;
}

interface BraveSearchResponse {
  web?: {
    results?: BraveWebResult[];
  };
  query?: {
    original: string;
  };
}

interface SearchResponse {
  query: string;
  results: BraveSearchResult[];
  totalResults: number;
}

const secretsClient = new SecretsManagerClient({});

let cachedApiKey: string | null = null;

async function getBraveApiKey(): Promise<string> {
  if (cachedApiKey) {
    return cachedApiKey;
  }

  const secretName = process.env.BRAVE_API_KEY_SECRET_NAME;
  if (!secretName) {
    throw new Error('BRAVE_API_KEY_SECRET_NAME environment variable not set');
  }

  const command = new GetSecretValueCommand({ SecretId: secretName });
  const response = await secretsClient.send(command);

  if (!response.SecretString) {
    throw new Error('Secret value is empty');
  }

  cachedApiKey = response.SecretString;
  return cachedApiKey;
}

export const handler = async (event: {
  queryStringParameters?: { q?: string };
  headers?: Record<string, string>;
}): Promise<{
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}> => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight
  if (event.headers?.['httpMethod'] === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  const query = event.queryStringParameters?.q;

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

    const braveData: BraveSearchResponse = await braveResponse.json();

    const results: BraveSearchResult[] =
      braveData.web?.results?.map((result) => ({
        title: result.title,
        url: result.url,
        description: result.description,
      })) ?? [];

    const response: SearchResponse = {
      query: braveData.query?.original ?? query,
      results,
      totalResults: results.length,
    };

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(response),
    };
  } catch (error) {
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
