<template>
  <AoCaptcha
    :captcha-type="captchaType"
    :mode="mode"
    :generate-captcha="generateCaptchaFn"
    :check-captcha="checkCaptchaFn"
    :encrypt-point="encryptPointFn"
    @on-success="emit('on-success', $event)"
    @on-close="emit('on-close')"
  />
</template>

<script setup lang="ts">
import AoCaptcha from '@/components/ao-captcha/index.vue';
import {
  generateCaptcha,
  checkCaptcha,
  type CaptchaType,
} from '@/api/captcha';
import { aesEncrypt } from '@/utils/crypto';

withDefaults(
  defineProps<{
    captchaType?: string;
    mode?: string;
  }>(),
  {
    captchaType: 'blockPuzzle',
    mode: 'fixed',
  },
);

const emit = defineEmits<{
  'on-success': [payload: { captchaVerification?: string }];
  'on-close': [];
}>();

const generateCaptchaFn = (params: { captchaType: string }) =>
  generateCaptcha({ captchaType: params.captchaType as CaptchaType });

const checkCaptchaFn = (params: {
  captchaType: string;
  token: string;
  pointJson: string;
}) =>
  checkCaptcha({
    captchaType: params.captchaType as CaptchaType,
    token: params.token,
    pointJson: params.pointJson,
  });

const encryptPointFn = (plainText: string, secretKey: string) =>
  aesEncrypt(plainText, secretKey);
</script>
