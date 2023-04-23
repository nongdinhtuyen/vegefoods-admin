import rf from '../../requests/RequestFactory';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { GET_CUSTOMER, GET_CUSTOMER_ADDRESS, GET_CUSTOMER_STATICS, UPDATE_CUSTOMER_STATUS } from 'redux/actions/customer';
import { unfoldSaga } from 'redux/redux_helper';

function* getCustomer(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('CustomerRequest').getCustomer(params), params);
        return data;
      },
      key: GET_CUSTOMER,
    },
    callbacks
  );
}

function* getCustomerStatics(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('CustomerRequest').getCustomerStatics(params), params);
        return data;
      },
      key: GET_CUSTOMER_STATICS,
    },
    callbacks
  );
}

function* updateCustomerStatus(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('CustomerRequest').updateCustomerStatus(params), params);
        return data;
      },
      key: UPDATE_CUSTOMER_STATUS,
    },
    callbacks
  );
}

function* getCustomerAddress(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('CustomerRequest').getCustomerAddress(params), params);
        return data;
      },
      key: GET_CUSTOMER_ADDRESS,
    },
    callbacks
  );
}

function* watchCustomer() {
  yield takeLatest(GET_CUSTOMER, getCustomer);
  yield takeLatest(GET_CUSTOMER_STATICS, getCustomerStatics);
  yield takeLatest(GET_CUSTOMER_ADDRESS, getCustomerAddress);
  yield takeLatest(UPDATE_CUSTOMER_STATUS, updateCustomerStatus);
}

export default function* rootSaga() {
  yield all([fork(watchCustomer)]);
}
