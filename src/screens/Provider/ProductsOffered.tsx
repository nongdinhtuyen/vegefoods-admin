import { AutoComplete, Avatar, Button, Form, Input, InputNumber, Modal, Select, Space, Table } from 'antd';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
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

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export default function ProductsOffered({ open, isOpen, close, id }) {
  const dispatch = useAppDispatch();
  const [_product, setProduct] = useImmer({
    total: 0,
    current: 1,
    data: [],
  });
  const [_productOffer, setProductOffer] = useState<any>([]);
  const [_form] = Form.useForm();
  const [_isUpdate, setIsUpdate] = useState(false);
  const [_item, setItem] = useState<any>({});

  const getData = ({ current = _product.current, search = '' } = {}) => {
    setProduct((draft) => {
      draft.current = current;
    });
    dispatch(
      productActions.actionGetProduct({
        params: {
          current,
          count: DEFAULT_LARGE_PAGE_SIZE,
          body: {
            name: search,
            remaining: -1,
            type_product: [],
          },
        },
        callbacks: {
          onSuccess({ data, total }) {
            setProduct((draft) => {
              draft.data = data.products;
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

  const columns: any = [
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

  const onScrollGroup = (event) => {
    const { scrollTop, scrollHeight } = event.target;
    if (scrollTop > 0.6 * scrollHeight) {
      getData({ current: _product.current + 1 });
    }
  };

  const handleSearch = _.debounce((value) => {
    getData({ current: 1, search: value });
  }, WAIT_TIME_DEBOUNCE);

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
    <Modal width={880} title={'Sản phẩm cung cấp'} open={isOpen} onOk={handleOk} onCancel={handleCancel} className='top-10'>
      <Form labelWrap layout='inline' className='my-4' labelAlign='left' form={_form} name='add' initialValues={{ price: 0 }}>
        <Form.Item className='!flex-1' label='Sản phẩm' name='id'>
          <Select
            onPopupScroll={onScrollGroup}
            showSearch
            className='w-full'
            onChange={(value, option: any) => setItem(option)}
            onSearch={handleSearch}
            filterOption={(input, option) => true}
            options={_.map(_product.data, (item: any) => ({
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
        <Button>Sửa</Button>
      </Form>
      <Table
        bordered
        rowKey={'id'}
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
