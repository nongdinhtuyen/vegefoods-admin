import rf from '../../requests/RequestFactory';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import {
  ACCEPT_IMPORT_WAREHOUSE,
  CREATE_IMPORT_WAREHOUSE,
  GET_EXPORT_WAREHOUSE,
  GET_IMPORT_WAREHOUSE,
  GET_IMPORT_WAREHOUSE_BY_ID,
} from 'redux/actions/warehouse';
import { unfoldSaga } from 'redux/redux_helper';

function* getExportWarehouse(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('WarehouseRequest').getExportWarehouse(params), params);
        return data;
      },
      key: GET_EXPORT_WAREHOUSE,
    },
    callbacks
  );
}

function* getImportWarehouse(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('WarehouseRequest').getImportWarehouse(params), params);
        return data;
      },
      key: GET_IMPORT_WAREHOUSE,
    },
    callbacks
  );
}

function* getImportWarehouseById(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('WarehouseRequest').getImportWarehouseById(params), params);
        return data;
      },
      key: GET_IMPORT_WAREHOUSE_BY_ID,
    },
    callbacks
  );
}

function* createImportWarehouse(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('WarehouseRequest').createImportWarehouse(params), params);
        return data;
      },
      key: CREATE_IMPORT_WAREHOUSE,
    },
    callbacks
  );
}

function* acceptImportWarehouseById(action) {
  const { params, callbacks } = action.payload;
  yield unfoldSaga(
    {
      *handler() {
        const data = yield call((params) => rf.getRequest('WarehouseRequest').acceptImportWarehouseById(params), params);
        return data;
      },
      key: ACCEPT_IMPORT_WAREHOUSE,
    },
    callbacks
  );
}

function* watchRank() {
  yield takeLatest(GET_EXPORT_WAREHOUSE, getExportWarehouse);
  yield takeLatest(GET_IMPORT_WAREHOUSE_BY_ID, getImportWarehouseById);
  yield takeLatest(GET_IMPORT_WAREHOUSE, getImportWarehouse);
  yield takeLatest(CREATE_IMPORT_WAREHOUSE, createImportWarehouse);
  yield takeLatest(ACCEPT_IMPORT_WAREHOUSE, acceptImportWarehouseById);
}

export default function* rootSaga() {
  yield all([fork(watchRank)]);
}
