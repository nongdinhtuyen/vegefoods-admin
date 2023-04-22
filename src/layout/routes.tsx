import Icon from 'icon-icomoon';
import { CiMoneyBill, FaHackerrank, FaProductHunt, MdOutlineInventory, MdOutlineReport } from 'react-icons/all';

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
  {
    title: 'QUẢN LÝ KHO',
    icon: <MdOutlineInventory size={22} />,
    key: 'warehouse',
    path: 'warehouse',
  },
  {
    title: 'PHÂN HẠNG KHÁCH HÀNG',
    icon: <FaHackerrank size={22} />,
    key: 'rank',
    path: 'rank',
  },
];

export default routes;
