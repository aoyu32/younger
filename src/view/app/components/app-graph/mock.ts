// mockData.ts
// 图标统一来自 src/app-icons，应用名称与图标一一对应，全部 72 个图标均被使用
import iconClion from '@/app-icons/clion.png';
import iconConfig from '@/app-icons/config.png';
import iconDiskgenius from '@/app-icons/diskgenius.png';
import iconDrawio from '@/app-icons/draw.io.png';
import iconEdge from '@/app-icons/edge.png';
import iconEverything from '@/app-icons/everything.png';
import iconExe4j from '@/app-icons/exe4j.png';
import iconFanqiang from '@/app-icons/fanqiang.png';
import iconFirefox from '@/app-icons/firefox.png';
import iconFolder from '@/app-icons/folder.png';
import iconFoxovpn from '@/app-icons/foxovpn.png';
import iconGeek from '@/app-icons/geek.png';
import iconGoogle from '@/app-icons/google.png';
import iconGoogledisk from '@/app-icons/googledisk.png';
import iconGroupy from '@/app-icons/groupy.png';
import iconHbuilder from '@/app-icons/hbuilder.png';
import iconHuorong from '@/app-icons/huorong.png';
import iconIdea from '@/app-icons/idea.png';
import iconIdm from '@/app-icons/idm.png';
import iconJdk from '@/app-icons/jdk.png';
import iconJijianbizhi from '@/app-icons/jijianbizhi.png';
import iconKuakedisk from '@/app-icons/kuakedisk.png';
import iconListary from '@/app-icons/listary.png';
import iconListen1 from '@/app-icons/listen1.png';
import iconLively from '@/app-icons/lively.png';
import iconLriun from '@/app-icons/lriun.png';
import iconMemreduct from '@/app-icons/memreduct.png';
import iconMotrix from '@/app-icons/motrix.png';
import iconMysql from '@/app-icons/mysql.png';
import iconNavicat from '@/app-icons/navicat.png';
import iconNetflix from '@/app-icons/netflix.png';
import iconNexus from '@/app-icons/nexus.png';
import iconObsidian from '@/app-icons/obsidian.png';
import iconPandownload from '@/app-icons/pandownload.png';
import iconPhonechrome from '@/app-icons/phonechrome.png';
import iconPhoneedge from '@/app-icons/phoneedge.png';
import iconPhonetelegram from '@/app-icons/phonetelegram.png';
import iconPhonexmind from '@/app-icons/phonexmind.png';
import iconPhpstorm from '@/app-icons/phpstorm.png';
import iconPikpack from '@/app-icons/pikpack.png';
import iconPixso from '@/app-icons/pixso.png';
import iconPlaystore from '@/app-icons/playstore.png';
import iconPotplayer from '@/app-icons/potplayer.png';
import iconPycharm from '@/app-icons/pycharm.png';
import iconPython from '@/app-icons/python.png';
import iconQbittorrent from '@/app-icons/qbittorrent.png';
import iconQq from '@/app-icons/qq.png';
import iconQuicker from '@/app-icons/quicker.png';
import iconRainmeter from '@/app-icons/rainmeter.png';
import iconRufus from '@/app-icons/rufus.png';
import iconScreentogif from '@/app-icons/screentogif.png';
import iconSnipaste from '@/app-icons/snipaste.png';
import iconSpacesniffer from '@/app-icons/spacesniffer.png';
import iconStartallback from '@/app-icons/startallback.png';
import iconSteam from '@/app-icons/steam.png';
import iconSublime from '@/app-icons/sublime.png';
import iconTampermonkey from '@/app-icons/tampermonkey.png';
import iconTearbox from '@/app-icons/tearbox.png';
import iconTelegram from '@/app-icons/telegram.png';
import iconTencent from '@/app-icons/tencent.png';
import iconTim from '@/app-icons/tim.png';
import iconTrafficmonitor from '@/app-icons/trafficmonitor.png';
import iconTwitter from '@/app-icons/twitter.png';
import iconTypora from '@/app-icons/typora.png';
import iconUtools from '@/app-icons/utools.png';
import iconV2rayn from '@/app-icons/v2rayn.png';
import iconVscode from '@/app-icons/vscode.png';
import iconVsstudio from '@/app-icons/vsstudio.png';
import iconWebstorm from '@/app-icons/webstorm.png';
import iconWeiruantranslate from '@/app-icons/weiruantranslate.png';
import iconWechat from '@/app-icons/wechat.png';
import iconWord from '@/app-icons/word.png';
import iconXmind from '@/app-icons/xmind.png';

// 全量应用池：名称 -> 图标
const appIconMap: Record<string, string> = {
  CLion: iconClion,
  AutoCAD: iconConfig,
  DiskGenius: iconDiskgenius,
  'draw.io': iconDrawio,
  'Microsoft Edge': iconEdge,
  Everything: iconEverything,
  exe4j: iconExe4j,
  网络加速器: iconFanqiang,
  Firefox: iconFirefox,
  文件资源管理器: iconFolder,
  'FoxO VPN': iconFoxovpn,
  'Geek Uninstaller': iconGeek,
  'Google 搜索': iconGoogle,
  'Google Drive': iconGoogledisk,
  Groupy: iconGroupy,
  'HBuilder X': iconHbuilder,
  火绒安全: iconHuorong,
  'IntelliJ IDEA': iconIdea,
  IDM: iconIdm,
  JDK: iconJdk,
  极简壁纸: iconJijianbizhi,
  夸克网盘: iconKuakedisk,
  Listary: iconListary,
  Listen1: iconListen1,
  'Lively Wallpaper': iconLively,
  'Iriun Webcam': iconLriun,
  'Mem Reduct': iconMemreduct,
  Motrix: iconMotrix,
  MySQL: iconMysql,
  Navicat: iconNavicat,
  Netflix: iconNetflix,
  'Nexus Mods': iconNexus,
  Obsidian: iconObsidian,
  PanDownload: iconPandownload,
  'Chrome 手机版': iconPhonechrome,
  'Edge 手机版': iconPhoneedge,
  'Telegram 手机版': iconPhonetelegram,
  'XMind 手机版': iconPhonexmind,
  PhpStorm: iconPhpstorm,
  PikPak: iconPikpack,
  Pixso: iconPixso,
  'Google Play': iconPlaystore,
  PotPlayer: iconPotplayer,
  PyCharm: iconPycharm,
  Python: iconPython,
  qBittorrent: iconQbittorrent,
  QQ: iconQq,
  Quicker: iconQuicker,
  Rainmeter: iconRainmeter,
  Rufus: iconRufus,
  ScreenToGif: iconScreentogif,
  Snipaste: iconSnipaste,
  SpaceSniffer: iconSpacesniffer,
  StartAllBack: iconStartallback,
  Steam: iconSteam,
  'Sublime Text': iconSublime,
  Tampermonkey: iconTampermonkey,
  TeraBox: iconTearbox,
  Telegram: iconTelegram,
  腾讯: iconTencent,
  TIM: iconTim,
  TrafficMonitor: iconTrafficmonitor,
  Twitter: iconTwitter,
  Typora: iconTypora,
  uTools: iconUtools,
  V2RayN: iconV2rayn,
  'VS Code': iconVscode,
  'Visual Studio': iconVsstudio,
  WebStorm: iconWebstorm,
  微信: iconWechat,
  微软翻译: iconWeiruantranslate,
  'Microsoft Word': iconWord,
  XMind: iconXmind,
};

// 分类 -> 应用名列表
// 同一应用出现在多个分类时，图中会作为共享节点连接多个标签
const categoryApps: Record<string, string[]> = {
  浏览器: [
    'Microsoft Edge',
    'Firefox',
    'Chrome 手机版',
    'Edge 手机版',
    'Tampermonkey',
  ],
  谷歌产品: [
    'Google 搜索',
    'Google Drive',
    'Google Play',
    'Chrome 手机版',
    'Tampermonkey',
  ],
  'JetBrains 全家桶': [
    'IntelliJ IDEA',
    'CLion',
    'PyCharm',
    'PhpStorm',
    'WebStorm',
  ],
  开发工具: [
    'VS Code',
    'Sublime Text',
    'Visual Studio',
    'HBuilder X',
    'IntelliJ IDEA',
    'JDK',
    'Python',
    'exe4j',
    'MySQL',
    'Navicat',
  ],
  下载工具: ['IDM', 'Motrix', 'qBittorrent', 'PanDownload', 'PikPak'],
  社交沟通: [
    'QQ',
    'TIM',
    '腾讯',
    '微信',
    'Telegram',
    'Telegram 手机版',
    'Twitter',
  ],
  影音娱乐: ['PotPlayer', 'Netflix', 'Listen1'],
  桌面美化: [
    'Rainmeter',
    'Lively Wallpaper',
    '极简壁纸',
    'StartAllBack',
    'Groupy',
  ],
  效率工具: [
    'Everything',
    'Listary',
    'uTools',
    'Quicker',
    'Snipaste',
    'ScreenToGif',
  ],
  系统工具: [
    'DiskGenius',
    'SpaceSniffer',
    'Mem Reduct',
    'TrafficMonitor',
    'Rufus',
    'Geek Uninstaller',
    '文件资源管理器',
    'Everything',
  ],
  安全防护: ['火绒安全', 'Mem Reduct', 'Geek Uninstaller'],
  网络加速: ['V2RayN', '网络加速器', 'FoxO VPN'],
  云盘存储: [
    'Google Drive',
    '夸克网盘',
    'TeraBox',
    'PikPak',
    'PanDownload',
  ],
  移动互联: [
    'Chrome 手机版',
    'Edge 手机版',
    'Telegram 手机版',
    'XMind 手机版',
    'Iriun Webcam',
    'Google Play',
    '夸克网盘',
  ],
  办公学习: [
    'Microsoft Word',
    'Typora',
    'Obsidian',
    'XMind',
    'XMind 手机版',
    '微软翻译',
    'draw.io',
  ],
  设计创作: ['Pixso', 'draw.io', 'AutoCAD', 'Snipaste', 'ScreenToGif'],
  游戏平台: ['Steam', 'Nexus Mods'],
};

// 结构化数据：{ type: 分类名, apps: [{ name, icon }] }
export const mockData = Object.entries(categoryApps).map(([type, names]) => ({
  type,
  apps: names.map((name) => ({ name, icon: appIconMap[name] })),
}));
