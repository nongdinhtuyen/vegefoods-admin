import { createAction } from '@reduxjs/toolkit';

export const GET_EXPORT_WAREHOUSE = 'GET_EXPORT_WAREHOUSE';
export const GET_IMPORT_WAREHOUSE = 'GET_IMPORT_WAREHOUSE';
export const GET_IMPORT_WAREHOUSE_BY_ID = 'GET_IMPORT_WAREHOUSE_BY_ID';
export const GET_EXPORT_WAREHOUSE_BY_ID = 'GET_EXPORT_WAREHOUSE_BY_ID';
export const CREATE_IMPORT_WAREHOUSE = 'CREATE_IMPORT_WAREHOUSE';
export const ACCEPT_IMPORT_WAREHOUSE = 'ACCEPT_IMPORT_WAREHOUSE';
export const IMPORT_EXCEL = 'IMPORT_EXCEL';

export default {
  actionGetExportWarehouse: createAction<ActionPayloadStandard>(GET_EXPORT_WAREHOUSE),
  actionGetImportWarehouse: createAction<ActionPayloadStandard>(GET_IMPORT_WAREHOUSE),
  actionGetImportWarehouseById: createAction<ActionPayloadStandard>(GET_IMPORT_WAREHOUSE_BY_ID),
  actionGetExportWarehouseById: createAction<ActionPayloadStandard>(GET_EXPORT_WAREHOUSE_BY_ID),
  actionCreateImportWarehouse: createAction<ActionPayloadStandard>(CREATE_IMPORT_WAREHOUSE),
  actionAcceptImportWarehouse: createAction<ActionPayloadStandard>(ACCEPT_IMPORT_WAREHOUSE),
  actionImportExcel: createAction<ActionPayloadStandard>(IMPORT_EXCEL),
};
