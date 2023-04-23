import accountSaga from './sagas/account_saga';
import customerSaga from './sagas/customer_saga';
import initSaga from './sagas/init_saga';
import productSaga from './sagas/product_saga';
import providerSaga from './sagas/provider_saga';
import rankSaga from './sagas/rank_saga';
import receiptSaga from './sagas/receipt_saga';
import warehouseSaga from './sagas/warehouse_saga';
import { all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([initSaga(), accountSaga(), receiptSaga(), productSaga(), providerSaga(), rankSaga(), warehouseSaga(), customerSaga()]);
}
