const ICONS = [
  'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/facebook.svg',
  'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/whatsapp.svg',
  'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/telegram.svg',
  'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/youtube.svg',
  'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/tiktok.svg',
  'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/snapchat.svg',
  'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/github.svg',
  'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/figma.svg',
  'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/notion.svg',
  'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/discord.svg',
  'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/spotify.svg',
  'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/apple.svg',
  'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/android.svg',
  'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/firefox.svg',
  'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/react.svg',
  'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/docker.svg',
]
const pickIcon = (id) => ICONS[(id) % ICONS.length]

export const appData = [
  {
    icon: pickIcon(0),
    id: 0,
    name: 'AOYUKMT',
    description: '一个实用的按键映射工具',
    category: '系统工具',
    size: 23.5 * 1024 * 1024
  },
  {
    icon: pickIcon(1),
    id: 1,
    name: '语音点名',
    description: '一个实用的点名签到工具',
    category: '签到工具',
    size: 12.3 * 1024 * 1024
  },
  {
    icon: pickIcon(2),
    id: 2,
    name: '智能考勤',
    description: '基于人脸识别的智能考勤系统',
    category: '签到工具',
    size: 15.9 * 1024 * 1024
  },
  {
    icon: pickIcon(3),
    id: 3,
    name: '课堂互动',
    description: '增强课堂互动性的教学工具',
    category: '教学工具',
    size: 18.7 * 1024 * 1024
  },
  {
    icon: pickIcon(4),
    id: 4,
    name: '作业管理',
    description: '便捷的作业布置与批改平台',
    category: '学习工具',
    size: 14.7 * 1024 * 1024
  },
  {
    icon: pickIcon(5),
    id: 5,
    name: '备课助手',
    description: '快速生成课件与课堂节奏规划',
    category: '教学工具',
    size: 20.1 * 1024 * 1024
  },
  {
    icon: pickIcon(6),
    id: 6,
    name: '试卷管理',
    description: '试卷录入、组卷与批改统计',
    category: '学习工具',
    size: 16.4 * 1024 * 1024
  }
]