export interface FetcherOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
  token?: string;
  queryParams?: Record<string, string | boolean>;
}
