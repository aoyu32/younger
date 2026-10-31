/**
 * 验证码接口
 * @description 对应 Apifox「公共模块/验证码」：
 * POST /captcha/generate 生成验证码，POST /captcha/check 校验验证码
 *
 * 响应是标准的 Result 结构（{ code, message, data }），
 * 请求拦截器会自动解包 data，失败时自动弹错误提示。
 *
 * 用法：
 * import { generateCaptcha, checkCaptcha } from '@/api/captcha';
 *
 * const data = await generateCaptcha({ captchaType: 'blockPuzzle' });
 * const { captchaVerification } = await checkCaptcha({
 *   captchaType: 'blockPuzzle',
 *   token: data.token,
 *   pointJson,
 * });
 */
import { post } from '@/request';
import type {
  CaptchaCheckRequest,
  CaptchaCheckResponse,
  CaptchaGenerateRequest,
  CaptchaGenerateResponse,
} from './types';

export * from './types';

/** 生成验证码：返回 Base64 图片与 token（公开接口；失败由组件内联提示，不弹全局 toast） */
export function generateCaptcha(
  data: CaptchaGenerateRequest,
): Promise<CaptchaGenerateResponse> {
  return post<CaptchaGenerateResponse>('/captcha/generate', data, {
    silent: true,
  });
}

/** 校验验证码：通过后返回一次性 captchaVerification（公开接口；失败由组件内联提示） */
export function checkCaptcha(
  data: CaptchaCheckRequest,
): Promise<CaptchaCheckResponse> {
  return post<CaptchaCheckResponse>('/captcha/check', data, { silent: true });
}
