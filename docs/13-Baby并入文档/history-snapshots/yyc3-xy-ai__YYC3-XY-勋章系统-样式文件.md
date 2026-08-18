# YYC3-XY-勋章系统-样式文件

// /src/app/components/pages/BadgesPage.less
@import '~antd/lib/style/themes/default.less';

.badges-page {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  
  &.loading {
    background: #f0f2f5;
  }
  
  // 页面头部
  .page-header {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24px;
    padding: 32px 40px;
    margin-bottom: 24px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .header-content {
      h1 {
        margin: 0 0 12px 0;
        font-size: 36px;
        color: #1890ff;
        display: flex;
        align-items: center;
        gap: 16px;
        
        .anticon {
          font-size: 40px;
          color: #ffd700;
        }
      }
      
      .header-description {
        margin: 0;
        font-size: 16px;
        color: #666;
        max-width: 600px;
      }
    }
    
    .header-actions {
      .ant-btn {
        border-radius: 12px;
        height: 48px;
        width: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
          background: #f5f5f5;
        }
      }
    }
  }
  
  // 统计卡片
  .stats-cards {
    margin-bottom: 24px;
    
    .stat-card {
      border-radius: 16px;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }
      
      &.total-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      
      &.points-card {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
      }
      
      &.rank-card {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
      }
      
      &.recent-card {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        color: white;
      }
      
      .stat-content {
        display: flex;
        align-items: center;
        gap: 20px;
        
        .stat-icon {
          .anticon {
            font-size: 36px;
            opacity: 0.8;
          }
        }
        
        .stat-info {
          .stat-value {
            font-size: 32px;
            font-weight: bold;
            line-height: 1;
          }
          
          .stat-label {
            font-size: 14px;
            opacity: 0.9;
            margin-top: 4px;
          }
        }
      }
    }
  }
  
  // 类别进度
  .category-progress {
    margin-bottom: 24px;
    
    .progress-card {
      border-radius: 16px;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      
      .ant-card-head {
        border-bottom: 2px solid #f0f0f0;
        padding: 20px 24px;
        
        .ant-card-head-title {
          font-size: 18px;
          font-weight: 500;
        }
      }
      
      .ant-card-body {
        padding: 24px;
      }
      
      .category-item {
        margin-bottom: 20px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          
          .category-icon {
            .anticon {
              font-size: 18px;
              margin-right: 8px;
            }
          }
          
          .category-name {
            font-size: 16px;
            font-weight: 500;
            color: #333;
          }
          
          .category-count {
            font-size: 14px;
            color: #666;
            font-weight: 500;
          }
        }
      }
    }
  }
  
  // 过滤器
  .filter-section {
    margin-bottom: 24px;
    
    .filter-card {
      border-radius: 16px;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      
      .ant-card-body {
        padding: 20px;
      }
    }
  }
  
  // 主要内容
  .main-content {
    .content-card {
      border-radius: 16px;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      
      .ant-card-body {
        padding: 0;
      }
    }
  }
  
  // 标签页
  .badges-tabs {
    .ant-tabs-nav {
      margin: 0;
      padding: 0 24px;
      background: white;
      border-radius: 16px 16px 0 0;
      
      .ant-tabs-tab {
        padding: 20px 24px;
        font-size: 16px;
        font-weight: 500;
        
        .anticon {
          margin-right: 8px;
          font-size: 18px;
        }
        
        &:hover {
          color: #1890ff;
        }
        
        &.ant-tabs-tab-active {
          .ant-tabs-tab-btn {
            color: #1890ff;
            font-weight: 600;
          }
        }
      }
      
      .ant-tabs-ink-bar {
        background: #1890ff;
        height: 3px;
      }
    }
    
    .ant-tabs-content-holder {
      padding: 24px;
    }
  }
  
  // 套系列表
  .series-grid {
    .series-card {
      border: 2px solid #f0f0f0;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
      height: 100%;
      
      &.locked {
        opacity: 0.6;
        cursor: not-allowed;
        
        &:hover {
          border-color: #f0f0f0;
          transform: none;
          box-shadow: none;
        }
      }
      
      &:hover:not(.locked) {
        border-color: #1890ff;
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(24, 144, 255, 0.15);
      }
      
      .series-cover {
        position: relative;
        height: 180px;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        
        .series-icon {
          font-size: 64px;
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .lock-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          
          .lock-icon {
            font-size: 48px;
            color: white;
          }
        }
      }
      
      .series-content {
        padding: 20px;
        
        .series-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          
          .series-name {
            margin: 0;
            font-size: 18px;
            font-weight: 500;
            color: #333;
          }
        }
        
        .series-description {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
          margin-bottom: 20px;
          height: 42px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .series-progress {
          margin-bottom: 16px;
          
          .progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            
            .progress-label {
              font-size: 14px;
              color: #666;
            }
            
            .progress-count {
              font-size: 14px;
              font-weight: 500;
              color: #1890ff;
            }
          }
          
          .level-info {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-top: 12px;
            
            .current-level, .next-level {
              display: flex;
              align-items: center;
              gap: 4px;
              
              .anticon {
                font-size: 16px;
              }
              
              .level-text {
                font-size: 12px;
                font-weight: 500;
                text-transform: uppercase;
              }
            }
            
            .level-arrow {
              color: #999;
              font-size: 12px;
            }
          }
        }
        
        .unlock-requirement {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #fa8c16;
          padding: 8px 12px;
          background: #fff7e6;
          border-radius: 6px;
          margin-bottom: 16px;
        }
        
        .action-section {
          text-align: right;
          
          .view-button {
            padding: 0;
            height: auto;
            
            &:hover {
              color: #1890ff;
            }
          }
        }
      }
    }
  }
  
  // 勋章网格
  .badges-grid-container {
    .badges-stats {
      margin-bottom: 24px;
      
      .ant-alert {
        border-radius: 12px;
        border: none;
        background: #e6f7ff;
        
        .ant-alert-message {
          font-size: 14px;
          color: #333;
        }
      }
    }
    
    .badges-grid {
      margin-bottom: 24px;
      
      .badge-card {
        border: 2px solid #f0f0f0;
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
        height: 100%;
        
        &.earned {
          border-color: #52c41a;
          
          &:hover {
            border-color: #73d13d;
            box-shadow: 0 8px 24px rgba(82, 196, 26, 0.15);
          }
        }
        
        &.unearned {
          opacity: 0.7;
          
          &:hover {
            opacity: 0.9;
            border-color: #d9d9d9;
          }
        }
        
        &.hidden {
          position: relative;
          
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.1) 100%);
            z-index: 1;
            border-radius: 12px;
          }
          
          &:hover {
            &::before {
              background: linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.2) 100%);
            }
          }
        }
        
        .ant-card-cover {
          padding: 24px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          text-align: center;
          position: relative;
          
          .badge-image-container {
            position: relative;
            display: inline-block;
            
            .badge-glow {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 120%;
              height: 120%;
              border-radius: 50%;
              z-index: 1;
            }
            
            .badge-image {
              width: 80px;
              height: 80px;
              transition: all 0.3s ease;
              position: relative;
              z-index: 2;
              
              &.locked {
                filter: grayscale(1);
                opacity: 0.6;
              }
              
              &.sparkle {
                animation: sparkle 2s ease-in-out infinite;
              }
              
              @keyframes sparkle {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.2); }
              }
            }
            
            .lock-overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(0, 0, 0, 0.3);
              border-radius: 50%;
              z-index: 3;
              
              .lock-icon {
                font-size: 24px;
                color: white;
              }
              
              .hidden-indicator {
                position: absolute;
                bottom: -8px;
                right: -8px;
                background: #fa8c16;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
              }
            }
            
            .earned-indicator {
              position: absolute;
              top: -8px;
              right: -8px;
              background: #52c41a;
              color: white;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              z-index: 4;
              animation: bounce 2s ease-in-out infinite;
              
              @keyframes bounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
              }
            }
            
            .rarity-icon {
              position: absolute;
              top: -12px;
              left: -12px;
              font-size: 24px;
              z-index: 4;
              
              &.legendary {
                color: #ffd700;
                animation: spin 4s linear infinite;
                
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              }
              
              &.epic {
                color: #ff6bcb;
                animation: pulse 2s ease-in-out infinite;
              }
              
              &.rare {
                color: #1890ff;
                animation: pulse 3s ease-in-out infinite;
              }
              
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.8; }
              }
            }
          }
          
          .progress-overlay {
            position: absolute;
            bottom: 12px;
            left: 12px;
            right: 12px;
            background: rgba(255, 255, 255, 0.9);
            padding: 4px;
            border-radius: 12px;
          }
        }
        
        .ant-card-body {
          padding: 16px;
          
          .badge-header {
            margin-bottom: 12px;
            
            .badge-title {
              margin: 0 0 8px 0;
              font-size: 16px;
              font-weight: 500;
              color: #333;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            
            .badge-meta {
              display: flex;
              align-items: center;
              gap: 8px;
              
              .level-tag {
                font-size: 10px;
                font-weight: bold;
                padding: 0 6px;
                height: 20px;
                line-height: 20px;
                min-width: 20px;
                text-align: center;
              }
              
              .rarity-badge {
                font-size: 10px;
                
                .ant-badge-status-text {
                  font-size: 10px;
                }
              }
            }
          }
          
          .badge-description {
            font-size: 12px;
            color: #666;
            margin-bottom: 12px;
            line-height: 1.4;
            height: 34px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          
          .badge-points {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-bottom: 8px;
            
            .points-icon {
              color: #ffd700;
              font-size: 14px;
            }
            
            .points-value {
              font-size: 14px;
              font-weight: bold;
              color: #fa8c16;
            }
          }
          
          .progress-info {
            .progress-text {
              font-size: 11px;
              color: #999;
              text-align: center;
            }
          }
          
          .earned-info {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #f0f0f0;
            
            small {
              font-size: 10px;
              color: #999;
            }
          }
          
          .hidden-hint {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            color: #fa8c16;
            margin-top: 8px;
          }
        }
        
        // 小尺寸
        &.badge-card-small {
          .ant-card-cover {
            padding: 16px;
            
            .badge-image-container {
              .badge-image {
                width: 60px;
                height: 60px;
              }
              
              .earned-indicator {
                width: 24px;
                height: 24px;
                font-size: 12px;
                top: -4px;
                right: -4px;
              }
            }
          }
          
          .ant-card-body {
            padding: 12px;
            
            .badge-title {
              font-size: 14px;
            }
          }
        }
        
        // 大尺寸
        &.badge-card-large {
          .ant-card-cover {
            padding: 32px;
            
            .badge-image-container {
              .badge-image {
                width: 100px;
                height: 100px;
              }
              
              .earned-indicator {
                width: 40px;
                height: 40px;
                font-size: 20px;
                top: -12px;
                right: -12px;
              }
            }
          }
          
          .ant-card-body {
            padding: 20px;
            
            .badge-title {
              font-size: 18px;
            }
          }
        }
      }
    }
    
    .pagination-container {
      display: flex;
      justify-content: center;
      padding: 24px 0;
      
      .ant-pagination {
        .ant-pagination-item {
          border-radius: 8px;
          
          a {
            color: #666;
          }
          
          &:hover {
            border-color: #1890ff;
            
            a {
              color: #1890ff;
            }
          }
          
          &.ant-pagination-item-active {
            background: #1890ff;
            border-color: #1890ff;
            
            a {
              color: white;
            }
          }
        }
        
        .ant-pagination-prev,
        .ant-pagination-next {
          .ant-pagination-item-link {
            border-radius: 8px;
          }
        }
      }
    }
  }
  
  // 近期勋章
  .recent-badges {
    .badge-card {
      border: 2px solid #52c41a;
    }
  }
  
  // 隐藏勋章
  .hidden-badges {
    .ant-alert {
      border-radius: 12px;
      margin-bottom: 24px;
    }
  }
  
  // 勋章详情弹窗
  .badge-detail-modal {
    .ant-modal-header {
      border-bottom: none;
      padding: 24px 24px 0;
      
      .ant-modal-title {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .modal-badge-icon {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }
      }
    }
    
    .ant-modal-body {
      padding: 24px;
    }
    
    .badge-detail-content {
      .basic-info {
        margin-bottom: 24px;
        
        .badge-description {
          font-size: 16px;
          color: #333;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        
        .badge-meta {
          .meta-item {
            .meta-label {
              font-size: 12px;
              color: #999;
              margin-bottom: 4px;
            }
            
            .meta-value {
              font-size: 14px;
              color: #333;
              
              .points-value {
                display: flex;
                align-items: center;
                gap: 4px;
                color: #fa8c16;
                font-weight: 500;
              }
            }
          }
        }
      }
      
      .unlock-conditions {
        margin-bottom: 24px;
        
        h4 {
          margin-bottom: 16px;
          color: #333;
          font-size: 16px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .condition-item {
          padding: 12px 16px;
          border-radius: 8px;
          background: #fafafa;
          margin-bottom: 8px;
          transition: all 0.3s ease;
          
          &.completed {
            background: #f6ffed;
            border: 1px solid #b7eb8f;
            
            .condition-content {
              .condition-icon {
                color: #52c41a;
              }
            }
          }
          
          .condition-content {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;
            
            .condition-icon {
              font-size: 16px;
              width: 24px;
              text-align: center;
            }
            
            .condition-text {
              flex: 1;
              font-size: 14px;
              color: #333;
            }
          }
          
          .condition-progress {
            display: flex;
            align-items: center;
            gap: 12px;
            
            .ant-progress {
              flex: 1;
            }
            
            .progress-text {
              font-size: 12px;
              color: #999;
              min-width: 40px;
            }
          }
        }
      }
      
      .series-info {
        margin-bottom: 24px;
        
        h4 {
          margin-bottom: 12px;
          color: #333;
          font-size: 16px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .series-progress {
          padding: 16px;
          background: #fafafa;
          border-radius: 8px;
          
          .series-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            font-size: 14px;
            color: #333;
          }
          
          .series-description {
            font-size: 14px;
            color: #666;
            margin-top: 12px;
            margin-bottom: 0;
          }
        }
      }
      
      .next-badge {
        margin-bottom: 24px;
        
        h4 {
          margin-bottom: 12px;
          color: #333;
          font-size: 16px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .next-badge-preview {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f0f8ff;
          border-radius: 8px;
          border: 1px solid #bae7ff;
          cursor: pointer;
          transition: all 0.3s ease;
          
          &:hover {
            background: #e6f7ff;
            border-color: #91d5ff;
            transform: translateX(4px);
          }
          
          img {
            width: 48px;
            height: 48px;
            object-fit: contain;
          }
          
          .next-badge-info {
            .next-badge-title {
              font-size: 14px;
              font-weight: 500;
              color: #333;
              margin-bottom: 4px;
            }
            
            .next-badge-desc {
              font-size: 12px;
              color: #666;
            }
          }
        }
      }
      
      .earned-info {
        h4 {
          margin-bottom: 8px;
          color: #333;
          font-size: 16px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        p {
          color: #666;
          margin: 0;
          font-size: 14px;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: @screen-sm) {
  .badges-page {
    padding: 12px;
    
    .page-header {
      padding: 20px 16px;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      
      h1 {
        font-size: 24px;
        
        .anticon {
          font-size: 28px;
        }
      }
      
      .header-actions {
        align-self: flex-end;
      }
    }
    
    .stats-cards {
      .stat-card {
        .stat-content {
          gap: 12px;
          
          .stat-icon {
            .anticon {
              font-size: 24px;
            }
          }
          
          .stat-info {
            .stat-value {
              font-size: 24px;
            }
          }
        }
      }
    }
    
    .filter-section {
      .filter-card {
        .ant-card-body {
          padding: 16px;
        }
        
        .ant-space {
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
          
          > * {
            width: 100%;
          }
        }
      }
    }
    
    .badges-tabs {
      .ant-tabs-nav {
        padding: 0 16px;
        
        .ant-tabs-tab {
          padding: 12px 16px;
          font-size: 14px;
        }
      }
      
      .ant-tabs-content-holder {
        padding: 16px;
      }
    }
    
    .badge-detail-modal {
      width: 95% !important;
      
      .ant-modal-header {
        padding: 16px 16px 0;
      }
      
      .ant-modal-body {
        padding: 16px;
      }
      
      .badge-detail-content {
        .basic-info {
          .badge-meta {
            .ant-row {
              flex-direction: column;
              gap: 12px;
              
              .ant-col {
                width: 100%;
              }
            }
          }
        }
      }
    }
  }
}
