/**
 * 应用分类接口类型定义
 * @description 对应 Apifox 文档「应用模块/应用分类」：
 * 列表 / 详情 / 创建 / 更新 / 删除 / 批量删除
 */

/** 应用分类状态：1 启用，0 禁用 */
export type AppCategoryStatus = 0 | 1;

/** 应用分类（与后端 AppCategoryResponse 对齐） */
export interface AppCategory {
  /** 分类 ID（雪花 ID，后端序列化为字符串，前端当字符串用） */
  id: string;
  /** 分类名称 */
  name: string;
  /** 分类描述 */
  description: string;
  /** 图标（CSS 类名或图片 URL） */
  icon: string;
  /** 排序权重，越大越靠前 */
  sortOrder: number;
  /** 状态：1 启用，0 禁用 */
  status: AppCategoryStatus;
  /** 创建时间 */
  createdTime: string;
  /** 更新时间 */
  updatedTime: string;
}

/** 应用分类列表查询条件 */
export interface AppCategoryListParams {
  /** 分类名称，模糊匹配 */
  name?: string;
  /** 状态：1 启用，0 禁用；不传则不过滤 */
  status?: AppCategoryStatus;
}

/** 创建应用分类入参（与后端 AppCategoryCreateRequest 对齐，name 必填） */
export interface AppCategoryCreateRequest {
  /** 分类名称，最长 50 字 */
  name: string;
  /** 分类描述，最长 200 字 */
  description?: string;
  /** 图标（CSS 类名或图片 URL），最长 255 字 */
  icon?: string;
  /** 排序权重，越大越靠前 */
  sortOrder?: number;
  /** 状态：1 启用，0 禁用 */
  status?: AppCategoryStatus;
}

/** 更新应用分类入参（与后端 AppCategoryUpdateRequest 对齐，只覆盖非 null 字段） */
export interface AppCategoryUpdateRequest {
  /** 分类名称，最长 50 字 */
  name?: string;
  /** 分类描述，最长 200 字 */
  description?: string;
  /** 图标（CSS 类名或图片 URL），最长 255 字 */
  icon?: string;
  /** 排序权重，越大越靠前 */
  sortOrder?: number;
  /** 状态：1 启用，0 禁用 */
  status?: AppCategoryStatus;
}
