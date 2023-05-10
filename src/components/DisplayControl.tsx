import React, { JSXElementConstructor } from 'react';
import { useAppSelector } from 'redux/store';

import _ from 'lodash';

type Props = {
  children: JSX.Element;
  path: string;
  action: string;
  render?: any;
};

export default function DisplayControl({ children, path, action, render }: Props): null | JSX.Element {
  const { admin_auth, profile } = useAppSelector((state) => state.accountReducer);
  if (_.includes(profile.typeAdmin, 0)) {
    return children;
  }
  const getAuth = admin_auth[`/v1/orderfood/admin/${path}`];
  if (getAuth && _.includes(_.values(getAuth), action.toUpperCase())) {
    return children;
  }
  if (render) {
    return render;
  }
  return null;
}
