import type { appDetailList } from '@/mock/app-detail';

/** 应用详情数据（直接取自目录数据，新增字段自动同步） */
export type AppDetailItem = (typeof appDetailList)[number];

/** 功能块（由应用特性生成） */
export type AppDetailFeature = AppDetailItem['pictorial'][number];
