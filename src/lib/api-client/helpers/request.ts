import { FetcherOptions } from '../types/request';
import { FetcherResponse, FetchError } from '../types/response';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE) {
  throw new Error('API_BASE url not configured');
}

export const mountEndpoint = (
  path: string,
  queryParams?: Record<string, string | boolean>,
): string => {
  let endpoint = path;

  if (queryParams) {
    const searchParams = new URLSearchParams();

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();

    if (queryString) {
      endpoint += `${path.includes('?') ? '&' : '?'}${queryString}`;
    }
  }

  return API_BASE + endpoint;
};

export const mountHeaders = (
  headers?: Record<string, string>,
  body?: any,
  token?: string,
): Record<string, string> => {
  let finalHeaders = {
    ...headers,
  };

  if (body && !finalHeaders['Content-Type']) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  return finalHeaders;
};

export async function fetcher<T = any>(
  path: string,
  options: FetcherOptions = {},
): Promise<FetcherResponse<T>> {
  const { method = 'GET', body, headers = {}, token, queryParams } = options;

  const endpoint = mountEndpoint(path, queryParams);
  const finalHeaders = mountHeaders(headers, body, token);

  try {
    const response = await fetch(endpoint, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return {
      success: false,
      error: 'network-error',
      message:
        error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

export async function uploadFile<T = { url: string }>(
  path: string,
  file: File,
  token?: string,
): Promise<FetcherResponse<T>> {
  const endpoint = mountEndpoint(path);

  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return {
      success: false,
      error: 'upload-error',
      message: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}
