/**
 * 用户 store 的状态类型
 * @description 由 store 自行维护，不直接复用接口层模型：
 * 接口返回结构变化时，在这里做一次适配即可，页面不受影响。
 */

/**
 * 当前登录用户。
 * 登录/注册接口只返回基础字段（userId、昵称、头像、角色），
 * 简介、性别、地区、加入时间等由资料接口补齐，因此除基础字段外均为可选。
 */
export interface UserInfo {
  /** 用户 ID（雪花 ID，后端序列化为字符串） */
  userId: string;
  /** 用户昵称 */
  nickname: string;
  /** 头像地址，未设置时为 null */
  avatar: string | null;
  /** 角色编码列表，如 ['ROLE_USER'] */
  roles: string[];
  /** 用户名，登录标识（仅资料接口返回） */
  username?: string;
  /** 个人简介 */
  bio?: string;
  /** 性别：0 未知，1 男，2 女（仅资料接口返回） */
  gender?: 0 | 1 | 2;
  /** 出生日期 yyyy-MM-dd */
  birthday?: string;
  /** 国家 */
  country?: string;
  /** 省份 */
  province?: string;
  /** 城市 */
  city?: string;
  /** 职业 */
  profession?: string;
  /** 加入时间 */
  createdTime?: string;
}
