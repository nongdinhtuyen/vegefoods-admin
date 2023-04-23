import { Button, Form, Input, InputNumber, Modal, Select, Space, Table } from 'antd';
import BigNumber from 'bignumber.js';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
import consts, { DEFAULT_SMALL_PAGE_SIZE } from 'consts';
import useToggle from 'hooks/useToggle';
import Icon from 'icon-icomoon';
import React, { useEffect, useState } from 'react';
import actions from 'redux/actions/rank';
import { useAppDispatch, useAppSelector } from 'redux/store';

import _ from 'lodash';

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

type typeRank = {
  id: number;
  name: string;
  totalSpend: number;
  discount: number;
};

export default function Rank() {
  const dispatch = useAppDispatch();
  const [_rank, setRank] = useState<typeRank[]>([]);
  const { isOpen, close, open } = useToggle();
  const [_form] = Form.useForm();
  const [_detail, setDetail] = useState<typeRank>({
    id: 0,
    name: '',
    totalSpend: 0,
    discount: 0,
  });

  const getData = () => {
    dispatch(
      actions.actionGetRank({
        callbacks: {
          onSuccess({ data, total }) {
            setRank(data);
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
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Chỉ tiêu',
      dataIndex: 'totalSpend',
      key: 'totalSpend',
      render: (totalSpend) => `> ${utils.formatCurrency(totalSpend)} VNĐ`,
    },
    {
      width: '10%',
      align: 'center',
      title: 'Giảm giá',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount) => `${discount} %`,
    },
    {
      width: '5%',
      align: 'center',
      title: 'Hành động',
      dataIndex: 'products',
      key: 'action',
      render: (products, record) => (
        <Icon
          size={22}
          title='Sửa phân hạng'
          className='cursor-pointer'
          onClick={() => {
            open();
            setDetail(record);
            _form.setFieldsValue({
              total: record.totalSpend,
              discount: record.discount,
            });
          }}
          icon={'edit'}
        />
      ),
    },
  ];

  const handleValidate = (value: number) => {
    const previous = _rank[_detail.id - 2];
    const next = _rank[_detail.id];
    console.log('🚀 ~ file: index.tsx:113 ~ handleValidate ~ next:', next);
    if (previous?.totalSpend > value) {
      return Promise.reject(`Tổng chi tiêu không được nhỏ hơn ${utils.formatCurrency(previous.totalSpend)}`);
    }
    if (next?.totalSpend < value) {
      return Promise.reject(`Tổng chi tiêu không được lớn hơn ${utils.formatCurrency(next.totalSpend)}`);
    }
    return Promise.resolve();
  };

  const handleOk = () => {
    _form
      .validateFields()
      .then((values) => {
        dispatch(
          actions.actionUpdateRank({
            params: {
              ...values,
              id: _detail.id,
            },
            callbacks: {
              onSuccess(data) {
                openNotification({
                  description: 'Sửa phân hạng thành công',
                  type: 'success',
                });
                getData();
                close();
              },
            },
          })
        );
      })
      .catch(console.log);
  };

  return (
    <>
      <Table bordered rowKey={'id'} dataSource={_rank} columns={columns} pagination={{ hideOnSinglePage: true }} />
      <Modal width={400} onOk={handleOk} title='Sửa phân hạng' onCancel={close} open={isOpen}>
        <Form {...layout} labelWrap className='mt-4' labelAlign='left' form={_form}>
          <Form.Item
            label='Tổng chi tiêu'
            name='total'
            rules={[
              {
                validator(rule, value, callback) {
                  if (value) {
                    return handleValidate(value);
                  }
                  return Promise.reject(`Tổng chi tiêu không hợp lệ`);
                },
              },
            ]}
          >
            <InputNumber
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              min={0}
              parser={(value: any) => value!.replace(/\$\s?|(,*)/g, '')}
              addonAfter='VNĐ'
              className='w-full'
            />
          </Form.Item>
          <Form.Item label='Giảm giá đơn hàng' name='discount' rules={[{ required: true }]}>
            <InputNumber min={0} max={100} formatter={(value) => `${value}%`} parser={(value: any) => value!.replace('%', '')} className='w-full' />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
