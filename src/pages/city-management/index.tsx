import { useAntdTable, useRequest } from 'ahooks';
import { Button, Card, Divider, Form, Input, Modal, Popconfirm, Row, Space, Table, message } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';

import { batchDeleteCities, createCity, deleteCity, getCities, updateCity } from '@/api/city';
import { City } from '@/types/city';

import CityFormModal from './CityFormModal';

/**
 * 城市管理页面
 */
const CityManagementIndexPage: React.FC = () => {
  const [searchForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);

  const {
    tableProps,
    search: { submit },
    refresh,
  } = useAntdTable(({ current, pageSize }, formData) => getCities({ current, pageSize, ...formData }), {
    form: searchForm,
  });

  const { run: runCreateCity, loading: createLoading } = useRequest(createCity, {
    manual: true,
    onSuccess: () => {
      message.success('创建成功');
      refresh();
      setIsModalVisible(false);
    },
  });

  const { run: runUpdateCity, loading: updateLoading } = useRequest(updateCity, {
    manual: true,
    onSuccess: () => {
      message.success('更新成功');
      refresh();
      setIsModalVisible(false);
    },
  });

  const { run: runDeleteCity } = useRequest(deleteCity, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      refresh();
    },
  });

  const { run: runBatchDeleteCities, loading: batchDeleteLoading } = useRequest(batchDeleteCities, {
    manual: true,
    onSuccess: () => {
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      refresh();
    },
  });

  const handleEdit = useCallback((record: City) => {
    setEditingCity(record);
    setIsModalVisible(true);
  }, []);

  const hasSelected = useMemo(() => selectedRowKeys.length > 0, [selectedRowKeys]);

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: setSelectedRowKeys,
    }),
    [selectedRowKeys]
  );

  const columns = useMemo(
    () => [
      { title: '城市名称', dataIndex: 'name' },
      { title: '城市编码', dataIndex: 'code' },
      {
        title: '操作',
        key: 'action',
        render: (_: any, record: City) => (
          <Space size="middle">
            <Button type="link" onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Divider type="vertical" />
            <Popconfirm title="确认删除？" onConfirm={() => runDeleteCity(record.id)}>
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [handleEdit, runDeleteCity]
  );

  const handleAdd = useCallback(() => {
    setEditingCity(null);
    setIsModalVisible(true);
  }, []);

  const handleModalOk = useCallback(
    (values: Pick<City, 'name' | 'code'>) => {
      if (editingCity) {
        runUpdateCity(editingCity.id, values);
      } else {
        runCreateCity(values);
      }
    },
    [editingCity, runCreateCity, runUpdateCity]
  );

  const handleModalCancel = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const handleBatchDelete = useCallback(() => {
    if (hasSelected) {
      Modal.confirm({
        title: '确认删除？',
        content: `确认删除选中的 ${selectedRowKeys.length} 条记录吗？`,
        onOk: () => runBatchDeleteCities(selectedRowKeys as string[]),
      });
    }
  }, [hasSelected, runBatchDeleteCities, selectedRowKeys]);

  return (
    <Card>
      <Form form={searchForm} layout="inline">
        <Form.Item name="name" label="城市名称">
          <Input placeholder="请输入城市名称" />
        </Form.Item>
        <Form.Item name="code" label="城市编码">
          <Input placeholder="请输入城市编码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={submit}>
            查询
          </Button>
        </Form.Item>
      </Form>
      <Row justify="end" style={{ margin: '16px 0' }}>
        <Space>
          <Button type="primary" onClick={handleAdd}>
            新增
          </Button>
          <Button danger disabled={!hasSelected} loading={batchDeleteLoading} onClick={handleBatchDelete}>
            批量删除
          </Button>
        </Space>
      </Row>

      <Table rowKey="id" columns={columns} {...tableProps} rowSelection={rowSelection} />
      <CityFormModal
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={createLoading || updateLoading}
        editingCity={editingCity}
      />
    </Card>
  );
};

export default CityManagementIndexPage;
