const ICONS = [
  'https://picsum.photos/60/60?random=1',
  'https://picsum.photos/60/60?random=2',
  'https://picsum.photos/60/60?random=3',
  'https://picsum.photos/60/60?random=4',
  'https://picsum.photos/60/60?random=5',
  'https://picsum.photos/60/60?random=6',
  'https://picsum.photos/60/60?random=7',
  'https://picsum.photos/60/60?random=8',
  'https://picsum.photos/60/60?random=9',
  'https://picsum.photos/60/60?random=10',
  'https://picsum.photos/60/60?random=11',
  'https://picsum.photos/60/60?random=12',
  'https://picsum.photos/60/60?random=13',
  'https://picsum.photos/60/60?random=14',
  'https://picsum.photos/60/60?random=15',
  'https://picsum.photos/60/60?random=16',
  'https://picsum.photos/60/60?random=17',
  'https://picsum.photos/60/60?random=18',
  'https://picsum.photos/60/60?random=19',
  'https://picsum.photos/60/60?random=20',
  'https://picsum.photos/60/60?random=21',
  'https://picsum.photos/60/60?random=22',
  'https://picsum.photos/60/60?random=23',
  'https://picsum.photos/60/60?random=24'
]

const pickIcon = (id) => ICONS[(id - 1) % ICONS.length]

export const appData = [
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