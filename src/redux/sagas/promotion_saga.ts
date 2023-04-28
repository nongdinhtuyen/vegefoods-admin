import rf from '../../requests/RequestFactory';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { CREATE_PROMOTION, GET_PROMOTION, UPDATE_PROMOTION } from 'redux/actions/promotion';
import { unfoldSaga } from 'redux/redux_helper';

function* getPromotion(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('PromotionRequest').getPromotion(params), params);
        return data;
      },
      key: GET_PROMOTION,
    },
    callbacks
  );
}

function* updatePromotion(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('PromotionRequest').updatePromotion(params), params);
        return data;
      },
      key: UPDATE_PROMOTION,
    },
    callbacks
  );
}

function* createPromotion(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('PromotionRequest').createPromotion(params), params);
        return data;
      },
      key: CREATE_PROMOTION,
    },
    callbacks
  );
}

function* watchRank() {
  yield takeLatest(GET_PROMOTION, getPromotion);
  yield takeLatest(UPDATE_PROMOTION, updatePromotion);
  yield takeLatest(CREATE_PROMOTION, createPromotion);
}

export default function* rootSaga() {
  yield all([fork(watchRank)]);
}
