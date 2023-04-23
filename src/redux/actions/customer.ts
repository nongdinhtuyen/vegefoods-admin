import { createAction } from '@reduxjs/toolkit';

export const GET_CUSTOMER = 'GET_CUSTOMER';
export const GET_CUSTOMER_STATICS = 'GET_CUSTOMER_STATICS';
export const GET_CUSTOMER_ADDRESS = 'GET_CUSTOMER_ADDRESS';
export const UPDATE_CUSTOMER_STATUS = 'UPDATE_CUSTOMER_ADDRESS';

export default {
  actionGetCustomer: createAction<ActionPayloadStandard>(GET_CUSTOMER),
  actionGetCustomerStatics: createAction<ActionPayloadStandard>(GET_CUSTOMER_STATICS),
  actionGetCustomerAddress: createAction<ActionPayloadStandard>(GET_CUSTOMER_ADDRESS),
  actionUpdateCustomerStatus: createAction<ActionPayloadStandard>(UPDATE_CUSTOMER_STATUS),
};
