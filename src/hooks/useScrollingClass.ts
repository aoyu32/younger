import { onBeforeUnmount, onMounted } from 'vue';

/**
 * 滚动状态标记：滚动期间给 html 加 is-scrolling，停止后移除。
 * 配合滚动期间的 pointer-events: none，可在停止滚动时重新计算命中，
 * 既不留滚动前的 hover 残留，也能让指针正好所在的卡片立即进入 hover。
 */
export function useScrollingClass(idleDelay = 120) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const root = document.documentElement;

  const onScroll = () => {
    root.classList.add('is-scrolling');
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      root.classList.remove('is-scrolling');
    }, idleDelay);
  };

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll);
    if (timer) clearTimeout(timer);
    root.classList.remove('is-scrolling');
  });
}
