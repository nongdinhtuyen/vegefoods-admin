import { INIT } from './actions/init';
import rootReducers from './root_reducers';
import rootSaga from './root_saga';
import createSagaMiddleware from '@redux-saga/core';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducers,
  devTools: true,
  middleware: (getDefaultMiddleware: any) => [
    ...getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
      // serializableCheck: {
      //   ignoredActions: ignoredActions,
      // },
    }),
    sagaMiddleware,
  ],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

sagaMiddleware.run(rootSaga);

store.dispatch({
  type: INIT,
});

export default store;
