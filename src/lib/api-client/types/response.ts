export type FetcherResponse<T = any> = FetcherSuccess<T> | FetcherError;

export interface FetcherSuccess<T> {
  success: true;
  data: T;
}

export interface FetcherError {
  success: false;
  error: FetchError;
  message: string;
}

const FETCH_TYPES = {
  networkError: 'network-error',
  serverError: 'server-error',
  notFound: 'not-found',
  unauthorized: 'unauthorized',
} as const;

export type FetchError = (typeof FETCH_TYPES)[keyof typeof FETCH_TYPES];
