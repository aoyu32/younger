/**
 * 验证码接口类型定义
 * @description 对应 Apifox 文档「公共模块/验证码」
 */

/** 验证码类型：blockPuzzle 滑块拼图，clickWord 文字点选 */
export type CaptchaType = 'blockPuzzle' | 'clickWord';

/** 生成验证码入参 */
export interface CaptchaGenerateRequest {
  captchaType: CaptchaType;
}

/** 生成验证码出参 */
export interface CaptchaGenerateResponse {
  /** 验证码 token，后续校验时回传 */
  token: string;
  /** 前端坐标加密密钥，提交 pointJson 前加密用 */
  secretKey: string;
  /** 原图 Base64 编码 */
  originalImageBase64: string;
  /** 滑块图 Base64 编码，仅滑块拼图有值 */
  jigsawImageBase64?: string;
  /** 待点选文字列表，仅文字点选有值 */
  wordList?: string[];
}

/** 验证码前端校验入参 */
export interface CaptchaCheckRequest {
  captchaType: CaptchaType;
  /** 生成接口返回的 token */
  token: string;
  /** 滑动/点选坐标 JSON，前端按 AJ 协议组装 */
  pointJson: string;
}

/** 验证码前端校验出参 */
export interface CaptchaCheckResponse {
  /** 二次验证凭证，一次性使用，注册/登录时回传后端二次验证 */
  captchaVerification: string;
}
