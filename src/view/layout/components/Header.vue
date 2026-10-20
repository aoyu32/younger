<template>
  <div class="header">
    <div
      class="header_left"
      :class="{ 'nav-all-collapsed': visibleMenus.length === 0 }"
    >
      <router-link class="left_logo" to="/home">
        <div class="logo_img">
          <AoImage src="@/assets/logo.svg" width="33px" />
        </div>
        <div class="logo_name">
          <div class="name_cn">
            <span v-for="(item, index) in chLogoName" :key="index">
              {{ item }}
            </span>
          </div>
          <div class="name_en">
            <span v-for="(item, index) in enLogoName" :key="index">
              {{ item }}
            </span>
          </div>
        </div>
      </router-link>
      <div class="left_nav" ref="navRef">
        <ul class="nav-list" ref="navListRef">
          <li
            v-for="item in visibleMenus"
            :key="item.path"
            :class="{ active: currentPath === item.path }"
          >
            <router-link :to="item.path">
              <span
                v-for="(value, valueIndex) in item.meta.title.split('')"
                :key="valueIndex"
                >{{ value }}</span
              >
            </router-link>
          </li>
        </ul>
        <div v-if="hiddenMenus.length" class="nav-more">
          <button
            class="nav-more-trigger"
            type="button"
            aria-label="更多导航"
            aria-haspopup="true"
          >
            <svg
              class="nav-more-icon"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <div class="nav-more-dropdown">
            <router-link
              v-for="item in hiddenMenus"
              :key="item.path"
              :to="item.path"
              class="nav-more-item"
              :class="{ active: currentPath === item.path }"
            >
              {{ item.meta.title }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="header_right flex-center">
      <div class="right-vip flex-center" @click="router.push('/vip')">
        <AoImage
          src="@/assets/vip/icon_svip.svg"
          width="17px"
          height="17px"
        ></AoImage>
        <span>开通会员</span>
      </div>
      <div class="right_user" @click="handleUserClick">
        <div class="auth-box flex-center" v-if="!isLogin">
          <div class="login" @click.stop="router.push('/login')">登录</div>
          <div class="line"></div>
          <div class="register" @click.stop="router.push('/register')">
            注册
          </div>
        </div>
        <div class="user-info-box flex-center" v-else>
          <div class="user_avatar">
            <AoImage
              src="@/assets/avatar.png"
              width="30px"
              height="30px"
              circle
            />
          </div>
          <div class="user_name">
            <div class="name ellipsis">张dffsdfsdfdsfsfdsfsdf</div>
          </div>
          <div class="header-menu">
            <div class="menu-wrapper">
              <div
                v-for="menu in userMenus"
                :key="menu.tab"
                class="menu-item"
                @click.stop="goProfile(menu.tab)"
              >
                {{ menu.title }}
              </div>
              <div class="menu-item logout" @click.stop="handleLogout">
                退出登录
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUser } from '@/store/module/user';
const router = useRouter();
const routers = router.getRoutes();
const currentPath = computed(() => router.currentRoute.value.path);

// 导航响应式：空间不足时从后往前收进“更多”下拉菜单
const navRef = ref(null);
const navListRef = ref(null);
const visibleCount = ref(Number.MAX_SAFE_INTEGER);
const NAV_MORE_WIDTH = 24;
const NAV_MIN_VIEWPORT = 600;
let navResizeObserver = null;
let measureFrame = 0;
let isMeasuring = false;
let navItemWidths = [];
// 组件名称
defineOptions({
  name: 'LayoutHeader',
});

// 响应式数据
const { isLogin, logout } = useUser();

// 用户下拉菜单：跳转到个人中心，并激活对应分组下的第一个菜单项
// tab 传的是个人中心左侧导航的菜单 key，传分组 key（collect / security / order）时激活该分组第一项
const userMenus = [
  { title: '我的收藏', tab: 'collect' },
  { title: '账号安全', tab: 'security' },
  { title: '我的订单', tab: 'order' },
  { title: '我的课程', tab: 'course-purchased' },
];

// 跳转个人中心指定菜单
const goProfile = (tab) => {
  router.push({ path: '/profile', query: { tab } });
};

// 退出登录
const handleLogout = () => {
  logout();
  if (router.currentRoute.value.path === '/profile') {
    router.push('/home');
  }
};

// 已登录时点击用户区进入个人中心
const handleUserClick = () => {
  if (isLogin.value) {
    router.push('/profile');
  }
};

const chLogoName = computed(() => {
  const name = routers.find((item) => item.path === '/home').meta.title;
  return name;
});

const enLogoName = computed(() => {
  const name = routers.find((item) => item.path === '/home').name;
  return name;
});

const navMenuRouters = computed(() => {
  const menu = routers.filter((item) => item.meta.menu);
  return menu;
});

const visibleMenus = computed(() =>
  navMenuRouters.value.slice(0, visibleCount.value),
);
const hiddenMenus = computed(() =>
  navMenuRouters.value.slice(visibleCount.value),
);

/** 量取全部导航项的真实宽度，测量后恢复为当前可见数量 */
const measureNavItemWidths = async () => {
  const listEl = navListRef.value;
  const menus = navMenuRouters.value;
  if (!listEl) return [];

  visibleCount.value = menus.length;
  await nextTick();

  const itemEls = Array.from(listEl.children);
  if (itemEls.length !== menus.length) return [];

  return itemEls.map((el) => el.getBoundingClientRect().width);
};

/**
 * 计算当前宽度下能放下的导航项。
 * 宽度缓存后，拖动窗口时不会反复重排全部导航项，避免下拉图标闪烁。
 */
const calculateVisibleMenus = async () => {
  if (isMeasuring) return;

  const navEl = navRef.value;
  const listEl = navListRef.value;
  if (!navEl || !listEl) return;

  const menus = navMenuRouters.value;
  if (!menus.length) {
    visibleCount.value = 0;
    return;
  }

  // 最小宽度下只保留下拉菜单，避免单独留下第一个导航项
  if (window.innerWidth <= NAV_MIN_VIEWPORT) {
    visibleCount.value = 0;
    return;
  }

  isMeasuring = true;
  let itemWidths = navItemWidths;

  if (itemWidths.length !== menus.length) {
    itemWidths = await measureNavItemWidths();
    if (itemWidths.length !== menus.length) {
      isMeasuring = false;
      return;
    }
    navItemWidths = itemWidths;
  }

  const listStyle = window.getComputedStyle(listEl);
  const navStyle = window.getComputedStyle(navEl);
  const gap = parseFloat(listStyle.columnGap || listStyle.gap || '0') || 0;
  const triggerGap =
    parseFloat(navStyle.columnGap || navStyle.gap || '0') || 0;
  const availableWidth = navEl.getBoundingClientRect().width - 1;
  const allItemsWidth =
    itemWidths.reduce((total, width) => total + width, 0) +
    gap * (itemWidths.length - 1);

  // 全部放得下，不需要下拉图标
  if (allItemsWidth <= availableWidth) {
    visibleCount.value = menus.length;
    isMeasuring = false;
    return;
  }

  // 否则保留尽可能多的导航项，并在最后为下拉图标预留位置
  let usedWidth = 0;
  let count = 0;
  for (let index = 0; index < itemWidths.length; index += 1) {
    const nextWidth =
      usedWidth + (index > 0 ? gap : 0) + itemWidths[index];
    if (nextWidth + triggerGap + NAV_MORE_WIDTH > availableWidth) {
      break;
    }
    usedWidth = nextWidth;
    count += 1;
  }

  visibleCount.value = count;
  isMeasuring = false;
};

const scheduleMeasure = () => {
  if (measureFrame) cancelAnimationFrame(measureFrame);
  measureFrame = requestAnimationFrame(() => {
    measureFrame = 0;
    calculateVisibleMenus();
  });
};

onMounted(async () => {
  await nextTick();
  calculateVisibleMenus();

  // 字体加载完成后字宽可能变化，清空宽度缓存后重新计算
  document.fonts?.ready?.then(() => {
    navItemWidths = [];
    scheduleMeasure();
  });

  if (typeof ResizeObserver !== 'undefined' && navRef.value) {
    navResizeObserver = new ResizeObserver(() => {
      calculateVisibleMenus();
    });
    navResizeObserver.observe(navRef.value);
  }
  window.addEventListener('resize', scheduleMeasure);
});

onBeforeUnmount(() => {
  if (measureFrame) cancelAnimationFrame(measureFrame);
  navResizeObserver?.disconnect();
  window.removeEventListener('resize', scheduleMeasure);
});

const handleLogoClick = () => {
  router.push('/');
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: var(--ao-container-max-width);
  height: var(--ao-header-height-lg);

  img {
    width: var(--ao-control-height-md);
    height: var(--ao-control-height-md);

    object-fit: contain;
  }
}

.header_left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  padding-right: var(--ao-spacing-md);
  box-sizing: border-box;
  --nav-logo-gap: calc(var(--ao-spacing-xxl) + var(--ao-spacing-md));
  gap: var(--nav-logo-gap);

  // 导航项全部收起时只移动下拉图标，不改变导航区宽度，避免宽度计算反复抖动
  &.nav-all-collapsed .nav-more {
    margin-left: calc(var(--ao-spacing-lg) - var(--nav-logo-gap));
  }

  .left_logo {
    display: flex;
    flex-shrink: 0;
    gap: var(--ao-spacing-sm);
    cursor: pointer;
  }

  .logo_img {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo_name {
    display: flex;
    flex-direction: column;
    align-items: normal;
    justify-content: center;
    gap: var(--ao-border-radius-xs);
    font-family: var(--ao-font-family-ali);
  }

  .name_cn {
    width: 100px;
    height: auto;
    display: flex;
    justify-content: space-between;
    font-size: var(--ao-font-size-base);
    font-weight: var(--ao-font-weight-semibold);
    color: var(--ao-color-primary);
  }

  .name_en {
    display: flex;
    justify-content: space-between;
    font-size: var(--ao-font-size-sm);
    color: var(--ao-color-text-secondary);
    opacity: var(--ao-opacity-hover);
  }

  .left_nav {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    position: relative;
    gap: var(--ao-spacing-xl);

    .nav-list {
      display: flex;
      align-items: center;
      flex: 0 1 auto;
      min-width: 0;
      margin: 0;
      padding: 0;
      overflow: hidden;
      list-style: none;
      gap: var(--ao-spacing-xl);
      font-size: var(--ao-font-size-sm);
      white-space: nowrap;

      // 导航项全部收起时去掉空列表占位，让下拉图标回到导航区起点
      &:empty {
        display: none;
      }

      li {
        flex: 0 0 auto;
        white-space: nowrap;
      }

      a {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        white-space: nowrap;
        color: var(--ao-color-text-base);
        opacity: 0.75;
        transition: color var(--ao-duration-fast) var(--ao-ease-in-out);

        span:first-child {
          font-family: var(--ao-font-family-ali);
          color: var(--ao-gray-7);
          font-size: 15px;
        }

        &:hover {
          span:first-child {
            color: var(--ao-color-primary-hover);
          }
          color: var(--ao-color-primary-hover);
        }
      }
    }

    .nav-more {
      position: relative;
      display: flex;
      align-items: center;
      flex: 0 0 auto;
    }

    .nav-more-trigger {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      border: var(--ao-border-width-thin) solid var(--ao-color-border);
      border-radius: var(--ao-border-radius-base);
      background-color: var(--ao-color-bg-container);
      color: var(--ao-color-text-secondary);
      cursor: pointer;
      transition:
        color var(--ao-duration-fast) var(--ao-ease-in-out),
        border-color var(--ao-duration-fast) var(--ao-ease-in-out),
        background-color var(--ao-duration-fast) var(--ao-ease-in-out);

      &:hover,
      &:focus-visible {
        color: var(--ao-color-primary);
        border-color: var(--ao-color-primary);
        background-color: var(--ao-gray-1);
      }

      &:focus-visible {
        outline: 2px solid var(--ao-color-primary);
        outline-offset: 1px;
      }
    }

    .nav-more-icon {
      width: 16px;
      height: 16px;
      transition: transform var(--ao-duration-fast) var(--ao-ease-in-out);
    }

    .nav-more-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      z-index: 20;
      display: flex;
      flex-direction: column;
      min-width: 132px;
      padding: 6px 0;
      border-radius: var(--ao-border-radius-lg);
      background-color: var(--ao-color-bg-container);
      box-shadow: var(--ao-shadow-md);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: translateY(-4px);
      transition:
        opacity var(--ao-duration-fast) var(--ao-ease-in-out),
        transform var(--ao-duration-fast) var(--ao-ease-in-out),
        visibility var(--ao-duration-fast) var(--ao-ease-in-out);

      &::before {
        content: '';
        position: absolute;
        top: -8px;
        right: 0;
        left: 0;
        height: 8px;
      }
    }

    .nav-more:hover,
    .nav-more:focus-within {
      .nav-more-dropdown {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: translateY(0);
      }

      .nav-more-icon {
        transform: rotate(180deg);
      }
    }

    .nav-more-item {
      display: block;
      padding: 9px 16px;
      color: var(--ao-color-text-base);
      white-space: nowrap;
      text-decoration: none;
      font-size: var(--ao-font-size-sm);
      opacity: 0.8;
      transition:
        color var(--ao-duration-fast) var(--ao-ease-in-out),
        background-color var(--ao-duration-fast) var(--ao-ease-in-out);

      &:hover {
        color: var(--ao-color-primary);
        background-color: var(--ao-gray-1);
        opacity: 1;
      }

      &.active {
        color: var(--ao-color-primary);
        opacity: 1;
      }
    }
  }
}

.router-link-active {
  span {
    color: var(--ao-color-primary) !important;
  }
  .name_en {
    span {
      color: var(--ao-color-text-secondary) !important;
    }
  }
}

.header_right {
  flex-shrink: 0;
  gap: calc(var(--ao-spacing-sm) + 2px);

  .tool_collect {
    button {
      padding: 6px 14px;
      font-size: var(--ao-font-size-xs);
      border-radius: var(--ao-border-radius-lg);
      font-weight: var(--ao-font-weight-semibold);
      cursor: pointer;
      transition: background-color var(--ao-duration-fast) var(--ao-ease-in-out);
      background-color: var(--ao-color-primary-outline);
      color: var(--ao-color-primary);
      border: var(--ao-border-width-thin) solid var(--ao-color-border);

      &:hover {
        background-color: var(--ao-color-primary-bg-hover);
        border-color: var(--ao-color-border);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  .right-vip {
    margin: 0 15px;
    gap: var(--ao-spacing-xxs);
    cursor: pointer;
    transition: all 0.1s ease-in-out;
    &:hover {
      color: rgb(233, 182, 75);
    }
    span {
      padding-bottom: 1px;
    }
  }

  .right_user {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ao-spacing-sm);
  }

  .auth-box {
    gap: var(--ao-spacing-sm);
    font-size: var(--ao-font-size-sm);
    color: var(--ao-color-primary);

    .line {
      width: var(--ao-border-width-thin);
      height: var(--ao-spacing-md);
      background-color: var(--ao-color-border);
      margin: 0 6px;
    }

    .login,
    .register {
      cursor: pointer;
      transition: color var(--ao-duration-base) var(--ao-ease-in-out);

      &:hover {
        color: var(--ao-color-primary-hover);
      }
    }
  }

  .user-info-box {
    gap: 6px;
    cursor: pointer;
    position: relative;
    .user_name {
      .name {
        max-width: 100px;
      }
    }

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      height: 8px;
    }

    &:hover {
      .header-menu {
        max-height: 260px;
        pointer-events: auto;
      }
    }
  }

  .header-menu {
    position: absolute;
    top: 100%;
    /* 修复：改为右对齐，防止菜单超出屏幕右侧 */
    right: 0;
    left: auto;
    /* 修复：取消宽度跟随父元素 */
    /* width: 100%; */
    /* 修复：由内容撑开宽度，并设置最小宽度 */
    width: max-content;
    min-width: 120px;
    margin-top: 8px;
    background-color: var(--ao-gray-0);
    box-shadow: var(--ao-shadow-md);
    border-radius: var(--ao-border-radius-lg);
    max-height: 0;
    overflow: hidden;
    pointer-events: none;
    transition: max-height 0.3s ease-in-out;

    .menu-item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 15px;
      width: 100%;
      /* 修复：强制文字不换行 */
      white-space: nowrap;
      cursor: pointer;
      transition: background-color var(--ao-duration-fast)
        var(--ao-ease-in-out);

      &:hover {
        background-color: var(--ao-gray-1);
      }
    }

    .logout {
      color: var(--ao-color-error);
    }
  }
}

@media (max-width: 900px) {
  .header_right {
    gap: 8px;

    .right-vip {
      margin: 0 4px 0 15px;
    }

    .user-info-box {
      .user_avatar :deep(.ao-image) {
        width: 26px !important;
        height: 26px !important;
      }

      .user_name .name {
        max-width: 64px;
      }
    }
  }
}
</style>
