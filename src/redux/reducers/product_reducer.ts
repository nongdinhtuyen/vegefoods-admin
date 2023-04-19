import { createReducer } from '@reduxjs/toolkit';
import consts from 'consts';
import actions from 'redux/actions/product';
import { createActionTypeOnSuccess } from 'redux/redux_helper';

import _ from 'lodash';

export interface IAccountState {
  productType: any;
}

const initialState: IAccountState = {
  productType: [],
};

const productReducer = createReducer(initialState, (builder) => {
  builder.addCase(createActionTypeOnSuccess(actions.actionGetProductType), (state, { payload }: any) => {
    state.productType = payload.data;
  });
});

export default productReducer;
