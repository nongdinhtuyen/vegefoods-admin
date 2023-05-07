import PrintBill from './Print';
import UpdateBill from './UpdateBill';
import { Form, Input, Modal, Select, Space, Table } from 'antd';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import consts, { DEFAULT_PAGE_SIZE } from 'consts';
import useToggle from 'hooks/useToggle';
import Icon from 'icon-icomoon';
import React, { useEffect, useState } from 'react';
import { IoReceiptOutline } from 'react-icons/all';
import { useLocation } from 'react-router-dom';
import actions from 'redux/actions/receipt';
import { useAppDispatch } from 'redux/store';
import BillDetail from 'screens/Bills/BillDetail';
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
    uid: 0,
  });
  const location = useLocation();
  const { open, close, isOpen } = useToggle();
  const { open: openReject, close: closeReject, isOpen: isOpenReject } = useToggle();
  const { open: openReceipt, close: closeReceipt, isOpen: isOpenReceipt } = useToggle();
  const [_item, setItem] = useState<any>({});
  const [_id, setId] = useState(0);
  const [_updateItem, setUpdateItem] = useState({});
  const [_form] = Form.useForm();
  const [_printData, setPrintData] = useState({});
  const { open: openPrint, close: closePrint, isOpen: isPrint } = useToggle();

  const getData = ({ current = _receipt.current, typeStatus = _receipt.typeStatus, uid = _receipt.uid } = {}) => {
    setReceipt((draft) => {
      draft.current = current;
      draft.uid = uid;
    });
    dispatch(
      actions.actionGetReceipt({
        params: { current, typeStatus, count: DEFAULT_PAGE_SIZE, uid },
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
    console.log('🚀 ~ file: index.tsx:74 ~ useEffect ~ location.state:', location.state?.id);
    if (location.state?.id) {
      getData({ uid: location.state?.id });
    } else {
      getData({ uid: undefined });
    }
  }, [location]);

  const handleAction = (action, id, status, text, adminNote = '') => {
    dispatch(
      action({
        params: {
          status,
          id,
          adminNote,
        },
        callbacks: {
          onSuccess(data) {
            _form.resetFields();
            closeReject();
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
    if (status === 6) {
      openReject();
      return;
    }
    if (Salereceipt.typePayment === consts.TYPE_PAYMENT_COD) {
      handleAction(actions.actionReceiptOrder, Salereceipt.id, status, text);
    }
  };

  const handleFinancial = (id, status, text) => {
    handleAction(actions.actionReceiptFinancial, id, status, text);
  };

  const handleWarehouse = (Salereceipt, status, text) => {
    if (_.includes([6], status)) {
      openReject();
      return;
    }
    handleAction(actions.actionReceiptWarehouse, Salereceipt.id, status, text);
  };

  const handleClassName = (Salereceipt, name = 'cus') => {
    return classNames(name, Salereceipt.typePayment === consts.TYPE_PAYMENT_COD ? 'cursor-pointer' : 'disable');
  };

  const renderActions = (record, Salereceipt: any, Infosalereceipt: any) => {
    return (
      <div className='flex flex-wrap gap-x-4 gap-y-1 items-center justify-center'>
        {Salereceipt?.status === 0 && (
          <>
            <Icon
              title='Phê duyệt đơn hàng'
              size={22}
              className={handleClassName(Salereceipt)}
              onClick={() => handleOrder(Salereceipt, 1, 'Phê duyệt đơn hàng thành công')}
              icon={'accept'}
            />

            <Icon
              size={22}
              title='Sửa đơn hàng'
              onClick={() => {
                openReceipt();
                setId(Salereceipt.id);
                setUpdateItem(Infosalereceipt);
              }}
              className={handleClassName(Salereceipt)}
              icon={'edit'}
            />
            <Icon
              title='Hủy đơn hàng'
              size={22}
              className={handleClassName(Salereceipt)}
              onClick={() => {
                handleOrder(Salereceipt, 6, 'Hủy đơn hàng thành công');
                setItem(record);
              }}
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
            onClick={() => handleWarehouse(Salereceipt, 3, 'Xác nhận xuất kho')}
            icon={'ship'}
          />
        )}
        {Salereceipt?.status === 5 && (
          <Icon
            title='Xác nhận hủy'
            size={30}
            className='cursor-pointer'
            onClick={() => {
              setItem(record);
              handleWarehouse(Salereceipt, 3, 'Hủy đơn hàng thành công');
            }}
            icon={'waiting-cancel'}
          />
        )}
        {Salereceipt?.status === 3 && (
          <>
            <img
              title='Giao hàng thành công'
              height={23}
              className='cursor-pointer'
              onClick={() => handleWarehouse(Salereceipt, 4, 'Xác nhận giao hàng thành công')}
              src='/images/accept_file.svg'
            />
            <img
              title='Giao hàng thất bại'
              height={23}
              className='cursor-pointer'
              onClick={() => {
                handleWarehouse(Salereceipt, 6, 'Xác nhận giao hàng thất bại');
                setItem(record);
              }}
              src='/images/cancel_file.svg'
            />
          </>
        )}
        {Salereceipt?.status === 4 && (
          <IoReceiptOutline size={24} title='Sổ người nhận' className='cursor-pointer' onClick={() => printReceipt(record)} />
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
      render: (Salereceipt: any) => (
        <div>
          {consts.PRODUCT_STATUS_STRING[Salereceipt?.status]}
          <br />
          {Salereceipt?.adminNote ? `Lí do: ( ${Salereceipt.adminNote} )` : ''}
        </div>
      ),
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
      render: (Salereceipt: any, record) => <>{renderActions(record, Salereceipt, record.Infosalereceipt)}</>,
    },
  ];

  const printReceipt = (record) => {
    setPrintData(record);
    openPrint();
  };

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
        <BillDetail product={_item} />
      </Modal>
      <Modal
        title={<div className='text-2xl text-center'>{_item?.Salereceipt?.status === 6 ? 'Lí do giao hàng thất bại' : 'Lí do hủy đơn hàng'}</div>}
        onCancel={() => {
          _form.resetFields();
          closeReject();
        }}
        onOk={() => {
          _form.validateFields().then((value) => {
            if (_item.Salereceipt?.status === 0) {
              handleAction(actions.actionReceiptOrder, _item.Salereceipt.id, 6, 'Hủy đơn hàng thành công', value.adminNote);
            } else if (_item.Salereceipt?.status === 5) {
              handleAction(actions.actionReceiptWarehouse, _item.Salereceipt.id, 3, 'Hủy đơn hàng thành công', value.adminNote);
            } else {
              handleAction(actions.actionReceiptWarehouse, _item.Salereceipt.id, 6, 'Xác nhận giao hàng thất bại', value.adminNote);
            }
          });
        }}
        open={isOpenReject}
        okText='Xác nhận'
        cancelText='Hủy'
      >
        <Form form={_form}>
          <Form.Item name='adminNote'>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <UpdateBill getData={getData} close={closeReceipt} isOpen={isOpenReceipt} updateItem={_updateItem} id={_id} />
      <div className='hidden'>
        <PrintBill data={_printData} open={openPrint} close={closePrint} isOpen={isPrint} />
      </div>
    </ReceiptWrapper>
  );
}
