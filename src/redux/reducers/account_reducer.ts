import { createReducer } from '@reduxjs/toolkit';
import consts from 'consts';
import actions from 'redux/actions/account';
import { createActionTypeOnSuccess } from 'redux/redux_helper';

import _ from 'lodash';

export interface IAccountState {
  profile: any;
  isLogin: boolean;
}

const initialState: IAccountState = {
  profile: {},
  isLogin: false,
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
    console.log('🚀 ~ file: account_reducer.ts:30 ~ builder.addCase ~ payload:', payload);
    state.profile = payload.data;
  });
});

export default accountReducer;
