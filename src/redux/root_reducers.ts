import accountReducer from './reducers/account_reducer';
import initReducer from './reducers/init_reducer';
import { combineReducers } from 'redux';

const rootReducers = combineReducers({
  initReducer,
  accountReducer,
});

export default rootReducers;
