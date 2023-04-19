import { createAction } from '@reduxjs/toolkit';

export const GET_PRODUCT = 'GET_PRODUCT';
export const GET_PRODUCT_TYPE = 'GET_PRODUCT_TYPE';
export const UPDATE_PRODUCT_TYPE = 'UPDATE_PRODUCT_TYPE';

export const GET_PRODUCT_BY_ID = 'GET_PRODUCT_BY_ID';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const GET_PRODUCT_IMAGE_BY_ID = 'GET_PRODUCT_IMAGE_BY_ID';
export const UPDATE_PRODUCT_BY_ID = 'UPDATE_PRODUCT_BY_ID';

export default {
  actionGetProduct: createAction<ActionPayloadStandard>(GET_PRODUCT),
  actionGetProductType: createAction<ActionPayloadStandard>(GET_PRODUCT_TYPE),
  actionUpdateProductType: createAction<ActionPayloadStandard>(UPDATE_PRODUCT_TYPE),
  actionUpdateProductById: createAction<ActionPayloadStandard>(UPDATE_PRODUCT_BY_ID),
  actionGetProductById: createAction<ActionPayloadStandard>(GET_PRODUCT_BY_ID),
  actionGetProductImageById: createAction<ActionPayloadStandard>(GET_PRODUCT_IMAGE_BY_ID),
  actionCreateProduct: createAction<ActionPayloadStandard>(CREATE_PRODUCT),
};
