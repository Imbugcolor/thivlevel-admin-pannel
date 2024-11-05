type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
  token?: string | null;
};

export class HttpError extends Error {
  status: number;
  message: string;
  constructor({ status, message }: { status: number; message: string }) {
    super("Http Error");
    this.status = status;
    this.message = message;
  }
}

export const request = async <T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined;

  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }

  const baseHeaders: {
    [key: string]: string;
  } =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };

  if (options && options.token) {
    baseHeaders["Authorization"] = `Bearer ${options.token}`;
  }

  const baseUrl =
    options?.baseUrl === undefined
      ? process.env.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  try {
    const res = await fetch(fullUrl, {
      method,
      body,
      headers: baseHeaders,
    });
    if (!res.ok) {
      const errorData = await res.json();

      throw new HttpError({
        status: res.status,
        message: errorData.message || res.statusText,
      });
    }

    const payload: T = await res.json();

    const data = {
      status: res.status,
      payload,
    };

    return data;
  } catch (error: unknown) {
    console.log(error);
    throw new HttpError({
      status: 500,
      message: (error as HttpError).message || "An unexpected error occurred.",
    });
  }
};

export const http = {
  get<T>(url: string, options?: Omit<CustomOptions, "body"> | undefined) {
    return request<T>("GET", url, options);
  },
  post<T>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<T>("POST", url, { ...options, body });
  },
  put<T>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<T>("PUT", url, { ...options, body });
  },
  patch<T>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<T>("PATCH", url, { ...options, body });
  },
  delete<T>(url: string, options?: Omit<CustomOptions, "body"> | undefined) {
    return request<T>("DELETE", url, { ...options });
  },
};
