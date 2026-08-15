/**
 * 校验规则定义
 */
export interface ValidateRule {
  /** 是否必填 */
  required?: boolean;
  /** 错误提示文字 */
  message?: string;
  /** 正则表达式校验 */
  pattern?: RegExp;
  /** 最小长度（字符串） */
  min?: number;
  /** 最大长度（字符串） */
  max?: number;
  /** 自定义校验函数，返回 true 表示通过，false 或字符串表示失败 */
  validator?: (value: string) => boolean | string;
  /** 触发校验的时机，默认 blur */
  trigger?: 'blur' | 'input' | 'change';
}