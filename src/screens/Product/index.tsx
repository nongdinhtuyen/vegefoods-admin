import ProductDetail from './ProductDetail';
import UpdateProduct from './UpdateProduct';
import { Button, Input, Modal, Select, Space, Table } from 'antd';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
import DisplayControl from 'components/DisplayControl';
import consts, { DEFAULT_SMALL_PAGE_SIZE } from 'consts';
import useToggle from 'hooks/useToggle';
import Icon from 'icon-icomoon';
import React, { useEffect, useState } from 'react';
import { AiOutlineFileText } from 'react-icons/all';
import actions from 'redux/actions/product';
import { useAppDispatch, useAppSelector } from 'redux/store';
import styled from 'styled-components';
import { useImmer } from 'use-immer';

import _ from 'lodash';

export default function Category() {
  const dispatch = useAppDispatch();
  const { productType } = useAppSelector((state) => state.productReducer);
  const [_product, setProduct] = useImmer({
    total: 0,
    current: 1,
    data: [],
  });
  const [_productType, setProductType] = useState(_.map(productType, (item: any) => item.id));
  const [_search, setSearch] = useState('');
  const { isOpen: isOpenDetail, close: closeDetail, open: openDetail } = useToggle();
  const { isOpen: isOpenUpdate, close: closeUpdate, open: openUpdate } = useToggle();
  const [_item, setItem] = useState({});
  const [_isCreate, setIsCreate] = useState(false);
  const [_remain, setRemain] = useState(-1);

  const getData = ({ current = _product.current, name = _search, type_product = _productType, remain = _remain } = {}) => {
    setProduct((draft) => {
      draft.current = current;
    });
    setRemain(remain);
    setProductType(type_product);
    dispatch(
      actions.actionGetProduct({
        params: {
          current,
          count: DEFAULT_SMALL_PAGE_SIZE,
          body: {
            remaining: remain,
            name,
            type_product,
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
      render: (img) => <CustomImage width={70} height={70} className='object-contain' src={utils.baseUrlImage(img)} preview={true} />,
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
      title: 'Giá bán (VNĐ)',
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
      render: (rateAVG) => utils.formatCurrency(rateAVG, 1),
    },
    {
      width: '10%',
      align: 'center',
      title: 'Còn lại',
      dataIndex: 'remain',
      key: 'remain',
      sorter: true,
    },
    {
      width: '5%',
      align: 'center',
      title: 'Hành động',
      dataIndex: 'products',
      key: 'action',
      render: (products, record) => (
        <div className='flex items-center gap-x-2 justify-center'>
          <AiOutlineFileText
            title='Chi tiết sản phẩm'
            className='cursor-pointer'
            size={24}
            onClick={() => {
              openDetail();
              setItem(record);
            }}
          />
          <DisplayControl path={'product/:id'} action='put'>
            <Icon
              size={22}
              title='Sửa sản phẩm'
              className='cursor-pointer'
              onClick={() => {
                openUpdate();
                setIsCreate(false);
                setItem(record);
              }}
              icon={'edit'}
            />
          </DisplayControl>
        </div>
      ),
    },
  ];

  const handleSearch = (value) => {
    getData({
      current: 1,
      name: value,
    });
  };

  const handleCreate = () => {
    setIsCreate(true);
    openUpdate();
  };

  return (
    <>
      <div className='flex items-center justify-between'>
        <Space className='mb-3'>
          <Select
            mode='multiple'
            className='w-96'
            showArrow={false}
            maxTagCount='responsive'
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={[
              ..._.map(productType, (item: any) => ({
                value: item.id,
                label: item.name,
              })),
            ]}
            value={_productType}
            onChange={(value: any) => {
              setProductType(value);
              getData({
                current: 1,
                type_product: value,
              });
            }}
          />
          <Input.Search onChange={(e) => setSearch(e.target.value)} className='w-80' onSearch={handleSearch} placeholder='Tìm kiếm' />
        </Space>
        <DisplayControl path={'product'} action='post'>
          <Button type='primary' onClick={handleCreate}>
            Thêm sản phẩm
          </Button>
        </DisplayControl>
      </div>
      <Table
        bordered
        rowKey={'id'}
        dataSource={_product.data}
        columns={columns}
        onChange={(pagination, filters, sorter: any) => {
          const sort = {
            undefined: -1,
            ascend: 1,
            descend: 0,
          };
          getData({ current: pagination.current, remain: sort[sorter.order] });
        }}
        pagination={{
          onChange: (page) => getData({ current: page }),
          showSizeChanger: false,
          current: _product.current,
          pageSize: DEFAULT_SMALL_PAGE_SIZE,
          total: _product.total,
          hideOnSinglePage: true,
        }}
      />
      <ProductDetail item={_item} isOpen={isOpenDetail} close={closeDetail} open={openDetail} />
      <UpdateProduct getData={getData} isCreate={_isCreate} item={_item} isOpen={isOpenUpdate} close={closeUpdate} />
    </>
  );
}
