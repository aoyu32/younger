import img1 from '@/assets/1.png';
import img2 from '@/assets/2.png';
import img3 from '@/assets/3.png';
import img4 from '@/assets/4.png';
import appIcon from '@/assets/logo.png';
export const appDetail = {
  id: 0,
  name: 'AOYUKMT',
  desc: '一个轻量实用的键盘按钮重映射工具',
  icon: appIcon,
  sub: '快速、易用的按键映射工具',
  banner: {
    desc: '超多实用、快速、便携的功能',
  },
  pictorial: [
    {
      id: 1,
      text: '简单配置，快速上手使用',
      desc: '无需复杂设置，几步操作即可完成键盘映射配置，让新手也能轻松掌握',
      images: [
        {
          img: {
            src: img1,
            broken: true,
          },
        },
      ],
    },
    {
      id: 2,
      text: '丰富实用的便捷功能集合',
      desc: '',
      images: [
        {
          img: {
            src: img2,
            broken: false,
          },
        },
      ],
    },
    {
      id: 3,
      text: '灵活的个性化定制选项',
      desc: '支持自定义按键布局、主题色彩、触发方式等，满足不同用户的使用习惯',
      images: [
        {
          img: {
            src: img3,
            broken: false,
          },
        },
      ],
    },
    {
      id: 4,
      text: '大幅提升日常工作效率',
      desc: '通过优化键盘操作流程，减少重复性动作，帮助用户更高效地完成工作任务',
      images: [
        {
          img: {
            src: img4,
            broken: false,
          },
        },
      ],
    },
  ],
};
