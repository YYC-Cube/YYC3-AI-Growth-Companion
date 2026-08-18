import React, { useEffect } from 'react';
import { Button, message } from 'antd';
import { pythonAI } from '../../../services/integration/pythonIntegration';
import { growthAI } from '../../../services/ai/aiPopupIntegration';
import AIGrowthPopup from '../ai/AIGrowthPopup';

const GrowthSystemIntegration: React.FC = () => {
  const [showAIPopup, setShowAIPopup] = React.useState(false);
  const [popupType, setPopupType] = React.useState<'summary' | 'analysis'>('summary');

  // 初始化时自动同步Python配置
  useEffect(() => {
    initializeGrowthSystem();
  }, []);

  const initializeGrowthSystem = async () => {
    try {
      // 同步Python配置
      const config = await pythonAI.syncConfig();
      
      // 注册AI事件监听器（已在aiPopupIntegration中自动注册）
      
      console.log('成长系统初始化完成', config);
    } catch (error) {
      console.error('成长系统初始化失败:', error);
    }
  };

  const handleGenerateTree = async () => {
    try {
      message.loading('正在生成成长树...', 0);
      await pythonAI.generateGrowthTree();
      message.destroy();
      message.success('成长树生成成功！');
    } catch (error) {
      message.destroy();
      message.error('生成成长树失败');
    }
  };

  const handleExportData = async () => {
    try {
      const data = await pythonAI.exportData('json');
      
      // 下载JSON文件
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `沫语成长数据_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      message.success('数据导出成功');
    } catch (error) {
      message.error('数据导出失败');
    }
  };

  const handleAIPopupRequest = (type: 'summary' | 'analysis' | 'suggestions' | 'report') => {
    setPopupType(type as any);
    setShowAIPopup(true);
  };

  const handleAIAction = async (action: string) => {
    switch (action) {
      case 'record-event':
        try {
          await growthAI.recordAIEvent({
            type: '用户主动记录',
            description: '用户通过界面主动触发记录',
            confidence: 0.9,
            suggestions: ['继续记录成长瞬间'],
          });
          message.success('AI记录已保存');
        } catch (error) {
          message.error('记录失败');
        }
        break;
        
      case 'generate-report':
        try {
          const report = await growthAI.generateGrowthReport({
            reportType: 'monthly',
            includeAI: true,
          });
          
          // 可以在界面上显示报告
          console.log('成长报告:', report);
          message.success('成长报告生成成功');
        } catch (error) {
          message.error('报告生成失败');
        }
        break;
    }
  };

  return (
    <div className="integration-page">
      <div className="integration-actions">
        <h2>成长系统集成</h2>
        
        <div className="action-buttons">
          <Button 
            type="primary" 
            onClick={handleGenerateTree}
            style={{ marginRight: 16 }}
          >
            生成成长树
          </Button>
          
          <Button 
            onClick={handleExportData}
            style={{ marginRight: 16 }}
          >
            导出数据
          </Button>
          
          <Button 
            onClick={() => handleAIPopupRequest('summary')}
            style={{ marginRight: 16 }}
          >
            AI成长摘要
          </Button>
          
          <Button 
            onClick={() => handleAIPopupRequest('analysis')}
            style={{ marginRight: 16 }}
          >
            AI趋势分析
          </Button>
          
          <Button 
            onClick={() => handleAIPopupRequest('suggestions')}
            style={{ marginRight: 16 }}
          >
            AI文化推荐
          </Button>
        </div>
        
        <div className="ai-actions" style={{ marginTop: 24 }}>
          <h3>AI快速操作</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button onClick={() => handleAIAction('record-event')}>
              记录AI事件
            </Button>
            <Button onClick={() => handleAIAction('generate-report')}>
              生成月报
            </Button>
            <Button onClick={() => {
              growthAI.triggerGrowthReminder('cultural')
                .then(result => {
                  if (result?.missing?.length > 0) {
                    message.info(`发现${result.missing.length}个未完成的文化里程碑`);
                  }
                });
            }}>
              文化里程碑检查
            </Button>
          </div>
        </div>
      </div>
      
      {/* AI弹窗 */}
      <AIGrowthPopup
        visible={showAIPopup}
        onClose={() => setShowAIPopup(false)}
        type={popupType}
      />
    </div>
  );
};

export default GrowthSystemIntegration;
