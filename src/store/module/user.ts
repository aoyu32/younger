/**
 * 用户模块（pinia）
 * @description 保存后端返回的用户信息并维护登录态。
 * 鉴权 token 由后端经 HttpOnly Cookie 下发，浏览器自动携带，前端不存 token。
 */
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

/** 前端保存的用户信息（取自注册/登录接口出参，剔除 token） */
export interface UserInfo {
  /** 用户 ID（雪花 ID 字符串） */
  userId: string;
  /** 用户昵称 */
  nickname: string;
  /** 头像地址，未设置时为 null */
  avatar: string | null;
  /** 角色编码列表，如 ['ROLE_USER'] */
  roles: string[];
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
