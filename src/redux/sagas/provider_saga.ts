import rf from '../../requests/RequestFactory';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import {
  ADD_PRODUCT_OF_PROVIDER,
  CREATE_PROVIDER,
  DELETE_PROVIDER,
  GET_PRODUCT_OF_PROVIDER,
  GET_PROVIDER,
  UPDATE_PROVIDER,
} from 'redux/actions/provider';
import { unfoldSaga } from 'redux/redux_helper';

function* getProvider(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('ProviderRequest').getProvider(params), params);
        return data;
      },
      key: GET_PROVIDER,
    },
    callbacks
  );
}

function* updateProvider(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('ProviderRequest').updateProvider(params), params);
        return data;
      },
      key: UPDATE_PROVIDER,
    },
    callbacks
  );
}

function* createProvider(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('ProviderRequest').createProvider(params), params);
        return data;
      },
      key: CREATE_PROVIDER,
    },
    callbacks
  );
}

function* deleteProvider(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('ProviderRequest').deleteProvider(params), params);
        return data;
      },
      key: DELETE_PROVIDER,
    },
    callbacks
  );
}

function* addProductOfProvider(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('ProviderRequest').addProductOfProvider(params), params);
        return data;
      },
      key: ADD_PRODUCT_OF_PROVIDER,
    },
    callbacks
  );
}

function* getProductOfProvider(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('ProviderRequest').getProductOfProvider(params), params);
        return data;
      },
      key: GET_PRODUCT_OF_PROVIDER,
    },
    callbacks
  );
}

function* watchProvider() {
  yield takeLatest(GET_PROVIDER, getProvider);
  yield takeLatest(UPDATE_PROVIDER, updateProvider);
  yield takeLatest(CREATE_PROVIDER, createProvider);
  yield takeLatest(DELETE_PROVIDER, deleteProvider);
  yield takeLatest(ADD_PRODUCT_OF_PROVIDER, addProductOfProvider);
  yield takeLatest(GET_PRODUCT_OF_PROVIDER, getProductOfProvider);
}

export default function* rootSaga() {
  yield all([fork(watchProvider)]);
}
