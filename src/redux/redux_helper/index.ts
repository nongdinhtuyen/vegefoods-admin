/* eslint-disable max-len */

/* eslint-disable no-undef */
import { call, put } from '@redux-saga/core/effects';
import { createAction } from '@reduxjs/toolkit';

import noop from 'lodash/noop';

/**
 * Create an action for real life usage inside or even outside of a component
 *
 * @param {string} type
 *
 * @example <caption>Inside of a component</caption>
 * const queryPosts = createAction('QUERY_POSTS');
 *
 * this.props.dispatch(
 *   queryPosts(
 *     {
 *       category: 'HOT',
 *     },
 *     {
 *       onBeginning: () => {
 *         // Do something before the query
 *         this.setState({ isLoading: true });
 *       }
 *       onFailure: (error) => {
 *         // Do something in case of caught error
 *       }
 *       onSuccess: (posts) => {
 *         // Do something after the query succeeded
 *       }
 *       onFinished: () => {
 *         // Do something after everything is done
 *         this.setState({ isLoading: false });
 *       }
 *     },
 *   ),
 * );
 *
 */

export function createActionTypeOnBeginning(key) {
  return createAction(`${key.toString()}_BEGAN`);
}

export function createActionTypeOnSuccess(key) {
  return createAction(`${key.toString()}_SUCCEEDED`);
}

export function createActionTypeOnFailure(key) {
  return createAction(`${key.toString()}_FAILED`);
}

export function createActionTypeOnFinish(key) {
  return createAction(`${key.toString()}_FINISHED`);
}

/**
 * Common saga helper that unifies handling side effects into only one standard form
 *
 * @param {UnfoldSagaHandlerType} body
 * @param {Function} body.handler Main handler function. Its returned value will become onSuccess callback param
 * @param {string} body.key Action type
 * @param {UnfoldSagaCallbacksType} callbacks
 * @param {Function} callbacks.onBeginning This callback will be called after onBeginning action is dispatched.
 * @param {Function} callbacks.onFailure This callback will be called after onFailure action is dispatched. It will only be called in case of error.
 * @param {Function} callbacks.onFinish This callback will be called after onFinish action is dispatched.
 * @param {Function} callbacks.onSuccess This callback will be called after onSuccess action is dispatched. It will not be called in case of error.
 * @param {UnfoldSagaOptionsType} options
 * @param {boolean} options.stateless This ensures if redux actions will be triggered
 * @returns {Saga<void>}
 *
 * @example
 * function* takeQueryPosts({ payload: { category } }) {
 *   yield unfoldSaga({
 *     handler: async () => {
 *       const posts = await queryPosts({ category });
 *       return posts;
 *     },
 *     key: 'QUERY_POSTS',
 *   });
 * }
 *
 * @example
 * function* takeQueryCategories({ payload: { category } }) {
 *   yield unfoldSaga({
 *     *handler() => {
 *       const categories = yield call(queryPosts, { category });
 *       return categories;
 *     },
 *     key: 'QUERY_CATEGORIES',
 *   });
 * }
 *
 * function* defaultSaga() {
 *   yield takeLatest('QUERY_POSTS', takeQueryPosts);
 *   yield takeLatest('QUERY_CATEGORIES, takeQueryCategories);
 * }
 */
export function* unfoldSaga({ handler, key }, callbacks = {}, options = {}) {
  let data;
  const defaultCallbacks = {
    onBeginning: noop,
    onFailure: noop,
    onFinish: noop,
    onSuccess: noop,
  };
  const defaultOptions = {
    stateless: false,
  };

  Object.assign(defaultCallbacks, callbacks);
  Object.assign(defaultOptions, options);

  try {
    if (defaultOptions.stateless === false) yield put(createActionTypeOnBeginning(key));
    yield call(defaultCallbacks.onBeginning);
    if (['GeneratorFunction', 'AsyncGeneratorFunction'].includes(handler.constructor.name)) {
      data = yield* handler();
    } else {
      data = yield call(handler);
    }
    if (defaultOptions.stateless === false) yield put(createActionTypeOnSuccess(key)(data));
    yield call(defaultCallbacks.onSuccess, data);
  } catch (error: any) {
    console.log('~error: ', error);
    if (defaultOptions.stateless === false) yield put(createActionTypeOnFailure(key)(error));
    yield call(defaultCallbacks.onFailure, error);
  } finally {
    if (defaultOptions.stateless === false) yield put(createActionTypeOnFinish(key));
    yield call(defaultCallbacks.onFinish);
  }

  return data;
}
