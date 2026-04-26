<template>
  <div
    class="header"
    :style="{ width: $route.path === '/video' ? '90%' : '1200px' }"
  >
    <div class="header_left">
      <div class="left_logo">
        <div class="logo_img">
          <img src="@/assets/logo.png" alt="" />
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
      </div>
      <div class="left_nav">
        <ul>
          <li v-for="(item, index) in navItems" :key="index">
            <a href="javascript:;" @click="handleNavClick(item.anchor)">{{
              item.name
            }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="header_right">
      <div class="tool_collect">
        <button>工具收藏</button>
      </div>
      <div class="right_user">
        <div class="user_avatar">
          <img src="@/assets/avatar.png" alt="" />
        </div>
        <div class="user_name">张三</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 组件名称
defineOptions({
  name: 'LayoutHeader',
});

// 响应式数据
const chLogoName = ref(['洋', '果', '教', '育']);
const enLogoName = ref(['Y', 'O', 'U', 'N', 'G', 'E', 'R']);
const navItems = ref([
  {
    icon: '',
    name: '软件工具',
    route: '',
    anchor: 'tools',
  },
  {
    icon: '',
    name: '教育视频',
    route: '',
    anchor: 'videos',
  },
]);

// 平滑滚动函数
const smoothScrollTo = (to, duration = 450) => {
  const start = window.pageYOffset;
  const distance = to - start;
  const startTime = performance.now();

  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = easeInOutCubic(progress);
    window.scrollTo(0, start + distance * eased);
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

// 导航点击处理
const handleNavClick = (anchor) => {
  const el = document.getElementById(anchor);
  if (!el) return;
  const header = document.querySelector('header');
  const offset = header ? header.getBoundingClientRect().height : 0;
  const to = el.getBoundingClientRect().top + window.pageYOffset - offset - 10;
  smoothScrollTo(to, 450);
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 1200px;
  height: 72px;
  img {
    width: 40px;
    height: 40px;
    object-fit: cover;
  }
}

.header_left {
  display: flex;
  align-items: center;
  gap: 60px;
  .left_logo {
    display: flex;
    gap: 10px;
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
    gap: 2px;
  }

  .name_cn {
    width: 100px;
    height: auto;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 550;
    color: var(--app-primary-color);
  }

  .name_en {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: var(--app-bg-color-dark);
    opacity: 0.7;
  }

  .left_nav {
    ul {
      display: flex;
      gap: 40px;
      font-size: 14px;

      a {
        text-decoration: none;
        color: var(--app-text-color-dark);
        opacity: 0.75;
        transition: 0.18s;

        &:hover {
          color: var(--app-primary-color);
        }
      }
    }
  }
}

.header_right {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;

  .tool_collect {
    button {
      padding: 6px 14px;
      font-size: 12px;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: 0.18s;
      background-color: rgba(0, 163, 163, 0.12);
      color: var(--app-primary-color);
      border: 1px solid var(--app-border-color);

      &:hover {
        background-color: rgba(0, 163, 163, 0.18);
        border-color: var(--app-border-color);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  .right_user {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .user_name {
    font-size: 14px;
  }

  .user_avatar {
    width: 36px;
    height: 36px;
    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
}
</style>
