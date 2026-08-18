# YYC3-XY-勋章系统-组件样式

// /src/app/components/pages/SeriesDetailPage.less
.series-detail-page {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  
  .page-header {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 24px;
    
    .back-button {
      flex-shrink: 0;
    }
    
    .header-content {
      flex: 1;
      
      h1 {
        margin: 0 0 8px 0;
        font-size: 28px;
        color: #333;
        display: flex;
        align-items: center;
        gap: 12px;
        
        .series-icon {
          font-size: 32px;
        }
      }
      
      .series-description {
        margin: 0;
        color: #666;
        font-size: 16px;
      }
    }
  }
  
  .series-overview {
    border-radius: 16px;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    
    .progress-display {
      .progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        font-size: 16px;
        color: #333;
        font-weight: 500;
        
        .progress-count {
          color: #1890ff;
          font-size: 20px;
          font-weight: bold;
        }
      }
      
      .current-level {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 16px;
        
        .level-label {
          color: #666;
        }
        
        .level-tag {
          font-weight: bold;
          border-radius: 20px;
        }
      }
    }
  }
  
  .series-badges {
    border-radius: 16px;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    
    h3 {
      margin-bottom: 20px;
      color: #333;
      font-size: 20px;
    }
  }
  
  .milestones-section {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    
    h3 {
      margin-bottom: 20px;
      color: #333;
      font-size: 20px;
    }
    
    .milestone-item {
      .milestone-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        
        .milestone-title {
          font-weight: 500;
          color: #333;
        }
      }
      
      .milestone-reward {
        color: #666;
        margin: 0;
        font-size: 14px;
      }
    }
  }
  
  .locked-alert,
  .completion-alert {
    border-radius: 12px;
    margin-bottom: 24px;
  }
}

@media (max-width: 768px) {
  .series-detail-page {
    padding: 12px;
    
    .page-header {
      padding: 16px;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      
      h1 {
        font-size: 22px;
      }
      
      .back-button {
        align-self: flex-start;
      }
    }
  }
}
