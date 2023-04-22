import { createAction } from '@reduxjs/toolkit';

export const GET_PROVIDER = 'GET_PROVIDER';
export const UPDATE_PROVIDER = 'UPDATE_PROVIDER';
export const CREATE_PROVIDER = 'CREATE_PROVIDER';
export const DELETE_PROVIDER = 'DELETE_PROVIDER';
export const ADD_PRODUCT_OF_PROVIDER = 'ADD_PRODUCT_OF_PROVIDER';
export const GET_PRODUCT_OF_PROVIDER = 'GET_PRODUCT_OF_PROVIDER';

export default {
  actionGetProvider: createAction<ActionPayloadStandard>(GET_PROVIDER),
  actionUpdateProvider: createAction<ActionPayloadStandard>(UPDATE_PROVIDER),
  actionCreateProvider: createAction<ActionPayloadStandard>(CREATE_PROVIDER),
  actionDeleteProvider: createAction<ActionPayloadStandard>(DELETE_PROVIDER),
  actionAddProductOfProvider: createAction<ActionPayloadStandard>(ADD_PRODUCT_OF_PROVIDER),
  actionGetProductOfProvider: createAction<ActionPayloadStandard>(GET_PRODUCT_OF_PROVIDER),
};
