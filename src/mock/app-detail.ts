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
  category: '效率工具',
  content: `

## 📌 简介
**AOYUKMT** 是一款轻量级、高响应速度的键盘按键重映射工具。无论你是想交换按键位置、禁用某个键，还是为特定按键绑定宏命令，它都能帮助你快速实现，提升日常输入与操作效率。

## ✨ 核心功能

### 1. 简单配置，快速上手
- 可视化界面，无需编写复杂脚本
- 支持单键映射、组合键映射、按键禁用
- 实时生效，无需重启系统

### 2. 丰富实用的便捷功能
- **预设方案**：内置游戏、编程、设计等场景的常用映射模版
- **一键切换**：支持多套配置方案快速切换
- **状态提示**：托盘图标实时显示当前映射状态

### 3. 灵活的个性化定制
- 自定义按键布局（可自由拖拽分配）
- 主题色彩切换（浅色/深色/跟随系统）
- 触发方式选择（按下触发/释放触发/长按触发）

### 4. 大幅提升工作效率
- 减少重复性按键动作（例如将 **CapsLock** 映射为 **Ctrl**）
- 为特定软件自动加载专属映射配置
- 剪贴板增强、快速启动应用等扩展功能

## 🖥️ 系统要求
- Windows 10 / 11（x64）
- macOS 11+（Intel / Apple Silicon）
- Linux（Ubuntu 20.04+，需内核支持 uinput）

## 📦 安装方式
1. 从官网下载对应平台的安装包
2. 运行安装程序（Windows 可能需要管理员权限）
3. 启动后会在系统托盘显示图标，右键可进行配置

## 🎯 使用场景举例
| 场景         | 映射示例                                  |
|--------------|-------------------------------------------|
| 编程         | 将 **CapsLock** 映射为 **Esc**，减少小指移动 |
| 游戏         | 将 **Shift+W** 映射为 **奔跑**，避免误触     |
| 日常办公     | 将 **F2** 映射为 **Ctrl+S**，快速保存文档    |
| 多媒体控制   | 将 **ScrollLock** 映射为 **播放/暂停**      |

## 🔧 高级用法
- **层（Layer）**：通过按住特定键（如 Fn）切换到第二层映射，实现按键倍增
- **宏录制**：记录一系列键盘/鼠标操作，并绑定到单个按键
- **脚本支持**：使用 Lua 或 JSON 编写更复杂的映射逻辑

## ❓ 常见问题
**Q：是否会影响游戏反作弊系统？**  
A：AOYUKMT 工作于用户态，不修改游戏内存或驱动，绝大多数游戏可正常使用（建议先在小号测试）。

**Q：能否映射鼠标按键？**  
A：支持映射鼠标左/中/右/侧键，也可将键盘按键映射为鼠标动作。

**Q：配置如何备份？**  
A：配置文件以 JSON 格式保存在用户目录 \`.aoyukmt\` 文件夹下，直接复制即可备份。

## 📄 开源与协议
本项目基于 **MIT License** 开源，欢迎贡献代码或反馈问题。

> 前往 GitHub 仓库：[AOYUKMT](https://github.com/example/AOYUKMT)（示例链接）

---

**让每一次敲击都恰到好处 —— AOYUKMT**
`,
  tags: ['AI写作', '效率工具'],
  pictorial: [
    {
      id: 1,
      text: '简单配置，快速上手使用',
      desc: '无需复杂设置，几步操作即可完成键盘映射配置，让新手也能轻松掌握',
      animation: 'fadeLeft',
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
      animation: 'fadeRight',
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
      animation: 'zoomIn',
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
      animation: 'rotateIn',
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