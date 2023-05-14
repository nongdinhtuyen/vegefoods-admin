import ProductsOffered from './ProductsOffered';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Avatar, Button, Form, Input, InputNumber, Modal, Select, Space, Table } from 'antd';
import utils from 'common/utils';
import DisplayControl from 'components/DisplayControl';
import consts, { DEFAULT_LARGE_PAGE_SIZE, DEFAULT_PAGE_SIZE, WAIT_TIME_DEBOUNCE } from 'consts';
import useToggle from 'hooks/useToggle';
import Icon from 'icon-icomoon';
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { MdDeleteForever } from 'react-icons/all';
import PhoneInput, { formatPhoneNumber, isPossiblePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input/input';
import productActions from 'redux/actions/product';
import actions from 'redux/actions/provider';
import { useAppDispatch } from 'redux/store';
import styled from 'styled-components';
import { useImmer } from 'use-immer';

import classNames from 'classnames';
import _ from 'lodash';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export default function Provider() {
  const dispatch = useAppDispatch();
  const [_provider, setProvider] = useImmer({
    total: 0,
    current: 1,
    data: [],
  });
  const { open, close, isOpen } = useToggle();
  const { open: openOffer, close: closeOffer, isOpen: isOpenOffer } = useToggle();
  const [_form] = Form.useForm();
  const [_isUpdate, setIsUpdate] = useState(false);
  const [_id, setId] = useState(0);
  const [_product, setProduct] = useImmer({
    total: 0,
    current: 1,
    data: [],
  });
  const [_filters, setFilters] = useImmer<any>({
    arg: '',
    pid: [],
  });

  const getData = ({ current = _provider.current, arg = _filters.arg, pid = _filters.pid } = {}) => {
    setProvider((draft) => {
      draft.current = current;
    });
    setFilters((draft) => {
      draft.pid = pid;
    });
    dispatch(
      actions.actionGetProvider({
        params: {
          current,
          count: DEFAULT_PAGE_SIZE,
          body: {
            arg,
            pid: _.map(pid, (item) => item + ''),
          },
        },
        callbacks: {
          onSuccess({ data, total }) {
            setProvider((draft) => {
              draft.data = data;
              draft.total = total;
            });
          },
        },
      })
    );
  };

  useEffect(() => {
    getData();
    getProducts();
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
      width: '15%',
      align: 'center',
      title: 'Tên nhà cung cấp',
      dataIndex: 'name',
      key: 'name',
    },
    {
      align: 'center',
      width: '10%',
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => formatPhoneNumber(`+84${phone}`),
    },
    {
      align: 'center',
      width: '10%',
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      width: '15%',
      align: 'center',
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Hành động',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => (
        <div className='flex items-center gap-x-4 justify-center'>
          <img title='Sản phẩm cung cấp' className='cursor-pointer' onClick={() => productOffer(record)} src='/images/product.svg' />
          <DisplayControl path='provider/product/:id' action='post'>
            <Icon title='Sửa nhà cung cấp' size={22} className='cursor-pointer' icon={'edit'} onClick={() => updateProvider(record)} />
          </DisplayControl>
          <DisplayControl path='provider/:id' action='delete'>
            <Icon title='Xóa nhà cung cấp' size={22} className='cursor-pointer' icon={'delete'} onClick={() => showConfirm(id)} />
          </DisplayControl>
        </div>
      ),
    },
  ];

  const showConfirm = (id) => {
    Modal.confirm({
      icon: <ExclamationCircleFilled />,
      content: `Bạn có chắc chắn xóa nhà cung cấp ${id} không?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk() {
        dispatch(
          actions.actionDeleteProvider({
            params: { id: _id },
            callbacks: {
              onSuccess({ data, total }) {
                getData();
                handleCancel();
              },
            },
          })
        );
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const productOffer = (record) => {
    openOffer();
    setId(record.id);
  };

  const updateProvider = (record) => {
    open();
    setId(record.id);
    _form.setFieldsValue(record);
    setIsUpdate(true);
  };

  const handleOk = () => {
    const handleAction = _isUpdate ? 'actionUpdateProvider' : 'actionCreateProvider';
    _form
      .validateFields()
      .then((values) => {
        dispatch(
          actions[handleAction]({
            params: { ...values, phone: values.phone + '', id: _id },
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

  const getProducts = ({ current = _product.current, search = '' } = {}) => {
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

  const handleSearch = _.debounce((value) => {
    getProducts({ current: 1, search: value });
  }, WAIT_TIME_DEBOUNCE);

  const handleSearchName = (e) => {
    const { value } = e.target;
    setFilters((draft) => {
      draft.arg = value;
    });
    getDataDebounce(value);
  };

  const getDataDebounce = useRef(
    _.debounce((value) => {
      setFilters((draft) => {
        draft.arg = value;
      });
      getData({ current: 1, arg: value });
    }, WAIT_TIME_DEBOUNCE)
  ).current;

  return (
    <>
      <div className='mb-3 flex justify-between'>
        <Space>
          <Select
            showSearch
            className='w-[500px]'
            allowClear
            mode='multiple'
            maxTagCount='responsive'
            placeholder='Sản phẩm nhà cung cấp'
            onChange={(value, option: any) => {
              console.log(value);
              getData({
                current: 1,
                pid: value,
              });
            }}
            onSearch={handleSearch}
            filterOption={(input, option) => (option?.name ?? '').toLowerCase().includes(input.toLowerCase())}
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
          <Input
            className='w-96'
            value={_filters.arg}
            onChange={handleSearchName}
            // onChange={(event) => {
            //   const { value } = event.target;
            //   setFilters((draft) => {
            //     draft.arg = value;
            //   });
            //   handleSearchName(event);
            // }}
            placeholder='Tên hoặc SĐT nhà cung cấp'
          />
        </Space>
        <DisplayControl path='provider' action='post'>
          <Button type='primary' onClick={open}>
            Thêm nhà cung cấp
          </Button>
        </DisplayControl>
      </div>
      <ProductsOffered close={closeOffer} isOpen={isOpenOffer} id={_id} />
      <Modal width={560} title={_isUpdate ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'} open={isOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form labelWrap className='mt-4' {...layout} labelAlign='left' form={_form} name='control-hooks'>
          <Form.Item label='Tên nhà cung cấp' name='name' rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label='Địa chỉ' name='address' rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>

          <Form.Item label='Số điện thoại' name='phone' required>
            <Input />
          </Form.Item>
          <Form.Item
            label='Email'
            name='email'
            required
            rules={[
              {
                validator(rule, value, callback) {
                  if (value && utils.validateEmail(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Email không hợp lệ');
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Table
        bordered
        dataSource={_provider.data}
        columns={columns}
        pagination={{
          onChange: (page) => getData({ current: page }),
          showSizeChanger: false,
          current: _provider.current,
          pageSize: DEFAULT_PAGE_SIZE,
          total: _provider.total,
          hideOnSinglePage: true,
        }}
      />
    </>
  );
}
