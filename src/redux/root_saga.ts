import accountSaga from './sagas/account_saga';
import initSaga from './sagas/init_saga';
import productSaga from './sagas/product_saga';
import receiptSaga from './sagas/receipt_saga';
import { all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([initSaga(), accountSaga(), receiptSaga(), productSaga()]);
}
