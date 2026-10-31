/**
 * 验证码发送接口类型定义
 * @description 对应 Apifox 文档「验证码发送」：
 * 注册 / 重置密码 / 登录 / 换绑邮箱 / 换绑手机
 */

/** 消息通道 */
export type CodeChannel = 'EMAIL' | 'SMS';

/** 发送验证码入参（注册 / 重置密码 / 登录） */
export interface CodeSendRequest {
  /** 消息通道：EMAIL 邮箱，SMS 短信 */
  channel: CodeChannel;
  /** 接收目标：邮箱或手机号 */
  target: string;
  /**
   * 滑块验证凭证，一次性消费，平时不传；
   * 收到 body code=429 后完成滑块验证并重发时携带
   */
  captchaVerification?: string;
}

/** 发送验证码入参（换绑邮箱 / 换绑手机，需登录） */
export interface CodeTargetRequest {
  /** 接收目标：新邮箱或新手机号 */
  target: string;
  /**
   * 滑块验证凭证，一次性消费，平时不传；
   * 收到 body code=429 后完成滑块验证并重发时携带
   */
  captchaVerification?: string;
}
