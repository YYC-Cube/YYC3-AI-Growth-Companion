import React from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

interface GrowthRecordFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const GrowthRecordForm: React.FC<GrowthRecordFormProps> = ({ onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ type: 'cultural' }}
    >
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input placeholder="例如：参观博物馆" />
      </Form.Item>

      <Form.Item
        name="age"
        label="年龄 (岁)"
        rules={[{ required: true, message: '请输入年龄' }]}
      >
        <InputNumber min={0} max={21} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="type"
        label="类型"
        rules={[{ required: true, message: '请选择类型' }]}
      >
        <Select>
          <Option value="cultural">文化体验</Option>
          <Option value="academic">学业成长</Option>
          <Option value="social">社交发展</Option>
          <Option value="health">健康守护</Option>
          <Option value="perception">感知启蒙</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="date"
        label="日期"
        rules={[{ required: true, message: '请选择日期' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="description"
        label="描述"
        rules={[{ required: true, message: '请输入描述' }]}
      >
        <TextArea rows={4} placeholder="记录详细内容..." />
      </Form.Item>

      <div style={{ textAlign: 'right', marginTop: 16 }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          保存
        </Button>
      </div>
    </Form>
  );
};

export default GrowthRecordForm;
