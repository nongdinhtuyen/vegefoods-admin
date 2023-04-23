import ProductDetail from './ProductDetail';
import UpdateProduct from './UpdateProduct';
import { Form, Input, Modal, Select, Space, Table } from 'antd';
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
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

export default function ProductType() {
  const dispatch = useAppDispatch();
  const { productType } = useAppSelector((state) => state.productReducer);
  const { isOpen, close, open } = useToggle();
  const [_item, setItem] = useState<any>({});
  const [_form] = Form.useForm();

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
      title: 'Tên sản phẩm',
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
    _form
      .validateFields()
      .then((values) => {
        dispatch(
          actions.actionUpdateProductType({
            params: { ...values, id: _item.id },
            callbacks: {
              onSuccess() {
                getData();
                handleCancel();
                openNotification({
                  description: 'Cập nhật danh mục thành công',
                });
              },
            },
          })
        );
      })
      .catch(console.log);
  };

  return (
    <div>
      <Table
        bordered
        rowKey={'id'}
        dataSource={productType}
        columns={columns}
        pagination={{
          hideOnSinglePage: true,
        }}
      />
      <Modal width={400} onOk={handleOk} title='Sửa phân hạng' onCancel={close} open={isOpen}>
        <Form {...layout} labelWrap className='mt-4' labelAlign='left' form={_form}>
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
    </div>
  );
}
