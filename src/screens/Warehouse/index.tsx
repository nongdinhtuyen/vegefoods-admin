import AddOrderEntryForm from './AddOrderEntryForm';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Table, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import utils from 'common/utils';
import consts, { DEFAULT_PAGE_SIZE } from 'consts';
import dayjs from 'dayjs';
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
  const [_import, setImport] = useImmer({
    total: 0,
    current: 1,
    data: [],
  });
  const [_export, setExport] = useImmer({
    total: 0,
    current: 1,
    data: [],
  });
  const { open, close, isOpen } = useToggle();
  const [_form] = Form.useForm();
  const [_isUpdate, setIsUpdate] = useState(false);
  const [_id, setId] = useState(0);
  const [_active, setActive] = useState('1');
  const defaultDate: any = [];

  const getDataImport = ({ current = _import.current, date = defaultDate } = {}) => {
    setImport((draft) => {
      draft.current = current;
    });
    dispatch(
      actions.actionGetImportWarehouse({
        params: { current, count: DEFAULT_PAGE_SIZE, from: date[0], to: date[1] },
        callbacks: {
          onSuccess({ data, total }) {
            setImport((draft) => {
              draft.data = data;
              draft.total = total;
            });
          },
        },
      })
    );
  };

  const getDataExport = ({ current = _import.current, date = defaultDate } = {}) => {
    setExport((draft) => {
      draft.current = current;
    });
    dispatch(
      actions.actionGetExportWarehouse({
        params: { current, count: DEFAULT_PAGE_SIZE, from: date[0], to: date[1] },
        callbacks: {
          onSuccess({ data, total }) {
            setExport((draft) => {
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

  const importColumns: any = [
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
      dataIndex: 'adminList',
      key: 'adminList',
      render: (adminList) => adminList.name,
    },
    {
      align: 'center',
      width: '10%',
      title: 'Ngày nhập',
      dataIndex: 'importDate',
      key: 'importDate',
      render: (importDate) => utils.formatTimeFromUnix(importDate, 'DD/MM/YYYY HH:mm:ss'),
    },
    {
      align: 'center',
      width: '10%',
      title: 'Nhà cung cấp',
      dataIndex: 'createDate',
      key: 'createDate',
      render: (createDate) => utils.formatTimeFromUnix(createDate, 'DD/MM/YYYY HH:mm:ss'),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Nhà cung cấp',
      dataIndex: 'providerList',
      key: 'providerList',
      render: (providerList) => providerList.name,
    },
    {
      width: '10%',
      align: 'center',
      title: 'Trạng thái thanh toán',
      dataIndex: 'status',
      key: 'status',
      render: (status) => consts.PRODUCT_STATUS_STRING[status],
    },
    {
      width: '10%',
      align: 'center',
      title: 'Ngày thanh toán',
      dataIndex: 'solveDate',
      key: 'solveDate',
      render: (createDate) => utils.formatTimeFromUnix(createDate, 'DD/MM/YYYY HH:mm:ss'),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Tổng tiền (VNĐ)',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: utils.formatCurrency,
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

  const exportColumns: any = [
    {
      width: '5%',
      align: 'center',
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Ngày xuất',
      dataIndex: 'createDate',
      key: 'createDate',
      render: (createDate) => utils.formatTimeFromUnix(createDate, 'DD/MM/YYYY HH:mm:ss'),
    },
    {
      align: 'center',
      width: '10%',
      title: 'Người nhận',
      dataIndex: 'nameReceiver',
      key: 'nameReceiver',
    },
    {
      align: 'center',
      width: '10%',
      title: 'Nhà cung cấp',
      dataIndex: 'createDate',
      key: 'createDate',
      render: (createDate) => utils.formatTimeFromUnix(createDate, 'DD/MM/YYYY HH:mm:ss'),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Số điện thoại',
      dataIndex: 'phoneReceiver',
      key: 'phoneReceiver',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Địa chỉ',
      dataIndex: 'addressReceiver',
      key: 'addressReceiver',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Tổng tiền (VNĐ)',
      dataIndex: 'total',
      key: 'total',
      render: utils.formatCurrency,
    },
    {
      width: '5%',
      align: 'center',
      title: 'Hành động',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => (
        <div className='flex items-center gap-x-2 justify-center'>
          <Icon size={18} className='cursor-pointer' icon={'info'} onClick={() => updateProvider(record)} />
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
          dataSource={_import.data}
          columns={importColumns}
          pagination={{
            onChange: (page) => getDataImport({ current: page }),
            showSizeChanger: false,
            current: _import.current,
            pageSize: DEFAULT_PAGE_SIZE,
            total: _import.total,
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
          dataSource={_export.data}
          columns={exportColumns}
          pagination={{
            onChange: (page) => getDataExport({ current: page }),
            showSizeChanger: false,
            current: _export.current,
            pageSize: DEFAULT_PAGE_SIZE,
            total: _export.total,
            hideOnSinglePage: true,
          }}
        />
      ),
    },
  ];

  const handleDate = (values) => {
    console.log('🚀 ~ file: index.tsx:324 ~ handleDate ~ values:', values);
    const date = values ? [dayjs(values[0]).unix(), dayjs(values[1]).unix()] : [];
    if (_active === '1') {
      getDataImport({ date });
    } else {
      getDataExport({ date });
    }
  };

  const onChange = ({ key = '1', date }: any = {}) => {
    setActive(key);
    if (key === '1') {
      getDataImport({ current: _import.current, date });
    } else {
      getDataExport({ current: _export.current, date });
    }
  };

  return (
    <>
      <Tabs
        defaultActiveKey='1'
        items={items}
        activeKey={_active}
        onChange={(key) => onChange({ key })}
        tabBarExtraContent={
          <>
            <DatePicker.RangePicker
              showTime={{ format: 'HH:mm' }}
              format='DD/MM/YYYY HH:mm:ss'
              disabledDate={(current) => current && current > dayjs().endOf('day')}
              onChange={handleDate}
            />
            <Button type='primary' className='ml-4' onClick={open}>
              Thêm phiếu nhập
            </Button>
          </>
        }
      />
      <AddOrderEntryForm isOpen={isOpen} close={close} />
    </>
  );
}
