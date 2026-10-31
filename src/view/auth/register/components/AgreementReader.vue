<template>
  <Teleport to="body">
    <Transition name="agreement-reader-fade">
      <div
        v-if="modelValue"
        class="agreement-reader"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <header class="agreement-reader__header">
          <span class="agreement-reader__title">{{ title }}</span>
          <button
            type="button"
            class="agreement-reader__close"
            aria-label="关闭"
            @click="close"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <main class="agreement-reader__body">
          <div class="agreement-reader__doc">
            <AoMarkdown
              mode="preview"
              :content="content"
              :editor-id="editorId"
              :preview-props="{ previewTheme: 'github' }"
            />
          </div>
        </main>

        <footer class="agreement-reader__footer">
          <button
            type="button"
            class="agreement-reader__confirm"
            @click="close"
          >
            我已知晓
          </button>
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';
import AoMarkdown from '@/components/ao-markdown/index.vue';
import userAgreement from '@/assets/agreement/user-agreement.md?raw';
import privacyPolicy from '@/assets/agreement/privacy-policy.md?raw';

export type AgreementType = 'user' | 'privacy';

interface Props {
  modelValue: boolean;
  type?: AgreementType;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'user',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const title = computed(() =>
  props.type === 'privacy' ? '隐私政策' : '用户协议',
);

const content = computed(() =>
  props.type === 'privacy' ? privacyPolicy : userAgreement,
);

/** 预览组件需要稳定的 editor-id，避免多次打开重复注册 */
const editorId = computed(() =>
  props.type === 'privacy' ? 'agreement-privacy' : 'agreement-user',
);

const close = () => {
  emit('update:modelValue', false);
};

/** 全屏阅读时锁定背景滚动 */
watch(
  () => props.modelValue,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : '';
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped lang="scss">
.agreement-reader {
  position: fixed;
  inset: 0;
  z-index: var(--ao-z-modal);
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--ao-color-bg-container);

  &__header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 20px;
    border-bottom: var(--ao-border-width-thin) solid
      var(--ao-color-border-secondary);
    background-color: var(--ao-color-bg-container);
  }

  &__title {
    font-size: var(--ao-font-size-lg);
    font-weight: var(--ao-font-weight-semibold);
    color: var(--ao-color-text-base);
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: var(--ao-border-radius-circle);
    background: none;
    color: var(--ao-color-text-tertiary);
    cursor: pointer;
    transition:
      color var(--ao-duration-fast) var(--ao-ease-in-out),
      background-color var(--ao-duration-fast) var(--ao-ease-in-out);

    &:hover {
      color: var(--ao-color-primary);
      background-color: var(--ao-gray-2);
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  &__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    background-color: var(--ao-color-bg-layout);
  }

  &__doc {
    max-width: 880px;
    min-height: 100%;
    margin: 0 auto;
    padding: 40px 48px;
    background-color: var(--ao-color-bg-container);
    line-height: 1.9;
  }

  &__footer {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 20px;
    border-top: var(--ao-border-width-thin) solid
      var(--ao-color-border-secondary);
    background-color: var(--ao-color-bg-container);
  }

  &__confirm {
    min-width: 200px;
    height: 40px;
    padding: 0 32px;
    border: var(--ao-border-width-thin) solid var(--ao-color-primary);
    border-radius: var(--ao-border-radius-base);
    background-color: var(--ao-color-primary);
    color: var(--ao-gray-0);
    font-size: var(--ao-font-size-sm);
    cursor: pointer;
    transition: background-color var(--ao-duration-fast) var(--ao-ease-in-out);

    &:hover {
      background-color: var(--ao-color-primary-hover);
    }
  }
}

.agreement-reader-fade-enter-active,
.agreement-reader-fade-leave-active {
  transition: opacity var(--ao-duration-base) var(--ao-ease-in-out);
}

.agreement-reader-fade-enter-from,
.agreement-reader-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .agreement-reader__doc {
    margin: 0;
    padding: 24px 20px;
    border: none;
    border-radius: 0;
  }

  .agreement-reader__confirm {
    width: 100%;
  }
}
</style>
