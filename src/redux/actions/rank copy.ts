import { createAction } from '@reduxjs/toolkit';

export const GET_RANK = 'GET_RANK';
export const UPDATE_RANK = 'UPDATE_RANK';

export default {
  actionGetRank: createAction<ActionPayloadStandard>(GET_RANK),
  actionUpdateRank: createAction<ActionPayloadStandard>(UPDATE_RANK),
};
