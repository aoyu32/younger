export const mockComments = [
  {
    id: 1,
    content:
      '这个产品真的很不错，性价比很高！非常推荐。快来购买吧，买的越多赚的越多！这个产品真的很不错，性价比很高！非常推荐。快来购买吧，买的越多赚的越多！这个产品真的很不错，性价比很高！非常推荐。快来购买吧，买的越多赚的越多！这个产品真的很不错，性价比很高！非常推荐。快来购买吧，买的越多赚的越多！这个产品真的很不错，性价比很高！非常推荐。快来购买吧，买的越多赚的越多！这个产品真的很不错，性价比很高！非常推荐。快来购买吧，买的越多赚的越多！',
    user: {
      id: 101,
      name: '小明',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    images: [
      { url: 'https://picsum.photos/id/101/200/150', id: 'img1' },
      { url: 'https://picsum.photos/id/104/200/150', id: 'img2' },
    ],
    createdAt: '2025-03-20T10:30:00Z',
    likes: 24,
    dislikes: 2,
    parentId: null,
    replyTo: null, // 顶级评论
    replies: [
      {
        id: 101,
        content: '同意，我也买了，用了一周很稳定。',
        user: {
          id: 102,
          name: '小红',
          avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
        images: [],
        createdAt: '2025-03-20T11:15:00Z',
        likes: 8,
        dislikes: 0,
        parentId: 1,
        replyTo: '小明', // 回复父评论的用户名
        replies: [],
      },
      {
        id: 102,
        content: '请问哪里能买到？',
        user: {
          id: 103,
          name: '李雷',
          avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        },
        images: [],
        createdAt: '2025-03-20T12:00:00Z',
        likes: 3,
        dislikes: 1,
        parentId: 1,
        replyTo: '小明', // 回复父评论的用户名
        replies: [],
      },
    ],
  },
  {
    id: 2,
    content: '吐槽一下，发货太慢了，等了一周才到。',
    user: {
      id: 104,
      name: '王芳',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    images: [],
    createdAt: '2025-03-19T18:20:00Z',
    likes: 15,
    dislikes: 5,
    parentId: null,
    replyTo: null, // 顶级评论
    replies: [
      {
        id: 201,
        content: '非常抱歉给您带来不便，我们会加急改进物流。',
        user: {
          id: 105,
          name: '客服小张',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        },
        images: [],
        createdAt: '2025-03-19T19:00:00Z',
        likes: 12,
        dislikes: 0,
        parentId: 2,
        replyTo: '王芳', // 回复父评论的用户名
        replies: [],
      },
    ],
  },
  {
    id: 3,
    content: '上图是实拍效果，供大家参考。',
    user: {
      id: 106,
      name: '赵四',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    images: [{ url: 'https://picsum.photos/id/20/200/150', id: 'img3' }],
    createdAt: '2025-03-18T09:45:00Z',
    likes: 42,
    dislikes: 1,
    parentId: null,
    replyTo: null, // 顶级评论
    replies: [],
  },
];
