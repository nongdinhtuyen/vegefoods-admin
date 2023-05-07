// import Receipt from './Receipt';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Modal, Select, Space, Spin, Switch, Table } from 'antd';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import Receipt from 'components/Receipt';
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

export default function PrintBill({ data, open, close, isOpen }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
    open();
    setText('Loading new text...');

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        close();
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

  useEffect(() => {
    if (isOpen) {
      handlePrint();
    }
  }, [data, isOpen]);

  return (
    <>
      <Modal width={400} closable={false} open={isOpen} footer={null} onCancel={close}>
        <div className='p-10 text-center text-2xl'>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} />} />
          <div className='mt-5'>Đang chờ in hóa đơn</div>
        </div>
      </Modal>
      <Receipt ref={componentRef} listReceipt={data} />
    </>
  );
}
