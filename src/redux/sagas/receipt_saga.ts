import rf from '../../requests/RequestFactory';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { GET_RECEIPT, RECEIPT_FINANCIAL, RECEIPT_ORDER, RECEIPT_WAREHOUSE } from 'redux/actions/receipt';
import { unfoldSaga } from 'redux/redux_helper';

function* getReceipt(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('ReceiptRequest').getReceipt(params), params);
        return data;
      },
      key: GET_RECEIPT,
    },
    callbacks
  );
}

function* receiptFinancial(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('ReceiptRequest').receiptFinancial(params), params);
        return data;
      },
      key: RECEIPT_FINANCIAL,
    },
    callbacks
  );
}

function* receiptOrder(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('ReceiptRequest').receiptOrder(params), params);
        return data;
      },
      key: RECEIPT_ORDER,
    },
    callbacks
  );
}

function* receiptWarehouse(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('ReceiptRequest').receiptWarehouse(params), params);
        return data;
      },
      key: RECEIPT_WAREHOUSE,
    },
    callbacks
  );
}

function* watchReceipt() {
  yield takeLatest(GET_RECEIPT, getReceipt);
  yield takeLatest(RECEIPT_FINANCIAL, receiptFinancial);
  yield takeLatest(RECEIPT_ORDER, receiptOrder);
  yield takeLatest(RECEIPT_WAREHOUSE, receiptWarehouse);
}

export default function* rootSaga() {
  yield all([fork(watchReceipt)]);
}
