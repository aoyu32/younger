/**
 * 用户信息接口
 * @description 对应 Apifox「用户模块/用户信息」：
 * GET /api/user/profile         获取当前登录用户资料
 * PUT /api/user/profile/avatar  更新当前登录用户头像（需先经文件上传拿到 fileId 与 objectKey）
 * PUT /api/user/profile/update  更新当前登录用户资料（只覆盖非 null 字段）
 *
 * 未登录返回 401，由响应拦截器统一处理（跳登录页）。
 * 供前端刷新后恢复登录态（回填 pinia user 模块）。
 *
 * 用法：
 * import { getUserProfile } from '@/api/user';
 *
 * const profile = await getUserProfile();
 */
import { get, put, type RequestConfig } from '@/request';
import type {
  UserAvatarUpdateRequest,
  UserProfile,
  UserProfileUpdateRequest,
} from './types';

export * from './types';

/** 获取当前登录用户资料 */
export function getUserProfile(config?: RequestConfig): Promise<UserProfile> {
  return get<UserProfile>('/user/profile', config);
}

/** 更新当前登录用户头像 */
export function updateAvatar(
  data: UserAvatarUpdateRequest,
): Promise<UserProfile> {
  return put<UserProfile>('/user/profile/avatar', data);
}

/** 更新当前登录用户资料 */
export function updateProfile(
  data: UserProfileUpdateRequest,
): Promise<UserProfile> {
  return put<UserProfile>('/user/profile/update', data);
}
