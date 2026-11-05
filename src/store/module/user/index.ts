/**
 * 用户模块（pinia）
 * @description 保存后端返回的用户信息并维护登录态。
 * 鉴权 token 由后端经 HttpOnly Cookie 下发，浏览器自动携带，前端不存 token。
 */
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { getUserProfile } from '@/api/user';
import type { UserInfo } from './types';

export type { UserInfo } from './types';

export const useUserStore = defineStore('user', () => {
  /** 当前登录用户，未登录为 null */
  const userInfo = ref<UserInfo | null>(null);

  /** 登录态版本号：登录/登出时自增，用于丢弃过期的资料请求结果 */
  let sessionVersion = 0;

  /** 是否已登录 */
  const isLogin = computed(() => userInfo.value !== null);

  /** 注册/登录成功后保存用户信息，即完成自动登录 */
  const login = (info: UserInfo) => {
    sessionVersion += 1;
    userInfo.value = info;
  };

  /**
   * 拉取完整用户资料并补全登录态。
   * 登录/注册接口只返回基础字段（昵称、头像、角色），
   * 简介、性别、地区、加入时间等只有资料接口才有，登录后需要补一次，
   * 否则个人中心要刷新后才能显示。
   */
  const loadProfile = async () => {
    const version = sessionVersion;
    const profile = await getUserProfile({
      silent: true,
      skipAuthRedirect: true,
    });
    // 请求期间可能已退出登录（或换了账号），过期结果直接丢弃
    if (version === sessionVersion) userInfo.value = { ...profile };
    return profile;
  };

  /** 退出登录：清空用户信息 */
  const logout = () => {
    sessionVersion += 1;
    userInfo.value = null;
  };

  return { userInfo, isLogin, login, loadProfile, logout };
});

export default useUserStore;
