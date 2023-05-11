import { Avatar, Button, DatePicker, Descriptions, Form, Input, InputNumber, Modal, Select, Space, Switch, Table } from 'antd';
import BigNumber from 'bignumber.js';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
import DisplayControl from 'components/DisplayControl';
import { info } from 'console';
import consts, { DEFAULT_PAGE_SIZE, DEFAULT_SMALL_PAGE_SIZE } from 'consts';
import dayjs from 'dayjs';
import useToggle from 'hooks/useToggle';
import Icon from 'icon-icomoon';
import React, { useEffect, useState } from 'react';
import actions from 'redux/actions/account';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { useImmer } from 'use-immer';

import _ from 'lodash';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export default function Profile() {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.accountReducer);
  const { isOpen, close, open } = useToggle();
  const [_form] = Form.useForm();
  const [_info, setInfo] = useState<any>({});

  const getData = () => {
    dispatch(
      actions.actionGetAdminById({
        params: {
          id: profile.id,
        },
        callbacks: {
          onSuccess({ data }) {
            setInfo(data);
          },
        },
      })
    );
  };

  useEffect(() => {
    getData();
  }, []);

  const handleOk = () => {
    _form
      .validateFields()
      .then((values) => {
        dispatch(
          actions['actionUpdateAdminInfo']({
            params: {
              ...values,
              id: profile.id,
            },
            callbacks: {
              onSuccess(data) {
                openNotification({
                  description: 'Sửa thông tin cá nhân thành công',
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
    close();
  };

  return (
    <div className='bg-white p-4 rounded-xl'>
      <Descriptions
        title='Thông tin cá nhân'
        extra={
          <DisplayControl action='put' path='account/:id'>
            <Button
              className='mb-3'
              onClick={() => {
                open();
                _form.setFieldsValue(_info);
              }}
              type='primary'
            >
              Sửa thông tin
            </Button>
          </DisplayControl>
        }
      >
        <Descriptions.Item label='Tên đăng nhập'>{_info.userName}</Descriptions.Item>
        <Descriptions.Item label='Tên'>{_info.name}</Descriptions.Item>
        <Descriptions.Item label='Số điện thoại'>{_info.phone}</Descriptions.Item>
        <Descriptions.Item label='Giới tính'>{consts.gender[_info.sex]}</Descriptions.Item>
        <Descriptions.Item label='Địa chỉ'>{_info.address}</Descriptions.Item>
        <Descriptions.Item label='Email'>{_info.email}</Descriptions.Item>
        <Descriptions.Item label='Trạng thái'>{_info.status === 1 ? 'Chưa kích hoạt' : 'Đang kích hoat'}</Descriptions.Item>
      </Descriptions>
      <Modal width={600} onOk={handleOk} title={`Cập nhật thông tin cá nhân`} onCancel={handleClose} open={isOpen}>
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
