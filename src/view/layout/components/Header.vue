<template>
  <div class="header">
    <div class="header_left">
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
      <div class="left_nav">
        <ul>
          <li
            v-for="(item, itemIndex) in navMenuRouters"
            :key="itemIndex"
            :class="{ active: router.path === item.path }"
          >
            <router-link :to="item.path">
              <span
                v-for="value in item.meta.title.split('')"
                :key="itemIndex"
                >{{ value }}</span
              >
            </router-link>
          </li>
        </ul>
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
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUser } from '@/store/module/user';
const router = useRouter();
const routers = router.getRoutes();
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
  console.log(routers);
  const menu = routers.filter((item) => item.meta.menu);
  return menu;
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
    ul {
      display: flex;
      gap: var(--ao-spacing-xl);
      font-size: var(--ao-font-size-sm);
      a {
        text-decoration: none;
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
</style>
