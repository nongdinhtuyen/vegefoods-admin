import { Avatar, Button, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Switch, Table } from 'antd';
import BigNumber from 'bignumber.js';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
import DisplayControl from 'components/DisplayControl';
import consts, { DEFAULT_PAGE_SIZE, DEFAULT_SMALL_PAGE_SIZE } from 'consts';
import dayjs from 'dayjs';
import useToggle from 'hooks/useToggle';
import Icon from 'icon-icomoon';
import React, { useEffect, useState } from 'react';
import actions from 'redux/actions/account';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { useImmer } from 'use-immer';

import _ from 'lodash';

const MALE = 0,
  FEMALE = 1,
  OTHER = 2;

const gender = {
  [MALE]: 'Nam',
  [FEMALE]: 'Nữ',
  [OTHER]: 'Khác',
};

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export default function Admin() {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.accountReducer);
  const { isOpen, close, open } = useToggle();
  const [_form] = Form.useForm();
  const [_data, setData] = useImmer({
    current: 1,
    data: [],
    total: 0,
  });
  const [_product, setProduct] = useState();
  const [_id, setId] = useState('');

  const getData = ({ current = _data.current } = {}) => {
    dispatch(
      actions.actionGetAccount({
        params: {
          current,
          count: DEFAULT_PAGE_SIZE,
        },
        callbacks: {
          onSuccess({ data, total }) {
            setData((draft) => {
              draft.data = data;
              draft.total = total;
            });
          },
        },
      })
    );
  };

  const activeAdmin = (id, active) => {
    dispatch(
      actions.actionUpdateAdminStatus({
        params: {
          id,
          status: active,
        },
        callbacks: {
          onSuccess({ data, total }) {
            openNotification({
              description: 'Cập nhập trạng thái người admin thành công',
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
      title: 'Tên đăng nhập',
      dataIndex: 'userName',
      key: 'userName',
    },
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      // render: (status) => (status === 0 ? 'Đang hoạt động' : 'Chưa kích hoạt'),
      render: (status, record) => (
        <DisplayControl path='account/:id/status' action='put' render={status === 1 ? 'Chưa kích hoạt' : 'Đã kích hoạt'}>
          <Switch checked={status === 0} onChange={(checked) => activeAdmin(record.id, checked ? 0 : 1)} />
        </DisplayControl>
      ),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Hành động',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) =>
        profile.id == id && (
          <DisplayControl action='put' path='account/:id'>
            <Icon
              size={22}
              title='Sửa dơn hàng'
              className='cursor-pointer'
              onClick={() => {
                open();
                setId(record.id);
                _form.setFieldsValue({
                  ...record,
                  time: [dayjs(record.startDate * 1000), dayjs(record.endDate * 1000)],
                });
              }}
              icon={'edit'}
            />
          </DisplayControl>
        ),
    },
  ];

  const handleOk = () => {
    const action = _id ? 'actionUpdateAdminInfo' : 'actionCreateAdmin';
    _form
      .validateFields()
      .then((values) => {
        dispatch(
          actions[action]({
            params: {
              ...values,
              id: _id,
            },
            callbacks: {
              onSuccess(data) {
                openNotification({
                  description: _id ? 'Sửa admin thành công' : 'Thêm admin thành công',
                  type: 'success',
                });
                getData();
                handleClose();
              },
            },
          })
        );
      })
      .catch(console.log);
  };

  const handleClose = () => {
    _form.resetFields();
    close();
    setId('');
  };

  return (
    <div className='text-right'>
      <DisplayControl action='post' path='account'>
        <Button
          className='mb-3'
          onClick={() => {
            open();
          }}
          type='primary'
        >
          Thêm quản trị viên
        </Button>
      </DisplayControl>
      <Table
        bordered
        rowKey={'id'}
        dataSource={_data.data}
        columns={columns}
        pagination={{
          onChange: (page) => getData({ current: page }),
          showSizeChanger: false,
          current: _data.current,
          pageSize: DEFAULT_SMALL_PAGE_SIZE,
          total: _data.total,
          hideOnSinglePage: true,
        }}
      />
      <Modal width={600} onOk={handleOk} title={`${_id ? 'Cập nhật thông tin admin' : 'Thêm mới admin'}`} onCancel={handleClose} open={isOpen}>
        <Form {...layout} name='basic' className='m-auto' form={_form}>
          <Form.Item
            name='userName'
            label='Tên đăng nhập'
            rules={[
              {
                required: true,
                message: 'Tên đăng nhập không được để trống',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Email'
            name='email'
            rules={[
              {
                required: true,
                message: 'Email không được để trống',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='name'
            label='Họ và tên'
            rules={[
              {
                required: true,
                message: 'Tên không được để trống',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Giới tính'
            rules={[
              {
                required: true,
                message: 'Giới tính không được để trống',
              },
            ]}
            name='sex'
          >
            <Select
              className='text-left'
              options={[
                { value: 0, label: 'Nam' },
                { value: 1, label: 'Nữ' },
                { value: 2, label: 'Khác' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name='phone'
            label='Số điện thoại'
            rules={[
              {
                required: true,
                message: 'Số điện thoại không được để trống',
              },
              {
                type: 'number',
                message: 'Số điện thoại không hợp lệ',
                transform: (value) => _.toNumber(value),
              },
            ]}
          >
            <Input type='number' />
          </Form.Item>
          <Form.Item
            name='address'
            label='Địa chỉ'
            rules={[
              {
                required: true,
                message: 'Địa chỉ không được để trống',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
