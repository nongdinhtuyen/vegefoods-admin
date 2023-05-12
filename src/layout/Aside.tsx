import { LayoutContext } from './LayoutContainer';
import routes from './routes';
import { Badge, Layout, Menu, MenuProps, Space } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import React, { ReactNode, useContext, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'redux/store';
import styled from 'styled-components';

import _ from 'lodash';

const { Sider } = Layout;

const SiderWrapper = styled(Sider)`
  overflow: auto;
  height: 100vh;
  left: 0;
  top: 0;
  bottom: 0;
  .text {
    padding: 17px;
    font-family: 'Inter', sans-serif;
    font-weight: bold;
    font-size: 24px;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--root-primary);
  }
`;

export default function Aside() {
  const [_currentKey, setCurrentKey] = useState<string[]>(['/']);
  const { collapsed } = useContext(LayoutContext);
  const location = useLocation();
  const { adminAuth, isSuperAdmin } = useAppSelector((state) => state.accountReducer);

  function getItem(key: string, label: ReactNode, icon: ReactNode, children = null): ItemType[] | any {
    return { key, icon, children, label };
  }

  const renderLabel = (title: ReactNode, path: string) => (
    <Link className='child uppercase' to={path}>
      {title}
    </Link>
  );

  const renderChild = (children: any): any => {
    return _.map(children, (child, index) => ({
      key: `${child.path}-${index}`,
      label: (
        <Link className='child' to={child.path}>
          <Space>
            <Badge color='#adadad' />
            {child.title}
          </Space>
        </Link>
      ),
    }));
  };

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrentKey([e.key]);
  };
  useLayoutEffect(() => {
    const route = _.find(routes, (item) => {
      return location.pathname === '/' + item.path;
    });
    setCurrentKey(route?.path ? [route?.path] : []);
  }, [location]);
  const checkRoutes = _.filter(routes, (route) => _.includes(_.keys(adminAuth).toString(), route.auth));
  const items: ItemType[] | any = _.chain(isSuperAdmin ? routes : checkRoutes)
    .filter((route) => !route.isHidden)
    .map((route) => {
      if (route.children) {
        return getItem(route.key, route.title, route.icon, renderChild(route.children));
      }
      return getItem(route.key, renderLabel(route.title, route.path), route.icon);
    })
    .value();
  return (
    <SiderWrapper theme={'light'} width={270} trigger={null} collapsed={collapsed} collapsible>
      <div className='text'>VEGEFOODS</div>
      <Menu onClick={onClick} selectedKeys={_currentKey} mode='inline' items={items} />
    </SiderWrapper>
  );
}
