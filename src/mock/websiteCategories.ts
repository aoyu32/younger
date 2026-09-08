export interface WebsiteSite {
  name: string;
  url: string;
  icon: string;
}

export interface WebsiteCategoryChild {
  name: string;
  sites: WebsiteSite[];
}

export interface WebsiteCategoryGroup {
  name: string;
  children: WebsiteCategoryChild[];
}

// 快捷构造：icon 取 favicon 服务，与 webTools 保持一致
const site = (name: string, domain: string): WebsiteSite => ({
  name,
  url: `https://${domain}`,
  icon: `https://toolb.cn/favicon/${domain}`,
});

export const websiteCategories: WebsiteCategoryGroup[] = [
  {
    name: '门户资讯',
    children: [
      {
        name: '综合门户',
        sites: [
          site('新浪', 'sina.com.cn'),
          site('搜狐', 'sohu.com'),
          site('网易', '163.com'),
          site('腾讯网', 'qq.com'),
          site('凤凰网', 'ifeng.com'),
          site('环球网', 'huanqiu.com'),
          site('中华网', 'china.com'),
          site('今日头条', 'toutiao.com'),
        ],
      },
      {
        name: '新闻媒体',
        sites: [
          site('人民网', 'people.com.cn'),
          site('新华网', 'xinhuanet.com'),
          site('央视网', 'cctv.com'),
          site('澎湃新闻', 'thepaper.cn'),
          site('界面新闻', 'jiemian.com'),
          site('光明网', 'gmw.cn'),
          site('中国新闻网', 'chinanews.com.cn'),
        ],
      },
      {
        name: '科技资讯',
        sites: [
          site('36氪', '36kr.com'),
          site('虎嗅', 'huxiu.com'),
          site('爱范儿', 'ifanr.com'),
          site('少数派', 'sspai.com'),
          site('钛媒体', 'tmtpost.com'),
          site('TechCrunch', 'techcrunch.com'),
        ],
      },
      {
        name: '行业垂直',
        sites: [
          site('亿邦动力', 'ebrun.com'),
          site('雷锋网', 'leiphone.com'),
          site('机器之心', 'jiqizhixin.com'),
          site('游戏葡萄', 'youxiputao.com'),
          site('动点科技', 'technode.com'),
        ],
      },
    ],
  },
  {
    name: '影音娱乐',
    children: [
      {
        name: '视频网站',
        sites: [
          site('哔哩哔哩', 'bilibili.com'),
          site('爱奇艺', 'iqiyi.com'),
          site('腾讯视频', 'v.qq.com'),
          site('优酷', 'youku.com'),
          site('芒果TV', 'mgtv.com'),
          site('西瓜视频', 'ixigua.com'),
          site('YouTube', 'youtube.com'),
        ],
      },
      {
        name: '音乐电台',
        sites: [
          site('网易云音乐', 'music.163.com'),
          site('QQ音乐', 'y.qq.com'),
          site('酷狗音乐', 'kugou.com'),
          site('汽水音乐', 'qishui.douyin.com'),
          site('喜马拉雅', 'ximalaya.com'),
          site('Spotify', 'spotify.com'),
        ],
      },
      {
        name: '直播平台',
        sites: [
          site('斗鱼', 'douyu.com'),
          site('虎牙', 'huya.com'),
          site('抖音', 'douyin.com'),
          site('快手', 'kuaishou.com'),
          site('CC直播', 'cc.163.com'),
        ],
      },
      {
        name: '动漫游戏',
        sites: [
          site('腾讯动漫', 'ac.qq.com'),
          site('哔哩哔哩漫画', 'manga.bilibili.com'),
          site('有妖气', 'u17.com'),
          site('Steam', 'store.steampowered.com'),
          site('Epic', 'epicgames.com'),
          site('TapTap', 'taptap.cn'),
          site('米哈游', 'mihoyo.com'),
        ],
      },
      {
        name: '影视资源',
        sites: [
          site('豆瓣电影', 'movie.douban.com'),
          site('IMDb', 'imdb.com'),
          site('片库', 'pianku.li'),
          site('烂番茄', 'rottentomatoes.com'),
        ],
      },
    ],
  },
  {
    name: '开发工具',
    children: [
      {
        name: '代码托管',
        sites: [
          site('GitHub', 'github.com'),
          site('Gitee', 'gitee.com'),
          site('GitLab', 'gitlab.com'),
          site('Bitbucket', 'bitbucket.org'),
          site('Codeberg', 'codeberg.org'),
        ],
      },
      {
        name: '在线工具',
        sites: [
          site('Can I Use', 'caniuse.com'),
          site('TinyPNG', 'tinypng.com'),
          site('Convertio', 'convertio.co'),
          site('Photopea', 'photopea.com'),
          site('Regex101', 'regex101.com'),
        ],
      },
      {
        name: '接口调试',
        sites: [
          site('Apifox', 'apifox.com'),
          site('Postman', 'postman.com'),
          site('Hoppscotch', 'hoppscotch.io'),
          site('Insomnia', 'insomnia.rest'),
          site('ShowDoc', 'showdoc.com.cn'),
        ],
      },
      {
        name: '设计素材',
        sites: [
          site('Figma', 'figma.com'),
          site('即时设计', 'js.design'),
          site('MasterGo', 'mastergo.com'),
          site('蓝湖', 'lanhuapp.com'),
          site('iconfont', 'iconfont.cn'),
          site('Unsplash', 'unsplash.com'),
          site('Dribbble', 'dribbble.com'),
        ],
      },
    ],
  },
  {
    name: '学习教育',
    children: [
      {
        name: '在线课程',
        sites: [
          site('中国大学MOOC', 'icourse163.org'),
          site('网易云课堂', 'study.163.com'),
          site('慕课网', 'imooc.com'),
          site('Coursera', 'coursera.org'),
          site('edX', 'edx.org'),
        ],
      },
      {
        name: '文档教程',
        sites: [
          site('MDN', 'developer.mozilla.org'),
          site('菜鸟教程', 'runoob.com'),
          site('W3school', 'w3school.com.cn'),
          site('廖雪峰', 'liaoxuefeng.com'),
          site('Vue3', 'cn.vuejs.org'),
          site('React中文', 'react.docschina.org'),
        ],
      },
      {
        name: '语言学习',
        sites: [
          site('多邻国', 'duolingo.com'),
          site('扇贝单词', 'shanbay.com'),
          site('百词斩', 'baicizhan.com'),
          site('有道词典', 'dict.youdao.com'),
        ],
      },
    ],
  },
  {
    name: '电商购物',
    children: [
      {
        name: '综合商城',
        sites: [
          site('淘宝', 'taobao.com'),
          site('京东', 'jd.com'),
          site('天猫', 'tmall.com'),
          site('拼多多', 'pinduoduo.com'),
          site('苏宁易购', 'suning.com'),
          site('唯品会', 'vip.com'),
        ],
      },
      {
        name: '优惠比价',
        sites: [
          site('什么值得买', 'smzdm.com'),
          site('慢慢买', 'manmanbuy.com'),
          site('一淘', 'etao.com'),
          site('返利网', 'fanli.com'),
        ],
      },
      {
        name: '海淘转运',
        sites: [
          site('亚马逊', 'amazon.com'),
          site('考拉海购', 'kaola.com'),
          site('转运四方', '4px.com'),
        ],
      },
    ],
  },
  {
    name: '社交沟通',
    children: [
      {
        name: '即时通讯',
        sites: [
          site('微信', 'weixin.qq.com'),
          site('QQ', 'imqq.com'),
          site('Telegram', 'telegram.org'),
          site('WhatsApp', 'whatsapp.com'),
          site('钉钉', 'dingtalk.com'),
          site('飞书', 'feishu.cn'),
        ],
      },
      {
        name: '社区论坛',
        sites: [
          site('知乎', 'zhihu.com'),
          site('豆瓣', 'douban.com'),
          site('百度贴吧', 'tieba.baidu.com'),
          site('V2EX', 'v2ex.com'),
          site('Reddit', 'reddit.com'),
        ],
      },
      {
        name: '博客建站',
        sites: [
          site('掘金', 'juejin.cn'),
          site('CSDN', 'csdn.net'),
          site('博客园', 'cnblogs.com'),
          site('SegmentFault', 'segmentfault.com'),
          site('WordPress', 'wordpress.org'),
          site('Hexo', 'hexo.io'),
        ],
      },
    ],
  },
  {
    name: '实用查询',
    children: [
      {
        name: '搜索引擎',
        sites: [
          site('百度', 'baidu.com'),
          site('必应', 'bing.com'),
          site('Google', 'google.com'),
          site('DuckDuckGo', 'duckduckgo.com'),
        ],
      },
      {
        name: '地图出行',
        sites: [
          site('高德地图', 'amap.com'),
          site('百度地图', 'map.baidu.com'),
          site('腾讯地图', 'map.qq.com'),
          site('12306', '12306.cn'),
          site('携程', 'ctrip.com'),
        ],
      },
      {
        name: '天气日历',
        sites: [
          site('中国天气网', 'weather.com.cn'),
          site('墨迹天气', 'moji.com'),
          site('天气网', 'tianqi.com'),
        ],
      },
      {
        name: '快递物流',
        sites: [
          site('快递100', 'kuaidi100.com'),
          site('菜鸟裹裹', 'cainiao.com'),
          site('快递鸟', 'kdniao.com'),
          site('顺丰速运', 'sf-express.com'),
        ],
      },
    ],
  },
];
