import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, DatePicker, Form, Input, InputNumber, List, message, Modal, Row, Select, Space, Table, Upload } from 'antd';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
import { EditableCell, EditableRow } from 'components/EditContextCustom';
import { DEFAULT_LARGE_PAGE_SIZE, DEFAULT_SMALL_PAGE_SIZE, WAIT_TIME_DEBOUNCE } from 'consts';
import dayjs from 'dayjs';
import Icon from 'icon-icomoon';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import productActions from 'redux/actions/product';
import providerActions from 'redux/actions/provider';
import actions from 'redux/actions/warehouse';
import { useAppDispatch, useAppSelector } from 'redux/store';
import styled from 'styled-components';
import { useImmer } from 'use-immer';

import _ from 'lodash';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

interface DataType {
  key: React.Key;
  id: React.Key;
  name: string;
  img: string;
  price: number;
  amount: number;
  total: number;
}

const AddOrderEntryForm = ({ detail, id, provider, isOpen, close, getDataWarehouse, isEdit }) => {
  const [_form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [_dataSource, setDataSource] = useState<DataType[]>([]);
  const [_id, setId] = useState(0);

  const renderData = (data) => {
    return _.map(data, (item: any) => ({
      id: item.idProduct,
      key: item.idProduct,
      img: item.productList.img,
      name: item.productList.name,
      price: item.price,
      amount: item.quantity ?? 0,
      total: item.total ?? 0,
    }));
  };

  useEffect(() => {
    if (isEdit) {
      const newData = renderData(detail);
      setDataSource(newData);
      setId(id);
    }
  }, [isEdit, id, detail]);

  const getProductOfProvider = (id) => {
    setId(id);
    dispatch(
      providerActions.actionGetProductOfProvider({
        params: {
          id,
          current: 1,
          count: 100,
        },
        callbacks: {
          onSuccess({ data, total }) {
            const newData = renderData(data);
            setDataSource(newData);
          },
        },
      })
    );
  };

  const handleOk = () => {
    console.log('🚀 ~ file: AddOrderEntryForm.tsx:100 ~ .then ~ _id:', id);

    const action = isEdit ? 'actionUpdateImportWarehouse' : 'actionCreateImportWarehouse';

    _form
      .validateFields()
      .then((values) => {
        const params = !isEdit
          ? {
              ...values,
              idProvider: _id,
              importDate: dayjs(values.date).unix(),
              products: _.reduce(
                _dataSource,
                (obj, item) => {
                  obj[item.id] = item.amount;
                  return obj;
                },
                {}
              ),
            }
          : {
              id,
              products: _.reduce(
                _dataSource,
                (obj, item) => {
                  obj[item.id] = item.amount;
                  return obj;
                },
                {}
              ),
            };
        dispatch(
          actions[action]({
            params,
            callbacks: {
              onSuccess({ data }) {
                openNotification({
                  type: 'success',
                  description: 'Thêm phiếu nhập kho thành công',
                });
                getDataWarehouse();
                close();
              },
            },
          })
        );
      })
      .catch(console.log);
  };

  const handleDelete = (key: React.Key) => {
    const newData = _dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleSave = (row: DataType) => {
    const newData = [..._dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...{ ...row, total: row.price * row.amount },
    });
    setDataSource(newData);
  };

  const defaultColumns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
      align: 'center',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Hình ảnh',
      dataIndex: 'img',
      key: 'img',
      render: (img) => <CustomImage width={60} src={utils.baseUrlImage(img)} />,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      width: '10%',
      align: 'center',
    },
    {
      width: '10%',
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      align: 'center',
      render: utils.formatCurrency,
    },
    {
      align: 'center',
      title: 'Số lượng',
      dataIndex: 'amount',
      width: '10%',
      editable: true,
      render: utils.formatCurrency,
    },
    {
      align: 'center',
      width: '10%',
      title: 'Thành tiền (VNĐ)',
      dataIndex: 'total',
      render: utils.formatCurrency,
    },
    {
      align: 'center',
      width: '10%',
      title: 'Hành động',
      dataIndex: 'id',
      render: (id) => <Icon title='Xóa sản phẩm' size={20} className='cursor-pointer' onClick={() => handleDelete(id)} icon={'delete'} />,
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const handleClose = () => {
    setDataSource([]);
    close();
    _form.resetFields();
  };

  return (
    <Modal
      className='top-10'
      width={840}
      onOk={handleOk}
      title={isEdit ? 'Sửa phiếu nhập kho' : 'Thêm phiếu nhập kho'}
      onCancel={handleClose}
      open={isOpen}
    >
      <Form labelWrap className='mt-4' labelAlign='left' form={_form}>
        <Form.Item hidden={isEdit} label='Nhà cung cấp' name='name' rules={[{ required: !isEdit }]}>
          <Select
            options={[
              ..._.map(provider, (item: any) => ({
                value: item.id,
                label: item.name,
              })),
            ]}
            onSelect={(value: any) => getProductOfProvider(value)}
          />
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) =>
            getFieldValue('name') && (
              <Form.Item label='Ngày nhập' name='date' rules={[{ required: true }]}>
                <DatePicker format={'DD/MM/YYYY HH:mm:ss'} showTime={{ format: 'hh:mm' }} />
              </Form.Item>
            )
          }
        </Form.Item>
      </Form>
      <Table
        bordered
        className='editable-row'
        rowKey={'id'}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        dataSource={_dataSource}
        columns={columns}
        pagination={{
          pageSize: DEFAULT_SMALL_PAGE_SIZE,
          hideOnSinglePage: true,
        }}
      />
    </Modal>
  );
};

export default AddOrderEntryForm;
