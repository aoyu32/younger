<template>
  <div class="pay">
    <div class="pay-header">
      <div class="back-home flex" @click="$router.back()">
        <AoImage
          src="@/assets/pay/icon_back.svg"
          width="16px"
          height="16px"
        ></AoImage>
        返回
      </div>
    </div>
    <div class="pay-order">
      <div class="order-title flex-between">
        <div class="order-submit">
          <div class="text">订单提交成功，请尽快完成支付！</div>
          <div class="sub-text">
            请在 <span>15分钟</span> 内完成支付，超时后将取消订单
          </div>
        </div>
        <div class="order-amount flex">
          <div class="amount-label">待支付总金额：</div>
          <div class="amount flex">
            <span class="pay-price">199.00</span>
            <span class="pay-unit">元</span>
          </div>
        </div>
      </div>
      <div class="order-info">
        <div class="info-item">
          <div class="item-label">商品名称：</div>
          <div class="item-value">年度会员</div>
        </div>
        <div class="info-item">
          <div class="item-label">下单时间：</div>
          <div class="item-value">{{ new Date().toLocaleString() }}</div>
        </div>
        <div class="info-item">
          <div class="item-label">订单号：</div>
          <div class="item-value">{{ 'ORDER' + Date.now() }}</div>
        </div>
        <div class="info-item">
          <div class="item-label">支付方式：</div>
          <div class="item-value">
            <div class="pay-type">
              <AoImage
                src="@/assets/pay/icon_wechat_pay.svg"
                width="30px"
                height="30px"
              ></AoImage>
              <span>微信支付</span>
            </div>
            <div class="pay-type">
              <AoImage
                src="@/assets/pay/icon_ali_pay.svg"
                width="30px"
                height="30px"
              ></AoImage>
              <span>支付宝</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pay-qr-code">
      <div class="brand-logo">
        <AoImage
          src="@/assets/younger_logo.png"
          width="90px"
        ></AoImage>
      </div>
      <div class="qr-code">
        <p>请扫一扫付款</p>
        <div class="price">￥199.00</div>
        <div class="qr-code-img">
          <div class="qr-code-inner">
            <AoImage
              src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=wechat"
              width="220px"
              height="220px"
            ></AoImage>
          </div>
        </div>
        <div class="pay-title">
          <AoImage
            src="@/assets/pay/icon_scan.svg"
            width="20px"
            height="20px"
          ></AoImage>
          微信扫一扫支付
        </div>
        <div class="pay-agreement flex-col">
          <span>本商品为虚拟内容，购买后不支持退换、转让</span>
          <span>确认支付表示您已阅读并接受 产品支付协议</span>
          <span
            >如付款成功后未收到商品，请 <span class="contact"
              >联系我们</span
            ></span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 你的代码
</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>
