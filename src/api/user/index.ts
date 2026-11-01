/**
 * 用户信息接口
 * @description 对应 Apifox「用户模块/用户信息」：
 * GET /api/user/profile 获取当前登录用户资料
 *
 * 未登录返回 401，由响应拦截器统一处理（跳登录页）。
 * 供前端刷新后恢复登录态（回填 pinia user 模块）。
 *
 * 用法：
 * import { getUserProfile } from '@/api/user';
 *
 * const profile = await getUserProfile();
 */
import { get, type RequestConfig } from '@/request';
import type { UserProfile } from './types';

export * from './types';

/** 获取当前登录用户资料 */
export function getUserProfile(config?: RequestConfig): Promise<UserProfile> {
  return get<UserProfile>('/user/profile', config);
}
