/**
 * 验证码发送接口
 * @description 对应 Apifox「验证码发送」：
 * POST /api/verification/codes/register       发送注册验证码
 * POST /api/verification/codes/reset-password  发送重置密码验证码
 * POST /api/verification/codes/login           发送登录验证码
 * POST /api/verification/codes/change-email    发送换绑邮箱验证码（需登录）
 * POST /api/verification/codes/change-phone    发送换绑手机验证码（需登录）
 *
 * 响应是 ResultVoid（{ code, message, data: null }），code=200 即发送成功。
 * 同一目标有发送冷却与每日上限；高频时后端返回 body code=429，
 * 调用方应弹滑块验证，拿到一次性 captchaVerification 后重发一次。
 * 透传字段直接放在 data 里即可（captchaVerification 可选）。
 *
 * 用法：
 * import { sendRegisterCode } from '@/api/codes';
 *
 * await sendRegisterCode({ channel: 'EMAIL', target: form.email });
 * // 429 重发：
 * await sendRegisterCode({ channel: 'EMAIL', target: form.email, captchaVerification }, { silent: true });
 */
import { post, type RequestConfig } from '@/request';
import type { CodeSendRequest, CodeTargetRequest } from './types';

export * from './types';

/** 发送注册验证码 */
export function sendRegisterCode(
  data: CodeSendRequest,
  config?: RequestConfig,
): Promise<void> {
  return post<void>('/verification/codes/register', data, config);
}

/** 发送重置密码验证码 */
export function sendResetPasswordCode(
  data: CodeSendRequest,
  config?: RequestConfig,
): Promise<void> {
  return post<void>('/verification/codes/reset-password', data, config);
}

/** 发送登录验证码 */
export function sendLoginCode(
  data: CodeSendRequest,
  config?: RequestConfig,
): Promise<void> {
  return post<void>('/verification/codes/login', data, config);
}

/** 发送换绑邮箱验证码（需登录，向新邮箱发送） */
export function sendChangeEmailCode(
  data: CodeTargetRequest,
  config?: RequestConfig,
): Promise<void> {
  return post<void>('/verification/codes/change-email', data, config);
}

/** 发送换绑手机验证码（需登录，向新手机号发送） */
export function sendChangePhoneCode(
  data: CodeTargetRequest,
  config?: RequestConfig,
): Promise<void> {
  return post<void>('/verification/codes/change-phone', data, config);
}
