<template>
  <div class="login flex">
    <div class="login-left flex-center">
      <div class="left-wrapper flex-c">
        <div class="logo-box">
          <div class="logo-img">
            <AoImage
              src="@/assets/logo.png"
              width="25px"
              height="25px"
            />
          </div>
          <div class="logo-name">洋果教育</div>
        </div>
        <SwipperCard />
      </div>
    </div>
    <div class="login-right">
      <div class="login-form"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SwipperCard from '../components/SwipperCard.vue';
defineOptions({
  name: 'Login',
});

const loginForm = ref({
  username: '',
  password: '',
});

const handleLogin = () => {
  console.log(loginForm.value);
};
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
