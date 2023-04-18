import { Input, Modal, Select, Space, Table } from 'antd';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
import consts, { DEFAULT_PAGE_SIZE } from 'consts';
import useToggle from 'hooks/useToggle';
import Icon from 'icon-icomoon';
import React, { useEffect, useState } from 'react';
import actions from 'redux/actions/product';
import { useAppDispatch } from 'redux/store';
import styled from 'styled-components';
import { useImmer } from 'use-immer';

import _ from 'lodash';

export default function Category() {
  const dispatch = useAppDispatch();
  const [_product, setProduct] = useImmer({
    total: 0,
    current: 1,
    data: [],
  });
  const [_productType, setProductType] = useImmer({
    data: [],
    value: -1,
  });
  const [_search, setSearch] = useState('');

  const getData = ({ current = _product.current, body = {} } = {}) => {
    setProduct((draft) => {
      draft.current = current;
    });
    dispatch(
      actions.actionGetProduct({
        params: {
          current,
          count: DEFAULT_PAGE_SIZE,
          body: {
            name: _search,
            remaining: -1,
            type_product: [],
            ...body,
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

  const getProductType = ({ current = _product.current } = {}) => {
    setProduct((draft) => {
      draft.current = current;
    });
    dispatch(
      actions.actionGetProductType({
        params: {
          current,
          count: 100,
        },
        callbacks: {
          onSuccess({ data, total }) {
            setProductType((draft) => {
              draft.data = data;
            });
          },
        },
      })
    );
  };

  useEffect(() => {
    getData();
    getProductType();
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
      width: '10%',
      align: 'center',
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      width: '5%',
      align: 'center',
      title: 'Hình ảnh',
      dataIndex: 'img',
      key: 'img',
      render: (img) => <CustomImage src={utils.baseUrlImage(img)} preview={true} />,
    },
    {
      width: '5%',
      align: 'center',
      title: 'Đơn vị tính',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Danh mục',
      dataIndex: 'productTypeList',
      key: 'productTypeList',
      render: (productTypeList) => productTypeList.name,
    },
    {
      width: '10%',
      align: 'center',
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      render: utils.formatCurrency,
    },
    {
      width: '10%',
      align: 'center',
      title: 'Đánh giá trung bình',
      dataIndex: 'rateAVG',
      key: 'rateAVG',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Còn lại',
      dataIndex: 'remain',
      key: 'remain',
    },
    {
      width: '5%',
      align: 'center',
      title: 'Hành động',
      dataIndex: 'Salereceipt',
      key: 'Salereceipt',
      render: (Salereceipt) => <Icon size={22} className='cursor-pointer' icon={'edit'} />,
    },
  ];

  const handleSearch = (value) => {
    getData({
      body: {
        name: value,
      },
    });
  };

  return (
    <div>
      <Space className='mb-3'>
        <Select
          options={[
            { label: 'Tất cả', value: -1 },
            ..._.map(_productType.data, (item: any) => ({
              value: item.id,
              label: item.name,
            })),
          ]}
          value={_productType}
          className='w-52'
          onSelect={(value: any) => {
            setProductType((draft) => {
              draft.value = value;
            });
            getData({
              current: 1,
              body: {
                type_product: value !== -1 ? [value] : [],
              },
            });
          }}
        />
        <Input.Search onChange={(e) => setSearch(e.target.value)} className='w-80' onSearch={handleSearch} placeholder='Tìm kiếm' />
      </Space>
      <Table
        bordered
        dataSource={_product.data}
        columns={columns}
        pagination={{
          onChange: (page) => getData({ current: page }),
          showSizeChanger: false,
          current: _product.current,
          pageSize: DEFAULT_PAGE_SIZE,
          total: _product.total,
          hideOnSinglePage: true,
        }}
      />
    </div>
  );
}
