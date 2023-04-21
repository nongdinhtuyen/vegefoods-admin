import rf from '../../requests/RequestFactory';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { CREATE_PROVIDER, DELETE_PROVIDER, GET_PROVIDER, UPDATE_PROVIDER } from 'redux/actions/provider';
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

function* watchProvider() {
  yield takeLatest(GET_PROVIDER, getProvider);
  yield takeLatest(UPDATE_PROVIDER, updateProvider);
  yield takeLatest(CREATE_PROVIDER, createProvider);
  yield takeLatest(DELETE_PROVIDER, deleteProvider);
}

export default function* rootSaga() {
  yield all([fork(watchProvider)]);
}
