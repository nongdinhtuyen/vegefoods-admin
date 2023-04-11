import initSaga from './sagas/init_saga';
import UserSaga from './sagas/user_saga';
import { all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([initSaga(), UserSaga()]);
}
