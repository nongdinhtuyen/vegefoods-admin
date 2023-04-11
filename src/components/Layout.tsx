import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, MenuProps, theme } from 'antd';
import { Menu } from 'antd';
import BigNumber from 'bignumber.js';
import utils from 'common/utils';
import Icon from 'icon-icomoon';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import store, { useAppSelector } from 'redux/store';

import _ from 'lodash';

const { Header, Content, Footer, Sider } = Layout;
export default function LayoutProvider() {
  const [_currentKey, setCurrentKey] = useState('/wallet');
  const state = useAppSelector((state) => state);
  const location = useLocation();
  const { t }: any = useTranslation();
  useLayoutEffect(() => {
    if (location.pathname !== _currentKey) {
      setCurrentKey(location.pathname);
    }
  }, [location]);

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrentKey(e.key);
  };

  const items: MenuProps['items'] = [
    'Home',
    'Order Manager',
    'Product Manager',
    'Category Manager',
    'Import Manager',
    'User Manager',
    'Discounts Manager',
    'Statistic',
    'Vendors Manager',
    'Sale Off Manager',
  ].map((text, index) => ({
    key: String(index + 1),
    label: text,
  }));

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout hasSider>
      <Sider
        width={270}
        trigger={null}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: colorBgContainer,
        }}
      >
        <div className='text-xl font-bold text-primary p-5 text-center'>VEGEFOODS</div>
        <Menu mode='inline' defaultSelectedKeys={['4']} items={items} />
      </Sider>
      <Layout className='ml-sider'>
        <Header className='bg-primary' />
        <Content className='bg-[#f0f2f5]' style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, textAlign: 'center', background: colorBgContainer }}>
            <p>long content</p>
            {
              // indicates very long content
              Array.from({ length: 100 }, (_, index) => (
                <React.Fragment key={index}>
                  {index % 20 === 0 && index ? 'more' : '...'}
                  <br />
                </React.Fragment>
              ))
            }
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
    // <Layout className='w-screen' hasSider>
    //   <Sider />
    //   <Layout className='!relative w-unset'>
    //     <HeaderComponent />
    //     <ContentWrapper>
    //       <div>
    //         <Outlet />
    //       </div>
    //     </ContentWrapper>
    //   </Layout>
    // </Layout>
  );
}
