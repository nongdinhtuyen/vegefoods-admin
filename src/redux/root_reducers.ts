import initReducer from './reducers/init_reducer';
import { combineReducers } from 'redux';

const rootReducers = combineReducers({
  initReducer,
});

export default rootReducers;
