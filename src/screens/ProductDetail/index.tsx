import actions from '../../redux/actions/receipt';
import { Button, Divider, Empty, Steps } from 'antd';
import BigNumber from 'bignumber.js';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
import ProductComponent from 'components/ProductComponent';
import consts from 'consts';
import { useEffect } from 'react';
import { FiMapPin } from 'react-icons/all';
import { BsShieldCheck } from 'react-icons/bs';
import { CgNotes } from 'react-icons/cg';
import { FaShippingFast } from 'react-icons/fa';
import { IoChevronBackSharp } from 'react-icons/io5';
import { MdOutlineCancel } from 'react-icons/md';
import { TbClipboardList } from 'react-icons/tb';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/store';
import styled from 'styled-components';
import { useImmer } from 'use-immer';

import _ from 'lodash';

export default function ProductDetail({ product }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [_receipt, setReceipt] = useImmer<{ data: any; total: number }>({
    data: {
      inforeceipt: [],
      receipt: {},
    },
    total: 0,
  });

  return (
    <div className='bg-[#F2F2F2]'>
      <div className='container m-auto'>
        <div className=' bg-white rounded-lg'>
          <div className='px-5'>
            <div>{product.saleReceiptList?.note}</div>
            {_.map(product.Infosalereceipt, (item: any) => (
              <div key={item.idProduct} className='rounded-md bg-white'>
                <ProductComponent
                  img={item.productList.img}
                  price={item.price}
                  id={item.idProduct}
                  priceSale={item.priceSale}
                  unit={item.productList.unit}
                  quantity={item.quantity}
                  name={item.productList.name}
                  description={item.productList.description}
                />
                <Divider className='m-0' />
              </div>
            ))}
            <div className='py-2 text-right text-lg'>
              Tổng tiền:{' '}
              {!new BigNumber(product.Salereceipt.total).isEqualTo(0) && (
                <del className='italic font-medium mr-2 text-gray-900'>{utils.formatCurrency(product.Salereceipt.total)}</del>
              )}
              <span className='font-bold text-primary'>{utils.formatCurrency(product.Salereceipt.totalAfterSale)}</span> VNĐ
            </div>
            <Divider className='mb-2 mt-0' />
          </div>
        </div>
      </div>
    </div>
  );
}
