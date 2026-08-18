import { describe, it, expect, beforeEach } from 'bun:test';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BadgeCard from '../src/components/badge/BadgeCard';
import BadgeDetailModal from '../src/components/badge/BadgeDetailModal';
import BadgeGroupCard from '../src/components/badge/BadgeGroupCard';
import { Badge, BadgeGroup } from '../src/types/badge';
import BadgeService from '../src/services/badgeService';

const mockBadge: Badge = {
  id: 'test_badge',
  title: '测试勋章',
  description: '这是一个测试勋章',
  icon: '/badges/test.png',
  series: 'growth',
  level: 'bronze',
  category: 'learning',
  rarity: 'common',
  unlockConditions: [
    { type: 'total_hours', value: 10, description: '累计学习10小时' }
  ],
  metadata: {
    points: 100,
    version: '1.0',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
};

const mockBadgeGroup: BadgeGroup = {
  id: 'test_group',
  name: '测试套系',
  description: '这是一个测试套系',
  icon: '/badges/groups/test.png',
  badgeCount: 5,
  earnedCount: 2,
  progress: 0.4,
  badges: ['badge1', 'badge2', 'badge3', 'badge4', 'badge5'],
  category: 'learning'
};

describe('BadgeCard', () => {
  beforeEach(() => {
    const badgeService = BadgeService.getInstance();
    badgeService.resetUserProgress();
  });

  it('should render badge card', () => {
    render(<BadgeCard badge={mockBadge} />);
    expect(screen.getByText('测试勋章')).toBeInTheDocument();
    expect(screen.getByText('这是一个测试勋章')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<BadgeCard badge={mockBadge} onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('测试勋章'));
    expect(handleClick).toHaveBeenCalledWith(mockBadge);
  });

  it('should show progress bar for unearned badge', () => {
    render(<BadgeCard badge={mockBadge} showProgress={true} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('should not show progress bar when showProgress is false', () => {
    render(<BadgeCard badge={mockBadge} showProgress={false} />);
    expect(screen.queryByText('0%')).not.toBeInTheDocument();
  });

  it('should display earned badge with different styling', async () => {
    const badgeService = BadgeService.getInstance();
    badgeService.updateBadgeProgress('test_badge', 100);
    await badgeService.unlockBadge('test_badge');

    render(<BadgeCard badge={mockBadge} />);
    const card = screen.getByText('测试勋章').closest('.badge-card');
    expect(card).toHaveClass('earned');
  });

  it('should display hidden badge with overlay', () => {
    const hiddenBadge = { ...mockBadge, isHidden: true, hiddenDescription: '隐藏描述' };
    render(<BadgeCard badge={hiddenBadge} />);
    
    expect(screen.getByText('?')).toBeInTheDocument();
    expect(screen.getByText('隐藏描述')).toBeInTheDocument();
  });

  it('should show unlock button when progress is 100%', () => {
    const badgeService = BadgeService.getInstance();
    badgeService.updateBadgeProgress('test_badge', 100);

    render(<BadgeCard badge={mockBadge} />);
    expect(screen.getByText('解锁勋章')).toBeInTheDocument();
  });
});

describe('BadgeDetailModal', () => {
  beforeEach(() => {
    const badgeService = BadgeService.getInstance();
    badgeService.resetUserProgress();
  });

  it('should not render when isOpen is false', () => {
    render(<BadgeDetailModal badge={mockBadge} isOpen={false} onClose={jest.fn()} />);
    expect(screen.queryByText('测试勋章')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(<BadgeDetailModal badge={mockBadge} isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText('测试勋章')).toBeInTheDocument();
    expect(screen.getByText('这是一个测试勋章')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<BadgeDetailModal badge={mockBadge} isOpen={true} onClose={handleClose} />);
    
    fireEvent.click(screen.getByText('×'));
    expect(handleClose).toHaveBeenCalled();
  });

  it('should call onClose when overlay is clicked', () => {
    const handleClose = jest.fn();
    render(<BadgeDetailModal badge={mockBadge} isOpen={true} onClose={handleClose} />);
    
    const overlay = screen.getByText('测试勋章').closest('.modal-overlay');
    if (overlay) {
      fireEvent.click(overlay);
      expect(handleClose).toHaveBeenCalled();
    }
  });

  it('should display unlock conditions', () => {
    render(<BadgeDetailModal badge={mockBadge} isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText('解锁条件')).toBeInTheDocument();
    expect(screen.getByText('累计学习10小时')).toBeInTheDocument();
  });

  it('should display badge stats', () => {
    render(<BadgeDetailModal badge={mockBadge} isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText('成就点数')).toBeInTheDocument();
    expect(screen.getByText('稀有度')).toBeInTheDocument();
  });

  it('should show unlock button when conditions are met', async () => {
    const badgeService = BadgeService.getInstance();
    badgeService.updateBadgeProgress('test_badge', 100);

    render(<BadgeDetailModal badge={mockBadge} isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText('解锁勋章')).toBeInTheDocument();
  });

  it('should show share button for earned badges', async () => {
    const badgeService = BadgeService.getInstance();
    badgeService.updateBadgeProgress('test_badge', 100);
    await badgeService.unlockBadge('test_badge');

    const earnedBadge = { ...mockBadge, shareContent: { title: '分享', description: '描述', image: '/image.png', hashtags: ['#test'] } };
    render(<BadgeDetailModal badge={earnedBadge} isOpen={true} onClose={jest.fn()} />);
    
    expect(screen.getByText('分享成就')).toBeInTheDocument();
  });

  it('should show earned date for earned badges', async () => {
    const badgeService = BadgeService.getInstance();
    badgeService.updateBadgeProgress('test_badge', 100);
    await badgeService.unlockBadge('test_badge');

    render(<BadgeDetailModal badge={mockBadge} isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText(/获得时间/)).toBeInTheDocument();
  });

  it('should show locked message when prerequisite not met', () => {
    const badgeWithPrereq = { ...mockBadge, prerequisiteBadge: 'non_existent' };
    render(<BadgeDetailModal badge={badgeWithPrereq} isOpen={true} onClose={jest.fn()} />);
    
    expect(screen.getByText('需要先解锁前置勋章')).toBeInTheDocument();
  });
});

describe('BadgeGroupCard', () => {
  beforeEach(() => {
    const badgeService = BadgeService.getInstance();
    badgeService.resetUserProgress();
  });

  it('should render group card', () => {
    render(<BadgeGroupCard group={mockBadgeGroup} />);
    expect(screen.getByText('测试套系')).toBeInTheDocument();
    expect(screen.getByText('这是一个测试套系')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<BadgeGroupCard group={mockBadgeGroup} onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('测试套系'));
    expect(handleClick).toHaveBeenCalledWith(mockBadgeGroup);
  });

  it('should display progress stats', () => {
    render(<BadgeGroupCard group={mockBadgeGroup} />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should display locked state', () => {
    const lockedGroup = { ...mockBadgeGroup, isLocked: true, unlockRequirement: '需要解锁' };
    render(<BadgeGroupCard group={lockedGroup} />);
    
    expect(screen.getByText('🔒')).toBeInTheDocument();
    expect(screen.getByText('需要解锁')).toBeInTheDocument();
  });

  it('should display completion badge when group is completed', () => {
    const badgeService = BadgeService.getInstance();
    badgeService.updateBadgeProgress('test_badge', 100);
    badgeService.unlockBadge('test_badge');

    const completedGroup = { ...mockBadgeGroup, completionBadge: 'test_badge' };
    render(<BadgeGroupCard group={completedGroup} />);
    
    expect(screen.getByText('✓')).toBeInTheDocument();
    expect(screen.getByText('套系完成')).toBeInTheDocument();
  });
});
