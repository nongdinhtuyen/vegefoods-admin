import { createReducer } from '@reduxjs/toolkit';
import consts from 'consts';
import actions from 'redux/actions/account';
import { createActionTypeOnSuccess } from 'redux/redux_helper';

import _ from 'lodash';

export interface IAccountState {
  profile: any;
  auth: any;
  isLogin: boolean;
  adminAuth: any;
  isAdmin: boolean;
}

const initialState: IAccountState = {
  profile: {},
  auth: {},
  isLogin: false,
  isAdmin: false,
  adminAuth: {},
};

const accountReducer = createReducer(initialState, (builder) => {
  builder.addCase(createActionTypeOnSuccess(actions.actionLogin), (state, { payload }: any) => {
    state.isLogin = true;
  });
  builder.addCase(actions.actionLogout, (state, { payload }: any) => {
    localStorage.removeItem(consts.SESSION);
    state.profile = {};
    state.isLogin = false;
  });
  builder.addCase(createActionTypeOnSuccess(actions.actionGetUserInfo), (state, { payload }: any) => {
    state.profile = payload.data;
  });
  builder.addCase(createActionTypeOnSuccess(actions.actionGetAuth), (state, { payload }: any) => {
    let adminAuth: any = [];
    const newAuth = _.map(state.profile.typeAdmin, (value) => payload.data[value]);
    // const data = state.profile.typeAdmin[0] === 0 ? payload.data : newAuth;
    adminAuth = _.chain(newAuth)
      // .values()
      .reduce((obj, val) => {
        _.mergeWith(obj, val, (objValue, srcValue) => (objValue ? [...new Set(srcValue.concat(objValue))] : srcValue));
        return obj;
      }, {})
      .value();
    state.isAdmin = _.includes(state.profile.typeAdmin, 0);
    state.auth = payload.data;
    state.adminAuth = adminAuth;
  });
});

export default accountReducer;
