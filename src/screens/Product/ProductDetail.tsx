import { Avatar, Button, Col, Divider, Drawer, List, Row } from 'antd';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
import consts, { DEFAULT_PAGE_SIZE } from 'consts';
import React, { useEffect, useState } from 'react';
import actions from 'redux/actions/product';
import { useAppDispatch } from 'redux/store';
import styled from 'styled-components';

import _ from 'lodash';

const DrawWrapper = styled(Drawer)`
  .site-description-item-profile-wrapper {
    margin-bottom: 7px;
    font-size: 14px;
    line-height: 1.5715;
  }

  .ant-drawer-body p.site-description-item-profile-p {
    display: block;
    margin-bottom: 16px;
    color: #000;
    font-weight: 600;
    font-size: 16px;
    line-height: 1.5715;
  }

  .site-description-item-profile-p-label {
    display: inline-block;
    margin-right: 8px;
    color: rgba(0, 0, 0, 0.85);
  }
`;

interface DescriptionItemProps {
  title: string;
  content: React.ReactNode;
}

const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
  <div className='site-description-item-profile-wrapper'>
    <p className='site-description-item-profile-p-label'>{title}:</p>
    {content}
  </div>
);

const ProductDetail = ({ isOpen, close, open, item }: any) => {
  const [_images, setImages] = useState({});
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (item.id && isOpen) {
      dispatch(
        actions.actionGetProductImageById({
          params: {
            id: item.id,
          },
          callbacks: {
            onSuccess({ data }) {
              setImages(data);
            },
          },
        })
      );
    }
  }, [item.id, isOpen]);

  return (
    <DrawWrapper width={640} title='Chi tiết sản phẩm' placement='right' onClose={close} open={isOpen} extra={<Button>Cập nhật sản phẩm</Button>}>
      <p className='site-description-item-profile-p' style={{ marginBottom: 24 }}>
        Thông tin
      </p>
      <Row>
        <Col span={12}>
          <DescriptionItem title='Tên sản phẩm' content={item.name} />
        </Col>
        <Col span={12}>
          <DescriptionItem title='Danh mục' content={item.productTypeList?.name} />
        </Col>
        <Col span={24}>
          <DescriptionItem title='Miêu tả' content={item.description} />
        </Col>
        <Col span={12}>
          <DescriptionItem title='Giá bán' content={utils.formatCurrency(item.price)} />
        </Col>
        <Col span={12}>
          <DescriptionItem title='Đơn vị tính' content={item.unit} />
        </Col>
        <Col span={12}>
          <DescriptionItem title='Đánh giá trung bình' content={item.rateAVG} />
        </Col>
        <Col span={12}>
          <DescriptionItem title='Còn lại' content={utils.formatCurrency(item.remain)} />
        </Col>
        <Col span={24}>
          <DescriptionItem title='Đã bán' content={utils.formatCurrency(item.sold)} />
        </Col>
      </Row>
      <Divider className='mt-2' />
      <p className='site-description-item-profile-p' style={{ marginBottom: 24 }}>
        Hình ảnh
      </p>
      <div className='flex flex-wrap gap-x-4'>
        {_.map(_images, (item: any) => (
          <div>
            <CustomImage height={150} width={150} src={utils.baseUrlImage(item.img)} key={item.id} className='object-contain' />
            <div className='text-center mt-1'>Ảnh {item.id}</div>
          </div>
        ))}
      </div>
      <Divider />
    </DrawWrapper>
  );
};

export default ProductDetail;
