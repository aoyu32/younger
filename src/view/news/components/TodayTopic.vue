<template>
  <div class="today-topic">
    <div class="card-header">
      <h3>今日<span>话题</span></h3>
      <div class="page-btns">
        <span class="action-btn" @click="handleJoin"
          >点击加入今日话题讨论吧</span
        >
      </div>
    </div>

    <div class="topic-section">
      <p class="topic-content">{{ content }}</p>
      <div class="img-date flex-between">
        <div class="imgs" v-if="hasImages">
          <div class="img-placeholder" v-for="i in 3" :key="i"></div>
        </div>
      </div>
    </div>

    <div class="comment-section">
      <div class="comment-header">
        <span class="comment-title">已有 {{ peopleCount }} 人参与</span>
      </div>
      <div class="comment-list" v-if="comments.length > 0">
        <div class="comment-item" v-for="comment in comments" :key="comment.id">
          <div class="comment-avatar"></div>
          <div class="comment-details">
            <div class="comment-user">{{ comment.user }}</div>
            <div class="comment-text">{{ comment.text }}</div>
          </div>
          <div class="comment-like">已获 {{ comment.likes }} 赞</div>
        </div>
      </div>
      <div class="empty-comment" v-else>
        <p>还没有人开始讨论~</p>
      </div>
      <div class="comment-more flex-between">
        <span>
          {{
            comments.length > 0
              ? '查看更多讨论内容...'
              : '快去抢占第一排沙发...'
          }}
        </span>
        <div class="smile">{{ currentSmile }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const smileList = [
  '◕‿◕',
  '✿◠‿◠',
  '❤◠‿◠',
  '★◠‿◠',
  '♪◠‿◠',
  '☀◠‿◠',
  '✧◡‿◡',
  '♥‿♥',
  '^‿^',
  '◕‿◕',
  '•ᴗ•',
  '˘◡˘',
  '❤˘‿˘',
  '♡ˇ‿ˇ',
];
const currentSmile = ref('(◕‿◕)');

const getRandomSmile = () => {
  const randomIndex = Math.floor(Math.random() * smileList.length);
  return smileList[randomIndex];
};
defineOptions({
  name: 'TodayTopic',
});

const props = defineProps<{
  content: string;
  date: string;
  peopleCount: string;
  comments: Array<{ id: number; user: string; text: string; likes: number }>;
}>();

const hasImages = ref(false);

const handleJoin = () => {
  console.log('加入今日话题讨论');
};

onMounted(() => {
  currentSmile.value = getRandomSmile();
});
</script>

<style scoped lang="scss">
.today-topic {
  background: var(--ao-color-bg-container);
  border-radius: var(--ao-border-radius-xl);
  padding: 15px 20px;
  overflow: hidden;
  border: var(--ao-border-width-thin) solid var(--ao-color-border);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-height: 280px;
  cursor: pointer;
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: var(--ao-spacing-xs);
    border-bottom: 1px solid var(--ao-color-border);

    span {
      color: var(--ao-color-primary);
    }

    h3 {
      margin: 0;
      font-size: var(--ao-font-size-base);
      font-weight: var(--ao-font-weight-semibold);
      color: var(--ao-color-text-base);
      position: relative;
    }

    .action-btn {
      font-size: var(--ao-font-size-sm);
      color: var(--ao-color-text-tertiary);
      cursor: pointer;
      padding: 4px 8px;
      border-radius: var(--ao-border-radius-sm);
      transition: all var(--ao-duration-fast) var(--ao-ease-out);
      white-space: nowrap;
      &:hover {
        color: var(--ao-color-text-base);
        background-color: color-mix(in srgb, var(--ao-gray-4) 20%, transparent);
      }
    }
  }

  .topic-section {
    padding: 8px 0 4px 0;
    border-bottom: none;

    .topic-content {
      font-size: var(--ao-font-size-base);
      color: var(--ao-color-text-secondary);
      margin-bottom: 12px;
    }

    .img-date {
      align-items: flex-end;
      .imgs {
        display: flex;
        gap: 10px;
        .img-placeholder {
          width: 100px;
          height: 70px;
          background: var(--ao-gray-4);
          border-radius: var(--ao-border-radius-sm);
          flex-shrink: 0;
        }
      }
      .topic-date {
        font-size: var(--ao-font-size-md);
        color: var(--ao-color-text-tertiary);
      }
    }
  }

  .comment-section {
    margin-top: 12px;
    padding-top: 12px;
    border-top: var(--ao-border-width-thin) solid var(--ao-color-border);

    .comment-header {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 10px;
      .comment-title {
        font-size: var(--ao-font-size-sm);
        font-weight: var(--ao-font-weight-medium);
        color: var(--ao-color-text-secondary);
      }
    }

    .comment-list {
      display: flex;
      flex-direction: column;
      gap: 14px;

      .comment-item {
        display: flex;
        align-items: flex-start;
        padding: 4px 0;
        transition: all var(--ao-duration-fast) var(--ao-ease-out);
        border-bottom: none;
        cursor: pointer;

        .comment-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--ao-gray-4);
          flex-shrink: 0;
          margin-right: 12px;
          margin-top: 2px;
        }

        .comment-details {
          flex: 1;
          .comment-user {
            font-size: var(--ao-font-size-sm);
            font-weight: var(--ao-font-weight-semibold);
            color: var(--ao-color-text-base);
            margin-bottom: 4px;
          }
          .comment-text {
            font-size: var(--ao-font-size-xs);
            color: var(--ao-color-text-tertiary);
          }
        }

        .comment-like {
          font-size: var(--ao-font-size-xs);
          color: var(--ao-color-text-tertiary);
          flex-shrink: 0;
          margin-left: 12px;
          white-space: nowrap;
        }
      }
    }

    .comment-more {
      text-align: left;
      font-size: var(--ao-font-size-sm);
      color: var(--ao-color-text-tertiary);
      padding-top: 12px;
      margin-top: 8px;
      border-top: var(--ao-border-width-thin) solid var(--ao-color-border);
      cursor: pointer;
      &:hover {
        color: var(--ao-color-text-base);
      }
    }

    .smile {
      color: var(--ao-color-primary);
    }
  }

  .empty-comment {
    min-height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ao-gray-6);
  }
}
</style>
