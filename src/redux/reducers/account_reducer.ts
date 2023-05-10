import { createReducer } from '@reduxjs/toolkit';
import consts from 'consts';
import actions from 'redux/actions/account';
import { createActionTypeOnSuccess } from 'redux/redux_helper';

import _ from 'lodash';

export interface IAccountState {
  profile: any;
  auth: any;
  isLogin: boolean;
  admin_auth: any;
}

const initialState: IAccountState = {
  profile: {},
  auth: {},
  isLogin: false,
  admin_auth: {},
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
    let admin_auth: any = [];
    const newAuth = _.map(state.profile.typeAdmin, (value) => payload.data[value]);
    console.log('🚀 ~ file: account_reducer.ts:37 ~ builder.addCase ~ newAuth:', newAuth);
    // const data = state.profile.typeAdmin[0] === 0 ? payload.data : newAuth;
    admin_auth = _.chain(newAuth)
      // .values()
      .reduce((obj, val) => {
        _.mergeWith(obj, val, (objValue, srcValue) => (objValue ? [...new Set(srcValue.concat(objValue))] : srcValue));
        return obj;
      }, {})
      .value();

    state.auth = payload.data;
    state.admin_auth = admin_auth;
  });
});

export default accountReducer;
