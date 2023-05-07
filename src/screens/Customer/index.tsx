// import Receipt from './Receipt';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Modal, Select, Space, Spin, Switch, Table } from 'antd';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import consts, { DEFAULT_PAGE_SIZE, DEFAULT_SMALL_PAGE_SIZE } from 'consts';
import useToggle from 'hooks/useToggle';
import Icon from 'icon-icomoon';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AiOutlinePrinter, IoReceiptOutline, MdOutlineMap } from 'react-icons/all';
import { useNavigate } from 'react-router-dom';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import actions from 'redux/actions/customer';
import receiptActions from 'redux/actions/receipt';
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

type CustomerType = {
  data: any[];
  current: number;
  total: number;
};

export default function Customer() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isOpen, close, open } = useToggle();
  const { isOpen: isPrint, close: printClose, open: printOpen } = useToggle();
  const [_form] = Form.useForm();
  const [_customerStatics, setCustomerStatics] = useState<any>({});
  const [_customer, setCustomer] = useImmer<CustomerType>({
    data: [],
    current: 1,
    total: 0,
  });
  const [_receipt, setReceipt] = useImmer({
    id: 0,
    data: [],
  });
  const [_address, setAddres] = useState<any>([]);
  const componentRef = useRef(null);

  const onBeforeGetContentResolve = useRef<any>(null);

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('old boring text');

  const handleAfterPrint = useCallback(() => {
    console.log('`onAfterPrint` called'); // tslint:disable-line no-console
  }, []);

  const handleBeforePrint = useCallback(() => {
    console.log('`onBeforePrint` called'); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = useCallback(() => {
    console.log('`onBeforeGetContent` called'); // tslint:disable-line no-console
    setLoading(true);
    printOpen();
    setText('Loading new text...');

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        printClose();
        setText('New, Updated Text!');
        resolve(true);
      }, 0);
    });
  }, [setLoading, setText]);

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: 'AwesomeFileName',
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
  });

  useEffect(() => {
    if (text === 'New, Updated Text!' && typeof onBeforeGetContentResolve.current === 'function') {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current, text]);

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
      width: '5%',
      align: 'center',
      title: 'Giới tính',
      dataIndex: 'sex',
      key: 'sex',
      render: (sex) => gender[sex],
    },
    {
      width: '5%',
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
      title: 'Thời gian tạo',
      dataIndex: 'createDate',
      key: 'createDate',
      render: (createDate) => utils.formatTimeFromUnix(createDate, 'DD/MM/YYYY HH:mm:ss'),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Trạng thái hoạt động',
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
      render: (id) => (
        <div className='flex items-center gap-x-4'>
          <MdOutlineMap size={20} title='Sổ người nhận' className='cursor-pointer' onClick={() => openAddress(id)} />
          <IoReceiptOutline size={20} title='Sổ người nhận' className='cursor-pointer' onClick={() => openReceipt(id)} />
          {/* <AiOutlinePrinter size={20} title='In hóa đơn' className='cursor-pointer' onClick={() => printReceipt(id)} /> */}
        </div>
      ),
      // render: (id) => <Icon size={18} title='Sổ người nhận' className='cursor-pointer' icon={'info'} onClick={() => openAddress(id)} />,
    },
  ];

  const columnsAddress: any = [
    {
      width: '30%',
      align: 'center',
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      width: '20%',
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

  const openReceipt = (id) => {
    navigate(`/${id}`, { state: { id } });
  };

  const getBillById = ({ id = _receipt.id } = {}) => {
    setReceipt((draft) => {
      draft.id = id;
    });
    dispatch(
      receiptActions.actionGetReceipt({
        params: { uid: id, typeStatus: -1 },
        callbacks: {
          onSuccess({ data, total }) {
            handlePrint();
            setReceipt((draft) => {
              draft.data = data;
            });
          },
        },
      })
    );
  };

  const printReceipt = (id) => {
    getBillById({ id });
  };

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
          <img title='Sản phẩm cung cấp' width={100} src='/images/group.svg' />
          {/* <img title='Sản phẩm cung cấp' width={100} src='/images/group_active.svg' /> */}
        </div>
      </div>
      <Table bordered rowKey={'id'} dataSource={_customer.data} columns={columns} pagination={{ hideOnSinglePage: true }} />
      <Modal width={800} footer={null} title='Danh sách địa chỉ người dùng' onCancel={close} open={isOpen}>
        <Table bordered rowKey={'id'} dataSource={_address} columns={columnsAddress} pagination={{ hideOnSinglePage: true }} />
      </Modal>
      <Modal width={400} closable={false} open={isPrint} footer={null} onCancel={printClose}>
        <div className='p-10 text-center text-2xl'>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} />} />
          <div className='mt-5'>Đang chờ in hóa đơn</div>
        </div>
      </Modal>
      {/* <Receipt ref={componentRef} listReceipt={_receipt.data} /> */}
    </>
  );
}
