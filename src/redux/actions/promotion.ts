import { createAction } from '@reduxjs/toolkit';

export const GET_PROMOTION = 'GET_PROMOTION';
export const UPDATE_PROMOTION = 'UPDATE_PROMOTION';
export const CREATE_PROMOTION = 'CREATE_PROMOTION';

export default {
  actionGetPromotion: createAction<ActionPayloadStandard>(GET_PROMOTION),
  actionCreatePromotion: createAction<ActionPayloadStandard>(CREATE_PROMOTION),
  actionUpdatePromotion: createAction<ActionPayloadStandard>(UPDATE_PROMOTION),
};
