<template>
  <div class="vip">
    <div class="logo">
      <AoImage src="@/assets/younger_logo.png" width="24px" />
      <span class="logo-name">洋果教育</span>
    </div>
    <VipBackground />
    <div class="vip-content">
      <header class="vip-header">
        <h1 class="vip-title">YOUNGER 会员</h1>
        <p class="vip-subtitle">解锁专属特权，畅享尊贵体验</p>
      </header>

      <div class="vip-cards">
        <VipCard
          type="month"
          tier="尊贵月卡"
          price-symbol="¥"
          price-value="29"
          price-unit=".9 /月"
          :benefits="monthBenefits"
          button-bg="#00b5b5"
          mark="VIP"
          @pay="handlePay('month')"
        />
        <VipCard
          type="year"
          tier="至尊年卡"
          price-symbol="¥"
          price-value="199"
          price-unit=" /年"
          mark="SVIP"
          :benefits="yearBenefits"
          button-bg="#e9b64b"
          @pay="handlePay('year')"
        />
      </div>
    </div>
    <div class="back-home" @click="$router.push('/')">
      <AoImage
        src="@/assets/vip/icon_back_home.svg"
        width="14px"
        height="14px"
      ></AoImage>
      <span>返回首页</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import VipBackground from './components/VipBackground.vue';
import VipCard from './components/VipCard.vue';

const monthBenefits = [
  '30天全站视频免费看',
  '尊贵VIP身份标识',

  '高清无损视频画质',
  'VIP专属交流群',
];

const yearBenefits = [
  '尊享365天会员权益',
  '月卡全部特权',
  '独享至尊SVIP身份标识',
  '超高清画质视频',
  '付费视频无限制观看',
  '资深站长私享答疑',
];

function handlePay(type: string) {
  // TODO: 接入支付
}
</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>
