import { BASEURL } from '../../bootstrap';
import rf from '../../requests/RequestFactory';
import { GET_USER_INFO, LOGIN, LOGOUT, REGISTER, UPDATE_PROFILE } from '../actions/account';
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

function* watchAccount() {
  yield takeLatest(LOGIN, login);
}

export default function* rootSaga() {
  yield all([fork(watchAccount)]);
}
