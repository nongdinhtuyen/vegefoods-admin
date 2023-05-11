import Icon from 'icon-icomoon';
import {
  BiUser,
  CiMoneyBill,
  FaHackerrank,
  FaProductHunt,
  IoPricetagsOutline,
  MdOutlineAdminPanelSettings,
  MdOutlineInventory,
  TbLayoutList,
} from 'react-icons/all';

type RouteType = {
  title: string;
  icon: React.ReactNode;
  key: string;
  path: string;
  permissions?: any[];
  children?: any;
  auth?: string;
  isHidden?: boolean;
};

const routes: RouteType[] = [
  {
    title: 'HÓA ĐƠN BÁN HÀNG',
    icon: <CiMoneyBill size={24} />,
    key: '',
    path: '',
    auth: 'receipt',
  },
  {
    title: 'DANH MỤC SẢN PHẨM',
    icon: <TbLayoutList size={20} />,
    key: 'productType',
    path: 'productType',
    auth: 'product',
  },
  {
    title: 'SẢN PHẨM',
    icon: <FaProductHunt size={20} />,
    key: 'product',
    path: 'product',
    auth: 'product',
  },
  {
    title: 'NHÀ CUNG CẤP',
    icon: <Icon icon='provider' size={22} />,
    key: 'provider',
    path: 'provider',
    auth: 'provider',
  },
  {
    title: 'QUẢN LÝ KHO',
    icon: <MdOutlineInventory size={22} />,
    key: 'warehouse',
    path: 'warehouse',
    auth: 'warehouse',
  },
  {
    title: 'PHÂN HẠNG KHÁCH HÀNG',
    icon: <FaHackerrank size={22} />,
    key: 'rank',
    path: 'rank',
    auth: 'rank',
  },
  {
    title: 'Quản lý khách hàng',
    icon: <BiUser size={22} />,
    key: 'customer',
    path: 'customer',
    auth: 'customer',
  },
  {
    title: 'Khuyến mại',
    icon: <IoPricetagsOutline size={22} />,
    key: 'promotion',
    path: 'promotion',
    auth: 'promotion',
  },
  {
    title: 'QUẢN TRỊ TÀI KHOẢN',
    icon: <MdOutlineAdminPanelSettings size={22} />,
    key: 'admin',
    path: 'admin',
    auth: 'account',
  },
  {
    title: 'Hóa đơn',
    icon: <IoPricetagsOutline size={22} />,
    key: '/:id',
    path: '/:id',
    isHidden: true,
  },
  {
    title: 'Thông tin cá nhân',
    icon: <MdOutlineAdminPanelSettings size={22} />,
    key: 'profile',
    path: 'profile',
    isHidden: true,
  },
];

export default routes;
