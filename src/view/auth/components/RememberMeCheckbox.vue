<template>
  <label class="remember-me">
    <input v-model="checked" type="checkbox" autocomplete="off" />
    <span class="remember-me__box" aria-hidden="true"></span>
    <span class="remember-me__text">保持登录</span>
  </label>
</template>

<script setup lang="ts">
/** 勾选后后端下发 30 天持久 Cookie，关闭浏览器仍保持登录 */
const checked = defineModel<boolean>({ default: false });
</script>

<style scoped lang="scss">
.remember-me {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;

  input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
  }

  &__box {
    position: relative;
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    border: var(--ao-border-width-thin) solid var(--ao-color-border);
    border-radius: 3px;
    background-color: var(--ao-gray-0);
    transition:
      background-color var(--ao-duration-fast) var(--ao-ease-in-out),
      border-color var(--ao-duration-fast) var(--ao-ease-in-out);
  }

  /* 选中态：品牌色底 + 白色对勾 */
  input:checked + &__box {
    border-color: var(--ao-color-primary);
    background-color: var(--ao-color-primary);

    &::after {
      content: '';
      position: absolute;
      top: 1px;
      left: 4px;
      width: 4px;
      height: 8px;
      border-right: 2px solid var(--ao-gray-0);
      border-bottom: 2px solid var(--ao-gray-0);
      transform: rotate(45deg);
    }
  }

  /* 键盘聚焦时给出可见焦点环 */
  input:focus-visible + &__box {
    outline: 2px solid var(--ao-color-primary-bg-hover);
    outline-offset: 1px;
  }

  &__text {
    line-height: 1;
  }
}
</style>
