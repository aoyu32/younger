<template>
  <div class="profile-info">
    <!-- 四角圆角装饰 -->
    <CornerFrame />

    <div class="profile-info__main">
      <!-- 头像：悬浮出现暗色遮罩 + 换图图标，点击选择图片上传 -->
      <div
        class="avatar"
        :class="{ 'is-editing': editing }"
        @click="handleAvatarClick"
      >
        <img :src="avatarUrl" alt="用户头像" @error="handleImgError" />
        <span class="avatar__mask">
          <img class="avatar__mask-icon" :src="iconImg" alt="更换头像" />
        </span>
        <input
          ref="fileRef"
          class="avatar__file"
          type="file"
          accept="image/*"
          @change="handleFileChange"
        />
      </div>

      <!-- 头像与字段区之间：一支带枝干的玫瑰 -->
      <RoseDivider />

      <!-- 资料字段：两列 -->
      <div class="fields">
        <div class="field">
          <span class="field__label">昵　称</span>
          <div class="field__control">
            <BottomLineInput
              v-if="editing"
              v-model="profile.nickname"
              placeholder="请输入昵称"
              :maxlength="20"
            />
            <span v-else class="field__text">{{
              profile.nickname || EMPTY_TEXT
            }}</span>
          </div>
        </div>

        <div class="field">
          <span class="field__label">城市</span>
          <div class="field__control">
            <!-- 编辑态：省、市两个级联下拉，未选省时市不可选 -->
            <template v-if="editing">
              <BottomLineSelect
                v-model="profile.province"
                class="city-select"
                :options="PROVINCE_OPTIONS"
                placeholder="请选择省"
              />
              <BottomLineSelect
                v-model="profile.city"
                class="city-select"
                :options="cityOptions"
                placeholder="请选择市"
                :disabled="!profile.province"
              />
            </template>
            <span v-else class="field__text">{{
              cityText || EMPTY_TEXT
            }}</span>
          </div>
        </div>

        <div class="field">
          <span class="field__label">用户名</span>
          <div class="field__control">
            <BottomLineInput
              v-if="editing"
              v-model="profile.username"
              placeholder="请输入用户名"
              :maxlength="20"
            />
            <span v-else class="field__text">{{
              profile.username || EMPTY_TEXT
            }}</span>
          </div>
        </div>

        <div class="field">
          <span class="field__label">生日</span>
          <div class="field__control">
            <BottomLineDatePicker
              v-if="editing"
              v-model="profile.birthday"
              placeholder="请选择日期"
              :disabled-date="isFutureDate"
            />
            <span v-else class="field__text">{{
              birthdayText || EMPTY_TEXT
            }}</span>
          </div>
        </div>

        <!-- 性别：编辑态为「点一下切换」的切换框，查看态为文本 -->
        <div class="field">
          <span class="field__label">性　别</span>
          <div class="field__control">
            <BottomLineSwitch
              v-if="editing"
              v-model="profile.gender"
              :options="GENDER_OPTIONS"
            />
            <span v-else class="field__text">{{ genderText }}</span>
          </div>
        </div>

        <div class="field">
          <span class="field__label">职业</span>
          <div class="field__control">
            <BottomLineInput
              v-if="editing"
              v-model="profile.job"
              placeholder="请输入职业"
              :maxlength="20"
            />
            <span v-else class="field__text">{{
              profile.job || EMPTY_TEXT
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 个人介绍：查看态为文本，编辑态为单下划线的多行输入框 -->
    <div class="intro">
      <span class="intro__label">个人介绍</span>
      <BottomLineTextarea
        v-if="editing"
        v-model="profile.intro"
        placeholder="介绍一下自己吧"
        :maxlength="100"
      />
      <p v-else class="intro__text">{{ profile.intro || EMPTY_TEXT }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 我的资料页
 * 展示并可编辑用户资料：头像、昵称、用户名、性别、城市、生日、职业、个人介绍。
 * 查看态只渲染文本，输入框边框仅在编辑态出现（由 editing 控制）。
 * @author LiangQiYang
 * @date 2026-10-15
 */
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import BottomLineDatePicker from './BottomLineDatePicker.vue';
import BottomLineInput from './BottomLineInput.vue';
import BottomLineSelect, {
  type BottomLineSelectOption,
} from './BottomLineSelect.vue';
import BottomLineSwitch, {
  type BottomLineSwitchOption,
} from './BottomLineSwitch.vue';
import BottomLineTextarea from './BottomLineTextarea.vue';
import CornerFrame from './CornerFrame.vue';
import RoseDivider from './RoseDivider.vue';
import emptyCover from '@/assets/images/icon_empty_img.svg?url';
import iconImg from '@/assets/profile/icon_img.svg?url';
import { formatDateCN } from '@/utils/format';

defineOptions({ name: 'ProfileInfo' });

/** 性别取值 */
type Gender = '男' | '女' | '';

interface ProfileForm {
  /** 头像地址，空串表示未上传 */
  avatar: string;
  /** 昵称 */
  nickname: string;
  /** 用户名 */
  username: string;
  /** 性别 */
  gender: Gender;
  /** 省份 */
  province: string;
  /** 城市（市级） */
  city: string;
  /** 生日（yyyy-MM-dd） */
  birthday: string;
  /** 职业 */
  job: string;
  /** 个人介绍 */
  intro: string;
}

/** 空值占位文案 */
const EMPTY_TEXT = '未填写';

/** 性别可选项：两个值之间互切 */
const GENDER_OPTIONS: BottomLineSwitchOption<Gender>[] = [
  { label: '男', value: '男' },
  { label: '女', value: '女' },
];

/** 省 → 市 mock 数据（后续替换为省市区接口数据） */
const PROVINCE_CITY_MAP: Record<string, string[]> = {
  安徽: ['合肥', '芜湖', '蚌埠', '安庆'],
  江苏: ['南京', '苏州', '无锡', '常州'],
  浙江: ['杭州', '宁波', '温州', '嘉兴'],
  广东: ['广州', '深圳', '珠海', '佛山'],
  四川: ['成都', '绵阳', '德阳'],
  湖北: ['武汉', '宜昌'],
  陕西: ['西安', '咸阳'],
  福建: ['福州', '厦门', '泉州'],
  北京: ['北京'],
  上海: ['上海'],
};

/** 省份下拉选项 */
const PROVINCE_OPTIONS: BottomLineSelectOption<string>[] = Object.keys(
  PROVINCE_CITY_MAP,
).map((province) => ({ label: province, value: province }));

/** 资料数据（mock） */
const profile = reactive<ProfileForm>({
  avatar: '',
  nickname: '夜航西飞',
  username: 'younger_001',
  gender: '男',
  province: '安徽',
  city: '合肥',
  birthday: '1998-03-12',
  job: '前端工程师',
  intro: '喜欢折腾像素和字体，也喜欢在深夜写代码。',
});

/** 是否处于编辑态：为 true 时字段渲染为输入框 */
const editing = ref(false);

/** 进入编辑态时的数据快照，取消编辑时用于回滚 */
let snapshot: ProfileForm | null = null;

/** 头像地址：未上传时使用占位图 */
const avatarUrl = computed(() => profile.avatar || emptyCover);

/** 性别展示文案 */
const genderText = computed(() => profile.gender || EMPTY_TEXT);

/** 城市下拉选项：跟随省份联动 */
const cityOptions = computed<BottomLineSelectOption<string>[]>(() =>
  (PROVINCE_CITY_MAP[profile.province] ?? []).map((city) => ({
    label: city,
    value: city,
  })),
);

/** 城市展示文案：省 · 市（缺一项时只展示已有的一项） */
const cityText = computed(() =>
  [profile.province, profile.city].filter(Boolean).join(' · '),
);

/** 生日展示文案：查看态显示「xx年x月x日」，编辑态仍是 yyyy-MM-dd */
const birthdayText = computed(() => formatDateCN(profile.birthday));

/** 切换省份后，原城市不属于新省份时清空，避免出现「江苏 · 合肥」 */
watch(
  () => profile.province,
  (province) => {
    const cities = PROVINCE_CITY_MAP[province] ?? [];
    if (profile.city && !cities.includes(profile.city)) profile.city = '';
  },
);

/** 头像文件选择框 */
const fileRef = ref<HTMLInputElement | null>(null);

/** 本地预览产生的 object URL，及时释放避免内存泄漏 */
let objectUrl = '';

/** 进入编辑态 */
function startEdit() {
  snapshot = { ...profile };
  editing.value = true;
}

/** 取消编辑：回滚到进入编辑态时的数据 */
function cancelEdit() {
  if (snapshot) Object.assign(profile, snapshot);
  snapshot = null;
  editing.value = false;
}

/** 保存资料 */
function save() {
  // TODO: 调用保存资料接口，成功后再提交并退出编辑态
  snapshot = null;
  editing.value = false;
}

/** 点击头像：唤起文件选择（查看态/编辑态都可换） */
function handleAvatarClick() {
  fileRef.value?.click();
}

/** 选择头像文件：本地预览（后续替换为上传接口） */
function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);
    profile.avatar = objectUrl;
  }
  // 清空 value，保证再次选择同一文件也能触发 change
  input.value = '';
}

/** 生日不能选未来日期（date 为当天 0 点，今天因此不会被禁用） */
function isFutureDate(date: Date): boolean {
  return date.getTime() > Date.now();
}

/** 头像加载失败兜底 */
function handleImgError(e: Event) {
  const img = e.target as HTMLImageElement;
  if (!img || img.src === emptyCover) return;
  img.src = emptyCover;
}

onBeforeUnmount(() => {
  if (objectUrl) URL.revokeObjectURL(objectUrl);
});

defineExpose({ editing, startEdit, cancelEdit, save });
</script>

<style scoped lang="scss">
.profile-info {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--ao-spacing-xl);
  padding: 40px;
  box-sizing: border-box;
}

/* ========== 头像 + 字段区 ========== */
.profile-info__main {
  display: flex;
  /* 头像、玫瑰分割、字段区三者垂直居中；玫瑰是定高装饰，不参与撑高字段区 */
  align-items: center;
  /* 等于玫瑰左右各留 40px */
  gap: 40px;
}

.avatar {
  position: relative;
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  overflow: hidden;
  box-sizing: border-box;
  /* 边框常驻占位（透明），避免编辑态出现边框时布局跳动 */
  border: var(--ao-border-width-thin) solid transparent;
  border-radius: 50%;
  background-color: var(--ao-color-bg-layout);
  cursor: pointer;

  /* 只作用于头像本身，避免把遮罩里的换图图标也拉满 */
  > img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* 仅编辑态显示边框，提示可更换头像 */
  &.is-editing {
    border-color: var(--ao-color-border);
  }

  /* 悬浮：暗色半透明遮罩淡入 */
  &:hover .avatar__mask {
    opacity: 1;
  }

  .avatar__mask {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.45);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--ao-duration-fast) var(--ao-ease-in-out);
  }

  .avatar__mask-icon {
    width: 28px;
    height: 28px;
  }

  .avatar__file {
    display: none;
  }
}

/* 字段区：两列，列宽按内容自适应
   （控件固定宽度，不再拉满整列，避免两列之间出现大片空白）
   按行依次填充：昵称/城市、用户名/生日、性别/职业 */
.fields {
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(2, max-content);
  gap: var(--ao-spacing-lg);
}

.field {
  display: flex;
  align-items: center;
  gap: var(--ao-spacing-md);
  min-width: 0;

  /* 标签统一右对齐；两字标签在模版中用全角空格补足三字宽，
     与同列的「用户名」左右两端都对齐 */
  &__label {
    flex-shrink: 0;
    width: 56px;
    text-align: right;
    font-size: var(--ao-font-size-sm);
    color: var(--ao-color-text-secondary);
    white-space: nowrap;
  }

  &__control {
    /* 固定宽度：输入框/文本统一 240px，避免拉伸后与右列之间空一大片 */
    width: 240px;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: var(--ao-spacing-md);
  }

  /* 查看态：纯文本，无边框；值改用品牌字体强调，颜色非纯黑 */
  &__text {
    min-width: 0;
    font-family: var(--ao-font-family-ali);
    /* 品牌字体本身即粗体字形，用默认字重避免浏览器二次加粗 */
    font-weight: var(--ao-font-weight-normal);
    font-size: var(--ao-font-size-sm);
    color: var(--ao-gray-8);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* 编辑态输入框改用 BottomLineInput（只有下划线），样式见该组件 */
}

/* 城市控件：编辑态拆出的省/市两个下拉，均分控件 240px 宽度 */
.city-select {
  flex: 1;
  min-width: 0;
}

/* 性别编辑态改用 BottomLineSwitch（只有下划线），样式见该组件 */

/* ========== 个人介绍 ========== */
.intro {
  display: flex;
  flex-direction: column;
  gap: var(--ao-spacing-sm);

  &__label {
    font-size: var(--ao-font-size-sm);
    color: var(--ao-color-text-secondary);
  }

  /* 查看态：浅灰底色块，高度与编辑态输入框保持一致 */
  &__text {
    margin: 0;
    min-height: 200px;
    padding: var(--ao-spacing-sm);
    box-sizing: border-box;
    border-radius: var(--ao-border-radius-base);
    /* 浅灰底：介于 --ao-gray-3(#f0f0f0) 与 --ao-gray-4(#d9d9d9) 之间 */
    background-color: #ececec;
    font-family: var(--ao-font-family-ali);
    font-weight: var(--ao-font-weight-normal);
    font-size: var(--ao-font-size-sm);
    line-height: var(--ao-line-height-base);
    color: var(--ao-gray-8);
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* 编辑态改用 BottomLineTextarea（只有下划线），样式见该组件 */
}

/* ≤1200（平板）：页面容器转为流式后内容区放不下「头像 + 玫瑰 + 两列定宽字段」，
   改为头像居中置顶、竖版玫瑰隐藏、字段两列等宽自适应 */
@media (max-width: 1200px) {
  .profile-info {
    padding: 32px 28px;
    gap: var(--ao-spacing-lg);
  }

  .profile-info__main {
    flex-direction: column;
    gap: var(--ao-spacing-lg);
  }

  .avatar {
    width: 88px;
    height: 88px;
  }

  .rose-divider {
    display: none;
  }

  /* 两列等宽、可收缩；控件不再固定 240px，跟随列宽伸缩 */
  .fields {
    width: 100%;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ao-spacing-md) var(--ao-spacing-lg);
  }

  .field__control {
    flex: 1;
    width: auto;
  }
}

/* ≤768（移动端）：侧边导航收起为顶部条；四角装饰挂在内容区上，
   而面板卡片顶部还有面包屑头部，四角无法与卡片对齐，直接隐藏 */
@media (max-width: 768px) {
  .profile-info {
    padding: 24px 20px;
  }

  .avatar {
    width: 80px;
    height: 80px;
  }

  :deep(.corner-frame) {
    display: none;
  }
}

/* ≤600（小屏手机）：两列已放不下省市级联下拉，字段改单列 */
@media (max-width: 600px) {
  .profile-info {
    padding: 20px 16px;
    gap: var(--ao-spacing-md);
  }

  .profile-info__main {
    gap: var(--ao-spacing-md);
  }

  .avatar {
    width: 72px;
    height: 72px;
  }

  .fields {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--ao-spacing-md);
  }

  /* 单列混排两字/三字标签，右对齐会左缘参差；
     改为两端对齐并撑满 3em，所有标签左右字缘都与「用户名」对齐 */
  .field__label {
    width: 3em;
    text-align: justify;
    text-align-last: justify;
  }

  /* 查看态介绍块收紧高度；编辑态输入框仍用组件默认高度，保证输入空间 */
  .intro__text {
    min-height: 120px;
  }
}
</style>
