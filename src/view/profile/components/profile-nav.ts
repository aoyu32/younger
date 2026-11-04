export interface ProfileNavItem {
  key: string;
  title: string;
  /** 标题中需要标品牌色的关键字 */
  keyword?: string;
  children?: ProfileNavItem[];
}

export const profileNavGroups: ProfileNavItem[] = [
  {
    key: 'course',
    title: '视频课程',
    keyword: '视频',
    children: [
      { key: 'course-watching', title: '历史记录' },
      { key: 'course-purchased', title: '我购买的' },
    ],
  },
  {
    key: 'collect',
    title: '我的收藏',
    keyword: '收藏',
    children: [
      { key: 'collect-video', title: '视频课程' },
      { key: 'collect-app', title: '应用APP' },
      { key: 'collect-website', title: '网站收藏' },
      { key: 'collect-post', title: '帖子收藏' },
    ],
  },
  {
    key: 'order',
    title: '我的订单',
    keyword: '订单',
    children: [
      { key: 'order-vip', title: '会员开通' },
      { key: 'order-course', title: '购买课程' },
    ],
  },
  {
    key: 'personal-info',
    title: '个人信息',
    keyword: '信息',
    children: [{ key: 'profile', title: '我的资料' }],
  },
  {
    key: 'security',
    title: '账号安全',
    keyword: '账号',
    children: [
      { key: 'security-info', title: '账号信息' },
      { key: 'security-password', title: '修改密码' },
    ],
  },
];
