/**
 * 用户信息接口类型定义
 * @description 对应 Apifox 文档「用户模块/用户信息」：
 * 获取当前登录用户资料
 */

/** 性别：0 未知，1 男，2 女（与后端一致，展示时再映射为文字） */
export type GenderCode = 0 | 1 | 2;

/** 更新用户头像入参（与后端 UserAvatarUpdateRequest 对齐） */
export interface UserAvatarUpdateRequest {
  /** 图片文件 ID，取自文件上传返回的 fileId */
  imageId: string;
  /** 头像对象键，取自文件上传返回的 objectKey，必须来自头像上传场景 */
  objectKey: string;
}

/** 更新用户资料入参（与后端 UserProfileUpdateRequest 对齐，非 null 字段才覆盖） */
export interface UserProfileUpdateRequest {
  /** 昵称，1~50 字 */
  nickname?: string;
  /** 用户名，4~20 位字母、数字或下划线，不可与他人重复 */
  username?: string;
  /** 性别：0 未知，1 男，2 女 */
  gender?: GenderCode;
  /** 出生日期，不能是未来日期 */
  birthday?: string;
  /** 个人简介，最长 500 字 */
  bio?: string;
  /** 国家 */
  country?: string;
  /** 省份/州 */
  province?: string;
  /** 城市 */
  city?: string;
  /** 职业，最长 100 字 */
  profession?: string;
}

/** 当前登录用户资料（与后端 UserProfileResponse 对齐） */
export interface UserProfile {
  /** 用户 ID（雪花 ID，后端序列化为字符串，前端当字符串用） */
  userId: string;
  /** 用户名，登录标识，不可修改 */
  username: string;
  /** 用户昵称 */
  nickname: string;
  /** 头像地址，未设置时为空 */
  avatar: string | null;
  /** 个人简介，未设置时为空 */
  bio: string;
  /** 性别：0 未知，1 男，2 女 */
  gender: GenderCode;
  /** 出生日期（yyyy-MM-dd），未设置时为空 */
  birthday: string;
  /** 国家，未设置时为空 */
  country: string;
  /** 省份，未设置时为空 */
  province: string;
  /** 城市，未设置时为空 */
  city: string;
  /** 职业，未设置时为空 */
  profession: string;
  /** 加入时间（如 2026-10-31 12:00:00） */
  createdTime: string;
  /** 角色编码列表，如 ['ROLE_USER'] */
  roles: string[];
}

/**
 * 登录/注册响应里的基础用户信息。
 * 简介、性别、地区、加入时间等字段只有资料接口（UserProfile）才返回。
 */
export type UserProfileBasic = Pick<
  UserProfile,
  'userId' | 'nickname' | 'avatar' | 'roles'
>;
