/**
 * 文件上传接口
 * @description 对应 Apifox「公共模块/文件上传」：
 * POST /api/files/upload?scene=xxx 上传文件
 *
 * 需登录；scene 决定校验规则与存储位置（如 USER_AVATAR），
 * 命中内容哈希直接返回旧记录。
 *
 * 用法：
 * import { uploadFile } from '@/api/file';
 *
 * const { fileId, objectKey } = await uploadFile(file, 'USER_AVATAR');
 */
import { post, type RequestConfig } from '@/request';
import type { FileScene, FileUploadResponse } from './types';

export * from './types';

/** 上传文件：multipart/form-data，scene 由 query 传递 */
export function uploadFile(
  file: File,
  scene: FileScene,
  config?: RequestConfig,
): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  return post<FileUploadResponse>(
    `/files/upload?scene=${encodeURIComponent(scene)}`,
    formData,
    config,
  );
}
