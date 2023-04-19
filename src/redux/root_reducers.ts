import accountReducer from './reducers/account_reducer';
import initReducer from './reducers/init_reducer';
import productReducer from './reducers/product_reducer';
import { combineReducers } from 'redux';

const rootReducers = combineReducers({
  initReducer,
  accountReducer,
  productReducer,
});

export default rootReducers;
