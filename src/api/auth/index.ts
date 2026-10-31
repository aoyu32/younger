/**
 * 用户认证接口
 * @description 对应后端「用户模块」：
 * POST /api/user/auth/register 用户注册（需邮箱验证码）
 * POST /api/user/auth/login    用户登录（用户名/邮箱 + 密码）
 * POST /api/user/auth/logout   退出登录（服务端删会话并清 Cookie）
 */
import { post, type RequestConfig } from '@/request';
import type {
  RegisterRequest,
  RegisterResponse,
  UserLoginRequest,
  UserLoginResponse,
} from './types';

export * from './types';

/** 用户注册：携带邮箱验证码 emailCode（一次性使用），不再需要滑块凭证 */
export function register(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  return post<RegisterResponse>('/user/auth/register', data);
}

/** 用户登录：用户名/邮箱 + 密码，成功即建立登录态（Web 走 HttpOnly Cookie） */
export function login(
  data: UserLoginRequest,
  config?: RequestConfig,
): Promise<UserLoginResponse> {
  return post<UserLoginResponse>('/user/auth/login', data, config);
}

/** 退出登录：服务端删除会话并清除 Cookie */
export function logout(config?: RequestConfig): Promise<void> {
  return post<void>('/user/auth/logout', undefined, config);
}
