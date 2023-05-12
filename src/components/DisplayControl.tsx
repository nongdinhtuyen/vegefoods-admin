import React, { JSXElementConstructor } from 'react';
import { useAppSelector } from 'redux/store';

import _ from 'lodash';

type Props = {
  children: JSX.Element;
  path: string;
  action: string;
  render?: React.ReactNode;
};

export default function DisplayControl({ children, path, action, render }: Props): null | JSX.Element {
  const { adminAuth, profile, isSuperAdmin } = useAppSelector((state) => state.accountReducer);
  if (isSuperAdmin) {
    return children;
  }
  const getAuth = adminAuth[`/v1/orderfood/admin/${path}`];
  if (getAuth && _.includes(_.values(getAuth), action.toUpperCase())) {
    return children;
  }
  if (render) {
    return <>{render}</>;
  }
  return null;
}
