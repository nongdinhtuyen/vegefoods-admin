import rf from '../../requests/RequestFactory';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { GET_PRODUCT, GET_PRODUCT_TYPE, UPDATE_PRODUCT_TYPE } from 'redux/actions/product';
import { unfoldSaga } from 'redux/redux_helper';

function* getProduct(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('ProductRequest').getProduct(params), params);
        return data;
      },
      key: GET_PRODUCT,
    },
    callbacks
  );
}

function* getProductType(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('ProductRequest').getProductType(params), params);
        return data;
      },
      key: GET_PRODUCT_TYPE,
    },
    callbacks
  );
}

function* updateProductType(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('ProductRequest').updateProductType(params), params);
        return data;
      },
      key: UPDATE_PRODUCT_TYPE,
    },
    callbacks
  );
}

function* watchProduct() {
  yield takeLatest(GET_PRODUCT, getProduct);
  yield takeLatest(GET_PRODUCT_TYPE, getProductType);
  yield takeLatest(UPDATE_PRODUCT_TYPE, updateProductType);
}

export default function* rootSaga() {
  yield all([fork(watchProduct)]);
}
