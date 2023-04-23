import { Button, Form, Input, InputNumber, Modal, Select, Space, Switch, Table } from 'antd';
import BigNumber from 'bignumber.js';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
import consts, { DEFAULT_PAGE_SIZE, DEFAULT_SMALL_PAGE_SIZE } from 'consts';
import useToggle from 'hooks/useToggle';
import Icon from 'icon-icomoon';
import React, { useEffect, useState } from 'react';
import actions from 'redux/actions/customer';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { useImmer } from 'use-immer';

import _ from 'lodash';

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

const MALE = 0,
  FEMALE = 1,
  OTHER = 2;

const gender = {
  [MALE]: 'Nam',
  [FEMALE]: 'Nữ',
  [OTHER]: 'Khác',
};

type CustomerType = {
  data: any[];
  current: number;
  total: number;
};

export default function Customer() {
  const dispatch = useAppDispatch();
  const { isOpen, close, open } = useToggle();
  const [_form] = Form.useForm();
  const [_customerStatics, setCustomerStatics] = useState<any>({});
  const [_customer, setCustomer] = useImmer<CustomerType>({
    data: [],
    current: 1,
    total: 0,
  });
  const [_address, setAddres] = useState<any>({});

  const getData = ({ current = _customer.current } = {}) => {
    dispatch(
      actions.actionGetCustomer({
        callbacks: {
          onSuccess({ data, total }) {
            setCustomer((draft) => {
              draft.data = data;
            });
          },
        },
      })
    );
    dispatch(
      actions.actionGetCustomerStatics({
        params: {
          current,
          count: DEFAULT_PAGE_SIZE,
        },
        callbacks: {
          onSuccess({ data, total }) {
            setCustomerStatics(data);
          },
        },
      })
    );
  };

  const activeUser = (id, active) => {
    dispatch(
      actions.actionUpdateCustomerStatus({
        params: {
          id,
          active,
        },
        callbacks: {
          onSuccess({ data, total }) {
            openNotification({
              description: 'Cập nhập trạng thái người dùng thành công',
              type: 'success',
            });
            getData();
          },
        },
      })
    );
  };

  useEffect(() => {
    getData();
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
      width: '10%',
      align: 'center',
      title: 'Tên khách hàng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Giới tính',
      dataIndex: 'sex',
      key: 'sex',
      render: (sex) => gender[sex],
    },
    {
      width: '10%',
      align: 'center',
      title: 'Phân hạng',
      dataIndex: 'rankList',
      key: 'rankList',
      render: (rankList) => rankList.name,
    },
    {
      width: '10%',
      align: 'center',
      title: 'Tổng chi tiêu',
      dataIndex: 'totalBuy',
      key: 'totalBuy',
      render: utils.formatCurrency,
    },
    {
      width: '10%',
      align: 'center',
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => <Switch checked={status === 0} onChange={(checked) => activeUser(record.id, checked ? 0 : 1)} />,
    },
    {
      width: '5%',
      align: 'center',
      title: 'Hành động',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Icon size={18} title='Chi tiết đơn nhập' className='cursor-pointer' icon={'info'} onClick={() => openAddress(id)} />,
    },
  ];

  const columnsAddress: any = [
    {
      width: '10%',
      align: 'center',
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      width: '30%',
      align: 'center',
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const openAddress = (id) => {
    open();
    dispatch(
      actions.actionGetCustomerAddress({
        params: {
          id,
        },
        callbacks: {
          onSuccess({ data }) {
            setAddres(data);
          },
        },
      })
    );
  };

  return (
    <>
      <div className='flex gap-x-10 items-center m-auto mb-4'>
        <div className='flex border justify-between bg-white p-4 rounded-xl w-80'>
          <div className='flex flex-col gap-y-1'>
            <div className='text-base font-semibold flex-1'>Tổng tài khoản</div>
            <div className='text-gray-600'>Hiện tại</div>
            <div className='text-2xl'>{_customerStatics.total}</div>
          </div>
          <img title='Sản phẩm cung cấp' width={100} src='/images/group.svg' />
        </div>
        <div className='flex border justify-between bg-white p-4 rounded-xl w-80'>
          <div className='flex flex-col gap-y-1'>
            <div className='text-base font-semibold flex-1'>Tổng tài khoản ở trạng thái hoạt động</div>
            <div className='text-gray-600'>Hiện tại</div>
            <div className='text-2xl'>{_customerStatics.totalActive}</div>
          </div>
          <img title='Sản phẩm cung cấp' width={100} src='/images/group_active.svg' />
        </div>
      </div>
      <Table bordered rowKey={'id'} dataSource={_customer.data} columns={columns} pagination={{ hideOnSinglePage: true }} />
      <Modal width={800} footer={null} title='Địa chỉ người dùng' onCancel={close} open={isOpen}>
        <Table bordered rowKey={'id'} dataSource={_address} columns={columnsAddress} pagination={{ hideOnSinglePage: true }} />
      </Modal>
    </>
  );
}
