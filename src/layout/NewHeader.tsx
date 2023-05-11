import { LayoutContext } from './LayoutContainer';
import routes from './routes';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Popover, Select, theme } from 'antd';
import { MenuProps } from 'antd/lib/menu';
import consts from 'consts';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineLogout } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import actions from 'redux/actions/account';
import { useAppDispatch, useAppSelector } from 'redux/store';
import styled from 'styled-components';

import _ from 'lodash';

const { Header } = Layout;

function NewHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.accountReducer);
  const [_title, setTitle] = useState('');

  const handleLogout = () => {
    dispatch(actions.actionLogout({}));
    navigate('/login');
  };

  const title = () => {
    const route = _.find(routes, (item) => {
      return location.pathname === '/' + item.path || item.path === '/:id';
    });
    setTitle(route?.title ?? '');
  };

  useEffect(() => {
    title();
  }, [location]);

  const items: MenuProps['items'] = [
    {
      key: '4',
      label: <div onClick={handleLogout}>Đăng xuất</div>,
      icon: <img width={22} src='images/logout.svg' />,
    },
  ];

  return (
    <Header className='header'>
      <div className='flex-1' />
      <div className='text uppercase'>{_title}</div>
      <div className='right' id='area'>
        <Dropdown menu={{ items }} placement='bottomRight'>
          <div className='w-10 text-left flex' onClick={() => navigate('profile')}>
            <Avatar className='text-[#f56a00] bg-[#fde3cf] cursor-pointer'>{profile.name.charAt(0)}</Avatar>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}

export default NewHeader;
