import { LayoutContext } from './LayoutContainer';
import routes from './routes';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Avatar, Layout, Popover, Select, theme } from 'antd';
import consts from 'consts';
import dayjs from 'dayjs';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineLogout } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import actions from 'redux/actions/account';
import { useAppDispatch } from 'redux/store';
import styled from 'styled-components';

import _ from 'lodash';

const { Header } = Layout;
const { Option } = Select;

function HeaderComponent() {
  const { collapsed, setCollapsed } = useContext(LayoutContext);
  // const { selfInfo } = useSelector((state: any) => state.admin);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(actions.actionLogout({}));
    navigate('/login');
  };

  const title = () => {
    const route = _.find(routes, (item) => location.pathname === '/' + item.path);
    return route?.title ?? '';
  };

  // const content = (
  //   <div>
  //     <div className="item">
  //       <div>{t('header.username')}</div>
  //       <div>{selfInfo.display_name}</div>
  //     </div>
  //     <div className="item">
  //       <div>{t('header.last_login')}</div>
  //       <div>
  //         {dayjs
  //           .unix(selfInfo.last_login)
  //           .format('HH:mm:ss DD/MM/YYYY')}
  //       </div>
  //     </div>
  //   </div>
  // );

  const logout = (
    <div onClick={handleLogout} className='flex justify-end'>
      <MdOutlineLogout title={'Đăng xuất'} className='logout-icon' />
    </div>
  );
  const content = (
    <div>
      <div className='item'>
        <div>Tên người dùng</div>
        {/* <div>{selfInfo.display_name}</div> */}
      </div>
      <div className='item'>
        <div>Lần đăng nhập cuối</div>
        {/* <div>
          {dayjs
            .unix(selfInfo.last_login)
            .format('HH:mm:ss DD/MM/YYYY')}
        </div> */}
      </div>
    </div>
  );

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Header className='header'>
      {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapsed(!collapsed),
      })} */}
      <div className='flex-1' />
      <div className='text'>{title()}</div>
      <div className='right' id='area'>
        <Popover title={logout} content={content} placement='bottomRight' overlayClassName='ant-popover-logout' arrow>
          {/* <Link to={`/admin/${selfInfo.pubkey}`}> */}
          <div className='w-10 text-left flex'>
            <Avatar
              className='text-[#f56a00] bg-[#fde3cf] cursor-pointer'
              // src={selfInfo.avatar}
            >
              U{/* {selfInfo?.display_name?.substring(0, 1)} */}
            </Avatar>
          </div>
          {/* </Link> */}
        </Popover>
      </div>
    </Header>
  );
}

export default HeaderComponent;
