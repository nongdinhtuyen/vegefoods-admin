import { Avatar, Button, Form, InputNumber, Modal, Select, Table } from 'antd';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
import { EditableCell, EditableRow } from 'components/EditContextCustom';
import consts, { DEFAULT_LARGE_PAGE_SIZE, DEFAULT_PAGE_SIZE, DEFAULT_SMALL_PAGE_SIZE } from 'consts';
import Icon from 'icon-icomoon';
import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import providerActions from 'redux/actions/provider';
import actions from 'redux/actions/receipt';
import { useAppDispatch } from 'redux/store';
import styled from 'styled-components';
import { useImmer } from 'use-immer';

import _ from 'lodash';

interface DataType {
  key: React.Key;
  id: React.Key;
  name: string;
  img: string;
  quantity: number;
}

export default function UpdateBill({ product, isOpen, close, id, updateItem, getData }) {
  console.log('🚀 ~ file: UpdateBill.tsx:26 ~ UpdateBill ~ product:', product);
  const dispatch = useAppDispatch();
  const [_dataSource, setDataSource] = useState<DataType[]>([]);
  const [_error, setError] = useState(false);
  const [_productOffer, setProductOffer] = useState<any>([]);
  const [_form] = Form.useForm();
  const [_item, setItem] = useState<any>({});

  useEffect(() => {
    if (isOpen) {
      const newData = _.map(updateItem, (item) => ({
        id: item.idProduct,
        key: item.idProduct,
        quantity: item.quantity,
        name: item.productList.name,
        img: item.productList.img,
      }));
      setDataSource(newData);
    }
  }, [isOpen]);

  const handleSave = (row: DataType) => {
    const newData = [..._dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const oldItem: any = _.find(updateItem, (item: any) => row.key === item.idProduct);
    const item = newData[index];
    if (row.quantity > oldItem.productList.remain) {
      setError(true);
      openNotification({
        type: 'error',
        description: `Số lượng ${item.name} nhập lớn hơn số lượng sản phẩm khả dụng`,
      });
    } else {
      setError(false);
      newData.splice(index, 1, {
        ...item,
        ...{ ...row },
      });
      setDataSource(newData);
    }
  };

  const handleDelete = (key: React.Key) => {
    const newData = _dataSource.filter((item) => item.key !== key);
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
      align: 'center',
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: '10%',
      editable: true,
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

  const handleOk = () => {
    if (!_error) {
      dispatch(
        actions.actionUpdateReceipt({
          params: {
            id,
            body: {
              infoCart: _.reduce(
                _dataSource,
                (obj, item) => {
                  obj[item.id] = item.quantity;
                  return obj;
                },
                {}
              ),
            },
          },
          callbacks: {
            onSuccess(data) {
              _form.resetFields();
              close();
              getData();
              openNotification({
                description: 'Sửa đơn hàng thành công',
                type: 'success',
              });
            },
          },
        })
      );
    }
  };

  const handleCancel = () => {
    close();
    _form.resetFields();
    setDataSource([]);
  };

  const addProductOffer = () => {
    const { id, quantity } = _form.getFieldsValue();
    const check = _.findIndex(_dataSource, (item: any) => id === item.id);
    if (check === -1) {
      const item = _.keyBy(product.data, 'id')[id];
      if (item.remain < quantity) {
        openNotification({
          description: `Số lượng sản phẩm ${item.name} trong kho chỉ còn ${item.remain}`,
          type: 'warning',
        });
      } else {
        setDataSource((draft) => [{ id, quantity, name: _item.name, img: _item.img, key: id }, ...draft]);
      }
    } else {
      openNotification({
        description: 'Sản phẩm này đã có trong danh sách',
        type: 'warning',
      });
    }
  };

  return (
    <Modal width={880} title={'Sửa hóa đơn'} open={isOpen} onOk={handleOk} onCancel={handleCancel} className='top-10'>
      <Form labelWrap layout='inline' className='my-4' labelAlign='left' form={_form} name='add' initialValues={{ price: 0 }} labelCol={{ span: 6 }}>
        <Form.Item className='!flex-1' label='Sản phẩm' name='id'>
          <Select
            showSearch
            className='w-full'
            onChange={(value, option: any) => setItem(option)}
            // onSearch={handleSearch}
            filterOption={(input, option) => (option?.name ?? '').toLowerCase().includes(input.toLowerCase())}
            options={_.map(product.data, (item: any) => ({
              label: (
                <div className='flex gap-x-1 items-center'>
                  <Avatar size='small' src={utils.baseUrlImage(item.img)} alt={item.img} />
                  <div title={item.name} className='ellipsis'>
                    {item.name}
                  </div>
                </div>
              ),
              key: item.id,
              name: item.name || '',
              img: item.img || '',
              value: item.id,
            }))}
          />
        </Form.Item>
        <Form.Item className='!flex-1' label='Số lượng' name='quantity'>
          <InputNumber
            formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            min={1}
            controls={false}
            className='w-full'
          />
        </Form.Item>
        <Form.Item shouldUpdate>
          {({ getFieldValue }) => (
            <Button type='primary' disabled={!getFieldValue('id') || !_.isNumber(getFieldValue('quantity'))} onClick={addProductOffer}>
              Thêm sản phẩm
            </Button>
          )}
        </Form.Item>
      </Form>
      <Table
        bordered
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        rowKey={'id'}
        className='editable-row'
        dataSource={_dataSource}
        columns={columns}
        pagination={{
          pageSize: DEFAULT_SMALL_PAGE_SIZE,
          hideOnSinglePage: true,
        }}
      />
    </Modal>
  );
}
