import type { TutorialCourse, TutorialGroup } from '@/view/totorial/types';

export const totorialCourseName = '大模型应用开发实战';

export const totorialCourses: TutorialCourse[] = [
  { id: 'llm-app', title: '大模型应用开发实战', learners: 12680 },
  { id: 'vue3-ui', title: 'Vue 3 组件库从 0 到 1', learners: 8420 },
  { id: 'ts-advanced', title: 'TypeScript 类型体操进阶', learners: 15600 },
  { id: 'node-service', title: 'Node.js 服务端实战', learners: 6320 },
  { id: 'engineer', title: '前端工程化与构建优化', learners: 21800 },
  { id: 'ai-design', title: 'AI 绘画与设计工作流', learners: 9500 },
  { id: 'algorithm', title: '数据结构与算法精讲', learners: 42600 },
];

const code = (lang: string, body: string) => '```' + lang + '\n' + body + '\n```';

export const totorialGroups: TutorialGroup[] = [
  {
    id: 'basic',
    title: '入门准备',
    children: [
      {
        id: 'quick-start',
        title: '快速开始',
        content: `
本节带你完成从安装到运行第一个项目的全部流程，大约需要 10 分钟。

## 环境准备

需要 Node.js 18 以上版本，建议使用 pnpm 作为包管理器。执行下面的命令确认环境：

${code('bash', 'node -v\npnpm -v')}

如果版本过低，建议先升级 Node.js，再重新安装依赖。

## 创建项目

执行下面的命令初始化一个空项目：

${code('bash', 'pnpm create younger-app my-app\ncd my-app\npnpm dev')}

启动成功后终端会输出本地地址，浏览器打开即可看到初始页面。

## 目录结构

创建完成后目录大致如下：

- src 源码目录，业务代码都写在这里
- public 静态资源，构建时原样拷贝
- package.json 依赖与脚本声明
- vite.config.ts 构建配置

### 常用脚本

| 命令 | 说明 |
| --- | --- |
| pnpm dev | 启动开发服务 |
| pnpm build | 生产构建 |
| pnpm preview | 预览构建产物 |
| pnpm lint | 代码检查 |

## 下一步

建议先阅读「布局与容器」，了解页面骨架的组织方式，再进入核心概念部分。
`,
      },
      {
        id: 'layout',
        title: '布局与容器',
        content: `
介绍页面骨架、容器宽度与宽屏适配的组织方式。

## 基础布局

页面默认采用纵向流式布局，头部与内容区共用同一个容器宽度变量，改一处即可整体变宽：

${code('scss', '.layout {\n  --ao-container-max-width: min(1440px, calc(100% - 100px));\n}')}

内容区左右至少保留 50px 的安全边距，避免在窄屏上贴边。

## 宽屏适配

某些页面（视频详情、教程正文）需要更宽的内容区，为布局追加宽屏修饰类即可：

${code('vue', '<div class="layout layout--wide">...</div>')}

### 断点说明

| 断点 | 行为 |
| --- | --- |
| <= 768px | 单列布局，隐藏侧栏 |
| 768 - 1440px | 常规容器 |
| > 1440px | 宽屏容器 |

## 栅格与间距

间距统一使用设计令牌，不要在业务里写魔法数字：

- 8px 元素内紧凑间距
- 12px 卡片内边距
- 24px 栅格间距

### 垂直节奏

标题与正文之间的间距由 markdown 主题统一定义，正文容器不需要额外设置。
`,
      },
      {
        id: 'convention',
        title: '目录与约定',
        content: `
统一的目录划分与命名约定，可以显著降低协作成本。

## 目录划分

- view 页面级组件，一个页面一个目录
- components 通用组件，与业务无关
- mock 静态数据
- style 全局变量与重置样式
- router 路由与菜单配置

## 命名约定

组件文件使用大驼峰，页面目录使用小写短横线；CSS 类名统一使用短横线连接。

### 组件命名

| 类型 | 示例 |
| --- | --- |
| 通用组件 | AoMessage |
| 页面组件 | video-detail |
| 局部组件 | TutorialSideNav |

## 样式约定

组件样式一律使用 scoped，全局变量通过 CSS 自定义属性透传，避免样式泄漏。

${code('scss', '.tutorial-side-nav {\n  background-color: var(--ao-gray-2);\n}')}

## 提交约定

提交信息使用「类型: 描述」的形式，例如 feat、fix、style、refactor。
`,
      },
    ],
  },
  {
    id: 'concept',
    title: '核心概念',
    children: [
      {
        id: 'reactivity',
        title: '响应式基础',
        content: `
理解响应式是写好组合式 API 的前提。

## 基本用法

使用 ref 声明基础类型的响应式数据，使用 reactive 声明对象：

${code('ts', 'const count = ref(0);\nconst state = reactive({ list: [] });')}

在模板中访问 ref 会自动解包，在脚本中需要显式访问 .value。

## 派生状态

凡是能由其他状态推导出来的数据，都应该使用 computed，而不是重复维护一份：

${code('ts', 'const total = computed(() => list.value.length);')}

## 侦听变化

### watch 与 watchEffect

- watch 需要显式声明依赖，适合执行副作用
- watchEffect 自动收集依赖，适合简单场景
- 组件卸载时框架会自动停止侦听

| API | 依赖来源 | 是否立即执行 |
| --- | --- | --- |
| watch | 显式声明 | 否 |
| watchEffect | 自动收集 | 是 |

## 常见陷阱

直接给对象整体赋值会替换引用，深层结构变更需要保证响应式代理没有被破坏。
`,
      },
      {
        id: 'component',
        title: '组件与属性',
        content: `
组件是页面复用的基本单位，属性与事件构成了组件的对外接口。

## 声明属性

使用类型声明的方式定义属性，并为可选属性提供默认值：

${code('ts', 'const props = withDefaults(defineProps<{ title?: string }>(), {\n  title: \'\',\n});')}

## 事件与双向绑定

子组件通过 emit 通知父组件，配合 v-model 可以实现双向绑定。

### 透传属性

未声明为 props 的属性会自动透传到根元素，禁用时需要显式配置。

## 插槽

- 默认插槽用于主要内容
- 具名插槽用于结构中的多个位置
- 作用域插槽用于把子组件的数据交给父级渲染

## 性能建议

组件的渲染开销主要来自重复创建，拆分过细反而会增加通信成本，建议按业务区块拆分。
`,
      },
      {
        id: 'composables',
        title: '组合式函数',
        content: `
组合式函数用于抽取可复用的有状态逻辑，命名统一以 use 开头。

## 编写方式

${code('ts', 'export function useCounter(initial = 0) {\n  const count = ref(initial);\n  const inc = () => (count.value += 1);\n  return { count, inc };\n}')}

函数内部可以使用全部组合式 API，调用方必须在 setup 顶层调用。

## 使用场景

- 请求封装：加载状态、错误处理、重试
- 滚动与尺寸监听：统一注册与卸载
- 本地存储：序列化与跨标签同步

### 注意事项

不要在普通函数或回调里调用组合式函数，否则无法绑定到组件实例。

## 与混入的对比

组合式函数来源清晰、可叠加使用，并且可以明确返回值，是混入的推荐替代方案。
`,
      },
      {
        id: 'lifecycle',
        title: '生命周期',
        content: `
组件从创建到销毁经历若干阶段，每个阶段都有对应的钩子。

## 常用钩子

- onMounted 挂在到文档后执行，适合发起请求
- onUpdated 更新后执行，谨慎使用以免死循环
- onBeforeUnmount 卸载前执行，用于清理定时器与监听

## 清理副作用

${code('ts', 'onMounted(() => window.addEventListener(\'resize\', onResize));\nonBeforeUnmount(() => window.removeEventListener(\'resize\', onResize));')}

凡是手动注册的监听、定时器、观察器，都必须在卸载时释放。

### 服务端渲染

服务端渲染环境下只有 beforeCreate 与 created 会执行，避免在 setup 中直接访问 window。

## 执行顺序

父组件先完成创建，子组件挂载完成后父组件才触发 mounted，卸载时顺序相反。
`,
      },
    ],
  },
  {
    id: 'advanced',
    title: '进阶使用',
    children: [
      {
        id: 'theme',
        title: '主题与变量',
        content: `
主题通过 CSS 变量驱动，覆盖变量即可完成换肤。

## 颜色变量

- 主色 primary
- 文本 base、secondary、tertiary
- 背景 gray-0、gray-2

## 圆角与阴影

统一使用设计令牌，避免在业务里写魔法数字：

${code('scss', '.card {\n  border-radius: var(--ao-border-radius-lg);\n  box-shadow: var(--ao-shadow-sm);\n}')}

### 暗色主题

通过根节点的 data-theme 属性切换，变量作用域内会自动继承。

| 变量 | 亮色 | 暗色 |
| --- | --- | --- |
| --ao-color-text-base | #1f2329 | #f5f6f7 |
| --ao-gray-2 | #f5f6f7 | #22262b |

## 组件级覆盖

在组件根节点重新声明变量，可以只影响当前组件，但要注意权重与继承范围。
`,
      },
      {
        id: 'store',
        title: '状态管理',
        content: `
跨页面共享的数据建议集中管理，避免层层透传。

## 何时需要

- 用户信息、登录态
- 全局配置、主题
- 跨页面缓存的列表数据

## 组织方式

${code('ts', 'export const useUserStore = defineStore(\'user\', () => {\n  const profile = ref(null);\n  async function fetch() {\n    profile.value = await api.getProfile();\n  }\n  return { profile, fetch };\n});')}

组合式写法与组件内的逻辑完全一致，便于迁移。

### 持久化

需要持久化的字段单独声明，避免把临时状态写进本地存储。刷新后要重新校验有效期。

## 常见问题

- 不要在 store 中直接操作 DOM
- 请求失败要回滚状态，避免界面与后端不一致
`,
      },
      {
        id: 'router-advanced',
        title: '路由进阶',
        content: `
介绍路由参数、权限与滚动行为的处理方式。

## 路由参数

查询参数适合可分享的状态，路径参数适合资源标识：

${code('ts', 'router.push({ path: \'/totorial\', query: { chapter: id } });')}

## 权限控制

在全局前置守卫中校验登录态与角色，不通过时重定向到登录页。

### 菜单联动

菜单配置与路由表放在一起维护，标记为不展示的路由不会出现在导航中。

## 滚动行为

切换章节后需要回到顶部，同时保留浏览器前进后退时的位置：

${code('ts', 'scrollBehavior(to, from, saved) {\n  return saved ?? { top: 0 };\n}')}

## 命名视图

一个页面需要多个区域独立渲染时，可以使用命名视图拆分布局。
`,
      },
      {
        id: 'form',
        title: '表单与校验',
        content: `
表单的核心是数据模型、校验规则与错误提示的配合。

## 数据模型

- 用响应式对象承载字段
- 提交时统一做一次全量校验
- 提交中禁用重复点击

## 校验规则

${code('ts', 'const rules = {\n  email: [{ required: true, message: \'请输入邮箱\' }],\n  password: [{ min: 8, message: \'至少 8 位\' }],\n};')}

### 异步校验

需要请求接口的校验（例如用户名是否重复）要防抖，并且只取最后一次结果。

| 场景 | 触发时机 |
| --- | --- |
| 输入校验 | 失焦时 |
| 提交校验 | 点击提交时 |
| 实时校验 | 输入防抖后 |

## 错误提示

错误信息要定位到具体字段，滚动到第一个出错的位置，降低用户找错成本。
`,
      },
    ],
  },
  {
    id: 'engineering',
    title: '工程化',
    children: [
      {
        id: 'deploy',
        title: '构建与部署',
        content: `
打包产物为纯静态文件，可部署到任意静态服务器。

## 生产构建

${code('bash', 'pnpm build')}

## 预览产物

${code('bash', 'pnpm preview')}

### 常见问题

构建内存不足时，可调大 Node 的内存上限：

${code('bash', 'NODE_OPTIONS=--max_old_space_size=4096 pnpm build')}

## 部署方式

- 静态托管：直接上传 dist 目录
- 容器部署：使用 nginx 托管静态文件
- 对象存储：配合 CDN 加速

## 缓存策略

| 资源 | 缓存时间 |
| --- | --- |
| index.html | 不缓存 |
| 带哈希的静态资源 | 一年 |
| 图片与字体 | 三十天 |

## 回滚方案

每次发布保留上一版本产物，出现问题时直接切回，避免长时间不可用。
`,
      },
      {
        id: 'env',
        title: '环境变量',
        content: `
不同环境的接口地址与开关通过环境变量注入。

## 声明方式

项目根目录下的 .env 文件会被自动读取，只有特定前缀的变量会注入到前端代码：

${code('bash', 'VITE_API_BASE=/api\nVITE_ENABLE_MOCK=false')}

## 多环境

- .env.development 开发环境
- .env.staging 预发环境
- .env.production 生产环境

### 安全提示

前端环境变量会被打包进产物，不要写入任何密钥。

## 类型声明

为了获得提示，需要在类型声明文件中补充变量定义。

## 使用方式

${code('ts', 'const base = import.meta.env.VITE_API_BASE;')}

取值缺失时要有兜底，避免线上出现空地址请求。
`,
      },
      {
        id: 'lint',
        title: '代码规范',
        content: `
规范由工具强制保证，不依赖人工评审的记忆。

## 检查内容

- 未使用的变量与导入
- 命名与格式
- 潜在的空值访问

## 提交前校验

${code('bash', 'pnpm lint\nnpx vue-tsc --noEmit')}

### 类型检查

类型检查与打包分离，可以在不构建的情况下快速发现类型问题。

## 忽略规则

确实需要忽略时使用行内注释，并写明原因，避免大范围关闭规则：

${code('ts', '// eslint-disable-next-line no-console')}

## 代码风格

| 项目 | 约定 |
| --- | --- |
| 缩进 | 2 空格 |
| 引号 | 单引号 |
| 分号 | 保留 |
`,
      },
      {
        id: 'test',
        title: '单元测试',
        content: `
优先覆盖纯逻辑与工具函数，再逐步补齐组件测试。

## 测试范围

- 工具函数与格式化
- 组合式函数的边界情况
- 关键交互的组件行为

## 编写用例

${code('ts', 'it(\'formats price\', () => {\n  expect(formatPrice(1234)).toBe(\'¥1,234\');\n});')}

## 断言原则

### 好的断言

- 断言行为与输出，而不是内部实现
- 一个用例只验证一件事
- 用例名称描述业务结果

## 覆盖率

覆盖率是参考值而不是目标，核心链路的完整覆盖比数字更重要。
`,
      },
    ],
  },
  {
    id: 'perf',
    title: '性能与调优',
    children: [
      {
        id: 'first-screen',
        title: '首屏优化',
        content: `
首屏时间由资源体积、请求数量与渲染时机共同决定。

## 关键指标

- 首次内容绘制时间
- 最大内容绘制时间
- 交互延迟

## 常用手段

- 路由级懒加载，按页面拆分产物
- 首屏关键资源预加载
- 图片懒加载并指定尺寸

${code('ts', 'const Detail = defineAsyncComponent(() => import(\'./detail.vue\'));')}

### 骨架屏

数据返回前先渲染占位结构，减少布局跳动。

## 接口优化

| 手段 | 效果 |
| --- | --- |
| 接口合并 | 减少请求数 |
| 服务端渲染 | 更快的内容呈现 |
| 数据预取 | 提前开始请求 |
`,
      },
      {
        id: 'bundle',
        title: '打包体积',
        content: `
体积直接决定下载与解析时间，需要持续监控。

## 体积分析

${code('bash', 'pnpm build --report')}

## 拆分策略

- 第三方依赖单独分包
- 按路由拆分业务代码
- 体积较大的库按需引入

### 按需引入

组件库默认全量引入会把整个包打进产物，必须配置按需加载。

## 依赖取舍

引入一个库之前先看体积与维护状态，能用少量原生代码实现就不要引入。

## 常见问题

- 重复打包同一依赖的不同版本
- 图片未压缩就直接放进产物
`,
      },
      {
        id: 'render',
        title: '渲染性能',
        content: `
渲染卡顿通常来自超出必要的重渲染与长任务。

## 减少重渲染

- 稳定列表的 key
- 拆分粒度合理的组件
- 避免在模板中执行复杂计算

## 长列表

${code('ts', 'const visible = computed(() => list.value.slice(start, start + 30));')}

### 虚拟滚动

数据量超过千条时使用虚拟滚动，只渲染可视区。

## 事件与监听

| 场景 | 建议 |
| --- | --- |
| 滚动监听 | 节流并加 passive |
| 尺寸变化 | 使用观察器 |
| 高频输入 | 防抖处理 |

## 定位方法

先用性能面板录一段交互，确认瓶颈在脚本、样式还是布局，再针对性优化。
`,
      },
    ],
  },
  {
    id: 'faq',
    title: '常见问题',
    children: [
      {
        id: 'faq-build',
        title: '构建报错',
        content: `
构建阶段的报错大多与依赖版本和类型不匹配有关。

## 依赖安装失败

先删除锁文件与依赖目录，再重新安装：

${code('bash', 'rm -rf node_modules pnpm-lock.yaml\npnpm install')}

## 类型报错

- 检查导入路径是否正确
- 检查依赖是否提供了类型声明
- 第三方库缺失类型时补充声明文件

### 内存溢出

表现为 JavaScript heap out of memory，需要调大内存上限或拆分构建。

## 样式编译错误

| 现象 | 原因 |
| --- | --- |
| 整页白屏 | scss 编译失败 |
| 样式丢失 | scoped 选择器不匹配 |
| 变量未定义 | 未引入变量文件 |
`,
      },
      {
        id: 'faq-style',
        title: '样式不生效',
        content: `
排查样式问题要先确认层级，再确认优先级。

## 排查顺序

1. 元素是否命中了目标类名
2. 样式是否被打包进产物
3. 是否被更高优先级的规则覆盖

## 常见原因

- 使用了 scoped 却想影响子组件内部结构
- 变量未在作用域内声明
- 权重不足，被全局重置样式覆盖

${code('scss', ':deep(.child) {\n  color: var(--ao-color-primary);\n}')}

### 深度选择器

需要穿透组件边界时使用深度选择器，但要控制范围，避免影响其他页面。

## 断言方法

在开发者工具中查看计算样式，确认最终生效的规则来源。
`,
      },
      {
        id: 'faq-compat',
        title: '兼容性',
        content: `
兼容性问题集中在浏览器特性支持与移动端交互差异。

## 特性支持

- 观察器与容器查询在老版本浏览器上不可用
- 需要降级时提供兜底逻辑

## 移动端

### 视口与安全区

${code('css', 'padding-bottom: env(safe-area-inset-bottom);')}

## 交互差异

| 场景 | 桌面 | 移动端 |
| --- | --- | --- |
| 悬浮提示 | hover 触发 | 点击触发 |
| 滚动惯性 | 系统滚动 | 需要平滑处理 |

## 验证方式

真机验证优先于模拟器，重点回归首屏与主要操作路径。
`,
      },
    ],
  },
];
