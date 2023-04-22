import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Input, Modal, Select, Space, Table } from 'antd';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
import consts, { DEFAULT_SMALL_PAGE_SIZE } from 'consts';
import useToggle from 'hooks/useToggle';
import Icon from 'icon-icomoon';
import React, { useEffect, useState } from 'react';
import actions from 'redux/actions/rank';
import { useAppDispatch, useAppSelector } from 'redux/store';

import _ from 'lodash';

export default function Rank() {
  const dispatch = useAppDispatch();
  const [_rank, setRank] = useState([]);
  const { isOpen, close, open } = useToggle();

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
        <div className='flex items-center gap-x-5 justify-center'>
          <Icon
            size={22}
            title='Sửa phân hạng'
            className='cursor-pointer'
            onClick={() => {
              // openUpdate();
              // setItem(record);
            }}
            icon={'edit'}
          />
          <Icon
            size={22}
            title='Xóa phân hạng'
            className='cursor-pointer'
            onClick={() => {
              showConfirm(record.id);
            }}
            icon={'delete'}
          />
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
        // actions.actionDeleteProvider({
        //   params: { id: _id },
        //   callbacks: {
        //     onSuccess({ data, total }) {
        //       getData();
        //       handleCancel();
        //     },
        //   },
        // })
        // );
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  return <Table bordered rowKey={'id'} dataSource={_rank} columns={columns} pagination={{ hideOnSinglePage: true }} />;
}
