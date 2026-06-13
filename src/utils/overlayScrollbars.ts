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
