import ProductDetail from './ProductDetail';
import UpdateProduct from './UpdateProduct';
import { Input, Modal, Select, Space, Table } from 'antd';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
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
  const [_productType, setProductType] = useState(-1);
  const [_search, setSearch] = useState('');
  const { isOpen: isOpenDetail, close: closeDetail, open: openDetail } = useToggle();
  const { isOpen: isOpenUpdate, close: closeUpdate, open: openUpdate } = useToggle();
  const [_item, setItem] = useState({});

  const getData = ({ current = _product.current, body = {} } = {}) => {
    setProduct((draft) => {
      draft.current = current;
    });
    dispatch(
      actions.actionGetProduct({
        params: {
          current,
          count: DEFAULT_SMALL_PAGE_SIZE,
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

  // const getProductType = ({ current = _product.current } = {}) => {
  //   setProduct((draft) => {
  //     draft.current = current;
  //   });
  //   dispatch(
  //     actions.actionGetProductType({
  //       params: {
  //         current,
  //         count: 100,
  //       },
  //       callbacks: {
  //         onSuccess({ data, total }) {
  //           setProductType((draft) => {
  //             draft.data = data;
  //           });
  //         },
  //       },
  //     })
  //   );
  // };

  useEffect(() => {
    getData();
    // getProductType();
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
          <Icon
            size={22}
            title='Sửa sản phẩm'
            className='cursor-pointer'
            onClick={() => {
              openUpdate();
              setItem(record);
            }}
            icon={'edit'}
          />
        </div>
      ),
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
            ..._.map(productType, (item: any) => ({
              value: item.id,
              label: item.name,
            })),
          ]}
          value={_productType}
          className='w-52'
          onSelect={(value: any) => {
            setProductType(value);
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
        rowKey={'id'}
        dataSource={_product.data}
        columns={columns}
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
      <UpdateProduct getData={getData} item={_item} isOpen={isOpenUpdate} close={closeUpdate} open={openUpdate} />
    </div>
  );
}
