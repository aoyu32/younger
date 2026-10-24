import { OverlayScrollbars } from 'overlayscrollbars';

const bodyOverlayScrollbarsOptions = {
  scrollbars: {
    theme: 'os-theme-younger',
    visibility: 'auto',
    autoHide: 'leave',
    autoHideDelay: 400,
    dragScroll: true,
    clickScroll: false,
  },
} as const;

let bodyInstance: ReturnType<typeof OverlayScrollbars> | null = null;

export function initBodyOverlayScrollbars() {
  if (bodyInstance) {
    return bodyInstance;
  }

  bodyInstance = OverlayScrollbars(document.body, bodyOverlayScrollbarsOptions);
  return bodyInstance;
}

export function destroyBodyOverlayScrollbars() {
  bodyInstance?.destroy();
  bodyInstance = null;
}

/**
 * 锁定/解锁页面滚动（供移动端抽屉等全屏浮层使用）。
 * 页面滚动由 OverlayScrollbars 接管，需通过实例选项控制；
 * 实例不存在时（异常场景）回退到 html overflow。
 */
export function setBodyScrollLocked(locked: boolean) {
  if (bodyInstance) {
    bodyInstance.options({
      overflow: {
        x: locked ? 'hidden' : 'scroll',
        y: locked ? 'hidden' : 'scroll',
      },
    });
    return;
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}
