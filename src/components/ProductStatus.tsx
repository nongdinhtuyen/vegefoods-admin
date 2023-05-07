import consts from 'consts';

import classNames from 'classnames';

export default function ProductStatus({ status, typePayment }) {
  const color = () => {
    switch (status) {
      case 0:
      case 1:
      case 2:
      case 3:
        return 'bg-[#34B0DD]';
      case 4:
        return 'bg-[#82AE46]';
      case 5:
      case 6:
        return 'bg-[#343A40]';
      default:
        return 'bg-[#82AE46]';
    }
  };
  const str = typePayment === consts.TYPE_PAYMENT_COD ? 'PRODUCT_STATUS_STRING' : 'PRODUCT_STATUS_STRING_ONLINE';
  return <div className={classNames('rounded-xl text-white px-2', color())}>{consts[str][status]}</div>;
}
