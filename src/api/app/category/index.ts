/**
 * 应用分类接口
 * @description 对应 Apifox「应用模块/应用分类」：
 * GET    /api/apps/categories        查询应用分类列表（name 模糊匹配，status 过滤）
 * POST   /api/apps/categories        创建应用分类
 * GET    /api/apps/categories/{id}   查询应用分类详情
 * PUT    /api/apps/categories/{id}   更新应用分类（只覆盖非 null 字段）
 * DELETE /api/apps/categories/{id}   删除应用分类（软删除，分类下有应用时拒绝）
 * DELETE /api/apps/categories/batch 批量删除（body 传 ID 数组，任一分类下有应用时整体拒绝）
 *
 * 用法：
 * import { getAppCategories } from '@/api/app/category';
 *
 * const list = await getAppCategories({ status: 1 });
 */
import { del, get, post, put, type RequestConfig } from '@/request';
import type {
  AppCategory,
  AppCategoryCreateRequest,
  AppCategoryListParams,
  AppCategoryUpdateRequest,
} from './types';

export * from './types';

/** 查询应用分类列表 */
export function getAppCategories(
  params?: AppCategoryListParams,
  config?: RequestConfig,
): Promise<AppCategory[]> {
  return get<AppCategory[]>('/apps/categories', { ...config, params });
}

/** 查询应用分类详情 */
export function getAppCategory(id: string | number): Promise<AppCategory> {
  return get<AppCategory>(`/apps/categories/${id}`);
}

/** 创建应用分类 */
export function createAppCategory(
  data: AppCategoryCreateRequest,
  config?: RequestConfig,
): Promise<AppCategory> {
  return post<AppCategory>('/apps/categories', data, config);
}

/** 更新应用分类 */
export function updateAppCategory(
  id: string | number,
  data: AppCategoryUpdateRequest,
  config?: RequestConfig,
): Promise<AppCategory> {
  return put<AppCategory>(`/apps/categories/${id}`, data, config);
}

/** 删除应用分类 */
export function deleteAppCategory(id: string | number): Promise<void> {
  return del<void>(`/apps/categories/${id}`);
}

/** 批量删除应用分类，返回实际删除条数 */
export function deleteAppCategories(ids: Array<string | number>): Promise<number> {
  return del<number>('/apps/categories/batch', { data: ids });
}
