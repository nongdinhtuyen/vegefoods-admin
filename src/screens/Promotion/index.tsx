import { Avatar, Button, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Switch, Table, Tag } from 'antd';
import Item from 'antd/es/list/Item';
import BigNumber from 'bignumber.js';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
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
  const [_item, setItem] = useState<any>({});
  const [_id, setId] = useState(0);

  const getData = ({ current = _data.current } = {}) => {
    dispatch(
      actions.actionGetPromotion({
        params: {
          current,
          count: DEFAULT_PAGE_SIZE,
          isActive: -1,
        },
        callbacks: {
          onSuccess({ data, total }) {
            setData((draft) => {
              draft.data = data;
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
        <Switch
          checked={isActive}
          onChange={(checked) => {
            _form.setFieldsValue({
              ...record,
              isActive: checked,
              time: [dayjs(record.startDate * 1000), dayjs(record.endDate * 1000)],
            });
            setId(record.id);
            handleOk();
          }}
        />
      ),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Icon
          size={22}
          title='Sửa dơn hàng'
          className='cursor-pointer'
          onClick={() => {
            open();
            setId(record.id);
            _form.setFieldsValue({
              ...record,
              time: [dayjs(record.startDate * 1000), dayjs(record.endDate * 1000)],
            });
          }}
          icon={'edit'}
        />
      ),
    },
  ];

  const handleOk = () => {
    _form
      .validateFields()
      .then((values) => {
        const [startDate, endDate] = [dayjs(values.time[0]).unix(), dayjs(values.time[1]).unix()];
        const action = _id ? 'actionUpdatePromotion' : 'actionCreatePromotion';
        dispatch(
          actions[action]({
            params: {
              ...values,
              startDate,
              endDate,
              id: _id,
            },
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
      })
      .catch(console.log);
  };

  const handleClose = () => {
    _form.resetFields();
    close();
  };

  return (
    <div className='text-right'>
      <Button
        type='primary'
        onClick={() => {
          open();
          setId(0);
        }}
        className='mb-3'
      >
        Thêm khuyến mại
      </Button>
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
      <Modal width={600} onOk={() => handleOk()} title={_id ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'} onCancel={handleClose} open={isOpen}>
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
              onChange={(value, option: any) => setItem(option.item)}
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
          <Form.Item hidden name='isActive'>
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
                    validator(rule, value, callback) {
                      if (value > _item.price) {
                        return Promise.reject(`Giá khuyến mãi không được lớn hơn ${utils.formatCurrency(_item.price)} VNĐ`);
                      }
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
