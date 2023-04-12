import rf from '../../requests/RequestFactory';
import { LOGIN } from '../actions/account';
import initActions from '../actions/init';
import utils from 'common/utils';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { INIT } from 'redux/actions/init';
import { createActionTypeOnSuccess } from 'redux/redux_helper';

import _ from 'lodash';

function* init() {
  if (!_.isEmpty(utils.getSessionJSON())) {
    try {
      const { token, id } = utils.getSessionJSON();
      window.axios.defaults.headers.common['apikey'] = token;
      yield saveMasterData(id);
    } catch (err) {
      yield put(initActions.actionInitSucceed({}));
      console.log('=======', err);
    }
  } else {
    yield put(initActions.actionInitSucceed({}));
  }
}

export function* saveMasterData(id) {
  // const resp = yield call((params) => rf.getRequest('AccountRequest').getUserInfo(params), id);
  yield put(createActionTypeOnSuccess(LOGIN)());
  // yield put(cartActions.actionGetCart({}));
  yield put(initActions.actionInitSucceed({}));
}

function* watchInit() {
  yield takeLatest(INIT, init);
}

export default function* rootSaga() {
  yield all([fork(watchInit)]);
}
