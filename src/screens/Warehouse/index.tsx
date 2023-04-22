import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Modal, Select, Space, Table, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import utils from 'common/utils';
import consts, { DEFAULT_PAGE_SIZE } from 'consts';
import useToggle from 'hooks/useToggle';
import Icon from 'icon-icomoon';
import React, { useEffect, useState } from 'react';
import { MdDeleteForever } from 'react-icons/all';
import actions from 'redux/actions/warehouse';
import { useAppDispatch } from 'redux/store';
import styled from 'styled-components';
import { useImmer } from 'use-immer';

import _ from 'lodash';

export default function Warehouse() {
  const dispatch = useAppDispatch();
  const [_provider, setProvider] = useImmer({
    total: 0,
    current: 1,
    data: [],
  });
  const { open, close, isOpen } = useToggle();
  const [_form] = Form.useForm();
  const [_isUpdate, setIsUpdate] = useState(false);
  const [_id, setId] = useState(0);
  const [_active, setActive] = useState('1');

  const getDataImport = ({ current = _provider.current } = {}) => {
    setProvider((draft) => {
      draft.current = current;
    });
    dispatch(
      actions.actionGetImportWarehouse({
        params: { current, count: DEFAULT_PAGE_SIZE },
        callbacks: {
          onSuccess({ data, total }) {
            setProvider((draft) => {
              draft.data = data;
              draft.total = total;
            });
          },
        },
      })
    );
  };

  const getDataExport = ({ current = _provider.current } = {}) => {
    setProvider((draft) => {
      draft.current = current;
    });
    dispatch(
      actions.actionGetExportWarehouse({
        params: { current, count: DEFAULT_PAGE_SIZE },
        callbacks: {
          onSuccess({ data, total }) {
            setProvider((draft) => {
              draft.data = data;
              draft.total = total;
            });
          },
        },
      })
    );
  };

  useEffect(() => {
    getDataImport();
  }, []);

  const columns: any = [
    {
      width: '5%',
      align: 'center',
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      width: '15%',
      align: 'center',
      title: 'Người nhập',
      dataIndex: 'providerList',
      key: 'providerList',
      render: (providerList) => providerList.name,
    },
    {
      align: 'center',
      width: '10%',
      title: 'Ngày nhập',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      align: 'center',
      width: '10%',
      title: 'Ngày tạo phiếu',
      dataIndex: 'email',
      key: 'email',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Nhà cung cấp',
      dataIndex: 'address',
      key: 'address',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Trạng thái thanh toán',
      dataIndex: 'address',
      key: 'address',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Ngày thanh toán',
      dataIndex: 'address',
      key: 'address',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Tổng tiền',
      dataIndex: 'address',
      key: 'address',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Hành động',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => (
        <div className='flex items-center gap-x-2 justify-center'>
          <Icon size={18} className='cursor-pointer' icon={'info'} onClick={() => updateProvider(record)} />
          <Icon size={22} className='cursor-pointer' title='Cập nhật trạng thái' icon={'update-status'} onClick={() => showConfirm(id)} />
        </div>
      ),
    },
  ];

  const showConfirm = (id) => {
    Modal.confirm({
      icon: <ExclamationCircleFilled />,
      content: `Bạn có chắc chắn xóa nhà cung cấp ${id} không?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk() {
        // dispatch(
        //   actions.actionDeleteProvider({
        //     params: { id: _id },
        //     callbacks: {
        //       onSuccess({ data, total }) {
        //         getData();
        //         handleCancel();
        //       },
        //     },
        //   })
        // );
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const updateProvider = (record) => {
    open();
    setId(record.id);
    _form.setFieldsValue(record);
    setIsUpdate(true);
  };

  const handleOk = () => {
    const handleAction = _isUpdate ? 'actionUpdateProvider' : 'actionCreateProvider';
    _form
      .validateFields()
      .then((values) => {
        dispatch(
          actions[handleAction]({
            params: { ...values, phone: values.phone + '', id: _id },
            callbacks: {
              onSuccess() {
                handleCancel();
              },
            },
          })
        );
      })
      .catch(console.log);
  };

  const handleCancel = () => {
    _form.resetFields();
    close();
    setIsUpdate(false);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Quản lý nhập`,
      children: (
        <Table
          bordered
          dataSource={_provider.data}
          columns={columns}
          pagination={{
            onChange: (page) => getDataImport({ current: page }),
            showSizeChanger: false,
            current: _provider.current,
            pageSize: DEFAULT_PAGE_SIZE,
            total: _provider.total,
            hideOnSinglePage: true,
          }}
        />
      ),
    },
    {
      key: '2',
      label: `Quản lý xuất`,
      children: (
        <Table
          bordered
          dataSource={_provider.data}
          columns={columns}
          pagination={{
            onChange: (page) => getDataExport({ current: page }),
            showSizeChanger: false,
            current: _provider.current,
            pageSize: DEFAULT_PAGE_SIZE,
            total: _provider.total,
            hideOnSinglePage: true,
          }}
        />
      ),
    },
  ];

  const onChange = (key: string) => {
    console.log('🚀 ~ file: index.tsx:220 ~ onChange ~ key:', key);
    setActive(key);
    if (_active === '1') {
      getDataImport();
    } else {
      getDataExport();
    }
  };

  return (
    <>
      <Tabs
        defaultActiveKey='1'
        items={items}
        activeKey={_active}
        onChange={onChange}
        tabBarExtraContent={
          <Button type='primary' onClick={open}>
            Thêm phiếu nhập
          </Button>
        }
      />
    </>
  );
}
