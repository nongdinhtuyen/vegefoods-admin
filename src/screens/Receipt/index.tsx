import { Modal, Select, Space, Table } from 'antd';
import utils from 'common/utils';
import consts, { DEFAULT_PAGE_SIZE } from 'consts';
import useToggle from 'hooks/useToggle';
import Icon from 'icon-icomoon';
import React, { useEffect, useState } from 'react';
import actions from 'redux/actions/receipt';
import { useAppDispatch } from 'redux/store';
import ProductDetail from 'screens/ProductDetail';
import styled from 'styled-components';
import { useImmer } from 'use-immer';

import _ from 'lodash';

const ReceiptWrapper = styled.div`
  .ant-table-thead {
    .ant-table-cell {
      text-align: center !important;
    }
  }
`;

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

  const handleAction = (action, id, status) => {
    dispatch(
      action({
        params: {
          status,
          id,
        },
        callbacks: {
          onSuccess(data) {
            getData();
          },
        },
      })
    );
  };

  const handleOrder = (id, status) => {
    handleAction(actions.actionReceiptOrder, id, status);
  };

  const handleFinancial = (id, status) => {
    handleAction(actions.actionReceiptFinancial, id, status);
  };

  const handleWarehouse = (id, status) => {
    handleAction(actions.actionReceiptWarehouse, id, status);
  };

  const renderActions = (Salereceipt: any) => {
    const newAction = [];
    return (
      <div className='flex flex-wrap gap-x-4 gap-y-1 items-center justify-center'>
        {Salereceipt.status === 0 && (
          <>
            <Icon title='Phê duyệt' size={22} className='cursor-pointer' onClick={() => handleOrder(Salereceipt.id, 1)} icon={'accept'} />
            <Icon size={22} className='cursor-pointer' icon={'edit'} />
            <Icon title='Hủy đơn hàng' size={22} className='cursor-pointer' onClick={() => handleOrder(Salereceipt.id, 6)} icon={'cancel'} />
          </>
        )}
        {Salereceipt.status === 1 && (
          <Icon title='Yêu cầu xuất kho' size={22} className='cursor-pointer' onClick={() => handleFinancial(Salereceipt.id, 2)} icon={'tag'} />
        )}
        {Salereceipt.status === 2 && (
          <Icon title='Xác nhận xuất kho' size={30} className='cursor-pointer' onClick={() => handleWarehouse(Salereceipt.id, 3)} icon={'ship'} />
        )}
        {Salereceipt.status === 5 && (
          <Icon
            title='Xác nhận hủy'
            size={30}
            className='cursor-pointer'
            onClick={() => handleWarehouse(Salereceipt.id, 3)}
            icon={'watting-cancel'}
          />
        )}
        {Salereceipt.status === 3 && (
          <>
            <img
              title='Giao hàng thành công'
              className='cursor-pointer'
              onClick={() => handleWarehouse(Salereceipt.id, 4)}
              src='/images/accept_file.svg'
            />
            <img
              title='Giao hàng thất bại'
              className='cursor-pointer'
              onClick={() => handleWarehouse(Salereceipt.id, 6)}
              src='/images/cancel_file.svg'
            />
          </>
        )}
      </div>
    );
  };

  const columns: any = [
    {
      width: '5%',
      align: 'center',
      title: 'Id',
      dataIndex: 'Salereceipt',
      key: 'Salereceipt',
      render: (Salereceipt) => Salereceipt.id,
    },
    {
      width: '10%',
      title: 'Tên người nhận',
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
          {Salereceipt.addressList.name}
        </div>
      ),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Số điện thoại',
      dataIndex: 'Salereceipt',
      key: 'Salereceipt',
      render: (Salereceipt) => Salereceipt.addressList.phone,
    },
    {
      width: '10%',
      title: 'Địa chỉ',
      dataIndex: 'Salereceipt',
      key: 'Salereceipt',
      render: (Salereceipt) => Salereceipt.addressList.address,
    },
    {
      width: '10%',
      align: 'center',
      title: 'Thời gian đặt hàng',
      dataIndex: 'Salereceipt',
      key: 'Salereceipt',
      render: (Salereceipt) => utils.formatTimeFromUnix(Salereceipt.createAt, 'DD/MM/YYYY HH:mm:ss'),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Hình thức thanh toán',
      dataIndex: 'Salereceipt',
      key: 'Salereceipt',
      render: (Salereceipt) => (Salereceipt.typePayment === consts.TYPE_PAYMENT_OCD ? 'Thanh toán COD' : 'Thanh toán online'),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Trạng thái đơn hàng',
      dataIndex: 'Salereceipt',
      key: 'Salereceipt',
      render: (Salereceipt: any) => consts.PRODUCT_STATUS_STRING[Salereceipt.status],
    },
    {
      width: '20%',
      title: 'Chi tiết',
      dataIndex: 'Infosalereceipt',
      key: 'Infosalereceipt',
      render: (Infosalereceipt) =>
        _.map(Infosalereceipt, (item) => (
          <div>
            {item.productList.name}: {item.quantity}
          </div>
        )),
    },
    {
      width: '20%',
      align: 'center',
      title: 'Hành động',
      dataIndex: 'Salereceipt',
      key: 'Salereceipt',
      render: (Salereceipt) => renderActions(Salereceipt),
    },
  ];

  return (
    <ReceiptWrapper>
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
      <Modal
        title={<div className='text-2xl text-center'>Chi tiết đơn hàng</div>}
        footer={null}
        onCancel={close}
        open={isOpen}
        width={748}
        okText='Xác nhận'
        cancelText='Hủy'
        className='top-10'
      >
        <ProductDetail product={_item} />
      </Modal>
    </ReceiptWrapper>
  );
}
