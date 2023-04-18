import { createAction } from '@reduxjs/toolkit';

export const GET_PRODUCT = 'GET_PRODUCT';
export const GET_PRODUCT_TYPE = 'GET_PRODUCT_TYPE';
export const UPDATE_PRODUCT_TYPE = 'UPDATE_PRODUCT_TYPE';

export default {
  actionGetProduct: createAction<ActionPayloadStandard>(GET_PRODUCT),
  actionGetProductType: createAction<ActionPayloadStandard>(GET_PRODUCT_TYPE),
  actionUpdateProductType: createAction<ActionPayloadStandard>(UPDATE_PRODUCT_TYPE),
};
