/**
 * 用户信息接口类型定义
 * @description 对应 Apifox 文档「用户模块/用户信息」：
 * 获取当前登录用户资料
 */

/** 当前登录用户资料（与后端 UserInfoResponse 对齐） */
export interface UserProfile {
  /** 用户 ID（雪花 ID，后端序列化为字符串，前端当字符串用） */
  userId: string;
  /** 用户昵称 */
  nickname: string;
  /** 头像地址，未设置时为 null */
  avatar: string | null;
  /** 角色编码列表，如 ['ROLE_USER'] */
  roles: string[];
}
