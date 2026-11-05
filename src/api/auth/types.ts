/**
 * 用户认证接口类型定义
 * @description 对应 Apifox 文档「用户模块/用户认证」
 */
import type { CodeChannel } from '../codes/types';

/** 用户注册入参（与后端 UserRegisterRequest 对齐） */
export interface RegisterRequest {
  /** 用户名，4~20 位字母、数字或下划线 */
  username: string;
  /** 邮箱地址 */
  email: string;
  /** 邮箱验证码：发送注册验证码接口下发，一次性使用 */
  emailCode: string;
  /** 明文密码，8~64 位 */
  password: string;
  /**
   * 保持登录：true 时后端下发 30 天持久化 Cookie（关浏览器后仍保持），
   * false 时下发会话级 Cookie（关闭浏览器即失效）
   */
  rememberMe?: boolean;
}

/** 用户登录方式 */
export type LoginType =
  | 'USERNAME_PASSWORD'
  | 'EMAIL_PASSWORD'
  | 'PHONE_PASSWORD'
  | 'PHONE_SMS_CODE'
  | 'WECHAT_SCAN';

/** 用户登录入参（与后端 UserLoginRequest 对齐） */
export interface UserLoginRequest {
  /** 登录方式：USERNAME_PASSWORD（用户名+密码）、EMAIL_PASSWORD（邮箱+密码） */
  loginType: LoginType;
  /** 登录账号：用户名或邮箱，由登录方式决定 */
  account: string;
  /** 明文密码 */
  password: string;
  /**
   * 保持登录：true 时后端下发 30 天持久化 Cookie（关浏览器后仍保持），
   * false 时下发会话级 Cookie（关闭浏览器即失效）
   */
  rememberMe?: boolean;
  /**
   * 滑块验证凭证，一次性消费，平时不传；
   * 连续登录失败达阈值 / 收到 body code=429 后完成滑块验证并重试时携带
   */
  captchaVerification?: string;
}

/** 用户登录出参（与后端 UserLoginResponse 对齐） */
export interface UserLoginResponse {
  /** 新用户 ID（雪花 ID，后端序列化为字符串，前端当字符串用） */
  userId: string;
  /** 用户昵称 */
  nickname: string;
  /** 头像地址，未设置时为 null */
  avatar: string | null;
  /** 角色编码列表，如 ['ROLE_USER'] */
  roles: string[];
  /**
   * 访问令牌，仅 App/开放端返回；
   * Web 端经 HttpOnly Cookie 下发，此处为空，前端不存储、不使用
   */
  token: string;
}

/** 忘记密码重置入参（与后端 PasswordForgotRequest 对齐） */
export interface PasswordForgotRequest {
  /** 验证通道：EMAIL 邮箱，SMS 短信 */
  channel: CodeChannel;
  /** 账号：邮箱或手机号 */
  account: string;
  /** 验证码：发送重置密码验证码接口下发，一次性使用 */
  code: string;
  /** 新密码，8~64 位 */
  newPassword: string;
}

/** 登录后修改密码入参（与后端 PasswordChangeRequest 对齐） */
export interface PasswordChangeRequest {
  /** 原密码 */
  oldPassword: string;
  /** 新密码，8~64 位 */
  newPassword: string;
}
/** 用户注册出参（与后端 UserRegisterResponse 对齐） */
export interface RegisterResponse {
  /** 新用户 ID（雪花 ID，后端序列化为字符串，前端当字符串用） */
  userId: string;
  /** 用户昵称 */
  nickname: string;
  /** 头像地址，未设置时为 null */
  avatar: string | null;
  /** 角色编码列表，如 ['ROLE_USER'] */
  roles: string[];
  /**
   * 访问令牌，仅 App/开放端返回；
   * Web 端经 HttpOnly Cookie 下发，此处为空，前端不存储、不使用
   */
  token: string;
}
