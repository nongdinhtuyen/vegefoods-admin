import { createAction } from '@reduxjs/toolkit';

export const GET_PROVIDER = 'GET_PROVIDER';
export const UPDATE_PROVIDER = 'UPDATE_PROVIDER';
export const CREATE_PROVIDER = 'CREATE_PROVIDER';
export const DELETE_PROVIDER = 'DELETE_PROVIDER';

export default {
  actionGetProvider: createAction<ActionPayloadStandard>(GET_PROVIDER),
  actionUpdateProvider: createAction<ActionPayloadStandard>(UPDATE_PROVIDER),
  actionCreateProvider: createAction<ActionPayloadStandard>(CREATE_PROVIDER),
  actionDeleteProvider: createAction<ActionPayloadStandard>(DELETE_PROVIDER),
};
