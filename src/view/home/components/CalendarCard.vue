<template>
  <div class="calendar-card">
    <div class="top-section">
      <div class="time-area">
        <div class="current-time">{{ currentTime }}</div>
        <div class="current-date">{{ currentDate }}</div>
      </div>
      <div class="tags-area">
        <span class="tag">勤奋</span>
        <span class="tag">认真</span>
        <span class="tag">坚持</span>
      </div>
    </div>
    <div class="bottom-section">
      <div class="info-item">
        <span class="label">星期{{ weekDay }}</span>
      </div>
      <div class="info-item">
        <span class="label">距离年底 {{ daysToYearEnd }} 天</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

defineOptions({
  name: 'CalendarCard',
});

const currentTime = ref('');
const currentDate = ref('');
const weekDay = ref('');
const daysToYearEnd = ref(0);
let timer: any = null;

const updateTime = () => {
  const now = new Date();

  // 格式化时间 HH:MM:SS
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  currentTime.value = `${hours}:${minutes}:${seconds}`;

  // 格式化日期 YYYY年MM月DD日
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  currentDate.value = `${year}年${month}月${day}日`;

  // 星期几
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  weekDay.value = weekDays[now.getDay()];

  // 计算距离年底天数
  const yearEnd = new Date(year, 11, 31, 23, 59, 59);
  const diff = yearEnd.getTime() - now.getTime();
  daysToYearEnd.value = Math.ceil(diff / (1000 * 60 * 60 * 24));
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});
</script>

<style lang="scss" scoped>
.calendar-card {
  background: var(--ao-color-bg-container);
  border-radius: var(--ao-border-radius-xl);
  padding: calc(var(--ao-spacing-md) + var(--ao-spacing-xxs));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: var(--ao-shadow-md);

  .top-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--ao-spacing-xxs);

    .time-area {
      flex: 1;

      .current-time {
        font-size: 40px;
        font-weight: var(--ao-font-weight-bold);
        color: var(--ao-color-text-tertiary);
        letter-spacing: 2px;
        line-height: var(--ao-line-height-tight);
        margin-bottom: var(--ao-spacing-xs);
      }

      .current-date {
        font-size: var(--ao-font-size-base);
        color: var(--ao-color-text-secondary);
        font-weight: var(--ao-font-weight-medium);
      }
    }

    .tags-area {
      display: flex;
      flex-direction: column;
      gap: var(--ao-spacing-xxs);
      align-items: flex-end;

      .tag {
        display: inline-block;
        padding: var(--ao-spacing-xxs) var(--ao-spacing-sm);
        background: var(--ao-gray-6);
        color: var(--ao-gray-0);
        border-radius: var(--ao-border-radius-sm);
        font-size: var(--ao-font-size-xs);
        font-weight: var(--ao-font-weight-medium);
      }
    }
  }

  .bottom-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--ao-spacing-sm);
    border-top: var(--ao-border-width-medium) solid var(--ao-color-border);

    .info-item {
      .label {
        font-size: var(--ao-font-size-sm);
        color: var(--ao-color-text-tertiary);
        font-weight: var(--ao-font-weight-semibold);
      }
    }
  }
}
</style>
