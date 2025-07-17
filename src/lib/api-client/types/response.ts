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

export enum FetchError {
  NETWORK_ERROR = "NETWORK_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
}
