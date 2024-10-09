import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

class Http {
  instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: "http://localhost:8080/wordwaves/",
      timeout: 10000000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.instance.interceptors.response.use(
      (response) => response,
      this.handleError
    );
  }

  private handleError = async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token has expired
      try {
      
        await this.post('/auth/logout');
      } catch (logoutError) {
        console.error('Error during logout:', logoutError);
      }

      localStorage.removeItem('user');

      window.location.href = '/sign-in';

      return Promise.reject(error);
    }
    return Promise.reject(error);
  };

  setToken(token: string) {
    console.log('New access token received');
  }

  clearToken() {
    delete this.instance.defaults.headers.common["Authorization"];
  }

  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.instance.get<T>(url, config);
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.post<T>(url, data, config);
  }

  put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.put<T>(url, data, config);
  }

  patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.patch<T>(url, data, config);
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete<T>(url, config);
  }
}

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };

  constructor({
    status,
    payload,
  }: {
    status: number;
    payload: { message: string; [key: string]: any };
  }) {
    super(`HTTP Error: ${status}`);
    this.status = status;
    this.payload = payload;

 
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class EntityError extends HttpError {
  status: number;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

const http = new Http();

export default http;
