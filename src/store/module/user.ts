/**
 * 用户模块（pinia）
 * @description 保存后端返回的用户信息并维护登录态。
 * 鉴权 token 由后端经 HttpOnly Cookie 下发，浏览器自动携带，前端不存 token。
 */
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { GenderCode } from '@/api/user/types';

/** 前端保存的用户信息（核心字段必填，注册/登录接口出参，剔除 token） */
export interface UserInfo {
  /** 用户 ID（雪花 ID 字符串） */
  userId: string;
  /** 用户昵称 */
  nickname: string;
  /** 头像地址，未设置时为 null */
  avatar: string | null;
  /** 角色编码列表，如 ['ROLE_USER'] */
  roles: string[];
  /** 用户名，登录标识（仅用户资料接口返回） */
  username?: string;
  /** 个人简介 */
  bio?: string;
  /** 性别编码：0 未知，1 男，2 女（仅用户资料接口返回） */
  gender?: GenderCode;
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

export const useUserStore = defineStore('user', () => {
  /** 当前登录用户，未登录为 null */
  const userInfo = ref<UserInfo | null>(null);

  /** 是否已登录 */
  const isLogin = computed(() => userInfo.value !== null);

  /** 注册/登录成功后保存用户信息，即完成自动登录 */
  const login = (info: UserInfo) => {
    userInfo.value = info;
  };

  /** 退出登录：清空用户信息 */
  const logout = () => {
    userInfo.value = null;
  };

  return { userInfo, isLogin, login, logout };
});
