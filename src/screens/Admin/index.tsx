import { Avatar, Button, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Switch, Table } from 'antd';
import BigNumber from 'bignumber.js';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
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
      render: (status) => (status === 0 ? 'Đang hoạt động' : 'Chưa kích hoạt'),
      // render: (status, record) => <Switch checked={status === 0} onChange={(checked) => activeUser(record.id, checked ? 0 : 1)} />,
    },
    {
      width: '10%',
      align: 'center',
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
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
      ),
    },
  ];

  const handleOk = () => {
    _form
      .validateFields()
      .then((values) => {
        const [startDate, endDate] = [dayjs(values.time[0]).unix(), dayjs(values.time[1]).unix()];
        const action = _id ? 'actionUpdatePromotion' : 'actionCreatePromotion';
        dispatch(
          actions[action]({
            params: {
              ...values,
              startDate,
              endDate,
              id: _id,
            },
            callbacks: {
              onSuccess(data) {
                openNotification({
                  description: _id ? 'Sửa khuyến mại cho sản phẩm thành công' : 'Thêm khuyến mại cho sản phẩm thành công',
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
  };

  return (
    <div className='text-right'>
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
      <Modal width={700} onOk={() => handleOk()} title={'Cập nhật thông tin'} onCancel={handleClose} open={isOpen}>
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
            <Input disabled />
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
            <Input placeholder='Email' />
          </Form.Item>
          <Form.Item
            name='name'
            label='Tên'
            rules={[
              {
                required: true,
                message: 'Tên không được để trống',
              },
            ]}
          >
            <Input placeholder='Họ và tên' />
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
              placeholder='Giới tính'
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
            <Input placeholder='Địa chỉ' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
