import { Modal, Select, Space, Table } from 'antd';
import utils from 'common/utils';
import consts, { DEFAULT_PAGE_SIZE } from 'consts';
import useToggle from 'hooks/useToggle';
import Icon from 'icon-icomoon';
import React, { useEffect, useState } from 'react';
import actions from 'redux/actions/receipt';
import { useAppDispatch } from 'redux/store';
import styled from 'styled-components';
import { useImmer } from 'use-immer';

import _ from 'lodash';

// const ReceiptWrapper = styled.div`
//   .ant-table-thead {
//     .ant-table-cell {
//       text-align: center !important;
//     }
//   }
// `;

export default function Receipt() {
  const dispatch = useAppDispatch();
  const [_receipt, setReceipt] = useImmer({
    total: 0,
    current: 1,
    data: [],
    typeStatus: '-1',
  });
  const { open, close, isOpen } = useToggle();
  const [_item, setItem] = useState<any>({});

  const getData = ({ current = _receipt.current, typeStatus = _receipt.typeStatus } = {}) => {
    setReceipt((draft) => {
      draft.current = current;
    });
    dispatch(
      actions.actionGetReceipt({
        params: { current, typeStatus, count: DEFAULT_PAGE_SIZE },
        callbacks: {
          onSuccess({ data, total }) {
            setReceipt((draft) => {
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
      dataIndex: 'Salereceipt',
      key: 'Salereceipt',
      render: (Salereceipt) => Salereceipt.id,
    },
    {
      width: '5%',
      align: 'center',
      title: 'Tên danh mục',
      dataIndex: 'Salereceipt',
      key: 'Salereceipt',
      render: (Salereceipt) => Salereceipt.id,
    },
    {
      width: '10%',
      title: 'Tổng sản phẩm',
      dataIndex: 'Salereceipt',
      key: 'Salereceipt',
      render: (Salereceipt, record) => (
        <div
          className='text-[#1677ff] cursor-pointer'
          onClick={() => {
            open();
            setItem(record);
          }}
        >
          {Salereceipt.nameReceiver}
        </div>
      ),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Hành động',
      dataIndex: 'Salereceipt',
      key: 'Salereceipt',
      render: (Salereceipt) => <div></div>,
    },
  ];

  return (
    <div>
      <Select
        options={[
          { label: 'Tất cả', value: '-1' },
          ..._.map(consts.PRODUCT_STATUS_STRING, (value, key) => ({
            value: key,
            label: value,
          })),
        ]}
        value={_receipt.typeStatus}
        className='mb-3 w-52'
        onSelect={(value: any) => {
          setReceipt((draft) => {
            draft.typeStatus = value;
          });
          getData({ typeStatus: value, current: 1 });
        }}
      />
      <Table
        bordered
        dataSource={_receipt.data}
        columns={columns}
        pagination={{
          onChange: (page) => getData({ current: page }),
          showSizeChanger: false,
          current: _receipt.current,
          pageSize: DEFAULT_PAGE_SIZE,
          total: _receipt.total,
          hideOnSinglePage: true,
        }}
      />
    </div>
  );
}
