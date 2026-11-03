/**
 * 文件地址工具
 * @description 后端返回的 objectKey（如 user/avatar/xxx.jpg）需要拼上 MinIO 前缀与桶名才能访问；
 * 已是完整 URL（http/https/协议相对/data/blob）则原样返回。
 */

/** MinIO 服务地址，留空时走同源相对路径（由 Vite 代理转发） */
const MINIO_HOST: string = import.meta.env.VITE_MINIO_ADDRESS ?? '';

/** 对象存储桶名 */
const MINIO_BUCKET = 'younger';

/** 本机地址前缀：后端可能返回 http://localhost:9000/... 这类地址，统一转成同源路径 */
const LOCAL_ORIGIN_RE = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i;

/** 把 objectKey / 文件地址解析为可访问地址 */
export function resolveFileUrl(path?: string | null): string {
  let source = path?.trim() ?? '';
  if (!source) return '';

  // 本机地址在局域网/手机上不可达，转成同源相对路径交给代理
  source = source.replace(LOCAL_ORIGIN_RE, '');

  if (
    source.startsWith('http://') ||
    source.startsWith('https://') ||
    source.startsWith('//') ||
    source.startsWith('data:') ||
    source.startsWith('blob:')
  ) {
    return source;
  }

  // 已经是同源绝对路径（如 /younger/user/avatar/x.jpg），直接使用
  if (source.startsWith('/')) return source;

  return `${MINIO_HOST}/${MINIO_BUCKET}/${source.replace(/^\/+/, '')}`;
}
