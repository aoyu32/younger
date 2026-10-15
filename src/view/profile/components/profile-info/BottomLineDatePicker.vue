<template>
  <div
    ref="rootRef"
    class="bottom-line-date-picker"
    :class="{ 'is-open': isOpen, 'is-disabled': disabled }"
    @keydown="handleKeydown"
  >
    <!-- 触发器：左侧展示已选日期/占位文本，右侧日期图标 -->
    <button
      ref="triggerRef"
      type="button"
      class="bottom-line-date-picker__trigger"
      :disabled="disabled"
      @click="toggle"
    >
      <span
        class="bottom-line-date-picker__text"
        :class="{ 'is-placeholder': !modelValue }"
      >
        {{ modelValue || placeholder }}
      </span>
      <img
        class="bottom-line-date-picker__icon"
        :src="dateIcon"
        alt=""
        aria-hidden="true"
      />
    </button>

    <!-- 下划线：出现时由左向右生长，展开时换成品牌色 -->
    <span class="bottom-line-date-picker__line" aria-hidden="true"></span>

    <!-- 面板：日期 / 月份 / 年份 三级视图，点标题可在三者间跳转 -->
    <Transition name="bottom-line-date-picker-drop">
      <div v-if="isOpen" class="bottom-line-date-picker__panel">
        <div class="bottom-line-date-picker__header">
          <!-- 左侧：跨年（仅日期视图）+ 上一个单位（月/年/页） -->
          <div class="bottom-line-date-picker__nav-group">
            <button
              v-if="view === 'date'"
              type="button"
              class="bottom-line-date-picker__nav bottom-line-date-picker__nav--double"
              :title="YEAR_STEP_TIP.prev"
              :aria-label="YEAR_STEP_TIP.prev"
              @click="stepYear(-1)"
            >
              <svg viewBox="0 0 14 14" aria-hidden="true">
                <path
                  d="M12.6 1.4 L7.6 7 L12.6 12.6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.4 1.4 L1.4 7 L6.4 12.6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              class="bottom-line-date-picker__nav"
              :title="stepTip('prev')"
              :aria-label="stepTip('prev')"
              @click="step(-1)"
            >
              <svg viewBox="0 0 8 14" aria-hidden="true">
                <path
                  d="M6.6 1.4 L1.4 7 L6.6 12.6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>

          <div class="bottom-line-date-picker__title">
            <template v-if="view === 'year'">
              <span class="bottom-line-date-picker__range">
                {{ yearPageStart }}年 - {{ yearPageStart + 11 }}年
              </span>
            </template>
            <template v-else>
              <button
                type="button"
                class="bottom-line-date-picker__title-btn"
                @click="openYearView"
              >
                {{ viewYear }}年
              </button>
              <button
                v-if="view === 'date'"
                type="button"
                class="bottom-line-date-picker__title-btn"
                @click="openMonthView"
              >
                {{ viewMonth + 1 }}月
              </button>
            </template>
          </div>

          <!-- 右侧：下一个单位 + 跨年（仅日期视图） -->
          <div class="bottom-line-date-picker__nav-group">
            <button
              type="button"
              class="bottom-line-date-picker__nav"
              :title="stepTip('next')"
              :aria-label="stepTip('next')"
              @click="step(1)"
            >
              <svg viewBox="0 0 8 14" aria-hidden="true">
                <path
                  d="M1.4 1.4 L6.6 7 L1.4 12.6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button
              v-if="view === 'date'"
              type="button"
              class="bottom-line-date-picker__nav bottom-line-date-picker__nav--double"
              :title="YEAR_STEP_TIP.next"
              :aria-label="YEAR_STEP_TIP.next"
              @click="stepYear(1)"
            >
              <svg viewBox="0 0 14 14" aria-hidden="true">
                <path
                  d="M1.4 1.4 L6.4 7 L1.4 12.6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.6 1.4 L12.6 7 L7.6 12.6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- 日期视图 -->
        <div
          v-if="view === 'date'"
          class="bottom-line-date-picker__grid bottom-line-date-picker__grid--date"
        >
          <span
            v-for="week in WEEK_LABELS"
            :key="week"
            class="bottom-line-date-picker__week"
          >
            {{ week }}
          </span>
          <button
            v-for="cell in dayCells"
            :key="cell.value"
            type="button"
            class="bottom-line-date-picker__cell"
            :class="{
              'is-outside': !cell.inMonth,
              'is-today': cell.isToday,
              'is-selected': cell.value === modelValue,
            }"
            :disabled="isDateDisabled(cell.date)"
            @click="pickDay(cell)"
          >
            {{ cell.day }}
          </button>
        </div>

        <!-- 月份视图 -->
        <div
          v-else-if="view === 'month'"
          class="bottom-line-date-picker__grid bottom-line-date-picker__grid--month"
        >
          <button
            v-for="month in 12"
            :key="month"
            type="button"
            class="bottom-line-date-picker__cell"
            :class="{
              'is-today': isCurrentMonth(month - 1),
              'is-selected': isSelectedMonth(month - 1),
            }"
            @click="pickMonth(month - 1)"
          >
            {{ month }}月
          </button>
        </div>

        <!-- 年份视图：每页 12 年 -->
        <div
          v-else
          class="bottom-line-date-picker__grid bottom-line-date-picker__grid--year"
        >
          <button
            v-for="year in yearCells"
            :key="year"
            type="button"
            class="bottom-line-date-picker__cell"
            :class="{
              'is-today': year === today.getFullYear(),
              'is-selected': year === selectedDate?.getFullYear(),
            }"
            @click="pickYear(year)"
          >
            {{ year }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
/**
 * 下划线日期选择框
 * 自绘日期面板（不依赖浏览器原生 date 控件）：只有一条下划线，出现时由 0 生长到整宽；
 * 点击日期图标或文本框展开面板，展开时下划线换成品牌色。
 * 面板分「日 / 月 / 年」三级视图：日期视图是「双箭头跨年 + 单箭头跨月」，
 * 点标题还能直接跳到月份/年份视图，避免选生日时要一次次点上一月。
 * @author LiangQiYang
 * @date 2026-10-15
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import dateIcon from '@/assets/profile/icon_date.svg?url';

defineOptions({ name: 'BottomLineDatePicker' });

/** 星期表头，与 Date#getDay 的 0=周日 对齐 */
const WEEK_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

/** 日期单元格 */
interface DayCell {
  /** 该格日期 */
  date: Date;
  /** 展示的日 */
  day: number;
  /** yyyy-MM-dd，用于与 modelValue 比较、作为 key */
  value: string;
  /** 是否属于当前展示月份（非本月置灰） */
  inMonth: boolean;
  /** 是否今天 */
  isToday: boolean;
}

/**
 * @property {string} modelValue - 日期值，格式 yyyy-MM-dd
 * @property {string} placeholder - 未选择时的占位文本
 * @property {boolean} disabled - 是否禁用
 * @property {(date: Date) => boolean} disabledDate - 额外禁用规则，如「不能选未来」
 */
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    disabledDate?: (date: Date) => boolean;
  }>(),
  {
    modelValue: '',
    placeholder: '请选择日期',
    disabled: false,
    disabledDate: undefined,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
}>();

/** 视图层级：日 / 月 / 年 */
type PickerView = 'date' | 'month' | 'year';

const rootRef = ref<HTMLElement>();
const triggerRef = ref<HTMLButtonElement>();
const isOpen = ref(false);
const view = ref<PickerView>('date');
/** 面板当前展示的年月 */
const viewYear = ref(new Date().getFullYear());
const viewMonth = ref(new Date().getMonth());
/** 年份视图每页 12 年的起始年 */
const yearPageStart = ref(0);

/** 今天，用于今天高亮与默认定位 */
const today = new Date();

/** 把 Date 格式化为 yyyy-MM-dd */
function toValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** 解析 yyyy-MM-dd，格式不合法时返回 null */
function parseValue(value: string): Date | null {
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!matched) return null;
  const date = new Date(
    Number(matched[1]),
    Number(matched[2]) - 1,
    Number(matched[3]),
  );
  return Number.isNaN(date.getTime()) ? null : date;
}

/** 当前选中的日期对象 */
const selectedDate = computed(() => parseValue(props.modelValue));

/** 日期视图的 42 个格子：固定 6 行，切换月份时面板高度不跳 */
const dayCells = computed<DayCell[]>(() => {
  const offset = new Date(viewYear.value, viewMonth.value, 1).getDay();
  const cells: DayCell[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(viewYear.value, viewMonth.value, 1 - offset + i);
    cells.push({
      date,
      day: date.getDate(),
      value: toValue(date),
      inMonth: date.getMonth() === viewMonth.value,
      isToday: toValue(date) === toValue(today),
    });
  }
  return cells;
});

/** 年份视图的 12 个年份 */
const yearCells = computed(() =>
  Array.from({ length: 12 }, (_, index) => yearPageStart.value + index),
);

/** 是否命中外部传入的禁用规则 */
function isDateDisabled(date: Date): boolean {
  return props.disabledDate ? props.disabledDate(date) : false;
}

/** 月份视图：是否当前月且为今年 */
function isCurrentMonth(month: number): boolean {
  return viewYear.value === today.getFullYear() && month === today.getMonth();
}

/** 月份视图：是否为已选值所在月份 */
function isSelectedMonth(month: number): boolean {
  const selected = selectedDate.value;
  return (
    !!selected &&
    selected.getFullYear() === viewYear.value &&
    selected.getMonth() === month
  );
}

function toggle() {
  if (isOpen.value) close();
  else open();
}

/** 展开面板：定位到已选日期所在月份，没有值则定位到今天 */
function open() {
  if (props.disabled) return;
  const date = selectedDate.value ?? today;
  viewYear.value = date.getFullYear();
  viewMonth.value = date.getMonth();
  view.value = 'date';
  yearPageStart.value = Math.floor(viewYear.value / 12) * 12;
  isOpen.value = true;
}

/** 收起面板并把焦点交还触发器，便于继续键盘操作 */
function close() {
  isOpen.value = false;
  view.value = 'date';
  triggerRef.value?.focus();
}

/** 跨年按钮的提示文案（两者都是常量，避免模板里写死） */
const YEAR_STEP_TIP = { prev: '上一年', next: '下一年' } as const;

/** 前后翻页：日期视图翻月、月份视图翻年、年份视图翻 12 年 */
function step(delta: number) {
  if (view.value === 'date') {
    const date = new Date(viewYear.value, viewMonth.value + delta, 1);
    viewYear.value = date.getFullYear();
    viewMonth.value = date.getMonth();
    return;
  }
  if (view.value === 'month') {
    viewYear.value += delta;
    return;
  }
  yearPageStart.value += delta * 12;
}

/** 只跨年：日期视图下的双箭头按钮用，月份不变（2 月 29 日不会出问题，格子按当月重新算） */
function stepYear(delta: number) {
  viewYear.value += delta;
}

/** 单箭头按钮的提示文案，随当前视图的步进单位变化 */
function stepTip(direction: 'prev' | 'next'): string {
  const unit = view.value === 'date' ? '月' : view.value === 'month' ? '年' : '页';
  return `${direction === 'prev' ? '上一' : '下一'}${unit}`;
}

function openMonthView() {
  view.value = 'month';
}

function openYearView() {
  yearPageStart.value = Math.floor(viewYear.value / 12) * 12;
  view.value = 'year';
}

function pickMonth(month: number) {
  viewMonth.value = month;
  view.value = 'date';
}

/** 选年：接着选月，最后回到日期视图 */
function pickYear(year: number) {
  viewYear.value = year;
  view.value = 'month';
}

/** 选中日期并收起面板 */
function pickDay(cell: DayCell) {
  emit('update:modelValue', cell.value);
  emit('change', cell.value);
  close();
}

/** 键盘：Esc 收起 */
function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !isOpen.value) return;
  event.stopPropagation();
  close();
}

/** 点击组件外部时收起面板 */
function handleDocumentClick(event: MouseEvent) {
  const target = event.target as Node | null;
  if (target && rootRef.value?.contains(target)) return;
  isOpen.value = false;
  view.value = 'date';
}

watch(isOpen, (open) => {
  if (open) document.addEventListener('click', handleDocumentClick, true);
  else document.removeEventListener('click', handleDocumentClick, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick, true);
});

defineExpose({ open, close });
</script>

<style scoped lang="scss">
.bottom-line-date-picker {
  /* 高度与下划线厚度可按场景覆盖 */
  --bottom-line-date-picker-height: 32px;
  --bottom-line-date-picker-line-width: var(--ao-border-width-thin);
  /* 日期格边长（正方形），可按场景覆盖 */
  --bottom-line-date-picker-cell-size: 28px;

  position: relative;
  width: 100%;
}

.bottom-line-date-picker__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ao-spacing-xs);
  width: 100%;
  height: var(--bottom-line-date-picker-height);
  padding: 0;
  box-sizing: border-box;
  border: none;
  background-color: transparent;
  font-family: inherit;
  font-size: var(--ao-font-size-sm);
  color: var(--ao-color-text-base);
  text-align: left;
  cursor: pointer;
  outline: none;

  &:disabled {
    cursor: not-allowed;
  }
}

.bottom-line-date-picker__text {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  /* 未选择时按占位文本样式展示 */
  &.is-placeholder {
    color: var(--ao-color-text-disabled);
  }
}

.bottom-line-date-picker__icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  /* 图标自带灰色，用透明度呼应下划线的常态/激活态 */
  opacity: 0.6;
  transition: opacity var(--ao-duration-fast) var(--ao-ease-in-out);
}

.bottom-line-date-picker__trigger:hover .bottom-line-date-picker__icon,
.bottom-line-date-picker.is-open .bottom-line-date-picker__icon {
  opacity: 1;
}

.bottom-line-date-picker__line {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: var(--bottom-line-date-picker-line-width);
  background-color: var(--ao-color-border);
  /* 由左端开始生长 */
  transform-origin: left center;
  animation: bottom-line-date-picker-grow var(--ao-duration-base)
    var(--ao-ease-out) both;
  transition: background-color var(--ao-duration-fast) var(--ao-ease-in-out);
}

/* 展开或键盘聚焦：下划线换成品牌色 */
.bottom-line-date-picker.is-open,
.bottom-line-date-picker:focus-within {
  .bottom-line-date-picker__line {
    background-color: var(--ao-color-primary);
  }
}

.bottom-line-date-picker.is-disabled {
  .bottom-line-date-picker__text,
  .bottom-line-date-picker__icon {
    color: var(--ao-color-text-disabled);
    opacity: 0.4;
  }

  .bottom-line-date-picker__line {
    background-color: var(--ao-color-border-secondary);
  }
}

/* ========== 面板 ========== */
.bottom-line-date-picker__panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 100;
  /* 宽度与触发器（即上面的输入框）一致，不向外超出 */
  width: 100%;
  padding: var(--ao-spacing-sm);
  box-sizing: border-box;
  background-color: var(--ao-color-bg-elevated);
  border-radius: var(--ao-border-radius-base);
  box-shadow: var(--ao-shadow-md);
}

.bottom-line-date-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--ao-spacing-xs);
}

.bottom-line-date-picker__nav-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.bottom-line-date-picker__nav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: var(--ao-border-radius-sm);
  background-color: transparent;
  color: var(--ao-color-text-secondary);
  cursor: pointer;
  transition:
    color var(--ao-duration-fast) var(--ao-ease-in-out),
    background-color var(--ao-duration-fast) var(--ao-ease-in-out);

  svg {
    width: 6px;
    height: 11px;
  }

  /* 跨年用的是双箭头，比单箭头宽一些 */
  &--double svg {
    width: 11px;
  }

  &:hover {
    color: var(--ao-color-primary);
    background-color: var(--ao-gray-2);
  }
}

.bottom-line-date-picker__title {
  display: flex;
  align-items: center;
  gap: var(--ao-spacing-xxs);
  font-size: var(--ao-font-size-sm);
  color: var(--ao-color-text-base);
}

.bottom-line-date-picker__title-btn {
  padding: 0 2px;
  border: none;
  background-color: transparent;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  cursor: pointer;
  transition: color var(--ao-duration-fast) var(--ao-ease-in-out);

  &:hover {
    color: var(--ao-color-primary);
  }
}

.bottom-line-date-picker__range {
  font-size: var(--ao-font-size-sm);
}

.bottom-line-date-picker__grid {
  display: grid;
  gap: 2px;
}

/* 日期格：固定边长保证是正方形，列间多余空间均分到 gutter */
.bottom-line-date-picker__grid--date {
  grid-template-columns: repeat(7, var(--bottom-line-date-picker-cell-size));
  justify-content: space-between;
}

.bottom-line-date-picker__grid--date .bottom-line-date-picker__cell {
  width: var(--bottom-line-date-picker-cell-size);
  height: var(--bottom-line-date-picker-cell-size);
}

/* 月/年用方块，比圆形更贴合 3 列排布 */
.bottom-line-date-picker__grid--month,
.bottom-line-date-picker__grid--year {
  grid-template-columns: repeat(3, 1fr);
  gap: var(--ao-spacing-xxs);
}

.bottom-line-date-picker__week {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--bottom-line-date-picker-cell-size);
  font-size: var(--ao-font-size-xs);
  color: var(--ao-color-text-secondary);
}

.bottom-line-date-picker__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0;
  box-sizing: border-box;
  /* 常驻透明边框占位：选中时换成品牌色边框，文字不会因边框出现而位移 */
  border: var(--ao-border-width-thin) solid transparent;
  border-radius: var(--ao-border-radius-xs);
  background-color: transparent;
  font-family: inherit;
  font-size: 13px;
  color: var(--ao-color-text-base);
  cursor: pointer;
  transition:
    color var(--ao-duration-fast) var(--ao-ease-in-out),
    border-color var(--ao-duration-fast) var(--ao-ease-in-out),
    background-color var(--ao-duration-fast) var(--ao-ease-in-out);

  &:not(.is-selected):hover:not(:disabled) {
    background-color: var(--ao-gray-2);
  }

  /* 非本月日期置灰，仍可点（点了就跳到那个月） */
  &.is-outside {
    color: var(--ao-color-text-disabled);
  }

  &.is-today {
    color: var(--ao-color-primary);
    font-weight: var(--ao-font-weight-medium);
  }

  /* 选中：正方形品牌色边框 + 极浅品牌色底，比实心圆更轻 */
  &.is-selected {
    border-color: var(--ao-color-primary);
    background-color: color-mix(
      in srgb,
      var(--ao-color-primary) 10%,
      transparent
    );
    color: var(--ao-color-primary);
    font-weight: var(--ao-font-weight-medium);
  }

  /* 禁用放在最后：被禁用的格子不显示选中态 */
  &:disabled {
    border-color: transparent;
    background-color: transparent;
    color: var(--ao-color-text-disabled);
    cursor: not-allowed;
  }
}

.bottom-line-date-picker__grid--month .bottom-line-date-picker__cell,
.bottom-line-date-picker__grid--year .bottom-line-date-picker__cell {
  height: 36px;
}

/* 面板下落展开 */
.bottom-line-date-picker-drop-enter-active,
.bottom-line-date-picker-drop-leave-active {
  transition:
    opacity var(--ao-duration-fast) var(--ao-ease-out),
    transform var(--ao-duration-fast) var(--ao-ease-out);
}

.bottom-line-date-picker-drop-enter-from,
.bottom-line-date-picker-drop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 下划线宽度由 0 到整宽 */
@keyframes bottom-line-date-picker-grow {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}
</style>
