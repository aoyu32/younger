/**
 * 加密工具
 * @description 验证码坐标加密：后端返回 secretKey，前端把 pointJson 用 AES/ECB/PKCS7 加密后提交
 * （与 aj-captcha 官方前端实现保持一致）
 */
import CryptoJS from 'crypto-js';

/**
 * AES 加密（ECB + Pkcs7），返回 Base64 密文
 * @param word 明文
 * @param key  密钥，由 /captcha/generate 返回的 secretKey
 */
export function aesEncrypt(word: string, key: string): string {
  const parsedKey = CryptoJS.enc.Utf8.parse(key);
  const parsedWord = CryptoJS.enc.Utf8.parse(word);
  return CryptoJS.AES.encrypt(parsedWord, parsedKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
}
