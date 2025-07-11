import { Form, Input, Modal } from 'antd';
import React, { useEffect } from 'react';

import { City } from '@/types/city';

/**
 * 城市表单弹窗
 */
const CityFormModal: React.FC<{
  open: boolean;
  editingCity: City | null;
  onOk: (values: Pick<City, 'name' | 'code'>) => void;
  onCancel: () => void;
  confirmLoading: boolean;
}> = ({ open, editingCity, onOk, onCancel, confirmLoading }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
    } catch (error) {
      console.error('validate error', error);
    }
  };

  useEffect(() => {
    if (open) {
      if (editingCity) {
        form.setFieldsValue(editingCity);
      } else {
        form.resetFields();
      }
    }
  }, [open, editingCity, form]);

  return (
    <Modal
      title={editingCity ? '编辑城市' : '新增城市'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="城市名称" rules={[{ required: true, message: '请输入城市名称' }]}>
          <Input placeholder="请输入城市名称" />
        </Form.Item>
        <Form.Item name="code" label="城市编码" rules={[{ required: true, message: '请输入城市编码' }]}>
          <Input placeholder="请输入城市编码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CityFormModal;
