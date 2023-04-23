import { createAction } from '@reduxjs/toolkit';

export const GET_RECEIPT = 'GET_RECEIPT';
export const RECEIPT_FINANCIAL = 'RECEIPT_FINANCIAL';
export const RECEIPT_ORDER = 'RECEIPT_ORDER';
export const RECEIPT_WAREHOUSE = 'RECEIPT_WAREHOUSE';
export const UPDATE_RECEIPT = 'UPDATE_RECEIPT';

export default {
  actionGetReceipt: createAction<ActionPayloadStandard>(GET_RECEIPT),
  actionReceiptFinancial: createAction<ActionPayloadStandard>(RECEIPT_FINANCIAL),
  actionReceiptOrder: createAction<ActionPayloadStandard>(RECEIPT_ORDER),
  actionReceiptWarehouse: createAction<ActionPayloadStandard>(RECEIPT_WAREHOUSE),
  actionUpdateReceipt: createAction<ActionPayloadStandard>(UPDATE_RECEIPT),
};
