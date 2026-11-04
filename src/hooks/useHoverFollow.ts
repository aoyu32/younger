import { onBeforeUnmount, onMounted, type Ref } from 'vue';

/**
 * 指针跟随高亮：用 elementFromPoint 主动判定指针下的项并打上 hover 类。
 * 滚动时清除，停止滚动后按最后的指针坐标重新判定，
 * 避免浏览器沿用滚动前的 :hover 命中结果。
 */
export function useHoverFollow(options: {
  /** 作用范围容器 */
  container: Ref<HTMLElement | undefined | null>;
  /** 需要跟随的项选择器 */
  itemSelector: string;
  /** 高亮类名 */
  hoverClass?: string;
  /** html 上的滚动标记类名，滚动期间不判定 */
  scrollingClass?: string;
  /** 滚动停止后延迟判定（需大于滚动标记的移除延迟） */
  idleDelay?: number;
}) {
  const hoverClass = options.hoverClass ?? 'is-hovered';
  const scrollingClass = options.scrollingClass ?? 'is-scrolling';
  const idleDelay = options.idleDelay ?? 150;

  let pointerX = -1;
  let pointerY = -1;
  let frame = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const clear = () => {
    document.querySelectorAll(`.${hoverClass}`).forEach((el) => {
      el.classList.remove(hoverClass);
    });
  };

  const update = () => {
    frame = 0;
    if (document.documentElement.classList.contains(scrollingClass)) {
      clear();
      return;
    }
    const container = options.container.value;
    if (!container || pointerX < 0) return;

    const under = document.elementFromPoint(pointerX, pointerY);
    const item = under?.closest(options.itemSelector) as HTMLElement | null;

    if (!item || !container.contains(item)) {
      clear();
      return;
    }

    document.querySelectorAll(`.${hoverClass}`).forEach((el) => {
      if (el !== item) el.classList.remove(hoverClass);
    });
    item.classList.add(hoverClass);
  };

  const scheduleUpdate = () => {
    if (frame) return;
    frame = window.setTimeout(update, 16);
  };

  const onPointerMove = (event: PointerEvent) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    scheduleUpdate();
  };

  const onScroll = () => {
    clear();
    if (timer) clearTimeout(timer);
    timer = setTimeout(update, idleDelay);
  };

  const onPointerLeave = () => clear();

  onMounted(() => {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('blur', clear);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('pointerleave', onPointerLeave);
    window.removeEventListener('blur', clear);
    if (frame) clearTimeout(frame);
    if (timer) clearTimeout(timer);
    clear();
  });
}
