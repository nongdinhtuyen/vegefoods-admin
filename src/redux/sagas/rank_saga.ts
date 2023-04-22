import rf from '../../requests/RequestFactory';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { GET_RANK, UPDATE_RANK } from 'redux/actions/rank';
import { unfoldSaga } from 'redux/redux_helper';

function* getRank(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('RankRequest').getRank(params), params);
        return data;
      },
      key: GET_RANK,
    },
    callbacks
  );
}

function* updateRank(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('RankRequest').updateRank(params), params);
        return data;
      },
      key: UPDATE_RANK,
    },
    callbacks
  );
}

function* watchRank() {
  yield takeLatest(GET_RANK, getRank);
  yield takeLatest(UPDATE_RANK, updateRank);
}

export default function* rootSaga() {
  yield all([fork(watchRank)]);
}
