/**
 * 请求模块类型定义
 * @description 后端统一响应结构、请求配置扩展、统一错误对象
 */
import type { AxiosRequestConfig } from 'axios';

/** 后端统一响应结构（com.younger.ys.result.Result） */
export interface ApiResult<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/**
 * 约定：后端的 Long 型 ID（雪花 ID，超 JS 精度）一律按 string 处理，
 * 写接口类型时 ID 字段用 string，不要用 number，也不要做数值运算。
 */

/** 与后端 ResultCode 枚举保持一致 */
export const ResultCode = {
  SUCCESS: 200,
  PARAM_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  ERROR: 500,
} as const;

/** 客户端错误码：网络异常 / 请求取消 */
export const CLIENT_ERROR_CODE = {
  NETWORK: -1,
  CANCELED: -2,
} as const;

/** 请求配置扩展 */
export interface RequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  /** 不弹统一错误提示、不打印日志，提示交给调用方 */
  silent?: boolean;
  /** 401 时不跳转登录页，用于启动探测等允许匿名失败的请求 */
  skipAuthRedirect?: boolean;
  /** 返回完整 AxiosResponse（读取响应头，如文件名） */
  rawResponse?: boolean;
}

export interface ApiErrorOptions {
  /** 业务状态码，缺省 500 */
  code?: number;
  /** HTTP 状态码 */
  status?: number;
  /** 后端返回的 data（参数校验错误时为字段错误映射） */
  data?: unknown;
  /** 请求配置，便于调用方判断是否可重试 */
  config?: RequestConfig;
}

/** 统一的请求错误：拦截器抛出的都是该类型 */
export class ApiError extends Error {
  readonly code: number;
  readonly status?: number;
  readonly data?: unknown;
  readonly config?: RequestConfig;

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = options.code ?? ResultCode.ERROR;
    this.status = options.status;
    this.data = options.data;
    this.config = options.config;
    // 兼容编译到 ES5 时 instanceof 失效的问题
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
