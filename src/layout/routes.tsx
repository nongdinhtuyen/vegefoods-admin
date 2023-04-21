import Icon from 'icon-icomoon';
import { CiMoneyBill, FaProductHunt, FiPackage, MdOutlineAccountBalanceWallet, MdOutlineReport } from 'react-icons/all';

const routes = [
  {
    title: 'HÓA ĐƠN BÁN HÀNG',
    icon: <CiMoneyBill size={24} />,
    key: '',
    path: '',
  },
  {
    title: 'SẢN PHẨM',
    icon: <FaProductHunt size={20} />,
    key: 'product',
    path: 'product',
  },
  {
    title: 'NHÀ CUNG CẤP',
    icon: <Icon icon='provider' size={22} />,
    key: 'provider',
    path: 'provider',
  },
];

export default routes;
