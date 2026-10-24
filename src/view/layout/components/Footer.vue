<template>
  <div class="footer">
    <div class="footer_inner">
      <div class="footer_top">
        <div class="footer_col">
          <div class="col_title">友情链接</div>
          <div class="col_list">
            <a class="link_item" href="https://www.bilibili.com/" target="_blank">哔哩哔哩</a>
            <a class="link_item" href="https://github.com/" target="_blank">GitHub</a>
            <a class="link_item" href="https://www.zhihu.com/" target="_blank">知乎</a>
            <a class="link_item" href="https://www.baidu.com/" target="_blank">百度</a>
          </div>
        </div>

        <div class="footer_col">
          <div class="col_title">网站声明</div>
          <div class="col_text">
            本站内容仅用于学习与交流，资源与链接来源于互联网整理；如有侵权请联系站长处理。
          </div>
          <div class="col_text">
            使用本站即表示你同意遵守相关法律法规并对自身行为负责。
          </div>
        </div>

        <div class="footer_col">
          <div class="col_title">联系站长</div>
          <div class="col_list">
            <div class="contact_item">
              <span class="label">邮箱：</span>
              <a class="value" href="mailto:admin@younger.site">liangqiyang@qq.com</a>
            </div>
            <div class="contact_item">
              <span class="label">反馈：</span>
              <span class="value">欢迎提出建议与需求</span>
            </div>
            <div class="contact_item">
              <span class="label">合作：</span>
              <span class="value">友链合作请联系站长</span>
            </div>
          </div>
        </div>

        <div class="footer_col footer_qr">
          <div class="qr_grid">
            <div class="qr_item">
              <div class="qr_title">赞赏支持</div>
              <div class="qr_box">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=thanks" alt="赞赏二维码" />
              </div>
              <div class="qr_tip">感谢你的支持</div>
            </div>
            <div class="qr_item">
              <div class="qr_title">站长微信</div>
              <div class="qr_box">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=wechat" alt="站长微信二维码" />
              </div>
              <div class="qr_tip">添加请备注来意</div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer_divider"></div>

      <div class="footer_bottom">
        <div class="bottom_left">
          <span>© {{ year }} Younger 洋果教育 · All Rights Reserved</span>
        </div>
        <div class="bottom_right">
          <a class="bottom_link" href="javascript:;">隐私政策</a>
          <span class="dot">·</span>
          <span class="bottom_text">Powered by LiangQiYang</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// 组件名称
defineOptions({
  name: 'LayoutFooter'
})

// 计算当前年份
const year = computed(() => new Date().getFullYear())
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  height: auto;
  margin-top: 20px;
  background-color: var(--ao-color-bg-layout);
  border-top: var(--ao-border-width-thin) solid var(--ao-color-border);
}

.footer_inner {
  width: var(--ao-container-max-width);
  height: auto;
  margin: 0 auto;
  padding: 20px 0;
}

.footer_top {
  display: grid;
  grid-template-columns: 1.1fr 1.4fr 1.1fr 1.4fr;
  gap: var(--ao-spacing-lg);
}

.footer_col {
  display: flex;
  flex-direction: column;
  align-items: normal;
  justify-content: start;
  gap: var(--ao-spacing-sm);

  .col_title {
    font-size: var(--ao-font-size-sm);
    font-weight: var(--ao-font-weight-bold);
    color: var(--ao-color-text-base);
    opacity: 0.85;
  }

  .col_text {
    font-size: var(--ao-font-size-xs);
    line-height: var(--ao-line-height-relaxed);
    color: var(--ao-color-text-base);
    opacity: 0.55;
  }

  .col_list {
    display: flex;
    flex-direction: column;
    align-items: normal;
    justify-content: center;
    gap: var(--ao-spacing-sm);
  }

  .link_item {
    font-size: var(--ao-font-size-xs);
    text-decoration: none;
    color: var(--ao-color-text-base);
    opacity: 0.6;
    transition: color var(--ao-duration-fast) var(--ao-ease-in-out);

    &:hover {
      color: var(--ao-color-primary);
    }
  }
}

.contact_item {
  font-size: var(--ao-font-size-xs);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;

  .label {
    color: var(--ao-color-text-base);
    opacity: 0.55;
  }

  .value {
    text-decoration: none;
    color: var(--ao-color-text-base);
    opacity: 0.7;

    &:hover {
      color: var(--ao-color-primary);
    }
  }
}

.footer_qr {
  .qr_grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--ao-spacing-md);
  }

  .qr_item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: var(--ao-spacing-xs);

    .qr_title {
      font-size: var(--ao-font-size-xs);
      font-weight: var(--ao-font-weight-semibold);
      color: var(--ao-color-text-base);
      opacity: 0.75;
    }

    .qr_box {
      width: 90px;
      height: 90px;
      border-radius: var(--ao-border-radius-xl);
      background-color: var(--ao-color-bg-container);

      img {
        width: 90px;
        height: 90px;
        object-fit: cover;
        border-radius: var(--ao-border-radius-lg);
      }
    }

    .qr_tip {
      font-size: var(--ao-font-size-xs);
      color: var(--ao-color-text-base);
      opacity: 0.5;
    }
  }
}

.footer_divider {
  margin: calc(var(--ao-spacing-lg) - 2px) 0;
  width: 100%;
  height: var(--ao-border-width-thin);
  background-color: var(--ao-color-divider);
}

.footer_bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ao-spacing-sm);
  font-size: var(--ao-font-size-xs);
  color: var(--ao-color-text-base);
  opacity: 0.55;

  .bottom_right {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ao-spacing-xs);
  }

  .bottom_link {
    text-decoration: none;
    color: var(--ao-color-text-base);
    opacity: 0.55;

    &:hover {
      color: var(--ao-color-primary);
    }
  }

  .dot {
    color: var(--ao-color-text-base);
    opacity: 0.35;
  }

  .bottom_text {
    color: var(--ao-color-text-base);
    opacity: 0.45;
  }
}

@media screen and (max-width: 1200px) {
  .footer_inner {
    width: 100%;
    padding: calc(var(--ao-spacing-lg) + 2px) var(--ao-spacing-md);
  }

  .footer_top {
    grid-template-columns: 1fr;
  }

  /* 栏允许收缩；二维码网格在极窄屏下随容器缩放，避免撑出横向滚动 */
  .footer_col {
    min-width: 0;
  }

  .footer_qr {
    .qr_grid {
      grid-template-columns: repeat(2, minmax(0, 160px));
      justify-content: flex-start;
    }
  }
}
</style>