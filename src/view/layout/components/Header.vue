<template>
  <div class="header">
    <div class="header_left">
      <div class="left_logo" @click="handleLogoClick">
        <div class="logo_img">
          <img src="@/assets/younger_logo.png" />
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
          <li v-for="(item, itemIndex) in navItems" :key="index">
            <a href="javascript:;" @click="handleNavClick(item.anchor)">
              <span
                v-for="(value, itemNameIndex) in item.name.split('')"
                :key="index"
                :style="{
                  fontSize: itemNameIndex === 0 ? '15px' : '14px',
                }"
                >{{ value }}</span
              >
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="header_right flex-center">
      <div class="tool_collect">
        <!-- <button>工具收藏</button> -->
      </div>
      <div class="right-vip flex-center" @click="$router.push('/vip')">
        <AoImage
          src="@/assets/vip/icon_svip.svg"
          width="20px"
          height="20px"
        ></AoImage>
        <span>开通会员</span>
      </div>
      <div class="right_user">
        <div class="auth-box flex-center" v-if="!isLogin">
          <div class="login" @click="$router.push('/login')">登录</div>
          <div class="line"></div>
          <div class="register" @click="$router.push('/register')">注册</div>
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
            <div class="name ellipsis">张fdsfsdfsdf</div>
          </div>
          <div class="header-menu">
            <div class="menu-wrapper">
              <div class="menu-item">开通会员</div>
              <div class="menu-item">我的课程</div>
              <div class="menu-item logout">退出登录</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
// 组件名称
defineOptions({
  name: 'LayoutHeader',
});

// 响应式数据
const isLogin = ref(false);
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
    name: '教程视频',
    route: '',
    anchor: 'videos',
  },
  {
    icon: '',
    name: 'AI资讯',
    route: '',
  },
  {
    icon: '',
    name: '网站导航',
    route: '',
  },
]);

const handleLogoClick = () => {
  router.push('/');
};

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
  gap: calc(var(--ao-spacing-xxl) + var(--ao-spacing-md));

  .left_logo {
    display: flex;
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
    ul {
      display: flex;
      gap: var(--ao-spacing-xl);
      font-size: var(--ao-font-size-sm);

      a {
        text-decoration: none;
        color: var(--ao-color-text-base);
        opacity: 0.75;
        transition: color var(--ao-duration-fast) var(--ao-ease-in-out);

        &:hover {
          color: var(--ao-color-primary);
        }
      }
    }
  }
}

.header_right {
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
        max-height: 200px;
        pointer-events: auto;
      }
    }
  }

  .header-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
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

      &:hover {
        background-color: var(--ao-gray-1);
      }
    }

    .logout {
      color: var(--ao-color-error);
    }
  }
}
</style>
