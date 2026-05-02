// 定义评论数据类型
export interface CommentItemData {
  id: number
  content: string
  user: {
    id: number
    name: string
    avatar?: string
  }
  images?: { url: string; id?: string }[]
  createdAt: string | Date
  likes: number
  dislikes: number
  parentId?: number | null
  replyTo?: string | null
  replies: CommentItem[]
}

// 定义组件上传函数类型
export type UploadFn = (file: File) => Promise<{ success: boolean; url: string; id: string }>;


// 定义图片项类型
export interface ImageItem {
  id: number | string;
  url: string;
}
