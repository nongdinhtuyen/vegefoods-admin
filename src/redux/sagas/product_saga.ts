import rf from '../../requests/RequestFactory';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import {
  CREATE_PRODUCT,
  CREATE_PRODUCT_TYPE,
  GET_PRODUCT,
  GET_PRODUCT_BY_ID,
  GET_PRODUCT_IMAGE_BY_ID,
  GET_PRODUCT_TYPE,
  UPDATE_PRODUCT_BY_ID,
  UPDATE_PRODUCT_TYPE,
} from 'redux/actions/product';
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

function* createProduct(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('ProductRequest').createProduct(params), params);
        return data;
      },
      key: CREATE_PRODUCT,
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

function* updateProductById(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('ProductRequest').updateProductById(params), params);
        return data;
      },
      key: UPDATE_PRODUCT_BY_ID,
    },
    callbacks
  );
}

function* getProductById(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('ProductRequest').getProductById(params), params);
        return data;
      },
      key: GET_PRODUCT_BY_ID,
    },
    callbacks
  );
}

function* getProductImageById(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('ProductRequest').getProductImageById(params), params);
        return data;
      },
      key: GET_PRODUCT_IMAGE_BY_ID,
    },
    callbacks
  );
}

function* createProductType(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('ProductRequest').createProductType(params), params);
        return data;
      },
      key: CREATE_PRODUCT_TYPE,
    },
    callbacks
  );
}

function* watchProduct() {
  yield takeLatest(GET_PRODUCT, getProduct);
  yield takeLatest(CREATE_PRODUCT, createProduct);
  yield takeLatest(GET_PRODUCT_TYPE, getProductType);
  yield takeLatest(UPDATE_PRODUCT_TYPE, updateProductType);
  yield takeLatest(UPDATE_PRODUCT_BY_ID, updateProductById);
  yield takeLatest(GET_PRODUCT_BY_ID, getProductById);
  yield takeLatest(GET_PRODUCT_IMAGE_BY_ID, getProductImageById);
  yield takeLatest(CREATE_PRODUCT_TYPE, createProductType);
}

export default function* rootSaga() {
  yield all([fork(watchProduct)]);
}
