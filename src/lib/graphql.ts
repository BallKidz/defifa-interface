import { request, RequestDocument, Variables } from "graphql-request";

/**
 * Makes a GraphQL request with The Graph API key authorization header
 * @param url - The GraphQL endpoint URL
 * @param document - The GraphQL query/mutation document
 * @param variables - Variables for the query/mutation
 * @returns Promise with the response data
 */
export async function requestWithAuth<T = any>(
  url: string,
  document: RequestDocument,
  variables?: Variables
): Promise<T> {
  const apiKey = process.env.NEXT_PUBLIC_THEGRAPH_API_KEY;
  
  if (!apiKey) {
    console.warn("NEXT_PUBLIC_THEGRAPH_API_KEY not found, making request without authorization");
    return request<T>(url, document, variables);
  }
  
  // Create a custom fetch function with the Authorization header
  const customFetch = (input: RequestInfo | URL, init?: RequestInit) => {
    return fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  };

  return request<T>({
    url,
    document,
    variables,
    requestHeaders: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });
}
