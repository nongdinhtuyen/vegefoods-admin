import Icon from 'icon-icomoon';
import { BiUser, CiMoneyBill, FaHackerrank, FaProductHunt, IoPricetagsOutline, MdOutlineInventory, TbLayoutList } from 'react-icons/all';

const routes = [
  {
    title: 'HÓA ĐƠN BÁN HÀNG',
    icon: <CiMoneyBill size={24} />,
    key: '',
    path: '',
  },
  {
    title: 'DANH MỤC SẢN PHẨM',
    icon: <TbLayoutList size={20} />,
    key: 'productType',
    path: 'productType',
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
  {
    title: 'Danh sách khách hàng',
    icon: <BiUser size={22} />,
    key: 'customer',
    path: 'customer',
  },
  {
    title: 'Khuyến mãi',
    icon: <IoPricetagsOutline size={22} />,
    key: 'promotion',
    path: 'promotion',
  },
];

export default routes;
