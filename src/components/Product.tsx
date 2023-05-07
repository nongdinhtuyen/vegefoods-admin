import { Button, Image } from 'antd';
import BigNumber from 'bignumber.js';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
import { useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'redux/store';

type Props = {
  name: string;
  img: string;
  price: number;
  unit: number;
  quantity: number;
  description: string;
  isCart?: boolean;
  id: number;
  priceSale: number;
  remain?: number;
};

export default function ProductComponent({ priceSale, name, img, price, unit, quantity, description, isCart = false, id, remain = 0 }: Props) {
  const [_count, setCount] = useState(quantity);
  const [_loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const renderPrice = () => {
    if (price > priceSale && priceSale > 0) {
      return (
        <>
          <del className='italic font-medium mr-2 text-gray-900'>{utils.formatCurrency(price)}</del>
          {utils.formatCurrency(priceSale)} VNĐ
        </>
      );
    } else {
      return <>{utils.formatCurrency(price)} VNĐ</>;
    }
  };

  const handleRedirect = () => {
    navigate(`/product/${id}`);
  };
  return (
    <div className='flex items-center gap-x-6'>
      <Image preview={false} height={110} width={110} className='object-contain' src={utils.baseUrlImage(img)} />
      <div className='flex flex-1 flex-wrap gap-y-1 text-base'>
        <div className='w-1/2 font-bold text-primary cursor-pointer' onClick={handleRedirect}>
          {name}
        </div>
        <div className='w-1/2 text-right'>Giá bán: {renderPrice()}</div>
        <div className='w-1/2'>
          {description ? `${description}. ` : ''}Đơn vị tính: {unit}
        </div>
        <div className='flex items-center justify-end w-1/2'>
          <div>x{_count}</div>
        </div>
      </div>
    </div>
  );
}
