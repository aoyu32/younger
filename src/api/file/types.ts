/**
 * 文件上传接口类型定义
 * @description 对应 Apifox 文档「公共模块/文件上传」：
 * 上传文件（multipart），命中内容哈希直接返回旧记录
 */

/** 文件上传场景编码，如 USER_AVATAR（头像） */
export type FileScene = string;

/** 文件上传出参（与后端 FileUploadResponse 对齐） */
export interface FileUploadResponse {
  /** 文件记录 ID（雪花 ID，后端序列化为字符串，前端当字符串用） */
  fileId: string;
  /** 对象键，落库与业务绑定的唯一标识，如 user/avatar/<sha256>.png */
  objectKey: string;
  /** 访问地址：公开场景为稳定地址，私有场景为 2 小时预签地址 */
  url: string;
  /** 文件大小（字节） */
  size: number;
}
