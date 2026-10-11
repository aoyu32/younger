<template>
  <div class="profile">
    <div class="user-card-wrapper">
      <UserInfoCard :src="bgUrl" />
    </div>
    <div class="line">
      <AoImage
        src="@/assets/profile/icon_rose_line.svg"
        width="100%"
        height="96px"
      ></AoImage>
    </div>
    <div class="profile-tabs">
      <UserCenterTabs @change="handleChange">
        <template #default="{ activeItem }">
          <div class="tab-content">
            <h3 class="tab-title">{{ activeItem?.title }}</h3>
          </div>
        </template>
      </UserCenterTabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UserInfoCard from './components/UserInfoCard.vue';
import UserCenterTabs from './components/UserCenterTabs.vue';
import bgUrl from '@/assets/green-rose-flower.jpg';

const handleChange = (item: { key: string; title: string }) => {
  console.log('当前选中：', item.title);
};

</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>
