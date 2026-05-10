/**
 * 格式化日期为 yyyy-MM-dd
 * @param date 日期对象、毫秒时间戳或日期字符串，传入 undefined 则返回当前日期
 * @returns 例如 "2026-05-10"
 */
export function formateDate(date?: Date | number | string | undefined): string {
  if (date === undefined) date = new Date(); // undefined 时当作当前时间
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化字节大小为可读单位，undefined 返回 "0 B"
 * @param bytes 字节数
 * @returns 例如 "1 KB", "1.4 MB"
 */
export function formatByte(bytes?: number | undefined): string {
  if (bytes === undefined || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const k = 1024;
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const index = Math.min(i, units.length - 1);
  const value = bytes / Math.pow(k, index);
  const formatted = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
  return `${formatted} ${units[index]}`;
}

/**
 * 格式化计数，自动以万(w)或千(k)显示，undefined 返回 "0"
 * @param num 数值
 * @param unit 可选 'w' | 'k'，不传则自动判断
 * @returns 例如 "1250w", "1.3k"
 */
export function formatCount(
  num?: number | undefined,
  unit?: 'w' | 'k',
): string {
  if (num === undefined) return '0';
  const autoUnit =
    unit || (Math.abs(num) >= 10000 ? 'w' : Math.abs(num) >= 1000 ? 'k' : null);
  if (!autoUnit) return String(num);
  const base = autoUnit === 'w' ? 10000 : 1000;
  const converted = num / base;
  const formatted =
    converted % 1 === 0 ? converted.toFixed(0) : converted.toFixed(1);
  return `${formatted}${autoUnit}`;
}
