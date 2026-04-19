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

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({
  name: 'CalendarCard'
})

const currentTime = ref('')
const currentDate = ref('')
const weekDay = ref('')
const daysToYearEnd = ref(0)
let timer = null

const updateTime = () => {
  const now = new Date()
  
  // 格式化时间 HH:MM:SS
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}:${seconds}`
  
  // 格式化日期 YYYY年MM月DD日
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  currentDate.value = `${year}年${month}月${day}日`
  
  // 星期几
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  weekDay.value = weekDays[now.getDay()]
  
  // 计算距离年底天数
  const yearEnd = new Date(year, 11, 31, 23, 59, 59)
  const diff = yearEnd - now
  daysToYearEnd.value = Math.ceil(diff / (1000 * 60 * 60 * 24))
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style lang="scss" scoped>
.calendar-card {
  background: var(--app-bg-color-light);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  .top-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 5px;

    .time-area {
      flex: 1;

      .current-time {
        font-size: 40px;
        font-weight: 700;
        color: var(--app-text-color-light);
        letter-spacing: 2px;
        line-height: 1.2;
        margin-bottom: 8px;
      }

      .current-date {
        font-size: 16px;
        color: var(--app-bg-color-dark);
        font-weight: 500;
      }
    }

    .tags-area {
      display: flex;
      flex-direction: column;
      gap: 5px;
      align-items: flex-end;

      .tag {
        display: inline-block;
        padding: 4px 12px;
        background: var(--calendar-card-tag-bg-color);
        color: var(--app-bg-color-light);
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
      }
    }
  }

  .bottom-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    border-top: 2px solid var(--app-border-color);

    .info-item {
      .label {
        font-size: 14px;
        color: var(--app-text-color-light);
        font-weight: 600;
      }
    }
  }
}
</style>