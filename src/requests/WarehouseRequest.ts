import BaseRequest from './BaseRequest';

const prefix = 'warehouse';
export default class WarehouseRequest extends BaseRequest {
  getExportWarehouse(params) {
    const url = `${prefix}/export`;
    return this.get(url, params);
  }
  getImportWarehouse(params) {
    const url = `${prefix}/import`;
    return this.get(url, params);
  }
  getImportWarehouseById(params) {
    const url = `${prefix}/import/${params.id}`;
    return this.get(url, params);
  }
  createImportWarehouse(params) {
    const url = `${prefix}/import/${params.id}`;
    return this.post(url, params);
  }
  acceptImportWarehouseById(params) {
    const url = `${prefix}/import/${params.id}`;
    return this.post(url, params);
  }
}
