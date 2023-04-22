import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, DatePicker, Form, Input, InputNumber, List, message, Modal, Row, Select, Space, Table, Upload } from 'antd';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
import { DEFAULT_LARGE_PAGE_SIZE, DEFAULT_SMALL_PAGE_SIZE, WAIT_TIME_DEBOUNCE } from 'consts';
import Icon from 'icon-icomoon';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import actions from 'redux/actions/product';
import productActions from 'redux/actions/product';
import { useAppDispatch, useAppSelector } from 'redux/store';
import styled from 'styled-components';
import { useImmer } from 'use-immer';

import _ from 'lodash';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const AddOrderEntryForm = ({ isOpen, close }) => {
  const [_form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [_product, setProduct] = useImmer({
    total: 0,
    current: 1,
    data: [],
  });
  const [_productOrder, setProductOrder] = useState<any>([]);
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

  const handleOk = () => {
    _form
      .validateFields()
      .then((values) => {
        dispatch(
          actions.actionUpdateProductById({
            params: {
              ...values,
              imgs: _.map(values.imgs, (item) => item.name),
            },
            callbacks: {
              onSuccess({ data }) {
                openNotification({
                  type: 'success',
                  description: 'Cập nhật sản phẩm thành công',
                });
                close();
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
    const check = _.findIndex(_productOrder, (item: any) => id === item.id);
    if (check === -1) {
      setProductOrder((draft) => [{ id, price, name: _item.name, img: _item.img, key: id }, ...draft]);
    } else {
      openNotification({
        description: 'Sản phẩm này đã có trong danh sách',
        type: 'warning',
      });
    }
  };

  const deleteProduct = (id) => {
    const newProducts = _.filter(_productOrder, (item) => item.id !== id);
    setProductOrder(newProducts);
  };

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

  return (
    <Modal className='top-10' width={840} onOk={handleOk} title='Thêm phiếu nhập kho' onCancel={close} open={isOpen}>
      <Form labelWrap className='mt-4' {...layout} labelAlign='left' form={_form}>
        <Form.Item label='Ngày nhập' name='name' rules={[{ required: true }]}>
          <DatePicker format={'DD/MM/YYYY HH:mm:ss'} />
        </Form.Item>
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
      </Form>
      <Table
        bordered
        rowKey={'id'}
        dataSource={_productOrder}
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
