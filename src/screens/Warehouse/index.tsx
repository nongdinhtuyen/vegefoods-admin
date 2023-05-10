import AddOrderEntryForm from './AddOrderEntryForm';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Table, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { BASEURL } from 'bootstrap';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
import DisplayControl from 'components/DisplayControl';
import consts, { DEFAULT_PAGE_SIZE, DEFAULT_SMALL_PAGE_SIZE } from 'consts';
import dayjs from 'dayjs';
import useToggle from 'hooks/useToggle';
import Icon from 'icon-icomoon';
import React, { useEffect, useState } from 'react';
import { AiOutlineEdit, RiFileExcel2Line } from 'react-icons/all';
import providerActions from 'redux/actions/provider';
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
  const [_date, setDate] = useState<any>([]);
  const { open, close, isOpen } = useToggle();
  const { open: warehoseOpen, close: warehoseClose, isOpen: warehoseIsOpen } = useToggle();
  const { open: detailOpen, close: detailClose, isOpen: detailIsOpen } = useToggle();
  const [_form] = Form.useForm();
  const [_id, setId] = useState(0);
  const [_active, setActive] = useState('1');
  const [_detail, setDetail] = useState<any>({});
  const [_isEdit, setIsEdit] = useState(false);
  const [_provider, setProvider] = useState([]);

  const getProvider = () => {
    dispatch(
      providerActions.actionGetProvider({
        params: {
          current: 1,
          count: 100,
        },
        callbacks: {
          onSuccess({ data, total }) {
            setProvider(data);
          },
        },
      })
    );
  };

  const getData = ({ current = _import.current, date = _date, key = _active } = {}) => {
    const [action, setAction] = key === '1' ? ['actionGetImportWarehouse', setImport] : ['actionGetExportWarehouse', setExport];
    dispatch(
      actions[action]({
        params: { current, count: DEFAULT_PAGE_SIZE, from: date[0], to: date[1] },
        callbacks: {
          onSuccess({ data, total }) {
            setAction((draft) => {
              draft.data = data;
              draft.total = total;
            });
          },
        },
      })
    );
  };

  const getDataDetail = (id) => {
    const action = _active === '1' ? 'actionGetImportWarehouseById' : 'actionGetExportWarehouseById';
    dispatch(
      actions[action]({
        params: { id },
        callbacks: {
          onSuccess({ data, total }) {
            console.log('🚀 ~ file: index.tsx:88 ~ onSuccess ~ data:', data);
            setDetail(data);
          },
        },
      })
    );
  };

  useEffect(() => {
    getData();
    getProvider();
  }, []);

  const importExcel = async (id) => {
    const response = await window.axios.get(`/warehouse/import/excel/${id}`, { params: {}, responseType: 'blob' });
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', 'import.xlsx'); //any other extension
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const exportExcel = async (id) => {
    const response = await window.axios.get(`/warehouse/export/excel/${id}`, { params: {}, responseType: 'blob' });
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', 'import.xlsx'); //any other extension
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const importColumns: any = [
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
      title: 'Ngày tạo phiếu',
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
      render: (status) => consts.WAREHOUSE_STATUS[status],
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
        <div className='flex items-center gap-x-4 justify-center'>
          <Icon size={18} className='cursor-pointer' title='Chi tiết' icon={'info'} onClick={() => orderDetail(record)} />
          <DisplayControl path='warehouse/import/:id' action='put'>
            <AiOutlineEdit size={18} className='cursor-pointer' title='Sửa phiếu nhập' onClick={() => handleEdit(record)} />
          </DisplayControl>
          <DisplayControl path='warehouse/import/:id' action='post'>
            <Icon size={22} className='cursor-pointer' title='Xác nhận đã thanh toán' icon={'update-status'} onClick={() => acceptWarehouse(id)} />
          </DisplayControl>
          <RiFileExcel2Line title='Xuất file excel' size={20} className='cursor-pointer' onClick={() => importExcel(id)} />
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
    // {
    //   align: 'center',
    //   width: '10%',
    //   title: 'Nhà cung cấp',
    //   dataIndex: 'createDate',
    //   key: 'createDate',
    //   render: (createDate) => utils.formatTimeFromUnix(createDate, 'DD/MM/YYYY HH:mm:ss'),
    // },
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
        <div className='flex items-center gap-x-4 justify-center'>
          <Icon size={18} title='Chi tiết đơn nhập' className='cursor-pointer' icon={'info'} onClick={() => orderDetail(record)} />
          <RiFileExcel2Line title='Xuất file excel' size={20} className='cursor-pointer' onClick={() => exportExcel(id)} />
        </div>
      ),
    },
  ];

  const columns: any = [
    {
      width: '10%',
      align: 'center',
      title: 'Tên sản phẩm',
      dataIndex: 'productList',
      key: 'productList',
      render: (productList) => productList.name,
    },
    {
      width: '5%',
      align: 'center',
      title: 'Hình ảnh',
      dataIndex: 'productList',
      key: 'productList',
      render: (productList) => (
        <CustomImage width={70} height={70} className='object-contain' src={utils.baseUrlImage(productList.img)} preview={true} />
      ),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Giá bán (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: utils.formatCurrency,
      // render: (saleReceiptList, record) => (
      //   <div>
      //     <del className='mr-4'>{utils.formatCurrency(record.price)}</del>
      //     {utils.formatCurrency(
      //       new BigNumber(record.price)
      //         .times(100 - saleReceiptList.rankDiscount)
      //         .div(100)
      //         .toNumber()
      //     )}
      //   </div>
      // ),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: utils.formatCurrency,
    },
    {
      width: '10%',
      align: 'center',
      title: 'Thành tiền (VNĐ)',
      dataIndex: 'saleReceiptList',
      key: 'saleReceiptList',
      render: (saleReceiptList, record) => utils.formatCurrency(_active === '1' ? record.total : saleReceiptList.totalAfterSale),
    },
  ];

  const handleEdit = (record) => {
    open();
    getDataDetail(record.id);
    setIsEdit(true);
    setId(record.id);
  };

  const acceptWarehouse = (id) => {
    warehoseOpen();
    setId(id);
  };

  const orderDetail = (record) => {
    detailOpen();
    setId(record.id);
    getDataDetail(record.id);
  };

  const handleAcceptWarehouse = () => {
    _form
      .validateFields()
      .then((values) => {
        dispatch(
          actions.actionAcceptImportWarehouse({
            params: { timePay: dayjs(values.timePay).unix(), id: _id },
            callbacks: {
              onSuccess() {
                openNotification({
                  description: 'Xác nhận phiếu nhập kho hàng đã thanh toán thành công',
                  type: 'success',
                });
                getData();
                handleCancelWarehouse();
              },
            },
          })
        );
      })
      .catch(console.log);
  };

  const handleCancelWarehouse = () => {
    _form.resetFields();
    warehoseClose();
  };

  const renderDiscount = () => {
    return new BigNumber(_detail.receipt?.total).times(_detail.receipt?.rankDiscount).div(100).toNumber();
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
            onChange: (page) => getData({ current: page }),
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
            onChange: (page) => getData({ current: page }),
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
    const date = values ? [dayjs(values[0]).unix(), dayjs(values[1]).unix()] : [];
    setDate(date);
    getData({ date });
  };

  const onChange = ({ key = '1' }) => {
    setActive(key);
    getData({ key });
  };

  const handleClose = () => {
    warehoseClose();
    _form.resetFields();
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
            <DisplayControl path='warehouse/import' action='post'>
              <Button
                type='primary'
                className='ml-4'
                onClick={() => {
                  open();
                  setIsEdit(false);
                }}
              >
                Thêm phiếu nhập
              </Button>
            </DisplayControl>
          </>
        }
      />
      <Modal width={400} onOk={handleAcceptWarehouse} title='Xác nhận đã thanh toán' onCancel={handleClose} open={warehoseIsOpen}>
        <Form labelWrap className='mt-4' labelAlign='left' form={_form}>
          <Form.Item label='Ngày thanh toán' name='timePay' rules={[{ required: true }]}>
            <DatePicker format={'DD/MM/YYYY HH:mm:ss'} disabledDate={(current) => current && current > dayjs().endOf('day')} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        width={800}
        footer={null}
        onOk={handleAcceptWarehouse}
        title={_active === '1' ? 'Chi tiết phiếu nhập' : `Chi tiết phiếu xuất ${_id}`}
        onCancel={() => {
          setDetail([]);
          detailClose();
        }}
        open={detailIsOpen}
        bodyStyle={{
          padding: 10,
          textAlign: 'right',
        }}
      >
        <Table
          bordered
          rowKey={'id'}
          dataSource={_detail.data}
          columns={columns}
          pagination={{
            pageSize: DEFAULT_SMALL_PAGE_SIZE,
            hideOnSinglePage: true,
          }}
        />
        {_active === '2' && (
          <div className='inline-grid grid-cols-auto gap-x-4 gap-y-2 text-gray-800 text-right items-center mt-4'>
            <div className=''>Tổng tiền hàng:</div>
            <span className='text-base'>{utils.formatCurrency(_detail.receipt?.total)} VNĐ</span>
            <div className=''>Phí vận chuyển:</div>
            <span className='text-base'>{utils.formatCurrency(_detail.receipt?.feeShipping)} VNĐ</span>
            {_detail.receipt?.rankDiscount > 0 && (
              <>
                <div>Giảm giá {`( -${_detail.receipt?.rankDiscount}%)`}</div>
                <span className='text-black text-base'>- {utils.formatCurrency(renderDiscount())} VNĐ</span>
              </>
            )}
            <div className=''>Tổng thanh toán: </div>
            <div>
              <span className='text-2xl text-primary'>{utils.formatCurrency(_detail.receipt?.totalAfterSale)}</span> VNĐ
            </div>
          </div>
        )}
      </Modal>
      <AddOrderEntryForm
        id={_id}
        provider={_provider}
        detail={_detail.data}
        getDataWarehouse={getData}
        isOpen={isOpen}
        close={close}
        isEdit={_isEdit}
      />
    </>
  );
}
