import { BASEURL } from '../../bootstrap';
import rf from '../../requests/RequestFactory';
import { GET_USER_INFO, LOGIN, LOGOUT, REGISTER, UPDATE_PROFILE } from '../actions/user';
import { saveMasterData } from './init_saga';
import axios from 'axios';
import utils from 'common/utils';
import { all, call, fork, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { createActionTypeOnSuccess, unfoldSaga } from 'redux/redux_helper';

import _ from 'lodash';

function* login(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const resp = yield call((params) => rf.getRequest('UserRequest').login(params), params);
        window.axios.defaults.headers['apikey'] = resp.data.token;
        localStorage.setItem('session', JSON.stringify(resp.data));
        yield saveMasterData(resp.data.id);
        return resp;
      },
      key: LOGIN,
    },
    callbacks
  );
}

function* register(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('UserRequest').register(params), params);
        return data;
      },
      key: REGISTER,
    },
    callbacks
  );
}

function* getUsetInfo(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('UserRequest').getUserInfo(params), params);
        return data;
      },
      key: GET_USER_INFO,
    },
    callbacks
  );
}

function* updateProfile(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('UserRequest').updateProfile(params), params);
        return data;
      },
      key: UPDATE_PROFILE,
    },
    callbacks
  );
}

function* watchUser() {
  yield takeLatest(LOGIN, login);
  yield takeLatest(REGISTER, register);
  yield takeLatest(GET_USER_INFO, getUsetInfo);
  yield takeLatest(UPDATE_PROFILE, updateProfile);
}

export default function* rootSaga() {
  yield all([fork(watchUser)]);
}
