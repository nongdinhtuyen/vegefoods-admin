import { Modal, Select, Space, Table } from 'antd';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import consts, { DEFAULT_PAGE_SIZE } from 'consts';
import useToggle from 'hooks/useToggle';
import Icon from 'icon-icomoon';
import React, { useEffect, useState } from 'react';
import actions from 'redux/actions/receipt';
import { useAppDispatch } from 'redux/store';
import ReceiptDetail from 'screens/Bills/BillDetail';
import styled from 'styled-components';
import { useImmer } from 'use-immer';

import classNames from 'classnames';
import _ from 'lodash';

const ReceiptWrapper = styled.div`
  .ant-table-thead {
    .ant-table-cell {
      text-align: center !important;
    }
  }
  .disable {
    color: #00000040;
    cursor: not-allowed;
    path {
      fill: currentColor;
    }
  }
`;

export default function Bills() {
  const dispatch = useAppDispatch();
  const [_receipt, setReceipt] = useImmer({
    total: 0,
    current: 1,
    data: [{}],
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

  const handleAction = (action, id, status, text) => {
    dispatch(
      action({
        params: {
          status,
          id,
        },
        callbacks: {
          onSuccess(data) {
            openNotification({
              description: text,
              type: 'success',
            });
            getData();
          },
        },
      })
    );
  };

  const handleOrder = (Salereceipt, status, text) => {
    if (Salereceipt.typePayment === consts.TYPE_PAYMENT_COD) {
      handleAction(actions.actionReceiptOrder, Salereceipt.id, status, text);
    }
  };

  const handleFinancial = (id, status, text) => {
    handleAction(actions.actionReceiptFinancial, id, status, text);
  };

  const handleWarehouse = (id, status, text) => {
    handleAction(actions.actionReceiptWarehouse, id, status, text);
  };

  const handleClassName = (Salereceipt, name = 'cus') => {
    return classNames(name, Salereceipt.typePayment === consts.TYPE_PAYMENT_COD ? 'cursor-pointer' : 'disable');
  };

  const renderActions = (Salereceipt: any) => {
    return (
      <div className='flex flex-wrap gap-x-4 gap-y-1 items-center justify-center'>
        {Salereceipt?.status === 0 && (
          <>
            <Icon
              title='Phê duyệt'
              size={22}
              className={handleClassName(Salereceipt)}
              onClick={() => handleOrder(Salereceipt, 1, 'Phê duyệt đơn hàng thành công')}
              icon={'accept'}
            />

            <Icon size={22} className={handleClassName(Salereceipt)} icon={'edit'} />
            <Icon
              title='Hủy đơn hàng'
              size={22}
              className={handleClassName(Salereceipt)}
              onClick={() => handleOrder(Salereceipt, 6, 'Hủy đơn hàng thành công')}
              icon={'cancel'}
            />
          </>
        )}
        {Salereceipt?.status === 1 && (
          <Icon
            title='Yêu cầu xuất kho'
            size={22}
            className='cursor-pointer'
            onClick={() => handleFinancial(Salereceipt?.id, 2, 'Yêu cầu xuất kho thành công')}
            icon={'tag'}
          />
        )}
        {Salereceipt?.status === 2 && (
          <Icon
            title='Xác nhận xuất kho'
            size={30}
            className='cursor-pointer'
            onClick={() => handleWarehouse(Salereceipt?.id, 3, 'Xác nhận xuất kho')}
            icon={'ship'}
          />
        )}
        {Salereceipt?.status === 5 && (
          <Icon
            title='Xác nhận hủy'
            size={30}
            className='cursor-pointer'
            onClick={() => handleWarehouse(Salereceipt?.id, 3, 'Hủy đơn hàng thành công')}
            icon={'waiting-cancel'}
          />
        )}
        {Salereceipt?.status === 3 && (
          <>
            <img
              title='Giao hàng thành công'
              height={23}
              className='cursor-pointer'
              onClick={() => handleWarehouse(Salereceipt?.id, 4, 'Xác nhận giao hàng thành công')}
              src='/images/accept_file.svg'
            />
            <img
              title='Giao hàng thất bại'
              height={23}
              className='cursor-pointer'
              onClick={() => handleWarehouse(Salereceipt?.id, 6, 'Xác nhận giao hàng thất bại')}
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
      render: (Salereceipt) => Salereceipt?.id,
    },
    {
      width: '10%',
      title: 'Tên người nhận',
      dataIndex: 'Salereceipt',
      key: 'Salereceipt',
      render: (Salereceipt, record) => (
        <div
          className='text-[#1677ff] cursor-pointer text-center'
          onClick={() => {
            open();
            setItem(record);
          }}
        >
          {Salereceipt?.nameReceiver}
        </div>
      ),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Số điện thoại',
      dataIndex: 'Salereceipt',
      key: 'Salereceipt',
      render: (Salereceipt) => Salereceipt?.phoneReceiver,
    },
    {
      width: '10%',
      title: 'Địa chỉ',
      dataIndex: 'Salereceipt',
      key: 'Salereceipt',
      render: (Salereceipt) => Salereceipt?.addressReceiver,
    },
    {
      width: '10%',
      align: 'center',
      title: 'Thời gian đặt hàng',
      dataIndex: 'Salereceipt',
      key: 'Salereceipt',
      render: (Salereceipt) => utils.formatTimeFromUnix(Salereceipt?.createDate, 'DD/MM/YYYY HH:mm:ss'),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Hình thức thanh toán',
      dataIndex: 'Salereceipt',
      key: 'Salereceipt',
      render: (Salereceipt) => (Salereceipt?.typePayment === consts.TYPE_PAYMENT_COD ? 'Thanh toán COD' : 'Thanh toán online'),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Trạng thái đơn hàng',
      dataIndex: 'Salereceipt',
      key: 'Salereceipt',
      render: (Salereceipt: any) => consts.PRODUCT_STATUS_STRING[Salereceipt?.status],
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
        <ReceiptDetail product={_item} />
      </Modal>
      <Modal
        title={<div className='text-2xl text-center'>Sửa hóa đơn</div>}
        footer={null}
        onCancel={close}
        open={isOpen}
        width={748}
        okText='Xác nhận'
        cancelText='Hủy'
        className='top-10'
      >
        <ReceiptDetail product={_item} />
      </Modal>
    </ReceiptWrapper>
  );
}
