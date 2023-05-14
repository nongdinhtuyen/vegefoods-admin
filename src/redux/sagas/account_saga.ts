import { BASEURL } from '../../bootstrap';
import rf from '../../requests/RequestFactory';
import {
  ADD_ROLE_FOR_ADMIN,
  CHANGE_PASS,
  CREATE_ADMIN,
  GET_ACCOUNT,
  GET_ADMIN_BY_ID,
  GET_AUTH,
  GET_USER_INFO,
  LOGIN,
  LOGOUT,
  REGISTER,
  UPDATE_ADMIN_INFO,
  UPDATE_ADMIN_STATUS,
  UPDATE_PROFILE,
} from '../actions/account';
import { saveMasterData } from './init_saga';
import axios from 'axios';
import utils from 'common/utils';
import consts from 'consts';
import { all, call, fork, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { createActionTypeOnSuccess, unfoldSaga } from 'redux/redux_helper';

import _ from 'lodash';

function* login(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const resp = yield call((params) => rf.getRequest('AccountRequest').login(params), params);
        window.axios.defaults.headers['apikey'] = resp.data.token;
        localStorage.setItem(consts.SESSION, JSON.stringify(resp.data));
        yield saveMasterData(resp.data.id);
        return resp;
      },
      key: LOGIN,
    },
    callbacks
  );
}

function* getAccount(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const resp = yield call((params) => rf.getRequest('AccountRequest').getAccount(params), params);
        return resp;
      },
      key: GET_ACCOUNT,
    },
    callbacks
  );
}

function* updateAdminStatus(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const resp = yield call((params) => rf.getRequest('AccountRequest').updateAdminStatus(params), params);
        return resp;
      },
      key: UPDATE_ADMIN_STATUS,
    },
    callbacks
  );
}

function* updateAdminInfo(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const resp = yield call((params) => rf.getRequest('AccountRequest').updateAdminInfo(params), params);
        return resp;
      },
      key: UPDATE_ADMIN_INFO,
    },
    callbacks
  );
}

function* getAuth(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const resp = yield call((params) => rf.getRequest('AccountRequest').getAuth(params), params);
        return resp;
      },
      key: GET_AUTH,
    },
    callbacks
  );
}

function* createAccount(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const resp = yield call((params) => rf.getRequest('AccountRequest').createAdmin(params), params);
        return resp;
      },
      key: CREATE_ADMIN,
    },
    callbacks
  );
}

function* getAdminById(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const resp = yield call((params) => rf.getRequest('AccountRequest').getAdminById(params), params);
        return resp;
      },
      key: GET_ADMIN_BY_ID,
    },
    callbacks
  );
}

function* addRoleForAdmin(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const resp = yield call((params) => rf.getRequest('AccountRequest').addRoleForAdmin(params), params);
        return resp;
      },
      key: ADD_ROLE_FOR_ADMIN,
    },
    callbacks
  );
}

function* changePass(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const resp = yield call((params) => rf.getRequest('AccountRequest').changePass(params), params);
        return resp;
      },
      key: CHANGE_PASS,
    },
    callbacks
  );
}

function* watchAccount() {
  yield takeLatest(LOGIN, login);
  yield takeLatest(GET_ACCOUNT, getAccount);
  yield takeLatest(UPDATE_ADMIN_STATUS, updateAdminStatus);
  yield takeLatest(UPDATE_ADMIN_INFO, updateAdminInfo);
  yield takeLatest(GET_AUTH, getAuth);
  yield takeLatest(CREATE_ADMIN, createAccount);
  yield takeLatest(GET_ADMIN_BY_ID, getAdminById);
  yield takeLatest(ADD_ROLE_FOR_ADMIN, addRoleForAdmin);
  yield takeLatest(CHANGE_PASS, changePass);
}

export default function* rootSaga() {
  yield all([fork(watchAccount)]);
}
