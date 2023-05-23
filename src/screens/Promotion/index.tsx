import { Avatar, Button, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Switch, Table, Tag } from 'antd';
import Item from 'antd/es/list/Item';
import BigNumber from 'bignumber.js';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
import DisplayControl from 'components/DisplayControl';
import consts, { DEFAULT_PAGE_SIZE, DEFAULT_SMALL_PAGE_SIZE } from 'consts';
import dayjs from 'dayjs';
import useToggle from 'hooks/useToggle';
import Icon from 'icon-icomoon';
import React, { useEffect, useState } from 'react';
import productActions from 'redux/actions/product';
import actions from 'redux/actions/promotion';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { useImmer } from 'use-immer';

import _ from 'lodash';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

type typePromotion = {
  endDate: number;
  price: number;
  isActive: boolean;
  productId: number;
  startDate: number;
};

export default function Promotion() {
  const dispatch = useAppDispatch();
  const { isOpen, close, open } = useToggle();
  const [_form] = Form.useForm();
  const [_data, setData] = useImmer({
    current: 1,
    data: [],
    total: 0,
  });
  const [_product, setProduct] = useState();
  const [_price, setPrice] = useState<number>(0);
  const [_id, setId] = useState(0);
  const [_item, setItem] = useState<any>({});
  const [_isEdit, setIsEdit] = useState<any>(false);

  const getData = ({ current = _data.current } = {}) => {
    setData((draft) => {
      draft.current = current;
    });
    dispatch(
      actions.actionGetPromotion({
        params: {
          current,
          count: DEFAULT_SMALL_PAGE_SIZE,
          isActive: -1,
        },
        callbacks: {
          onSuccess({ data, total }) {
            setData((draft) => {
              draft.data = data;
              draft.total = total;
            });
          },
        },
      })
    );
  };

  const getProduct = () => {
    dispatch(
      productActions.actionGetProduct({
        params: {
          current: 1,
          count: 100,
        },
        callbacks: {
          onSuccess({ data, total }) {
            setProduct(data.products);
          },
        },
      })
    );
  };

  useEffect(() => {
    getData();
    getProduct();
  }, []);

  const renderStatus = (record) => {
    if (dayjs().unix() > record.startDate && dayjs().unix() < record.endDate) {
      return <Tag color='#2db7f5'>Đang diễn ra</Tag>;
    }
    if (dayjs().unix() > record.startDate && dayjs().unix() > record.endDate) {
      return <Tag color='magenta'>Kết thúc</Tag>;
    }
    if (dayjs().unix() < record.startDate) {
      return <Tag color='orange'>Chưa bắt đầu</Tag>;
    }
  };

  const checkIsActive = (record) => {
    if (dayjs().isAfter(record.endDate * 1000)) {
      return false;
    }
    return record.isActive;
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
      title: 'Hình ảnh',
      dataIndex: 'productList',
      key: 'productList',
      render: (productList) => <CustomImage height={50} src={utils.baseUrlImage(productList.img)} />,
    },
    {
      width: '10%',
      align: 'center',
      title: 'Tên',
      dataIndex: 'productList',
      key: 'productList',
      render: (productList) => productList.name,
    },
    {
      width: '10%',
      align: 'center',
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: utils.formatCurrency,
    },
    {
      width: '10%',
      align: 'center',
      title: 'Trạng thái',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (_, record) => renderStatus(record),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Thời gian bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (startDate) => utils.formatTimeFromUnix(startDate, 'DD/MM/YYYY HH:mm:ss'),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Thời gian kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (endDate) => utils.formatTimeFromUnix(endDate, 'DD/MM/YYYY HH:mm:ss'),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Kích hoạt',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, record) => (
        <DisplayControl action='put' path='promotion/:id' render={!checkIsActive(record) ? 'Chưa kích hoạt' : 'Đang kích hoạt'}>
          <Switch
            checked={checkIsActive(record)}
            onChange={(checked) => {
              if (dayjs().isAfter(record.endDate * 1000)) {
                openNotification({
                  description: 'Khuyến mãi đã vượt quá thời gian',
                  type: 'warning',
                });
              } else {
                setIsEdit(false);
                setItem(record);
                setPrice(record.productList.price);
                setId(record.id);
                handleOk(checked);
              }
            }}
          />
        </DisplayControl>
      ),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <DisplayControl action='put' path='promotion/:id'>
          <Icon
            size={22}
            title='Sửa khuyến mại'
            className='cursor-pointer'
            onClick={() => {
              open();
              setId(record.id);
              setIsEdit(true);
              setPrice(record.productList.price);
              _form.setFieldsValue({
                ...record,
                time: [dayjs(record.startDate * 1000), dayjs(record.endDate * 1000)],
              });
            }}
            icon={'edit'}
          />
        </DisplayControl>
      ),
    },
  ];

  const handleOk = (checked = true) => {
    const action = _id ? 'actionUpdatePromotion' : 'actionCreatePromotion';
    const dispatchAction = (value) =>
      dispatch(
        actions[action]({
          params: value,
          callbacks: {
            onSuccess(data) {
              openNotification({
                description: _id ? 'Sửa khuyến mại cho sản phẩm thành công' : 'Thêm khuyến mại cho sản phẩm thành công',
                type: 'success',
              });
              getData();
              handleClose();
            },
          },
        })
      );
    if (_id && !_isEdit) {
      dispatchAction({ ..._item, startDate: _item.startDate, endDate: _item.endDate, id: _id, isActive: checked });
    } else {
      const values = _form.getFieldsValue();
      const [startDate, endDate] = [dayjs(values.time[0]).unix(), dayjs(values.time[1]).unix()];
      dispatchAction({
        ...values,
        startDate,
        endDate,
        id: _id,
      });
    }
  };

  const handleClose = () => {
    _form.resetFields();
    close();
  };

  return (
    <div className='text-right'>
      <DisplayControl action='post' path='promotion'>
        <Button
          type='primary'
          onClick={() => {
            open();
            setId(0);
            _form.setFieldsValue({
              isActive: true,
            });
          }}
          className='mb-3'
        >
          Thêm khuyến mại
        </Button>
      </DisplayControl>
      <Table
        bordered
        rowKey={'id'}
        dataSource={_data.data}
        columns={columns}
        pagination={{
          onChange: (page) => getData({ current: page }),
          showSizeChanger: false,
          current: _data.current,
          pageSize: DEFAULT_SMALL_PAGE_SIZE,
          total: _data.total,
          hideOnSinglePage: true,
        }}
      />
      <Modal width={700} onOk={() => handleOk()} title={_id ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'} onCancel={handleClose} open={isOpen}>
        <Form {...layout} labelWrap className='mt-4' labelAlign='left' form={_form}>
          <Form.Item
            label='Sản phẩm'
            name='productId'
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              showSearch
              className='w-full'
              onChange={(value, option: any) => setPrice(option.item.price)}
              filterOption={(input, option) => (option?.name ?? '').toLowerCase().includes(input.toLowerCase())}
              options={_.map(_product, (item: any) => ({
                label: (
                  <div className='flex gap-x-3 items-center'>
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
                item,
              }))}
            />
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {() => (
              <Form.Item shouldUpdate className='!flex-1' label='Thời gian hiệu lực' name='time' rules={[{ required: true }]}>
                <DatePicker.RangePicker
                  disabled={!_form.getFieldValue('productId')}
                  className='w-full'
                  showTime={{ format: 'HH:mm:ss' }}
                  format='DD/MM/YYYY HH:mm:ss'
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            )}
          </Form.Item>
          <Form.Item hidden valuePropName='checked' name='isActive'>
            <Switch />
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => (
              <Form.Item
                className='!flex-1'
                label='Giá'
                name='price'
                rules={[
                  {
                    validator(rule, value) {
                      console.log('🚀 ~ file: index.tsx:338 ~ validator ~ _price:', _price);
                      if (value > _price) {
                        return Promise.reject(`Giá khuyến mãi không được lớn hơn ${utils.formatCurrency(_price)} VNĐ`);
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  disabled={!_form.getFieldValue('productId')}
                  formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                  addonAfter='VNĐ'
                  min={0}
                  controls={false}
                  className='w-full'
                />
              </Form.Item>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
