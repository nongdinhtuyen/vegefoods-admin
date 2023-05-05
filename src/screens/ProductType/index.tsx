import ProductDetail from './ProductDetail';
import UpdateProduct from './UpdateProduct';
import { Button, Form, Input, Modal, Select, Space, Table } from 'antd';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
import consts, { DEFAULT_SMALL_PAGE_SIZE } from 'consts';
import useToggle from 'hooks/useToggle';
import Icon from 'icon-icomoon';
import React, { useEffect, useState } from 'react';
import { AiOutlineFileText } from 'react-icons/all';
import actions from 'redux/actions/product';
import { useAppDispatch, useAppSelector } from 'redux/store';

import _ from 'lodash';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export default function ProductType() {
  const dispatch = useAppDispatch();
  const { productType } = useAppSelector((state) => state.productReducer);
  const { isOpen, close, open } = useToggle();
  const [_item, setItem] = useState<any>({});
  const [_form] = Form.useForm();
  const [_isCreate, setIsCreate] = useState<boolean>(false);

  const getData = () => {
    dispatch(actions.actionGetProductType({}));
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
      width: '10%',
      align: 'center',
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      width: '5%',
      align: 'center',
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Icon
          size={22}
          title='Cập nhật danh mục'
          className='cursor-pointer'
          onClick={() => {
            open();
            setIsCreate(false);
            setItem(record);
            _form.setFieldValue('name', record.name);
          }}
          icon={'edit'}
        />
      ),
    },
  ];

  const handleCancel = () => {
    close();
    _form.resetFields();
  };

  const handleOk = () => {
    const action = _isCreate ? 'actionCreateProductType' : 'actionUpdateProductType';
    _form
      .validateFields()
      .then((values) => {
        dispatch(
          actions[action]({
            params: { ...values, id: _item.id },
            callbacks: {
              onSuccess() {
                getData();
                handleCancel();
                openNotification({
                  description: _isCreate ? 'Thêm danh mục thành công' : 'Cập nhật danh mục thành công',
                  type: 'success',
                });
              },
            },
          })
        );
      })
      .catch(console.log);
  };

  const handleAdd = () => {
    open();
    setIsCreate(true);
  };

  return (
    <>
      <div className='text-right mb-2'>
        <Button type='primary' onClick={handleAdd}>
          Thêm danh mục
        </Button>
      </div>
      <Table
        bordered
        rowKey={'id'}
        dataSource={productType}
        columns={columns}
        pagination={{
          hideOnSinglePage: true,
        }}
      />
      <Modal width={500} onOk={handleOk} title={_isCreate ? 'Thêm danh mục' : 'Sửa danh mục'} onCancel={handleCancel} open={isOpen}>
        <Form {...layout} labelWrap className='py-2' labelAlign='left' form={_form}>
          <Form.Item
            label='Tên danh mục'
            name='name'
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
