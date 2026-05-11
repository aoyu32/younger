export const mockComments = [
  {
    id: 1,
    content:
      '用可灵1.6做了条产品宣传片，图生视频模式真的稳！人物一致性比之前强太多了，画面几乎没崩，强烈推荐大家试试～',
    user: {
      id: 101,
      name: '山间清风',
      avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=xiaoming',
    },
    images: [
      { url: 'https://picsum.photos/id/101/200/150', id: 'img1' },
      { url: 'https://picsum.photos/id/104/200/150', id: 'img2' },
    ],
    createdAt: '2026-04-20T10:30:00Z',
    likes: 24,
    dislikes: 2,
    parentId: null,
    replyTo: null,
    replies: [
      {
        id: 101,
        content:
          '同感！我也用可灵做了一周短视频了，画质和流畅度确实比Runway强，关键还便宜。',
        user: {
          id: 102,
          name: '深海鱼',
          avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=xiaohong',
        },
        images: [],
        createdAt: '2026-04-20T11:15:00Z',
        likes: 8,
        dislikes: 0,
        parentId: 1,
        replyTo: '山间清风',
        replies: [],
      },
      {
        id: 102,
        content: '请问提示词有什么技巧吗？我生成的人物动作总是不自然。',
        user: {
          id: 103,
          name: '麦田守望者',
          avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=lilei',
        },
        images: [],
        createdAt: '2026-04-20T12:00:00Z',
        likes: 3,
        dislikes: 1,
        parentId: 1,
        replyTo: '山间清风',
        replies: [
          {
            id: 203,
            content:
              '动作不自然可以试试在提示词里加入“slow motion, smooth transition, natural posture”，另外图生视频时初始图最好选动态姿势明显的，效果会好很多。',
            user: {
              id: 107,
              name: '像素魔术师',
              avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=pixelmage',
            },
            images: [],
            createdAt: '2026-04-21T09:20:00Z',
            likes: 5,
            dislikes: 0,
            parentId: 102,
            replyTo: '麦田守望者',
            replies: [],
          },
        ],
      },
      {
        id: 202,
        content:
          '补充一点：可灵1.6的运动笔刷功能对人物肢体控制帮助很大，可以指定运动方向和幅度。',
        user: {
          id: 108,
          name: '视觉动物',
          avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=visionary',
        },
        images: [],
        createdAt: '2026-04-21T08:45:00Z',
        likes: 12,
        dislikes: 0,
        parentId: 1,
        replyTo: '山间清风',
        replies: [],
      },
    ],
  },
  {
    id: 2,
    content:
      '吐槽一下Sora turbo，排队排了三天才生成一个5秒视频，而且风格化效果远不如 demo 展示的那么惊艳。',
    user: {
      id: 104,
      name: '咖啡不加糖',
      avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=wangfang',
    },
    images: [],
    createdAt: '2026-04-18T18:20:00Z',
    likes: 15,
    dislikes: 5,
    parentId: null,
    replyTo: null,
    replies: [
      {
        id: 201,
        content:
          '非常抱歉给您带来不佳体验，目前高峰期算力紧张，我们正在扩容服务器，预计下周会有明显改善。',
        user: {
          id: 105,
          name: '云朵有点甜',
          avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=service01',
        },
        images: [],
        createdAt: '2026-04-18T19:00:00Z',
        likes: 12,
        dislikes: 0,
        parentId: 2,
        replyTo: '咖啡不加糖',
        replies: [
          {
            id: 206,
            content:
              '希望尽快改进吧，隔壁可灵生成30秒视频也就2分钟，排队真的劝退。',
            user: {
              id: 109,
              name: '极客小胖',
              avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=geekpeng',
            },
            images: [],
            createdAt: '2026-04-19T10:30:00Z',
            likes: 6,
            dislikes: 0,
            parentId: 201,
            replyTo: '云朵有点甜',
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    content:
      '用即梦AI做了段国风动画短片，附上截图给大家参考。文生视频能到这个水准，真的很惊喜！',
    user: {
      id: 106,
      name: '北冥有鱼',
      avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=zhaosi',
    },
    images: [{ url: 'https://picsum.photos/id/20/200/150', id: 'img3' }],
    createdAt: '2026-04-15T09:45:00Z',
    likes: 42,
    dislikes: 1,
    parentId: null,
    replyTo: null,
    replies: [
      {
        id: 204,
        content: '请问国风风格需要特别设置模型吗？我用默认模型画不出水墨感。',
        user: {
          id: 110,
          name: '画中仙',
          avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=huaxian',
        },
        images: [],
        createdAt: '2026-04-16T10:20:00Z',
        likes: 7,
        dislikes: 0,
        parentId: 3,
        replyTo: '北冥有鱼',
        replies: [
          {
            id: 205,
            content:
              '可以在提示词里加入“ink wash painting, traditional Chinese art style, calligraphy brush strokes”，再选“艺术风”模型预设，效果会好很多。',
            user: {
              id: 111,
              name: '墨香',
              avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=moxiang',
            },
            images: [
              { url: 'https://picsum.photos/id/106/200/150', id: 'img_reply' },
            ],
            createdAt: '2026-04-16T14:05:00Z',
            likes: 15,
            dislikes: 0,
            parentId: 204,
            replyTo: '画中仙',
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    content:
      'Luma Dream Machine 的新版首尾帧控制太强了，我做了一个从油画到现实人物的渐变效果，几乎无闪烁。分享关键参数：strength 0.7，cfg 8，帧率24。',
    user: {
      id: 112,
      name: '光影猎人',
      avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=lightshadow',
    },
    images: [
      { url: 'https://picsum.photos/id/43/200/150', id: 'img4_1' },
      { url: 'https://picsum.photos/id/77/200/150', id: 'img4_2' },
    ],
    createdAt: '2026-04-21T16:20:00Z',
    likes: 31,
    dislikes: 0,
    parentId: null,
    replyTo: null,
    replies: [
      {
        id: 207,
        content: '感谢分享！我试了你的参数，中间过渡确实比默认设置平滑很多。',
        user: {
          id: 113,
          name: '追光者',
          avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=chaseLight',
        },
        images: [],
        createdAt: '2026-04-22T09:13:00Z',
        likes: 5,
        dislikes: 0,
        parentId: 4,
        replyTo: '光影猎人',
        replies: [],
      },
      {
        id: 208,
        content: 'Luma对长视频支持怎么样？我需要生成15秒以上的镜头。',
        user: {
          id: 114,
          name: '导演阿祖',
          avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=directorzu',
        },
        images: [],
        createdAt: '2026-04-22T14:30:00Z',
        likes: 2,
        dislikes: 0,
        parentId: 4,
        replyTo: '光影猎人',
        replies: [],
      },
    ],
  },
  {
    id: 5,
    content:
      'Pika 2.0 的音效同步功能还不太行，口型对不上是常态。试了三次 lip sync，只有一次勉强及格，感觉不如直接后期配音。',
    user: {
      id: 115,
      name: '夜半歌声',
      avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=nightSong',
    },
    images: [],
    createdAt: '2026-04-19T22:10:00Z',
    likes: 18,
    dislikes: 7,
    parentId: null,
    replyTo: null,
    replies: [
      {
        id: 209,
        content:
          '同感，而且它对非英语的口型支持更差。目前做数字人还得靠HeyGen。',
        user: {
          id: 116,
          name: '产品汪',
          avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=productDog',
        },
        images: [],
        createdAt: '2026-04-20T07:45:00Z',
        likes: 9,
        dislikes: 0,
        parentId: 5,
        replyTo: '夜半歌声',
        replies: [],
      },
    ],
  },
  {
    id: 6,
    content:
      'kling 1.6 运动笔刷到底怎么用？我画了运动轨迹但人物胳膊还是僵硬，有教程吗？',
    user: {
      id: 117,
      name: '学习使我快乐',
      avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=happyStudy',
    },
    images: [],
    createdAt: '2026-04-22T18:00:00Z',
    likes: 4,
    dislikes: 0,
    parentId: null,
    replyTo: null,
    replies: [
      {
        id: 210,
        content:
          '运动笔刷要配合“骨骼点”使用，先点出关节位置再画路径，不要只画一条线。官方文档里有视频示例，可以看看。',
        user: {
          id: 118,
          name: '硬核教程君',
          avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=tutorialHard',
        },
        images: [],
        createdAt: '2026-04-23T10:20:00Z',
        likes: 3,
        dislikes: 0,
        parentId: 6,
        replyTo: '学习使我快乐',
        replies: [],
      },
    ],
  },
];
