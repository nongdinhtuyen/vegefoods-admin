import Aside from './Aside';
import HeaderComponent from './HeaderComponent';
import { ConfigProvider, Layout } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import consts from 'consts';
import dayjs from 'dayjs';
import validateMessages from 'langs/validateMessages';
import React, { createContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import _ from 'lodash';

const { Content } = Layout;
const ContentWrapper = styled(Content)`
  margin-top: 50px;
  overflow: auto;
  height: calc(100vh - 64px);
  & > div:first-of-type {
    padding: 16px;
    position: relative;
    overflow: auto;
    min-height: -webkit-fill-available;
    min-height: -moz-available;
    min-height: fill-available;
  }
`;

export const LayoutContext = createContext({
  setCollapsed: (value: boolean) => {
    console.log('setCollapsed');
  },
  collapsed: false,
});

function LayoutContainer() {
  const [_collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    dayjs.locale('vi');
  }, ['vi']);

  return (
    <LayoutContext.Provider
      value={{
        collapsed: _collapsed,
        setCollapsed,
      }}
    >
      <ConfigProvider
        theme={{
          hashed: false,
        }}
        locale={viVN}
        form={{ validateMessages }}
      >
        <Layout className='w-screen' hasSider>
          <Aside />
          <Layout className='!relative w-unset'>
            <HeaderComponent />
            <ContentWrapper>
              <div>
                <Outlet />
              </div>
            </ContentWrapper>
          </Layout>
        </Layout>
      </ConfigProvider>
    </LayoutContext.Provider>
  );
}

export default LayoutContainer;
