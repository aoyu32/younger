/**
 * Axios 请求模块
 * @description 统一处理 baseURL、业务状态码校验、错误归一化与 401 登出
 *
 * 鉴权方式：Sa-Token HttpOnly cookie，浏览器自动携带。
 * 前端不存 token、不拼 Authorization 头（withCredentials: true 为唯一要求）。
 *
 * 后端返回结构（com.younger.ys.result.Result）：
 * { code: 200, message: 'success', data: T }
 * 注意：业务异常同样是 HTTP 200，必须按 code 判断，不能只看 HTTP 状态码。
 *
 * 用法：
 * import { get, post } from '@/request';
 */
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from 'axios';
import {
  ApiError,
  CLIENT_ERROR_CODE,
  ResultCode,
  type ApiResult,
  type RequestConfig,
} from './types';
import { message } from '@/components/ao-message';

export * from './types';

/** 已在登录相关页面时不再重复跳转 */
const AUTH_PAGES = ['/login', '/register', '/reset'];

/* --------------------------- 错误归一化 --------------------------- */

const HTTP_STATUS_MESSAGE: Record<number, string> = {
  400: '请求参数有误',
  401: '登录已过期，请重新登录',
  403: '没有访问权限',
  404: '请求的资源不存在',
  405: '请求方法不被允许',
  408: '请求超时，请稍后重试',
  413: '上传内容过大',
  429: '请求过于频繁，请稍后再试',
  500: '服务器开小差了，请稍后重试',
  502: '网关异常',
  503: '服务暂不可用',
  504: '网关超时',
};

const NETWORK_ERROR_MESSAGE: Record<string, string> = {
  ERR_NETWORK: '网络异常，请检查网络连接',
  ECONNABORTED: '请求超时，请稍后重试',
  ETIMEDOUT: '请求超时，请稍后重试',
  ERR_BAD_REQUEST: '请求失败',
  ERR_BAD_RESPONSE: '服务响应异常',
};

/** 判断是否为后端的统一响应结构 */
function isApiResult(value: unknown): value is ApiResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as ApiResult).code === 'number' &&
    typeof (value as ApiResult).message === 'string'
  );
}

/** 把 axios / 原生错误统一转成 ApiError */
function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isCancel(error)) {
    const config = axios.isAxiosError(error)
      ? (error.config as RequestConfig | undefined)
      : undefined;
    return new ApiError('请求已取消', {
      code: CLIENT_ERROR_CODE.CANCELED,
      config,
    });
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResult | undefined>;
    const config = axiosError.config as RequestConfig | undefined;
    const response = axiosError.response;
    const status = response?.status;
    const payload = response?.data;

    // 没有响应：断网、跨域失败、超时
    if (!response) {
      const message =
        NETWORK_ERROR_MESSAGE[axiosError.code ?? ''] ??
        '网络异常，请检查网络连接';
      return new ApiError(message, { code: CLIENT_ERROR_CODE.NETWORK, config });
    }

    const businessCode = isApiResult(payload) ? payload.code : undefined;
    const businessMessage = isApiResult(payload) ? payload.message : undefined;
    const message =
      businessMessage ||
      (status ? HTTP_STATUS_MESSAGE[status] : '') ||
      `请求失败${status ? `（${status}）` : ''}`;

    return new ApiError(message, {
      code: businessCode ?? status ?? ResultCode.ERROR,
      status,
      data: payload,
      config,
    });
  }

  if (error instanceof Error) {
    return new ApiError(error.message || '请求失败，请稍后重试');
  }

  return new ApiError('请求失败，请稍后重试');
}

/* ------------------------------ 实例 ------------------------------ */

export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_ADDRESS ?? '',
  timeout: 15000,
  withCredentials: true,
});

let redirecting = false;

/** 401：跳登录页（cookie 模式无本地 token 可清），已在登录相关页面不跳 */
function handleUnauthorized(): void {
  if (typeof window === 'undefined' || redirecting) return;
  const { pathname, search, hash } = window.location;
  if (AUTH_PAGES.includes(pathname)) return;
  redirecting = true;
  const redirect = encodeURIComponent(pathname + search + hash);
  window.location.replace(`/login?redirect=${redirect}`);
}

/** 统一的失败出口：提示 + 日志 + 401 处理 */
function handleFailure(error: ApiError): void {
  const config = error.config;
  const canceled = error.code === CLIENT_ERROR_CODE.CANCELED;

  if (import.meta.env.DEV && !config?.silent) {
    console.error(`[request] ${error.message}`, error);
  }

  // 后端的非正常响应统一用 message 提示；主动取消的请求、标记了 silent 的请求不提示
  if (!canceled && !config?.silent && typeof window !== 'undefined') {
    message.error(error.message || '请求失败，请稍后重试');
  }

  if (error.code === ResultCode.UNAUTHORIZED && !config?.skipAuthRedirect) {
    handleUnauthorized();
  }
}

http.interceptors.request.use(
  (config) => {
    // cookie 模式：登录态由浏览器自动携带，不拼 Authorization 头
    // 可选：loading 计数、请求 ID 在这里加
    return config;
  },
  (error: unknown) => {
    const apiError = normalizeError(error);
    handleFailure(apiError);
    return Promise.reject(apiError);
  },
);

http.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as RequestConfig;

    // 需要读取响应头（如文件名）时返回完整响应
    if (config.rawResponse) return response;

    const payload: unknown = response.data;

    // 文件流、纯文本、空响应等非统一结构原样返回
    if (!isApiResult(payload)) return payload as AxiosResponse;

    if (payload.code === ResultCode.SUCCESS) {
      return payload.data as AxiosResponse;
    }

    const apiError = new ApiError(payload.message || '请求失败', {
      code: payload.code,
      status: response.status,
      data: payload.data,
      config,
    });
    handleFailure(apiError);
    return Promise.reject(apiError);
  },
  (error: unknown) => {
    const apiError = normalizeError(error);
    handleFailure(apiError);
    return Promise.reject(apiError);
  },
);

/* ------------------------------ 方法 ------------------------------ */

/** 通用请求，返回值已由响应拦截器解包为 data */
export function request<T = unknown, D = unknown>(
  config: RequestConfig<D>,
): Promise<T> {
  return http.request(config) as unknown as Promise<T>;
}

export function get<T = unknown>(
  url: string,
  config?: RequestConfig,
): Promise<T> {
  return http.get(url, config) as unknown as Promise<T>;
}

export function post<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: RequestConfig<D>,
): Promise<T> {
  return http.post(url, data, config) as unknown as Promise<T>;
}

export function put<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: RequestConfig<D>,
): Promise<T> {
  return http.put(url, data, config) as unknown as Promise<T>;
}

export function patch<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: RequestConfig<D>,
): Promise<T> {
  return http.patch(url, data, config) as unknown as Promise<T>;
}

export function del<T = unknown>(
  url: string,
  config?: RequestConfig,
): Promise<T> {
  return http.delete(url, config) as unknown as Promise<T>;
}
