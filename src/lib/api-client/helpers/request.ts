import { FetcherOptions } from '../types/request';
import { FetcherResponse, FetchError } from '../types/response';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE) {
  throw new Error('API_BASE url not configured');
}

// Track refresh state to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

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

/**
 * Attempts to refresh the access token using the refresh token from localStorage
 * Returns the new access token if successful, null otherwise
 */
async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  const refreshToken = localStorage.getItem('refresh_token');

  if (!refreshToken) {
    return null;
  }

  try {
    const endpoint = mountEndpoint('/auth/refresh');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await response.json();

    if (data.success && data.data) {
      // Store new tokens
      localStorage.setItem('token', data.data.access_token);
      localStorage.setItem('refresh_token', data.data.refresh_token);
      return data.data.access_token;
    }

    // Refresh failed, clear tokens
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('subscription');
    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('subscription');
    return null;
  }
}

/**
 * Enhanced fetcher with automatic token injection and refresh on 401
 */
export async function fetcher<T = any>(
  path: string,
  options: FetcherOptions = {},
): Promise<FetcherResponse<T>> {
  const { method = 'GET', body, headers = {}, token, queryParams } = options;

  // Automatically inject token from localStorage if not provided and not a public auth endpoint
  const isPublicAuthEndpoint =
    path.includes('/auth/login') ||
    path.includes('/auth/register') ||
    path.includes('/auth/refresh');

  let authToken = token;
  if (!authToken && !isPublicAuthEndpoint && typeof window !== 'undefined') {
    authToken = localStorage.getItem('token') || undefined;
  }

  const endpoint = mountEndpoint(path, queryParams);
  const finalHeaders = mountHeaders(headers, body, authToken);

  try {
    const response = await fetch(endpoint, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!data.success && response.status >= 500) {
      console.error(`API ${response.status} on ${method} ${path}:`, data);
    }

    // Handle 401 Unauthorized - attempt token refresh
    if (!data.success && response.status === 401 && !isPublicAuthEndpoint) {
      // Prevent multiple simultaneous refresh attempts
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken();
      }

      const newToken = await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;

      if (newToken) {
        // Retry the original request with the new token
        const retryHeaders = mountHeaders(headers, body, newToken);
        const retryResponse = await fetch(endpoint, {
          method,
          headers: retryHeaders,
          body: body ? JSON.stringify(body) : undefined,
        });

        const retryData = await retryResponse.json();
        return retryData;
      } else {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return {
          success: false,
          error: 'unauthorized',
          message: 'Session expired. Please login again.',
        };
      }
    }

    return data;
  } catch (error) {
    console.error(`Request failed on ${method} ${path}:`, error);
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

  // Automatically inject token from localStorage if not provided
  let authToken = token;
  if (!authToken && typeof window !== 'undefined') {
    authToken = localStorage.getItem('token') || undefined;
  }

  const headers: Record<string, string> = {};
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
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
