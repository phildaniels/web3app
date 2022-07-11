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

export function okResult<TData>(
  message: string,
  data?: TData
): ApiResponse<TData> {
  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      message,
      data,
    },
  };
}

export function createdResult<TData>(
  message: string,
  data?: TData
): ApiResponse<TData> {
  return {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      message,
      data,
    },
  };
}

export function badRequestResult(
  message: string,
  errors?: string[]
): ApiResponse<{}> {
  return {
    status: 400,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      message,
      errors,
    },
  };
}

export function notFoundResult(message: string): ApiResponse<{}> {
  return {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      message,
    },
  };
}

export function internalServerErrorResult(message: string): ApiResponse<{}> {
  return {
    status: 500,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      message,
    },
  };
}

export function noContentResult(): ApiResponse<{}> {
  return {
    status: 204,
  };
}

export function statusCodeResult(
  status: number,
  message: string,
  data?: any,
  errors?: string[]
): ApiResponse<any> {
  return {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      message,
      data,
      errors,
    },
  };
}
