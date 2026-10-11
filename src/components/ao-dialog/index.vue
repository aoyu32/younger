<template>
  <Teleport to="body">
    <Transition name="ao-dialog-fade">
      <div
        v-if="modelValue"
        class="ao-dialog-overlay"
        @click.self="handleMaskClick"
      >
        <div class="ao-dialog" :style="{ width }">
          <div class="ao-dialog__header">
            <div class="ao-dialog__heading">
              <span class="ao-dialog__mark" aria-hidden="true" />
              <slot name="icon" />
              <span class="ao-dialog__title" :title="title">{{ title }}</span>
            </div>
            <button
              type="button"
              class="ao-dialog__close"
              aria-label="关闭"
              @click="handleClose"
            >
              <CloseIcon class="ao-dialog__close-icon" />
            </button>
          </div>

          <div class="ao-dialog__body">
            <slot />
          </div>

          <div class="ao-dialog__footer">
            <slot name="footer">
              <button
                type="button"
                class="ao-dialog__btn ao-dialog__btn--cancel"
                @click="handleClose"
              >
                {{ cancelText }}
              </button>
              <button
                type="button"
                class="ao-dialog__btn ao-dialog__btn--confirm"
                @click="handleConfirm"
              >
                {{ confirmText }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import CloseIcon from './img/icon_close.svg';

interface Props {
  modelValue: boolean;
  title?: string;
  width?: string;
  cancelText?: string;
  confirmText?: string;
  closeOnMask?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '提示',
  width: '420px',
  cancelText: '取消',
  confirmText: '确定',
  closeOnMask: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [];
  close: [];
}>();

const handleClose = () => {
  emit('update:modelValue', false);
  emit('close');
};

const handleConfirm = () => {
  emit('confirm');
};

const handleMaskClick = () => {
  if (props.closeOnMask) {
    handleClose();
  }
};
</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>
