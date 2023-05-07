import ProductStatus from './ProductStatus';
import { Button, Col, Divider, Empty, Form, Input, Modal, Pagination, Radio, Space } from 'antd';
import BigNumber from 'bignumber.js';
import utils from 'common/utils';
import ProductComponent from 'components/ProductComponent';
import { forwardRef } from 'react';

import _ from 'lodash';

function Receipt({ listReceipt }, ref) {
  const renderDiscount = () => {
    return new BigNumber(listReceipt.Salereceipt?.total).times(listReceipt.Salereceipt?.rankDiscount).div(100).toNumber();
  };
  return (
    <div ref={ref} className='bg-[#F2F2F2]'>
      <div className='max-w-4xl m-auto py-3'>
        <div key={listReceipt.Salereceipt?.id} className='rounded-md px-5 pt-3 bg-white mb-2'>
          <div className='flex justify-between'>
            <div>
              Đơn hàng <span className='font-semibold'>{listReceipt.Salereceipt?.id}</span> |{' '}
              {utils.formatTimeFromUnix(listReceipt.Salereceipt?.createDate, 'hh:mm:ss DD/MM/YYYY')}
            </div>
            <ProductStatus status={listReceipt.Salereceipt?.status} typePayment={listReceipt.Salereceipt?.typePayment} />
          </div>
          {_.map(listReceipt.Infosalereceipt, (item: any) => (
            <ProductComponent
              name={item.productList.name}
              img={item.productList.img}
              id={item.idProduct}
              price={item.price}
              priceSale={item.priceSale}
              unit={item.productList.unit}
              quantity={item.quantity}
              description={item.productList.description}
            />
          ))}
          <Divider className='m-0' />
          <div className='flex items-center justify-end my-4'>
            <div className='inline-grid grid-cols-auto gap-x-4 gap-y-2 text-gray-800 text-right items-center float-right'>
              <div className=''>Tổng tiền hàng:</div>
              <span className='text-base'>{utils.formatCurrency(listReceipt.Salereceipt?.total)} VNĐ</span>
              <div className=''>Phí vận chuyển:</div>
              <span className='text-base'>{utils.formatCurrency(listReceipt.Salereceipt?.feeShipping)} VNĐ</span>
              {listReceipt.Salereceipt?.rankDiscount > 0 && (
                <>
                  <div>Giảm giá {`( -${listReceipt.Salereceipt?.rankDiscount}%)`}</div>
                  <span className='text-black text-base'>- {utils.formatCurrency(renderDiscount())} VNĐ</span>
                </>
              )}
              <div className=''>Tổng thanh toán: </div>
              <div>
                <span className='text-2xl text-primary'>{utils.formatCurrency(listReceipt.Salereceipt?.totalAfterSale)}</span> VNĐ
              </div>
            </div>
          </div>
          <Divider className='m-0' />
        </div>
      </div>
    </div>
  );
}

export default forwardRef(Receipt);
