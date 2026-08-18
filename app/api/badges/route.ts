/**
 * @file route.ts
 * @description 勋章系统API端点（统一合并版：使用 src/services/badgeService 唯一服务实现）
 */

import { NextRequest, NextResponse } from 'next/server';
import BadgeService from '@/src/services/badgeService';
import type { BadgeCategory, BadgeSeries } from '@/src/types/badge';

const badgeService = BadgeService.getInstance();

/**
 * GET /api/badges
 * 获取所有勋章或根据条件筛选
 *
 * 查询参数：
 * - id：获取单个勋章
 * - action=search&q=：搜索勋章
 * - series / category：按套系/分类筛选
 * - action=earned|hidden|stats|groups
 * - action=progress&series=：套系进度
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const series = searchParams.get('series');
    const category = searchParams.get('category');
    const query = searchParams.get('q');
    const id = searchParams.get('id');

    // 获取单个勋章
    if (id) {
      const badge = badgeService.getBadgeById(id);
      if (!badge) {
        return NextResponse.json(
          { success: false, error: 'Badge not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: badge });
    }

    // 搜索勋章
    if (action === 'search' && query) {
      const badges = badgeService.searchBadges(query);
      return NextResponse.json({ success: true, data: badges });
    }

    // 按套系筛选
    if (series) {
      const badges = badgeService.getBadgesBySeries(series as BadgeSeries);
      return NextResponse.json({ success: true, data: badges });
    }

    // 按分类筛选
    if (category) {
      const badges = badgeService.getBadgesByCategory(category as BadgeCategory);
      return NextResponse.json({ success: true, data: badges });
    }

    // 获取已获得的勋章
    if (action === 'earned') {
      const badges = badgeService.getEarnedBadges();
      return NextResponse.json({ success: true, data: badges });
    }

    // 获取隐藏勋章
    if (action === 'hidden') {
      const badges = badgeService.getHiddenBadges();
      return NextResponse.json({ success: true, data: badges });
    }

    // 获取统计数据
    if (action === 'stats') {
      const stats = badgeService.getBadgeStats();
      return NextResponse.json({ success: true, data: stats });
    }

    // 获取套系组
    if (action === 'groups') {
      const groups = badgeService.getBadgeGroups();
      return NextResponse.json({ success: true, data: groups });
    }

    // 获取套系进度
    if (action === 'progress' && series) {
      const progress = badgeService.getSeriesProgress(series as BadgeSeries);
      return NextResponse.json({ success: true, data: progress });
    }

    // 默认：获取所有勋章
    const badges = badgeService.getAllBadges();
    return NextResponse.json({ success: true, data: badges });
  } catch (error) {
    console.error('Badges API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/badges
 * 解锁勋章
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id } = body;

    if (action === 'unlock' && id) {
      const badge = await badgeService.unlockBadge(id);
      return NextResponse.json({ success: true, data: badge });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Badges POST API error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to process request',
      },
      { status: 500 }
    );
  }
}
