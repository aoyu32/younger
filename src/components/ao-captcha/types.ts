/**
 * ao-captcha 通用组件契约类型
 * @description 本组件不依赖任何项目内模块（api / utils / request），
 * 生成验证码、校验验证码、坐标加密三个能力全部由使用方通过 props 注入，
 * 因此可直接复制到其他项目使用。
 */

/** 生成验证码入参 */
export interface CaptchaGenerateParams {
  /** 验证码类型，如 'blockPuzzle' 滑块拼图、'clickWord' 文字点选 */
  captchaType: string;
}

/** 生成验证码出参（组件实际消费的字段） */
export interface CaptchaGenerateResult {
  /** 后端返回的唯一 token，校验时回传 */
  token: string;
  /** 坐标加密密钥，提交 pointJson 前加密用 */
  secretKey: string;
  /** 原图 Base64 编码（不带 data: 前缀） */
  originalImageBase64: string;
  /** 滑块图 Base64 编码，仅滑块拼图有值 */
  jigsawImageBase64?: string;
}

/** 校验验证码入参 */
export interface CaptchaCheckParams {
  /** 验证码类型 */
  captchaType: string;
  /** 生成接口返回的 token */
  token: string;
  /** 滑动/点选坐标 JSON（已按约定加密） */
  pointJson: string;
}

/** 校验验证码出参 */
export interface CaptchaCheckResult {
  /** 二次验证凭证，一次性使用，业务接口回传后端二次验证 */
  captchaVerification: string;
}

/** 生成验证码：使用方注入（如调后端 /captcha/generate） */
export type GenerateCaptchaFn = (
  params: CaptchaGenerateParams,
) => Promise<CaptchaGenerateResult>;

/** 校验验证码：使用方注入（如调后端 /captcha/check） */
export type CheckCaptchaFn = (
  params: CaptchaCheckParams,
) => Promise<CaptchaCheckResult>;

/** 坐标加密：使用方注入（如 AJ 协议的 AES 加密） */
export type EncryptPointFn = (
  plainText: string,
  secretKey: string,
) => string;
