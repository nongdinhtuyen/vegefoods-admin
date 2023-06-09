import { AutoComplete, Avatar, Button, Form, Input, InputNumber, Modal, Select, Space, Table } from 'antd';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
import DisplayControl from 'components/DisplayControl';
import { EditableCell, EditableRow } from 'components/EditContextCustom';
import consts, { DEFAULT_LARGE_PAGE_SIZE, DEFAULT_PAGE_SIZE, DEFAULT_SMALL_PAGE_SIZE } from 'consts';
import { WAIT_TIME_DEBOUNCE } from 'consts';
import Icon from 'icon-icomoon';
import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import productActions from 'redux/actions/product';
import actions from 'redux/actions/provider';
import { useAppDispatch } from 'redux/store';
import styled from 'styled-components';
import { useImmer } from 'use-immer';

import _ from 'lodash';

interface DataType {
  key: React.Key;
  id: React.Key;
  name: string;
  img: string;
  price: number;
}

export default function ProductsOffered({ isOpen, close, id, product, getData }) {
  const dispatch = useAppDispatch();
  // const [_product, setProduct] = useImmer({
  //   total: 0,
  //   current: 1,
  //   data: [],
  // });
  const [_productOffer, setProductOffer] = useState<any>([]);
  const [_form] = Form.useForm();
  const [_isUpdate, setIsUpdate] = useState(false);
  const [_item, setItem] = useState<any>({});

  // const getData = ({ current = _product.current, search = '' } = {}) => {
  //   setProduct((draft) => {
  //     draft.current = current;
  //   });
  //   dispatch(
  //     productActions.actionGetProduct({
  //       params: {
  //         current,
  //         count: DEFAULT_LARGE_PAGE_SIZE,
  //         body: {
  //           name: search,
  //           remaining: -1,
  //           type_product: [],
  //         },
  //       },
  //       callbacks: {
  //         onSuccess({ data, total }) {
  //           setProduct((draft) => {
  //             draft.data = data.products;
  //             draft.total = total;
  //           });
  //         },
  //       },
  //     })
  //   );
  // };

  useEffect(() => {
    // getData();
  }, []);

  useEffect(() => {
    if (isOpen) {
      dispatch(
        actions.actionGetProductOfProvider({
          params: {
            current: 1,
            id,
            count: 100,
          },
          callbacks: {
            onSuccess({ data, total }) {
              setProductOffer(
                _.map(data, (item) => ({
                  id: item.idProduct,
                  key: item.idProduct,
                  price: item.price,
                  name: item.productList.name,
                  img: item.productList.img,
                }))
              );
            },
          },
        })
      );
    }
  }, [isOpen]);

  const handleSave = (row: DataType) => {
    const newData = [..._productOffer];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...{ ...row },
    });
    setProductOffer(newData);
  };

  const defaultColumns: any = [
    {
      width: '5%',
      align: 'center',
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      width: '15%',
      align: 'center',
      title: 'Hình ảnh',
      dataIndex: 'img',
      key: 'img',
      render: (img) => <CustomImage width={60} src={utils.baseUrlImage(img)} />,
    },
    {
      width: '15%',
      align: 'center',
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      width: '15%',
      align: 'center',
      title: 'Giá cung cấp (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      editable: true,
      render: utils.formatCurrency,
    },

    {
      width: '10%',
      align: 'center',
      title: 'Hành động',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => <Icon title='Xóa sản phẩm' size={22} className='cursor-pointer' icon={'delete'} onClick={() => deleteProduct(id)} />,
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
    setProductOffer([]);
    close();
    _form.resetFields();
  };

  const handleOk = () => {
    _form
      .validateFields()
      .then(() => {
        dispatch(
          actions.actionAddProductOfProvider({
            params: {
              id,
              listProviderProduct: _.reduce(
                _productOffer,
                (object, item) => {
                  object[item.id] = item.price;
                  return object;
                },
                {}
              ),
            },
            callbacks: {
              onSuccess() {
                openNotification({
                  description: 'Cập nhật sản phẩm của nhà cung cấp thành công',
                  type: 'success',
                });
                getData();
                handleCancel();
              },
            },
          })
        );
      })
      .catch(console.log);
  };

  const handleCancel = () => {
    _form.resetFields();
    close();
    setIsUpdate(false);
  };

  // const handleSearch = _.debounce((value) => {
  //   getData({ current: 1, search: value });
  // }, WAIT_TIME_DEBOUNCE);

  const addProductOffer = () => {
    const { id, price } = _form.getFieldsValue();
    const check = _.findIndex(_productOffer, (item: any) => id === item.id);
    if (check === -1) {
      setProductOffer((draft) => [{ id, price, name: _item.name, img: _item.img, key: id }, ...draft]);
    } else {
      openNotification({
        description: 'Sản phẩm này đã có trong danh sách',
        type: 'warning',
      });
    }
  };

  const deleteProduct = (id) => {
    const newProducts = _.filter(_productOffer, (item) => item.id !== id);
    setProductOffer(newProducts);
  };

  return (
    <Modal
      footer={[
        null,
        <DisplayControl path='provider/:id' action='put'>
          <Button onClick={handleOk}>Xác nhận</Button>
        </DisplayControl>,
      ]}
      width={880}
      title={'Sản phẩm cung cấp'}
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      className='top-10'
    >
      <Form labelWrap layout='inline' className='my-4' labelAlign='left' form={_form} name='add' initialValues={{ price: 0 }}>
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
        <Form.Item className='!flex-1' label='Giá' name='price'>
          <InputNumber
            formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            addonAfter='VNĐ'
            min={0}
            controls={false}
            className='w-full'
          />
        </Form.Item>
        <Form.Item shouldUpdate>
          {({ getFieldValue }) => (
            <Button type='primary' disabled={!getFieldValue('id') || !_.isNumber(getFieldValue('price'))} onClick={addProductOffer}>
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
        dataSource={_productOffer}
        columns={columns}
        pagination={{
          pageSize: DEFAULT_SMALL_PAGE_SIZE,
          hideOnSinglePage: true,
        }}
      />
    </Modal>
  );
}
