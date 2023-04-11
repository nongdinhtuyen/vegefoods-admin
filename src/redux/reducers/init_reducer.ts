import actions from '../actions/init';
import { createReducer } from '@reduxjs/toolkit';

export interface IInitState {
  inited: boolean;
}

const initialState: IInitState = {
  inited: false,
};

const initReducer = createReducer(initialState, (builder) => {
  builder.addCase(actions.actionInitSucceed, (state) => {
    state.inited = true;
  });
});

export default initReducer;
