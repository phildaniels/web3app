export interface ApiResponse<T> {
  status: number;
  headers?: { [key: string]: string };
  body?: ApiResponseBody<T>;
}

export interface ApiResponseBody<T> {
  message?: string;
  data?: T;
  errors?: string[];
}
